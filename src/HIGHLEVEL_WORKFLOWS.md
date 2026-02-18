# HighLevel CRM Workflow Documentation
## NYLTA Bulk Filing System - Complete Workflow Architecture

**Last Updated:** December 27, 2025  
**Author:** AI Engineer  
**Purpose:** Comprehensive documentation for all HighLevel CRM workflows, automation triggers, and integration points for the NYLTA bulk filing system.

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Required Custom Fields](#required-custom-fields)
3. [Required Tags](#required-tags)
4. [Workflow 1: Lead Capture & Qualification](#workflow-1-lead-capture--qualification)
5. [Workflow 2: Account Approval & Activation](#workflow-2-account-approval--activation)
6. [Workflow 3: First Login Reminder](#workflow-3-first-login-reminder)
7. [Workflow 4: Profile Completion Follow-up](#workflow-4-profile-completion-follow-up)
8. [Workflow 5: Abandoned Application Recovery](#workflow-5-abandoned-application-recovery)
9. [Workflow 6: Rejection Notification](#workflow-6-rejection-notification)
10. [Integration Architecture](#integration-architecture)
11. [Audit & Analytics](#audit--analytics)

---

## System Overview

### Integration Architecture
```
┌─────────────────┐
│  NYLTA Web App  │
│  (React + TS)   │
└────────┬────────┘
         │
         │ API Calls (Bearer Token Auth)
         │
┌────────▼─────────────────────────────────────┐
│  Hono Server (Deno Edge Function)            │
│  /supabase/functions/server/index.tsx        │
│                                              │
│  Routes:                                     │
│  - POST /signup                              │
│  - POST /admin/accounts/:userId/approve      │
│  - POST /admin/accounts/:userId/reject       │
│  - POST /firm-profile                        │
└────────┬─────────────────────────────────────┘
         │
         │ HighLevel API v2021-07-28
         │ Base URL: https://services.leadconnectorhq.com
         │
┌────────▼─────────────────────────────────────┐
│  HighLevel CRM                               │
│  Location ID: fXXJzwVf8OtANDf2M4VP          │
│                                              │
│  - Contact Management                        │
│  - Custom Fields                             │
│  - Tags (Workflow Triggers)                  │
│  - Workflow Automations                      │
│  - Email/SMS Campaigns                       │
└──────────────────────────────────────────────┘
```

### Authentication & Credentials
- **API Key:** Stored in `VITE_HIGHLEVEL_API_KEY` environment variable
- **Location ID:** `fXXJzwVf8OtANDf2M4VP` (stored in `VITE_HIGHLEVEL_LOCATION_ID`)
- **API Version:** `2021-07-28` (specified in Version header)
- **Authorization:** Bearer token in Authorization header

---

## Required Custom Fields

### Setup Instructions
1. Navigate to HighLevel → Settings → Custom Fields
2. Create the following custom fields for **Contacts**:

| Field Name | Field ID (Auto-generated) | Type | Options | Required | Description |
|-----------|---------------------------|------|---------|----------|-------------|
| `account_status` | `QPQCb7cCLTOIwJe1Z5Ga` | Dropdown | Pending, Approved, Rejected | No | Account approval status |
| `firm_name` | Auto-assigned | Text | - | No | Name of CPA/Attorney firm |
| `contact_name` | Auto-assigned | Text | - | No | Primary contact person |
| `professional_type` | Auto-assigned | Dropdown | CPA, Attorney, Compliance Professional, Processor | No | Type of professional |
| `phone_number` | Auto-assigned | Phone | - | No | Contact phone number |
| `sms_consent` | Auto-assigned | Checkbox | - | No | SMS marketing consent |
| `email_consent` | Auto-assigned | Checkbox | - | No | Email marketing consent |

**IMPORTANT:** 
- After creating each field, note the auto-generated Field ID
- Field IDs are used in API calls (e.g., `QPQCb7cCLTOIwJe1Z5Ga` for `account_status`)
- Do NOT change field IDs after workflows are configured

---

## Required Tags

### Tag Naming Convention
All tags use snake_case and follow the pattern: `{category}_{status}_{detail}`

### Lead Lifecycle Tags
| Tag | Purpose | Added By | Removed By |
|-----|---------|----------|------------|
| `bulk_status_pending_approval` | New signup awaiting admin review | Signup process | N/A (historical) |
| `bulk_status_active` | Account approved and activated | Admin approval | Account deletion |
| `bulk_status_rejected` | Account rejected by admin | Admin rejection | N/A (historical) |

### User Journey Tags
| Tag | Purpose | Added By | Removed By |
|-----|---------|----------|------------|
| `event_signup` | User completed signup form | Signup process | N/A (historical) |
| `event_first_login` | User logged in for first time | First login | N/A (historical) |
| `event_profile_complete` | User completed firm profile | Profile completion | N/A (historical) |

### Role Tags
| Tag | Purpose | Added By | Removed By |
|-----|---------|----------|------------|
| `role_cpa` | User is a CPA | Signup process | N/A |
| `role_attorney` | User is an attorney | Signup process | N/A |
| `role_compliance` | User is a compliance professional | Signup process | N/A |
| `role_processor` | User is a processor | Signup process | N/A |
| `role_admin` | User is a system admin | Manual admin creation | N/A |

### Special Tags
| Tag | Purpose | Added By | Removed By |
|-----|---------|----------|------------|
| `source_webapp` | Lead originated from web application | Signup process | N/A |
| `country_usa` | User is in United States | Signup process | N/A |
| `country_canada` | User is in Canada | Signup process | N/A |

**Tag Management Rules:**
- ✅ **ALWAYS** preserve historical tags (event_signup, event_first_login, etc.)
- ✅ **ALWAYS** merge new tags with existing tags before API updates
- ❌ **NEVER** overwrite tags array with only new tags
- ❌ **NEVER** remove lifecycle/event tags

---

## Workflow 1: Lead Capture & Qualification

### Trigger
**Tag Added:** `bulk_status_pending_approval`

### Purpose
Automatically process new signup leads, capture them in HighLevel, and notify the admin team for review.

### Workflow Steps

#### Step 1: Wait (Buffer)
- **Duration:** 2 minutes
- **Reason:** Ensure all data is synced from the web app to HighLevel

#### Step 2: Send Internal Notification (Slack/Email)
- **Type:** Action - Send Email
- **To:** `admin@nylta.com` (or Slack webhook)
- **Subject:** `🔔 New Bulk Filing Account Pending Approval`
- **Body:**
```
New account requires approval:

👤 Contact: {{contact.first_name}} {{contact.last_name}}
🏢 Firm: {{custom_fields.firm_name}}
📧 Email: {{contact.email}}
📱 Phone: {{contact.phone}}
💼 Type: {{custom_fields.professional_type}}

Account Details:
- Status: Pending Approval
- Source: Web Application
- Submitted: {{contact.date_added}}

🔗 Review in Admin Dashboard:
https://nylta.com/admin/accounts

HighLevel Contact: https://app.gohighlevel.com/location/fXXJzwVf8OtANDf2M4VP/contacts/view/{{contact.id}}
```

#### Step 3: Send Welcome Email to Applicant
- **Type:** Action - Send Email
- **To:** `{{contact.email}}`
- **From:** `noreply@nylta.com`
- **Subject:** `Welcome to NYLTA Bulk Filing - Application Received`
- **Body:**
```
Dear {{contact.first_name}},

Thank you for your interest in NYLTA's bulk filing service!

Your application has been received and is currently under review by our team. This typically takes 1-2 business days.

Application Details:
✓ Firm: {{custom_fields.firm_name}}
✓ Contact: {{custom_fields.contact_name}}
✓ Email: {{contact.email}}
✓ Professional Type: {{custom_fields.professional_type}}

What happens next?
1. Our team will review your application
2. You'll receive login credentials via email once approved
3. You can then complete your firm profile and start filing

Questions?
Email us at support@nylta.com

Best regards,
NYLTA Team
```

#### Step 4: Add to "Pending Approval" List
- **Type:** Action - Add to List
- **List:** "Bulk Filing - Pending Approvals"
- **Reason:** Segment for follow-up and reporting

#### Step 5: Start Abandoned Application Workflow (Conditional)
- **Wait:** 72 hours
- **Condition:** IF contact does NOT have tag `bulk_status_active` AND does NOT have tag `bulk_status_rejected`
- **Then:** Trigger Workflow 5 (Abandoned Application Recovery)

---

## Workflow 2: Account Approval & Activation

### Trigger
**Tag Added:** `bulk_status_active`

### Purpose
Welcome approved users, send them their login credentials, and guide them through first login.

### Workflow Steps

#### Step 1: Wait (Buffer)
- **Duration:** 30 seconds
- **Reason:** Ensure credentials are fully generated in database

#### Step 2: Send Approval Email with Credentials
- **Type:** Action - Send Email
- **To:** `{{contact.email}}`
- **From:** `noreply@nylta.com`
- **Subject:** `🎉 Your NYLTA Bulk Filing Account is Approved!`
- **Body:**
```
Dear {{contact.first_name}},

Great news! Your NYLTA bulk filing account has been approved.

🔐 Your Login Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Username: {{contact.email}}
Temporary Password: [Retrieved from database]
Login URL: https://nylta.com/login
━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ SECURITY NOTE:
- This is a temporary password
- You'll be required to change it on first login
- Do not share these credentials

📋 Next Steps:
1. Login at https://nylta.com/login
2. Change your temporary password
3. Complete your firm profile
4. Add worker credentials (if applicable)
5. Start filing NYLTA reports!

Need help? Watch our quick start guide:
https://nylta.com/help/getting-started

Questions?
Email: support@nylta.com
Phone: (555) 123-4567

Welcome aboard!
NYLTA Team
```

#### Step 3: Send SMS Notification (If SMS Consent = Yes)
- **Type:** Action - Send SMS
- **To:** `{{contact.phone}}`
- **Condition:** IF `custom_fields.sms_consent` = true
- **Message:**
```
🎉 NYLTA: Your account is approved! Check your email for login credentials. Login at nylta.com/login
```

#### Step 4: Update Custom Field
- **Type:** Action - Update Contact
- **Field:** `custom_fields.account_status`
- **Value:** `Approved`

#### Step 5: Add to "Active Users" List
- **Type:** Action - Add to List
- **List:** "Bulk Filing - Active Users"

#### Step 6: Remove from "Pending Approval" List
- **Type:** Action - Remove from List
- **List:** "Bulk Filing - Pending Approvals"

#### Step 7: Start First Login Reminder Workflow
- **Wait:** 48 hours
- **Condition:** IF contact does NOT have tag `event_first_login`
- **Then:** Trigger Workflow 3 (First Login Reminder)

---

## Workflow 3: First Login Reminder

### Trigger
**Manual Trigger from Workflow 2, Step 7**  
OR  
**Scheduled Workflow:** Daily at 10:00 AM EST checking for contacts with `bulk_status_active` but WITHOUT `event_first_login` tag

### Purpose
Encourage approved users who haven't logged in yet to access their account.

### Workflow Steps

#### Step 1: Check Login Status
- **Type:** Condition
- **If:** Contact has tag `event_first_login`
- **Then:** Exit workflow (user already logged in)
- **Else:** Continue

#### Step 2: Send First Reminder Email
- **Type:** Action - Send Email
- **To:** `{{contact.email}}`
- **Subject:** `Reminder: Complete Your NYLTA Account Setup`
- **Body:**
```
Hi {{contact.first_name}},

We noticed you haven't logged into your NYLTA bulk filing account yet.

Your credentials are waiting for you!

🔐 Login Details:
Username: {{contact.email}}
Login URL: https://nylta.com/login

📊 What you can do once logged in:
✓ File NYLTA reports for multiple clients in bulk
✓ Manage beneficial ownership disclosures
✓ Track filing status and history
✓ Access compliance resources

⏰ Your temporary password expires in 7 days

Need help? Reply to this email or call (555) 123-4567.

Best regards,
NYLTA Team

P.S. Forgot your password? Use the "Reset Password" link on the login page.
```

#### Step 3: Wait for Login
- **Duration:** 5 days
- **Condition:** IF contact does NOT have tag `event_first_login`

#### Step 4: Send Final Reminder Email
- **Type:** Action - Send Email
- **To:** `{{contact.email}}`
- **Subject:** `⚠️ Final Reminder: Your NYLTA Account Access Expires Soon`
- **Body:**
```
Hi {{contact.first_name}},

This is your final reminder that your NYLTA bulk filing account credentials will expire in 2 days.

To maintain access to your account:
1. Login at https://nylta.com/login
2. Change your temporary password
3. Complete your profile

If you no longer need this account, you can safely ignore this email.

Need assistance?
Email: support@nylta.com
Phone: (555) 123-4567

NYLTA Support Team
```

#### Step 5: Tag for Follow-up
- **Type:** Action - Add Tag
- **Tag:** `needs_followup_login`

---

## Workflow 4: Profile Completion Follow-up

### Trigger
**Tag Added:** `event_first_login` WITHOUT tag `event_profile_complete`

### Purpose
Guide users who have logged in but haven't completed their firm profile.

### Workflow Steps

#### Step 1: Wait (Grace Period)
- **Duration:** 24 hours
- **Reason:** Give users time to complete profile on their own

#### Step 2: Check Profile Status
- **Type:** Condition
- **If:** Contact has tag `event_profile_complete`
- **Then:** Exit workflow (profile already complete)
- **Else:** Continue

#### Step 3: Send Profile Completion Reminder
- **Type:** Action - Send Email
- **To:** `{{contact.email}}`
- **Subject:** `Complete Your NYLTA Firm Profile`
- **Body:**
```
Hi {{contact.first_name}},

You're almost ready to start filing!

We noticed your firm profile is incomplete. Completing your profile unlocks:

✓ Bulk filing for multiple clients
✓ Team member access management
✓ Automatic compliance tracking
✓ Detailed filing history

📋 To complete your profile:
1. Login at https://nylta.com/login
2. Navigate to "Firm Profile"
3. Complete all required fields:
   - Firm details
   - Billing information
   - Worker credentials (optional)

⏱️ This takes less than 5 minutes!

Need help? Watch our video guide:
https://nylta.com/help/profile-setup

Questions?
support@nylta.com | (555) 123-4567

NYLTA Team
```

#### Step 4: Wait for Completion
- **Duration:** 7 days
- **Condition:** IF contact does NOT have tag `event_profile_complete`

#### Step 5: Send Final Profile Reminder
- **Type:** Action - Send Email
- **To:** `{{contact.email}}`
- **Subject:** `Your NYLTA Profile Needs Attention`
- **Body:**
```
Hi {{contact.first_name}},

Your NYLTA account is active, but your firm profile is still incomplete.

Without a complete profile, you cannot:
❌ Submit bulk filings
❌ Add team members
❌ Access advanced features

✅ Complete your profile now:
https://nylta.com/profile

Need assistance? We're here to help!
Schedule a call: https://nylta.com/support/schedule
Email: support@nylta.com

NYLTA Support Team
```

#### Step 6: Tag for Support Follow-up
- **Type:** Action - Add Tag
- **Tag:** `needs_support_profile`

---

## Workflow 5: Abandoned Application Recovery

### Trigger
**Manual Trigger from Workflow 1, Step 5**  
OR  
**Scheduled Workflow:** Daily at 9:00 AM EST checking for contacts with `bulk_status_pending_approval` older than 72 hours

### Purpose
Re-engage leads who submitted applications but haven't been approved or rejected yet.

### Workflow Steps

#### Step 1: Check Current Status
- **Type:** Condition
- **If:** Contact has tag `bulk_status_active` OR `bulk_status_rejected`
- **Then:** Exit workflow (application already processed)
- **Else:** Continue

#### Step 2: Send Re-engagement Email
- **Type:** Action - Send Email
- **To:** `{{contact.email}}`
- **Subject:** `Update on Your NYLTA Bulk Filing Application`
- **Body:**
```
Hi {{contact.first_name}},

Thank you for applying for NYLTA bulk filing access!

We're currently reviewing your application for:
🏢 {{custom_fields.firm_name}}

Our review process typically takes 1-2 business days, but we may need additional information from you.

If you haven't received approval within 5 business days, please:
1. Check your spam folder for our emails
2. Reply to this email with any questions
3. Call us at (555) 123-4567

We appreciate your patience!

NYLTA Team
```

#### Step 3: Notify Admin Team
- **Type:** Action - Send Internal Email
- **To:** `admin@nylta.com`
- **Subject:** `⚠️ Delayed Application: {{contact.email}}`
- **Body:**
```
The following application has been pending for 72+ hours:

Contact: {{contact.first_name}} {{contact.last_name}}
Firm: {{custom_fields.firm_name}}
Email: {{contact.email}}
Applied: {{contact.date_added}}

Action Required:
Review and approve/reject this application ASAP.

Admin Dashboard: https://nylta.com/admin/accounts
```

#### Step 4: Tag for Admin Review
- **Type:** Action - Add Tag
- **Tag:** `admin_review_required`

---

## Workflow 6: Rejection Notification

### Trigger
**Tag Added:** `bulk_status_rejected`

### Purpose
Notify users of application rejection professionally and provide next steps.

### Workflow Steps

#### Step 1: Wait (Buffer)
- **Duration:** 5 minutes
- **Reason:** Allow admin to add rejection notes

#### Step 2: Send Rejection Email
- **Type:** Action - Send Email
- **To:** `{{contact.email}}`
- **Subject:** `Update on Your NYLTA Application`
- **Body:**
```
Dear {{contact.first_name}},

Thank you for your interest in NYLTA bulk filing services.

After careful review, we are unable to approve your application at this time.

Firm: {{custom_fields.firm_name}}
Applied: {{contact.date_added}}

Common reasons for rejection:
- Incomplete application information
- Business type not eligible for bulk filing
- Duplicate application
- Verification requirements not met

What you can do:
1. Reply to this email for more details
2. Submit a new application with updated information
3. Contact our support team for assistance

We're here to help!
Email: support@nylta.com
Phone: (555) 123-4567

Best regards,
NYLTA Team
```

#### Step 3: Update Custom Field
- **Type:** Action - Update Contact
- **Field:** `custom_fields.account_status`
- **Value:** `Rejected`

#### Step 4: Remove from "Pending Approval" List
- **Type:** Action - Remove from List
- **List:** "Bulk Filing - Pending Approvals"

#### Step 5: Add to "Rejected Applications" List
- **Type:** Action - Add to List
- **List:** "Bulk Filing - Rejected"

#### Step 6: Create Support Task
- **Type:** Action - Create Task
- **Assigned To:** Support Team
- **Title:** `Follow up on rejected application: {{contact.email}}`
- **Due Date:** 7 days from now
- **Description:** Monitor for reapplication or support requests

---

## Integration Architecture

### API Call Patterns

#### 1. Contact Creation (Signup)
```javascript
// Endpoint: POST /contacts
// Triggered by: User signup form submission

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+15551234567",
  "tags": [
    "bulk_status_pending_approval",
    "event_signup",
    "role_cpa",
    "source_webapp",
    "country_usa"
  ],
  "customFields": [
    {
      "id": "firm_name_field_id",
      "field_value": "Doe & Associates CPA"
    },
    {
      "id": "professional_type_field_id",
      "field_value": "CPA"
    },
    {
      "id": "sms_consent_field_id",
      "field_value": true
    }
  ]
}
```

#### 2. Tag Update (Approval)
```javascript
// Endpoint: PUT /contacts/{contactId}
// Triggered by: Admin approval action

// STEP 1: Fetch existing contact
const getResponse = await fetch(
  `https://services.leadconnectorhq.com/contacts/${contactId}?locationId=${locationId}`,
  {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Version': '2021-07-28'
    }
  }
);

const contactData = await getResponse.json();
const existingTags = contactData.contact?.tags || [];

// STEP 2: Merge tags (NEVER overwrite!)
const mergedTags = [...new Set([
  ...existingTags,
  'bulk_status_active'
])];

// STEP 3: Update contact
await fetch(
  `https://services.leadconnectorhq.com/contacts/${contactId}?locationId=${locationId}`,
  {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28'
    },
    body: JSON.stringify({ tags: mergedTags })
  }
);
```

#### 3. Note Addition (Audit Trail)
```javascript
// Endpoint: POST /contacts/{contactId}/notes
// Triggered by: Significant account actions

{
  "body": "Account approved by admin. Username: john@example.com. Credentials sent via email. Approval Date: 2025-12-27T15:49:00Z"
}
```

### Error Handling & Retry Logic

```javascript
// All HighLevel API calls should include:

try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('HighLevel API Error:', response.status, errorText);
    
    // Log to audit system
    await saveAuditLog({
      action: 'HIGHLEVEL_API_ERROR',
      status: response.status,
      error: errorText,
      timestamp: new Date().toISOString()
    });
    
    // Don't fail the main operation - HighLevel sync is non-critical
    return false;
  }
  
  return true;
} catch (error) {
  console.error('HighLevel API Exception:', error);
  await saveAuditLog({
    action: 'HIGHLEVEL_API_EXCEPTION',
    error: error.message,
    timestamp: new Date().toISOString()
  });
  
  return false;
}
```

### Rate Limiting
- HighLevel API Rate Limit: 100 requests per 10 seconds
- Implement exponential backoff for 429 responses
- Batch operations when possible
- Cache contact IDs to minimize lookups

---

## Audit & Analytics

### Key Metrics to Track

#### Conversion Funnel
```
1. Signups (event_signup tag)
   ↓
2. Pending Approvals (bulk_status_pending_approval tag)
   ↓
3. Approved Accounts (bulk_status_active tag)
   ↓
4. First Logins (event_first_login tag)
   ↓
5. Profile Completions (event_profile_complete tag)
   ↓
6. Active Filers (custom tracking)
```

#### Dashboard Metrics
- **Conversion Rate:** Signups → Approvals → First Login → Profile Complete
- **Time to Approval:** Average time from signup to approval
- **Login Rate:** % of approved users who complete first login within 7 days
- **Profile Completion Rate:** % of logged-in users who complete profile within 30 days
- **Rejection Rate:** % of signups that get rejected
- **Abandoned Applications:** Pending approvals > 72 hours

### HighLevel Reports to Create

#### Report 1: Weekly Account Activity
```
Filter: Contacts with tag "source_webapp"
Group By: Date Added
Metrics:
- New signups
- Approvals
- Rejections
- First logins
- Profile completions
```

#### Report 2: Professional Type Distribution
```
Filter: Contacts with tag "bulk_status_active"
Group By: custom_fields.professional_type
Metrics:
- Count by type (CPA, Attorney, Compliance, Processor)
- Average time to approval by type
- Profile completion rate by type
```

#### Report 3: Workflow Performance
```
Filter: All bulk filing contacts
Metrics:
- Email open rates (by workflow)
- SMS delivery rates
- Workflow completion rates
- Drop-off points in funnel
```

---

## Implementation Checklist

### Phase 1: HighLevel Setup
- [ ] Create custom fields with exact names
- [ ] Document all field IDs
- [ ] Create all required tags
- [ ] Set up contact lists (Pending, Active, Rejected)

### Phase 2: Workflow Creation
- [ ] Build Workflow 1 (Lead Capture)
- [ ] Build Workflow 2 (Approval & Activation)
- [ ] Build Workflow 3 (First Login Reminder)
- [ ] Build Workflow 4 (Profile Completion)
- [ ] Build Workflow 5 (Abandoned Application)
- [ ] Build Workflow 6 (Rejection Notification)

### Phase 3: Email Templates
- [ ] Design professional email templates matching NYLTA brand
- [ ] Include NYLTA logo and styling
- [ ] Add unsubscribe links (legal requirement)
- [ ] Test all email templates for deliverability

### Phase 4: Testing
- [ ] Test signup → HighLevel contact creation
- [ ] Test approval → bulk_status_active tag → email sent
- [ ] Test rejection → email sent
- [ ] Test first login → tag added
- [ ] Test profile completion → tag added
- [ ] Test all workflow triggers and conditions

### Phase 5: Monitoring
- [ ] Set up HighLevel reporting dashboard
- [ ] Configure admin notifications for workflow failures
- [ ] Monitor API error rates in audit logs
- [ ] Review conversion metrics weekly

---

## Troubleshooting Guide

### Issue: Tags not being added
**Symptoms:** Workflows not triggering, contacts missing tags  
**Solutions:**
1. Verify API key has correct permissions
2. Check that tags exist in HighLevel settings
3. Ensure tag merge logic is working (not overwriting)
4. Review audit logs for API errors

### Issue: Emails not sending
**Symptoms:** Users not receiving approval/rejection emails  
**Solutions:**
1. Check workflow is active in HighLevel
2. Verify email templates are published
3. Check spam filters
4. Confirm contact email address is valid
5. Review HighLevel email delivery logs

### Issue: Duplicate contacts
**Symptoms:** Same user has multiple HighLevel contacts  
**Solutions:**
1. Use email as unique identifier
2. Implement duplicate check before contact creation
3. Merge duplicates in HighLevel manually
4. Add uniqueness validation in signup process

### Issue: Workflows triggering multiple times
**Symptoms:** Users receiving duplicate emails  
**Solutions:**
1. Add workflow entry limit (once per contact)
2. Check for duplicate tag additions
3. Review workflow trigger conditions
4. Add "has already completed workflow" condition

---

## Security & Compliance

### Data Protection
- Never store sensitive data in HighLevel notes
- Passwords should NEVER be synced to HighLevel
- Use secure credential delivery (separate system)
- Implement data retention policies (GDPR/CCPA)

### API Security
- Rotate API keys quarterly
- Use environment variables (never hardcode)
- Implement rate limiting
- Monitor for unusual API activity
- Log all API calls for audit trail

### User Privacy
- Honor unsubscribe requests immediately
- Provide clear opt-out mechanisms
- Don't use personal data for marketing without consent
- Allow users to delete their HighLevel data on request

---

## Appendix

### Useful HighLevel API Endpoints

```
Base URL: https://services.leadconnectorhq.com

GET    /contacts?locationId={id}              - List contacts
GET    /contacts/{contactId}?locationId={id}  - Get contact details
POST   /contacts                              - Create contact
PUT    /contacts/{contactId}?locationId={id}  - Update contact
DELETE /contacts/{contactId}?locationId={id}  - Delete contact
POST   /contacts/{contactId}/notes            - Add note to contact
GET    /contacts/{contactId}/notes            - Get contact notes
POST   /contacts/search                       - Search contacts
```

### Required Headers
```
Authorization: Bearer {API_KEY}
Content-Type: application/json
Version: 2021-07-28
```

### Contact Search Example
```javascript
// Search by email
{
  "locationId": "fXXJzwVf8OtANDf2M4VP",
  "email": "user@example.com"
}
```

---

## Support & Documentation

**HighLevel Documentation:** https://highlevel.stoplight.io/docs/integrations  
**NYLTA Support:** support@nylta.com  
**Developer Contact:** dev@nylta.com  

**Document Version:** 1.0  
**Last Updated:** December 27, 2025  
**Next Review:** January 27, 2026
