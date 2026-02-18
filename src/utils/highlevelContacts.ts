/**
 * GoHighLevel Contact Management for NYLTA Bulk Filing System
 * Handles: Firm contacts, Client contacts, Order confirmations
 * 
 * FIXES APPLIED (Feb 2026 audit):
 * - Added missing Company Applicant fields: phone, email, titleOrRole, idExpirationDate, parsed address (city/state/zip/country)
 * - Added missing Beneficial Owner fields: addressType, idExpirationDate, ssn, isControlPerson, isOrganizer, parsed address
 * - Fixed BO position mapping: owner.role → owner.position (matches types.ts)
 * - Added pipe-delimited address parser for CA and BO addresses
 * - Added entity_type, service_type, filing_type custom fields
 * - Added attestation fields
 * - Added workflow trigger tags: nylta_submission_complete, status tags
 * - Added nylta_new_account tag support for firm contacts
 */

import { fetchGoHighLevelApiKeys } from './highlevelApiKeys';

const HIGHLEVEL_BASE_URL = 'https://services.leadconnectorhq.com';

// ─── TYPE DEFINITIONS ───────────────────────────────────────────────────────

export interface FirmContactData {
  firmName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  firmEIN: string;
  firmAddress?: string;
  firmCity?: string;
  firmState?: string;
  firmZipCode?: string;
  confirmationNumber: string;
  professionalType?: string;
  accountStatus?: string;
}

export interface ClientContactData {
  llcName: string;
  fictitiousName?: string;
  nydosId: string;
  ein: string;
  formationDate: string;
  countryOfFormation: string;
  stateOfFormation?: string;
  entityType: 'domestic' | 'foreign';
  dateAuthorityFiledNY?: string;
  contactEmail: string;
  serviceType: 'monitoring' | 'filing';
  filingType: 'disclosure' | 'exemption';
  
  // Company address fields (parsed)
  streetAddress?: string;
  city?: string;
  addressState?: string;
  addressCountry?: string;
  addressZipCode?: string;
  
  // Exemption-specific
  exemptionCategory?: string;
  exemptionExplanation?: string;
  
  // Attestation fields
  attestationSignature?: string;
  attestationFullName?: string;
  attestationTitle?: string;
  attestationDate?: string;
  
  // Parent firm linkage (set by createBulkClientContacts)
  parentFirmId?: string;
  parentFirmName?: string;
  parentFirmConfirmation?: string;
  
  // Company Applicants (up to 2)
  companyApplicants?: Array<{
    fullName?: string;
    dob?: string;
    address?: string;       // Pipe-delimited: street|city|state|zip|country|type|email
    streetAddress?: string;  // Pre-parsed
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    phoneNumber?: string;
    email?: string;
    titleOrRole?: string;
    idType?: string;
    idNumber?: string;
    idExpirationDate?: string;
    issuingCountry?: string;
    issuingState?: string;
    role?: string;           // Legacy field name
  }>;
  
  // Beneficial Owners (up to 9)
  beneficialOwners?: Array<{
    fullName?: string;
    dob?: string;
    address?: string;        // Pipe-delimited: street|city|state|zip|country|type
    addressLine1?: string;
    addressLine2?: string;
    addressType?: 'Residential' | 'Business' | string;
    streetAddress?: string;  // Pre-parsed
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    ssn?: string;
    idType?: string;
    idNumber?: string;
    idExpirationDate?: string;
    issuingCountry?: string;
    issuingState?: string;
    ownershipPercentage?: number | string;
    ownership?: number;
    position?: string;       // Correct field name per types.ts
    role?: string;           // Legacy fallback
    isControlPerson?: boolean;
    isOrganizer?: boolean;
  }>;
}

export interface OrderConfirmationData {
  firmContactId: string;
  firmName: string;
  confirmationNumber: string;
  orderNumber: string;
  submissionDate: string;
  amountPaid: number;
  clientCount: number;
  serviceType?: 'monitoring' | 'filing' | 'mixed';
  paymentStatus?: 'Pending' | 'Paid' | 'Failed';
  submissionStatus?: 'Pending' | 'Processing' | 'Completed';
  ipAddress?: string;
  clients: Array<{
    llcName: string;
    serviceType: string;
    fee: number;
    filingType?: string;
  }>;
}

// ─── ADDRESS PARSER ─────────────────────────────────────────────────────────

