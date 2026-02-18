# GoHighLevel: Create Folders + Custom Fields + Submit Contacts via cURL

This guide gives you a **copy/paste-ready automation prompt + cURL workflow** to:

1. create missing custom field folders,
2. create all required custom fields in the correct folder,
3. submit contacts programmatically with all mapped custom fields and tags.

---

## 1) One Prompt You Can Reuse (for ChatGPT/Codex)

Use this prompt when you want an assistant to generate/refresh your foldered cURL commands from your current field map:

```text
Generate production-safe bash + curl commands for GoHighLevel custom fields for my NYLTA bulk filing workspace.

Requirements:
- API base: https://services.leadconnectorhq.com
- Use headers:
  - Authorization: Bearer $GHL_API_KEY
  - Version: 2021-07-28
  - Content-Type: application/json
- Must first fetch existing custom fields and detect existing folders by name.
- If folder is missing, create it programmatically and capture its ID.
- Then create missing custom fields with exact `key`, `name`, `dataType`, and `parentId` for folder placement.
- Folder names required:
  1) NYLTA | Bulk Filing | Account Details
  2) NYLTA | Bulk Filing | Submissions
  3) NYLTA | Bulk Filing | Beneficial Owners
  4) NYLTA | Bulk Filing | Company Applicants
  5) NYLTA | Bulk Filing | Filing Information
  6) NYLTA | Bulk Filing | Consents
  7) NYLTA | Bulk Filing | Exemptions
  8) NYLTA | Bulk Filing | Others
- Must be idempotent (skip existing keys).
- Include a final verification report grouped by folder.
- Include sample POST /contacts payload with tags and customFields.

Use these key groups from my app mapping:
- Account/firm: account_type, firm_name, firm_ein, firm_confirmation_number, professional_type, account_status, parent_firm_id, parent_firm_name, parent_firm_confirmation
- Filing info: filing_information_-_company_information_-_legal_business_name, filing_information_-_company_information_-_fictitious_name_(dba), filing_information_-_company_information_-_ny_dos_id_number, filing_information_-_company_information_-_ein_/_federal_tax_id, filing_information_-_company_information_-_entity_type, filing_information_-_company_information_-_service_type, filing_information_-_formation_information_-_date_of_formation_/_registration, filing_information_-_formation_information_-_country_of_formation, filing_information_-_formation_information_-_state_of_formation, filing_information_-_formation_information_-_date_application_for_authority_filed_in_new_york, filing_information_-_company_address_-_street_address, filing_information_-_company_address_-_city, filing_information_-_company_address_-_state, filing_information_-_company_address_-_zip_code, filing_information_-_company_address_-_country, bulk_filing_contact_email, bulk_filing_filing_type, beneficial_owners__count, company_applicants__count
- Exemption/consent: select_exemption_category, explanation_/_supporting_facts, attestation_signature, attestation_full_name, attestation_title, attestation_date
- Submission/order: last_order_number, last_order_date, last_order_amount, last_order_client_count, total_orders, bulk_submission_number, bulk_submission_date, bulk_submission_status, bulk_payment_status, bulk_payment_amount, bulk_service_type, bulk_ip_address
- Company applicants: all CA1 keys (company_applicant_-_...) and CA2 keys (company_applicant_2_-_...)
- Beneficial owners: BO1..BO9 using beneficial_owner_-_... and beneficial_owner_2_-_... through beneficial_owner_9_-_... with 15 fields each (full_name, dob, street_address, city, state, zip_code, country, address_type, id_type, id_number, id_expiration_date, issuance_country, issuance_state, ownership_percentage, position_/_title)

Also include workflow tags:
- Account lifecycle: nylta_new_account, bulk_status_pending_approval, role_cpa, role_attorney, role_compliance, role_processor
- Submission: nylta_submission_complete, nylta_invoice_pending, nylta_order_processing, Status: Bulk Filing Submitted, Filing Type: Disclosure, Filing Type: Exemption, Filing Type: Mixed, Priority: High Value
```

---

## 2) Minimal cURL Bootstrap (Programmatic + Foldered)

> Replace values before running.

```bash
export GHL_API_KEY="YOUR_API_KEY"
export GHL_LOCATION_ID="YOUR_LOCATION_ID"
export GHL_BASE_URL="https://services.leadconnectorhq.com"
```

### 2.1 Fetch existing custom fields (and existing folders)

```bash
curl -sS "$GHL_BASE_URL/locations/$GHL_LOCATION_ID/customFields" \
  -H "Authorization: Bearer $GHL_API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json"
```

### 2.2 Create a folder (if your API tenant supports folder creation endpoint)

