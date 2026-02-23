# GoHighLevel (GHL) Folder & Custom Field Reference

## CRM Configuration

| Setting | Value |
|---------|-------|
| **Location ID** | `QWhUZ1cxgQgSMFYGloyK` |
| **API Version** | `2021-07-28` |
| **Base Endpoint** | `https://services.leadconnectorhq.com/contacts/upsert` |
| **API Key Env Var** | `VITE_HIGHLEVEL_API_KEY` |
| **Location ID Env Var** | `VITE_HIGHLEVEL_LOCATION_ID` |

---

## Folder 1: NYLTA | Bulk Filing | Account Details

**Folder ID:** `gPFrau7XTO0ED3AEDPdV`

| # | Custom Field Key | Type | Description |
|---|-----------------|------|-------------|
| 1 | `account_type` | TEXT | "firm" or "client" |
| 2 | `firm_name` | TEXT | Legal name of the firm |
| 3 | `firm_ein` | TEXT | Firm's EIN |
| 4 | `firm_confirmation_number` | TEXT | Unique confirmation number assigned to firm |
| 5 | `professional_type` | TEXT | CPA, attorney, compliance, etc. |
| 6 | `firm_city` | TEXT | Firm's city |
| 7 | `firm_state` | TEXT | Firm's state |
| 8 | `firm_profile_completed` | TEXT | Whether firm profile setup is done |
| 9 | `parent_firm_id` | TEXT | GHL contact ID of the parent firm (for client contacts) |
| 10 | `parent_firm_name` | TEXT | Name of the parent firm (for client contacts) |
| 11 | `parent_firm_confirmation` | TEXT | Confirmation number of the parent firm |
| 12 | `ach_account_number_last_4` | TEXT | Last 4 digits of ACH account number |
| 13 | `ach_account_type` | TEXT | "checking" or "savings" |
| 14 | `ach_routing_number_last_4` | TEXT | Last 4 digits of routing number |
| 15 | `ach_billing_street` | TEXT | ACH billing street address |
| 16 | `ach_billing_city` | TEXT | ACH billing city |
| 17 | `ach_billing_state` | TEXT | ACH billing state |
| 18 | `ach_billing_country` | TEXT | ACH billing country |
| 19 | `ach_billing_zip` | TEXT | ACH billing zip code |

---

## Folder 2: NYLTA | Bulk Filing | Order / Submission Tracking

**Folder ID:** `ejqBRb6QeM8IQg7pTPAV`

| # | Custom Field Key | Type | Description |
|---|-----------------|------|-------------|
| 1 | `batch_id` | TEXT | Unique batch identifier for grouped submissions |
| 2 | `order_number` | TEXT | Order number for the transaction |
| 3 | `submission_number` | TEXT | Individual submission number |
| 4 | `submission_date` | TEXT | Date of submission (YYYY-MM-DD) |
| 5 | `submission_status` | TEXT | Current status (Pending, Processing, Complete) |
| 6 | `payment_status` | TEXT | Payment status (Pending, Paid, Failed) |
| 7 | `payment_amount` | TEXT | Dollar amount of payment |
| 8 | `payment_date` | TEXT | Date payment was made |
| 9 | `last_order_number` | TEXT | Most recent order number for the firm |
| 10 | `last_order_date` | TEXT | Date of most recent order |
| 11 | `last_order_amount` | TEXT | Amount of most recent order |
| 12 | `last_order_client_count` | TEXT | Number of clients in the most recent order |
| 13 | `total_orders` | TEXT | Total number of orders placed by this firm |
| 14 | `bulk_service_type` | TEXT | "monitoring", "filing", or "mixed" |
| 15 | `bulk_ip_address` | TEXT | IP address of the submitter |
| 16 | `client_count` | TEXT | Number of clients in this submission |
| 17 | `amount_paid` | TEXT | Total amount paid |
| 18 | `bulk_filing_contact_email` | TEXT | Contact email for bulk filing correspondence |

---

## Folder 3: NYLTA | Bulk Filing | Filing Information

**Folder ID:** `G2r5TJba4JBWhxHQIP78`

