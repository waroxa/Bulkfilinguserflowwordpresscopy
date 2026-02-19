# GoHighLevel Complete Setup Guide for NYLTA Bulk Filing System

## Overview

This document contains ALL custom fields, tags, and workflows that must be created in the GoHighLevel (RewardLion CRM) UI to support the NYLTA Bulk Filing application.

**KEY NAMING CONVENTION:** All field keys use Maria's simplified format (e.g., `ca1_full_name` not `company_applicant_-_full_legal_name`).

**Integration Files:**
- `/utils/highlevel.ts` — Signup contact creation (uses hardcoded field IDs)
- `/utils/highlevelContacts.ts` — Submission flow: firm contacts, client contacts, order confirmation (uses simplified field keys)
- `/utils/highlevelApiKeys.ts` — API key management with environment switcher

---

## 1. CUSTOM FIELDS TO CREATE (~232 total)

### FOLDER: Account Information (6 fields)
*Source: `/utils/highlevel.ts` — signup/upsert flow using field IDs*

| # | Field Name | Field Key | GHL Field ID | Type | Notes |
|---|-----------|-----------|-------------|------|-------|
| 1 | Account Status | `account_status` | `QPQCb7cCLTOIwJe1Z5Ga` | Multiple Options | Pending / Approved / Rejected |
| 2 | Account Type | `account_type` | `mkk0bFNhEkVuymkCsdsa` | Text | "firm" or "client" |
| 3 | Professional Type | `professional_type` | `HuUznPV2qotnywk87Igu` | Text | CPA / Attorney / Compliance / Processor |
| 4 | SMS Consent | `sms_consent` | `aaEG7lpUBE6UPfsN9AAy` | Single Options | "Yes" / "No" |
| 5 | Email Marketing Consent | `email_marketing_consent` | `gmpkdmeewuCFVBaSiGA8` | Single Options | "Yes" / "No" |
| 6 | Firm Profile Completed | `firm_profile_completed` | `GyeqdV8Sr9mDkEW2HScI` | Text | "true" / "false" |

### FOLDER: Firm Information (11 fields)
*Source: `/utils/highlevelContacts.ts` → `createFirmContact()`*

| # | Field Name | Field Key | Type | Notes |
|---|-----------|-----------|------|-------|
| 7 | Firm Name | `firm_name` | Text | |
| 8 | Contact Name | `contact_name` | Text | Full name of primary contact |
| 9 | Contact Email | `contact_email` | Text | |
| 10 | Contact Phone | `contact_phone` | Text | |
| 11 | Firm EIN | `firm_ein` | Text | |
| 12 | Firm Street Address | `firm_street_address` | Text | |
| 13 | Firm City | `firm_city` | Text | |
| 14 | Firm State | `firm_state` | Text | |
| 15 | Firm ZIP Code | `firm_zip_code` | Text | |
| 16 | Firm Country | `firm_country` | Text | Default "United States" |
| 17 | Firm Confirmation Number | `firm_confirmation_number` | Text | Auto-generated |

### FOLDER: Parent Firm Linkage (3 fields)
*Source: `/utils/highlevelContacts.ts` → `createClientContact()` — on client contacts*

| # | Field Name | Field Key | Type | Notes |
|---|-----------|-----------|------|-------|
| 18 | Parent Firm ID | `parent_firm_id` | Text | GHL contact ID of parent firm |
| 19 | Parent Firm Name | `parent_firm_name` | Text | |
| 20 | Parent Firm Confirmation | `parent_firm_confirmation` | Text | Links client to firm |

### FOLDER: LLC / Client Information (6 fields)
*Source: `/utils/highlevelContacts.ts` → `createClientContact()`*

| # | Field Name | Field Key | Type | Notes |
|---|-----------|-----------|------|-------|
| 21 | LLC Legal Name | `llc_legal_name` | Text | |
| 22 | Fictitious Name / DBA | `fictitious_name_dba` | Text | |
| 23 | NY DOS ID | `nydos_id` | Text | |
| 24 | EIN | `ein` | Text | Federal Tax ID |
| 25 | Entity Type | `entity_type` | Text | "domestic" or "foreign" |
| 26 | Service Type | `service_type` | Text | "monitoring" or "filing" |

### FOLDER: Company Address (5 fields)

