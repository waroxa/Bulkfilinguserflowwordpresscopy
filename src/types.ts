// Type definitions for NYLTA Bulk Filing Application
// Aligned with GoHighLevel custom field structure (Feb 2026)

export interface CompanyApplicant {
  id: string;
  fullName: string;
  dob: string;                       // YYYY-MM-DD → ca{N}__date_of_birth
  streetAddress?: string;            // → ca{N}__street_address
  city?: string;                     // → ca{N}__city
  state?: string;                    // → ca{N}__state
  zipCode?: string;                  // → ca{N}__zip_code
  country?: string;                  // → ca{N}__country
  phoneNumber?: string;              // → ca{N}__phone
  email?: string;                    // → ca{N}__email
  titleOrRole?: string;              // → ca{N}__title_or_role
  idType: string;                    // → ca{N}__id_type
  idNumber: string;                  // → ca{N}__id_number
  idExpirationDate?: string;         // YYYY-MM-DD → ca{N}__id_expiration_date
  issuingCountry: string;            // → ca{N}__issuing_country
  issuingState: string;              // → ca{N}__issuing_state
  isSameAsBeneficialOwner?: boolean;
  // Legacy (optional, not sent to GHL)
  /** @deprecated Use streetAddress, city, state, zipCode, country instead */
  address?: string;
  /** @deprecated Use titleOrRole instead */
  role?: string;
}

export interface BeneficialOwner {
  id: string;
  fullName: string;
  dob: string;                       // YYYY-MM-DD → bo{N}__date_of_birth
  streetAddress?: string;            // → bo{N}__street_address
  city?: string;                     // → bo{N}__city
  state?: string;                    // → bo{N}__state
  zipCode?: string;                  // → bo{N}__zip_code
  country?: string;                  // → bo{N}__country
  addressType?: "Residential" | "Business";  // → bo{N}__address_type
  idType?: string;                   // → bo{N}__id_type
  idNumber?: string;                 // → bo{N}__id_number
  idExpirationDate?: string;         // YYYY-MM-DD → bo{N}__id_expiration_date
  issuingCountry?: string;           // → bo{N}__issuing_country
  issuingState?: string;             // → bo{N}__issuing_state
  ownershipPercentage?: string;      // → bo{N}__ownership_ (note trailing underscore)
  position?: string;                 // → bo{N}__position__title (note double underscore)
  // Legacy (optional, not sent to GHL)
  /** @deprecated Use streetAddress, city, state, zipCode, country instead */
  address?: string;
  /** @deprecated Use streetAddress instead */
  addressLine1?: string;
  /** @deprecated Not a GHL field */
  addressLine2?: string;
  /** @deprecated Use ownershipPercentage (string) instead */
  ownership?: number;
  /** @deprecated Not a GHL field — never store SSN in CRM */
  ssn?: string;
  /** @deprecated Not a GHL field */
  isControlPerson?: boolean;
  /** @deprecated Not a GHL field */
  isOrganizer?: boolean;
  /** @deprecated Use position instead */
  role?: string;
}

export interface Client {
  id: string;
  llcName: string;                   // → legal_business_name
  fictitiousName?: string;           // → fictitious_name_dba
  nydosId?: string;                  // → ny_dos_id_number
  ein?: string;                      // → ein
  formationDate?: string;            // YYYY-MM-DD → date_of_formation__registration
  countryOfFormation: string;        // → country_of_formation
  stateOfFormation?: string;         // → state_of_formation
  entityType?: "domestic" | "foreign";  // → entity_type
  filingType?: "disclosure" | "exemption";  // → filing_type
  dateAuthorityFiledNY?: string;     // YYYY-MM-DD → date_authority_filed_in_ny (foreign only)
  contactEmail?: string;             // → llc_contact_email
  serviceType?: "monitoring" | "filing";  // → service_type
  // Company address
  companyStreetAddress?: string;     // → company_street_address
  companyCity?: string;              // → company_city
  companyState?: string;             // → company_state
  companyZipCode?: string;           // → company_zip_code
  companyCountry?: string;           // → company_country
  // People
  companyApplicants?: CompanyApplicant[];
  beneficialOwners?: BeneficialOwner[];
  // Exemption (Folder: 9JmueuzHPqdzNk5Jno4v)
  exemptionCategory?: string;        // → select_exemption_category
  exemptionExplanation?: string;     // → explanation__supporting_facts
  exemptionAttestationFullName?: string;  // → exemption_attestation__full_name_of_authorized_individual_who_signed
  exemptionAttestationTitle?: string;     // → exemption_attestation__position__title
  exemptionAttestationDate?: string;      // → exemption_attestation__date
  // Consent attestation (Folder: gvS4YgeUoww5dqZ7V3Or)
  attestationSignature?: string;     // → attestation_signature
  attestationFullName?: string;      // → attestation_full_name
  attestationInitials?: string;      // → attestation_initials
  attestationTitle?: string;         // → attestation_title
  attestationDate?: string;          // YYYY-MM-DD → attestation_date
  // Pricing
  fee?: number;
  discountApplied?: boolean;
  finalPrice?: number;
  // Legacy (optional, kept for backward compat)
  /** @deprecated Use attestationFullName instead */
  attestationName?: string;
  /** @deprecated Use exemptionExplanation instead */
  exemptionReason?: string;
}

export interface FirmProfile {
  id?: string;
  firmName: string;
  ein: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactPerson: string;
  isComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FirmWorker {
  id: string;
  fullName: string;
  email: string;
  title: string;
  phone?: string;
}

export interface PaymentData {
  agreementData?: any;
  payment?: {
    transaction_id?: string;
    amount?: number;
    method?: string;
  };
}

export interface ConfirmationData extends PaymentData {
  clients: Client[];
  firmInfo: FirmProfile | null;
  timestamp: string;
}