```bash
curl -sS -X POST "$GHL_BASE_URL/locations/$GHL_LOCATION_ID/customFields/folder" \
  -H "Authorization: Bearer $GHL_API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "NYLTA | Bulk Filing | Filing Information",
    "position": 0
  }'
```

> If your tenant rejects `/customFields/folder`, create the folder once in UI, then use its `id` as `parentId` for field creation.

### 2.3 Create a field into a folder using `parentId`

```bash
curl -sS -X POST "$GHL_BASE_URL/locations/$GHL_LOCATION_ID/customFields" \
  -H "Authorization: Bearer $GHL_API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "Filing Information - Legal Business Name",
    "key": "filing_information_-_company_information_-_legal_business_name",
    "dataType": "TEXT",
    "parentId": "<FOLDER_ID_HERE>",
    "position": 0
  }'
```

---

## 3) Folder Classification to Use

Use this exact grouping for your field creation script:

- **NYLTA | Bulk Filing | Account Details**
  - account_type, professional_type, account_status
  - firm_name, firm_ein, firm_confirmation_number
  - parent_firm_id, parent_firm_name, parent_firm_confirmation
- **NYLTA | Bulk Filing | Filing Information**
  - all `filing_information_-_...` keys
  - bulk_filing_contact_email, bulk_filing_filing_type
  - beneficial_owners__count, company_applicants__count
- **NYLTA | Bulk Filing | Company Applicants**
  - all `company_applicant_-_...`
  - all `company_applicant_2_-_...`
- **NYLTA | Bulk Filing | Beneficial Owners**
  - `beneficial_owner_-_...` through `beneficial_owner_9_-_...`
- **NYLTA | Bulk Filing | Exemptions**
  - select_exemption_category, explanation_/_supporting_facts
- **NYLTA | Bulk Filing | Consents**
  - attestation_signature, attestation_full_name, attestation_title, attestation_date
- **NYLTA | Bulk Filing | Submissions**
  - last_order_number, last_order_date, last_order_amount, last_order_client_count, total_orders
  - bulk_submission_number, bulk_submission_date, bulk_submission_status
  - bulk_payment_status, bulk_payment_amount, bulk_service_type, bulk_ip_address
- **NYLTA | Bulk Filing | Others**
  - Any temporary/admin-only or migration helper fields not used in workflow templates.

---

## 4) Submit Contact Payload Programmatically (Example)

### 4.1 Create/Update firm contact with workflow tags

```bash
curl -sS -X POST "$GHL_BASE_URL/contacts/" \
  -H "Authorization: Bearer $GHL_API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  --data '{
    "locationId": "'$GHL_LOCATION_ID'",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "companyName": "Doe Compliance LLC",
    "tags": ["firm", "nylta-bulk-filing", "nylta_new_account", "bulk_status_pending_approval", "role_cpa"],
    "customFields": [
      {"key":"account_type","field_value":"firm"},
      {"key":"professional_type","field_value":"CPA"},
      {"key":"account_status","field_value":"Pending Approval"},
      {"key":"firm_name","field_value":"Doe Compliance LLC"},
      {"key":"firm_ein","field_value":"12-3456789"}
    ]
  }'
```

### 4.2 Update order/submission tracking fields (includes IP)

```bash
curl -sS -X PUT "$GHL_BASE_URL/contacts/<FIRM_CONTACT_ID>" \
  -H "Authorization: Bearer $GHL_API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  --data '{
    "tags": [
      "nylta_submission_complete",
      "nylta_invoice_pending",
      "nylta_order_processing",
      "Status: Bulk Filing Submitted",
      "Filings: 12",
      "Filing Type: Mixed"
    ],
    "customFields": [
      {"key":"bulk_submission_number","field_value":"SUB-20260218123001"},
      {"key":"bulk_submission_date","field_value":"2026-02-18"},
      {"key":"bulk_submission_status","field_value":"Pending"},
      {"key":"bulk_payment_status","field_value":"Pending"},
      {"key":"bulk_payment_amount","field_value":"4776"},
      {"key":"bulk_service_type","field_value":"mixed"},
      {"key":"bulk_ip_address","field_value":"203.0.113.10"}
    ]
  }'
```

---

## 5) Important Notes

- Keep **field keys exact** to match app code in `src/utils/highlevelContacts.ts`.
- Folder placement in API uses `parentId` (folder ID).
- If folder-creation endpoint is unavailable on your tenant, create folders once via UI, then run field creation cURL with `parentId`.
- For BO fields, create all 9 sets (BO1..BO9) with consistent key patterns.