| # | Custom Field Key | Type | Values / Format | Description |
|---|-----------------|------|-----------------|-------------|
| 1 | `entity_type` | TEXT | `domestic`, `foreign` | Type of entity |
| 2 | `filing_type` | TEXT | `disclosure`, `exemption` | Type of filing |
| 3 | `service_type` | TEXT | `monitoring`, `filing` | Service level selected |
| 4 | `country_of_formation` | TEXT | | Country where entity was formed |
| 5 | `state_of_formation` | TEXT | | State where entity was formed |
| 6 | `date_of_formation__registration` | TEXT | `YYYY-MM-DD` | Date entity was formed/registered |
| 7 | `date_authority_filed_in_ny` | TEXT | `YYYY-MM-DD` | Date authority was filed in NY (foreign entities only) |
| 8 | `ein` | TEXT | | Employer Identification Number |
| 9 | `legal_business_name` | TEXT | | Legal name of the LLC/entity |
| 10 | `fictitious_name_dba` | TEXT | | DBA / Fictitious name |
| 11 | `ny_dos_id_number` | TEXT | | NY Department of State ID number |
| 12 | `llc_contact_email` | TEXT | | Contact email for the LLC |
| 13 | `company_street_address` | TEXT | | Company street address |
| 14 | `company_city` | TEXT | | Company city |
| 15 | `company_state` | TEXT | | Company state |
| 16 | `company_country` | TEXT | | Company country |
| 17 | `company_zip_code` | TEXT | | Company zip code |
| 18 | `beneficial_owners_count` | TEXT | | Number of beneficial owners |
| 19 | `company_applicants_count` | TEXT | | Number of company applicants |

---

## Folder 4: NYLTA | Bulk Filing | Beneficial Owners

**Folder ID:** `CMngkSX1yJOBZRfWTaiV`

Supports up to **9 beneficial owners** (bo1 through bo9). Replace `{N}` with the owner number (1-9).

| # | Custom Field Key Pattern | Type | Values / Format | Description |
|---|--------------------------|------|-----------------|-------------|
| 1 | `bo{N}__full_name` | TEXT | | Full legal name |
| 2 | `bo{N}__date_of_birth` | TEXT | `YYYY-MM-DD` | Date of birth |
| 3 | `bo{N}__street_address` | TEXT | | Street address |
| 4 | `bo{N}__city` | TEXT | | City |
| 5 | `bo{N}__state` | TEXT | | State |
| 6 | `bo{N}__zip_code` | TEXT | | Zip code |
| 7 | `bo{N}__country` | TEXT | | Country |
| 8 | `bo{N}__address_type` | TEXT | `Residential`, `Business` | Address type |
| 9 | `bo{N}__id_type` | TEXT | | Government ID type |
| 10 | `bo{N}__id_number` | TEXT | | Government ID number |
| 11 | `bo{N}__id_expiration_date` | TEXT | `YYYY-MM-DD` | ID expiration date |
| 12 | `bo{N}__issuing_country` | TEXT | | ID issuing country |
| 13 | `bo{N}__issuing_state` | TEXT | | ID issuing state |
| 14 | `bo{N}__ownership_` | TEXT | | Ownership percentage (note: trailing underscore) |
| 15 | `bo{N}__position__title` | TEXT | | Position or title (note: double underscore before "title") |

### All 135 Beneficial Owner Field Keys (Expanded)

<details>
<summary>Click to expand full list (bo1 through bo9)</summary>

**BO1:**
`bo1__full_name`, `bo1__date_of_birth`, `bo1__street_address`, `bo1__city`, `bo1__state`, `bo1__zip_code`, `bo1__country`, `bo1__address_type`, `bo1__id_type`, `bo1__id_number`, `bo1__id_expiration_date`, `bo1__issuing_country`, `bo1__issuing_state`, `bo1__ownership_`, `bo1__position__title`

**BO2:**
`bo2__full_name`, `bo2__date_of_birth`, `bo2__street_address`, `bo2__city`, `bo2__state`, `bo2__zip_code`, `bo2__country`, `bo2__address_type`, `bo2__id_type`, `bo2__id_number`, `bo2__id_expiration_date`, `bo2__issuing_country`, `bo2__issuing_state`, `bo2__ownership_`, `bo2__position__title`

**BO3:**
`bo3__full_name`, `bo3__date_of_birth`, `bo3__street_address`, `bo3__city`, `bo3__state`, `bo3__zip_code`, `bo3__country`, `bo3__address_type`, `bo3__id_type`, `bo3__id_number`, `bo3__id_expiration_date`, `bo3__issuing_country`, `bo3__issuing_state`, `bo3__ownership_`, `bo3__position__title`

**BO4:**
`bo4__full_name`, `bo4__date_of_birth`, `bo4__street_address`, `bo4__city`, `bo4__state`, `bo4__zip_code`, `bo4__country`, `bo4__address_type`, `bo4__id_type`, `bo4__id_number`, `bo4__id_expiration_date`, `bo4__issuing_country`, `bo4__issuing_state`, `bo4__ownership_`, `bo4__position__title`

