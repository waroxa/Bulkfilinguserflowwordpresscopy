# GoHighLevel (RewardLion) CRM Integration Documentation

## 📋 Overview

The NYLTA Bulk Filing system automatically syncs firm and client data to GoHighLevel (RewardLion CRM) when an order is completed. This enables:
- Centralized contact management for all firms and their clients
- Automated order confirmation emails via GoHighLevel workflows
- Easy filtering and segmentation by firm, service type, and entity type
- Complete audit trail of all submitted filings

---

## 🏗️ Architecture & Data Flow

### **When an Order is Submitted:**

1. **User completes payment** (Step 6: Payment & Authorization)
2. **System generates confirmation** (Step 7: Confirmation page loads)
3. **Background sync starts** (non-blocking - doesn't delay UI)
   - Creates **Firm Contact** in GoHighLevel
   - Creates **Client Contacts** for each LLC filed
   - Sends **Order Confirmation** data to firm contact

---

## 📇 Contact Structure

### **1. Firm Contacts (Main Account Holders)**

**Tags:**
- `firm` - Identifies as a firm account
- `nylta-bulk-filing` - Source identifier

**Custom Fields:**
| Field Name | Description | Example |
|-----------|-------------|---------|
| `firm_name` | Legal business name | "Smith & Associates CPA" |
| `firm_ein` | Employer Identification Number | "12-3456789" |
| `firm_confirmation_number` | Unique confirmation ID | "20260203123456" |
| `account_type` | Always "firm" | "firm" |
| `last_order_number` | Most recent transaction ID | "ORDER-20260203123456" |
| `last_order_date` | Submission timestamp | "2026-02-03T18:30:00Z" |
| `last_order_amount` | Total paid | "1194.00" |
| `last_order_client_count` | Number of LLCs filed | "3" |
| `total_orders` | Lifetime order count | "1" |

**Standard Fields:**
- `firstName` - Contact person first name
- `lastName` - Contact person last name
- `email` - Firm email address
- `phone` - Firm phone number
- `companyName` - Firm name
- `address1` - Firm address

---

### **2. Client Contacts (Individual LLCs)**

**Tags:**
- `client` - Identifies as LLC client
- `nylta-llc` - Source identifier
- `firm-[confirmationNumber]` - Links to parent firm (e.g., `firm-20260203123456`)
- Service type: `monitoring` OR `filing`
- Entity type: `domestic` OR `foreign`
- Filing path: `disclosure` OR `exemption`

**Example Tag Set for a Foreign LLC with Disclosure:**
```
["client", "nylta-llc", "firm-20260203123456", "filing", "foreign", "disclosure"]
```

**Custom Fields:**
| Field Name | Description | Example |
|-----------|-------------|---------|
| `llc_name` | LLC legal name | "ABC Holdings LLC" |
| `fictitious_name` | DBA name (if any) | "ABC Company" |
| `nydos_id` | NYDOS ID number | "1234567" |
| `ein` | Employer ID | "98-7654321" |
| `formation_date` | Date of formation | "2020-01-15" |
| `country_of_formation` | Country | "United States" |
| `state_of_formation` | State (if US) | "Delaware" |
| `entity_type` | domestic/foreign | "foreign" |
| `date_authority_filed_ny` | Foreign entities only | "2021-06-01" |
| `service_type` | monitoring/filing | "filing" |
| `filing_type` | disclosure/exemption | "disclosure" |
| `parent_firm_id` | GoHighLevel contact ID | "abc123xyz456" |
| `parent_firm_name` | Firm name | "Smith & Associates CPA" |
| `parent_firm_confirmation` | Confirmation number | "20260203123456" |
| `account_type` | Always "client" | "client" |
| `exemption_category` | If exemption filing | "Pooled investment vehicle" |
| `exemption_explanation` | If exemption filing | "Regulated by SEC" |
| `beneficial_owners_count` | Number of BOs | "2" |
| `company_applicants_count` | Number of CAs | "1" |

**Standard Fields:**
- `firstName` - LLC name
- `lastName` - Service type label (e.g., "(filing)")
- `email` - Firm's email (for notifications)
- `companyName` - LLC name
- `address1` - LLC street address
- `city` - LLC city
- `state` - LLC state
- `country` - LLC country
- `postalCode` - LLC ZIP code

---

## 🔍 Filtering & Lookup Examples

### **Find All Clients for a Specific Firm:**
Filter by tag: `firm-20260203123456`

### **Find All Monitoring Clients:**
Filter by tags: `client` AND `monitoring`

### **Find All Foreign Entities:**
Filter by tags: `client` AND `foreign`

### **Find All Exemption Filings:**
Filter by tags: `client` AND `exemption`

### **Find All Filing Clients for Smith & Associates:**
1. Look up firm by `companyName = "Smith & Associates CPA"`
2. Get `firm_confirmation_number` custom field
3. Filter clients by tag: `firm-[confirmation_number]` AND `filing`

---

## 📧 Order Confirmation Workflow

### **Automatic Order Confirmation Email:**

When an order is submitted, the system:

1. **Updates firm contact** with order details:
   - `last_order_number`
   - `last_order_date`
   - `last_order_amount`
   - `last_order_client_count`

2. **Adds a note** to the firm contact with full order breakdown:
```
🎉 New Order Placed - 20260203123456

Order Details:
- Order Number: ORDER-20260203123456
- Submission Date: 2/3/2026
- Amount Paid: $1,194.00
- Number of Clients: 3

Clients Filed:
1. ABC Holdings LLC - Bulk Filing ($398)
2. XYZ Enterprises LLC - Bulk Filing ($398)
3. DEF Corp LLC - Bulk Filing ($398)

Total: $1,194.00

This order has been successfully submitted and is being processed.
```

3. **Triggers email workflow** (you set this up in GoHighLevel):
   - Create a workflow that triggers when `last_order_number` changes
   - Send an email to the contact using the custom fields as merge tags
   - Template can use fields like `{{custom_fields.last_order_number}}`, `{{custom_fields.last_order_client_count}}`, etc.

---

## 🛠️ Technical Implementation

### **Files:**

1. **`/utils/highlevelContacts.ts`** - Core integration module
   - `createFirmContact()` - Creates/updates firm contacts
   - `createClientContact()` - Creates individual LLC contacts
   - `createBulkClientContacts()` - Batch creates all clients
   - `sendOrderConfirmation()` - Sends order data to firm
   - `convertWizardClientToContactData()` - Helper to transform data

2. **`/App.tsx`** - Integration point
   - `handleStep6Complete()` - Triggers sync after payment

### **API Configuration:**

```typescript
const HIGHLEVEL_API_KEY = "eyJhbGc..."; // Your API key
const HIGHLEVEL_LOCATION_ID = "fXXJzwVf8OtANDf2M4VP"; // Your location ID
const HIGHLEVEL_BASE_URL = "https://services.leadconnectorhq.com";
```

### **Sync Flow:**

```typescript
// Step 1: Create firm contact
const firmContactId = await createFirmContact({
  firmName: "Smith & Associates CPA",
  firmEIN: "12-3456789",
  contactName: "John Smith",
  contactEmail: "john@smith-cpa.com",
  contactPhone: "555-1234",
  firmAddress: "123 Main St",
  confirmationNumber: "20260203123456"
});

// Step 2: Create all client contacts
const clientContactIds = await createBulkClientContacts(
  firmContactId,
  "Smith & Associates CPA",
  "20260203123456",
  clientsData // Array of ClientContactData
);

// Step 3: Send order confirmation
await sendOrderConfirmation({
  firmContactId,
  firmName: "Smith & Associates CPA",
  confirmationNumber: "20260203123456",
  orderNumber: "ORDER-20260203123456",
  submissionDate: "2026-02-03T18:30:00Z",
  amountPaid: 1194.00,
  clientCount: 3,
  clients: [
    { llcName: "ABC Holdings LLC", serviceType: "filing", fee: 398 },
    { llcName: "XYZ Enterprises LLC", serviceType: "filing", fee: 398 },
    { llcName: "DEF Corp LLC", serviceType: "filing", fee: 398 }
  ]
});
```

---

## ⚙️ GoHighLevel Workflow Setup

### **Order Confirmation Email Workflow:**

1. **Create a new workflow** in GoHighLevel
2. **Trigger:** Custom Field Value Changed
   - Field: `last_order_number`
   - Condition: Is not empty
3. **Action:** Send Email
   - **Subject:** `Order Confirmation - {{custom_fields.last_order_number}}`
   - **Body Template:**

```html
<h2>Thank you for your order!</h2>

<p>Dear {{firstName}},</p>

<p>Your bulk filing order has been successfully submitted:</p>

<div style="background: #f5f5f5; padding: 20px; margin: 20px 0;">
  <strong>Order Number:</strong> {{custom_fields.last_order_number}}<br>
  <strong>Submission Date:</strong> {{custom_fields.last_order_date}}<br>
  <strong>Number of Clients:</strong> {{custom_fields.last_order_client_count}}<br>
  <strong>Total Paid:</strong> ${{custom_fields.last_order_amount}}
</div>

<h3>What Happens Next:</h3>
<ol>
  <li>Our compliance team will review your submissions (1-2 business days)</li>
  <li>Filings will be submitted to NYDOS when systems are available</li>
  <li>You'll receive individual confirmation numbers for each entity</li>
</ol>

<p>Questions? Reply to this email or call us at (555) 123-4567.</p>

<p>Best regards,<br>
NYLTA.com Team</p>
```

---

## 📊 Reporting & Analytics

### **Key Metrics You Can Track:**

1. **Total Firms:** Count contacts with tag `firm`
2. **Total Clients:** Count contacts with tag `client`
3. **Active Firms:** Firms with `total_orders` > 0
4. **Average Clients Per Order:** Sum of `last_order_client_count` / Total firms
5. **Revenue by Service Type:**
   - Filter clients by tag `monitoring` → Count × $249
   - Filter clients by tag `filing` → Count × $398
6. **Foreign vs Domestic Split:**
   - Filter by tags `foreign` vs `domestic`
7. **Exemption vs Disclosure:**
   - Filter by tags `exemption` vs `disclosure`

### **Segmentation Examples:**

**High-Value Firms:**
- Filter: `last_order_amount` > $2,000
- Use for: VIP support, special offers

**Foreign Filing Specialists:**
- Filter: Clients with tag `foreign` grouped by `parent_firm_name`
- Use for: Targeted marketing for foreign entity services

**Monitoring Service Upsell:**
- Filter: Clients with tag `monitoring`
- Use for: Upgrade campaigns to full filing service

---

## 🔒 Security & Privacy

- **API Key:** Hardcoded in `/utils/highlevelContacts.ts` (stored server-side)
- **Data Transmission:** HTTPS encrypted
- **PII Handling:** No SSNs or sensitive IDs transmitted
- **Error Handling:** Background sync failures are logged but don't block user workflow
- **User Experience:** Sync happens after confirmation page loads (non-blocking)

---

## 🐛 Debugging & Monitoring

### **Console Logs:**

The integration logs all activity to browser console:

```
🚀 Starting GoHighLevel contact sync...
📇 Creating firm contact in GoHighLevel: Smith & Associates CPA
✅ Firm contact created: abc123xyz456
📇 Creating 3 client contacts for firm: Smith & Associates CPA
📇 Creating client contact: ABC Holdings LLC
✅ Client contact created: def456ghi789
... (repeats for each client)
✅ Created 3/3 client contacts
📧 Sending order confirmation to firm: Smith & Associates CPA
✅ Order confirmation sent successfully
✅ GoHighLevel sync complete!
```

### **Error Handling:**

```
❌ Failed to create firm contact: 401 Unauthorized
❌ Failed to create client contact for ABC Holdings LLC: Network error
❌ Error syncing to GoHighLevel: API rate limit exceeded
```

Errors are logged but **do not prevent** the user from seeing their confirmation page.

### **Testing:**

1. Complete a test order
2. Open browser console (F12)
3. Look for GoHighLevel sync logs
4. Check GoHighLevel dashboard for new contacts
5. Verify tags and custom fields are populated correctly

---

## 📚 API Reference

### **createFirmContact()**

```typescript
await createFirmContact({
  firmName: string;           // Required
  firmEIN: string;           // Required
  contactName: string;       // Required
  contactEmail: string;      // Required
  contactPhone?: string;     // Optional
  firmAddress?: string;      // Optional
  confirmationNumber: string; // Required (unique ID)
});

// Returns: string (GoHighLevel contact ID)
```

### **createClientContact()**

```typescript
await createClientContact({
  llcName: string;
  nydosId: string;
  ein: string;
  formationDate: string;
  countryOfFormation: string;
  entityType: 'domestic' | 'foreign';
  serviceType: 'monitoring' | 'filing';
  filingType: 'disclosure' | 'exemption';
  parentFirmId: string;          // GoHighLevel contact ID
  parentFirmName: string;
  parentFirmConfirmation: string;
  contactEmail: string;
  // ... plus 20+ optional fields
});

// Returns: string (GoHighLevel contact ID)
```

### **sendOrderConfirmation()**

```typescript
await sendOrderConfirmation({
  firmContactId: string;         // GoHighLevel contact ID
  firmName: string;
  confirmationNumber: string;
  orderNumber: string;           // Transaction ID
  submissionDate: string;        // ISO timestamp
  amountPaid: number;
  clientCount: number;
  clients: Array<{
    llcName: string;
    serviceType: 'monitoring' | 'filing';
    fee: number;
  }>;
});

// Returns: void
```

---

## 🎯 Best Practices

1. **Always use confirmation number** as the primary linking field (it's unique per order)
2. **Keep tags consistent** - Use lowercase, hyphenated format
3. **Update workflows carefully** - Test email templates before going live
4. **Monitor API rate limits** - GoHighLevel has limits on API calls per minute
5. **Don't block UI** - Sync happens in background, user sees confirmation immediately
6. **Log everything** - Console logs help debug integration issues
7. **Handle failures gracefully** - If CRM sync fails, user still gets their confirmation

---

## 🚀 Future Enhancements

### **Potential Additions:**

1. **Duplicate Contact Prevention:**
   - Check if firm already exists by EIN before creating
   - Update existing contact instead of creating new one

2. **Webhook Notifications:**
   - Send webhook to GoHighLevel when filing status changes
   - Update client contact with NYDOS confirmation number

3. **Custom Dashboards:**
   - Create GoHighLevel dashboard showing firm activity
   - Chart revenue by service type, entity type, etc.

4. **Automated Follow-ups:**
   - Send status update emails at key milestones
   - Request reviews after successful filing

5. **Multi-Order Tracking:**
   - Track order history (not just last order)
   - Calculate lifetime value per firm

---

## 📞 Support

For integration issues:
- **Email:** bulk@nylta.com
- **Documentation:** This file
- **Code:** `/utils/highlevelContacts.ts`

For GoHighLevel/RewardLion CRM setup:
- **GoHighLevel Support:** support.gohighlevel.com
- **API Docs:** highlevel.stoplight.io

---

## ✅ Implementation Checklist

- [x] Create `/utils/highlevelContacts.ts` module
- [x] Integrate into payment flow (`App.tsx`)
- [x] Add firm contact creation
- [x] Add client contact creation with tags
- [x] Add order confirmation note
- [x] Add console logging for debugging
- [x] Test with sample order
- [ ] Set up GoHighLevel email workflow (YOU DO THIS)
- [ ] Test email delivery (YOU DO THIS)
- [ ] Configure custom fields in GoHighLevel (AUTO-CREATED)
- [ ] Set up reporting dashboards (OPTIONAL)

---

**Last Updated:** February 3, 2026  
**Version:** 1.0.0  
**Author:** NYLTA Development Team
