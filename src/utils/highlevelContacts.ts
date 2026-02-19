/**
 * GoHighLevel Contact Management for NYLTA Bulk Filing System
 * Handles: Firm contacts, Client contacts, Order confirmations
 * 
 * KEY MAPPING UPDATE (Feb 2026 — Maria's simplified GHL keys):
 * - All verbose folder-style keys replaced with simplified keys (e.g. ca1_full_name, bo1_full_name)
 * - Added CA3 support (up to 3 company applicants)
 * - Added attestation_initials field
 * - Added firm_country, firm_street_address, firm_zip_code, contact_name, contact_email, contact_phone
 * - Added ACH payment fields (masked for security)
 * - Added payment_date, batch_id to order tracking
 * - BO prefix simplified: bo1_, bo2_, ..., bo9_ (was beneficial_owner_-_...)
 * - CA prefix simplified: ca1_, ca2_, ca3_ (was company_applicant_-_...)
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
  firmCountry?: string;
  confirmationNumber: string;
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
  attestationInitials?: string;
  attestationTitle?: string;
  attestationDate?: string;
  
  // Parent firm linkage (set by createBulkClientContacts)
  parentFirmId?: string;
  parentFirmName?: string;
  parentFirmConfirmation?: string;
  
  // Company Applicants (up to 3)
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
  paymentDate?: string;
  batchId?: string;
  amountPaid: number;
  clientCount: number;
  serviceType?: 'monitoring' | 'filing' | 'mixed';
  // ACH payment data (only masked values stored in GHL)
  achAccountType?: string;       // 'checking' or 'savings'
  achRoutingLast4?: string;      // Last 4 of routing number
  achAccountLast4?: string;      // Last 4 of account number
  achBillingStreet?: string;
  achBillingCity?: string;
  achBillingState?: string;
  achBillingZip?: string;
  achBillingCountry?: string;
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

// ─── COMPANY APPLICANT FIELD BUILDER ────────────────────────────────────────

/**
 * Build custom fields for a company applicant using Maria's simplified keys.
 * CA1 = ca1_*, CA2 = ca2_*, CA3 = ca3_*
 */
