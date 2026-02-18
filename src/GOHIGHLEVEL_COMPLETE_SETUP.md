_2_-_identity_verification_-_issuance_country` | Text | |
| 63 | CA2 - Issuance State | `company_applicant_2_-_identity_verification_-_issuance_state` | Text | |
| 64 | CA2 - Title or Role | `company_applicant_2_-_title_or_role` | Text | |
| 65 | CA2 - Phone | `company_applicant_2_-_phone_number` | Text | **NEW** |
| 66 | CA2 - Email | `company_applicant_2_-_email` | Text | **NEW** |

### FOLDER: Beneficial Owner 1 (13 fields) - Repeat structure for BOs 2-9
| # | Field Name | Field Key | Type | Notes |
|---|-----------|-----------|------|-------|
| 67 | BO1 - Full Name | `beneficial_owner_-_information_-_full_name` | Text | |
| 68 | BO1 - Date of Birth | `beneficial_owner_-_information_-_date_of_birth` | Text | |
| 69 | BO1 - Street Address | `beneficial_owner_-_current_address_-_street_address` | Text | Parsed from pipe-delimited |
| 70 | BO1 - City | `beneficial_owner_-_current_address_-_city` | Text | **NEW** - parsed |
| 71 | BO1 - State | `beneficial_owner_-_current_address_-_state` | Text | **NEW** - parsed |
| 72 | BO1 - ZIP Code | `beneficial_owner_-_current_address_-_zip_code` | Text | **NEW** - parsed |
| 73 | BO1 - Country | `beneficial_owner_-_current_address_-_country` | Text | **NEW** - parsed |
| 74 | BO1 - Address Type | `beneficial_owner_-_current_address_-_address_type` | Text | **NEW** - Residential/Business |
| 75 | BO1 - ID Type | `beneficial_owner_-_identity_verification_-_what_type_of_id_are_you_providing?` | Text | |
| 76 | BO1 - ID Number | `beneficial_owner_-_identity_verification_-_id_number` | Text | |
| 77 | BO1 - ID Expiration Date | `beneficial_owner_-_identity_verification_-_id_expiration_date` | Text | **NEW** |
| 78 | BO1 - Issuance Country | `beneficial_owner_-_identity_verification_-_issuance_country` | Text | |
| 79 | BO1 - Issuance State | `beneficial_owner_-_identity_verification_-_issuance_state` | Text | |
| 80 | BO1 - Ownership % | `beneficial_owner_-_current_address_-_ownership_percentage` | Text | |
| 81 | BO1 - Position / Title | `beneficial_owner_-_current_address_-_position_/_title` | Text | |

**REPEAT for Beneficial Owners 2-9** using prefix pattern:
- BO2: `beneficial_owner_2_-_...`
- BO3: `beneficial_owner_3_-_...`
- BO4: `beneficial_owner_4_-_...`
- BO5: `beneficial_owner_5_-_...`
- BO6: `beneficial_owner_6_-_...`
- BO7: `beneficial_owner_7_-_...`
- BO8: `beneficial_owner_8_-_...`
- BO9: `beneficial_owner_9_-_...`

Each BO has the same 15 fields = **135 fields for BOs 1-9 total**

### FOLDER: Attestation Information (4 fields)
| # | Field Name | Field Key | Type | Notes |
|---|-----------|-----------|------|-------|
| 82 | Attestation Signature | `attestation_signature` | Text | **NEW** - Signature data |
| 83 | Attestation Full Name | `attestation_full_name` | Text | **NEW** - Signer's name |
| 84 | Attestation Title | `attestation_title` | Text | **NEW** - Signer's title |
| 85 | Attestation Date | `attestation_date` | Text | **NEW** - ISO date string |

### FOLDER: Order / Submission Tracking (10 fields)
| # | Field Name | Field Key | Type | Notes |
|---|-----------|-----------|------|-------|
| 86 | Last Order Number | `last_order_number` | Text | Most recent order ID |
| 87 | Last Order Date | `last_order_date` | Text | Date of last order |
| 88 | Last Order Amount | `last_order_amount` | Text | Dollar amount |
| 89 | Last Order Client Count | `last_order_client_count` | Text | Number of clients in order |
| 90 | Total Orders | `total_orders` | Text | Running total |
| 91 | Submission Number | `bulk_submission_number` | Text | SUB-YYYYMMDDHHMMSS |
| 92 | Submission Date | `bulk_submission_date` | Text | YYYY-MM-DD |
| 93 | Submission Status | `bulk_submission_status` | Text | Pending/Processing/Completed |
| 94 | Payment Status | `bulk_payment_status` | Text | Pending/Paid/Failed |
| 95 | Payment Amount | `bulk_payment_amount` | Text | Total dollar amount |
| 96 | Bulk Service Type | `bulk_service_type` | Text | Monitoring/Filing/Mixed |
| 97 | Bulk IP Address | `bulk_ip_address` | Text | Submitter's IP |

### TOTAL FIELD COUNT SUMMARY
| Category | Count |
|----------|-------|
| Account Information | 6 |
| Firm Information | 6 |
| Parent Firm Linkage | 3 |
| Company Information | 6 |
| Company Address | 5 |
| Formation Information | 4 |
| Contact & Counts | 4 |
| Exemption | 2 |
| Company Applicant 1 | 15 |
| Company Applicant 2 | 15 |
| Beneficial Owners 1-9 (15 each) | 135 |
| Attestation | 4 |
| Order/Submission Tracking | 12 |
| **GRAND TOTAL** | **~217** |

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

### Purpose
When a new user signs up on NYLTA.com, admins (Tiffany) are notified to review and approve/reject the account. Once approved, GoHighLevel sends the user a welcome email with a password reset link.

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
    Created: {{contact.date_created}}

    Please log into the NYLTA Admin Dashboard to approve or reject this account.
    Dashboard URL: https://nylta.com/admin

STEP 2: Wait
  Wait for tag: "nylta_account_approved"
  (This tag is added when admin clicks "Approve" in the Admin Dashboard)

STEP 3: Update Custom Field
  Set "Account Status" to "Approved"

STEP 4: Send Email - Welcome + Password Reset
  Subject: "Welcome to NYLTA - Your Account Has Been Approved!"
  From: NYLTA Compliance Team <compliance@nylta.com>
  Body:
    Dear {{contact.first_name}},

    Great news! Your NYLTA Bulk Filing account has been approved.

    ACCOUNT DETAILS:
    - Name: {{contact.first_name}} {{contact.last_name}}
    - Email: {{contact.email}}
    - Company: {{contact.company_name}}
    - Account Type: {{contact.account_type}}

    NEXT STEPS:
    1. Click the link below to set your password
    2. Complete your Firm Profile
    3. Start filing for your clients

    Set Your Password: [INSERT PASSWORD RESET LINK]
    Login URL: https://nylta.com/login

    If you have any questions, reply to this email or contact us at support@nylta.com.

    Best regards,
    NYLTA Compliance Team

STEP 5 (OPTIONAL BRANCH): If tag "nylta_account_rejected" is added instead
  Send Email - Rejection Notice
  Subject: "NYLTA Account Status Update"
  Body:
    Dear {{contact.first_name}},

    We regret to inform you that your NYLTA account application
    for {{contact.company_name}} was not approved at this time.

    If you believe this was in error, please contact support@nylta.com.

    Best regards,
    NYLTA Compliance Team
```

