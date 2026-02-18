# Account Approval with HighLevel Integration - Complete Workflow

## Overview
When an admin approves a bulk filing account, the system automatically updates the HighLevel contact's `account_status` custom field from "Pending" to "Approved" using the exact API format specified.

## API Format Differences (CRITICAL!)

HighLevel uses **array format for BOTH endpoints**, but with different field names:

### POST /contacts/upsert (Create/Update)
Uses **`customFields`** (plural) as an **array**:

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

### PUT /contacts/{contactId} (Update Only)
Uses **`customField`** (singular) as an **array**:

```json
{
  "customField": [
    {
      "key": "account_status",
      "field_value": "Approved"
    }
  ]
}
```

**Key Point:** Both use the same array structure `[{ key, field_value }]`, but the field name is plural for POST/upsert and singular for PUT.

---

## Approval Workflow

### 1. Account Creation (Initial State)

**User signs up:**
```
POST https://services.leadconnectorhq.com/contacts/upsert
```

**Request Body:**
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

**HighLevel Contact State After Creation:**
- Contact ID: `dl5PVOWciiPacUcEzhjO` (example)
- Tag: `bulk_status_pending_approval`
- Custom Field: `account_status = "Pending"`

---

### 2. Admin Reviews Account

Admin navigates to:
```
Admin Dashboard → Account Management → Pending Accounts
```

Admin sees:
- Firm Name
- Contact Name
- Email
- Professional Type
- Registration Date
- Status: "Pending"

---

### 3. Admin Approves Account

**Admin clicks "Approve" button**

**Server-side endpoint triggered:**
```
POST /make-server-2c01e603/admin/accounts/:userId/approve
```

**What happens:**

1. ✅ Account status updated in database → `status: 'approved'`
2. ✅ Username and temporary password generated
3. ✅ **HighLevel contact updated with approval status**
4. ✅ Approval email sent to user

---

### 4. HighLevel Contact Update (Approval)

**Endpoint:**
```bash
PUT https://services.leadconnectorhq.com/contacts/{contactId}?locationId=fXXJzwVf8OtANDf2M4VP
```

**Full Request:**
```bash
curl -X PUT "https://services.leadconnectorhq.com/contacts/dl5PVOWciiPacUcEzhjO?locationId=fXXJzwVf8OtANDf2M4VP" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2" \
  -H "Version: 2021-07-28" \
  -d '{
    "customField": [
      {
        "key": "account_status",
        "field_value": "Approved"
      }
    ]
  }'
```

**Request Body (JSON):**
```json
{
  "customField": [
    {
      "key": "account_status",
      "field_value": "Approved"
    }
  ]
}
```

**Response (Success):**
```json
{
  "contact": {
    "id": "dl5PVOWciiPacUcEzhjO",
    "locationId": "fXXJzwVf8OtANDf2M4VP",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    ...
  }
}
```

---

### 5. Server-Side Implementation

**File:** `/supabase/functions/server/index.tsx`

**Approval Endpoint:**
```typescript
app.post("/make-server-2c01e603/admin/accounts/:userId/approve", async (c) => {
  // ... authentication and validation ...

  // Update HighLevel contact with approval status
  if (targetAccount.highLevelContactId) {
    console.log('🔄 Updating HighLevel contact with approval status...');
    console.log('🔄 HighLevel Contact ID:', targetAccount.highLevelContactId);
    
    try {
      const updateHighLevelContact = async (contactId: string) => {
        const HIGHLEVEL_API_BASE = 'https://services.leadconnectorhq.com';
        const HIGHLEVEL_API_KEY = Deno.env.get('VITE_HIGHLEVEL_API_KEY') || 'pit-cca7bd65-1fe1-4754-88d7-a51883d631f2';
        const HIGHLEVEL_LOCATION_ID = Deno.env.get('VITE_HIGHLEVEL_LOCATION_ID') || 'fXXJzwVf8OtANDf2M4VP';
        
        // Use array format for custom fields with key/field_value structure
        const requestBody = {
          customField: [
            {
              key: 'account_status',
              field_value: 'Approved'
            }
          ]
        };
        
        console.log('📤 HighLevel PUT request body:', JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(`${HIGHLEVEL_API_BASE}/contacts/${contactId}?locationId=${HIGHLEVEL_LOCATION_ID}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
          },
          body: JSON.stringify(requestBody)
        });
        
        console.log('📥 HighLevel PUT response status:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ HighLevel PUT error response:', errorText);
          return false;
        }
        
        const responseText = await response.text();
        console.log('📥 HighLevel PUT response:', responseText);
        return true;
      };
      
      const updateSuccess = await updateHighLevelContact(targetAccount.highLevelContactId);
      
      if (updateSuccess) {
        console.log('✅ HighLevel contact updated with approval status (account_status = Approved)');
      } else {
        console.warn('⚠️ Failed to update HighLevel contact (non-critical)');
      }
    } catch (hlError) {
      console.warn('⚠️ HighLevel update error (non-critical):', hlError);
    }
  } else {
    console.log('⚠️ No HighLevel contact ID found for this account - skipping HighLevel update');
  }

  // ... send approval email ...
});
```

---

### 6. Console Logging (Debugging)

When admin approves an account, the following logs appear:

```
=== APPROVE ACCOUNT REQUEST ===
Verifying admin user...
Admin user verified: abc123-admin-id
Admin role confirmed
Target user ID: xyz789-user-id
Target account found: john@example.com
Generated credentials for: doeassociates_johndoe
Saving updated account...
Account approved for user xyz789-user-id with username: doeassociates_johndoe

