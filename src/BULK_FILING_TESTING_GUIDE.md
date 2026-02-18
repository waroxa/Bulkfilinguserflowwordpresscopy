# NYLTA Bulk Filing System - User Testing Guide

**For CPAs, Attorneys, and Compliance Professionals**

This guide walks you through testing the NYLTA bulk filing system to ensure everything works correctly for your firm. Follow these steps in order to verify the complete account setup and filing process.

---

## Before You Begin

**What You'll Need:**
- A test email address (different from your real work email)
- About 15-20 minutes to complete the full test
- Access to the test email inbox to verify emails

**Important:** Use test data for this walkthrough. Don't use your real firm information until you've verified everything works correctly.

---

## Part 1: Creating Your Account

### Step 1: Sign Up for a New Account

1. Go to the NYLTA signup page
2. Fill out the registration form with test information:
   - **First Name:** Test
   - **Last Name:** User
   - **Email:** Use a test email you can access (e.g., test@yourdomain.com)
   - **Firm Name:** Test CPA Firm
   - **Phone Number:** 555-123-4567
   - **Professional Type:** Select "CPA" (or your profession)
   - **Password:** Create a secure password
3. Click **"Create Account"**

**What Should Happen:**
- ✅ You see a success message
- ✅ You're told your account is pending approval
- ✅ You receive a confirmation email

---

### Step 2: Try to Log In (Before Approval)

1. Go to the login page
2. Enter your test email and password
3. Click **"Sign In"**

**What Should Happen:**
- ✅ You see a message: "Your account is pending approval. You'll receive an email once approved."
- ✅ You cannot access the dashboard yet

**Why This Happens:**  
For security and compliance, all bulk filing accounts must be approved by NYLTA administrators before access is granted.

---

## Part 2: Account Approval Process

### Step 3: Admin Approves Your Account

*This step is performed by NYLTA administrators. For testing purposes, you'll need admin access or ask an administrator to approve your test account.*

**Admin Steps:**
1. Log in as an administrator
2. Navigate to **Admin Dashboard**
3. Click on **Account Management** or **Pending Approvals**
4. Find your test account (test@yourdomain.com)
5. Click **"Approve Account"**

**What Should Happen:**
- ✅ Admin sees confirmation that account was approved
- ✅ You receive an approval email at your test email address

---

### Step 4: Log In After Approval

1. Check your test email inbox for the approval notification
2. Go to the NYLTA login page
3. Enter your email and password
4. Click **"Sign In"**

**What Should Happen:**
- ✅ You successfully log in
- ✅ You see a "Complete Your Firm Profile" screen
- ✅ You see a checklist of items to complete
- ✅ You cannot access bulk filing yet (profile must be completed first)

**Why This Happens:**  
Before you can file on behalf of clients, you must complete your firm's profile with accurate information. This ensures all filings are properly attributed to your licensed practice.

---

## Part 3: Completing Your Firm Profile

### Step 5: Fill Out Your Firm Profile

On the "Complete Your Firm Profile" screen:

1. **Review Auto-Filled Information:**
   - Firm Name (should already show "Test CPA Firm")
   - Contact Email (should show your test email)
   - Phone Number (should show the number you entered)
   - Your name should appear as an "Authorized Filer"

2. **Fill In Additional Required Information:**
   - **EIN (Employer Identification Number):** 12-3456789 (use test data)
   - **Street Address:** 123 Main Street
   - **City:** New York
   - **State:** NY
   - **ZIP Code:** 10001

3. **Review Authorized Filers Section:**
   - You should see yourself listed automatically
   - Verify your name, email, and professional title are correct

4. Click **"Complete Profile & Start Filing"**

**What Should Happen:**
- ✅ Profile saves successfully
- ✅ You see a "Profile Complete!" success page
- ✅ You see two buttons: "Start Bulk Filing Now" and "Go to Dashboard"

---

### Step 6: Access Your Dashboard

1. From the success page, click **"Go to Dashboard"**

**What Should Happen:**
- ✅ You're taken to your main dashboard
- ✅ You see a **"Start Bulk Filing"** button
- ✅ You can navigate all menu items
- ✅ The profile completion gate no longer appears
- ✅ All features are now unlocked

---

## Part 4: Testing Bulk Filing Features

### Step 7: Start a Test Bulk Filing

1. From your dashboard, click **"Start Bulk Filing"**

**What Should Happen:**
- ✅ You see the bulk filing wizard
- ✅ You're asked to choose between "Beneficial Ownership Disclosure" or "Exemption Attestation"

---

### Step 8: Test Exemption Filing (Quickest Test)

