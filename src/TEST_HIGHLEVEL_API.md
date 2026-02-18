# Test HighLevel API - Working Commands

## ✅ These commands should work with the corrected format

---

## Test 1: Create New Contact (POST /contacts/upsert)

### Windows CMD:
```cmd
curl -X POST "https://services.leadconnectorhq.com/contacts/upsert" ^
  -H "Accept: application/json" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2" ^
  -H "Version: 2021-07-28" ^
  -d "{\"locationId\": \"fXXJzwVf8OtANDf2M4VP\", \"firstName\": \"John\", \"lastName\": \"Doe\", \"companyName\": \"Doe & Associates\", \"email\": \"john.doe.test@example.com\", \"phone\": \"+14155551234\", \"country\": \"US\", \"tags\": [\"bulk_status_pending_approval\"], \"customFields\": [{\"id\": \"mkk0bFNhEkVuymkCsdsa\", \"field_value\": \"Bulk Filing\"}, {\"id\": \"QPQCb7cCLTOIwJe1Z5Ga\", \"field_value\": \"Pending\"}, {\"id\": \"HuUznPV2qotnywk87Igu\", \"field_value\": \"CPA\"}, {\"id\": \"aaEG7lpUBE6UPfsN9AAy\", \"field_value\": \"Yes\"}, {\"id\": \"gmpkdmeewuCFVBaSiGA8\", \"field_value\": \"Yes\"}, {\"id\": \"GyeqdV8Sr9mDkEW2HScI\", \"field_value\": \"false\"}]}"
```

### Mac/Linux Bash:
```bash
curl -X POST "https://services.leadconnectorhq.com/contacts/upsert" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2" \
  -H "Version: 2021-07-28" \
  -d '{
    "locationId": "fXXJzwVf8OtANDf2M4VP",
    "firstName": "John",
    "lastName": "Doe",
    "companyName": "Doe & Associates",
    "email": "john.doe.test@example.com",
    "phone": "+14155551234",
    "country": "US",
    "tags": ["bulk_status_pending_approval"],
    "customFields": [
      {"id": "mkk0bFNhEkVuymkCsdsa", "field_value": "Bulk Filing"},
      {"id": "QPQCb7cCLTOIwJe1Z5Ga", "field_value": "Pending"},
      {"id": "HuUznPV2qotnywk87Igu", "field_value": "CPA"},
      {"id": "aaEG7lpUBE6UPfsN9AAy", "field_value": "Yes"},
      {"id": "gmpkdmeewuCFVBaSiGA8", "field_value": "Yes"},
      {"id": "GyeqdV8Sr9mDkEW2HScI", "field_value": "false"}
    ]
  }'
```

**Expected Response (200 OK):**
```json
{
  "contact": {
    "id": "abc123xyz456",
    "locationId": "fXXJzwVf8OtANDf2M4VP",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe.test@example.com",
    ...
  }
}
```

**Save the contact ID from the response for Test 2!**

---

## Test 2: Update Contact - Approve (PUT /contacts/{id})

**Replace `{CONTACT_ID}` with the ID from Test 1 response**

### Windows CMD:
```cmd
curl -X PUT "https://services.leadconnectorhq.com/contacts/{CONTACT_ID}?locationId=fXXJzwVf8OtANDf2M4VP" ^
  -H "Accept: application/json" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2" ^
  -H "Version: 2021-07-28" ^
  -d "{\"customFields\": [{\"id\": \"QPQCb7cCLTOIwJe1Z5Ga\", \"field_value\": \"Approved\"}]}"
```

### Mac/Linux Bash:
```bash
curl -X PUT "https://services.leadconnectorhq.com/contacts/{CONTACT_ID}?locationId=fXXJzwVf8OtANDf2M4VP" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2" \
  -H "Version: 2021-07-28" \
  -d '{
    "customFields": [
      {"id": "QPQCb7cCLTOIwJe1Z5Ga", "field_value": "Approved"}
    ]
  }'
```

**Expected Response (200 OK):**
```json
{
  "contact": {
    "id": "abc123xyz456",
    "locationId": "fXXJzwVf8OtANDf2M4VP",
    ...
    "customFields": {
      "account_status": "Approved"
    }
  }
}
```

---

## Test 3: Update Contact - Reject (PUT /contacts/{id})

### Windows CMD:
```cmd
curl -X PUT "https://services.leadconnectorhq.com/contacts/{CONTACT_ID}?locationId=fXXJzwVf8OtANDf2M4VP" ^
  -H "Accept: application/json" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2" ^
  -H "Version: 2021-07-28" ^
  -d "{\"customFields\": [{\"id\": \"QPQCb7cCLTOIwJe1Z5Ga\", \"field_value\": \"Rejected\"}]}"
```

---

## Verification Steps

1. **Run Test 1** - Create contact
   - Should get 200 OK response
   - Save the contact ID from response

2. **Check HighLevel Dashboard**
   - Go to: https://app.gohighlevel.com/location/fXXJzwVf8OtANDf2M4VP/contacts
   - Find contact: john.doe.test@example.com
   - Verify custom fields:
     - Account Status = Pending ✅
     - Account Type = Bulk Filing ✅
     - Professional Type = CPA ✅
     - SMS Consent = Yes ✅
     - Email Marketing Consent = Yes ✅
     - Firm Profile Completed = false ✅

3. **Run Test 2** - Update to Approved
   - Replace {CONTACT_ID} with actual ID
   - Should get 200 OK response

4. **Check HighLevel Dashboard Again**
   - Refresh the contact page
   - Verify: Account Status = Approved ✅

---

## Common Errors & Solutions

### ❌ Error: "customFields must be an array"
**Cause:** Using object format instead of array  
**Fix:** Use `[{ id, field_value }]` format (already implemented)

### ❌ Error: "property customField should not exist"
**Cause:** Using singular "customField" instead of plural  
**Fix:** Use "customFields" (already implemented)

### ❌ Error: 422 Unprocessable Entity (no message)
**Cause:** Missing or invalid field ID  
**Fix:** Verify field IDs match (already hardcoded correctly)

### ✅ Success: 200 OK
Your integration is working correctly!

---

## Field ID Reference

```typescript
account_status: 'QPQCb7cCLTOIwJe1Z5Ga'           // Values: Pending, Approved, Rejected
account_type: 'mkk0bFNhEkVuymkCsdsa'             // Values: "Bulk Filing"
professional_type: 'HuUznPV2qotnywk87Igu'        // Values: CPA, Attorney, etc.
sms_consent: 'aaEG7lpUBE6UPfsN9AAy'              // Values: "Yes", "No"
email_marketing_consent: 'gmpkdmeewuCFVBaSiGA8'  // Values: "Yes", "No"
firm_profile_completed: 'GyeqdV8Sr9mDkEW2HScI'   // Values: "true", "false"
```

---

**Status:** ✅ Ready to Test  
**Last Updated:** December 27, 2025