🔄 Updating HighLevel contact with approval status...
🔄 HighLevel Contact ID: dl5PVOWciiPacUcEzhjO

📤 HighLevel PUT request body: {
  "customField": [
    {
      "key": "account_status",
      "field_value": "Approved"
    }
  ]
}

📥 HighLevel PUT response status: 200 OK
📥 HighLevel PUT response: {...}
✅ HighLevel contact updated with approval status (account_status = Approved)

Sending approval email...
Approval successful!
```

---

### 7. HighLevel Contact State After Approval

**Updated Fields:**
- Custom Field: `account_status = "Approved"` ✅ (changed from "Pending")

**Tag Change (Future Enhancement):**
- Could optionally update tags from `bulk_status_pending_approval` → `bulk_status_approved`

---

## Error Handling

### HighLevel Update Failures

**Scenario:** HighLevel API is down or contact ID is invalid

**Behavior:**
- ⚠️ Warning logged to console
- ✅ Account approval **continues successfully**
- ✅ User still receives approval email
- ✅ Account status in database is updated

**Why it's non-critical:**
- Primary system (Supabase) is the source of truth
- HighLevel is for CRM tracking only
- Can be manually synced later if needed

---

## Testing Checklist

### Pre-Approval Testing
- [ ] Create new account via signup form
- [ ] Verify HighLevel contact created with `account_status = "Pending"`
- [ ] Verify tag: `bulk_status_pending_approval`
- [ ] Check console logs for contact creation
- [ ] Note the HighLevel contact ID from logs

### Approval Testing
- [ ] Login as admin
- [ ] Navigate to Admin Dashboard → Account Management
- [ ] Find pending account in list
- [ ] Click "Approve" button
- [ ] Check console logs for HighLevel PUT request
- [ ] Verify console shows: `✅ HighLevel contact updated with approval status`
- [ ] Verify PUT request body has correct format
- [ ] Check HighLevel dashboard to confirm `account_status = "Approved"`

### Approval Email Testing
- [ ] Verify approval email sent to user
- [ ] Check email contains username and temporary password
- [ ] Verify email formatting is correct

---

## API Credentials

**Environment Variables (Already Configured):**
```bash
VITE_HIGHLEVEL_API_KEY=pit-cca7bd65-1fe1-4754-88d7-a51883d631f2
VITE_HIGHLEVEL_LOCATION_ID=fXXJzwVf8OtANDf2M4VP
```

**HighLevel Endpoints Used:**

1. **Create/Upsert Contact:**
   - `POST https://services.leadconnectorhq.com/contacts/upsert`

2. **Update Contact:**
   - `PUT https://services.leadconnectorhq.com/contacts/{contactId}?locationId={locationId}`

---

## Custom Field Schema Reference

| Field Key | Values | Set On | Updated On |
|-----------|--------|--------|------------|
| `account_type` | "Bulk Filing" | Signup | Never |
| `account_status` | "Pending" → "Approved" | Signup | **Approval** |
| `professional_type` | CPA, Attorney, etc. | Signup | Never |
| `sms_consent` | "true" / "false" | Signup | Never |
| `email_marketing_consent` | "true" / "false" | Signup | Never |
| `firm_profile_completed` | "false" → "true" | Signup | Profile Completion |

---

## Future Enhancements

### Tag Updates on Approval
Could also update tags when approving:

```json
{
  "customField": [
    { "key": "account_status", "field_value": "Approved" }
  ],
  "tags": ["bulk_status_approved"]  // Replace pending tag
}
```

### Workflow Triggers
Could trigger HighLevel workflows on approval:

```typescript
await triggerHighLevelWorkflow({
  workflowId: 'workflow_approval_automation',
  contactId: targetAccount.highLevelContactId,
  customData: {
    username: username,
    approval_date: new Date().toISOString()
  }
});
```

---

**Status:** ✅ Implementation Complete
**Date:** December 27, 2025

The account approval now automatically updates HighLevel contacts with the exact API format specified.