**BO5:**
`bo5__full_name`, `bo5__date_of_birth`, `bo5__street_address`, `bo5__city`, `bo5__state`, `bo5__zip_code`, `bo5__country`, `bo5__address_type`, `bo5__id_type`, `bo5__id_number`, `bo5__id_expiration_date`, `bo5__issuing_country`, `bo5__issuing_state`, `bo5__ownership_`, `bo5__position__title`

**BO6:**
`bo6__full_name`, `bo6__date_of_birth`, `bo6__street_address`, `bo6__city`, `bo6__state`, `bo6__zip_code`, `bo6__country`, `bo6__address_type`, `bo6__id_type`, `bo6__id_number`, `bo6__id_expiration_date`, `bo6__issuing_country`, `bo6__issuing_state`, `bo6__ownership_`, `bo6__position__title`

**BO7:**
`bo7__full_name`, `bo7__date_of_birth`, `bo7__street_address`, `bo7__city`, `bo7__state`, `bo7__zip_code`, `bo7__country`, `bo7__address_type`, `bo7__id_type`, `bo7__id_number`, `bo7__id_expiration_date`, `bo7__issuing_country`, `bo7__issuing_state`, `bo7__ownership_`, `bo7__position__title`

**BO8:**
`bo8__full_name`, `bo8__date_of_birth`, `bo8__street_address`, `bo8__city`, `bo8__state`, `bo8__zip_code`, `bo8__country`, `bo8__address_type`, `bo8__id_type`, `bo8__id_number`, `bo8__id_expiration_date`, `bo8__issuing_country`, `bo8__issuing_state`, `bo8__ownership_`, `bo8__position__title`

**BO9:**
`bo9__full_name`, `bo9__date_of_birth`, `bo9__street_address`, `bo9__city`, `bo9__state`, `bo9__zip_code`, `bo9__country`, `bo9__address_type`, `bo9__id_type`, `bo9__id_number`, `bo9__id_expiration_date`, `bo9__issuing_country`, `bo9__issuing_state`, `bo9__ownership_`, `bo9__position__title`

</details>

---

## Folder 5: NYLTA | Bulk Filing | Company Applicants

**Folder ID:** `hN5bDkEhdgVNKcbNlBc2`

Supports up to **3 company applicants** (ca1 through ca3). Replace `{N}` with the applicant number (1-3).

| # | Custom Field Key Pattern | Type | Description |
|---|--------------------------|------|-------------|
| 1 | `ca{N}__full_name` | TEXT | Full legal name |
| 2 | `ca{N}__date_of_birth` | TEXT | Date of birth (YYYY-MM-DD) |
| 3 | `ca{N}__street_address` | TEXT | Street address |
| 4 | `ca{N}__city` | TEXT | City |
| 5 | `ca{N}__state` | TEXT | State |
| 6 | `ca{N}__zip_code` | TEXT | Zip code |
| 7 | `ca{N}__country` | TEXT | Country |
| 8 | `ca{N}__phone` | TEXT | Phone number |
| 9 | `ca{N}__email` | TEXT | Email address |
| 10 | `ca{N}__title_or_role` | TEXT | Title or role |
| 11 | `ca{N}__id_type` | TEXT | Government ID type |
| 12 | `ca{N}__id_number` | TEXT | Government ID number |
| 13 | `ca{N}__id_expiration_date` | TEXT | ID expiration date (YYYY-MM-DD) |
| 14 | `ca{N}__issuing_country` | TEXT | ID issuing country |
| 15 | `ca{N}__issuing_state` | TEXT | ID issuing state |

### All 45 Company Applicant Field Keys (Expanded)

<details>
<summary>Click to expand full list (ca1 through ca3)</summary>

**CA1:**
`ca1__full_name`, `ca1__date_of_birth`, `ca1__street_address`, `ca1__city`, `ca1__state`, `ca1__zip_code`, `ca1__country`, `ca1__phone`, `ca1__email`, `ca1__title_or_role`, `ca1__id_type`, `ca1__id_number`, `ca1__id_expiration_date`, `ca1__issuing_country`, `ca1__issuing_state`

**CA2:**
`ca2__full_name`, `ca2__date_of_birth`, `ca2__street_address`, `ca2__city`, `ca2__state`, `ca2__zip_code`, `ca2__country`, `ca2__phone`, `ca2__email`, `ca2__title_or_role`, `ca2__id_type`, `ca2__id_number`, `ca2__id_expiration_date`, `ca2__issuing_country`, `ca2__issuing_state`

