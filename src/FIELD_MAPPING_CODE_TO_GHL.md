# NYLTA Field Mapping: Code Variables → GoHighLevel Custom Fields
# Updated: All keys now use Maria's simplified naming convention

> **Status:** All field keys in code NOW MATCH the GHL custom field keys listed in `/GOHIGHLEVEL_COMPLETE_SETUP.md`.
> No mismatches remain. This document serves as a quick reference for developers.

---

## FIRM CONTACT — `createFirmContact()` in `/utils/highlevelContacts.ts`

| Code Variable (`FirmContactData.*`) | GHL Custom Field Key | GHL Built-in Field | Notes |
|-------------------------------------|---------------------|-------------------|-------|
| `firmName` | `firm_name` | `companyName` | Both custom + built-in |
| `contactName` | `contact_name` | `firstName` / `lastName` (split) | Full name as custom field |
| `contactEmail` | `contact_email` | `email` | Both custom + built-in |
| `contactPhone` | `contact_phone` | `phone` | Both custom + built-in |
| `firmEIN` | `firm_ein` | — | |
| `firmAddress` | `firm_street_address` | `address1` | Both custom + built-in |
| `firmCity` | `firm_city` | `city` | Both custom + built-in |
| `firmState` | `firm_state` | `state` | Both custom + built-in |
| `firmZipCode` | `firm_zip_code` | `postalCode` | Both custom + built-in |
| `firmCountry` | `firm_country` | `country` | Default "United States" |
| `confirmationNumber` | `firm_confirmation_number` | — | Auto-generated |
| *(hardcoded "firm")* | `account_type` | — | Internal |

**Tags:** `firm`, `nylta-bulk-filing`, `nylta_new_account`

---

## CLIENT CONTACT — `createClientContact()` in `/utils/highlevelContacts.ts`

### LLC / Client Information
| Code Variable (`ClientContactData.*`) | GHL Key |
|---------------------------------------|---------|
| `llcName` | `llc_legal_name` |
| `fictitiousName` | `fictitious_name_dba` |
| `nydosId` | `nydos_id` |
| `ein` | `ein` |
| `entityType` | `entity_type` |
| `serviceType` | `service_type` |

### Company Address
| Code Variable | GHL Key |
|--------------|---------|
| `streetAddress` | `company_street_address` |
| `city` | `company_city` |
| `addressState` | `company_state` |
| `addressZipCode` | `company_zip_code` |
| `addressCountry` (fallback: `countryOfFormation`) | `company_country` |

### Formation Information
| Code Variable | GHL Key |
|--------------|---------|
| `formationDate` | `formation_date` |
| `countryOfFormation` | `country_of_formation` |
| `stateOfFormation` | `state_of_formation` |
| `dateAuthorityFiledNY` | `date_authority_filed_ny` | *(foreign only)* |

### Contact & Counts
| Code Variable | GHL Key |
|--------------|---------|
| `contactEmail` | `llc_contact_email` |
| `filingType` | `filing_type` |
| `beneficialOwners?.length` | `beneficial_owners__count` |
| `companyApplicants?.length` | `company_applicants__count` |

### Exemption *(only when filingType === 'exemption')*
| Code Variable | GHL Key |
|--------------|---------|
| `exemptionCategory` | `exemption_category` |
| `exemptionExplanation` | `exemption_explanation` |

### Attestation
| Code Variable | GHL Key |
|--------------|---------|
| `attestationSignature` | `attestation_signature` |
| `attestationInitials` | `attestation_initials` |
| `attestationTitle` | `attestation_title` |
| `attestationDate` | `attestation_date` |

### Company Applicants 1-3 *(built via `buildCompanyApplicantFields()`)*

Pattern: `ca{N}_` prefix where N = 1, 2, or 3

| Applicant Field | CA1 Key | CA2 Key | CA3 Key |
|----------------|---------|---------|---------|
| `fullName` | `ca1_full_name` | `ca2_full_name` | `ca3_full_name` |
| `dob` | `ca1_dob` | `ca2_dob` | `ca3_dob` |
| `addr.street` | `ca1_street_address` | `ca2_street_address` | `ca3_street_address` |
| `addr.city` | `ca1_city` | `ca2_city` | `ca3_city` |
| `addr.state` | `ca1_state` | `ca2_state` | `ca3_state` |
| `addr.zipCode` | `ca1_zip_code` | `ca2_zip_code` | `ca3_zip_code` |
| `addr.country` | `ca1_country` | `ca2_country` | `ca3_country` |
| `idType` | `ca1_id_type` | `ca2_id_type` | `ca3_id_type` |
| `idNumber` | `ca1_id_number` | `ca2_id_number` | `ca3_id_number` |
| `idExpirationDate` | `ca1_id_expiration_date` | `ca2_id_expiration_date` | `ca3_id_expiration_date` |
| `issuingCountry` | `ca1_issuing_country` | `ca2_issuing_country` | `ca3_issuing_country` |
| `issuingState` | `ca1_issuing_state` | `ca2_issuing_state` | `ca3_issuing_state` |
| `titleOrRole` | `ca1_title_or_role` | `ca2_title_or_role` | `ca3_title_or_role` |
| `phoneNumber` | `ca1_phone` | `ca2_phone` | `ca3_phone` |
| `email` | `ca1_email` | `ca2_email` | `ca3_email` |

### Beneficial Owners 1-9