| # | Field Name | Field Key | Type | Notes |
|---|-----------|-----------|------|-------|
| 27 | Company Street Address | `company_street_address` | Text | |
| 28 | Company City | `company_city` | Text | |
| 29 | Company State | `company_state` | Text | |
| 30 | Company ZIP Code | `company_zip_code` | Text | |
| 31 | Company Country | `company_country` | Text | |

### FOLDER: Formation Information (4 fields)

| # | Field Name | Field Key | Type | Notes |
|---|-----------|-----------|------|-------|
| 32 | Formation Date | `formation_date` | Text | |
| 33 | Country of Formation | `country_of_formation` | Text | |
| 34 | State of Formation | `state_of_formation` | Text | |
| 35 | Date Authority Filed in NY | `date_authority_filed_ny` | Text | Foreign entities only |

### FOLDER: Contact & Counts (4 fields)

| # | Field Name | Field Key | Type | Notes |
|---|-----------|-----------|------|-------|
| 36 | LLC Contact Email | `llc_contact_email` | Text | |
| 37 | Filing Type | `filing_type` | Text | "disclosure" or "exemption" |
| 38 | Beneficial Owners Count | `beneficial_owners__count` | Text | 0-9 |
| 39 | Company Applicants Count | `company_applicants__count` | Text | 0-3 |

### FOLDER: Exemption Information (2 fields)
*Only populated for exemption filings*

| # | Field Name | Field Key | Type | Notes |
|---|-----------|-----------|------|-------|
| 40 | Exemption Category | `exemption_category` | Text | |
| 41 | Exemption Explanation | `exemption_explanation` | Text | |

### FOLDER: Company Applicant 1 (15 fields)

| # | Field Name | Field Key | Type | Notes |
|---|-----------|-----------|------|-------|
| 42 | CA1 - Full Name | `ca1_full_name` | Text | |
| 43 | CA1 - Date of Birth | `ca1_dob` | Text | |
| 44 | CA1 - Street Address | `ca1_street_address` | Text | |
| 45 | CA1 - City | `ca1_city` | Text | |
| 46 | CA1 - State | `ca1_state` | Text | |
| 47 | CA1 - ZIP Code | `ca1_zip_code` | Text | |
| 48 | CA1 - Country | `ca1_country` | Text | |
| 49 | CA1 - ID Type | `ca1_id_type` | Text | SSN / Driver License / Passport / State ID / Foreign Passport |
| 50 | CA1 - ID Number | `ca1_id_number` | Text | |
| 51 | CA1 - ID Expiration Date | `ca1_id_expiration_date` | Text | |
| 52 | CA1 - Issuing Country | `ca1_issuing_country` | Text | |
| 53 | CA1 - Issuing State | `ca1_issuing_state` | Text | |
| 54 | CA1 - Title or Role | `ca1_title_or_role` | Text | |
| 55 | CA1 - Phone | `ca1_phone` | Text | |
| 56 | CA1 - Email | `ca1_email` | Text | |

### FOLDER: Company Applicant 2 (15 fields)
*Same structure, prefix `ca2_`*

| # | Field Name | Field Key | Type |
|---|-----------|-----------|------|
| 57 | CA2 - Full Name | `ca2_full_name` | Text |
| 58 | CA2 - Date of Birth | `ca2_dob` | Text |
| 59 | CA2 - Street Address | `ca2_street_address` | Text |
| 60 | CA2 - City | `ca2_city` | Text |
| 61 | CA2 - State | `ca2_state` | Text |
| 62 | CA2 - ZIP Code | `ca2_zip_code` | Text |
| 63 | CA2 - Country | `ca2_country` | Text |
| 64 | CA2 - ID Type | `ca2_id_type` | Text |
| 65 | CA2 - ID Number | `ca2_id_number` | Text |
| 66 | CA2 - ID Expiration Date | `ca2_id_expiration_date` | Text |
| 67 | CA2 - Issuing Country | `ca2_issuing_country` | Text |
| 68 | CA2 - Issuing State | `ca2_issuing_state` | Text |
| 69 | CA2 - Title or Role | `ca2_title_or_role` | Text |
| 70 | CA2 - Phone | `ca2_phone` | Text |
| 71 | CA2 - Email | `ca2_email` | Text |

### FOLDER: Company Applicant 3 (15 fields) — NEW
*Same structure, prefix `ca3_`*

