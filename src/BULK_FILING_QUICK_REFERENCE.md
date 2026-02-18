# Bulk Filing CRM Integration - Quick Reference

## Custom Fields

| Field | Initial Value | After Approval | After Profile Complete |
|-------|--------------|----------------|----------------------|
| `account_type` | "Bulk Filing" | "Bulk Filing" | "Bulk Filing" |
| `account_status` | "Pending" | **"Approved"** | "Approved" |
| `firm_profile_completed` | "false" | "false" | **"true"** |

## Tags Evolution

| Stage | Tags |
|-------|------|
| **Signup** | `bulk_filing_firm`, `bulk_status_pending_approval`, `role_compliance` |
| **Approved** | `bulk_filing_firm`, `bulk_status_approved`, `role_compliance` |
| **Profile Complete** | `bulk_filing_firm`, `bulk_status_approved`, `role_compliance` |

## User Journey Gates

```
┌─────────────────────────────────────────────────────────────┐
│ SIGNUP                                                      │
│ - Create account                                            │
│ - HighLevel contact created                                 │
│ - account_status: "Pending"                                 │
│ - firm_profile_completed: "false"                           │
│ - CANNOT LOG IN (account pending)                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ ADMIN APPROVAL                                              │
│ - Admin approves account                                    │
│ - account_status → "Approved"                               │
│ - Tags → bulk_status_approved                               │
│ - CAN NOW LOG IN                                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ FIRST LOGIN → PROFILE COMPLETION GATE                       │
│ - User sees "Complete Your Firm Profile"                    │
│ - Pre-filled data from signup                               │
│ - Auto-created authorized filer                             │
│ - CANNOT access dashboard or bulk filing                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ COMPLETE FIRM PROFILE                                       │
│ - Fill in EIN, address, etc.                                │
│ - Save profile                                              │
│ - firm_profile_completed → "true"                           │
│ - Profile locked (firmName, EIN)                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ FULL ACCESS                                                 │
│ - Dashboard unlocked                                        │
│ - Bulk filing wizard available                              │
│ - All features accessible                                   │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

### Create Contact (Signup)
```bash
POST https://services.leadconnectorhq.com/contacts/
Headers:
  Authorization: Bearer {API_KEY}
  Version: 2021-07-28
Body:
  {
    "locationId": "{LOCATION_ID}",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@firm.com",
    "phone": "555-123-4567",
    "tags": ["bulk_filing_firm", "bulk_status_pending_approval", "role_compliance"],
    "customFields": {
      "account_type": "Bulk Filing",
      "account_status": "Pending",
      "firm_profile_completed": "false",
      "firm_name": "Smith CPA",
      "professional_type": "CPA"
    }
  }
```

### Update Contact (Approval)
```bash
PUT https://services.leadconnectorhq.com/contacts/{contactId}?locationId={LOCATION_ID}
Headers:
  Authorization: Bearer {API_KEY}
  Version: 2021-07-28
Body:
  {
    "customFields": {
      "account_status": "Approved"
    },
    "tags": ["bulk_filing_firm", "bulk_status_approved", "role_compliance"]
  }
```

### Update Contact (Profile Complete)
```bash
PUT https://services.leadconnectorhq.com/contacts/{contactId}?locationId={LOCATION_ID}
Headers:
  Authorization: Bearer {API_KEY}
  Version: 2021-07-28
Body:
  {
    "customFields": {
      "firm_profile_completed": "true"
    }
  }
```

## Code Snippets

### Check if Profile Complete (Frontend)
```typescript
const { account } = useAuth();

if (!account.firmProfileCompleted) {
  // Show profile completion gate
  return <ProfileCompletionGate />;
}

// Profile complete - show dashboard
return <Dashboard />;
```

### Update HighLevel on Approval (Backend)
```typescript
// In approval endpoint
if (targetAccount.highLevelContactId) {
  await updateHighLevelContact(targetAccount.highLevelContactId, {
    customFields: {
      account_status: 'Approved'
    },
    tags: ['bulk_filing_firm', 'bulk_status_approved', 'role_compliance']
  });
}
```

### Update HighLevel on Profile Complete (Backend)
```typescript
// In firm profile save endpoint
if (body.isComplete && !accountData.firmProfileCompleted) {
  accountData.firmProfileCompleted = true;
  await kv.set(`account:${userId}`, accountData);
  
  if (accountData.highLevelContactId) {
    await updateHighLevelContact(accountData.highLevelContactId, {
      customFields: {
        firm_profile_completed: 'true'
      }
    });
  }
}
```

## Validation Checklist

### After Signup
- [ ] HighLevel contact exists
- [ ] `account_type` = "Bulk Filing"
- [ ] `account_status` = "Pending"
- [ ] `firm_profile_completed` = "false"
- [ ] Tags: `bulk_filing_firm`, `bulk_status_pending_approval`, `role_compliance`
- [ ] User cannot log in

### After Approval
- [ ] `account_status` = "Approved"
- [ ] Tags updated to include `bulk_status_approved`
- [ ] User can log in
- [ ] User sees profile completion gate

### After Profile Completion
- [ ] `firm_profile_completed` = "true"
- [ ] Backend `firmProfileCompleted` = true
- [ ] Profile `isComplete` = true
- [ ] Profile `isLocked` = true
- [ ] User can access dashboard and bulk filing

## Environment Variables
```bash
VITE_HIGHLEVEL_API_KEY=pit-cca7bd65-1fe1-4754-88d7-a51883d631f2
VITE_HIGHLEVEL_LOCATION_ID=fXXJzwVf8OtANDf2M4VP
```

## Workflow Trigger Examples

### Workflow 1: New Bulk Filing Account
**Trigger**: Contact created with tag `bulk_filing_firm`
**Actions**: 
- Send welcome email
- Notify admin to review account
- Assign to compliance team

### Workflow 2: Account Approved
**Trigger**: Custom field `account_status` changes to "Approved"
**Actions**:
- Send approval email with login credentials
- Add to active clients list
- Start nurture sequence

### Workflow 3: Profile Completed
**Trigger**: Custom field `firm_profile_completed` changes to "true"
**Actions**:
- Send onboarding email with tips
- Offer training/demo
- Assign account manager

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Contact not created | API key invalid | Check VITE_HIGHLEVEL_API_KEY |
| Custom fields not set | Fields don't exist in HL | Create custom fields in HighLevel |
| Tags not applied | Tags don't exist in HL | Create tags in HighLevel |
| Profile gate persists | Cache issue | Clear browser cache, refresh |
| Status not syncing | API error | Check server logs for HL errors |

## Support

For issues or questions:
1. Check server logs for HighLevel API errors
2. Verify environment variables are set
3. Confirm custom fields exist in HighLevel
4. Test with a fresh incognito browser session
5. Review BULK_FILING_TESTING_GUIDE.md for detailed troubleshooting
