/**
 * GoHighLevel Contact Management for NYLTA Bulk Filing System
 * Handles: Firm contacts, Client contacts, Order confirmations
 *
 * FIELD KEY ALIGNMENT (Feb 2026 — Corrected to match GHL custom fields exactly):
 *
 * NAMING CONVENTION:
 *   - Person prefixes use DOUBLE underscore: bo1__full_name, ca2__city
 *   - Compound concepts use DOUBLE underscore: position__title, date_of_formation__registration
 *   - Ownership has TRAILING underscore: bo1__ownership_
 *   - Multi-word fields use SINGLE underscore: full_name, date_of_birth
 *
 * ENDPOINT: /contacts/upsert (NOT /contacts/)
 *
 * FOLDERS & IDS:
 *   Account Details:           gPFrau7XTO0ED3AEDPdV
 *   Order / Submission:        ejqBRb6QeM8IQg7pTPAV
 *   Filing Information:        G2r5TJba4JBWhxHQIP78
 *   Beneficial Owners:         CMngkSX1yJOBZRfWTaiV
 *   Company Applicants:        hN5bDkEhdgVNKcbNlBc2
 *   Consents:                  gvS4YgeUoww5dqZ7V3Or
 *   Exemption & Attestation:   9JmueuzHPqdzNk5Jno4v
 *   Others (Survey):           plxSWD6yh7tpmHmT1inV
 */

import { fetchGoHighLevelApiKeys } from './highlevelApiKeys';
import { projectId } from './supabase/info';

const HIGHLEVEL_BASE_URL = 'https://services.leadconnectorhq.com';
const SUBMISSION_LOG_URL = `https://${projectId}.supabase.co/functions/v1/make-server-339e423c/submissions/log`;

// Fire-and-forget submission log helper
function logSubmission(accessToken: string | null, data: Record<string, any>) {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    fetch(SUBMISSION_LOG_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    }).catch(err => console.warn('⚠️ Submission log send failed:', err));
  } catch {
    // swallow — logging is non-critical
  }
}

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
  professionalType?: string;
}

export interface ClientContactData {
  llcName: string;
  fictitiousName?: string;
  nydosId: string;
  ein: string;
  formationDate: string;            // YYYY-MM-DD
  countryOfFormation: string;
  stateOfFormation?: string;
  entityType: 'domestic' | 'foreign';
  dateAuthorityFiledNY?: string;    // YYYY-MM-DD — required if foreign
  contactEmail: string;
  serviceType: 'monitoring' | 'filing';
  filingType: 'disclosure' | 'exemption';

  // Company address fields
  streetAddress?: string;
  city?: string;
  addressState?: string;
  addressCountry?: string;
  addressZipCode?: string;

  // Exemption-specific (Folder: Exemption & Attestation — 9JmueuzHPqdzNk5Jno4v)
  exemptionCategory?: string;
  exemptionExplanation?: string;
  exemptionAttestationFullName?: string;
  exemptionAttestationTitle?: string;
  exemptionAttestationDate?: string;  // YYYY-MM-DD

  // Consent attestation fields (Folder: Consents — gvS4YgeUoww5dqZ7V3Or)
  attestationSignature?: string;
  attestationFullName?: string;
  attestationInitials?: string;
  attestationTitle?: string;
  attestationDate?: string;          // YYYY-MM-DD

  // Parent firm linkage (set by createBulkClientContacts)
  parentFirmId?: string;
  parentFirmName?: string;
  parentFirmConfirmation?: string;

  // Batch/order tracking
  batchId?: string;
  orderNumber?: string;
  submissionNumber?: string;

  // Company Applicants (up to 3) — hidden when filingType === 'exemption'
  companyApplicants?: Array<{
    fullName?: string;
    dob?: string;                    // YYYY-MM-DD
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    phoneNumber?: string;
    email?: string;
    titleOrRole?: string;
    idType?: string;
    idNumber?: string;
    idExpirationDate?: string;       // YYYY-MM-DD
    issuingCountry?: string;
    issuingState?: string;
  }>;