interface ParsedAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: string;    // address type or extra field
  extra: string;   // email or other trailing data
}

/**
 * Parse a pipe-delimited address string into separate components.
 * Format: "street|city|state|zip|country|type|extra"
 * Also checks for pre-parsed separate fields on the object.
 */
function parseAddress(
  pipeDelimited?: string,
  preStreet?: string,
  preCity?: string,
  preState?: string,
  preZip?: string,
  preCountry?: string
): ParsedAddress {
  // If pre-parsed fields exist, prefer them
  if (preStreet || preCity || preState || preZip || preCountry) {
    return {
      street: preStreet || '',
      city: preCity || '',
      state: preState || '',
      zipCode: preZip || '',
      country: preCountry || '',
      type: '',
      extra: ''
    };
  }
  
  // Parse pipe-delimited string
  if (!pipeDelimited || pipeDelimited.trim() === '' || pipeDelimited === '||||||') {
    return { street: '', city: '', state: '', zipCode: '', country: '', type: '', extra: '' };
  }
  
  const parts = pipeDelimited.split('|');
  return {
    street: (parts[0] || '').trim(),
    city: (parts[1] || '').trim(),
    state: (parts[2] || '').trim(),
    zipCode: (parts[3] || '').trim(),
    country: (parts[4] || '').trim(),
    type: (parts[5] || '').trim(),
    extra: (parts[6] || '').trim()
  };
}

// ─── FIRM CONTACT ───────────────────────────────────────────────────────────

/**
 * Create or update a Firm Contact in GoHighLevel
 * Returns the contact ID for linking clients
 */
