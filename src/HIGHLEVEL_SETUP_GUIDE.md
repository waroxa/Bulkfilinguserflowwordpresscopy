# HighLevel API Integration - Complete Setup Guide (Version 2021-07-28)

## ✅ Critical Fix Applied

The HighLevel API integration has been updated to use the **correct format** according to the official GoHighLevel (LeadConnector) API specification (Version 2021-07-28).

---

## Key Changes Made

### 1. **Correct Field Name**
- ✅ **Both POST and PUT use `customFields` (PLURAL)**
- ❌ NOT `customField` (singular) - this was the issue!

### 2. **Required Structure for Each Custom Field**
Each custom field object must include **three properties**:
```json
{
  "id": "abc123def456",        // Field ID from HighLevel
  "key": "account_status",     // Merge tag key
  "field_value": "Pending"     // Value (string, boolean, number, etc.)
}
```

### 3. **Boolean Values**
- Use actual booleans: `true` / `false`
- NOT strings: `"true"` / `"false"`

---

## Setup Process

### Step 1: Fetch Custom Field IDs

**Option A: Use the Admin Utility Page**
1. Navigate to `/pages/FetchCustomFieldsPage.tsx` (add route in your app)
2. Click "Fetch Custom Field IDs"
3. Copy the environment variables shown

**Option B: Use Console**
```typescript
import { getCustomFieldIds } from './utils/highlevel';

// In browser console or test page:
await getCustomFieldIds();
// Outputs custom field IDs to console
```

**Option C: Use cURL**
```bash
curl -X GET "https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2" \
  -H "Version: 2021-07-28"
```

**Expected Response:**
```json
{
  "customFields": [
    {
      "id": "abc123def456",
      "name": "Account Status",
      "key": "account_status",
      "fieldKey": "account_status",
      "dataType": "MULTIPLE_OPTIONS"
    },
    ...
  ]
}
```

### Step 2: Add Environment Variables

Add these to your Supabase environment variables (replace with actual IDs from Step 1):

```bash
VITE_HL_FIELD_ACCOUNT_STATUS=abc123def456
VITE_HL_FIELD_ACCOUNT_TYPE=ghi789jkl012
VITE_HL_FIELD_PROFESSIONAL_TYPE=mno345pqr678
VITE_HL_FIELD_SMS_CONSENT=stu901vwx234
VITE_HL_FIELD_EMAIL_MARKETING_CONSENT=yza567bcd890
VITE_HL_FIELD_FIRM_PROFILE_COMPLETED=efg123hij456
```

### Step 3: Restart Application

After adding environment variables, restart the application for changes to take effect.

---

## API Format Reference

### POST /contacts/upsert (Create Contact)

**Endpoint:**
```
POST https://services.leadconnectorhq.com/contacts/upsert
```

**Request Body:**
```json
{
  "locationId": "fXXJzwVf8OtANDf2M4VP",
  "firstName": "John",
  "lastName": "Doe",
  "companyName": "Doe & Associates",
  "email": "john@example.com",
  "phone": "+14133455678",
  "country": "US",
  "tags": ["bulk_status_pending_approval"],
  "customFields": [
    {
      "id": "abc123def456",
      "key": "account_status",
      "field_value": "Pending"
    },
    {
      "id": "ghi789jkl012",
      "key": "account_type",
      "field_value": "Bulk Filing"
    },
    {
      "id": "mno345pqr678",
      "key": "professional_type",
      "field_value": "CPA"
    },
    {
      "id": "stu901vwx234",
      "key": "sms_consent",
      "field_value": true
    },
    {
      "id": "yza567bcd890",
      "key": "email_marketing_consent",
      "field_value": true
    },
    {
      "id": "efg123hij456",
      "key": "firm_profile_completed",
      "field_value": false
    }
  ]
}
```

### PUT /contacts/{contactId} (Update Contact)

**Endpoint:**
```
PUT https://services.leadconnectorhq.com/contacts/{contactId}?locationId={locationId}
```

**Request Body (Same Format!):**
```json
{
  "customFields": [
    {
      "id": "abc123def456",
      "key": "account_status",
      "field_value": "Approved"
    }
  ]
}
```

**Note:** Both POST and PUT use `customFields` (plural) with the same structure!

---

## Code Implementation

### Frontend (`/utils/highlevel.ts`)

**Custom Field IDs Configuration:**
```typescript
const CUSTOM_FIELD_IDS = {
  account_status: import.meta.env.VITE_HL_FIELD_ACCOUNT_STATUS,
  account_type: import.meta.env.VITE_HL_FIELD_ACCOUNT_TYPE,
  professional_type: import.meta.env.VITE_HL_FIELD_PROFESSIONAL_TYPE,
  sms_consent: import.meta.env.VITE_HL_FIELD_SMS_CONSENT,
  email_marketing_consent: import.meta.env.VITE_HL_FIELD_EMAIL_MARKETING_CONSENT,
  firm_profile_completed: import.meta.env.VITE_HL_FIELD_FIRM_PROFILE_COMPLETED,
};
```