  // Beneficial Owners (up to 9)
  beneficialOwners?: Array<{
    fullName?: string;
    dob?: string;                    // YYYY-MM-DD
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    addressType?: 'Residential' | 'Business' | string;
    idType?: string;
    idNumber?: string;
    idExpirationDate?: string;       // YYYY-MM-DD
    issuingCountry?: string;
    issuingState?: string;
    ownershipPercentage?: number | string;
    position?: string;
  }>;
}

export interface OrderConfirmationData {
  firmContactId: string;
  firmName: string;
  confirmationNumber: string;
  orderNumber: string;
  submissionNumber?: string;
  submissionDate: string;            // YYYY-MM-DD
  paymentDate?: string;              // YYYY-MM-DD
  batchId?: string;
  amountPaid: number;
  paymentAmount?: number;
  clientCount: number;
  serviceType?: 'monitoring' | 'filing' | 'mixed';
  contactEmail?: string;
  // ACH payment data (only masked values stored in GHL)
  achAccountType?: string;           // 'checking' or 'savings'
  achRoutingLast4?: string;          // Last 4 of routing number
  achAccountLast4?: string;          // Last 4 of account number
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
}

/**
 * Parse address from separate pre-parsed fields, or from a legacy
 * pipe-delimited string ("street|city|state|zip|country").
 */
function parseAddress(
  pipeDelimited?: string,
  preStreet?: string,
  preCity?: string,
  preState?: string,
  preZip?: string,
  preCountry?: string
): ParsedAddress {
  // Prefer pre-parsed fields
  if (preStreet || preCity || preState || preZip || preCountry) {
    return {
      street: preStreet || '',
      city: preCity || '',
      state: preState || '',
      zipCode: preZip || '',
      country: preCountry || ''
    };
  }

  // Fallback: parse legacy pipe-delimited string
  if (!pipeDelimited || pipeDelimited.trim() === '' || pipeDelimited === '||||||') {
    return { street: '', city: '', state: '', zipCode: '', country: '' };
  }

  const parts = pipeDelimited.split('|');
  return {
    street: (parts[0] || '').trim(),
    city: (parts[1] || '').trim(),
    state: (parts[2] || '').trim(),
    zipCode: (parts[3] || '').trim(),
    country: (parts[4] || '').trim()
  };
}

// ─── COMPANY APPLICANT FIELD BUILDER ────────────────────────────────────────

/**
 * Build GHL custom fields for a company applicant.
 * Uses DOUBLE underscore after prefix: ca1__full_name, ca2__city, etc.
 *
 * GHL Folder: NYLTA | Bulk Filing | Company Applicants
 * Folder ID: hN5bDkEhdgVNKcbNlBc2
 */
function buildCompanyApplicantFields(
  applicant: NonNullable<ClientContactData['companyApplicants']>[0],
  caNum: number
): Array<{ key: string; field_value: string }> {
  const p = `ca${caNum}`;  // ca1, ca2, or ca3

  return [
    { key: `${p}__full_name`,          field_value: applicant.fullName || '' },
    { key: `${p}__date_of_birth`,      field_value: applicant.dob || '' },
    { key: `${p}__street_address`,     field_value: applicant.streetAddress || '' },
    { key: `${p}__city`,               field_value: applicant.city || '' },
    { key: `${p}__state`,              field_value: applicant.state || '' },
    { key: `${p}__zip_code`,           field_value: applicant.zipCode || '' },
    { key: `${p}__country`,            field_value: applicant.country || '' },
    { key: `${p}__phone`,              field_value: applicant.phoneNumber || '' },
    { key: `${p}__email`,              field_value: applicant.email || '' },
    { key: `${p}__title_or_role`,      field_value: applicant.titleOrRole || '' },
    { key: `${p}__id_type`,            field_value: applicant.idType || '' },
    { key: `${p}__id_number`,          field_value: applicant.idNumber || '' },
    { key: `${p}__id_expiration_date`, field_value: applicant.idExpirationDate || '' },
    { key: `${p}__issuing_country`,    field_value: applicant.issuingCountry || '' },
    { key: `${p}__issuing_state`,      field_value: applicant.issuingState || '' }
  ];
}

// ─── BENEFICIAL OWNER FIELD BUILDER ─────────────────────────────────────────

