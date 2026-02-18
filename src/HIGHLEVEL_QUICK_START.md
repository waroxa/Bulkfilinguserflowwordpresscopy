# HighLevel Integration - Quick Start

## 🚀 Get Started in 5 Minutes

### Step 1: Get Your HighLevel Credentials (2 min)

1. Login to HighLevel → Settings → API
2. Create new API key named "NYLTA Portal"
3. Enable permissions: Contacts (R/W), Tags (R/W), Workflows
4. Copy the API key

5. Go to Settings → Business Profile
6. Copy your Location ID

### Step 2: Configure Environment (1 min)

Create `.env.local` in your project root:

```bash
# Copy these lines and replace with your actual credentials
VITE_HIGHLEVEL_API_KEY=paste_your_api_key_here
VITE_HIGHLEVEL_LOCATION_ID=paste_your_location_id_here
```

### Step 3: Create Custom Fields in HighLevel (3 min)

Go to Settings → Custom Fields, create these 7 fields:

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| `firm_name` | Text | No | Legal business name |
| `professional_type` | Text | No | Full professional type text |
| `account_status` | Dropdown | No | Pending/Approved/Rejected |
| `registration_date` | Date | No | Account creation date |
| `country` | Text | No | Optional country field |
| `sms_consent` | Dropdown | No | Yes/No |
| `email_marketing_consent` | Dropdown | No | Yes/No |

For dropdowns, add these options:
- **account_status**: Pending, Approved, Rejected
- **sms_consent**: Yes, No
- **email_marketing_consent**: Yes, No

### Step 4: Create Tags (1 min)

Go to Settings → Tags, create these tags:
- `NYLTA Lead`
- `Account Created`
- `Pending Approval`

### Step 5: Test It! (1 min)

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Create a test account on your landing page

3. Check HighLevel → Contacts for the new contact

**Look for this in browser console:**
```
✅ HighLevel contact created: [contact-id]
```

---

## ✅ What Happens Now?

Every time someone creates an account on NYLTA:

1. **Contact is created in HighLevel** with all their info
2. **Tags are applied** for workflow automation
3. **Custom fields are populated** for tracking
4. **You can trigger workflows** based on tags

---

## 🎯 Next Steps

### Set Up Your First Workflow

**Welcome Email Sequence:**

1. In HighLevel, create new workflow
2. Trigger: Tag added → `Account Created`
3. Action: Wait 2 minutes
4. Action: Send email "Welcome to NYLTA!"
5. Action: Wait 1 day
6. Action: Send "Still processing your application..."

### Monitor Your Leads

Go to HighLevel → Contacts and filter by:
- Tag: `NYLTA Lead` - See all signups
- Tag: `Pending Approval` - See who's waiting
- Custom Field: `professional_type` = CPA - See all CPAs

---

## 📚 Full Documentation

- **Setup Guide:** `HIGHLEVEL_SETUP_GUIDE.md` - Detailed instructions
- **Integration Details:** `HIGHLEVEL_INTEGRATION_SUMMARY.md` - Technical docs
- **Troubleshooting:** See HIGHLEVEL_SETUP_GUIDE.md section 7

---

## 🆘 Quick Troubleshooting

**Not seeing contacts in HighLevel?**
- Check browser console for errors (F12)
- Verify API key and Location ID in `.env.local`
- Restart dev server after adding env vars

**Custom fields are empty?**
- Field names must match exactly: `firm_name`, `professional_type`, etc.
- Fields must be created on "Contact" object in HighLevel

**Tags not applied?**
- Create tags in HighLevel Settings → Tags
- Tag names are case-sensitive

---

## 💡 Pro Tips

1. **Use workflows to automate everything:**
   - Welcome emails
   - SMS notifications
   - Lead assignment
   - Follow-up sequences

2. **Track metrics in HighLevel:**
   - Daily signups
   - Conversion rates
   - Lead sources

3. **Set up alerts:**
   - New high-value lead (CPA firm with 5+ employees)
   - Lead pending approval for 24+ hours
   - Account approved but not logged in

---

**Need help?** See `HIGHLEVEL_SETUP_GUIDE.md` for detailed documentation.

**Last Updated:** January 26, 2025