**CA3:**
`ca3__full_name`, `ca3__date_of_birth`, `ca3__street_address`, `ca3__city`, `ca3__state`, `ca3__zip_code`, `ca3__country`, `ca3__phone`, `ca3__email`, `ca3__title_or_role`, `ca3__id_type`, `ca3__id_number`, `ca3__id_expiration_date`, `ca3__issuing_country`, `ca3__issuing_state`

</details>

---

## Folder 6: NYLTA | Bulk Filing | Consents

**Folder ID:** `gvS4YgeUoww5dqZ7V3Or`

| # | Custom Field Key | Type | Format | Description |
|---|-----------------|------|--------|-------------|
| 1 | `attestation_signature` | TEXT | | Base64 signature data or text signature |
| 2 | `attestation_full_name` | TEXT | | Full name of person attesting |
| 3 | `attestation_title` | TEXT | | Title/position of person attesting |
| 4 | `attestation_date` | TEXT | `YYYY-MM-DD` | Date of attestation |
| 5 | `attestation_initials` | TEXT | | Initials of person attesting |

---

## Folder 7: NYLTA | Bulk Filing | Exemption & Attestation

**Folder ID:** `9JmueuzHPqdzNk5Jno4v`

| # | Custom Field Key | Type | Description |
|---|-----------------|------|-------------|
| 1 | `select_exemption_category` | TEXT | Selected exemption category |
| 2 | `explanation__supporting_facts` | LARGE_TEXT | Explanation and supporting facts for exemption |
| 3 | `exemption_attestation__date` | TEXT | Date of exemption attestation (YYYY-MM-DD) |
| 4 | `exemption_attestation__full_name_of_authorized_individual_who_signed` | TEXT | Full name of authorized signer for exemption |
| 5 | `exemption_attestation__position__title` | TEXT | Position/title of authorized signer |

---

## Folder 8: NYLTA | Bulk Filing | Others

**Folder ID:** `plxSWD6yh7tpmHmT1inV`

| # | Custom Field Key | Type | Description |
|---|-----------------|------|-------------|
| 1 | `approximately_how_many_clients_do_you_file_nylta_reports_for_annually` | TEXT | Annual client count (survey) |
| 2 | `how_often_do_you_process_nylta_filings` | TEXT | Filing frequency (survey) |
| 3 | `what_are_your_primary_challenges_with_nylta_compliance` | LARGE_TEXT | Compliance challenges (survey) |
| 4 | `what_features_would_be_most_helpful_to_you_in_a_bulk_filing_system` | LARGE_TEXT | Desired features (survey) |
| 5 | `what_software_or_tools_do_you_currently_use_for_nylta_filing_management` | TEXT | Current tools (survey) |
| 6 | `what_type_of_firm_are_you` | TEXT | Firm type (survey) |

---

## Naming Convention Summary

### Double-Underscore Pattern
GHL uses a **double-underscore** (`__`) as a separator within field names. This is critical and differs from the single-underscore convention previously used in the codebase.

| Pattern | Example | Notes |
|---------|---------|-------|
| Person prefix + field | `bo1__full_name` | Double underscore after person number |
| Multi-word fields | `date_of_birth` | Single underscore between words |
| Compound concepts | `position__title` | Double underscore between concept groups |
| Trailing underscore | `bo1__ownership_` | The `ownership_` field has a trailing underscore |

### Key Differences from Old Codebase (Single-Underscore)

| Old Key (WRONG) | Correct GHL Key | Notes |
|-----------------|-----------------|-------|
| `bo1_full_name` | `bo1__full_name` | Double underscore after prefix |
| `bo1_dob` | `bo1__date_of_birth` | Full field name, double underscore |
| `bo1_ownership_percentage` | `bo1__ownership_` | Trailing underscore, no "percentage" |
| `bo1_position_or_title` | `bo1__position__title` | Double underscore before "title" |
| `ca1_full_name` | `ca1__full_name` | Double underscore after prefix |
| `ca1_dob` | `ca1__date_of_birth` | Full field name |
| `ca1_id_expiration_date` | `ca1__id_expiration_date` | Double underscore after prefix |
| `llc_legal_name` | `legal_business_name` | Completely different key name |
| `nydos_id` | `ny_dos_id_number` | Different key name |
| `formation_date` | `date_of_formation__registration` | Different key name, double underscore |
| `date_authority_filed_ny` | `date_authority_filed_in_ny` | Added "in" |
| `beneficial_owners__count` | `beneficial_owners_count` | Single underscore (no double) |
| `company_applicants__count` | `company_applicants_count` | Single underscore (no double) |
| `exemption_category` | `select_exemption_category` | Added "select_" prefix |
| `exemption_explanation` | `explanation__supporting_facts` | Completely different key name |
| `ach_routing_number` | `ach_routing_number_last_4` | Added "_last_4" suffix |
| `ach_account_number` | `ach_account_number_last_4` | Added "_last_4" suffix |
| `ach_billing_street_address` | `ach_billing_street` | Shortened |
| `ach_billing_zip_code` | `ach_billing_zip` | Shortened |