/**
 * Build GHL custom fields for a beneficial owner.
 * Uses DOUBLE underscore after prefix: bo1__full_name, bo3__city, etc.
 * NOTE: ownership has TRAILING underscore: bo1__ownership_
 * NOTE: position uses double underscore: bo1__position__title
 *
 * GHL Folder: NYLTA | Bulk Filing | Beneficial Owners
 * Folder ID: CMngkSX1yJOBZRfWTaiV
 */
function buildBeneficialOwnerFields(
  owner: NonNullable<ClientContactData['beneficialOwners']>[0],
  boNum: number
): Array<{ key: string; field_value: string }> {
  const p = `bo${boNum}`;  // bo1 through bo9

  const ownershipPct = owner.ownershipPercentage?.toString() || '0';

  return [
    { key: `${p}__full_name`,          field_value: owner.fullName || '' },
    { key: `${p}__date_of_birth`,      field_value: owner.dob || '' },
    { key: `${p}__street_address`,     field_value: owner.streetAddress || '' },
    { key: `${p}__city`,               field_value: owner.city || '' },
    { key: `${p}__state`,              field_value: owner.state || '' },
    { key: `${p}__zip_code`,           field_value: owner.zipCode || '' },
    { key: `${p}__country`,            field_value: owner.country || '' },
    { key: `${p}__address_type`,       field_value: owner.addressType || '' },
    { key: `${p}__id_type`,            field_value: owner.idType || '' },
    { key: `${p}__id_number`,          field_value: owner.idNumber || '' },
    { key: `${p}__id_expiration_date`, field_value: owner.idExpirationDate || '' },
    { key: `${p}__issuing_country`,    field_value: owner.issuingCountry || '' },
    { key: `${p}__issuing_state`,      field_value: owner.issuingState || '' },
    // NOTE: trailing underscore on ownership_ is intentional — matches GHL exactly
    { key: `${p}__ownership_`,         field_value: ownershipPct },
    // NOTE: double underscore before "title" is intentional — matches GHL exactly
    { key: `${p}__position__title`,    field_value: owner.position || '' }
  ];
}

// ─── FIRM CONTACT ───────────────────────────────────────────────────────────

/**
 * Create or update a Firm Contact in GoHighLevel via /contacts/upsert.
 * Returns the contact ID for linking clients.
 *
 * GHL Folder: NYLTA | Bulk Filing | Account Details
 * Folder ID: gPFrau7XTO0ED3AEDPdV
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
    console.log('Creating/upserting firm contact in GoHighLevel:', firmData.firmName);

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
        // Account Details folder (gPFrau7XTO0ED3AEDPdV)
        { key: 'account_type',             field_value: 'firm' },
        { key: 'firm_name',                field_value: firmData.firmName },
        { key: 'firm_ein',                 field_value: firmData.firmEIN },
        { key: 'firm_confirmation_number', field_value: firmData.confirmationNumber },
        { key: 'professional_type',        field_value: firmData.professionalType || '' },
        { key: 'firm_city',                field_value: firmData.firmCity || '' },
        { key: 'firm_state',               field_value: firmData.firmState || '' },
        { key: 'firm_profile_completed',   field_value: 'true' }
      ]
    };

    // Use /contacts/upsert — NOT /contacts/
    const response = await fetch(`${HIGHLEVEL_BASE_URL}/contacts/upsert`, {
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
      console.error('Failed to upsert firm contact:', errorText);
      throw new Error(`Failed to upsert firm contact: ${response.status} — ${errorText}`);
    }

    const data = await response.json();
    const contactId = data.contact?.id || data.id;
    console.log('Firm contact upserted:', contactId);

    return contactId;
  } catch (error) {
    console.error('Error upserting firm contact:', error);
    throw error;
  }
}

// ─── CLIENT CONTACT ─────────────────────────────────────────────────────────

/**
 * Create/upsert a Client Contact in GoHighLevel.
 * Tagged with parent firm for easy lookup.
 *
 * Uses exact GHL custom field keys with DOUBLE underscore naming:
 *
 * Filing Info (G2r5TJba4JBWhxHQIP78):
 *   legal_business_name, entity_type, filing_type, service_type, ein,
 *   date_of_formation__registration, ny_dos_id_number, fictitious_name_dba,
 *   country_of_formation, state_of_formation, date_authority_filed_in_ny,
 *   llc_contact_email, company_street_address, company_city, company_state,
 *   company_country, company_zip_code, beneficial_owners_count, company_applicants_count
 *
 * Beneficial Owners (CMngkSX1yJOBZRfWTaiV):
 *   bo{1-9}__full_name, bo{1-9}__date_of_birth, bo{1-9}__ownership_,
 *   bo{1-9}__position__title, etc.
 *
 * Company Applicants (hN5bDkEhdgVNKcbNlBc2):
 *   ca{1-3}__full_name, ca{1-3}__date_of_birth, ca{1-3}__title_or_role, etc.
 *
 * Consents (gvS4YgeUoww5dqZ7V3Or):
 *   attestation_signature, attestation_full_name, attestation_title,
 *   attestation_date, attestation_initials
 *
 * Exemption & Attestation (9JmueuzHPqdzNk5Jno4v):
 *   select_exemption_category, explanation__supporting_facts,
 *   exemption_attestation__date,
 *   exemption_attestation__full_name_of_authorized_individual_who_signed,
 *   exemption_attestation__position__title
 */