### Custom Fields Used in This Workflow
- `{{contact.first_name}}` - Built-in
- `{{contact.last_name}}` - Built-in
- `{{contact.email}}` - Built-in
- `{{contact.phone}}` - Built-in
- `{{contact.company_name}}` - Built-in
- `{{contact.professional_type}}` - Custom field
- `{{contact.account_type}}` - Custom field
- `{{contact.account_status}}` - Custom field

---

## 4. WORKFLOW 2: Submission Complete + Invoice

### Purpose
When a user submits all their filings, GoHighLevel sends them an invoice email with order details.

### Trigger
- **Trigger Type:** Tag Added
- **Tag:** `nylta_submission_complete`

### Steps

```
STEP 1: Wait 2 minutes
  (Allow all data to finish syncing)

STEP 2: Send Email - Invoice / Order Confirmation
  Subject: "NYLTA Filing Invoice - Order {{contact.last_order_number}}"
  From: NYLTA Billing <billing@nylta.com>
  Body:
    Dear {{contact.first_name}},

    Thank you for your submission. Below is your invoice.

    ============================================
    INVOICE
    ============================================

    Order Number: {{contact.last_order_number}}
    Date: {{contact.last_order_date}}
    Firm: {{contact.company_name}}

    Number of Filings: {{contact.last_order_client_count}}
    Service Type: {{contact.bulk_service_type}}

    TOTAL DUE: ${{contact.last_order_amount}}

    ============================================

    PAYMENT INFORMATION:
    Payment is due within 30 days of this invoice.
    For questions about this invoice, contact billing@nylta.com.

    WHAT HAPPENS NEXT:
    1. Our team will review your submission
    2. Filings will be prepared and submitted to NYDOS
    3. You will receive confirmation once filings are complete

    Thank you for choosing NYLTA.

    Best regards,
    NYLTA Billing Department

STEP 3: Add Tag
  Tag: "nylta_invoice_pending"

STEP 4 (OPTIONAL): Create Invoice in GoHighLevel
  If using GoHighLevel's built-in invoicing:
  - Amount: {{contact.last_order_amount}}
  - Description: "NYLTA Bulk Filing - {{contact.last_order_client_count}} filings"
```