1. Click **"Exemption Attestation"**
2. Upload a test CSV file or manually add a test company:
   - **Company Name:** Test Company LLC
   - **EIN:** 98-7654321
   - **Exemption Type:** Select any exemption type

3. Follow the wizard steps
4. Review your submission
5. Click **"Submit"**

**What Should Happen:**
- ✅ Submission is accepted
- ✅ You see a confirmation page
- ✅ You receive a confirmation email
- ✅ The submission appears in your dashboard

---

### Step 9: Test Beneficial Ownership Filing (Full Test)

1. Start a new bulk filing
2. Click **"Beneficial Ownership Disclosure"**
3. Upload a test CSV or manually add a test company:
   - **Company Name:** Test Corporation Inc
   - **EIN:** 11-2233445

4. **Add Company Applicant Information:**
   - Full Name: Jane Applicant
   - Date of Birth: 01/15/1980
   - Address: 456 Oak Avenue, Chicago, IL 60601
   - ID Type: Driver's License
   - ID Number: D123456789

5. **Add Beneficial Owner Information:**
   - Full Name: John Owner
   - Date of Birth: 03/22/1975
   - Address: 789 Pine Street, Los Angeles, CA 90001
   - Ownership Percentage: 51%
   - ID Type: Passport
   - ID Number: P987654321

6. Review and submit

**What Should Happen:**
- ✅ All information is saved correctly
- ✅ Submission is accepted
- ✅ You see confirmation
- ✅ You receive email confirmation
- ✅ Submission appears in your dashboard

---

## Verification Checklist

After completing all steps above, verify the following:

### Account Setup
- [ ] Account was created successfully
- [ ] Could not log in before approval
- [ ] Received approval email
- [ ] Could log in after approval
- [ ] Profile completion gate appeared
- [ ] Profile completion gate disappeared after completion

### Firm Profile
- [ ] Auto-populated fields showed correct information
- [ ] Could fill in all required fields
- [ ] Profile saved successfully
- [ ] Dashboard unlocked after profile completion

### Bulk Filing
- [ ] Could access bulk filing wizard
- [ ] Could choose filing type (Exemption or Disclosure)
- [ ] Could add company information
- [ ] Could add beneficial owner/applicant details
- [ ] Submission was accepted
- [ ] Received confirmation email
- [ ] Submission appears in dashboard

---

## What to Look For: Success Indicators

### ✅ Good Signs (Everything Working)
- Forms save without errors
- You receive email confirmations promptly
- Dashboard shows your submissions
- Navigation between pages is smooth
- All buttons and links work as expected

### ⚠️ Warning Signs (Something May Be Wrong)
- Error messages appear
- Emails don't arrive within 5 minutes
- Blank pages or loading screens that don't finish
- Buttons that don't respond when clicked
- Data that disappears after page refresh

---

## Common Questions

### Q: How long does account approval take?
**A:** Test accounts are typically approved within a few minutes during business hours. Production accounts may take up to 24 hours for manual review.

### Q: Can I edit my firm profile after completing it?
**A:** For security and compliance reasons, firm profiles are locked after completion. Contact NYLTA support to request profile updates.

### Q: What happens if I make a mistake in a filing?
**A:** You can view all submissions in your dashboard. If you need to correct information before final submission to FinCEN, contact NYLTA support immediately.

### Q: Can I add more authorized filers later?
**A:** Yes, authorized filers can be managed through your firm profile settings or by contacting NYLTA support.

### Q: Is my test data saved permanently?
**A:** Test submissions may be periodically cleared from the system. Don't use test data for actual client filings.

---

## Need Help?

If you encounter any issues during testing:

1. **Check your email** for confirmation messages
2. **Refresh your browser** and try again
3. **Clear your browser cache** if pages aren't loading correctly
4. **Contact NYLTA Support** with:
   - Your test email address
   - What step you were on
   - Any error messages you saw
   - Screenshots if possible

---

## Next Steps After Testing

Once you've successfully completed this testing guide:

1. ✅ **Create your real account** using your actual firm information
2. ✅ **Complete your real firm profile** with accurate EIN and address
3. ✅ **Add your actual authorized filers** to your firm profile
4. ✅ **Begin filing for your clients** with confidence

---

## Important Reminders

- ⚠️ **Use test data only** during this testing phase
- ⚠️ **Don't submit real client information** until your production account is set up
- ⚠️ **Keep your login credentials secure**
- ⚠️ **Verify all information** before final submission
- ⚠️ **Contact support** if anything seems incorrect

---

**Thank you for testing the NYLTA Bulk Filing System!**

Your feedback helps us ensure a smooth, compliant filing experience for all professionals using our platform.
