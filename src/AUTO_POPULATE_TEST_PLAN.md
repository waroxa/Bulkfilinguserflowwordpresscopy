# Auto-Population Feature - Test Plan

## Test Scenario: New User Complete Flow

### Prerequisites:
- Have admin credentials ready
- Clear browser cache/use incognito mode

### Step 1: Account Creation
1. Navigate to the signup page
2. Fill in the account creation form with:
   - **First Name**: John
   - **Last Name**: Smith
   - **Email**: john.smith@example.com
   - **Firm Name**: Smith & Associates CPA
   - **Phone**: 555-123-4567
   - **Professional Type**: CPA
   - **Password**: SecurePassword123!
3. Submit the form
4. **Expected Result**: 
   - Success message displayed
   - Account created with status "pending"
   - Unable to log in yet

### Step 2: Admin Approval
1. Log in as admin
2. Navigate to Admin Dashboard → Account Management
3. Find the pending account for "john.smith@example.com"
4. Click "Approve" button
5. **Expected Result**:
   - Account status changes to "approved"
   - Temporary credentials generated
   - Approval email logged to console (check server logs)

### Step 3: First Login After Approval
1. Log out from admin account
2. Log in with john.smith@example.com credentials
3. **Expected Result**:
   - Login successful
   - Redirected to Profile Completion Gate (firm profile incomplete)
   - See message: "Your firm profile is incomplete..."

### Step 4: Complete Firm Profile - Auto-Population Check
1. Click "Complete Firm Profile" button
2. **VERIFY AUTO-POPULATED FIELDS**:
   
   #### Business Information Section:
   - ✅ **Firm Name**: Should show "Smith & Associates CPA" (pre-filled)
   - ❌ **EIN**: Should be empty (needs user input)
   
   #### Address Section:
   - ❌ **Street Address**: Should be empty
   - ❌ **City**: Should be empty
   - ❌ **State**: Should be empty
   - ❌ **ZIP Code**: Should be empty
   - ✅ **Country**: Should default to "United States"
   
   #### Contact Information Section:
   - ✅ **Primary Contact Email**: Should show "john.smith@example.com" (pre-filled)
   - ✅ **Phone Number**: Should show "555-123-4567" (pre-filled)
   
   #### Authorized Filers Section:
   - ✅ **Should have 1 filer card pre-created** with:
     - **Full Name**: "John Smith" (pre-filled)
     - **Email**: "john.smith@example.com" (pre-filled)
     - **Title**: "CPA" (pre-filled from professionalType)
     - **Role**: "Authorized Filer" (pre-selected)
     - **Status**: "Active" (green badge)

3. **Expected Result**: 
   - Blue informational banner at top: "Welcome to NYLTA Bulk Filing! We've pre-filled some information from your account registration, including an authorized filer entry with your details. You can edit any field or add more authorized filers as needed."
   - All specified fields are pre-populated correctly
   - User can edit all fields (nothing is locked yet)

### Step 5: Complete Required Fields
1. Fill in the missing fields:
   - **EIN**: 12-3456789
   - **Street Address**: 123 Main Street
   - **City**: New York
   - **State**: New York
   - **ZIP Code**: 10001
2. Optionally: Edit the auto-created filer or add more filers
3. Click "Complete Profile & Start Filing"
4. **Expected Result**:
   - Success toast notification
   - Profile saved with isComplete: true, isLocked: true
   - Redirected to "Profile Complete!" congratulations page

### Step 6: Verify Profile is Locked
1. Click "Go to Dashboard"
2. Navigate to firm profile again (My Firm Profile or edit)
3. **Expected Result**:
   - Firm Name field is locked (gray background, lock icon)
   - EIN field is locked (gray background, lock icon)
   - "Request Change" buttons visible next to locked fields
   - Yellow warning banner: "Some fields are locked for security and compliance..."
   - Other fields remain editable

