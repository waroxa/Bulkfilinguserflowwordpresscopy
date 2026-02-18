import { FileDown, FileText, Download, CheckCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { jsPDF } from "jspdf";

// Import markdown content directly as raw text
const userGuideContent = `# Getting Started with NYLTA Bulk Filing

**Welcome!** This guide will walk you through everything you need to know to use the NYLTA bulk filing system for your clients.

**Who is this for?** CPAs, attorneys, and compliance professionals who need to file NYLTA reports for multiple clients.

**How long will this take?** About 15-20 minutes to set up your account and complete your first test filing.

---

## What You'll Need

Before you start, make sure you have:

- Your work email address
- Your firm's basic information (name, address, phone number)
- Your firm's EIN (tax ID number)
- 15-20 minutes of time

**Important:** We recommend doing a practice run first using fake client data, just to see how everything works. Once you're comfortable, you can start filing real client reports.

---

## Step 1: Create Your Account

### How to Sign Up

1. Go to the NYLTA sign-up page
2. Fill out the form with your information:
   - Your first and last name
   - Your work email
   - Your firm's name
   - Your phone number
   - Your role (CPA, Attorney, etc.)
   - Create a password you'll remember
3. Click the **"Create Account"** button

### What Happens Next?

- You'll see a message saying your account is being reviewed
- You'll get an email confirming we received your registration
- **You can't log in yet** - your account needs to be approved first

**Why?** For security and compliance, we manually review every account before granting access to the filing system. This protects both you and your clients.

---

## Step 2: Wait for Approval

### What to Expect

- **Review time:** Usually within 1 business day
- **Approval email:** You'll receive an email when your account is approved
- **If we have questions:** We might email or call you to verify your information

### Try Logging In (You'll See This Message)

If you try to log in before approval, you'll see:
> "Your account is pending approval. You'll receive an email once approved."

**This is normal!** Just wait for the approval email.

---

## Step 3: Log In After Approval

### Once You're Approved

1. Check your email for the approval notification
2. Go to the NYLTA login page
3. Enter your email and password
4. Click **"Sign In"**

### First Time Login

When you log in for the first time, you'll see a screen asking you to complete your firm profile. **You must complete this before you can start filing.**

Why? The system needs your firm's information to properly attribute all filings to your licensed practice.

---

## Step 4: Complete Your Firm Profile

### What Information You'll Need

Have this information ready:

- **Firm Name** - Already filled in from signup
- **Your Name** - Already filled in from signup  
- **Email** - Already filled in from signup
- **Phone Number** - Already filled in from signup
- **Firm Address** - Street, City, State, ZIP
- **Firm EIN** - Your firm's tax ID number (format: 12-3456789)

### How to Fill It Out

1. Review the information that's already filled in (name, email, firm name)
2. Enter your firm's street address
3. Enter your firm's city, state, and ZIP code
4. Enter your firm's EIN (tax ID)
5. Verify everything looks correct
6. Click **"Complete Profile & Start Filing"**

### What You'll See

After completing your profile:
- A success message saying "Profile Complete!"
- Two buttons:
  - **"Start Bulk Filing Now"** - Jump straight into filing
  - **"Go to Dashboard"** - Go to your main dashboard

**Important:** Once you complete your profile, it's locked for security. If you need to change anything later, contact NYLTA support.

---

## Step 5: Understanding Your Dashboard

### What's On Your Dashboard?

After completing your profile, you'll see:

- **Start Bulk Filing button** - Begin a new filing batch
- **Past Submissions** - All your previous filings
- **Account Settings** - Update your password or preferences
- **Documentation** - Download guides and help files

Everything is now unlocked and ready to use!

---

## Step 6: Your First Filing - Using Test Data

**We strongly recommend doing a test filing first using fake client data.** This lets you see how everything works without risking real client information.

### Starting a New Filing

1. Click **"Start Bulk Filing"** from your dashboard
2. You'll see two options:
   - **Exemption Attestation** - For clients who are exempt from filing
   - **Beneficial Ownership Disclosure** - For clients who need to report owners

### Option A: Test an Exemption Filing (Quickest Way to Test)

**Use this if:** Your client qualifies for an exemption from beneficial ownership reporting.

1. Click **"Exemption Attestation"**
2. Enter a test company:
   - Company Name: Test Company LLC
   - EIN: 98-7654321
   - Select any exemption type from the dropdown
3. Follow the steps on screen
4. Review your information
5. Click **"Submit"**

**What you'll see:**
- Confirmation that your filing was submitted
- A confirmation email
- The filing will appear on your dashboard

### Option B: Test a Full Beneficial Ownership Filing

**Use this if:** Your client needs to report beneficial owners (most companies).

#### Part 1: Add Company Information

1. Click **"Beneficial Ownership Disclosure"**
2. Enter test company info:
   - Company Name: Test Corporation Inc
   - EIN: 11-2233445
   - Legal Address: 123 Main St, New York, NY 10001

#### Part 2: Add Company Applicant

**Who is this?** The person who filed the company's formation documents.

Enter test data:
- Full Name: Jane Applicant
- Date of Birth: 01/15/1980
- Address: 456 Oak Avenue, Chicago, IL 60601
- ID Type: Driver's License
- ID Number: D123456789
- ID Issuing State: IL

#### Part 3: Add Beneficial Owners

**Who is this?** Anyone who owns 25% or more of the company.

Enter test data:
- Full Name: John Owner
- Date of Birth: 03/22/1975
- Address: 789 Pine Street, Los Angeles, CA 90001
- Ownership Percentage: 51%
- ID Type: Passport
- ID Number: P987654321
- ID Issuing Country: United States

#### Part 4: Review and Submit

1. Review all the information you entered
2. Make sure everything looks correct
3. Click **"Submit Filing"**

**What you'll see:**
- Confirmation screen
- Email confirmation
- Filing appears on your dashboard

---

## Step 7: Filing for Real Clients

### Once You're Comfortable

After testing with fake data, you're ready to file for real clients!

### Best Practices

**Before you file:**
- [ ] Verify all client information is accurate
- [ ] Confirm you have all required documents
- [ ] Double-check EINs and dates of birth
- [ ] Make sure ownership percentages add up correctly

**After you file:**
- [ ] Download confirmation for your records
- [ ] Inform your client the filing was submitted
- [ ] Keep documentation in your client file

---

## Common Questions

### How do I know if my submission went through?

You'll see three confirmations:
1. A success screen after submitting
2. An email confirmation
3. The filing listed on your dashboard

### Can I edit a filing after submitting?

No. Once submitted, filings are final. If you made a mistake, contact NYLTA support immediately.

### How long does processing take?

Filings are processed immediately, but FinCEN review may take several days. You'll receive status updates via email.

### Can I add more people to my firm account?

Yes! Contact NYLTA support to add additional authorized filers from your firm.

### What if I'm not sure if my client is exempt?

The system provides exemption categories to choose from. If you're unsure, consult with your client or legal counsel. NYLTA does not provide legal advice.

### How do I upload multiple clients at once?

You can upload a CSV file with multiple clients instead of entering them one by one. Click "Upload CSV" when starting a new filing.

---

## Troubleshooting

### Problem: I can't log in

**Solutions:**
- Make sure your account has been approved (check your email)
- Verify you're using the correct email and password
- Try resetting your password
- Clear your browser cache and try again

### Problem: I don't see the "Start Filing" button

**Solutions:**
- Make sure you completed your firm profile
- Try logging out and back in
- Refresh your browser
- Contact support if the problem continues

### Problem: My submission won't go through

**Solutions:**
- Check that all required fields are filled in
- Verify EIN format is correct (XX-XXXXXXX)
- Make sure dates are valid
- Check your internet connection
- Try submitting again
- Contact support if error persists

### Problem: I didn't receive a confirmation email

**Solutions:**
- Check your spam/junk folder
- Wait 5-10 minutes (emails can be delayed)
- Check that your email address is correct in your profile
- Contact support if you still don't receive it

---

## Getting Help

### Need Assistance?

**Contact NYLTA Support:**
- Email: support@nylta.com
- Phone: [Support phone number]
- Hours: Monday-Friday, 9am-5pm EST

**When contacting support, include:**
- Your registered email address
- What you were trying to do
- Any error messages you saw
- Screenshots if possible

---

## Important Reminders

### Security
- Never share your login credentials
- Log out when finished, especially on shared computers
- Keep client information confidential

### Accuracy
- Always verify client information before submitting
- Double-check EINs, dates, and ownership percentages
- Keep copies of all submitted filings

### Compliance
- Ensure you have authority to file on behalf of clients
- Maintain proper documentation
- Stay informed about filing deadlines

---

## Quick Reference Checklist

### First Time Setup
- [ ] Create account
- [ ] Wait for approval email
- [ ] Log in after approval
- [ ] Complete firm profile
- [ ] Do a test filing with fake data
- [ ] Review test filing on dashboard
- [ ] Ready to file for real clients!

### For Each Client Filing
- [ ] Gather all client information
- [ ] Log in to NYLTA
- [ ] Click "Start Bulk Filing"
- [ ] Choose exemption or disclosure
- [ ] Enter client information
- [ ] Review for accuracy
- [ ] Submit filing
- [ ] Save confirmation
- [ ] Notify client

---

## Tips for Success

### Save Time
- Prepare client information in advance
- Use CSV upload for multiple clients
- Keep a template with required fields
- Set aside dedicated time for filing

### Avoid Mistakes
- Don't rush through forms
- Review everything before submitting
- Keep client documents handy for reference
- When in doubt, ask support

### Stay Organized
- Download confirmations immediately
- Keep a filing log
- Track deadlines in your calendar
- Maintain client documentation

---

**You're Ready to Go!**

Congratulations! You now know everything you need to use the NYLTA bulk filing system. 

**Next Steps:**
1. Log in to your account
2. Do a practice filing with test data
3. Once comfortable, start filing for real clients

**Questions?** Contact NYLTA support anytime. We're here to help!

---

*Last Updated: January 2026*
*NYLTA.com - Professional Bulk Filing System*
`;

const completeUserManual = `# NYLTA Bulk Filing - Complete User Manual

**For CPAs, Attorneys, and Compliance Professionals**

---

## Welcome to NYLTA Bulk Filing

This manual will teach you everything you need to know about filing NYLTA reports for multiple clients at once.

### What You Can Do With This System

- File reports for 5, 10, 50, or even 100+ clients in one submission
- Save money with volume discounts (the more you file, the less each one costs)
- Get early bird discounts when you file before the deadline
- Track all your filings in one dashboard
- Download PDF receipts for every filing

### Who This Is For

✅ Accounting firms with multiple business clients  
✅ Law firms handling corporate compliance  
✅ Compliance professionals managing portfolios  
✅ Corporate service providers  

---

## Getting Started: Your First Steps

### Step 1: Create Your Account

1. Go to nylta.com/bulk-filing
2. Click "Get Started" or "Sign Up"
3. Fill out the form with:
   - Your name
   - Your firm's name
   - Your work email
   - Your phone number
   - Your firm's EIN (tax ID)
   - Your firm's complete address

**Important:** You must fill out everything completely. You can't file until your profile is 100% complete.

### Step 2: Check Your Email

After signing up, check your email. You'll get a link to verify your email address. Click it!

### Step 3: Log In

Go back to nylta.com and log in with your email and password.

---

## Understanding the Two Filing Types

Every client you file for will use one of two paths. It's important to understand which path to use!

### Path 1: Beneficial Ownership Disclosure

**When to use this:**
- Your client has owners with 25% or more ownership
- Your client has people with major control over the business
- Your client is a regular operating LLC

**What you'll need:**
- **Company Applicant:** The person who originally filed the LLC paperwork
  - Full name
  - Date of birth
  - Complete address
  - ID information (driver's license or passport)
  
- **Beneficial Owners:** Anyone who owns 25%+ or has major control
  - Full name
  - Date of birth
  - Complete address  
  - Ownership percentage
  - ID information

**Example:** A family-owned restaurant LLC with 3 partners who each own 33%.

---

### Path 2: Exemption Attestation

**When to use this:**
- Your client qualifies for a legal exemption
- Your client is a large company
- Your client is a bank or financial institution
- Your client is inactive

**What you'll need:**
- Select the correct exemption category from the list
- Optionally include Company Applicant info (not required for exemptions)

**Available exemption categories:**
- Bank or credit union
- Insurance company
- Investment company or adviser
- Accounting firm
- Public utility
- Large operating company (20+ employees and $5M+ revenue)
- Tax-exempt entity (501c3, etc.)
- Inactive entity
- And more (see full list in the system)

**Important:** YOU decide if your client qualifies for an exemption. The system just records your decision. If you're not sure, consult legal counsel or choose the Beneficial Ownership Disclosure path.

**Example:** A registered accounting firm with over 20 employees filing under "Large Operating Company" exemption.

---

## How to File: Step-by-Step

### The 5-Step Wizard

The system uses a simple 5-step process:

**Step 1: Upload Clients**  
Add your clients using a CSV file or by filling out forms manually

**Step 2: Choose Filing Type**  
For each client, choose "Disclosure" or "Exemption"

**Step 3: Enter Required Information**  
The system shows you exactly what fields you need based on your choice

**Step 4: Review Everything**  
Double-check all your information before submitting

**Step 5: Pay and Submit**  
Enter payment information and submit all filings at once

---

## Option A: Using the CSV Template (Recommended)

**Best for:** 5 or more clients

### How to Use the CSV Template

1. **Download the Template**
   - In Step 1, click "Download CSV Template (With Examples)"
   - Open it in Excel or Google Sheets
   
2. **Look at the Examples**
   - The template comes with sample data
   - Look at it to understand the format
   
3. **Delete the Examples**
   - Delete the example rows
   - Keep the header row!
   
4. **Add Your Client Data**
   - Fill in one row per client
   - See the guide below for what goes in each column

5. **Save as CSV**
   - File → Save As → CSV (Comma delimited)
   - NOT .xlsx or .xls!
   
6. **Upload**
   - Back in the wizard, upload your CSV file
   - The system will check it for errors

### Understanding the CSV Columns

The CSV has 57 columns organized into sections:

**Columns A-H: Basic Company Info (ALWAYS REQUIRED)**
- LLC Legal Name
- NY DOS ID Number (7 digits)
- Federal EIN (12-3456789 format)
- Formation Date (YYYY-MM-DD format)
- Country of Formation
- State of Formation
- Contact Email
- Filing Type ("disclosure" or "exemption")

**Columns I-J: Exemption Info (ONLY for exemption filings)**
- Exemption Category
- Exemption Explanation (auto-fills)

**Columns K-R: Company Applicant 1 (REQUIRED for disclosure)**
- Full name, birth date, address, ID info

**Columns S-Z: Company Applicant 2 (Optional)**

**Columns AA-AH: Beneficial Owner 1 (REQUIRED for disclosure)**
- Full name, birth date, address, ownership %, ID info

**Columns AI-AP: Beneficial Owner 2 (Optional)**

**Columns AQ-AX: Beneficial Owner 3 (Optional)**

**Columns AY-BF: Beneficial Owner 4 (Optional)**

### Common CSV Mistakes to Avoid

❌ **Wrong:** Saving as .xlsx  
✅ **Right:** Save as .csv

❌ **Wrong:** Filing type = "Exempt"  
✅ **Right:** Filing type = "exemption"

❌ **Wrong:** Date = 1/15/2024  
✅ **Right:** Date = 2024-01-15

❌ **Wrong:** Ownership = 50%  
✅ **Right:** Ownership = 50

❌ **Wrong:** Extra spaces around data  
✅ **Right:** Clean data with no spaces

---

## Option B: Manual Form Entry

**Best for:** 1-3 clients

### How to Enter Clients Manually

1. In Step 1, click "Or Enter Clients Manually Using Form"
2. Fill out the form for your first client
3. Click "Add Client"  
4. The client appears in your list
5. Repeat for each additional client
6. Click "Continue to Next Step"

### What Each Field Means

**LLC Legal Name:** The exact name registered with New York  
**NY DOS ID:** 7-digit number from the Department of State  
**Federal EIN:** Tax ID number (XX-XXXXXXX format)  
**Formation Date:** When the LLC was created  
**Country:** Usually "United States"  
**State:** Usually "New York" for NYLLCs  
**Contact Email:** Where to send confirmation

---

## Pricing: How Much Does It Cost?

### Volume-Based Pricing

The more clients you file at once, the less each one costs:

| How Many Clients | Price Per Client | Example Total |
|-----------------|------------------|---------------|
| 1-10 clients    | $90.00 each     | 10 clients = $900 |
| 11-25 clients   | $85.00 each     | 25 clients = $2,125 |
| 26-50 clients   | $80.00 each     | 50 clients = $4,000 |
| 51-100 clients  | $75.00 each     | 100 clients = $7,500 |
| 101+ clients    | $70.00 each     | 150 clients = $10,500 |

**The system automatically gives you the best price!**

### Early Bird Discount

File before the deadline and save an extra 10%!

**Example:**
- 50 clients × $80 = $4,000
- Early bird 10% off = -$400
- **You pay: $3,600** (save $400!)

### How Payment Works

**We use ACH bank transfer (free - no processing fees)**

1. You enter your bank account and routing number
2. We verify it's valid
3. We authorize the payment (don't charge yet)
4. We review your submission (1-2 days)
5. If approved, we charge your account
6. If rejected, we void the authorization (no charge)

**Your money is safe:** We don't charge until your filings are reviewed and approved!

---

## After You Submit: What Happens Next

### Immediately After Submitting

✅ You see a confirmation screen with a submission number  
✅ You get a confirmation email  
✅ Each client gets an email at their contact address  
✅ Your dashboard shows "Pending Review"  

### Within 1-2 Business Days

✅ Our team reviews all your data  
✅ We check everything matches NYLTA requirements  
✅ Status updates to "Processing"  

### If Everything Looks Good

✅ Payment processes from your bank account  
✅ Filings are submitted to New York authorities  
✅ You receive:
   - Individual PDF receipt for each filing
   - Summary report of all filings
   - Tracking numbers
✅ Dashboard updates to "Approved"

### If We Find Problems

⚠️ Status updates to "Needs Attention"  
⚠️ You get a detailed email about what needs fixing  
⚠️ You can edit and resubmit  
⚠️ No payment is processed  

---

## Your Dashboard: Tracking Filings

After submitting, you can:

- View all your past submissions
- See the current status of pending submissions  
- Download PDF receipts anytime
- Export filing data for your records
- Filter by date, status, or client name

---

## Common Questions

### About the Process

**Q: How many clients can I file at once?**  
A: No limit! We've processed submissions with 500+ clients. More clients = lower price per filing.

**Q: Can I mix disclosure and exemption filings together?**  
A: Yes! In the same submission, some clients can be disclosure and others exemption.

**Q: Can I save my progress and come back later?**  
A: Yes! Your data is saved automatically. You can close your browser and return anytime.

**Q: What if I make a mistake in my CSV?**  
A: The system checks your CSV and shows you exactly which errors to fix. Fix them and re-upload.

### About Exemptions

**Q: Who decides if my client qualifies for an exemption?**  
A: You do. You're the professional making that determination. The system just records your attestation.

**Q: Is Company Applicant required for exemption filings?**  
A: No, it's optional for exemptions. Required for disclosure filings only.

**Q: What if my client's exemption category isn't listed?**  
A: Contact support@nylta.com. We update categories based on federal guidance.

### About Beneficial Owners

**Q: What if my client has more than 4 beneficial owners?**  
A: Contact support@nylta.com. We can handle additional owners.

**Q: What counts as "substantial control"?**  
A: Senior officers, key decision-makers, people with authority over important company decisions. See federal BOI regulations for details.

### About Payment

**Q: When will I be charged?**  
A: Payment is authorized when you submit, but not charged until your filings are reviewed and approved (1-2 business days).

**Q: Can I cancel after submitting?**  
A: Contact us immediately. If we haven't started processing, we can cancel and void the authorization.

**Q: What if my filings are rejected?**  
A: No payment is processed. You can fix the errors and resubmit.

**Q: Do you offer payment plans for large submissions?**  
A: For orders over $10,000, contact us about NET-30 payment terms.

---

## Troubleshooting

### CSV Upload Problems

**"Invalid file format"**  
→ Make sure you saved as .csv, not .xlsx  
→ In Excel: File → Save As → CSV (Comma delimited)

**"Missing required fields"**  
→ Check that every row has data in columns A-H  
→ For disclosure filings, check columns K-R and AA-AH

**"Invalid date format"**  
→ Use YYYY-MM-DD format (example: 2024-01-15)  
→ Format cells as Text in Excel before entering dates

**"Invalid filing type"**  
→ Column H must say exactly "disclosure" or "exemption" (lowercase)

### Validation Errors

**"Exemption category required"**  
→ For exemption filings, column I needs a valid category

**"Company Applicant 1 required"**  
→ For disclosure filings, fill out columns K-R completely

**"Beneficial Owner 1 required"**  
→ For disclosure filings, fill out columns AA-AH completely

**"Invalid ownership percentage"**  
→ Enter as a number 0-100 without the % symbol

### Payment Problems

**"Invalid routing number"**  
→ Check your 9-digit routing number with your bank

**"Account numbers don't match"**  
→ Carefully re-type both account number fields

**"Payment authorization failed"**  
→ Check with your bank that ACH debits are allowed on your account

### Login Problems

**"Firm profile incomplete"**  
→ Go to Settings → Firm Profile and fill out all required fields

**"Forgot password"**  
→ Click "Forgot Password" on login screen and check your email

**"Account locked"**  
→ Wait 30 minutes after multiple failed attempts, or contact support

---

## Getting Help

### Contact NYLTA Support

📧 **Email:** support@nylta.com  
Response time: Within 4 business hours

📞 **Phone:** (555) 123-4567  
Monday-Friday, 9am-6pm EST

💬 **Live Chat:** Available on nylta.com  
Monday-Friday, 9am-6pm EST

### When You Contact Us, Include:

- Your firm name and email
- Submission number (if applicable)
- What you were trying to do
- Any error messages
- Screenshots if possible

---

## Best Practices for Success

### Before You Start Filing

- [ ] Complete your firm profile 100%
- [ ] Gather all client data first
- [ ] Decide which filing type for each client
- [ ] Download and review the CSV template
- [ ] Have your bank account info ready

### For Efficient Filing

1. **Use the CSV template** for 5+ clients
2. **File early** to get the early bird discount
3. **Double-check data** - most delays are from errors
4. **Save your template** to reuse for future filings
5. **Track deadlines** with calendar reminders

### For Accurate Data

1. **Verify LLC names** match NY DOS exactly
2. **Confirm DOS IDs** (7 digits)
3. **Validate EINs** (XX-XXXXXXX format)
4. **Check ownership %** adds up to ~100%
5. **Use current addresses** for all people

---

## Important Dates

**2025 Annual Filing Deadline:** [Insert Date]  
**Early Bird Discount Deadline:** [Insert Date]  
**Late Filing Penalty Starts:** [Insert Date]  

**Tip:** Submit at least 5 business days before the deadline to allow time for any corrections.

---

## Privacy and Security

### How We Protect Your Data

- All data encrypted with bank-level security (256-bit SSL)
- ID numbers fully protected and encrypted
- Regular security audits
- Compliance with federal data protection laws

### What We Do With Your Data

✅ Process your NYLTA filings  
✅ Generate receipts  
✅ Maintain records as required by law  
✅ Provide customer support  

❌ Never sell your data  
❌ Never share with third parties  
❌ Never use for marketing without permission  

---

## Field Definitions Reference

### Company Fields

**LLC Legal Name:** Exact legal name per NY Department of State  
**NY DOS ID:** 7-digit ID from NY DOS  
**Federal EIN:** Tax ID in XX-XXXXXXX format  
**Formation Date:** Date LLC was formed (YYYY-MM-DD)  
**Country of Formation:** Where entity was formed  
**State/Province:** State where entity was formed  
**Contact Email:** Primary contact for this LLC  

### Person Fields

**Full Name:** Complete legal name (First Middle Last)  
**Date of Birth:** YYYY-MM-DD format  
**Address:** Complete street address, city, state, ZIP, country  
**ID Type:** Driver's License, Passport, State/Tribal ID  
**ID Number:** Full ID number (securely encrypted)  
**Issuing Country:** Country that issued the ID  
**Issuing State:** State that issued ID (if applicable)  
**Ownership Percentage:** Number without % sign (example: 50)  

---

## Quick Start Checklist

### First Time Setup
- [ ] Create account and verify email
- [ ] Complete firm profile (required!)
- [ ] Gather client data
- [ ] Determine filing type for each client
- [ ] Download CSV template
- [ ] Review pricing and early bird deadline
- [ ] Have bank info ready
- [ ] Set aside 30-60 minutes

### For Each Submission
- [ ] Prepare your data (CSV or manual)
- [ ] Log in to NYLTA
- [ ] Start bulk filing wizard
- [ ] Upload/enter client data
- [ ] Choose filing types
- [ ] Enter required information
- [ ] Review everything carefully
- [ ] Submit and pay
- [ ] Download confirmations

---

## You're Ready to Start!

This manual has given you everything you need to successfully file bulk NYLTA reports.

**Remember:**
✅ Complete your firm profile first  
✅ Use CSV template for 5+ clients  
✅ File early for discount  
✅ Contact support anytime  

**Ready to save time and money?**  
Log in to nylta.com and start filing!

---

**Questions? We're here to help!**

📧 support@nylta.com  
📞 (555) 123-4567  
💬 Chat at nylta.com

*Version 1.0 | Last Updated: January 2026*
`;

/**
 * Standalone Documentation Download Page
 * 
 * Access this page to download all NYLTA documentation files as PDFs
 * Navigate to this page or add a link in your admin dashboard
 */
export default function DocumentationDownloadPage({ onBack }: { onBack?: () => void }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  // Client-facing documentation only
  const docFiles = [
    { 
      name: 'Quick Start Guide',
      description: 'Fast 15-minute walkthrough - account setup, approval process, firm profile, and your first test filing',
      content: userGuideContent
    },
    { 
      name: 'Complete User Manual',
      description: 'Comprehensive guide covering everything - CSV templates, pricing, filing types, troubleshooting, and best practices',
      content: completeUserManual
    },
  ];

  // Convert markdown text content to formatted PDF
  const convertTextToPDF = (content: string, fileName: string, description: string): jsPDF => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const maxLineWidth = pageWidth - (margin * 2);
    
    let yPosition = margin;

    // Header with NYLTA branding
    pdf.setFillColor(0, 39, 78); // NYLTA Navy
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('NYLTA.com', pageWidth / 2, 20, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(fileName, pageWidth / 2, 30, { align: 'center' });
    
    yPosition = 50;

    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    const wrappedDesc = pdf.splitTextToSize(description, maxLineWidth);
    pdf.text(wrappedDesc, margin, yPosition);
    yPosition += wrappedDesc.length * 4 + 3;

    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(8);
    pdf.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, margin, yPosition);
    yPosition += 10;

    // Draw separator line
    pdf.setDrawColor(0, 39, 78);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Process content
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if we need a new page
      if (yPosition > pageHeight - margin - 15) {
        pdf.addPage();
        yPosition = margin;
      }

      // Skip horizontal rules
      if (line.trim() === '---') {
        yPosition += 5;
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;
        continue;
      }

      // Handle headers
      if (line.startsWith('# ')) {
        yPosition += 3;
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 39, 78);
        const headerText = line.substring(2);
        const wrappedHeader = pdf.splitTextToSize(headerText, maxLineWidth);
        pdf.text(wrappedHeader, margin, yPosition);
        yPosition += wrappedHeader.length * 8 + 3;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
      } else if (line.startsWith('## ')) {
        yPosition += 2;
        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 39, 78);
        const headerText = line.substring(3);
        const wrappedHeader = pdf.splitTextToSize(headerText, maxLineWidth);
        pdf.text(wrappedHeader, margin, yPosition);
        yPosition += wrappedHeader.length * 6 + 2;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
      } else if (line.startsWith('### ')) {
        yPosition += 2;
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        const headerText = line.substring(4);
        const wrappedHeader = pdf.splitTextToSize(headerText, maxLineWidth);
        pdf.text(wrappedHeader, margin, yPosition);
        yPosition += wrappedHeader.length * 5.5 + 2;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
      } else if (line.startsWith('**') && line.endsWith('**') && line.length < 100) {
        // Bold text (likely subheadings)
        pdf.setFont('helvetica', 'bold');
        const boldText = line.substring(2, line.length - 2);
        const wrappedText = pdf.splitTextToSize(boldText, maxLineWidth);
        pdf.text(wrappedText, margin, yPosition);
        yPosition += wrappedText.length * 5 + 1;
        pdf.setFont('helvetica', 'normal');
      } else if (line.trim().startsWith('- [ ]') || line.trim().startsWith('- [x]') || line.trim().startsWith('- [X]')) {
        // Checkbox items
        const isChecked = line.includes('[x]') || line.includes('[X]');
        const checkboxText = line.trim().substring(5).trim();
        const wrappedText = pdf.splitTextToSize(checkboxText, maxLineWidth - 8);
        
        // Draw checkbox
        pdf.setDrawColor(100, 100, 100);
        pdf.rect(margin, yPosition - 3, 3, 3);
        if (isChecked) {
          pdf.setFontSize(8);
          pdf.text('✓', margin + 0.5, yPosition - 0.5);
          pdf.setFontSize(10);
        }
        
        pdf.text(wrappedText, margin + 6, yPosition);
        yPosition += wrappedText.length * 5;
      } else if (line.trim().startsWith('- ✅') || line.trim().startsWith('✅')) {
        // Success checkmark items
        const bulletText = line.replace(/^-?\s*✅\s*/, '');
        const wrappedText = pdf.splitTextToSize(bulletText, maxLineWidth - 6);
        pdf.setTextColor(0, 128, 0);
        pdf.text('✓', margin, yPosition);
        pdf.setTextColor(0, 0, 0);
        pdf.text(wrappedText, margin + 5, yPosition);
        yPosition += wrappedText.length * 5;
      } else if (line.trim().startsWith('- ❌') || line.trim().startsWith('❌')) {
        // Error/wrong items
        const bulletText = line.replace(/^-?\s*❌\s*/, '');
        const wrappedText = pdf.splitTextToSize(bulletText, maxLineWidth - 6);
        pdf.setTextColor(200, 0, 0);
        pdf.text('✗', margin, yPosition);
        pdf.setTextColor(0, 0, 0);
        pdf.text(wrappedText, margin + 5, yPosition);
        yPosition += wrappedText.length * 5;
      } else if (line.trim().startsWith('- ⚠️') || line.trim().startsWith('⚠️')) {
        // Warning items
        const bulletText = line.replace(/^-?\s*⚠️\s*/, '');
        const wrappedText = pdf.splitTextToSize(bulletText, maxLineWidth - 6);
        pdf.setTextColor(200, 100, 0);
        pdf.text('!', margin + 1, yPosition);
        pdf.setTextColor(0, 0, 0);
        pdf.text(wrappedText, margin + 5, yPosition);
        yPosition += wrappedText.length * 5;
      } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        // Regular bullet points
        const bulletText = line.trim().substring(2);
        const wrappedText = pdf.splitTextToSize(bulletText, maxLineWidth - 5);
        pdf.text('•', margin, yPosition);
        pdf.text(wrappedText, margin + 5, yPosition);
        yPosition += wrappedText.length * 5;
      } else if (line.trim().match(/^\d+\.\s/)) {
        // Numbered lists
        const match = line.trim().match(/^(\d+\.)\s(.+)/);
        if (match) {
          const number = match[1];
          const text = match[2];
          const wrappedText = pdf.splitTextToSize(text, maxLineWidth - 10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(number, margin, yPosition);
          pdf.setFont('helvetica', 'normal');
          pdf.text(wrappedText, margin + 10, yPosition);
          yPosition += wrappedText.length * 5;
        }
      } else if (line.trim() === '') {
        // Empty line - add spacing
        yPosition += 4;
      } else {
        // Regular text - handle bold inline
        const parts = line.split('**');
        if (parts.length > 1) {
          // Has bold text inline
          let xOffset = margin;
          for (let j = 0; j < parts.length; j++) {
            if (parts[j]) {
              pdf.setFont('helvetica', j % 2 === 1 ? 'bold' : 'normal');
              const textWidth = pdf.getTextWidth(parts[j]);
              if (xOffset + textWidth > pageWidth - margin) {
                // Wrap to next line
                yPosition += 5;
                xOffset = margin;
              }
              pdf.text(parts[j], xOffset, yPosition);
              xOffset += textWidth;
            }
          }
          pdf.setFont('helvetica', 'normal');
          yPosition += 5;
        } else {
          // Regular text without formatting
          const wrappedText = pdf.splitTextToSize(line, maxLineWidth);
          pdf.text(wrappedText, margin, yPosition);
          yPosition += wrappedText.length * 5;
        }
      }
    }

    // Add footer with page numbers and branding
    const pageCount = pdf.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      pdf.text(
        'NYLTA.com - Bulk Filing Documentation',
        margin,
        pageHeight - 10
      );
    }

    return pdf;
  };

  const handleDownloadIndividualPDF = async (doc: typeof docFiles[0]) => {
    try {
      setDownloadingFile(doc.name);
      // Use the embedded content instead of fetching
      const pdf = convertTextToPDF(doc.content, doc.name, doc.description);
      pdf.save(`NYLTA-${doc.name.replace(/\s+/g, '-')}.pdf`);
      
      setDownloadComplete(true);
      setTimeout(() => {
        setDownloadComplete(false);
      }, 3000);
    } catch (error) {
      console.error(`❌ Error downloading ${doc.name}:`, error);
      alert(`Failed to download ${doc.name}. Please contact support.`);
    } finally {
      setDownloadingFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#00274E] rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl text-gray-900">NYLTA User Documentation</h1>
              <p className="text-sm text-gray-600">Download step-by-step guides for using the bulk filing system</p>
            </div>
          </div>

          {/* Success Message */}
          {downloadComplete && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-900 font-semibold">PDF Downloaded Successfully!</p>
            </div>
          )}

          {/* Download Progress */}
          {downloadingFile && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Generating PDF:</span> {downloadingFile}
              </p>
              <div className="mt-2 h-2 bg-blue-200 rounded overflow-hidden">
                <div className="h-full bg-blue-600 animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Documentation Files */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg text-gray-900 mb-4 font-semibold">Available User Guides</h2>
          <p className="text-sm text-gray-600 mb-6">
            Choose the guide that best fits your needs. Both are written in plain English for professionals - no technical knowledge required!
          </p>
          <div className="space-y-4">
            {docFiles.map((doc, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-6 border-2 border-[#00274E] bg-blue-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-[#00274E] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base text-gray-900 mb-2 font-bold">{doc.name}</h3>
                  <p className="text-sm text-gray-700 mb-3">{doc.description}</p>
                  {index === 0 && (
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Perfect for first-time users</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Get up and running in 15 minutes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Includes test data examples</span>
                      </li>
                    </ul>
                  )}
                  {index === 1 && (
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>CSV template instructions with examples</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Detailed pricing breakdown and discount info</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Troubleshooting guide for common issues</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Best practices for efficient filing</span>
                      </li>
                    </ul>
                  )}
                </div>
                <button
                  onClick={() => handleDownloadIndividualPDF(doc)}
                  disabled={downloadingFile === doc.name}
                  className="flex-shrink-0 px-6 py-3 text-sm bg-[#00274E] text-white hover:bg-[#003d73] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg flex items-center gap-2 font-semibold"
                  title={`Download ${doc.name} as PDF`}
                >
                  {downloadingFile === doc.name ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
          <h3 className="text-sm text-green-900 mb-2 font-semibold">📖 Written for Professionals, Not Programmers</h3>
          <p className="text-xs text-green-800 mb-3">
            These guides are specifically designed for CPAs, attorneys, and compliance professionals. Everything is explained in plain English!
          </p>
          <ul className="text-xs text-green-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span><strong>No Technical Jargon:</strong> Clear, conversational language anyone can understand</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span><strong>Step-by-Step:</strong> Easy-to-follow instructions with real examples</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span><strong>Professional Format:</strong> Beautifully formatted PDFs with NYLTA branding</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span><strong>Ready to Share:</strong> Perfect for training team members or sharing with colleagues</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