### Custom Fields Used in This Workflow
- `{{contact.last_order_number}}` - Custom field
- `{{contact.last_order_date}}` - Custom field
- `{{contact.last_order_amount}}` - Custom field
- `{{contact.last_order_client_count}}` - Custom field
- `{{contact.bulk_service_type}}` - Custom field
- `{{contact.company_name}}` - Built-in

---

## 5. WORKFLOW 3: Admin Notification - New Order

### Purpose
Notify admins (Tiffany and Ryan) when a new order has been placed so they can begin processing.

### Trigger
- **Trigger Type:** Tag Added
- **Tag:** `nylta_submission_complete`

### Steps

```
STEP 1: Internal Notification (Email to Admin)
  To: tiffany@nylta.com, ryan@nylta.com
  Subject: "NEW ORDER - {{contact.company_name}} - {{contact.last_order_client_count}} Filings"
  Body:
    A new bulk filing order has been placed!

    ORDER DETAILS:
    - Order Number: {{contact.last_order_number}}
    - Firm: {{contact.company_name}}
    - Contact: {{contact.first_name}} {{contact.last_name}}
    - Email: {{contact.email}}
    - Phone: {{contact.phone}}

    FILING DETAILS:
    - Number of Filings: {{contact.last_order_client_count}}
    - Service Type: {{contact.bulk_service_type}}
    - Total Amount: ${{contact.last_order_amount}}
    - Submitted: {{contact.last_order_date}}

    Please log into the Admin Dashboard to review and process this order.
    Dashboard: https://nylta.com/admin

STEP 2 (OPTIONAL): Send SMS to Admin
  To: Admin phone number
  Message: "NEW NYLTA ORDER: {{contact.company_name}} - {{contact.last_order_client_count}} filings (${{contact.last_order_amount}}). Check admin dashboard."

STEP 3: Add Tag
  Tag: "nylta_order_processing"
```

---

## 6. QUICK CHECKLIST

### Before Going Live:
- [ ] Create all 6 Account Information custom fields
- [ ] Create all 6 Firm Information custom fields
- [ ] Create all 3 Parent Firm Linkage custom fields
- [ ] Create all 6 Company Information custom fields
- [ ] Create all 5 Company Address custom fields
- [ ] Create all 4 Formation Information custom fields
- [ ] Create all 4 Contact & Counts custom fields
- [ ] Create both Exemption custom fields
- [ ] Create all 15 Company Applicant 1 custom fields
- [ ] Create all 15 Company Applicant 2 custom fields
- [ ] Create all 15 x 9 = 135 Beneficial Owner custom fields
- [ ] Create all 4 Attestation custom fields
- [ ] Create all 12 Order/Submission Tracking custom fields
- [ ] Create all ~30 tags listed above
- [ ] Build Workflow 1: New Account + Admin Approval
- [ ] Build Workflow 2: Submission Complete + Invoice
- [ ] Build Workflow 3: Admin Notification - New Order
- [ ] Test with staging environment using Environment Switcher
- [ ] Verify all field keys match between code and GoHighLevel

### After Creating Fields - Verify Field Keys:
1. Go to Settings > Custom Fields in GoHighLevel
2. For each field, click to see its `key` value
3. The key MUST match EXACTLY what's in the code
4. GoHighLevel auto-generates keys from field names (lowercase, underscores)
5. If keys don't match, update the code in `/utils/highlevelContacts.ts`

### Workflow Trigger Summary:
| Event | Tag Added | Workflows Triggered |
|-------|-----------|-------------------|
| User signs up | `nylta_new_account` | Workflow 1 (Admin approval) |
| Admin approves | `nylta_account_approved` | Workflow 1 (Welcome email) |
| Admin rejects | `nylta_account_rejected` | Workflow 1 (Rejection email) |
| User submits filings | `nylta_submission_complete` | Workflow 2 (Invoice) + Workflow 3 (Admin alert) |
