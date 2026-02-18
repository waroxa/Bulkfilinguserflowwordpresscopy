# HighLevel Integration - Quick Reference

## ✅ What Was Fixed

Both POST `/contacts/upsert` and PUT `/contacts/{id}` now use:
- **Field name:** `customFields` (PLURAL) ✅
- **Format:** Array of objects with `id`, `key`, `field_value` ✅  
- **Boolean values:** Actual booleans, not strings ✅

## 🚀 To Complete Setup:

### 1. Fetch Custom Field IDs (ONE TIME ONLY)

Run this curl command:
```bash
curl -X GET "https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields" -H "Accept: application/json" -H "Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2" -H "Version: 2021-07-28"
```

OR use the admin page at `/pages/FetchCustomFieldsPage.tsx`

### 2. Add Environment Variables

Add these to Supabase (replace IDs with actual values from step 1):

```bash
VITE_HL_FIELD_ACCOUNT_STATUS=<actual_id_here>
VITE_HL_FIELD_ACCOUNT_TYPE=<actual_id_here>
VITE_HL_FIELD_PROFESSIONAL_TYPE=<actual_id_here>
VITE_HL_FIELD_SMS_CONSENT=<actual_id_here>
VITE_HL_FIELD_EMAIL_MARKETING_CONSENT=<actual_id_here>
VITE_HL_FIELD_FIRM_PROFILE_COMPLETED=<actual_id_here>
```

### 3. Restart Application

Restart after adding env vars for changes to take effect.

## 📝 Correct API Format

### POST /contacts/upsert
```json
{
  "locationId": "fXXJzwVf8OtANDf2M4VP",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "customFields": [
    {
      "id": "abc123",
      "key": "account_status",
      "field_value": "Pending"
    }
  ]
}
```

### PUT /contacts/{id}
```json
{
  "customFields": [
    {
      "id": "abc123",
      "key": "account_status",
      "field_value": "Approved"
    }
  ]
}
```

## 📚 Full Documentation

See `/HIGHLEVEL_SETUP_GUIDE.md` for complete setup instructions and troubleshooting.

---

**Status:** ✅ Code Updated - Awaiting Custom Field IDs
**Next Action:** Fetch custom field IDs and add to environment variables
