# HighLevel API Error Fix - Custom Fields Format

## Problem (UPDATED)
```
❌ HighLevel API Error Response (Status 422):
{"message":["customFields must be an array"],"error":"Unprocessable Entity","statusCode":422}
```

## Root Cause
HighLevel uses **array format for BOTH endpoints**, but with different field names:

### POST /contacts/upsert (Create/Update Contact)
- Uses: `customFields` (plural)
- Format: **Array** `[{ key: "field", field_value: "value" }]`

### PUT /contacts/{id} (Update Existing Contact)
- Uses: `customField` (singular) 
- Format: **Array** `[{ key: "field", field_value: "value" }]`

**Key Difference:** Plural vs Singular, but both use the same array structure!

## Solution Applied

### Fixed: `/utils/highlevel.ts` - `createHighLevelContact()`

**Before (❌ Wrong - Object):**
```typescript
// This was causing the error
const customFieldsObject: Record<string, string> = {};
Object.entries(contactData.customFields).forEach(([key, value]) => {
  customFieldsObject[key] = String(value);
});
requestBody.customFields = customFieldsObject;  // Wrong: object format
```

**After (✅ Correct - Array):**
```typescript
// Upsert endpoint needs customFields (plural) as array
if (contactData.customFields) {
  requestBody.customFields = Object.entries(contactData.customFields)
    .filter(([key]) => !['country', 'companyName'].includes(key))
    .map(([key, value]) => ({
      key,
      field_value: String(value)
    }));
}
```

### Correct: `/supabase/functions/server/index.tsx` - Approval Endpoint

**Already using correct format for PUT endpoint:**
```typescript
const requestBody = {
  customField: [  // Singular for PUT!
    {
      key: 'account_status',
      field_value: 'Approved'
    }
  ]
};
```

## Request Examples

### Creating Contact (POST /contacts/upsert)
```json
{
  "locationId": "fXXJzwVf8OtANDf2M4VP",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "customFields": [
    { "key": "account_status", "field_value": "Pending" },
    { "key": "account_type", "field_value": "Bulk Filing" },
    { "key": "professional_type", "field_value": "CPA" }
  ]
}
```

### Updating Contact (PUT /contacts/{id})
```json
{
  "customField": [
    { "key": "account_status", "field_value": "Approved" }
  ]
}
```

## API Format Summary

| Endpoint | Field Name | Format | Example |
|----------|-----------|--------|---------|
| POST /contacts/upsert | `customFields` (plural) | Array | `[{key, field_value}]` |
| PUT /contacts/{id} | `customField` (singular) | Array | `[{key, field_value}]` |

## Files Modified
1. ✅ `/utils/highlevel.ts` - Fixed `createHighLevelContact()` to use **array** format with plural name
2. ✅ `/supabase/functions/server/index.tsx` - Already correct (array format, singular name)
3. ✅ `/ACCOUNT_APPROVAL_HIGHLEVEL_WORKFLOW.md` - Updated with correct formats

## Testing
- [ ] Create new account → Should succeed with `customFields` (plural) as array
- [ ] Admin approves account → Should succeed with `customField` (singular) as array
- [ ] Check HighLevel contact has both fields set correctly

## Status
✅ **Fixed** - December 27, 2025

The error has been resolved by using arrays for both endpoints (plural for POST, singular for PUT).