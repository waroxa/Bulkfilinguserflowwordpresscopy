# HighLevel Custom Fields Format Fix

## Issue
HighLevel API was returning error:
```
❌ HighLevel API Error Response (Status 422):
{
  "message": ["customFields must be an array"],
  "error": "Unprocessable Entity",
  "statusCode": 422
}
```

## Root Cause
The HighLevel API v2 expects custom fields in **array format**, not object format.

### Incorrect Format (Before Fix)
```json
{
  "customFields": {
    "account_type": "Bulk Filing",
    "account_status": "Pending",
    "firm_profile_completed": "false"
  }
}
```

### Correct Format (After Fix)
```json
{
  "customField": [
    { "key": "account_type", "field_value": "Bulk Filing" },
    { "key": "account_status", "field_value": "Pending" },
    { "key": "firm_profile_completed", "field_value": "false" }
  ]
}
```

## Solution Implemented

### 1. Created `formatCustomFields()` Helper Function
```typescript
function formatCustomFields(fields: Record<string, any>): Array<{ key: string; field_value: string }> {
  return Object.entries(fields).map(([key, value]) => ({
    key,
    field_value: String(value)
  }));
}
```

### 2. Updated `createHighLevelContact()`
**Before:**
```typescript
if (contactData.customFields) {
  requestBody.customFields = contactData.customFields;
}
```

**After:**
```typescript
if (contactData.customFields) {
  requestBody.customField = formatCustomFields(contactData.customFields);
}
```

### 3. Updated `updateHighLevelContact()`
**Before:**
```typescript
const requestBody: any = { ...updates };
// customFields sent as-is (object format)
```

**After:**
```typescript
const requestBody: any = { ...updates };
if (requestBody.customFields) {
  requestBody.customField = formatCustomFields(requestBody.customFields);
  delete requestBody.customFields;
}
```

## Key Points

1. **Field Name**: Use `customField` (singular), not `customFields` (plural)
2. **Format**: Array of objects with `key` and `field_value` properties
3. **Values**: All values converted to strings with `String(value)`
4. **API Compatibility**: This format works with HighLevel API v2 (Version: 2021-07-28)

## Testing

After this fix, custom fields should successfully sync to HighLevel:

```typescript
// Frontend usage remains unchanged
createHighLevelContact({
  firstName: "John",
  lastName: "Smith",
  email: "john@firm.com",
  customFields: {
    account_type: "Bulk Filing",
    account_status: "Pending",
    firm_profile_completed: "false"
  }
});
```

The `formatCustomFields()` function automatically converts the object to the correct array format before sending to HighLevel API.

## Files Modified

- `/utils/highlevel.ts` - Complete rewrite with correct custom field formatting

## Expected Behavior

**Before Fix:**
- ❌ 422 error: "customFields must be an array"
- ❌ Contact creation fails
- ❌ Custom fields not set

**After Fix:**
- ✅ Contact created successfully
- ✅ Custom fields set correctly
- ✅ Values appear in HighLevel CRM
- ✅ Workflows can trigger based on custom field values

## Verification Steps

1. Create a new account
2. Check console logs for:
   ```
   📤 HighLevel create request body: {...}
   📥 HighLevel response status: 201 Created
   ✅ HighLevel contact created with custom fields: {contactId}
   ```
3. Verify in HighLevel CRM:
   - Contact exists
   - Custom fields tab shows all fields
   - Values are correct

## Notes

- The frontend code doesn't need to change
- All existing calls to `createHighLevelContact()` and `updateHighLevelContact()` will work
- The conversion happens automatically in the utility functions
- Custom fields are now properly synchronized to HighLevel