export async function createClientContact(clientData: ClientContactData): Promise<string> {
  const config = await fetchGoHighLevelApiKeys();
  if (!config.apiKey || config.apiKey === '') {
    console.warn('HighLevel API key not configured. Skipping client contact creation.');
    return 'SKIP_NO_API_KEY';
  }

  try {
    console.log('Creating/upserting client contact:', clientData.llcName);

    // ── Build tags ──
    const tags = [
      'client',
      'nylta-llc',
      `firm-${clientData.parentFirmConfirmation}`,
      'nylta_submission_complete'
    ];

    // ── Filing Information (Folder: G2r5TJba4JBWhxHQIP78) ──
    const customFields: Array<{ key: string; field_value: string }> = [
      // Account Details (gPFrau7XTO0ED3AEDPdV)
      { key: 'account_type',                    field_value: 'client' },
      { key: 'parent_firm_id',                  field_value: clientData.parentFirmId || '' },
      { key: 'parent_firm_name',                field_value: clientData.parentFirmName || '' },
      { key: 'parent_firm_confirmation',         field_value: clientData.parentFirmConfirmation || '' },

      // Order / Submission Tracking (ejqBRb6QeM8IQg7pTPAV)
      { key: 'batch_id',                        field_value: clientData.batchId || clientData.parentFirmConfirmation || '' },
      { key: 'order_number',                    field_value: clientData.orderNumber || '' },
      { key: 'submission_number',               field_value: clientData.submissionNumber || '' },

      // Filing Information (G2r5TJba4JBWhxHQIP78)
      { key: 'legal_business_name',             field_value: clientData.llcName },
      { key: 'fictitious_name_dba',             field_value: clientData.fictitiousName || '' },
      { key: 'ny_dos_id_number',                field_value: clientData.nydosId },
      { key: 'ein',                             field_value: clientData.ein },
      { key: 'entity_type',                     field_value: clientData.entityType },
      { key: 'service_type',                    field_value: clientData.serviceType },
      { key: 'filing_type',                     field_value: clientData.filingType },
      { key: 'date_of_formation__registration', field_value: clientData.formationDate },
      { key: 'country_of_formation',            field_value: clientData.countryOfFormation },
      { key: 'state_of_formation',              field_value: clientData.stateOfFormation || '' },
      { key: 'llc_contact_email',               field_value: clientData.contactEmail },

      // Company Address
      { key: 'company_street_address',          field_value: clientData.streetAddress || '' },
      { key: 'company_city',                    field_value: clientData.city || '' },
      { key: 'company_state',                   field_value: clientData.addressState || '' },
      { key: 'company_country',                 field_value: clientData.addressCountry || clientData.countryOfFormation },
      { key: 'company_zip_code',                field_value: clientData.addressZipCode || '' },

      // Counts
      { key: 'beneficial_owners_count',         field_value: (clientData.beneficialOwners?.length || 0).toString() },
      { key: 'company_applicants_count',        field_value: (clientData.companyApplicants?.length || 0).toString() }
    ];

    // ── Foreign entity: date_authority_filed_in_ny (required) ──
    if (clientData.entityType === 'foreign') {
      customFields.push({
        key: 'date_authority_filed_in_ny',
        field_value: clientData.dateAuthorityFiledNY || ''
      });
    }

    // ── Exemption fields (Folder: 9JmueuzHPqdzNk5Jno4v) ──
    if (clientData.filingType === 'exemption') {
      customFields.push(
        { key: 'select_exemption_category',   field_value: clientData.exemptionCategory || '' },
        { key: 'explanation__supporting_facts', field_value: clientData.exemptionExplanation || '' },
        { key: 'exemption_attestation__date',   field_value: clientData.exemptionAttestationDate || clientData.attestationDate || '' },
        { key: 'exemption_attestation__full_name_of_authorized_individual_who_signed',
          field_value: clientData.exemptionAttestationFullName || clientData.attestationFullName || '' },
        { key: 'exemption_attestation__position__title',
          field_value: clientData.exemptionAttestationTitle || clientData.attestationTitle || '' }
      );
    }

    // ── Consent / Attestation fields (Folder: gvS4YgeUoww5dqZ7V3Or) ──
    customFields.push(
      { key: 'attestation_signature', field_value: clientData.attestationSignature || '' },
      { key: 'attestation_full_name', field_value: clientData.attestationFullName || '' },
      { key: 'attestation_title',     field_value: clientData.attestationTitle || '' },
      { key: 'attestation_date',      field_value: clientData.attestationDate || '' },
      { key: 'attestation_initials',  field_value: clientData.attestationInitials || '' }
    );

    // ── Company Applicants (up to 3) — HIDDEN if filingType === 'exemption' ──
    if (clientData.filingType !== 'exemption' &&
        clientData.companyApplicants && clientData.companyApplicants.length > 0) {
      clientData.companyApplicants.forEach((applicant, index) => {
        if (index >= 3) return; // Max 3 company applicants
        const caFields = buildCompanyApplicantFields(applicant, index + 1);
        customFields.push(...caFields);
      });
    }

    // ── Beneficial Owners (up to 9) ──
    if (clientData.beneficialOwners && clientData.beneficialOwners.length > 0) {
      clientData.beneficialOwners.forEach((owner, index) => {
        if (index >= 9) return; // Max 9 beneficial owners
        const boFields = buildBeneficialOwnerFields(owner, index + 1);
        customFields.push(...boFields);
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

    // Use /contacts/upsert — NOT /contacts/
    const response = await fetch(`${HIGHLEVEL_BASE_URL}/contacts/upsert`, {
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
      console.error('Failed to upsert client contact:', errorText);
      throw new Error(`Failed to upsert client contact: ${response.status} — ${errorText}`);
    }

    const data = await response.json();
    const contactId = data.contact?.id || data.id;
    console.log('Client contact upserted:', contactId);

    // Log to submission logs (fire-and-forget)
    logSubmission(null, {
      action: 'CLIENT_CONTACT_UPSERT',
      clientName: clientData.llcName,
      firmName: clientData.parentFirmName || '',
      contactId,
      batchId: clientData.batchId || '',
      orderNumber: clientData.orderNumber || '',
      submissionNumber: clientData.submissionNumber || '',
      success: true,
      fieldCount: customFields.length,
      tags,
      metadata: {
        filingType: clientData.filingType,
        serviceType: clientData.serviceType,
        entityType: clientData.entityType,
        boCount: clientData.beneficialOwners?.length || 0,
        caCount: clientData.companyApplicants?.length || 0
      }
    });

    return contactId;
  } catch (error) {
    console.error('Error upserting client contact:', error);

    // Log failure to submission logs
    logSubmission(null, {
      action: 'CLIENT_CONTACT_UPSERT',
      clientName: clientData.llcName,
      firmName: clientData.parentFirmName || '',
      success: false,
      errorMessage: error instanceof Error ? error.message : String(error),
      metadata: {
        filingType: clientData.filingType,
        serviceType: clientData.serviceType
      }
    });

    throw error;
  }
}

// ─── ORDER CONFIRMATION ─────────────────────────────────────────────────────

/**
 * Send Order Confirmation to Firm.
 * Updates firm contact with order details, adds submission note,
 * and applies workflow trigger tags.
 *
 * GHL Folder: NYLTA | Bulk Filing | Order / Submission Tracking
 * Folder ID: ejqBRb6QeM8IQg7pTPAV
 *
 * GHL Folder: NYLTA | Bulk Filing | Account Details (ACH fields)
 * Folder ID: gPFrau7XTO0ED3AEDPdV
 */
export async function sendOrderConfirmation(orderData: OrderConfirmationData): Promise<void> {
  const config = await fetchGoHighLevelApiKeys();
  if (!config.apiKey || config.apiKey === '') {
    console.warn('HighLevel API key not configured. Skipping order confirmation.');
    return;
  }

  try {
    console.log('Sending order confirmation to firm:', orderData.firmName);

    // Order / Submission Tracking fields (ejqBRb6QeM8IQg7pTPAV)
    const customFields: Array<{ key: string; field_value: string }> = [
      { key: 'batch_id',                   field_value: orderData.batchId || orderData.confirmationNumber },
      { key: 'order_number',               field_value: orderData.orderNumber },
      { key: 'submission_number',          field_value: orderData.submissionNumber || orderData.orderNumber },
      { key: 'submission_date',            field_value: orderData.submissionDate },
      { key: 'submission_status',          field_value: 'Pending' },
      { key: 'payment_status',             field_value: 'Pending' },
      { key: 'payment_amount',             field_value: (orderData.paymentAmount || orderData.amountPaid).toString() },
      { key: 'payment_date',               field_value: orderData.paymentDate || orderData.submissionDate },
      { key: 'last_order_number',          field_value: orderData.orderNumber },
      { key: 'last_order_date',            field_value: orderData.submissionDate },
      { key: 'last_order_amount',          field_value: orderData.amountPaid.toString() },
      { key: 'last_order_client_count',    field_value: orderData.clientCount.toString() },
      { key: 'bulk_service_type',          field_value: orderData.serviceType || 'filing' },
      { key: 'bulk_ip_address',            field_value: '' }, // Set by caller if available
      { key: 'client_count',               field_value: orderData.clientCount.toString() },
      { key: 'amount_paid',                field_value: orderData.amountPaid.toString() },
      { key: 'bulk_filing_contact_email',  field_value: orderData.contactEmail || '' },
      { key: 'total_orders',               field_value: '1' }  // Incremented server-side if needed
    ];

    // ACH billing info — Account Details folder (gPFrau7XTO0ED3AEDPdV)
    // NEVER store full account/routing numbers
    if (orderData.achAccountType) {
      customFields.push(
        { key: 'ach_account_type',          field_value: orderData.achAccountType },
        { key: 'ach_routing_number_last_4', field_value: orderData.achRoutingLast4 ? `****${orderData.achRoutingLast4}` : '' },
        { key: 'ach_account_number_last_4', field_value: orderData.achAccountLast4 ? `****${orderData.achAccountLast4}` : '' },
        { key: 'ach_billing_street',        field_value: orderData.achBillingStreet || '' },
        { key: 'ach_billing_city',          field_value: orderData.achBillingCity || '' },
        { key: 'ach_billing_state',         field_value: orderData.achBillingState || '' },
        { key: 'ach_billing_zip',           field_value: orderData.achBillingZip || '' },
        { key: 'ach_billing_country',       field_value: orderData.achBillingCountry || 'United States' }
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
    const updateResponse = await fetch(`${HIGHLEVEL_BASE_URL}/contacts/${orderData.firmContactId}`, {
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

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Failed to update firm contact with order info:', errorText);
    }

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

    // Log order confirmation to submission logs (fire-and-forget)
    logSubmission(null, {
      action: 'ORDER_CONFIRMATION',
      firmName: orderData.firmName,
      contactId: orderData.firmContactId,
      batchId: orderData.batchId || orderData.confirmationNumber,
      orderNumber: orderData.orderNumber,
      submissionNumber: orderData.submissionNumber || orderData.orderNumber,
      success: true,
      fieldCount: customFields.length,
      tags: submissionTags,
      metadata: {
        clientCount: orderData.clientCount,
        amountPaid: orderData.amountPaid,
        serviceType: orderData.serviceType,
        contactEmail: orderData.contactEmail
      }
    });

  } catch (error) {
    console.error('Error sending order confirmation:', error);
    throw error;
  }
}

// ─── BULK CLIENT CONTACTS ───────────────────────────────────────────────────

/**
 * Bulk create client contacts for an entire submission.
 * Returns array of created contact IDs.
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
        parentFirmConfirmation: firmConfirmation,
        batchId: client.batchId || firmConfirmation  // Batch ID defaults to the confirmation number
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
 * Convert wizard client data to ClientContactData format.
 * Maps all fields from the wizard's Client type to the GHL contact structure.
 *
 * Handles:
 * - Company applicant field mapping (up to 3)
 * - Beneficial owner field mapping (up to 9)
 * - Legacy pipe-delimited address fallback
 * - Exemption attestation separate from consent attestation
 *
 * DEPRECATED FIELDS REMOVED: ssn, isControlPerson, isOrganizer,
 * pipe-delimited address (as primary), role (legacy)
 */
export function convertWizardClientToContactData(
  client: any
): Omit<ClientContactData, 'parentFirmId' | 'parentFirmName' | 'parentFirmConfirmation'> {

  // Map company applicants — clean interface, no legacy fields
  const mappedApplicants = (client.companyApplicants || []).slice(0, 3).map((ca: any) => {
    // If only legacy pipe-delimited address exists, parse it
    const addr = parseAddress(
      ca.address,
      ca.streetAddress,
      ca.city,
      ca.state,
      ca.zipCode,
      ca.country
    );
    return {
      fullName: ca.fullName || '',
      dob: ca.dob || '',
      streetAddress: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
      phoneNumber: ca.phoneNumber || ca.phone || '',
      email: ca.email || '',
      titleOrRole: ca.titleOrRole || ca.role || '',
      idType: ca.idType || '',
      idNumber: ca.idNumber || '',
      idExpirationDate: ca.idExpirationDate || '',
      issuingCountry: ca.issuingCountry || '',
      issuingState: ca.issuingState || ''
    };
  });

  // Map beneficial owners — clean interface, no deprecated fields
  const mappedOwners = (client.beneficialOwners || []).slice(0, 9).map((bo: any) => {
    // If only legacy pipe-delimited address exists, parse it
    const addr = parseAddress(
      bo.address,
      bo.streetAddress || bo.addressLine1,
      bo.city,
      bo.state,
      bo.zipCode,
      bo.country
    );
    return {
      fullName: bo.fullName || '',
      dob: bo.dob || '',
      streetAddress: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
      addressType: bo.addressType || '',
      idType: bo.idType || '',
      idNumber: bo.idNumber || '',
      idExpirationDate: bo.idExpirationDate || '',
      issuingCountry: bo.issuingCountry || '',
      issuingState: bo.issuingState || '',
      ownershipPercentage: bo.ownershipPercentage || bo.ownership || '0',
      position: bo.position || bo.role || ''
    };
  });

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
    // Exemption (mapped to correct GHL keys in createClientContact)
    exemptionCategory: client.exemptionCategory,
    exemptionExplanation: client.exemptionExplanation || client.exemptionReason,
    exemptionAttestationFullName: client.exemptionAttestationFullName,
    exemptionAttestationTitle: client.exemptionAttestationTitle,
    exemptionAttestationDate: client.exemptionAttestationDate,
    // Consent attestation
    attestationSignature: client.attestationSignature,
    attestationFullName: client.attestationName || client.attestationFullName,
    attestationInitials: client.attestationInitials || client.initials || '',
    attestationTitle: client.attestationTitle,
    attestationDate: client.attestationDate,
    // People
    companyApplicants: mappedApplicants,
    beneficialOwners: mappedOwners
  };
}