# NYLTA Bulk Filing - Admin Account Setup Guide

## 🔐 Create Your Admin Account

To create your admin account, use this curl command or any HTTP client:

### Using curl (Terminal/Command Prompt):

```bash
curl -X POST https://YOUR_SUPABASE_PROJECT_ID.supabase.co/functions/v1/make-server-2c01e603/setup/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@nylta.com",
    "password": "YourSecurePassword123!",
    "firmName": "NYLTA Admin",
    "contactName": "Admin User"
  }'
```

### Using JavaScript (Browser Console):

```javascript
fetch('https://YOUR_SUPABASE_PROJECT_ID.supabase.co/functions/v1/make-server-2c01e603/setup/create-admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@nylta.com',
    password: 'YourSecurePassword123!',
    firmName: 'NYLTA Admin',
    contactName: 'Admin User'
  })
})
.then(r => r.json())
.then(data => console.log(data));
```

## ✅ System is Ready!

Once you create your admin account:

1. **Login** using your admin credentials at the landing page
2. **Navigate to Admin Dashboard** 
3. **View pending accounts** and approve/reject them
4. **Email approvals** will be sent via Supabase (logged to console for now)

---

## 📧 Email System

### Account Approval Emails
- Sent automatically when you approve accounts
- Uses Supabase's built-in email system
- Currently logs to console (configure SMTP in Supabase dashboard for production)
- Beautiful HTML template with your exact copy

### External API Integration (Bulk Filing Submissions)
- **API Pit ID:** `pit-cca7bd65-1fe1-4754-88d7-a51883d631f2`
- **Location ID:** `fXXJzwVf8OtANDf2M4VP`
- Endpoint ready: `/bulk-filing/submit`
- Will be integrated when external email system API endpoint is provided

---

## 🚀 Testing Flow

1. **Create Admin Account** (use endpoint above)
2. **Login as Admin** → Navigate to Account Management
3. **Create Test User Account** → Click "CREATE ACCOUNT" on landing page
4. **Approve Test Account** → See it appear in admin dashboard, click approve
5. **Check Logs** → See approval email logged to browser console
6. **Login as Approved User** → Test the full user flow

---

## 🔒 Security Note

**IMPORTANT:** After creating your admin account, you should:
- Remove or protect the `/setup/create-admin` endpoint in production
- Or add authentication to prevent unauthorized admin account creation