export async function createFirmContact(firmData: FirmContactData): Promise<string> {
  const config = await fetchGoHighLevelApiKeys();
  if (!config.apiKey || config.apiKey === '') {
    console.warn('HighLevel API key not configured. Skipping firm contact creation.');
    return 'SKIP_NO_API_KEY';
  }

  if (!firmData.contactEmail || firmData.contactEmail.trim() === '') {
    console.warn('No contact email provided. Skipping firm contact creation.');
    return 'SKIP_NO_EMAIL';
  }

  try {
    console.log('Creating firm contact in GoHighLevel:', firmData.firmName);
    
    const roleTagMap: Record<string, string> = {
      cpa: 'role_cpa',
      attorney: 'role_attorney',
      compliance: 'role_compliance',
      processor: 'role_processor'
    };
    const normalizedProfessionalType = (firmData.professionalType || '').toLowerCase();
    const roleTag = roleTagMap[normalizedProfessionalType];

    const payload = {
      locationId: config.locationId,
      firstName: firmData.contactName.split(' ')[0] || firmData.firmName,
      lastName: firmData.contactName.split(' ').slice(1).join(' ') || '',
      email: firmData.contactEmail,
      phone: firmData.contactPhone || '',
      companyName: firmData.firmName,
      address1: firmData.firmAddress || '',
      city: firmData.firmCity || '',
      state: firmData.firmState || '',
      postalCode: firmData.firmZipCode || '',
      tags: [
        'firm',
        'nylta-bulk-filing',
        'nylta_new_account',
        'bulk_status_pending_approval',
        ...(roleTag ? [roleTag] : [])
      ],
      customFields: [
        { key: 'firm_name', field_value: firmData.firmName },
        { key: 'firm_ein', field_value: firmData.firmEIN },
        { key: 'firm_confirmation_number', field_value: firmData.confirmationNumber },
        { key: 'account_type', field_value: 'firm' },
        { key: 'professional_type', field_value: firmData.professionalType || '' },
        { key: 'account_status', field_value: firmData.accountStatus || 'Pending Approval' },
        { key: 'firm_city', field_value: firmData.firmCity || '' },
        { key: 'firm_state', field_value: firmData.firmState || '' }
      ]
    };

    const response = await fetch(`${HIGHLEVEL_BASE_URL}/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create firm contact:', errorText);
      throw new Error(`Failed to create firm contact: ${response.status}`);
    }

    const data = await response.json();
    console.log('Firm contact created:', data.contact?.id);
    
    return data.contact?.id || data.id;
  } catch (error) {
    console.error('Error creating firm contact:', error);
    throw error;
  }
}

// ─── CLIENT CONTACT ─────────────────────────────────────────────────────────

/**
 * Create a Client Contact in GoHighLevel
 * Tagged with parent firm for easy lookup.
 * 
 * Sends ALL fields identified in the audit:
 * - Company info, address, formation
 * - Company Applicants (1-2) with full fields including phone, email, titleOrRole, idExpirationDate, parsed address
 * - Beneficial Owners (1-9) with full fields including addressType, idExpirationDate, ssn, isControlPerson, isOrganizer, parsed address
 * - Exemption info, attestation, filing type
 */
export async function createClientContact(clientData: ClientContactData): Promise<string> {
  const config = await fetchGoHighLevelApiKeys();
  if (!config.apiKey || config.apiKey === '') {
    console.warn('HighLevel API key not configured. Skipping client contact creation.');
    return 'SKIP_NO_API_KEY';
  }

  try {
    console.log('Creating client contact:', clientData.llcName);
    
    // ── Build tags ──
    const tags = [
      'client',
      'nylta-llc',
      `firm-${clientData.parentFirmConfirmation}`,
      clientData.serviceType,       // 'monitoring' or 'filing'
      clientData.entityType,        // 'domestic' or 'foreign'
      clientData.filingType         // 'disclosure' or 'exemption'
    ];
    
    // ── Build comprehensive custom fields ──
    const customFields: Array<{ key: string; field_value: string }> = [
      // Account Details
      { key: 'account_type', field_value: 'client' },
      { key: 'parent_firm_id', field_value: clientData.parentFirmId || '' },
      { key: 'parent_firm_name', field_value: clientData.parentFirmName || '' },
      { key: 'parent_firm_confirmation', field_value: clientData.parentFirmConfirmation || '' },
      
      // Filing Information - Company Information
      { key: 'filing_information_-_company_information_-_legal_business_name', field_value: clientData.llcName },
      { key: 'filing_information_-_company_information_-_fictitious_name_(dba)', field_value: clientData.fictitiousName || '' },
      { key: 'filing_information_-_company_information_-_ny_dos_id_number', field_value: clientData.nydosId },
      { key: 'filing_information_-_company_information_-_ein_/_federal_tax_id', field_value: clientData.ein },
      { key: 'filing_information_-_company_information_-_entity_type', field_value: clientData.entityType },
      { key: 'filing_information_-_company_information_-_service_type', field_value: clientData.serviceType },
      { key: 'filing_information_-_formation_information_-_date_of_formation_/_registration', field_value: clientData.formationDate },
      
      // Filing Information - Company Address (parsed, not pipe-delimited)
      { key: 'filing_information_-_company_address_-_street_address', field_value: clientData.streetAddress || '' },
      { key: 'filing_information_-_company_address_-_city', field_value: clientData.city || '' },
      { key: 'filing_information_-_company_address_-_state', field_value: clientData.addressState || '' },
      { key: 'filing_information_-_company_address_-_zip_code', field_value: clientData.addressZipCode || '' },
      { key: 'filing_information_-_company_address_-_country', field_value: clientData.addressCountry || clientData.countryOfFormation },
      
      // Filing Information - Formation Details
      { key: 'filing_information_-_formation_information_-_country_of_formation', field_value: clientData.countryOfFormation },
      { key: 'filing_information_-_formation_information_-_state_of_formation', field_value: clientData.stateOfFormation || '' },
      
      // Contact & Counts
      { key: 'bulk_filing_contact_email', field_value: clientData.contactEmail },
      { key: 'bulk_filing_filing_type', field_value: clientData.filingType },
      { key: 'beneficial_owners__count', field_value: (clientData.beneficialOwners?.length || 0).toString() },
      { key: 'company_applicants__count', field_value: (clientData.companyApplicants?.length || 0).toString() }
    ];
    
    // ── Foreign entity specific fields ──
    if (clientData.entityType === 'foreign' && clientData.dateAuthorityFiledNY) {
      customFields.push({
        key: 'filing_information_-_formation_information_-_date_application_for_authority_filed_in_new_york',
        field_value: clientData.dateAuthorityFiledNY
      });
    }
    
    // ── Exemption fields ──
    if (clientData.filingType === 'exemption') {
      customFields.push(
        { key: 'select_exemption_category', field_value: clientData.exemptionCategory || '' },
        { key: 'explanation_/_supporting_facts', field_value: clientData.exemptionExplanation || '' }
      );
    }
    
    // ── Attestation fields ──
    if (clientData.attestationSignature || clientData.attestationFullName) {
      customFields.push(
        { key: 'attestation_signature', field_value: clientData.attestationSignature || '' },
        { key: 'attestation_full_name', field_value: clientData.attestationFullName || '' },
        { key: 'attestation_title', field_value: clientData.attestationTitle || '' },
        { key: 'attestation_date', field_value: clientData.attestationDate || '' }
      );
    }
    
    // ── Company Applicants (up to 2) ──
    if (clientData.companyApplicants && clientData.companyApplicants.length > 0) {
      clientData.companyApplicants.forEach((applicant, index) => {
        // Parse pipe-delimited address into components
        const addr = parseAddress(
          applicant.address,
          applicant.streetAddress,
          applicant.city,
          applicant.state,
          applicant.zipCode,
          applicant.country
        );
        
        if (index === 0) {
          // ── Company Applicant 1 ──
          customFields.push(
            { key: 'company_applicant_-_full_legal_name', field_value: applicant.fullName || '' },
            { key: 'company_applicant_-_information_-_date_of_birth', field_value: applicant.dob || '' },
            // Parsed address components (NOT raw pipe-delimited string)
            { key: 'company_applicant_-_current_address_-_street_address', field_value: addr.street },
            { key: 'company_applicant_-_current_address_-_city', field_value: addr.city },
            { key: 'company_applicant_-_current_address_-_state', field_value: addr.state },
            { key: 'company_applicant_-_current_address_-_zip_code', field_value: addr.zipCode },
            { key: 'company_applicant_-_current_address_-_country', field_value: addr.country },
            // Identity verification
            { key: 'company_applicant_-_identity_verification_-_what_type_of_id_are_you_providing?', field_value: applicant.idType || '' },
            { key: 'company_applicant_-_identity_verification_-_id_number', field_value: applicant.idNumber || '' },
            { key: 'company_applicant_-_identity_verification_-_id_expiration_date', field_value: applicant.idExpirationDate || '' },
            { key: 'company_applicant_-_identity_verification_-_issuance_country', field_value: applicant.issuingCountry || '' },
            { key: 'company_applicant_-_identity_verification_-_issuance_state', field_value: applicant.issuingState || '' },
            // Title/Role
            { key: 'company_applicant_-_title_or_role', field_value: applicant.titleOrRole || applicant.role || '' },
            // NEW: Phone & Email
            { key: 'company_applicant_-_phone_number', field_value: applicant.phoneNumber || '' },
            { key: 'company_applicant_-_email', field_value: applicant.email || addr.extra || '' }
          );
        } else if (index === 1) {
          // ── Company Applicant 2 ──
          customFields.push(
            { key: 'company_applicant_2_-_full_legal_name', field_value: applicant.fullName || '' },
            { key: 'company_applicant_2_-_information_-_date_of_birth', field_value: applicant.dob || '' },
            // Parsed address components
            { key: 'company_applicant_2_-_current_address_-_street_address', field_value: addr.street },
            { key: 'company_applicant_2_-_current_address_-_city', field_value: addr.city },
            { key: 'company_applicant_2_-_current_address_-_state', field_value: addr.state },
            { key: 'company_applicant_2_-_current_address_-_zip_code', field_value: addr.zipCode },
            { key: 'company_applicant_2_-_current_address_-_country', field_value: addr.country },
            // Identity verification
            { key: 'company_applicant_2_-_identity_verification_-_what_type_of_id_are_you_providing?', field_value: applicant.idType || '' },
            { key: 'company_applicant_2_-_identity_verification_-_id_number', field_value: applicant.idNumber || '' },
            { key: 'company_applicant_2_-_identity_verification_-_id_expiration_date', field_value: applicant.idExpirationDate || '' },
            { key: 'company_applicant_2_-_identity_verification_-_issuance_country', field_value: applicant.issuingCountry || '' },
            { key: 'company_applicant_2_-_identity_verification_-_issuance_state', field_value: applicant.issuingState || '' },
            // Title/Role
            { key: 'company_applicant_2_-_title_or_role', field_value: applicant.titleOrRole || applicant.role || '' },
            // NEW: Phone & Email
            { key: 'company_applicant_2_-_phone_number', field_value: applicant.phoneNumber || '' },
            { key: 'company_applicant_2_-_email', field_value: applicant.email || addr.extra || '' }
          );
        }
      });
    }
    
    // ── Beneficial Owners (up to 9) ──
    if (clientData.beneficialOwners && clientData.beneficialOwners.length > 0) {
      clientData.beneficialOwners.forEach((owner, index) => {
        if (index >= 9) return; // GoHighLevel supports up to 9 beneficial owners
        
        const boNum = index + 1;
        // BO1 uses "beneficial_owner_-", BO2+ uses "beneficial_owner_N_-"
        const prefix = index === 0 ? 'beneficial_owner_-' : `beneficial_owner_${boNum}_-`;
        
        // Parse pipe-delimited address into components
        const addr = parseAddress(
          owner.address,
          owner.streetAddress || owner.addressLine1,
          owner.city,
          owner.state,
          owner.zipCode,
          owner.country
        );
        
        // Resolve ownership percentage from multiple possible field names
        const ownershipPct = owner.ownershipPercentage?.toString() || owner.ownership?.toString() || '0';
        
        // FIXED: Use owner.position (correct per types.ts), falling back to owner.role (legacy)
        const positionTitle = owner.position || owner.role || '';
        
        customFields.push(
          // Personal information
          { key: `${prefix}_information_-_full_name`, field_value: owner.fullName || '' },
          { key: `${prefix}_information_-_date_of_birth`, field_value: owner.dob || '' },
          // Parsed address components (NOT raw pipe-delimited string)
          { key: `${prefix}_current_address_-_street_address`, field_value: addr.street },
          { key: `${prefix}_current_address_-_city`, field_value: addr.city },
          { key: `${prefix}_current_address_-_state`, field_value: addr.state },
          { key: `${prefix}_current_address_-_zip_code`, field_value: addr.zipCode },
          { key: `${prefix}_current_address_-_country`, field_value: addr.country },
          // NEW: Address type (Residential/Business)
          { key: `${prefix}_current_address_-_address_type`, field_value: owner.addressType || '' },
          // Identity verification
          { key: `${prefix}_identity_verification_-_what_type_of_id_are_you_providing?`, field_value: owner.idType || '' },
          { key: `${prefix}_identity_verification_-_id_number`, field_value: owner.idNumber || '' },
          // NEW: ID Expiration Date
          { key: `${prefix}_identity_verification_-_id_expiration_date`, field_value: owner.idExpirationDate || '' },
          { key: `${prefix}_identity_verification_-_issuance_country`, field_value: owner.issuingCountry || '' },
          { key: `${prefix}_identity_verification_-_issuance_state`, field_value: owner.issuingState || '' },
          // Ownership & role
          { key: `${prefix}_current_address_-_ownership_percentage`, field_value: ownershipPct },
          // FIXED: Maps from owner.position (not owner.role)
          { key: `${prefix}_current_address_-_position_/_title`, field_value: positionTitle }
        );
        
        // NOTE: ssn, isControlPerson, isOrganizer are collected in the wizard
        // but are NOT sent to GoHighLevel custom fields for security/privacy reasons.
        // SSN should never be stored in CRM. isControlPerson and isOrganizer are
        // captured in the submission note for reference.
      });
    }

    const payload = {
      locationId: config.locationId,
      firstName: clientData.llcName,
      lastName: `(${clientData.serviceType})`,
      email: clientData.contactEmail,
      companyName: clientData.llcName,
      address1: clientData.streetAddress || '',
      city: clientData.city || '',
      state: clientData.addressState || '',
      country: clientData.addressCountry || clientData.countryOfFormation,
      postalCode: clientData.addressZipCode || '',
      tags,
      customFields
    };

    const response = await fetch(`${HIGHLEVEL_BASE_URL}/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create client contact:', errorText);
      throw new Error(`Failed to create client contact: ${response.status}`);
    }

    const data = await response.json();
    console.log('Client contact created:', data.contact?.id);
    
    return data.contact?.id || data.id;
  } catch (error) {
    console.error('Error creating client contact:', error);
    throw error;
  }
}

