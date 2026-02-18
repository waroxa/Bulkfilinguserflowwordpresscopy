# GoHighLevel Integration - Quick Start Guide

## 🎯 What Gets Synced to GoHighLevel?

When a firm completes a bulk filing order:

### 1. **Firm Contact** is created/updated
- Contact name, email, phone
- Firm EIN and business name
- Order details (amount, date, client count)
- Tagged as `firm`

### 2. **Client Contacts** are created for each LLC
- LLC name, EIN, NYDOS ID
- Service type (monitoring or filing)
- Entity type (domestic or foreign)
- Filed by which firm
- Tagged as `client` + service type + entity type + firm ID

### 3. **Order Confirmation** is sent
- Note added to firm contact with full order details
- Custom fields updated to trigger email workflow

---

## 📋 How to Filter Contacts in GoHighLevel

| What You Want | Filter By |
|--------------|-----------|
| All firms | Tag: `firm` |
| All clients | Tag: `client` |
| Clients for specific firm | Tag: `firm-20260203123456` |
| All monitoring clients | Tags: `client` AND `monitoring` |
| All filing clients | Tags: `client` AND `filing` |
| Foreign entities only | Tags: `client` AND `foreign` |
| Domestic entities only | Tags: `client` AND `domestic` |
| Exemption filings | Tags: `client` AND `exemption` |
| Disclosure filings | Tags: `client` AND `disclosure` |

---

## ⚙️ Set Up Order Confirmation Email (5 Minutes)

### Step 1: Create Workflow in GoHighLevel

1. Go to **Automations** → **Workflows**
2. Click **+ Create Workflow**
3. Name it: "NYLTA Order Confirmation Email"

### Step 2: Add Trigger

- **Trigger Type:** Custom Field Value Changed
- **Field:** `last_order_number`
- **Condition:** Is not empty

### Step 3: Add Email Action

- **Wait:** 0 minutes
- **Action:** Send Email
- **To:** `{{email}}`
- **Subject:** `Order Confirmation - {{custom_fields.last_order_number}}`

### Step 4: Email Template

```html
<h2>Thank you for your NYLTA bulk filing order!</h2>

<p>Hi {{firstName}},</p>

<p>Your order has been successfully submitted:</p>

<table style="border: 1px solid #ddd; padding: 15px; background: #f9f9f9;">
  <tr><td><strong>Order Number:</strong></td><td>{{custom_fields.last_order_number}}</td></tr>
  <tr><td><strong>Date:</strong></td><td>{{custom_fields.last_order_date}}</td></tr>
  <tr><td><strong>Clients Filed:</strong></td><td>{{custom_fields.last_order_client_count}}</td></tr>
  <tr><td><strong>Amount Paid:</strong></td><td>${{custom_fields.last_order_amount}}</td></tr>
</table>

<h3>What's Next:</h3>
<ol>
  <li>Compliance review (1-2 business days)</li>
  <li>Submission to NYDOS</li>
  <li>Individual confirmations sent per entity</li>
</ol>

<p>Questions? Reply to this email.</p>

<p>NYLTA.com Team</p>
```

### Step 5: Activate

- Click **Save**
- Toggle **Active** ON

**Done!** Now every order automatically sends a confirmation email.

---

## 🔍 Find All Clients for a Specific Firm

### Method 1: By Firm Name
1. Go to **Contacts**
2. Filter by tag: Search for firm name
3. Find the firm contact
4. Look at `firm_confirmation_number` custom field
5. Filter all contacts by tag: `firm-[that number]`

### Method 2: By Confirmation Number
1. If you know the confirmation number (e.g., `20260203123456`)
2. Filter contacts by tag: `firm-20260203123456`
3. All clients for that firm will appear

---

## 📊 Quick Reports You Can Build

### Report 1: Revenue by Service Type
- **Monitoring clients:** Count contacts with tag `monitoring` × $249
- **Filing clients:** Count contacts with tag `filing` × $398
- **Total:** Add them up

### Report 2: Top Firms by Client Count
1. Filter contacts by tag `firm`
2. Sort by `last_order_client_count` (descending)
3. See which firms submit the most clients

### Report 3: Foreign vs Domestic Breakdown
- **Foreign:** Count contacts with tags `client` + `foreign`
- **Domestic:** Count contacts with tags `client` + `domestic`
- **Percentage:** Calculate split

---

## 🐛 Troubleshooting

### "I don't see any contacts in GoHighLevel"
- Check if integration is enabled (it is by default)
- Complete a test order and watch browser console for logs
- Look for `✅ GoHighLevel sync complete!` message

### "Email workflow isn't sending"
- Check workflow is **Active**
- Verify trigger field is `last_order_number`
- Make sure firm contact has valid email address
- Check workflow history for errors

### "Some clients are missing"
- Check browser console for `❌ Failed to create client contact`
- Verify API key is valid
- Check GoHighLevel rate limits

### "Tags aren't showing up"
- Custom fields are auto-created on first sync
- Tags are added immediately
- Refresh the contacts page

---

## 💡 Pro Tips

1. **Save Filter Presets** - Create saved filters for common queries (all monitoring clients, foreign entities, etc.)
2. **Use Smart Lists** - Auto-populate lists based on tags for targeted campaigns
3. **Custom Fields** - All fields are searchable in GoHighLevel
4. **Bulk Actions** - Select multiple clients to send bulk updates
5. **Reporting** - Export contact lists to CSV for external analysis

---

## 📞 Need Help?

- **Full Documentation:** See `/GOHIGHLEVEL_INTEGRATION.md`
- **Code Reference:** `/utils/highlevelContacts.ts`
- **Support Email:** bulk@nylta.com

---

**Last Updated:** February 3, 2026