Pattern: `bo{N}_` prefix where N = 1 through 9

| Owner Field | BO1 Key | BO2 Key | ... | BO9 Key |
|------------|---------|---------|-----|---------|
| `fullName` | `bo1_full_name` | `bo2_full_name` | ... | `bo9_full_name` |
| `dob` | `bo1_dob` | `bo2_dob` | ... | `bo9_dob` |
| `addr.street` | `bo1_street_address` | `bo2_street_address` | ... | `bo9_street_address` |
| `addr.city` | `bo1_city` | `bo2_city` | ... | `bo9_city` |
| `addr.state` | `bo1_state` | `bo2_state` | ... | `bo9_state` |
| `addr.zipCode` | `bo1_zip_code` | `bo2_zip_code` | ... | `bo9_zip_code` |
| `addr.country` | `bo1_country` | `bo2_country` | ... | `bo9_country` |
| `addressType` | `bo1_address_type` | `bo2_address_type` | ... | `bo9_address_type` |
| `idType` | `bo1_id_type` | `bo2_id_type` | ... | `bo9_id_type` |
| `idNumber` | `bo1_id_number` | `bo2_id_number` | ... | `bo9_id_number` |
| `idExpirationDate` | `bo1_id_expiration_date` | `bo2_id_expiration_date` | ... | `bo9_id_expiration_date` |
| `issuingCountry` | `bo1_issuing_country` | `bo2_issuing_country` | ... | `bo9_issuing_country` |
| `issuingState` | `bo1_issuing_state` | `bo2_issuing_state` | ... | `bo9_issuing_state` |
| `ownershipPercentage` | `bo1_ownership_percentage` | `bo2_ownership_percentage` | ... | `bo9_ownership_percentage` |
| `position` | `bo1_position_or_title` | `bo2_position_or_title` | ... | `bo9_position_or_title` |

**NOT sent to GHL (security):** `ssn`, `isControlPerson`, `isOrganizer`

---

## ORDER CONFIRMATION — `sendOrderConfirmation()` in `/utils/highlevelContacts.ts`

### Order Tracking Fields
| Code Variable (`OrderConfirmationData.*`) | GHL Key |
|------------------------------------------|---------|
| `orderNumber` | `order_number` |
| `submissionDate` | `submission_date` |
| `paymentDate` | `payment_date` |
| `amountPaid` | `amount_paid` |
| `clientCount` | `client_count` |
| `batchId` (fallback: `confirmationNumber`) | `batch_id` |
| `serviceType` | `bulk_service_type` |
| *(hardcoded "Pending")* | `submission_status` |
| *(hardcoded "Pending")* | `payment_status` |
| *(placeholder)* | `bulk_ip_address` |

### ACH Payment Fields *(MASKED — never full numbers)*
| Code Variable | GHL Key | Security |
|--------------|---------|----------|
| `achAccountType` | `ach_account_type` | Safe (checking/savings) |
| `achRoutingLast4` | `ach_routing_number` | MASKED: `****1234` |
| `achAccountLast4` | `ach_account_number` | MASKED: `****5678` |
| `achBillingStreet` | `ach_billing_street_address` | Safe |
| `achBillingCity` | `ach_billing_city` | Safe |
| `achBillingState` | `ach_billing_state` | Safe |
| `achBillingZip` | `ach_billing_zip_code` | Safe |
| `achBillingCountry` | `ach_billing_country` | Default "United States" |

---

## WIZARD CONVERTER — `convertWizardClientToContactData()` field trace

| Wizard `client.*` | → `ClientContactData.*` | → GHL Key |
|-------------------|------------------------|-----------|
| `client.llcName` | `llcName` | `llc_legal_name` |
| `client.fictitiousName` | `fictitiousName` | `fictitious_name_dba` |
| `client.nydosId` | `nydosId` | `nydos_id` |
| `client.ein` | `ein` | `ein` |
| `client.entityType` | `entityType` | `entity_type` |
| `client.serviceType` | `serviceType` | `service_type` |
| `client.formationDate` | `formationDate` | `formation_date` |
| `client.countryOfFormation` | `countryOfFormation` | `country_of_formation` |
| `client.stateOfFormation` | `stateOfFormation` | `state_of_formation` |
| `client.dateAuthorityFiledNY` | `dateAuthorityFiledNY` | `date_authority_filed_ny` |
| `client.contactEmail` | `contactEmail` | `llc_contact_email` |
| `client.filingType` | `filingType` | `filing_type` |
| `client.companyStreetAddress` | `streetAddress` | `company_street_address` |
| `client.companyCity` | `city` | `company_city` |
| `client.companyState` | `addressState` | `company_state` |
| `client.companyCountry` | `addressCountry` | `company_country` |
| `client.companyZipCode` | `addressZipCode` | `company_zip_code` |
| `client.exemptionCategory` | `exemptionCategory` | `exemption_category` |
| `client.exemptionExplanation` | `exemptionExplanation` | `exemption_explanation` |
| `client.attestationSignature` | `attestationSignature` | `attestation_signature` |
| `client.attestationName` | `attestationFullName` | *(not sent — replaced by initials)* |
| `client.attestationInitials` / `client.initials` | `attestationInitials` | `attestation_initials` |
| `client.attestationTitle` | `attestationTitle` | `attestation_title` |
| `client.attestationDate` | `attestationDate` | `attestation_date` |
