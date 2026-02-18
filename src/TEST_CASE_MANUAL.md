# NYLTA Bulk Filing System - Comprehensive Test Case Manual

**Version:** 1.0  
**Last Updated:** January 5, 2026  
**Purpose:** Complete testing guide for Admin, Customer, and Team dashboards

---

## 📋 TABLE OF CONTENTS

1. [Test Environment Setup](#test-environment-setup)
2. [Admin Dashboard Tests](#admin-dashboard-tests)
3. [Customer Dashboard Tests](#customer-dashboard-tests)
4. [Team Dashboard Tests](#team-dashboard-tests)
5. [Integration Tests](#integration-tests)
6. [Performance Tests](#performance-tests)
7. [Security Tests](#security-tests)
8. [Bug Reporting](#bug-reporting)

---

## 🔧 TEST ENVIRONMENT SETUP

### Prerequisites

**Test Accounts Required:**
- [ ] Admin account (full access)
- [ ] Firm account (customer/professional)
- [ ] Processor account (team member)
- [ ] Test HighLevel contact

**Test Data Required:**
- [ ] Sample CSV file with 10 clients
- [ ] Sample CSV file with mixed disclosure/exemption
- [ ] Sample CSV file with errors (for validation testing)
- [ ] Test bank account information (use test mode)

### Environment Configuration

```bash
# Verify environment variables
HIGHLEVEL_API_KEY=pit-cca7bd65-1fe1-4754-88d7-a51883d631f2
HIGHLEVEL_LOCATION_ID=fXXJzwVf8OtANDf2M4VP

# Test HighLevel connectivity
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/contacts' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28'
```

### Test Data Setup

**Create Test Contacts in HighLevel:**
1. Email: admin-test@nylta.com
2. Email: firm-test@nylta.com
3. Email: processor-test@nylta.com

**Prepare Test CSV Files:**
- `/test-data/valid-10-clients.csv`
- `/test-data/mixed-filing-types.csv`
- `/test-data/validation-errors.csv`
- `/test-data/large-volume-100-clients.csv`

---

## 👨‍💼 ADMIN DASHBOARD TESTS

### Test Suite 1: Admin Login & Access

**Test 1.1: Admin Login**
- **Steps:**
  1. Navigate to `/admin`
  2. Enter admin credentials
  3. Click "Login"
- **Expected Result:** Successfully logged in, dashboard loads
- **Status:** ☐ Pass ☐ Fail

**Test 1.2: Admin Role Verification**
- **Steps:**
  1. Login as admin
  2. Check available tabs
  3. Verify all admin features visible
- **Expected Result:** All tabs visible (Overview, Submissions, Analytics, etc.)
- **Status:** ☐ Pass ☐ Fail

**Test 1.3: Unauthorized Access Prevention**
- **Steps:**
  1. Logout from admin
  2. Try to access `/admin` directly without login
- **Expected Result:** Redirected to login page
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 2: Submissions Review Tab

**Test 2.1: View Pending Submissions**
- **Steps:**
  1. Navigate to "Submissions" tab
  2. Filter by "Pending Review"
  3. Verify list displays
- **Expected Result:** All pending submissions shown with complete details
- **Status:** ☐ Pass ☐ Fail
- **Data Source:** Should pull from HighLevel CRM, not localStorage

**Test 2.2: Review Submission Details**
- **Steps:**
  1. Click "Review" on a pending submission
  2. Check all client data loads
  3. Verify beneficial owner information visible
- **Expected Result:** Complete submission details displayed in modal
- **Status:** ☐ Pass ☐ Fail

**Test 2.3: Approve Submission**
- **Steps:**
  1. Open review dialog for pending submission
  2. Click "Approve"
  3. Verify status update
- **Expected Result:** 
  - Status changes to "Approved"
  - HighLevel contact updated
  - Confirmation email sent
- **Status:** ☐ Pass ☐ Fail

**Test 2.4: Reject Submission**
- **Steps:**
  1. Open review dialog for pending submission
  2. Select rejection reason
  3. Add notes
  4. Click "Reject"
- **Expected Result:**
  - Status changes to "Rejected"
  - Rejection reason saved
  - Notification sent to firm
- **Status:** ☐ Pass ☐ Fail

**Test 2.5: Search Submissions**
- **Steps:**
  1. Enter firm name in search box
  2. Enter confirmation number in search box
  3. Enter EIN in search box
- **Expected Result:** Filtered results for each search term
- **Status:** ☐ Pass ☐ Fail

**Test 2.6: Filter by Status**
- **Steps:**
  1. Select "Paid" from status filter
  2. Select "Processing" from status filter
  3. Select "Abandoned" from status filter
- **Expected Result:** Only submissions matching filter shown
- **Status:** ☐ Pass ☐ Fail

**Test 2.7: Generate PDF Receipt**
- **Steps:**
  1. Click "Generate PDF" on approved submission
  2. Verify PDF downloads
  3. Open PDF and check contents
- **Expected Result:** PDF contains all submission details, properly formatted
- **Status:** ☐ Pass ☐ Fail

**Test 2.8: Generate Summary PDF**
- **Steps:**
  1. Click "Generate Summary PDF"
  2. Verify PDF downloads
  3. Check summary contains all filings
- **Expected Result:** Summary PDF with all submissions in period
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 3: Analytics Tab

**Test 3.1: Revenue Metrics Display**
- **Steps:**
  1. Navigate to "Analytics" tab
  2. Check total revenue card
  3. Verify month-over-month % change
- **Expected Result:** Accurate revenue calculations from real data
- **Status:** ☐ Pass ☐ Fail
- **Data Source:** Should calculate from HighLevel, not mock data

**Test 3.2: Conversion Rate Calculation**
- **Steps:**
  1. View conversion rate metric
  2. Verify calculation: (Paid / Total) × 100
  3. Compare with manual calculation
- **Expected Result:** Correct conversion rate percentage
- **Status:** ☐ Pass ☐ Fail

**Test 3.3: Charts Display**
- **Steps:**
  1. Check status distribution pie chart
  2. Check client volume bar chart
  3. Check weekly submissions line chart
- **Expected Result:** All charts render with accurate data
- **Status:** ☐ Pass ☐ Fail

**Test 3.4: Average Revenue Metrics**
- **Steps:**
  1. Check avg revenue per submission
  2. Check avg revenue per client
  3. Verify calculations
- **Expected Result:** Accurate averages displayed
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 4: Account Management Tab

**Test 4.1: View Active Firms**
- **Steps:**
  1. Navigate to "Account Management" tab
  2. View list of active firms
  3. Check firm details
- **Expected Result:** All active firm accounts listed with complete information
- **Status:** ☐ Pass ☐ Fail

**Test 4.2: Activate New Firm**
- **Steps:**
  1. Find pending firm
  2. Click "Activate"
  3. Verify status change
- **Expected Result:** Firm status changes to "Active"
- **Status:** ☐ Pass ☐ Fail

**Test 4.3: Suspend Firm Account**
- **Steps:**
  1. Select active firm
  2. Click "Suspend"
  3. Add suspension reason
- **Expected Result:** Firm cannot access bulk filing wizard
- **Status:** ☐ Pass ☐ Fail

**Test 4.4: View Firm Submission History**
- **Steps:**
  1. Click on firm name
  2. View submission history
  3. Check all past submissions
- **Expected Result:** Complete history of all firm's submissions
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 5: Pricing Settings Tab

**Test 5.1: View Current Pricing Tiers**
- **Steps:**
  1. Navigate to "Pricing Settings"
  2. View all pricing tiers
  3. Check tier thresholds
- **Expected Result:** Current pricing structure displayed
- **Status:** ☐ Pass ☐ Fail

**Test 5.2: Update Pricing Tier**
- **Steps:**
  1. Edit tier 1 (1-10 filings)
  2. Change price per filing
  3. Save changes
- **Expected Result:** New pricing saved and applied to future submissions
- **Status:** ☐ Pass ☐ Fail

**Test 5.3: Enable/Disable Early Bird Discount**
- **Steps:**
  1. Toggle early bird discount
  2. Set discount percentage
  3. Set deadline date
- **Expected Result:** Discount applied to eligible submissions
- **Status:** ☐ Pass ☐ Fail

**Test 5.4: Pricing History**
- **Steps:**
  1. View pricing change history
  2. Check effective dates
  3. Verify audit trail
- **Expected Result:** Complete log of all pricing changes
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 6: Email Marketing Tab

**Test 6.1: Send Bulk Email**
- **Steps:**
  1. Navigate to "Email Marketing"
  2. Compose email
  3. Select recipient filter
  4. Send
- **Expected Result:** Email sent to all matching recipients
- **Status:** ☐ Pass ☐ Fail

**Test 6.2: Email Templates**
- **Steps:**
  1. Create new template
  2. Save template
  3. Use template in email
- **Expected Result:** Template saved and reusable
- **Status:** ☐ Pass ☐ Fail

**Test 6.3: Segment Filtering**
- **Steps:**
  1. Filter by "Active Firms"
  2. Filter by "High Value Clients"
  3. Filter by "Inactive >30 days"
- **Expected Result:** Correct segment counts
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 7: Chargebacks Tab

**Test 7.1: View Chargeback List**
- **Steps:**
  1. Navigate to "Chargebacks"
  2. View all chargeback requests
  3. Check details
- **Expected Result:** All chargeback/dispute records shown
- **Status:** ☐ Pass ☐ Fail

**Test 7.2: Process Chargeback**
- **Steps:**
  1. Select chargeback
  2. Review evidence
  3. Approve/Deny
- **Expected Result:** Chargeback processed, status updated
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 8: Admin Tools Tab

**Test 8.1: CSV Form Validator**
- **Steps:**
  1. Navigate to "Tools" tab
  2. Select "CSV Form Validator"
  3. Run validation test
- **Expected Result:** Reports on CSV/form field alignment
- **Status:** ☐ Pass ☐ Fail

**Test 8.2: HighLevel Custom Fields Viewer**
- **Steps:**
  1. Select "HighLevel Custom Fields" tool
  2. Click "Fetch Custom Fields"
  3. View all 108 fields
- **Expected Result:** All custom fields loaded from HighLevel API
- **Status:** ☐ Pass ☐ Fail
- **Critical:** Data MUST come from HighLevel API, not localStorage

**Test 8.3: Curl Test Submission Tool**
- **Steps:**
  1. Select "Curl Test Tool"
  2. Enter test email (existing HighLevel contact)
  3. Click "Submit Test to HighLevel"
  4. Verify submission
- **Expected Result:**
  - Test data submitted successfully
  - Submission number generated (SUB-YYYY-MMDDHHMMSS)
  - IP address captured
  - HighLevel contact updated with all custom fields
  - Note created in HighLevel
- **Status:** ☐ Pass ☐ Fail
- **Critical:** Verify in HighLevel that all data was written correctly

**Test 8.4: Export Custom Fields**
- **Steps:**
  1. In HighLevel Fields Viewer
  2. Click "Export All Fields"
  3. Verify CSV download
- **Expected Result:** CSV file contains all 108 custom fields
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 9: Audit Log

**Test 9.1: View Audit Events**
- **Steps:**
  1. Navigate to "Audit Log"
  2. View recent events
  3. Check event details
- **Expected Result:** All admin actions logged
- **Status:** ☐ Pass ☐ Fail

**Test 9.2: Filter Audit Log**
- **Steps:**
  1. Filter by action type
  2. Filter by user
  3. Filter by date range
- **Expected Result:** Filtered results displayed
- **Status:** ☐ Pass ☐ Fail

**Test 9.3: Export Audit Log**
- **Steps:**
  1. Select date range
  2. Click "Export"
  3. Verify CSV download
- **Expected Result:** Complete audit trail in CSV
- **Status:** ☐ Pass ☐ Fail

---

## 👔 CUSTOMER DASHBOARD TESTS (Firm/Professional Users)

### Test Suite 10: Firm Registration & Login

**Test 10.1: New Firm Registration**
- **Steps:**
  1. Navigate to landing page
  2. Fill out registration form
  3. Submit
- **Expected Result:**
  - Account created
  - HighLevel contact created
  - Welcome email sent
- **Status:** ☐ Pass ☐ Fail
- **Critical:** Verify contact created in HighLevel CRM

**Test 10.2: Email Verification**
- **Steps:**
  1. Check email for verification link
  2. Click verification link
  3. Verify account activated
- **Expected Result:** Account verified, can login
- **Status:** ☐ Pass ☐ Fail

**Test 10.3: Firm Profile Completion**
- **Steps:**
  1. Login as new firm
  2. Complete firm profile
  3. Save profile
- **Expected Result:**
  - Profile saved
  - "Firm Profile Complete" tag added in HighLevel
  - Access to bulk filing wizard granted
- **Status:** ☐ Pass ☐ Fail
- **Critical:** Profile data MUST be saved to backend, not just localStorage

**Test 10.4: Incomplete Profile Restriction**
- **Steps:**
  1. Login with incomplete profile
  2. Try to access bulk filing wizard
- **Expected Result:** Redirected to complete profile first
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 11: Bulk Filing Wizard - CSV Upload Path

**Test 11.1: Download CSV Template**
- **Steps:**
  1. Navigate to Step 1
  2. Click "Download CSV Template (With Examples)"
  3. Open downloaded file
- **Expected Result:** CSV template with all 57 columns and example rows
- **Status:** ☐ Pass ☐ Fail

**Test 11.2: Upload Valid CSV**
- **Steps:**
  1. Upload test CSV with 10 clients
  2. Verify parsing
  3. Check client preview
- **Expected Result:** All 10 clients loaded, data displayed correctly
- **Status:** ☐ Pass ☐ Fail

**Test 11.3: Upload CSV with Errors**
- **Steps:**
  1. Upload CSV with validation errors
  2. Check error messages
  3. Review error details
- **Expected Result:** Specific errors highlighted with row/column info
- **Status:** ☐ Pass ☐ Fail

**Test 11.4: CSV with Mixed Filing Types**
- **Steps:**
  1. Upload CSV with both disclosure and exemption clients
  2. Verify both types recognized
  3. Proceed through wizard
- **Expected Result:** Both filing types handled correctly in wizard
- **Status:** ☐ Pass ☐ Fail

**Test 11.5: Edit Client After CSV Upload**
- **Steps:**
  1. Upload CSV
  2. Click "Edit" on a client
  3. Modify data
  4. Save changes
- **Expected Result:** Changes reflected in client data
- **Status:** ☐ Pass ☐ Fail

**Test 11.6: Remove Client After CSV Upload**
- **Steps:**
  1. Upload CSV with 10 clients
  2. Click "Remove" on 2 clients
  3. Verify count updates
- **Expected Result:** Only 8 clients remain, pricing updates
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 12: Bulk Filing Wizard - Manual Entry Path

**Test 12.1: Manual Entry Form Display**
- **Steps:**
  1. Click "Or Enter Clients Manually Using Form"
  2. Verify form displays
  3. Check all fields present
- **Expected Result:** Complete manual entry form shown
- **Status:** ☐ Pass ☐ Fail

**Test 12.2: Add Client via Manual Form**
- **Steps:**
  1. Fill out all required fields
  2. Select "disclosure" filing type
  3. Click "Add Client"
- **Expected Result:** Client added to list
- **Status:** ☐ Pass ☐ Fail

**Test 12.3: Form Validation**
- **Steps:**
  1. Try to submit with missing required fields
  2. Check error messages
  3. Fill missing fields
  4. Resubmit
- **Expected Result:** Validation errors shown, then successful submission
- **Status:** ☐ Pass ☐ Fail

**Test 12.4: Add Multiple Clients**
- **Steps:**
  1. Add client 1 (disclosure)
  2. Add client 2 (exemption)
  3. Add client 3 (disclosure)
  4. Verify all in list
- **Expected Result:** All 3 clients in list with correct types
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 13: Wizard Step 2 - Filing Type Selection

**Test 13.1: Select Disclosure for Client**
- **Steps:**
  1. Navigate to Step 2
  2. Select client
  3. Choose "Beneficial Ownership Disclosure"
- **Expected Result:** Client marked for disclosure path
- **Status:** ☐ Pass ☐ Fail

**Test 13.2: Select Exemption for Client**
- **Steps:**
  1. Select client
  2. Choose "Claims Exemption"
- **Expected Result:** Client marked for exemption path
- **Status:** ☐ Pass ☐ Fail

**Test 13.3: Bulk Select All Disclosure**
- **Steps:**
  1. Click "Select All as Disclosure"
  2. Verify all clients updated
- **Expected Result:** All clients set to disclosure
- **Status:** ☐ Pass ☐ Fail

**Test 13.4: Bulk Select All Exemption**
- **Steps:**
  1. Click "Select All as Exemption"
  2. Verify all clients updated
- **Expected Result:** All clients set to exemption
- **Status:** ☐ Pass ☐ Fail

**Test 13.5: Validation - Require Selection**
- **Steps:**
  1. Leave one client without selection
  2. Try to proceed to next step
- **Expected Result:** Error message, cannot proceed
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 14: Wizard Step 3 - Beneficial Ownership Disclosure Path

**Test 14.1: Company Applicant Entry (REQUIRED for Disclosure)**
- **Steps:**
  1. Enter Company Applicant 1 data
  2. Verify all fields required
  3. Try to skip (should fail)
- **Expected Result:** 
  - All Company Applicant fields required
  - Cannot proceed without complete data
- **Status:** ☐ Pass ☐ Fail
- **Critical:** Company Applicant ONLY appears in disclosure, NEVER in exemption

**Test 14.2: Add Optional Company Applicant 2**
- **Steps:**
  1. Click "Add Company Applicant 2"
  2. Enter data
  3. Verify saved
- **Expected Result:** Second company applicant recorded
- **Status:** ☐ Pass ☐ Fail

**Test 14.3: Beneficial Owner 1 Entry (REQUIRED)**
- **Steps:**
  1. Enter Beneficial Owner 1 data
  2. Include address, DOB, ID info, ownership %
  3. Verify all required
- **Expected Result:** All BO1 fields required, properly saved
- **Status:** ☐ Pass ☐ Fail

**Test 14.4: Add Additional Beneficial Owners**
- **Steps:**
  1. Click "Add Beneficial Owner"
  2. Enter BO2, BO3, BO4 data
  3. Verify all saved
- **Expected Result:** Up to 4 beneficial owners supported
- **Status:** ☐ Pass ☐ Fail

**Test 14.5: Full ID Number Collection**
- **Steps:**
  1. Enter ID number for company applicant
  2. Enter ID number for beneficial owner
  3. Verify full number saved (not masked)
- **Expected Result:** Full ID numbers collected and stored
- **Status:** ☐ Pass ☐ Fail
- **Critical:** ID numbers must be FULL, not masked

**Test 14.6: International Address Support**
- **Steps:**
  1. Select "Canada" as country
  2. Verify State dropdown changes to Province
  3. Enter Canadian address
- **Expected Result:** Province dropdown shown for Canada, State for USA
- **Status:** ☐ Pass ☐ Fail

**Test 14.7: Ownership Percentage Validation**
- **Steps:**
  1. Enter ownership % over 100
  2. Enter negative ownership %
  3. Enter valid percentage
- **Expected Result:** Invalid percentages rejected
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 15: Wizard Step 3 - Exemption Attestation Path

**Test 15.1: NO Company Applicant in Exemption Path**
- **Steps:**
  1. For client marked as "exemption"
  2. Verify Company Applicant section NOT shown
  3. Verify cannot add Company Applicant
- **Expected Result:** 
  - Company Applicant section completely hidden
  - No way to add Company Applicant data
- **Status:** ☐ Pass ☐ Fail
- **Critical:** This is a CRITICAL rule - Company Applicant NEVER appears in exemption path

**Test 15.2: Exemption Category Selection**
- **Steps:**
  1. View exemption category dropdown
  2. Verify all 23 categories present
  3. Select category
- **Expected Result:** All categories match HighLevel custom field options exactly
- **Status:** ☐ Pass ☐ Fail

**Test 15.3: Exemption Category List Verification**
- **Steps:**
  1. Open dropdown
  2. Count categories
  3. Compare with this list:
     - Bank
     - Credit Union
     - Depository Institution Holding Company
     - Money Services Business
     - Broker or Dealer in Securities
     - Securities Exchange or Clearing Agency
     - Other Exchange Act Registered Entity
     - Investment Company or Investment Adviser
     - Venture Capital Fund Adviser
     - Insurance Company
     - State-Licensed Insurance Producer
     - Commodity Exchange Act Registered Entity
     - Accounting Firm
     - Public Utility
     - Financial Market Utility
     - Pooled Investment Vehicle
     - Tax-Exempt Entity
     - Entity Assisting a Tax-Exempt Entity
     - Large Operating Company
     - Subsidiary of Certain Exempt Entities
     - Inactive Entity
     - Governmental Authority
     - U.S.-Formed LLC
- **Expected Result:** All 23 categories present
- **Status:** ☐ Pass ☐ Fail

**Test 15.4: Exemption Explanation Auto-Fill**
- **Steps:**
  1. Select exemption category
  2. Check explanation field
  3. Verify auto-populated text
- **Expected Result:** Appropriate explanation automatically filled based on category
- **Status:** ☐ Pass ☐ Fail

**Test 15.5: Compliance-Safe Language**
- **Steps:**
  1. Review all text in exemption section
  2. Verify no language determines eligibility
  3. Check attestation wording
- **Expected Result:** 
  - Language states "you attest" not "we determine"
  - User takes responsibility for eligibility
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 16: Wizard Step 4 - Review & Validation

**Test 16.1: Review All Client Data**
- **Steps:**
  1. Navigate to Step 4
  2. Expand each client accordion
  3. Review all data
- **Expected Result:** Complete data for all clients displayed accurately
- **Status:** ☐ Pass ☐ Fail

**Test 16.2: Edit Client from Review**
- **Steps:**
  1. Click "Edit" on a client
  2. Modify data
  3. Save
  4. Return to review
- **Expected Result:** Changes reflected in review screen
- **Status:** ☐ Pass ☐ Fail

**Test 16.3: Remove Client from Review**
- **Steps:**
  1. Click "Remove" on a client
  2. Confirm removal
  3. Verify pricing updates
- **Expected Result:** Client removed, pricing recalculated
- **Status:** ☐ Pass ☐ Fail

**Test 16.4: Validation Summary**
- **Steps:**
  1. Check validation summary card
  2. Verify counts accurate
  3. Check for any errors
- **Expected Result:** 
  - Correct count of disclosure vs exemption
  - No validation errors shown
- **Status:** ☐ Pass ☐ Fail

**Test 16.5: Disclosure Path Verification**
- **Steps:**
  1. Expand disclosure client
  2. Verify Company Applicant data shown
  3. Verify Beneficial Owner data shown
- **Expected Result:** All required disclosure data present
- **Status:** ☐ Pass ☐ Fail

**Test 16.6: Exemption Path Verification**
- **Steps:**
  1. Expand exemption client
  2. Verify exemption category shown
  3. Verify NO Company Applicant data shown
- **Expected Result:** Exemption details shown, no Company Applicant section
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 17: Wizard Step 5 - Payment

**Test 17.1: Pricing Calculation**
- **Steps:**
  1. Navigate to Step 5
  2. Verify pricing displayed
  3. Check tier applied correctly
- **Expected Result:** Correct tier pricing based on client count
- **Status:** ☐ Pass ☐ Fail

**Test 17.2: Early Bird Discount**
- **Steps:**
  1. Submit before deadline
  2. Verify 10% discount applied
  3. Check final total
- **Expected Result:** 10% discount shown, total reduced
- **Status:** ☐ Pass ☐ Fail

**Test 17.3: ACH Payment Entry**
- **Steps:**
  1. Enter account name
  2. Enter routing number (9 digits)
  3. Enter account number
  4. Confirm account number
- **Expected Result:** All fields validated correctly
- **Status:** ☐ Pass ☐ Fail

**Test 17.4: Account Number Mismatch**
- **Steps:**
  1. Enter account number
  2. Enter different number in confirmation field
  3. Try to submit
- **Expected Result:** Error message, cannot submit
- **Status:** ☐ Pass ☐ Fail

**Test 17.5: Billing Address Entry**
- **Steps:**
  1. Enter complete billing address
  2. Verify all fields required
  3. Submit
- **Expected Result:** Address saved correctly
- **Status:** ☐ Pass ☐ Fail

**Test 17.6: Checkout Agreements**
- **Steps:**
  1. Review all agreement checkboxes
  2. Try to submit without checking all
  3. Check all boxes
  4. Submit
- **Expected Result:** Cannot submit until all agreements checked
- **Status:** ☐ Pass ☐ Fail

**Test 17.7: Authorization Capture**
- **Steps:**
  1. Review authorization text
  2. Enter authorized person name
  3. Enter title
  4. Check authorization box
  5. Submit
- **Expected Result:** 
  - Authorization recorded with name, title, timestamp
  - Signature captured
- **Status:** ☐ Pass ☐ Fail

**Test 17.8: Final Submission**
- **Steps:**
  1. Complete all payment fields
  2. Click "Submit Payment"
  3. Wait for processing
  4. Verify confirmation screen
- **Expected Result:**
  - Payment authorized (not charged yet)
  - Confirmation screen shown
  - Confirmation email sent
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 18: Submission Confirmation & HighLevel Integration

**Test 18.1: Confirmation Screen Display**
- **Steps:**
  1. After successful submission
  2. View confirmation screen
  3. Check all details
- **Expected Result:**
  - Submission number displayed (SUB-YYYY-MMDDHHMMSS format)
  - Number of filings shown
  - Total amount shown
  - Next steps explained
- **Status:** ☐ Pass ☐ Fail

**Test 18.2: HighLevel Contact Update**
- **Steps:**
  1. Complete submission
  2. Check HighLevel contact record
  3. Verify all custom fields populated
- **Expected Result:**
  - All 108 custom fields updated
  - Submission number recorded
  - IP address captured
  - Submission date recorded
  - Payment amount recorded
  - Filing count recorded
- **Status:** ☐ Pass ☐ Fail
- **Critical:** This is REAL DATA from HighLevel, not mock/localStorage

**Test 18.3: HighLevel Note Creation**
- **Steps:**
  1. Check HighLevel contact
  2. View notes section
  3. Verify detailed note created
- **Expected Result:**
  - Complete note with all filing details
  - Firm information
  - All client data
  - Company Applicant data (for disclosure)
  - Beneficial Owner data (for disclosure)
  - Exemption data (for exemption)
- **Status:** ☐ Pass ☐ Fail

**Test 18.4: HighLevel Tags Added**
- **Steps:**
  1. Check HighLevel contact tags
  2. Verify automation tags added
- **Expected Result:** Tags added:
  - "Status: Bulk Filing Submitted"
  - "Filings: [count]"
  - "Filing Type: [Disclosure/Exemption/Mixed]"
  - "Priority: High Value" (if >$5k)
- **Status:** ☐ Pass ☐ Fail

**Test 18.5: IP Address Capture**
- **Steps:**
  1. Check HighLevel custom field "Bulk_IP_Address"
  2. Verify IP recorded
- **Expected Result:** Real IP address captured and stored
- **Status:** ☐ Pass ☐ Fail

**Test 18.6: Confirmation Emails Sent**
- **Steps:**
  1. Check firm email inbox
  2. Check client email inboxes
  3. Verify email contents
- **Expected Result:**
  - Firm receives confirmation with submission number
  - Each client receives confirmation at their contact email
  - All emails contain correct information
- **Status:** ☐ Pass ☐ Fail

**Test 18.7: Dashboard Update**
- **Steps:**
  1. Navigate to firm dashboard
  2. View "My Submissions" list
  3. Check latest submission
- **Expected Result:**
  - New submission appears in list
  - Status shows "Pending Review"
  - All details correct
- **Status:** ☐ Pass ☐ Fail
- **Critical:** Dashboard data from backend, not localStorage

---

### Test Suite 19: Firm Dashboard Features

**Test 19.1: View All Submissions**
- **Steps:**
  1. Login as firm
  2. Navigate to dashboard
  3. View submissions list
- **Expected Result:** All past submissions shown with status
- **Status:** ☐ Pass ☐ Fail
- **Data Source:** Pull from HighLevel, not localStorage

**Test 19.2: Filter Submissions**
- **Steps:**
  1. Filter by status
  2. Filter by date range
  3. Search by client name
- **Expected Result:** Correct filtered results
- **Status:** ☐ Pass ☐ Fail

**Test 19.3: View Submission Details**
- **Steps:**
  1. Click on submission
  2. View full details
  3. Check all client data
- **Expected Result:** Complete submission details displayed
- **Status:** ☐ Pass ☐ Fail

**Test 19.4: Download PDF Receipts**
- **Steps:**
  1. Find approved submission
  2. Click "Download PDFs"
  3. Verify files
- **Expected Result:** PDF receipt for each filing downloaded
- **Status:** ☐ Pass ☐ Fail

**Test 19.5: Track Status Updates**
- **Steps:**
  1. View pending submission
  2. Wait for admin approval
  3. Refresh dashboard
  4. Verify status updated
- **Expected Result:** Status automatically updates to "Approved"
- **Status:** ☐ Pass ☐ Fail
- **Critical:** Real-time data, not cached

---

## 👨‍💼 TEAM DASHBOARD TESTS (Processor Role)

### Test Suite 20: Processor Login & Access

**Test 20.1: Processor Login**
- **Steps:**
  1. Login with processor credentials
  2. Verify role
- **Expected Result:** Logged in with processor permissions
- **Status:** ☐ Pass ☐ Fail

**Test 20.2: Limited Access Verification**
- **Steps:**
  1. Check available features
  2. Try to access admin-only features
- **Expected Result:** 
  - Can review and process submissions
  - Cannot access pricing, account management
- **Status:** ☐ Pass ☐ Fail

**Test 20.3: Processor Dashboard Display**
- **Steps:**
  1. View processor dashboard
  2. Check queue of pending reviews
  3. Verify processing tools available
- **Expected Result:** Queue of pending submissions shown
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 21: Submission Processing

**Test 21.1: Claim Submission for Review**
- **Steps:**
  1. Select pending submission
  2. Click "Claim for Review"
  3. Verify assigned to you
- **Expected Result:** Submission assigned to your processor account
- **Status:** ☐ Pass ☐ Fail

**Test 21.2: Review Client Data**
- **Steps:**
  1. Open claimed submission
  2. Review each client
  3. Check for errors
- **Expected Result:** All client data clearly displayed for review
- **Status:** ☐ Pass ☐ Fail

**Test 21.3: Flag Issue**
- **Steps:**
  1. Find problematic client data
  2. Click "Flag Issue"
  3. Enter issue description
  4. Submit
- **Expected Result:** Issue flagged, admin notified
- **Status:** ☐ Pass ☐ Fail

**Test 21.4: Request More Information**
- **Steps:**
  1. Select submission
  2. Click "Request Info from Firm"
  3. Enter details needed
  4. Send request
- **Expected Result:** Firm receives email with info request
- **Status:** ☐ Pass ☐ Fail

**Test 21.5: Approve Submission**
- **Steps:**
  1. Complete review
  2. Click "Approve"
  3. Confirm
- **Expected Result:**
  - Status updates to "Approved"
  - Firm notified
  - Payment processed
- **Status:** ☐ Pass ☐ Fail

**Test 21.6: Reject Submission**
- **Steps:**
  1. Find invalid submission
  2. Select rejection reason
  3. Add detailed notes
  4. Click "Reject"
- **Expected Result:**
  - Status updates to "Rejected"
  - Firm notified with reason
  - Payment NOT processed
- **Status:** ☐ Pass ☐ Fail

**Test 21.7: Processor Performance Metrics**
- **Steps:**
  1. View your processor stats
  2. Check reviews completed
  3. Check average review time
- **Expected Result:** Accurate performance metrics displayed
- **Status:** ☐ Pass ☐ Fail

---

## 🔗 INTEGRATION TESTS

### Test Suite 22: HighLevel CRM Integration

**Test 22.1: Contact Creation from Landing Page**
- **Steps:**
  1. Fill out landing page form
  2. Submit
  3. Check HighLevel for new contact
- **Expected Result:** Contact created in HighLevel with all form data
- **Status:** ☐ Pass ☐ Fail
- **Critical:** Use REAL HighLevel API, not mock

**Test 22.2: Custom Fields Population**
- **Steps:**
  1. Submit bulk filing
  2. Check HighLevel contact
  3. Verify all 108 custom fields
- **Expected Result:** All custom fields populated correctly:
  - Filing Information (9 fields)
  - Company Applicants (16 fields)
  - Beneficial Owners (81 fields)
  - Exemptions (2 fields)
  - Submission Tracking (8 fields)
- **Status:** ☐ Pass ☐ Fail

**Test 22.3: Tag-Based Workflow Triggers**
- **Steps:**
  1. Submit bulk filing
  2. Check HighLevel workflows
  3. Verify workflows triggered by tags
- **Expected Result:** 
  - "Bulk Filing Submitted" workflow starts
  - Email confirmations sent
  - Tasks created for review team
- **Status:** ☐ Pass ☐ Fail

**Test 22.4: Contact Search by Email**
- **Steps:**
  1. Use admin curl test tool
  2. Search for contact by email
  3. Verify contact found
- **Expected Result:** Contact ID returned for existing email
- **Status:** ☐ Pass ☐ Fail

**Test 22.5: Bulk Data Note Creation**
- **Steps:**
  1. Submit bulk filing
  2. Check HighLevel contact notes
  3. Verify detailed note created
- **Expected Result:** 
  - Complete formatted note with all data
  - Submission number, IP, timestamp
  - All client details
- **Status:** ☐ Pass ☐ Fail

**Test 22.6: Real-time Data Sync**
- **Steps:**
  1. Update data in HighLevel manually
  2. Refresh admin dashboard
  3. Verify data updated
- **Expected Result:** Dashboard reflects HighLevel changes
- **Status:** ☐ Pass ☐ Fail
- **Critical:** Must pull from API, not cache/localStorage

---

### Test Suite 23: Email System Integration

**Test 23.1: Welcome Email**
- **Steps:**
  1. Register new firm
  2. Check email inbox
- **Expected Result:** Welcome email received within 2 minutes
- **Status:** ☐ Pass ☐ Fail

**Test 23.2: Firm Profile Complete Email**
- **Steps:**
  1. Complete firm profile
  2. Check email
- **Expected Result:** Congratulations email with next steps
- **Status:** ☐ Pass ☐ Fail

**Test 23.3: Bulk Filing Submitted Email**
- **Steps:**
  1. Submit bulk filing
  2. Check firm email
  3. Check client emails
- **Expected Result:**
  - Firm receives confirmation
  - Each client receives confirmation
- **Status:** ☐ Pass ☐ Fail

**Test 23.4: Approval Email**
- **Steps:**
  1. Admin approves submission
  2. Check firm email
- **Expected Result:** Approval email with PDF attachments
- **Status:** ☐ Pass ☐ Fail

**Test 23.5: Rejection Email**
- **Steps:**
  1. Admin rejects submission
  2. Check firm email
- **Expected Result:** Rejection email with reason and correction instructions
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 24: Payment Integration

**Test 24.1: ACH Authorization Capture**
- **Steps:**
  1. Enter ACH details
  2. Submit payment
  3. Verify authorization recorded
- **Expected Result:** 
  - Authorization captured with timestamp
  - Payment NOT charged yet
- **Status:** ☐ Pass ☐ Fail

**Test 24.2: Payment Processing After Approval**
- **Steps:**
  1. Admin approves submission
  2. Check payment status
  3. Verify charge initiated
- **Expected Result:** ACH debit initiated within 24 hours
- **Status:** ☐ Pass ☐ Fail

**Test 24.3: Payment Failure Handling**
- **Steps:**
  1. Use invalid bank account
  2. Submit
  3. Verify error handling
- **Expected Result:** 
  - Payment failure detected
  - Firm notified
  - Submission status updated
- **Status:** ☐ Pass ☐ Fail

**Test 24.4: Refund Processing**
- **Steps:**
  1. Approve refund request
  2. Process refund
  3. Verify status
- **Expected Result:** Refund processed, status updated
- **Status:** ☐ Pass ☐ Fail

---

## ⚡ PERFORMANCE TESTS

### Test Suite 25: Load & Performance

**Test 25.1: Large CSV Upload (100+ Clients)**
- **Steps:**
  1. Upload CSV with 100 clients
  2. Measure load time
  3. Verify all clients parsed
- **Expected Result:** 
  - Loads in <10 seconds
  - All clients displayed
  - No browser freeze
- **Status:** ☐ Pass ☐ Fail

**Test 25.2: Dashboard Load Time**
- **Steps:**
  1. Login
  2. Measure time to dashboard display
  3. Check all data loaded
- **Expected Result:** Dashboard loads in <3 seconds
- **Status:** ☐ Pass ☐ Fail

**Test 25.3: HighLevel API Response Time**
- **Steps:**
  1. Fetch custom fields from HighLevel
  2. Measure response time
  3. Verify data received
- **Expected Result:** Response in <5 seconds
- **Status:** ☐ Pass ☐ Fail

**Test 25.4: Concurrent Submissions**
- **Steps:**
  1. Have 5 firms submit simultaneously
  2. Verify all process correctly
  3. Check for conflicts
- **Expected Result:** All submissions processed without errors
- **Status:** ☐ Pass ☐ Fail

**Test 25.5: Admin Dashboard with 1000+ Submissions**
- **Steps:**
  1. Load admin dashboard with large dataset
  2. Measure render time
  3. Test filtering/search
- **Expected Result:** 
  - Loads in <5 seconds
  - Filtering responsive
  - No lag
- **Status:** ☐ Pass ☐ Fail

---

## 🔒 SECURITY TESTS

### Test Suite 26: Authentication & Authorization

**Test 26.1: Password Strength Enforcement**
- **Steps:**
  1. Try weak password (e.g., "password")
  2. Try medium password (e.g., "Password1")
  3. Try strong password
- **Expected Result:** Only strong password accepted
- **Status:** ☐ Pass ☐ Fail

**Test 26.2: Session Timeout**
- **Steps:**
  1. Login
  2. Wait 30 minutes idle
  3. Try to perform action
- **Expected Result:** Session expired, redirected to login
- **Status:** ☐ Pass ☐ Fail

**Test 26.3: Role-Based Access Control**
- **Steps:**
  1. Login as firm user
  2. Try to access /admin
  3. Try to access processor tools
- **Expected Result:** Access denied, redirected
- **Status:** ☐ Pass ☐ Fail

**Test 26.4: SQL Injection Prevention**
- **Steps:**
  1. Enter SQL injection strings in search fields
  2. Submit
  3. Verify no database access
- **Expected Result:** Input sanitized, no injection
- **Status:** ☐ Pass ☐ Fail

**Test 26.5: XSS Prevention**
- **Steps:**
  1. Enter `<script>alert('XSS')</script>` in form fields
  2. Submit
  3. View rendered output
- **Expected Result:** Script tags escaped, not executed
- **Status:** ☐ Pass ☐ Fail

---

### Test Suite 27: Data Security

**Test 27.1: ID Number Encryption**
- **Steps:**
  1. Submit full ID number
  2. Check database/HighLevel storage
  3. Verify encryption
- **Expected Result:** ID numbers encrypted at rest
- **Status:** ☐ Pass ☐ Fail

**Test 27.2: Payment Information Security**
- **Steps:**
  1. Enter bank account details
  2. Check stored data
  3. Verify PCI compliance
- **Expected Result:** 
  - Account numbers never stored in full
  - Only last 4 digits stored
  - Routing number stored securely
- **Status:** ☐ Pass ☐ Fail

**Test 27.3: HTTPS Enforcement**
- **Steps:**
  1. Try to access http:// URL
  2. Verify redirect to https://
- **Expected Result:** All traffic forced to HTTPS
- **Status:** ☐ Pass ☐ Fail

**Test 27.4: API Key Security**
- **Steps:**
  1. View source code
  2. Check network requests
  3. Verify HighLevel API key not exposed
- **Expected Result:** 
  - API keys in environment variables
  - Not visible in client code
- **Status:** ☐ Pass ☐ Fail

---

## 🐛 BUG REPORTING

### Bug Report Template

**Bug ID:** ______  
**Test Case:** ______  
**Severity:** ☐ Critical ☐ High ☐ Medium ☐ Low  
**Status:** ☐ Open ☐ In Progress ☐ Fixed ☐ Closed  

**Description:**
[Describe the bug]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots:**
[Attach screenshots if applicable]

**Environment:**
- Browser: 
- OS: 
- User Role: 
- Date/Time: 

**Additional Notes:**
[Any other relevant information]

---

## 📊 TEST SUMMARY REPORT

### Test Execution Summary

**Date:** ___________  
**Tester:** ___________  
**Build Version:** ___________  

| Test Suite | Total Tests | Passed | Failed | Blocked | Pass % |
|------------|-------------|--------|--------|---------|--------|
| Admin Login | | | | | |
| Submissions Review | | | | | |
| Analytics | | | | | |
| Account Management | | | | | |
| Pricing Settings | | | | | |
| Email Marketing | | | | | |
| Chargebacks | | | | | |
| Admin Tools | | | | | |
| Audit Log | | | | | |
| Firm Registration | | | | | |
| CSV Upload | | | | | |
| Manual Entry | | | | | |
| Filing Type Selection | | | | | |
| Disclosure Path | | | | | |
| Exemption Path | | | | | |
| Review & Validation | | | | | |
| Payment | | | | | |
| HighLevel Integration | | | | | |
| Firm Dashboard | | | | | |
| Processor Dashboard | | | | | |
| Integration Tests | | | | | |
| Performance Tests | | | | | |
| Security Tests | | | | | |
| **TOTAL** | | | | | |

### Critical Issues Found

1. 
2. 
3. 

### Recommendations

1. 
2. 
3. 

---

## ✅ SIGN-OFF

### Test Completion Checklist

- [ ] All test cases executed
- [ ] All critical bugs resolved
- [ ] All high priority bugs resolved
- [ ] Performance meets requirements
- [ ] Security tests passed
- [ ] HighLevel integration verified (REAL DATA, not mock)
- [ ] Data consistency across all dashboards confirmed
- [ ] No localStorage dependencies for critical data
- [ ] All workflows tested end-to-end
- [ ] Documentation updated

### Approval

**QA Lead:** ___________  
**Signature:** ___________  
**Date:** ___________  

**Product Manager:** ___________  
**Signature:** ___________  
**Date:** ___________  

**Technical Lead:** ___________  
**Signature:** ___________  
**Date:** ___________  

---

**END OF TEST CASE MANUAL**
