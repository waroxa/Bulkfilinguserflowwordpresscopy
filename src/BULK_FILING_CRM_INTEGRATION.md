# Bulk Filing Account Creation & CRM Integration

## Overview
This document outlines the updated account creation flow and HighLevel CRM integration for Bulk Filing firms in the NYLTA portal.

## Account Type Classification

### 1. Account Type Field
- **Field**: `account_type`
- **Value**: `"Bulk Filing"`
- **Purpose**: Explicitly identifies bulk filing accounts (not relying on tags alone)
- **Storage**: 
  - Backend KV Store: `accountData.accountType` (implicit from context)
  - HighLevel CRM: `customFields.account_type`

### 2. Account Status
- **Field**: `account_status`
- **Initial Value**: `"Pending"`
- **Approval Value**: `"Approved"`
- **Purpose**: Tracks approval workflow state
- **Storage**:
  - Backend KV Store: `accountData.status`
  - HighLevel CRM: `customFields.account_status`

## Tag System

### Initial Account Creation Tags
Replace old generic tags with standardized bulk filing tags:

```javascript
tags: [
  'bulk_filing_firm',
  'bulk_status_pending_approval',
  'role_compliance'
]
```

### After Account Approval
Tags are updated to:

```javascript
tags: [
  'bulk_filing_firm',
  'bulk_status_approved',
  'role_compliance'
]
```

### Removed/Deprecated Tags
- ❌ `status_pending_approval` (single-filer legacy)
- ❌ `event_signup` (not applicable to firms)
- ❌ `role_${role}` (replaced with `role_compliance`)

## HighLevel CRM Payload Structure

### Account Creation Payload
```javascript
{
  locationId: HIGHLEVEL_LOCATION_ID,
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@firmname.com",
  phone: "555-123-4567",
  source: "NYLTA Bulk Filing Portal - Account Registration",
  tags: [
    "bulk_filing_firm",
    "bulk_status_pending_approval",
    "role_compliance"
  ],
  customFields: {
    account_type: "Bulk Filing",
    account_status: "Pending",
    firm_name: "Smith & Associates CPA",
    professional_type: "CPA",
    firm_profile_completed: "false",
    registration_date: "2025-01-15T10:30:00.000Z",
    country: "United States",
    sms_consent: "Yes",
    email_marketing_consent: "Yes"
  }
}
```

### Account Approval Update Payload
When admin approves account:

```javascript
{
  customFields: {
    account_status: "Approved"
  },
  tags: [
    "bulk_filing_firm",
    "bulk_status_approved",
    "role_compliance"
  ]
}
```

### Firm Profile Completion Update Payload
When user completes firm profile:

```javascript
{
  customFields: {
    firm_profile_completed: "true"
  }
}
```

## Firm Profile Completion Tracking

### Custom Field
- **Field**: `firm_profile_completed`
- **Type**: String (boolean as string for HighLevel compatibility)
- **Default**: `"false"`
- **Updated to**: `"true"` when profile is saved with all required fields

### Required Fields for Completion
Profile is considered complete when user saves with:

1. ✅ Legal Business Name (Firm Name)
2. ✅ EIN (Employer Identification Number)
3. ✅ Firm Address (Street, City, State, ZIP, Country)
4. ✅ Contact Information (Email, Phone)
5. ✅ At least one Active Authorized Filer

### Backend Implementation
```typescript
// In /supabase/functions/server/index.tsx - firm-profile POST endpoint
if (body.isComplete && userId !== 'default_user') {
  const accountData = await kv.get(`account:${userId}`);
  
  if (accountData && !accountData.firmProfileCompleted) {
    accountData.firmProfileCompleted = true;
    await kv.set(`account:${userId}`, accountData);
    
    // Sync to HighLevel
    await updateHighLevelContact(accountData.highLevelContactId, {
      customFields: {
        firm_profile_completed: 'true'
      }
    });
  }
}
```

## UI Behavior After Account Creation

### Profile Completion Gate
After login, the system checks:

```javascript
if (!firmProfileComplete) {
  // Show ProfileCompletionGate
  // Block access to:
  // - Dashboard bulk filing actions
  // - Bulk filing wizard
  // - Client management
  // - All filing operations
}
```

### User Flow
1. **User creates account** → Status: Pending, Profile: Incomplete
2. **Admin approves account** → Status: Approved, Profile: Still Incomplete
3. **User logs in** → Redirected to Profile Completion Gate
4. **User completes firm profile** → Profile: Complete, Access: Full
5. **User can now access bulk filing** → Full portal functionality unlocked

## Implementation Files Changed

### 1. `/utils/highlevel.ts`
- Updated `createHighLevelContact()` to use POST `/contacts/` instead of upsert
- Added support for `customFields` in request payload
- Updated `updateHighLevelContact()` to support custom fields
- Added logging for custom field updates

