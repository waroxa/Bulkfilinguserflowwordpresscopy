# HighLevel Tags & Workflows for NYLTA Bulk Filing

## 📋 TAGS TO CREATE IN HIGHLEVEL

### Lead Source Tags
```
- Lead Source: Landing Page
- Lead Source: Referral
- Lead Source: Partner
- Lead Source: Direct
```

### Status Tags
```
- Status: New Lead
- Status: Firm Profile Complete
- Status: Active User
- Status: Bulk Filing Submitted
- Status: Payment Complete
- Status: Pending Review
- Status: Approved
- Status: Rejected
```

### Filing Type Tags
```
- Filing Type: Disclosure
- Filing Type: Exemption
- Filing Type: Mixed
```

### Priority Tags
```
- Priority: High Value
- Priority: Early Bird
- Priority: Standard
```

### Campaign Tags
```
- Campaign: Early Bird 2025
- Campaign: Q1 Promo
- Campaign: Referral Program
```

---

## 🔄 WORKFLOWS TO CREATE

### 1️⃣ NEW LEAD WORKFLOW

**Trigger:** Contact created from landing page form

**Actions:**
1. **Add Tag:** "Status: New Lead"
2. **Wait:** 2 minutes
3. **Send Email:** Welcome email with firm profile setup instructions
   - Subject: "Welcome to NYLTA Bulk Filing - Let's Get Started"
   - Include link to firm profile page
   - Explain benefits of bulk filing
4. **Wait:** 24 hours
5. **If/Else:** Check if "Status: Firm Profile Complete" tag exists
   - **NO:** Send follow-up email reminder
   - **YES:** End workflow

---

### 2️⃣ FIRM PROFILE COMPLETED WORKFLOW

**Trigger:** Custom field updated (any firm profile field) OR Tag added "Status: Firm Profile Complete"

**Actions:**
1. **Remove Tag:** "Status: New Lead"
2. **Add Tag:** "Status: Active User"
3. **Send Email:** Congratulations email
   - Subject: "Your Firm Profile is Complete - Ready to Bulk File"
   - Include instructions on uploading CSV or using form
   - Link to bulk filing wizard
4. **Create Task:** Assign to sales team "Follow up with new active firm - [Contact Name]"
5. **Send Internal Notification:** Notify admin via Slack/Email
   - Message: "New firm activated: [Firm Name]"

---

### 3️⃣ BULK FILING SUBMITTED WORKFLOW

**Trigger:** Tag added "Status: Bulk Filing Submitted"

**Actions:**
1. **Add Tag:** "Status: Pending Review"
2. **Create Note:** "Bulk filing submission received on [Date] at [Time]"
3. **Send Email:** Submission confirmation to contact
   - Subject: "Bulk Filing Received - Submission #[Submission Number]"
   - Include:
     - Submission number
     - Number of filings
     - Total amount
     - Next steps
4. **Create Task:** Assign to review team
   - Task: "Review bulk filing submission - [Submission Number]"
   - Due: Today
   - Priority: High
5. **Send Internal Notification:** Alert review team
   - "New bulk filing awaiting review: [Firm Name] - [Number] filings - $[Amount]"

---

### 4️⃣ PAYMENT COMPLETED WORKFLOW

**Trigger:** Custom field "Bulk_Payment_Status" = "Paid"

**Actions:**
1. **Remove Tag:** "Status: Pending Review"
2. **Add Tag:** "Status: Payment Complete"
3. **Update Custom Field:** "Bulk_Submission_Status" = "Submitted"
4. **Send Email:** Payment confirmation
   - Subject: "Payment Received - Your Filings Are Being Processed"
   - Include:
     - Receipt
     - Payment details
     - Processing timeline
     - Support contact info
5. **Wait:** 2 hours
6. **Send Email:** Processing update
   - Subject: "Your Bulk Filings Are Now Processing"
   - Include estimated completion time
7. **Create Task:** Assign to processing team
   - Task: "Process bulk filing - [Submission Number]"
   - Due: Today + 1 business day

---

### 5️⃣ FILING APPROVED WORKFLOW

**Trigger:** Custom field "Bulk_Submission_Status" = "Accepted" OR Tag added "Status: Approved"