function buildCompanyApplicantFields(
  applicant: NonNullable<ClientContactData['companyApplicants']>[0],
  caNum: number
): Array<{ key: string; field_value: string }> {
  const prefix = `ca${caNum}`;
  
  // Parse pipe-delimited address into components
  const addr = parseAddress(
    applicant.address,
    applicant.streetAddress,
    applicant.city,
    applicant.state,
    applicant.zipCode,
    applicant.country
  );
  
  return [
    { key: `${prefix}_full_name`, field_value: applicant.fullName || '' },
    { key: `${prefix}_dob`, field_value: applicant.dob || '' },
    // Parsed address components
    { key: `${prefix}_street_address`, field_value: addr.street },
    { key: `${prefix}_city`, field_value: addr.city },
    { key: `${prefix}_state`, field_value: addr.state },
    { key: `${prefix}_zip_code`, field_value: addr.zipCode },
    { key: `${prefix}_country`, field_value: addr.country },
    // Identity verification
    { key: `${prefix}_id_type`, field_value: applicant.idType || '' },
    { key: `${prefix}_id_number`, field_value: applicant.idNumber || '' },
    { key: `${prefix}_id_expiration_date`, field_value: applicant.idExpirationDate || '' },
    { key: `${prefix}_issuing_country`, field_value: applicant.issuingCountry || '' },
    { key: `${prefix}_issuing_state`, field_value: applicant.issuingState || '' },
    // Title/Role
    { key: `${prefix}_title_or_role`, field_value: applicant.titleOrRole || applicant.role || '' },
    // Phone & Email
    { key: `${prefix}_phone`, field_value: applicant.phoneNumber || '' },
    { key: `${prefix}_email`, field_value: applicant.email || addr.extra || '' }
  ];
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
      country: firmData.firmCountry || 'United States',
      tags: [
        'firm',
        'nylta-bulk-filing',
        'nylta_new_account'  // Workflow trigger tag for admin approval flow
      ],
      customFields: [
        // Maria's simplified firm field keys
        { key: 'firm_name', field_value: firmData.firmName },
        { key: 'contact_name', field_value: firmData.contactName },
        { key: 'contact_email', field_value: firmData.contactEmail },
        { key: 'contact_phone', field_value: firmData.contactPhone || '' },
        { key: 'firm_ein', field_value: firmData.firmEIN },
        { key: 'firm_street_address', field_value: firmData.firmAddress || '' },
        { key: 'firm_city', field_value: firmData.firmCity || '' },
        { key: 'firm_state', field_value: firmData.firmState || '' },
        { key: 'firm_zip_code', field_value: firmData.firmZipCode || '' },
        { key: 'firm_country', field_value: firmData.firmCountry || 'United States' },
        { key: 'firm_confirmation_number', field_value: firmData.confirmationNumber },
        { key: 'account_type', field_value: 'firm' }
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
 * Uses Maria's simplified GHL field keys:
 * - Company info: llc_legal_name, ein, entity_type, service_type, etc.
 * - Company address: company_street_address, company_city, etc.
 * - Formation: formation_date, country_of_formation, state_of_formation, date_authority_filed_ny
 * - Company Applicants 1-3: ca1_*, ca2_*, ca3_*
 * - Beneficial Owners 1-9: bo1_*, bo2_*, ..., bo9_*
 * - Attestation: attestation_signature, attestation_initials, attestation_title, attestation_date
 * - Exemption: exemption_category, exemption_explanation
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
    
    // ── Build comprehensive custom fields (Maria's simplified keys) ──
    const customFields: Array<{ key: string; field_value: string }> = [
      // Account Details & Parent Firm Linkage
      { key: 'account_type', field_value: 'client' },
      { key: 'parent_firm_id', field_value: clientData.parentFirmId || '' },
      { key: 'parent_firm_name', field_value: clientData.parentFirmName || '' },
      { key: 'parent_firm_confirmation', field_value: clientData.parentFirmConfirmation || '' },
      
      // LLC / Client Information
      { key: 'llc_legal_name', field_value: clientData.llcName },
      { key: 'fictitious_name_dba', field_value: clientData.fictitiousName || '' },
      { key: 'nydos_id', field_value: clientData.nydosId },
      { key: 'ein', field_value: clientData.ein },
      { key: 'entity_type', field_value: clientData.entityType },
      { key: 'service_type', field_value: clientData.serviceType },
      { key: 'formation_date', field_value: clientData.formationDate },
      
      // Company Address
      { key: 'company_street_address', field_value: clientData.streetAddress || '' },
      { key: 'company_city', field_value: clientData.city || '' },
      { key: 'company_state', field_value: clientData.addressState || '' },
      { key: 'company_zip_code', field_value: clientData.addressZipCode || '' },
      { key: 'company_country', field_value: clientData.addressCountry || clientData.countryOfFormation },
      
      // Formation Details
      { key: 'country_of_formation', field_value: clientData.countryOfFormation },
      { key: 'state_of_formation', field_value: clientData.stateOfFormation || '' },
      
      // Contact & Counts
      { key: 'llc_contact_email', field_value: clientData.contactEmail },
      { key: 'filing_type', field_value: clientData.filingType },
      { key: 'beneficial_owners__count', field_value: (clientData.beneficialOwners?.length || 0).toString() },
      { key: 'company_applicants__count', field_value: (clientData.companyApplicants?.length || 0).toString() }
    ];
    
    // ── Foreign entity specific fields ──
    if (clientData.entityType === 'foreign' && clientData.dateAuthorityFiledNY) {
      customFields.push({
        key: 'date_authority_filed_ny',
        field_value: clientData.dateAuthorityFiledNY
      });
    }
    
    // ── Exemption fields ──
    if (clientData.filingType === 'exemption') {
      customFields.push(
        { key: 'exemption_category', field_value: clientData.exemptionCategory || '' },
        { key: 'exemption_explanation', field_value: clientData.exemptionExplanation || '' }
      );
    }
    
    // ── Attestation fields ──
    if (clientData.attestationSignature || clientData.attestationFullName || clientData.attestationInitials) {
      customFields.push(
        { key: 'attestation_signature', field_value: clientData.attestationSignature || '' },
        { key: 'attestation_initials', field_value: clientData.attestationInitials || '' },
        { key: 'attestation_title', field_value: clientData.attestationTitle || '' },
        { key: 'attestation_date', field_value: clientData.attestationDate || '' }
      );
    }
    
    // ── Company Applicants (up to 3) — uses shared builder function ──
    if (clientData.companyApplicants && clientData.companyApplicants.length > 0) {
      clientData.companyApplicants.forEach((applicant, index) => {
        if (index >= 3) return; // Max 3 company applicants
        const caFields = buildCompanyApplicantFields(applicant, index + 1);
        customFields.push(...caFields);
      });
    }
    
    // ── Beneficial Owners (up to 9) — simplified bo1_* through bo9_* keys ──
    if (clientData.beneficialOwners && clientData.beneficialOwners.length > 0) {
      clientData.beneficialOwners.forEach((owner, index) => {
        if (index >= 9) return; // GoHighLevel supports up to 9 beneficial owners
        
        const prefix = `bo${index + 1}`;
        
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
        
        // Use owner.position (correct per types.ts), falling back to owner.role (legacy)
        const positionTitle = owner.position || owner.role || '';
        
        customFields.push(
          // Personal information
          { key: `${prefix}_full_name`, field_value: owner.fullName || '' },
          { key: `${prefix}_dob`, field_value: owner.dob || '' },
          // Parsed address components
          { key: `${prefix}_street_address`, field_value: addr.street },
          { key: `${prefix}_city`, field_value: addr.city },
          { key: `${prefix}_state`, field_value: addr.state },
          { key: `${prefix}_zip_code`, field_value: addr.zipCode },
          { key: `${prefix}_country`, field_value: addr.country },
          // Address type (Residential/Business)
          { key: `${prefix}_address_type`, field_value: owner.addressType || '' },
          // Identity verification
          { key: `${prefix}_id_type`, field_value: owner.idType || '' },
          { key: `${prefix}_id_number`, field_value: owner.idNumber || '' },
          { key: `${prefix}_id_expiration_date`, field_value: owner.idExpirationDate || '' },
          { key: `${prefix}_issuing_country`, field_value: owner.issuingCountry || '' },
          { key: `${prefix}_issuing_state`, field_value: owner.issuingState || '' },
          // Ownership & role
          { key: `${prefix}_ownership_percentage`, field_value: ownershipPct },
          { key: `${prefix}_position_or_title`, field_value: positionTitle }
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
 * 
 * Uses Maria's simplified order tracking keys:
 * order_number, submission_date, payment_date, amount_paid, client_count,
 * batch_id, bulk_service_type, submission_status, payment_status
 * Plus ACH billing info (masked account/routing numbers)
 */
export async function sendOrderConfirmation(orderData: OrderConfirmationData): Promise<void> {
  const config = await fetchGoHighLevelApiKeys();
  if (!config.apiKey || config.apiKey === '') {
    console.warn('HighLevel API key not configured. Skipping order confirmation.');
    return;
  }

  try {
    console.log('Sending order confirmation to firm:', orderData.firmName);
    
    // Build custom fields for order tracking (Maria's simplified keys)
    const customFields: Array<{ key: string; field_value: string }> = [
      { key: 'order_number', field_value: orderData.orderNumber },
      { key: 'submission_date', field_value: orderData.submissionDate },
      { key: 'payment_date', field_value: orderData.paymentDate || orderData.submissionDate },
      { key: 'amount_paid', field_value: orderData.amountPaid.toString() },
      { key: 'client_count', field_value: orderData.clientCount.toString() },
      { key: 'batch_id', field_value: orderData.batchId || orderData.confirmationNumber },
      { key: 'bulk_service_type', field_value: orderData.serviceType || 'filing' },
      { key: 'submission_status', field_value: 'Pending' },
      { key: 'payment_status', field_value: 'Pending' },
      { key: 'bulk_ip_address', field_value: '' } // Set by caller if available
    ];
    
    // ── ACH billing info (NEVER store full account/routing numbers) ──
    if (orderData.achAccountType) {
      customFields.push(
        { key: 'ach_account_type', field_value: orderData.achAccountType },
        // Only last 4 digits stored — full numbers NEVER touch GHL
        { key: 'ach_routing_number', field_value: orderData.achRoutingLast4 ? `****${orderData.achRoutingLast4}` : '' },
        { key: 'ach_account_number', field_value: orderData.achAccountLast4 ? `****${orderData.achAccountLast4}` : '' },
        { key: 'ach_billing_street_address', field_value: orderData.achBillingStreet || '' },
        { key: 'ach_billing_city', field_value: orderData.achBillingCity || '' },
        { key: 'ach_billing_state', field_value: orderData.achBillingState || '' },
        { key: 'ach_billing_zip_code', field_value: orderData.achBillingZip || '' },
        { key: 'ach_billing_country', field_value: orderData.achBillingCountry || 'United States' }
      );
    }

    // Determine filing type mix
    const filingTypes = new Set(orderData.clients.map(c => c.filingType).filter(Boolean));
    let filingTypeTag = 'Filing Type: Disclosure';
    if (filingTypes.size > 1) filingTypeTag = 'Filing Type: Mixed';
    else if (filingTypes.has('exemption')) filingTypeTag = 'Filing Type: Exemption';

    // Build workflow trigger tags
    const submissionTags = [
      'nylta_submission_complete',       // Workflow 2 & 3 trigger
      'nylta_invoice_pending',           // Invoice workflow marker
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
- Batch ID: ${orderData.batchId || orderData.confirmationNumber}
- Submission Date: ${new Date(orderData.submissionDate).toLocaleDateString()}
- Payment Date: ${orderData.paymentDate ? new Date(orderData.paymentDate).toLocaleDateString() : new Date(orderData.submissionDate).toLocaleDateString()}
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
 * - Company applicant field mapping (up to 3, including phone, email, titleOrRole, idExpirationDate)
 * - Beneficial owner field mapping (including addressType, idExpirationDate, position, isControlPerson, isOrganizer)
 * - Address parsing from pipe-delimited to separate components
 * - Attestation initials mapping
 */
export function convertWizardClientToContactData(client: any): Omit<ClientContactData, 'parentFirmId' | 'parentFirmName' | 'parentFirmConfirmation'> {
  // Map company applicants with all fields (up to 3)
  const mappedApplicants = (client.companyApplicants || []).slice(0, 3).map((ca: any) => ({
    fullName: ca.fullName,
    dob: ca.dob,
    address: ca.address,                     // Pipe-delimited (will be parsed in createClientContact)
    streetAddress: ca.streetAddress,          // Pre-parsed if available
    city: ca.city,
    state: ca.state,
    zipCode: ca.zipCode,
    country: ca.country,
    phoneNumber: ca.phoneNumber || '',
    email: ca.email || '',
    titleOrRole: ca.titleOrRole || '',
    idType: ca.idType,
    idNumber: ca.idNumber,
    idExpirationDate: ca.idExpirationDate || '',
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
    addressType: bo.addressType || '',       // Residential/Business
    streetAddress: bo.streetAddress,          // Pre-parsed if available
    city: bo.city,
    state: bo.state,
    zipCode: bo.zipCode,
    country: bo.country,
    ssn: bo.ssn || '',                       // Not sent to GHL for security
    idType: bo.idType,
    idNumber: bo.idNumber,
    idExpirationDate: bo.idExpirationDate || '',
    issuingCountry: bo.issuingCountry,
    issuingState: bo.issuingState,
    ownershipPercentage: bo.ownershipPercentage || bo.ownership,
    ownership: bo.ownership,
    position: bo.position || '',             // Correct field per types.ts
    role: bo.role,                           // Legacy fallback
    isControlPerson: bo.isControlPerson || false,
    isOrganizer: bo.isOrganizer || false
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
    // Attestation (including initials)
    attestationSignature: client.attestationSignature,
    attestationFullName: client.attestationName,
    attestationInitials: client.attestationInitials || client.initials || '',
    attestationTitle: client.attestationTitle,
    attestationDate: client.attestationDate,
    // People
    companyApplicants: mappedApplicants,
    beneficialOwners: mappedOwners
  };
}

export type { FirmContactData, ClientContactData, OrderConfirmationData };