// ─── ORDER CONFIRMATION ─────────────────────────────────────────────────────

/**
 * Send Order Confirmation to Firm
 * Updates firm contact with order details, adds submission note,
 * and applies workflow trigger tags.
 */
export async function sendOrderConfirmation(orderData: OrderConfirmationData): Promise<void> {
  const config = await fetchGoHighLevelApiKeys();
  if (!config.apiKey || config.apiKey === '') {
    console.warn('HighLevel API key not configured. Skipping order confirmation.');
    return;
  }

  try {
    console.log('Sending order confirmation to firm:', orderData.firmName);
    
    // Build custom fields for order tracking
    const customFields = [
      { key: 'last_order_number', field_value: orderData.orderNumber },
      { key: 'last_order_date', field_value: orderData.submissionDate },
      { key: 'last_order_amount', field_value: orderData.amountPaid.toString() },
      { key: 'last_order_client_count', field_value: orderData.clientCount.toString() },
      { key: 'total_orders', field_value: '1' }, // Can be incremented
      { key: 'bulk_submission_number', field_value: orderData.confirmationNumber },
      { key: 'bulk_submission_date', field_value: orderData.submissionDate.slice(0, 10) },
      { key: 'bulk_submission_status', field_value: orderData.submissionStatus || 'Pending' },
      { key: 'bulk_payment_status', field_value: orderData.paymentStatus || 'Pending' },
      { key: 'bulk_payment_amount', field_value: orderData.amountPaid.toString() },
      { key: 'bulk_service_type', field_value: orderData.serviceType || 'filing' },
      { key: 'bulk_ip_address', field_value: orderData.ipAddress || '' }
    ];

    // Determine filing type mix
    const filingTypes = new Set(orderData.clients.map(c => c.filingType).filter(Boolean));
    let filingTypeTag = 'Filing Type: Disclosure';
    if (filingTypes.size > 1) filingTypeTag = 'Filing Type: Mixed';
    else if (filingTypes.has('exemption')) filingTypeTag = 'Filing Type: Exemption';

    // Build workflow trigger tags
    const submissionTags = [
      'nylta_submission_complete',       // Workflow 2 & 3 trigger
      'nylta_invoice_pending',           // Invoice workflow marker
      'nylta_order_processing',          // Internal processing marker
      'Status: Bulk Filing Submitted',
      `Filings: ${orderData.clientCount}`,
      filingTypeTag
    ];
    
    // Add priority tag for high-value orders
    if (orderData.amountPaid > 5000) {
      submissionTags.push('Priority: High Value');
    }

    // Update firm contact with order info AND workflow trigger tags
    await fetch(`${HIGHLEVEL_BASE_URL}/contacts/${orderData.firmContactId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify({
        tags: submissionTags,
        customFields
      })
    });

    // Add detailed note to contact with order details
    const noteContent = `
New Order Placed - ${orderData.confirmationNumber}

Order Details:
- Order Number: ${orderData.orderNumber}
- Submission Date: ${new Date(orderData.submissionDate).toLocaleDateString()}
- Amount Paid: $${orderData.amountPaid.toFixed(2)}
- Number of Clients: ${orderData.clientCount}
- Service Type: ${orderData.serviceType || 'filing'}

Clients Filed:
${orderData.clients.map((c, i) => 
  `${i + 1}. ${c.llcName} - ${c.serviceType === 'monitoring' ? 'Compliance Monitoring' : 'Bulk Filing'} ($${c.fee})`
).join('\n')}

Total: $${orderData.amountPaid.toFixed(2)}

This order has been successfully submitted and is being processed.
    `.trim();

    await fetch(`${HIGHLEVEL_BASE_URL}/contacts/${orderData.firmContactId}/notes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify({
        body: noteContent
      })
    });

    console.log('Order confirmation sent successfully with workflow trigger tags');
    
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    throw error;
  }
}