**Actions:**
1. **Remove Tag:** "Status: Payment Complete"
2. **Add Tag:** "Status: Approved"
3. **Send Email:** Approval confirmation with PDFs
   - Subject: "Bulk Filings Approved - Download Your Confirmation PDFs"
   - Attach individual PDF receipts
   - Include summary report
4. **Send SMS:** Quick notification (if phone number exists)
   - "Your NYLTA bulk filing has been approved! Check your email for confirmation PDFs."
5. **Update Custom Field:** "Bulk_Confirmation_Number" = [Generated Number]
6. **Wait:** 7 days
7. **Send Email:** Follow-up satisfaction survey
   - "How was your bulk filing experience?"

---

### 6️⃣ FILING REJECTED WORKFLOW

**Trigger:** Custom field "Bulk_Submission_Status" = "Rejected" OR Tag added "Status: Rejected"

**Actions:**
1. **Add Tag:** "Status: Rejected"
2. **Send Email:** Rejection notification
   - Subject: "Action Required - Issues with Your Bulk Filing Submission"
   - Explain rejection reasons
   - Provide instructions to correct and resubmit
   - Include support contact
3. **Create Task:** Assign to support team
   - Task: "Contact firm about rejected filing - [Firm Name]"
   - Priority: High
   - Due: Today
4. **Send Internal Notification:** Alert support team
   - "Filing rejected - requires follow-up: [Firm Name] - [Reason]"

---

### 7️⃣ EARLY BIRD DISCOUNT WORKFLOW

**Trigger:** Date is before early bird deadline AND Tag "Status: Active User" exists

**Actions:**
1. **Add Tag:** "Priority: Early Bird"
2. **Send Email:** Early bird reminder
   - Subject: "⏰ Early Bird Discount Ending Soon - Save 10%!"
   - Highlight deadline
   - Show savings calculation
   - CTA: Start bulk filing now
3. **Wait:** 3 days before deadline
4. **Send Email:** Final reminder
   - Subject: "LAST CHANCE: Early Bird Discount Expires in 3 Days"
5. **Wait:** Until deadline passes
6. **Remove Tag:** "Priority: Early Bird"

---

### 8️⃣ ABANDONED CART WORKFLOW

**Trigger:** Contact starts bulk filing wizard but doesn't submit (detected by partial data in custom fields)

**Actions:**
1. **Wait:** 2 hours
2. **Send Email:** Gentle reminder
   - Subject: "Still Working on Your Bulk Filing?"
   - Offer assistance
   - Save progress reminder
3. **Wait:** 24 hours
4. **Send Email:** Follow-up with incentive
   - Subject: "Need Help Completing Your Bulk Filing?"
   - Offer phone support
   - Include FAQ link
5. **Create Task:** Assign to support
   - Task: "Follow up with incomplete bulk filing - [Contact Name]"

---

### 9️⃣ HIGH VALUE CLIENT WORKFLOW

**Trigger:** Custom field "Bulk_Payment_Amount" > 5000

**Actions:**
1. **Add Tag:** "Priority: High Value"
2. **Create Task:** Assign to account manager
   - Task: "Personal follow-up with high-value client - [Firm Name]"
   - Priority: High
   - Due: Today
3. **Send Internal Notification:** Alert management
   - "High-value bulk filing received: [Firm Name] - $[Amount]"
4. **Wait:** 1 day after approval
5. **Send Email:** VIP thank you from founder
   - Personal message
   - Offer dedicated support
   - Invitation to referral program

---

### 🔟 REFERRAL PROGRAM WORKFLOW

**Trigger:** Tag added "Campaign: Referral Program"

**Actions:**
1. **Send Email:** Referral program details
   - Subject: "Earn Rewards - Refer Other Firms to NYLTA Bulk Filing"
   - Explain commission/discount structure
   - Provide unique referral link
2. **Wait:** 7 days
3. **Send Email:** Reminder with current referral stats
   - Show how many referred
   - Show earnings/credits
4. **If/Else:** Has made successful referral
   - **YES:** Send thank you email + reward
   - **NO:** Send tips on how to refer

---