| # | Field Name | Field Key | Type |
|---|-----------|-----------|------|
| 72 | CA3 - Full Name | `ca3_full_name` | Text |
| 73 | CA3 - Date of Birth | `ca3_dob` | Text |
| 74 | CA3 - Street Address | `ca3_street_address` | Text |
| 75 | CA3 - City | `ca3_city` | Text |
| 76 | CA3 - State | `ca3_state` | Text |
| 77 | CA3 - ZIP Code | `ca3_zip_code` | Text |
| 78 | CA3 - Country | `ca3_country` | Text |
| 79 | CA3 - ID Type | `ca3_id_type` | Text |
| 80 | CA3 - ID Number | `ca3_id_number` | Text |
| 81 | CA3 - ID Expiration Date | `ca3_id_expiration_date` | Text |
| 82 | CA3 - Issuing Country | `ca3_issuing_country` | Text |
| 83 | CA3 - Issuing State | `ca3_issuing_state` | Text |
| 84 | CA3 - Title or Role | `ca3_title_or_role` | Text |
| 85 | CA3 - Phone | `ca3_phone` | Text |
| 86 | CA3 - Email | `ca3_email` | Text |

### FOLDER: Beneficial Owner 1 (15 fields) — Repeat for BOs 2-9

| # | Field Name | Field Key | Type | Notes |
|---|-----------|-----------|------|-------|
| 87 | BO1 - Full Name | `bo1_full_name` | Text | |
| 88 | BO1 - Date of Birth | `bo1_dob` | Text | |
| 89 | BO1 - Street Address | `bo1_street_address` | Text | |
| 90 | BO1 - City | `bo1_city` | Text | |
| 91 | BO1 - State | `bo1_state` | Text | |
| 92 | BO1 - ZIP Code | `bo1_zip_code` | Text | |
| 93 | BO1 - Country | `bo1_country` | Text | |
| 94 | BO1 - Address Type | `bo1_address_type` | Text | Residential / Business |
| 95 | BO1 - ID Type | `bo1_id_type` | Text | |
| 96 | BO1 - ID Number | `bo1_id_number` | Text | |
| 97 | BO1 - ID Expiration Date | `bo1_id_expiration_date` | Text | |
| 98 | BO1 - Issuing Country | `bo1_issuing_country` | Text | |
| 99 | BO1 - Issuing State | `bo1_issuing_state` | Text | |
| 100 | BO1 - Ownership % | `bo1_ownership_percentage` | Text | 0-100 |
| 101 | BO1 - Position / Title | `bo1_position_or_title` | Text | |

**REPEAT for Beneficial Owners 2-9** using prefix pattern:
- BO2: `bo2_full_name`, `bo2_dob`, `bo2_street_address`, ... `bo2_position_or_title`
- BO3: `bo3_*`
- BO4: `bo4_*`
- BO5: `bo5_*`
- BO6: `bo6_*`
- BO7: `bo7_*`
- BO8: `bo8_*`
- BO9: `bo9_*`

Each BO has 15 fields = **135 fields for BOs 1-9 total**

### FOLDER: Attestation Information (4 fields)

| # | Field Name | Field Key | Type | Notes |
|---|-----------|-----------|------|-------|
| 102 | Attestation Signature | `attestation_signature` | Text | Signature data |
| 103 | Attestation Initials | `attestation_initials` | Text | **NEW** — from ACH payment authorization |
| 104 | Attestation Title | `attestation_title` | Text | Signer's title/role |
| 105 | Attestation Date | `attestation_date` | Text | ISO date string |

### FOLDER: Order / Submission Tracking (10 fields)

| # | Field Name | Field Key | Type | Notes |
|---|-----------|-----------|------|-------|
| 106 | Order Number | `order_number` | Text | Transaction ID or ORDER-{confirmation} |
| 107 | Submission Date | `submission_date` | Text | ISO timestamp |
| 108 | Payment Date | `payment_date` | Text | **NEW** — when payment was submitted |
| 109 | Amount Paid | `amount_paid` | Text | Dollar amount |
| 110 | Client Count | `client_count` | Text | Number of clients in order |
| 111 | Batch ID | `batch_id` | Text | **NEW** — confirmation/reference number |
| 112 | Bulk Service Type | `bulk_service_type` | Text | monitoring / filing / mixed |
| 113 | Submission Status | `submission_status` | Text | Pending / Processing / Completed |
| 114 | Payment Status | `payment_status` | Text | Pending / Paid / Failed |
| 115 | Bulk IP Address | `bulk_ip_address` | Text | Submitter's IP |