**Create Contact:**
```typescript
customFields: [
  {
    id: CUSTOM_FIELD_IDS.account_status,
    key: 'account_status',
    field_value: 'Pending'
  }
]
```

**Update Contact:**
```typescript
customFields: [
  {
    id: CUSTOM_FIELD_IDS.account_status,
    key: 'account_status',
    field_value: 'Approved'
  }
]
```

### Server-Side (`/supabase/functions/server/index.tsx`)

**Approval Endpoint:**
```typescript
const ACCOUNT_STATUS_FIELD_ID = Deno.env.get('VITE_HL_FIELD_ACCOUNT_STATUS') || '';

const requestBody: any = {
  customFields: [ // ← PLURAL!
    {
      key: 'account_status',
      field_value: 'Approved'
    }
  ]
};

// Add field ID if available
if (ACCOUNT_STATUS_FIELD_ID) {
  requestBody.customFields[0].id = ACCOUNT_STATUS_FIELD_ID;
}
```

---

## Testing Checklist

### ✅ Environment Variables
- [ ] Fetched custom field IDs from HighLevel
- [ ] Added all 6 field IDs to Supabase environment variables
- [ ] Restarted application after adding env vars

### ✅ Account Creation (POST /contacts/upsert)
- [ ] Create test account via signup form
- [ ] Check console logs for request body
- [ ] Verify `customFields` (plural) is used
- [ ] Verify each field has `id`, `key`, and `field_value`
- [ ] Verify boolean fields use actual booleans (not strings)
- [ ] Check HighLevel dashboard for new contact
- [ ] Confirm all custom fields are populated correctly

### ✅ Account Approval (PUT /contacts/{id})
- [ ] Admin approves pending account
- [ ] Check console logs for PUT request body
- [ ] Verify `customFields` (plural) is used
- [ ] Verify field has `id`, `key`, and `field_value`
- [ ] Check HighLevel dashboard for updated status
- [ ] Confirm `account_status` changed to "Approved"

---

## Common Errors & Solutions

### Error: "property customField should not exist"
**Cause:** Using `customField` (singular) instead of `customFields` (plural)  
**Solution:** Change to `customFields` (plural)

### Error: "customFields must be an array"
**Cause:** Using object format instead of array  
**Solution:** Use array format: `[{ id, key, field_value }]`

### Error: 422 Unprocessable Entity (no specific message)
**Cause:** Missing `id` property or invalid field ID  
**Solution:** Fetch correct field IDs and add to environment variables

### Error: Custom fields not updating in HighLevel
**Cause:** Using incorrect field IDs or missing field IDs  
**Solution:** Verify field IDs match those from GET /customFields endpoint

---

## Verification

After setup, verify the integration works:

1. **Create New Account:**
   - Sign up with test email
   - Check console: Should show successful HighLevel contact creation
   - Check HighLevel dashboard: Contact should exist with all custom fields

2. **Approve Account:**
   - Admin approves the account
   - Check console: Should show successful HighLevel contact update
   - Check HighLevel dashboard: `account_status` should be "Approved"

3. **Error Handling:**
   - If HighLevel update fails, account approval should still succeed
   - Errors should be logged as warnings (non-critical)

---

## Files Modified

1. ✅ `/utils/highlevel.ts`
   - Added `CUSTOM_FIELD_IDS` configuration
   - Added `getCustomFieldIds()` function
   - Updated `createHighLevelContact()` to use correct format
   - Updated `updateHighLevelContact()` to use correct format

2. ✅ `/supabase/functions/server/index.tsx`
   - Updated approval endpoint to use `customFields` (plural)
   - Added field ID support from environment variables

3. ✅ `/pages/FetchCustomFieldsPage.tsx`
   - Created admin utility to fetch and display field IDs

4. ✅ Documentation Files
   - `/HIGHLEVEL_API_FIX.md` - Error fix details
   - `/ACCOUNT_APPROVAL_HIGHLEVEL_WORKFLOW.md` - Complete workflow
   - `/FETCH_HIGHLEVEL_CUSTOM_FIELDS.md` - Fetch instructions
   - `/HIGHLEVEL_SETUP_GUIDE.md` (this file) - Complete setup guide

---

## Status: ✅ Ready for Setup

The code has been updated and is ready to use. Complete Steps 1-3 above to activate the HighLevel integration.

**Date:** December 27, 2025  
**API Version:** 2021-07-28  
**Status:** Awaiting custom field IDs from HighLevel
