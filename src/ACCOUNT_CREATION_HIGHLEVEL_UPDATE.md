# Account Creation with HighLevel Integration - Implementation Summary

## Overview
Updated the bulk filing account creation flow to use HighLevel's `/contacts/upsert` endpoint with the exact API request format specified, including proper custom fields structure and field mappings.

## Changes Made

### 1. Updated HighLevel Contact Creation (`/utils/highlevel.ts`)

**Endpoint Changed:**
- **Old:** `POST /contacts/` 
- **New:** `POST /contacts/upsert`

**Request Format Updated:**
```typescript
{
  locationId: "fXXJzwVf8OtANDf2M4VP",
  firstName: "test",
  lastName: "test",
  companyName: "testy",  // Top-level field (from firmName)
  email: "4rza8@airsworld.net",
  phone: "+14133455678",
  country: "US",  // Top-level field (only sent if provided)
  tags: ["bulk_status_pending_approval"],
  customField: [  // ARRAY format with key/field_value structure
    { key: "account_type", field_value: "Bulk Filing" },
    { key: "account_status", field_value: "Pending" },
    { key: "professional_type", field_value: "Registered Agent" },
    { key: "sms_consent", field_value: "true" },
    { key: "email_marketing_consent", field_value: "true" },
    { key: "firm_profile_completed", field_value: "false" }
  ]
}
```

### 2. Updated AuthContext (`/contexts/AuthContext.tsx`)

**Custom Fields Mapping:**
```typescript
customFields: {
  companyName: firmName,           // Maps to top-level companyName
  country: country || undefined,   // Maps to top-level country (optional)
  account_type: 'Bulk Filing',     // Custom field (always "Bulk Filing")
  account_status: 'Pending',       // Custom field (always "Pending" on creation)
  professional_type: professionalType || role,  // From form dropdown
  sms_consent: smsConsent ? 'true' : 'false',  // From checkbox
  email_marketing_consent: emailMarketingConsent ? 'true' : 'false',  // From checkbox
  firm_profile_completed: 'false'  // Always false on first account creation
}
```

**Tags Updated:**
- **Old:** `['bulk_filing_firm', 'bulk_status_pending_approval', 'role_compliance']`
- **New:** `['bulk_status_pending_approval']` only

### 3. Form Field Mappings (Already Correct in LandingPage)

The signup form already captures all required fields:

| Form Field | HighLevel Field | Type | Required |
|------------|----------------|------|----------|
| `formData.firstName` | `firstName` | Top-level | Yes |
| `formData.lastName` | `lastName` | Top-level | Yes |
| `formData.firmName` | `companyName` | Top-level | Yes |
| `formData.email` | `email` | Top-level | Yes |
| `formData.phone` | `phone` | Top-level | Yes |
| `formData.county` | `country` | Top-level | Optional |
| `formData.professionalType` | `professional_type` | Custom Field | Yes |
| `formData.agreeTexts` | `sms_consent` | Custom Field | Checkbox |
| `formData.agreeEmailMarketing` | `email_marketing_consent` | Custom Field | Checkbox |

### 4. API Request Headers

```typescript
{
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2',
  'Version': '2021-07-28'
}
```

## Custom Fields Schema (HighLevel)

Based on the provided screenshots, the following custom fields are configured:

| Field Name | Key | Type | Purpose |
|------------|-----|------|---------|
| Account Type | `account_type` | TEXT | Always "Bulk Filing" |
| Account Status | `account_status` | MULTIPLE_OPTIONS | "Pending" → "Approved" |
| Firm Name | `firm_name` | TEXT | Company/firm name |
| Professional Type | `professional_type` | TEXT | CPA, Attorney, etc. |
| SMS Consent | `sms_consent` | SINGLE_OPTIONS | true/false |
| Email Marketing Consent | `email_marketing_consent` | SINGLE_OPTIONS | true/false |
| Firm Profile Completed | `firm_profile_completed` | TEXT | "false" → "true" |
| Registration Date | `registration_date` | DATE | Auto-set on creation |

## Account Creation Flow

### Step 1: User Fills Out Form
- User completes the "Create Account" form in the landing page modal
- Required: firstName, lastName, firmName, email, phone, professionalType
- Optional: country
- Checkboxes: SMS consent, Email marketing consent

### Step 2: HighLevel Contact Created
```typescript
createHighLevelContact({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+14133455678",
  tags: ["bulk_status_pending_approval"],
  customFields: {
    companyName: "Doe & Associates",
    country: "United States",
    account_type: "Bulk Filing",
    account_status: "Pending",
    professional_type: "CPA (Certified Public Accountant)",
    sms_consent: "true",
    email_marketing_consent: "true",
    firm_profile_completed: "false"
  }
})
```

### Step 3: Supabase Account Created
- Backend creates Supabase auth user
- Stores account data in KV store
- Saves HighLevel contact ID for future updates

### Step 4: Awaiting Admin Approval
- Account status: "Pending"
- User receives confirmation message
- Admin reviews via Admin Dashboard

### Step 5: Admin Approves Account (Future)
- Admin clicks "Approve" in Admin Dashboard
- HighLevel contact updated:
  - Tag changed: `bulk_status_approved`
  - Custom field updated: `account_status = "Approved"`
- User receives approval email

## Console Logging

The implementation includes extensive logging for debugging:

```typescript
console.log('📤 Creating HighLevel contact via upsert endpoint:', email);
console.log('📤 HighLevel upsert request body:', JSON.stringify(requestBody, null, 2));
console.log('📥 HighLevel response status:', response.status, response.statusText);
console.log('📥 HighLevel raw response:', responseText);
console.log('✅ HighLevel contact created/updated via upsert:', contactId);
```

## Testing Checklist

- [ ] Create new account with all fields filled
- [ ] Verify HighLevel contact created via upsert endpoint
- [ ] Check console logs for request/response details
- [ ] Verify custom fields are properly set in HighLevel
- [ ] Verify tags are correctly applied
- [ ] Test with and without optional country field
- [ ] Test SMS consent checkbox (true/false)
- [ ] Test email marketing consent checkbox (true/false)
- [ ] Verify account status is "Pending" initially

## Environment Variables

The following environment variables are already configured:

```bash
VITE_HIGHLEVEL_API_KEY=pit-cca7bd65-1fe1-4754-88d7-a51883d631f2
VITE_HIGHLEVEL_LOCATION_ID=fXXJzwVf8OtANDf2M4VP
```

## Important Notes

1. **Upsert Behavior:** The `/contacts/upsert` endpoint creates new contacts or updates existing ones based on email address
2. **Country Field:** Only sent to HighLevel if user selects a country (optional field)
3. **Custom Field Format:** Must be an array with `key` and `field_value` properties (not an object)
4. **Tags:** Single tag `bulk_status_pending_approval` applied on account creation
5. **Consent Fields:** Boolean values converted to strings ("true"/"false") for HighLevel compatibility

## Error Handling

- HighLevel failures are non-critical (account creation still proceeds)
- All errors are logged to console with detailed context
- User sees success message even if HighLevel sync fails
- HighLevel contact ID is saved if successful (null if failed)

## Next Steps

When admin approves account:
1. Update HighLevel contact via PUT `/contacts/{contactId}`
2. Change custom field: `account_status` → "Approved"
3. Add tag: `bulk_status_approved`
4. Send approval email to user

---

**Status:** ✅ Implementation Complete
**Date:** December 27, 2025