### FOLDER: ACH Payment Information (8 fields) — NEW
*Stored on firm contact via order confirmation. Account/routing numbers are MASKED (last 4 only).*

| # | Field Name | Field Key | Type | Notes |
|---|-----------|-----------|------|-------|
| 116 | ACH Routing Number | `ach_routing_number` | Text | MASKED: `****1234` (last 4 only) |
| 117 | ACH Account Number | `ach_account_number` | Text | MASKED: `****5678` (last 4 only) |
| 118 | ACH Account Type | `ach_account_type` | Text | checking / savings |
| 119 | ACH Billing Street | `ach_billing_street_address` | Text | |
| 120 | ACH Billing City | `ach_billing_city` | Text | |
| 121 | ACH Billing State | `ach_billing_state` | Text | |
| 122 | ACH Billing ZIP | `ach_billing_zip_code` | Text | |
| 123 | ACH Billing Country | `ach_billing_country` | Text | Default "United States" |

### TOTAL FIELD COUNT SUMMARY
| Category | Count |
|----------|-------|
| Account Information | 6 |
| Firm Information | 11 |
| Parent Firm Linkage | 3 |
| LLC / Client Information | 6 |
| Company Address | 5 |
| Formation Information | 4 |
| Contact & Counts | 4 |
| Exemption | 2 |
| Company Applicant 1 | 15 |
| Company Applicant 2 | 15 |
| Company Applicant 3 (NEW) | 15 |
| Beneficial Owners 1-9 (15 each) | 135 |
| Attestation | 4 |
| Order/Submission Tracking | 10 |
| ACH Payment Info (NEW) | 8 |
| **GRAND TOTAL** | **~243** |

---

## 2. TAGS TO CREATE

### Account Lifecycle Tags
| Tag | When Applied | Used By Workflow |
|-----|-------------|-----------------|
| `nylta_new_account` | User creates account (signup) | Workflow 1 - triggers admin approval flow |
| `bulk_status_pending_approval` | User creates account | Workflow 1 - initial status |
| `nylta_account_approved` | Admin approves account | Workflow 1 - triggers welcome email |
| `nylta_account_rejected` | Admin rejects account | Workflow 1 - triggers rejection email |
| `role_cpa` | User selects CPA role | Segmentation |
| `role_attorney` | User selects Attorney role | Segmentation |
| `role_compliance` | User selects Compliance role | Segmentation |
| `role_processor` | User selects Processor role | Segmentation |

### Submission & Order Tags
| Tag | When Applied | Used By Workflow |
|-----|-------------|-----------------|
| `nylta_submission_complete` | User completes submission | Workflow 2 & 3 - triggers invoice + admin notification |
| `nylta_invoice_pending` | After submission | Workflow 2 - for invoice generation |
| `nylta_payment_received` | Payment confirmed | Internal tracking |
| `nylta_order_processing` | Order is being processed | Internal tracking |
| `nylta_order_completed` | Filing completed | Internal tracking |

### Entity Classification Tags (applied to client contacts)
| Tag | When Applied | Notes |
|-----|-------------|-------|
| `firm` | Firm contact created | Identifies firm-level contacts |
| `nylta-bulk-filing` | Firm contact created | Marks as bulk filing user |
| `client` | Client contact created | Identifies client/LLC contacts |
| `nylta-llc` | Client contact created | Marks as LLC entity |
| `firm-{confirmation}` | Client contact created | Links client to parent firm |
| `monitoring` | Client is Compliance Monitoring | Service tier |
| `filing` | Client is Bulk Filing | Service tier |
| `domestic` | Entity formed in USA | Entity type |
| `foreign` | Entity formed outside USA | Entity type |
| `disclosure` | Full beneficial ownership disclosure | Filing path |
| `exemption` | Claims exemption | Filing path |

### Status Tags (applied during submission)
| Tag | When Applied | Notes |
|-----|-------------|-------|
| `Status: Bulk Filing Submitted` | After submission | |
| `Filings: {count}` | After submission | e.g., `Filings: 15` |
| `Filing Type: Disclosure` | All clients are disclosure | |
| `Filing Type: Exemption` | All clients are exemption | |
| `Filing Type: Mixed` | Mix of disclosure + exemption | |
| `Priority: High Value` | Total amount > $5,000 | Priority processing |