---

## Submission Payload Structure

Every client contact upsert must follow this exact JSON structure:

```json
{
  "locationId": "QWhUZ1cxgQgSMFYGloyK",
  "firstName": "{LLC_NAME}",
  "lastName": "({SERVICE_TYPE})",
  "email": "{CONTACT_EMAIL}",
  "companyName": "{LLC_NAME}",
  "tags": [
    "client",
    "nylta-llc",
    "firm-{CONFIRMATION_NUMBER}",
    "nylta_submission_complete"
  ],
  "customFields": [
    { "key": "legal_business_name", "field_value": "..." },
    { "key": "entity_type", "field_value": "domestic" },
    { "key": "filing_type", "field_value": "disclosure" },
    { "key": "service_type", "field_value": "filing" },
    { "key": "ein", "field_value": "..." },
    { "key": "date_of_formation__registration", "field_value": "2024-01-15" },
    { "key": "parent_firm_id", "field_value": "..." },
    { "key": "parent_firm_name", "field_value": "..." },
    { "key": "parent_firm_confirmation", "field_value": "..." },
    { "key": "batch_id", "field_value": "..." },
    { "key": "order_number", "field_value": "..." },
    { "key": "bo1__full_name", "field_value": "John Doe" },
    { "key": "bo1__ownership_", "field_value": "50" },
    { "key": "bo1__position__title", "field_value": "Managing Member" },
    { "key": "ca1__full_name", "field_value": "Jane Smith" },
    { "key": "attestation_signature", "field_value": "..." },
    { "key": "attestation_full_name", "field_value": "..." },
    { "key": "select_exemption_category", "field_value": "..." },
    { "key": "explanation__supporting_facts", "field_value": "..." },
    { "key": "exemption_attestation__full_name_of_authorized_individual_who_signed", "field_value": "..." }
  ]
}
```

---

## Tagging Rules

| Tag | When Applied | Purpose |
|-----|-------------|---------|
| `client` | Every client contact | Identifies as client contact |
| `nylta-llc` | Every client contact | Identifies as NYLTA LLC filing |
| `firm-{CONFIRMATION}` | Every client contact | Links client to parent firm |
| `nylta_submission_complete` | Every client contact | Workflow trigger for post-submission |
| `firm` | Firm contacts only | Identifies as firm contact |
| `nylta-bulk-filing` | Firm contacts only | Identifies as bulk filing firm |
| `nylta_new_account` | Firm contacts on creation | Triggers admin approval workflow |
| `nylta_invoice_pending` | Firm contacts on order | Triggers invoice workflow |

---

## Conditional Logic Rules

1. **If `filing_type === "exemption"`**: Hide the entire Company Applicant section. CA fields should not be sent.
2. **If `entity_type === "foreign"`**: `service_type` must be locked to `"filing"` and `date_authority_filed_in_ny` becomes REQUIRED.
3. **All date fields**: Must be formatted as `YYYY-MM-DD` strings before submission.

---

## Deprecated Fields (MUST BE REMOVED from codebase)

These fields exist in the old codebase but are NOT in GHL and must be cleaned up:

| Deprecated Field | Replacement | Notes |
|-----------------|-------------|-------|
| `ssn` | NONE | Never store SSN in CRM |
| `isControlPerson` | NONE | Not a GHL field |
| `isOrganizer` | NONE | Not a GHL field |
| `address` (pipe-delimited) | Individual address fields | Use `street_address`, `city`, `state`, `zip_code`, `country` |
| `role` (on CA) | `ca{N}__title_or_role` | Use the correct GHL key |
| `addressLine1` / `addressLine2` | `street_address` | Single street address field |

---

## Total Custom Field Count

| Folder | Field Count |
|--------|------------|
| Account Details | 19 |
| Order / Submission Tracking | 18 |
| Filing Information | 19 |
| Beneficial Owners (9 x 15) | 135 |
| Company Applicants (3 x 15) | 45 |
| Consents | 5 |
| Exemption & Attestation | 5 |
| Others (Survey) | 6 |
| **TOTAL** | **252** |