## 🎯 AUTOMATION RULES

### Auto-Tagging Rules

**Rule 1: Detect Filing Type**
- **When:** Bulk filing submitted
- **If:** All clients have filingType = "disclosure" → Add tag "Filing Type: Disclosure"
- **If:** All clients have filingType = "exemption" → Add tag "Filing Type: Exemption"
- **If:** Mixed → Add tag "Filing Type: Mixed"

**Rule 2: Detect Payment Method**
- **When:** Payment submitted
- **If:** Payment method = "ACH" → Add tag "Payment Method: ACH"
- **If:** Payment method = "Card" → Add tag "Payment Method: Card"

**Rule 3: Detect Discount Eligibility**
- **When:** Submission date checked
- **If:** Before early bird deadline → Add tag "Priority: Early Bird"
- **Else:** Add tag "Priority: Standard"

---

## 📧 EMAIL TEMPLATES TO CREATE

### Template 1: Welcome Email
**Subject:** Welcome to NYLTA Bulk Filing - Let's Get Started  
**Use in:** New Lead Workflow

### Template 2: Firm Profile Complete
**Subject:** Your Firm Profile is Complete - Ready to Bulk File  
**Use in:** Firm Profile Completed Workflow

### Template 3: Submission Confirmation
**Subject:** Bulk Filing Received - Submission #{{Bulk_Submission_Number}}  
**Use in:** Bulk Filing Submitted Workflow

### Template 4: Payment Received
**Subject:** Payment Received - Your Filings Are Being Processed  
**Use in:** Payment Completed Workflow

### Template 5: Approval Notification
**Subject:** Bulk Filings Approved - Download Your Confirmation PDFs  
**Use in:** Filing Approved Workflow

### Template 6: Rejection Notification
**Subject:** Action Required - Issues with Your Bulk Filing Submission  
**Use in:** Filing Rejected Workflow

### Template 7: Early Bird Reminder
**Subject:** ⏰ Early Bird Discount Ending Soon - Save 10%!  
**Use in:** Early Bird Discount Workflow

### Template 8: Abandoned Cart
**Subject:** Still Working on Your Bulk Filing?  
**Use in:** Abandoned Cart Workflow

### Template 9: High Value Thank You
**Subject:** Thank You for Your High-Volume Filing  
**Use in:** High Value Client Workflow

### Template 10: Referral Invitation
**Subject:** Earn Rewards - Refer Other Firms to NYLTA Bulk Filing  
**Use in:** Referral Program Workflow

---

## 🔔 NOTIFICATIONS TO SET UP

### Slack Notifications
1. **New Lead:** #sales channel
2. **Firm Profile Complete:** #sales channel
3. **Bulk Filing Submitted:** #operations channel
4. **Payment Received:** #finance channel
5. **High Value Client:** #management channel
6. **Filing Rejected:** #support channel

### Email Notifications (Internal Team)
1. **New bulk filing submission:** operations@nylta.com
2. **Payment completed:** finance@nylta.com
3. **High value client (>$5k):** management@nylta.com
4. **Filing rejected:** support@nylta.com

---

## 📊 CUSTOM REPORTS TO CREATE

### Report 1: Bulk Filing Pipeline
- New Leads (This Month)
- Active Firms (Profile Complete)
- Pending Submissions
- Payments Received
- Approved Filings

### Report 2: Revenue Tracking
- Total Revenue (This Month)
- Average Filing Value
- Early Bird Discounts Applied
- High Value Clients

### Report 3: Processing Metrics
- Average Time to Review
- Average Time to Approval
- Rejection Rate
- Customer Satisfaction Score

---

## ✅ IMPLEMENTATION CHECKLIST

- [ ] Create all tags listed above
- [ ] Set up 10 automated workflows
- [ ] Create 10 email templates
- [ ] Configure Slack notifications
- [ ] Set up internal email notifications
- [ ] Create custom reports
- [ ] Test each workflow with sample data
- [ ] Document workflow logic for team
- [ ] Train team on HighLevel system
- [ ] Monitor and optimize based on performance

---

**This comprehensive automation system will ensure every bulk filing submission is tracked, processed efficiently, and provides an excellent customer experience!**