### TOTAL: ~30 unique tags

---

## 3. WORKFLOW 1: New Account + Admin Approval

### Trigger
- **Trigger Type:** Tag Added
- **Tag:** `nylta_new_account`

### Steps

```
STEP 1: Internal Notification (Email to Admin)
  To: tiffany@nylta.com (and ryan@nylta.com)
  Subject: "New NYLTA Account Pending Approval - {{contact.company_name}}"
  Body:
    A new account has been created and needs your approval.

    Contact: {{contact.first_name}} {{contact.last_name}}
    Email: {{contact.email}}
    Phone: {{contact.phone}}
    Company: {{contact.company_name}}
    Professional Type: {{contact.professional_type}}
    Account Type: {{contact.account_type}}

    Dashboard URL: https://nylta.com/admin

STEP 2: Wait for tag: "nylta_account_approved"

STEP 3: Update "Account Status" to "Approved"

STEP 4: Send Email - Welcome + Password Reset
  Subject: "Welcome to NYLTA - Your Account Has Been Approved!"
  From: NYLTA Compliance Team <compliance@nylta.com>

STEP 5 (OPTIONAL): If tag "nylta_account_rejected" → Send rejection email
```

---

## 4. WORKFLOW 2: Submission Complete + Invoice

### Trigger
- **Trigger Type:** Tag Added
- **Tag:** `nylta_submission_complete`

### Steps

```
STEP 1: Wait 2 minutes (allow data sync)

STEP 2: Send Email - Invoice
  Subject: "NYLTA Filing Invoice - Order {{contact.order_number}}"
  Body uses: {{contact.order_number}}, {{contact.submission_date}},
    {{contact.amount_paid}}, {{contact.client_count}}, {{contact.bulk_service_type}}

STEP 3: Add Tag "nylta_invoice_pending"
```

---

## 5. WORKFLOW 3: Admin Notification - New Order

### Trigger
- **Trigger Type:** Tag Added
- **Tag:** `nylta_submission_complete`

### Steps

```
STEP 1: Email to tiffany@nylta.com, ryan@nylta.com
  Subject: "NEW ORDER - {{contact.company_name}} - {{contact.client_count}} Filings"
  Body uses: {{contact.order_number}}, {{contact.amount_paid}},
    {{contact.client_count}}, {{contact.bulk_service_type}}, {{contact.batch_id}}

STEP 2 (OPTIONAL): SMS to admin

STEP 3: Add Tag "nylta_order_processing"
```

---

## 6. QUICK CHECKLIST

### Before Going Live:
- [ ] Create all 6 Account Information custom fields
- [ ] Create all 11 Firm Information custom fields
- [ ] Create all 3 Parent Firm Linkage custom fields
- [ ] Create all 6 LLC / Client Information custom fields
- [ ] Create all 5 Company Address custom fields
- [ ] Create all 4 Formation Information custom fields
- [ ] Create all 4 Contact & Counts custom fields
- [ ] Create both Exemption custom fields
- [ ] Create all 15 Company Applicant 1 custom fields (ca1_*)
- [ ] Create all 15 Company Applicant 2 custom fields (ca2_*)
- [ ] Create all 15 Company Applicant 3 custom fields (ca3_*) — NEW
- [ ] Create all 15 x 9 = 135 Beneficial Owner custom fields (bo1_* through bo9_*)
- [ ] Create all 4 Attestation custom fields
- [ ] Create all 10 Order/Submission Tracking custom fields
- [ ] Create all 8 ACH Payment custom fields — NEW
- [ ] Create all ~30 tags listed above
- [ ] Build Workflow 1: New Account + Admin Approval
- [ ] Build Workflow 2: Submission Complete + Invoice
- [ ] Build Workflow 3: Admin Notification - New Order
- [ ] Test with staging environment using Environment Switcher
- [ ] Verify all field keys match between code and GoHighLevel

### Workflow Trigger Summary:
| Event | Tag Added | Workflows Triggered |
|-------|-----------|-------------------|
| User signs up | `nylta_new_account` | Workflow 1 (Admin approval) |
| Admin approves | `nylta_account_approved` | Workflow 1 (Welcome email) |
| Admin rejects | `nylta_account_rejected` | Workflow 1 (Rejection email) |
| User submits filings | `nylta_submission_complete` | Workflow 2 (Invoice) + Workflow 3 (Admin alert) |