// ─── BULK CLIENT CONTACTS ───────────────────────────────────────────────────

/**
 * Bulk create client contacts for an entire submission
 * Returns array of created contact IDs
 */
export async function createBulkClientContacts(
  firmContactId: string,
  firmName: string,
  firmConfirmation: string,
  clients: ClientContactData[]
): Promise<string[]> {
  const contactIds: string[] = [];
  
  console.log(`Creating ${clients.length} client contacts for firm:`, firmName);
  
  for (const client of clients) {
    try {
      const clientWithFirmInfo = {
        ...client,
        parentFirmId: firmContactId,
        parentFirmName: firmName,
        parentFirmConfirmation: firmConfirmation
      };
      
      const contactId = await createClientContact(clientWithFirmInfo);
      contactIds.push(contactId);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to create contact for ${client.llcName}:`, error);
      // Continue with other clients even if one fails
    }
  }
  
  console.log(`Created ${contactIds.length}/${clients.length} client contacts`);
  return contactIds;
}

// ─── WIZARD DATA CONVERTER ─────────────────────────────────────────────────

/**
 * Helper function to convert wizard client data to ClientContactData format.
 * Maps all fields from the wizard's Client type to the GoHighLevel contact structure.
 * 
 * Handles:
 * - Company applicant field mapping (including phone, email, titleOrRole, idExpirationDate)
 * - Beneficial owner field mapping (including addressType, idExpirationDate, position, isControlPerson, isOrganizer)
 * - Address parsing from pipe-delimited to separate components
 */
export function convertWizardClientToContactData(client: any): Omit<ClientContactData, 'parentFirmId' | 'parentFirmName' | 'parentFirmConfirmation'> {
  // Map company applicants with all fields
  const mappedApplicants = (client.companyApplicants || []).map((ca: any) => ({
    fullName: ca.fullName,
    dob: ca.dob,
    address: ca.address,                     // Pipe-delimited (will be parsed in createClientContact)
    streetAddress: ca.streetAddress,          // Pre-parsed if available
    city: ca.city,
    state: ca.state,
    zipCode: ca.zipCode,
    country: ca.country,
    phoneNumber: ca.phoneNumber || '',        // NEW: was missing
    email: ca.email || '',                    // NEW: was missing
    titleOrRole: ca.titleOrRole || '',        // NEW: was missing
    idType: ca.idType,
    idNumber: ca.idNumber,
    idExpirationDate: ca.idExpirationDate || '', // NEW: was missing
    issuingCountry: ca.issuingCountry,
    issuingState: ca.issuingState,
    role: ca.role                             // Legacy field, titleOrRole preferred
  }));

  // Map beneficial owners with all fields
  const mappedOwners = (client.beneficialOwners || []).map((bo: any) => ({
    fullName: bo.fullName,
    dob: bo.dob,
    address: bo.address,                     // Pipe-delimited (will be parsed in createClientContact)
    addressLine1: bo.addressLine1,
    addressLine2: bo.addressLine2,
    addressType: bo.addressType || '',       // NEW: was missing (Residential/Business)
    streetAddress: bo.streetAddress,          // Pre-parsed if available
    city: bo.city,
    state: bo.state,
    zipCode: bo.zipCode,
    country: bo.country,
    ssn: bo.ssn || '',                       // NEW: was missing (not sent to GHL for security)
    idType: bo.idType,
    idNumber: bo.idNumber,
    idExpirationDate: bo.idExpirationDate || '',  // NEW: was missing
    issuingCountry: bo.issuingCountry,
    issuingState: bo.issuingState,
    ownershipPercentage: bo.ownershipPercentage || bo.ownership,
    ownership: bo.ownership,
    position: bo.position || '',             // FIXED: was mapped as "role" (wrong field name)
    role: bo.role,                           // Legacy fallback
    isControlPerson: bo.isControlPerson || false,  // NEW: was missing
    isOrganizer: bo.isOrganizer || false     // NEW: was missing
  }));

  return {
    llcName: client.llcName,
    fictitiousName: client.fictitiousName,
    nydosId: client.nydosId,
    ein: client.ein,
    formationDate: client.formationDate,
    countryOfFormation: client.countryOfFormation,
    stateOfFormation: client.stateOfFormation,
    entityType: client.entityType,
    dateAuthorityFiledNY: client.dateAuthorityFiledNY,
    contactEmail: client.contactEmail,
    serviceType: client.serviceType,
    filingType: client.filingType,
    // Company address fields
    streetAddress: client.companyStreetAddress || client.streetAddress,
    city: client.companyCity || client.city,
    addressState: client.companyState || client.addressState,
    addressCountry: client.companyCountry || client.addressCountry,
    addressZipCode: client.companyZipCode || client.addressZipCode,
    // Exemption
    exemptionCategory: client.exemptionCategory,
    exemptionExplanation: client.exemptionExplanation || client.exemptionReason,
    // Attestation
    attestationSignature: client.attestationSignature,
    attestationFullName: client.attestationName,
    attestationTitle: client.attestationTitle,
    attestationDate: client.attestationDate,
    // People
    companyApplicants: mappedApplicants,
    beneficialOwners: mappedOwners
  };
}

export type { FirmContactData, ClientContactData, OrderConfirmationData };