### 2. `/contexts/AuthContext.tsx`
- Updated signup flow to send new bulk filing tags
- Added custom fields: `account_type`, `account_status`, `firm_profile_completed`
- Changed tags to bulk-specific tags
- Added `firmProfileCompleted` to AccountData interface

### 3. `/supabase/functions/server/index.tsx`
**Signup Endpoint (`/signup`)**:
- Added `firmProfileCompleted: false` to account data
- Stores account with pending status

**Approval Endpoint (`/admin/accounts/:userId/approve`)**:
- Updates account status to "approved"
- Syncs to HighLevel with `account_status: "Approved"`
- Updates tags to `bulk_status_approved`

**Firm Profile Save Endpoint (`/firm-profile` POST)**:
- Detects when profile is completed (`isComplete: true`)
- Sets `accountData.firmProfileCompleted = true`
- Syncs to HighLevel with `firm_profile_completed: "true"`

### 4. `/App.tsx`
- Already has profile completion gate logic
- Checks `firmProfileComplete` state before allowing access
- Shows ProfileCompletionGate when profile is incomplete

## HighLevel Workflow Triggers

The updated custom fields enable workflows to trigger on:

### Trigger 1: Account Created
- **When**: Contact created with `account_type = "Bulk Filing"`
- **Tags**: `bulk_filing_firm`, `bulk_status_pending_approval`
- **Action**: Send welcome email, notify admin for review

### Trigger 2: Account Approved
- **When**: `account_status` changes to "Approved"
- **Tags**: Updated to include `bulk_status_approved`
- **Action**: Send approval email, assign to compliance team

### Trigger 3: Profile Completed
- **When**: `firm_profile_completed` changes to "true"
- **Action**: Send onboarding email, enable full access notifications

## Testing Checklist

### Account Creation
- [ ] Contact created in HighLevel with correct tags
- [ ] Custom field `account_type = "Bulk Filing"` is set
- [ ] Custom field `account_status = "Pending"` is set
- [ ] Custom field `firm_profile_completed = "false"` is set
- [ ] Tags include: `bulk_filing_firm`, `bulk_status_pending_approval`, `role_compliance`
- [ ] Old tags NOT present: `status_pending_approval`, `event_signup`

### Account Approval
- [ ] Account status updates to "approved" in backend
- [ ] HighLevel contact updated with `account_status = "Approved"`
- [ ] Tags updated to include `bulk_status_approved`
- [ ] Approval email sent to user
- [ ] User can now log in

### First Login
- [ ] User sees Profile Completion Gate
- [ ] Cannot access dashboard or bulk filing
- [ ] "Complete Firm Profile" button works
- [ ] Profile loads with auto-populated data

### Firm Profile Completion
- [ ] All required fields filled in
- [ ] Save button updates backend
- [ ] `firmProfileCompleted` flag set to true in account
- [ ] HighLevel contact updated with `firm_profile_completed = "true"`
- [ ] User redirected to success page
- [ ] Profile is now locked (firmName, EIN)

### Post-Profile Completion
- [ ] User can access dashboard
- [ ] User can start bulk filing wizard
- [ ] Profile completion gate no longer shows
- [ ] All portal features unlocked

## API Endpoints Summary

### HighLevel API Calls

**Create Contact** (at signup):
```
POST https://services.leadconnectorhq.com/contacts/
Authorization: Bearer {API_KEY}
Version: 2021-07-28
```

**Update Contact** (on approval):
```
PUT https://services.leadconnectorhq.com/contacts/{contactId}?locationId={LOCATION_ID}
Authorization: Bearer {API_KEY}
Version: 2021-07-28
```

**Update Contact** (on profile completion):
```
PUT https://services.leadconnectorhq.com/contacts/{contactId}?locationId={LOCATION_ID}
Authorization: Bearer {API_KEY}
Version: 2021-07-28
```

## Environment Variables Required
```
VITE_HIGHLEVEL_API_KEY=pit-cca7bd65-1fe1-4754-88d7-a51883d631f2
VITE_HIGHLEVEL_LOCATION_ID=fXXJzwVf8OtANDf2M4VP
```

## Benefits of This Implementation

1. **Clear Account Classification**: `account_type` field explicitly identifies bulk filing accounts
2. **Status Tracking**: `account_status` provides clear visibility into approval state
3. **Profile Completion Tracking**: `firm_profile_completed` enables workflow automation
4. **Standardized Tags**: Bulk-specific tags improve CRM organization
5. **Workflow Integration**: Custom fields trigger automated workflows in HighLevel
6. **Data Consistency**: All account data synchronized between backend and CRM
7. **Better UX**: Profile completion gate ensures users complete onboarding

## Future Enhancements

- Add more custom fields for tracking (e.g., `last_bulk_filing_date`, `total_filings`)
- Implement workflow for profile changes requiring approval
- Add custom field for firm tier/pricing level
- Track authorized filer count as custom field
- Add engagement tracking fields
