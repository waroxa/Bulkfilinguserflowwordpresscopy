# HighLevel API Integration - Account Approval Update

## ✅ VERIFIED: Correct API Implementation

When an account gets approved, the system makes the following HighLevel API call:

### API Call Details

**Endpoint:**
```
PUT https://services.leadconnectorhq.com/contacts/{CONTACT_ID}?locationId=fXXJzwVf8OtANDf2M4VP
```

**Headers:**
```
Accept: application/json
Content-Type: application/json
Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2
Version: 2021-07-28
```

**Request Body:**
```json
{
  "customFields": [
    {
      "id": "QPQCb7cCLTOIwJe1Z5Ga",
      "field_value": "Approved"
    }
  ]
}
```

### How It Works

1. **Contact ID Source**: The contact ID is retrieved from `targetAccount.highLevelContactId` which was stored when the user signed up
   - This ID is saved during signup in: `/contexts/AuthContext.tsx` → `createHighLevelContact()`
   - Stored in KV database as part of the account object

2. **Field ID**: Using the hardcoded custom field ID `QPQCb7cCLTOIwJe1Z5Ga` 
   - This is the `account_status` field in your HighLevel account
   - Field type: MULTIPLE_OPTIONS (Pending/Approved/Rejected)

3. **Location ID**: Using `fXXJzwVf8OtANDf2M4VP` (your HighLevel location)

4. **API Version**: `2021-07-28` (required for custom fields format)

### Code Location

**File**: `/supabase/functions/server/index.tsx`

**Endpoint**: `POST /make-server-2c01e603/admin/accounts/:userId/approve`

**Function**: `updateHighLevelContact()` (lines ~735-817)

### Console Logs When Approval Happens

When you approve an account, you'll see these logs:

```
🔄 Updating HighLevel contact with approval status...
🔄 HighLevel Contact ID: [actual contact ID]
🔄 Location ID: fXXJzwVf8OtANDf2M4VP
🔄 Field ID for account_status: QPQCb7cCLTOIwJe1Z5Ga
📤 HighLevel API Call Details:
   URL: https://services.leadconnectorhq.com/contacts/[CONTACT_ID]?locationId=fXXJzwVf8OtANDf2M4VP
   Method: PUT
   Contact ID: [actual contact ID]
   Location ID: fXXJzwVf8OtANDf2M4VP
   Field ID: QPQCb7cCLTOIwJe1Z5Ga
   Field Value: "Approved"
📤 Request Body: {
  "customFields": [
    {
      "id": "QPQCb7cCLTOIwJe1Z5Ga",
      "field_value": "Approved"
    }
  ]
}
📥 HighLevel PUT response status: [status code]
📥 HighLevel PUT response: [response body]
✅ HighLevel contact updated with approval status (account_status = Approved)
```

### Audit Trail

Every approval attempt (success or failure) is logged to the audit system:

- **Success logs**: Stored with full request/response details
- **Failure logs**: Stored with error messages and response codes
- **Viewable by**: Admin users only (in "Audit Logs" tab)

### Verification

To verify this is working correctly:

1. Sign up with a test account
2. As admin, approve the account
3. Check the server console logs (shows the exact API call being made)
4. Go to "Audit Logs" tab in Admin Dashboard
5. Find the "ACCOUNT_APPROVAL_UPDATE" entry
6. Click "Details" to see the full request/response

### Curl Command Equivalent

The exact curl command being executed programmatically:

```bash
curl -X PUT "https://services.leadconnectorhq.com/contacts/{CONTACT_ID}?locationId=fXXJzwVf8OtANDf2M4VP" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2" \
  -H "Version: 2021-07-28" \
  -d '{"customFields": [{"id": "QPQCb7cCLTOIwJe1Z5Ga", "field_value": "Approved"}]}'
```

✅ **CONFIRMATION**: The system is correctly using both the Contact ID and Field ID as specified!