### Step 7: Backend Auto-Generation Test
1. Create a new account via signup (use different email)
2. Approve the account as admin
3. **Before first login**, check server logs when approved user logs in
4. **Expected in Server Logs**:
   ```
   Auto-generating firm profile for approved user {userId} from account data
   Auto-generated firm profile saved for user {userId}
   ```
5. Log in with new approved account
6. **Expected Result**:
   - Firm profile loads with all auto-populated data
   - One authorized filer already created
   - No errors in console

## Edge Cases to Test

### Edge Case 1: User with No Professional Type
- Create account without professionalType
- Approve and log in
- **Expected**: Title field in authorized filer should fall back to role (e.g., "cpa", "attorney")

### Edge Case 2: User with Empty Names
- Create account with minimal data
- Approve and log in
- **Expected**: Auto-created filer fullName should handle empty strings gracefully (no "  " double spaces)

### Edge Case 3: Multiple Login Sessions
- Log in once, don't complete profile
- Log out and log in again
- **Expected**: Profile data persists (auto-generated profile is saved to DB)
- **Expected**: Doesn't create duplicate authorized filers

### Edge Case 4: User Deletes Auto-Created Filer
- Log in after approval
- Remove the auto-created filer
- Add a different filer
- Save profile
- **Expected**: Works fine, user can manage filers as needed

### Edge Case 5: User Edits Auto-Created Filer
- Log in after approval
- Edit the auto-created filer's name/email/title
- Save profile
- **Expected**: Edited values are saved correctly

## Data Verification Checklist

After completing the test flow, verify in the database (KV store):

### Account Data (`account:{userId}`):
```json
{
  "userId": "...",
  "email": "john.smith@example.com",
  "firmName": "Smith & Associates CPA",
  "firstName": "John",
  "lastName": "Smith",
  "phone": "555-123-4567",
  "professionalType": "CPA",
  "role": "cpa",
  "status": "approved",
  "isFirstLogin": true
}
```

### Firm Profile Data (`firm_profile:{userId}`):
```json
{
  "firmName": "Smith & Associates CPA",
  "ein": "12-3456789",
  "address": "123 Main Street",
  "city": "New York",
  "state": "New York",
  "zipCode": "10001",
  "country": "United States",
  "contactEmail": "john.smith@example.com",
  "phone": "555-123-4567",
  "authorizedFilers": [
    {
      "id": "filer-...",
      "fullName": "John Smith",
      "email": "john.smith@example.com",
      "title": "CPA",
      "role": "Authorized Filer",
      "status": "Active"
    }
  ],
  "isComplete": true,
  "isLocked": true,
  "userId": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

## Success Criteria

✅ **Auto-Population Works**: 
- Firm name, email, phone are pre-filled on first access
- One authorized filer is automatically created with correct details

✅ **User Experience**: 
- Clear messaging about pre-filled data
- User can edit all fields before first save
- User can add/remove/edit filers as needed

✅ **Data Integrity**: 
- No duplicate filers created on multiple logins
- Profile data matches account data
- Locked fields cannot be edited without change request

✅ **Error Handling**: 
- No console errors during profile load
- Graceful handling of missing/empty data
- Server logs show auto-generation process

## Regression Tests

After implementation, verify these still work:

1. ✅ Existing profiles (already complete) load correctly
2. ✅ Users who completed profile before this feature still have access
3. ✅ Admin can still approve/reject accounts
4. ✅ Change requests for locked fields still work
5. ✅ Bulk filing flow works after profile completion
6. ✅ Dashboard access is gated by profile completion

## Performance Considerations

- Auto-generation should complete in < 500ms
- No noticeable delay when loading firm profile
- Server logs should confirm auto-generation only happens once per user

## Known Limitations

1. **Address fields not captured at signup** - User must still fill these in
2. **EIN not captured at signup** - User must provide this during profile completion
3. **Only works for new approvals** - Existing users won't get auto-population retroactively
