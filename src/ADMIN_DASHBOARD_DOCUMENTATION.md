# NYLTA Admin Dashboard - Complete Documentation

**Version:** 2.0  
**Last Updated:** February 3, 2026  
**System Type:** Regulatory Compliance & Filing Management System

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Access & Authentication](#access--authentication)
3. [Dashboard Roles](#dashboard-roles)
4. [Super Admin Features](#super-admin-features)
5. [Data Management](#data-management)
6. [CSV Export Specifications](#csv-export-specifications)
7. [Testing Procedures](#testing-procedures)
8. [Compliance Requirements](#compliance-requirements)

---

## 🎯 Overview

The NYLTA Admin Dashboard is a comprehensive management system for overseeing bulk NYLTA (New York Limited Liability Transparency Act) filings. It provides real-time monitoring, data export, user management, and analytics for all submissions.

### Key Capabilities
- **Real-time submission tracking** from RewardLion CRM
- **Multi-role access control** (Super Admin, Processor/Filer, Manager)
- **Comprehensive data export** (CSV, PDF, statistical reports)
- **Account management** (approve, reject, freeze accounts)
- **Audit logging** (complete activity tracking)
- **Email marketing integration** via RewardLion
- **Payment tracking** with chargeback management
- **Pricing configuration** with tiered volume discounts

---

## 🔐 Access & Authentication

### Login Requirements
1. Navigate to NYLTA.com
2. Click "Admin Login"
3. Enter admin credentials
4. Select role from Role Selector screen

### Role Selector
After authentication, users select their operational role:
- **Super Admin**: Full system access
- **Processor/Filer**: Processing and filing operations only
- **Manager**: Payment and chargeback management only

---

## 👥 Dashboard Roles

### 1. Super Admin
**Access Level:** Complete system control

**Capabilities:**
- View all submissions and accounts
- Approve/reject/freeze user accounts
- Export all data (CSV, PDF)
- Configure pricing tiers
- View audit logs
- Access admin tools
- Email marketing integration
- Statistical reporting

**Dashboard Sections:**
- Overview (KPIs and metrics)
- Submissions Management
- Account Management
- Email Marketing
- Pricing Settings
- Audit Logs
- Admin Tools

---

### 2. Processor/Filer
**Access Level:** Limited to processing operations

**Capabilities:**
- View assigned submissions
- Update submission statuses
- Download client data
- Mark filings as complete
- Generate processing reports

**Restrictions:**
- Cannot access account management
- Cannot modify pricing
- Cannot freeze accounts
- Cannot access audit logs

---

### 3. Manager
**Access Level:** Payment and financial oversight

**Capabilities:**
- View payment records
- Track chargebacks
- Export financial reports
- Monitor revenue metrics
- Filter by payment status

**Restrictions:**
- Cannot access submissions
- Cannot manage accounts
- Cannot modify system settings

---

## 📊 Super Admin Features

### Overview Tab

#### Key Performance Indicators (KPIs)
1. **Total Revenue**
   - Calculation: Sum of all paid submissions
   - Display: Formatted as currency ($X,XXX)
   - Growth indicator vs. last month

2. **Total Submissions**
   - Count: All submissions regardless of status
   - Breakdown: Paid vs Abandoned vs Processing

3. **Active Firms**
   - Count: Unique firms with paid submissions
   - Excludes abandoned/rejected accounts

4. **Conversion Rate**
   - Formula: (Paid Submissions / Total Submissions) × 100
   - Industry benchmark comparison

#### Real-Time Charts
1. **Monthly Revenue Trend** (Last 6 months)
   - Area chart showing revenue progression
   - Submission count overlay

2. **Status Distribution** (Pie Chart)
   - Paid (Navy #00274E)
   - Pending Review (Yellow #FFD700)
   - Processing (Gray)
   - Abandoned (Light Gray)

3. **Client Volume Distribution** (Bar Chart)
   - 1-5 clients
   - 6-10 clients
   - 11-15 clients
   - 16-20 clients
   - 20+ clients

4. **Revenue by Pricing Tier**
   - Tier 1 (1-25 clients)
   - Tier 2 (26-75 clients)
   - Tier 3 (76-150 clients)
   - Tier 4 (151+ clients)

5. **Service Type Breakdown**
   - Monitoring clients ($249 each)
   - Filing clients (variable pricing)
   - Revenue split

---

### Submissions Tab

#### Submission Table Columns
| Column | Description | Data Source |
|--------|-------------|-------------|
| Firm Name | Legal business name | RewardLion CRM |
| EIN | Federal Employer ID | User input |
| Confirmation # | Unique submission ID | Auto-generated |
| Date | Submission timestamp | System timestamp |
| Clients | Number of LLCs filed | User data |
| Amount | Total payment | Calculated |
| Status | Payment/filing status | RewardLion |
| Actions | View/Download buttons | Interactive |

#### Submission Statuses
1. **Paid** (Navy badge ✓)
   - Payment completed
   - Ready for processing
   
2. **Processing** (Gray badge)
   - Currently being filed
   - In active workflow

3. **Abandoned** (Dark Gray badge)
   - User exited before payment
   - Tracked for remarketing

4. **Pending Review** (Yellow badge)
   - Requires admin approval
   - Flagged for verification

5. **Rejected** (Red badge)
   - Failed compliance check
   - User notified

#### Filtering Options
- **Search**: Firm name, EIN, or confirmation number
- **Status Filter**: All, Paid, Processing, Abandoned, Abandoned 30+ days
- **Service Filter**: All, Monitoring, Filing
- **Date Range**: Custom date selection

#### Export Options
1. **CSV Export**: All submissions with complete data
2. **PDF Report**: Statistical summary and details
3. **Individual PDFs**: Per-submission detailed reports

---

### Account Management Tab

#### Account Table
Displays all registered user accounts with:
- User ID
- Firm Name
- Contact Name
- Email
- Phone
- Role
- Status (Pending/Approved/Rejected/Frozen)
- Registration Date
- Actions

#### Account Actions
1. **Approve Account**
   - Grants system access
   - Sends welcome email
   - Enables bulk filing

2. **Reject Account**
   - Denies access
   - Sends rejection notification
   - Requires reason

3. **Freeze Account**
   - Suspends access temporarily
   - User cannot submit new filings
   - Existing submissions preserved

4. **View Details**
   - Complete account information
   - Submission history
   - Payment records

#### Pending Accounts
Separate section for accounts awaiting approval:
- Highlighted in yellow
- Quick approve/reject buttons
- Review submission count

---

### Email Marketing Tab

#### Integration with RewardLion
Direct link to RewardLion email marketing dashboard:
- Campaign statistics
- Email open rates
- Click-through rates
- Subscriber management

**Access:** Opens in new tab to RewardLion platform

---

### Pricing Settings Tab

#### Tiered Pricing Configuration

**CRITICAL RULE:** Volume discounts ONLY apply to **FOREIGN** filing entities.

##### Tier 1: Standard Rate (1-25 clients)
- Applies to: 1-25 foreign filing entities
- Domestic entities: Always Tier 1
- Monitoring service: Flat $249 (no discount)
- Adjustable: Min/Max range, price per filing

##### Tier 2: Managed Volume (26-75 clients)
- Applies to: 26-75 foreign filing entities ONLY
- Default: $389 per filing
- Reduced rate for established firms

##### Tier 3: Preferred Portfolio (76-150 clients)
- Applies to: 76-150 foreign filing entities ONLY
- Default: $375 per filing
- Highest volume discount

##### Tier 4: Enterprise (151+ clients)
- Custom pricing
- Contact for enterprise rates

##### Service Types
1. **Compliance Monitoring** ($249 flat)
   - Data storage and readiness
   - No NYDOS submission
   - Can upgrade to filing later

2. **Bulk Filing** (Variable pricing)
   - Complete NYDOS submission
   - Foreign entities: Volume discounts
   - Domestic entities: Standard rate

##### Upgrade Path
- Monitoring → Filing: Pay only $149 difference
- Zero double-charging enforced at database level
- Monitoring payment fully credited

---

### Audit Logs Tab

#### Log Categories
1. **User Actions**
   - Login/logout
   - Account creation
   - Profile updates

2. **Submission Events**
   - Filing submitted
   - Status changes
   - Payment completed

3. **Admin Actions**
   - Account approval/rejection
   - Account freezing
   - Pricing changes
   - Data exports

4. **System Events**
   - Error logs
   - Integration failures
   - Database operations

#### Log Details
Each log entry contains:
- Timestamp (ISO 8601 format)
- User ID
- Action type
- IP address
- Details/payload
- Status (success/failure)

#### Search & Filter
- Date range selection
- User filter
- Action type filter
- Keyword search

---

### Admin Tools Tab

#### Available Tools

##### 1. CSV ↔ Form Validator
**Purpose:** Ensure CSV template matches wizard form fields

**Use Case:** After adding new fields to the wizard

**How to Use:**
1. Navigate to Admin Tools
2. Select "CSV ↔ Form Validator"
3. Click "Run Validation Test"
4. Review results:
   - ✅ Matching fields (CSV and form aligned)
   - ⚠️ CSV Only (field in template but not in form)
   - ⚠️ Form Only (field in form but not in template)
5. Fix discrepancies
6. Re-run test to verify

**Expected Outcome:** All fields should match (100% green)

##### 2. HighLevel Custom Fields Viewer
**Purpose:** View and export all custom fields from RewardLion CRM

**Use Case:** Verify field mappings and data structure

**How to Use:**
1. Select "HighLevel Custom Fields"
2. View all custom field definitions
3. Export as JSON or CSV
4. Verify field names match system expectations

##### 3. Admin Curl Test Tool
**Purpose:** Test API endpoints using cURL commands

**Use Case:** Debug integration issues

**How to Use:**
1. Select "Admin Curl Test Tool"
2. Enter API endpoint
3. Configure headers and payload
4. Execute request
5. View response

---

## 📂 Data Management

### Client Data Structure

#### Core Fields (All Clients)
```typescript
{
  id: string;                    // Auto-generated unique ID
  llcName: string;              // Legal LLC name (REQUIRED)
  fictitiousName?: string;      // DBA name used in NY (OPTIONAL)
  nydosId: string;              // NY DOS ID (REQUIRED)
  ein: string;                  // Federal EIN (REQUIRED)
  formationDate: string;        // YYYY-MM-DD (REQUIRED)
  contactEmail: string;         // (REQUIRED)
  
  // Entity Classification (AUTO-DETECTED)
  countryOfFormation: string;   // "United States" or other
  stateOfFormation?: string;    // If USA, state abbreviation
  entityType: "domestic" | "foreign";  // Auto-set based on country
  dateAuthorityFiledNY?: string; // Foreign entities only
  
  // Service Selection
  serviceType: "monitoring" | "filing"; // Per-client choice
  
  // Filing Path
  filingType: "disclosure" | "exemption"; // Per-client decision
}
```

#### Disclosure Path Fields (filingType = "disclosure")
```typescript
{
  // Company Applicant(s)
  companyApplicants?: Array<{
    id: string;
    fullName: string;
    dob: string;              // YYYY-MM-DD
    address: string;
    idType: string;           // "U.S. Passport", "State ID", etc.
    idNumber: string;
    idLast4: string;          // Last 4 digits only
    issuingCountry: string;
    issuingState?: string;
    role: string;             // "Attorney", "Accountant", etc.
  }>;
  
  // Beneficial Owners (at least 1 required)
  beneficialOwners?: Array<{
    id: string;
    fullName: string;
    dob: string;
    address: string;
    ownershipPercentage: number;
    idType: string;
    idNumber: string;
    idLast4: string;
    issuingCountry: string;
    issuingState?: string;
    role: string;             // "Owner", "Member", etc.
  }>;
}
```

#### Exemption Path Fields (filingType = "exemption")
```typescript
{
  exemptionCategory: string;      // REQUIRED
  exemptionExplanation: string;   // REQUIRED (user-provided)
  
  // Optional Company Applicant
  companyApplicants?: Array<CompanyApplicant>;
}
```

#### Company Address Fields (Optional)
```typescript
{
  streetAddress?: string;
  city?: string;
  addressState?: string;
  addressCountry?: string;
  addressZipCode?: string;
}
```

---

## 📊 CSV Export Specifications

### CSV Export Requirements

**REGULATORY COMPLIANCE MANDATE:**
All CSV exports MUST include EVERY field captured in the wizard. No data may be omitted.

### Current CSV Export Locations

#### 1. Step4ReviewSummary.tsx - Remaining Clients CSV
**File:** `remaining-clients.csv`  
**Trigger:** User downloads clients NOT selected for payment

**Current Fields (9 fields - INCOMPLETE):**
```csv
LLC Name, Fictitious Name (DBA), NYDOS ID, EIN, Formation Date, 
Contact Email, Filing Type, Exemption Category, Exemption Explanation
```

**❌ MISSING CRITICAL FIELDS:**
- Service Type (monitoring/filing)
- Country of Formation
- State of Formation
- Entity Type (domestic/foreign)
- Date Authority Filed NY (foreign)
- Company Address (street, city, state, zip)
- Company Applicant data
- Beneficial Owner data

---

#### 2. Step6Confirmation.tsx - Filing Summary CSV
**File:** `NYLTA-Filing-Summary-{timestamp}.csv`  
**Trigger:** User downloads completed filing summary

**Current Fields (28 fields - INCOMPLETE):**
```csv
LLC Name, Fictitious Name (DBA), NYDOS ID, EIN, Formation Date, 
Contact Email, Filing Status, Exemption Type, Exemption Explanation,
Beneficial Owner 1 - Full Name, BO1 - DOB, BO1 - Address, 
BO1 - ID Type, BO1 - ID Last 4,
[... 3 more beneficial owners ...]
Fee, Date Filed, Confirmation Number
```

**❌ MISSING CRITICAL FIELDS:**
- Service Type
- Country of Formation
- State of Formation
- Entity Type
- Date Authority Filed NY
- Company Address fields
- Company Applicant data (completely missing!)
- Beneficial Owner ID Numbers (only showing Last 4)
- Beneficial Owner Issuing Country/State
- Beneficial Owner Ownership %
- Beneficial Owner Role

---

#### 3. AdminDashboard.tsx - Submission Export CSV
**File:** `nylta_submissions_{date}.csv`  
**Trigger:** Admin clicks "Export CSV" on Submissions tab

**Current Fields (12 fields - INCOMPLETE):**
```csv
Firm Name, EIN, Confirmation Number, Submitted Date, Client Count,
Total Amount, Status, Payment Method, Contact Name, Contact Email,
Contact Phone, IP Address, Last Activity
```

**❌ MISSING:** Individual client-level data (all fields)

---

### ✅ REQUIRED COMPLETE CSV STRUCTURE

All CSV exports in the wizard MUST include these fields:

#### Section A: Company Core Information (11 fields)
```csv
1.  LLC Legal Name
2.  Fictitious Name (DBA)
3.  NY DOS ID
4.  EIN (12-3456789)
5.  Formation Date (YYYY-MM-DD)
6.  Country of Formation
7.  State (if USA)
8.  Entity Type (domestic/foreign)
9.  Date Authority Filed NY (if Foreign)
10. Contact Email
11. Service Type (monitoring/filing)
```

#### Section B: Company Address (5 fields)
```csv
12. Company Street Address
13. Company City
14. Company State
15. Company Country
16. Company Zip Code
```

#### Section C: Filing Decision (1 field)
```csv
17. Filing Type (disclosure/exemption)
```

#### Section D: Exemption Data (2 fields - if exemption)
```csv
18. Exemption Category
19. Exemption Explanation
```

#### Section E: Company Applicant 1 (9 fields)
```csv
20. CA1 - Full Name
21. CA1 - DOB (YYYY-MM-DD)
22. CA1 - Address
23. CA1 - ID Type
24. CA1 - ID Number
25. CA1 - ID Last 4
26. CA1 - Issuing Country
27. CA1 - Issuing State
28. CA1 - Role
```

#### Section F: Company Applicant 2 (9 fields)
```csv
29. CA2 - Full Name
30. CA2 - DOB (YYYY-MM-DD)
31. CA2 - Address
32. CA2 - ID Type
33. CA2 - ID Number
34. CA2 - ID Last 4
35. CA2 - Issuing Country
36. CA2 - Issuing State
37. CA2 - Role
```

#### Section G: Beneficial Owner 1 (10 fields)
```csv
38. BO1 - Full Name
39. BO1 - DOB (YYYY-MM-DD)
40. BO1 - Address
41. BO1 - ID Type
42. BO1 - ID Number
43. BO1 - ID Last 4
44. BO1 - Issuing Country
45. BO1 - Issuing State
46. BO1 - Ownership %
47. BO1 - Role
```

#### Section H: Beneficial Owners 2-4 (30 fields)
Repeat structure of BO1 for BO2, BO3, BO4

**Total Required Fields: 77 fields minimum**

---

## 🧪 Testing Procedures

### Pre-Deployment CSV Validation

#### Test 1: CSV Template Validator
1. Navigate to Admin Tools
2. Run "CSV ↔ Form Validator"
3. **Expected:** 100% match (all green)
4. **If fails:** Identify missing fields and add them

#### Test 2: Manual Entry Round-Trip
1. Create client via manual entry form
2. Fill ALL fields (including optional)
3. Complete wizard to confirmation
4. Download CSV from confirmation page
5. Open CSV in Excel/Google Sheets
6. **Verify:** Every field entered appears in CSV
7. **Expected:** Zero data loss

#### Test 3: CSV Upload Round-Trip
1. Download blank CSV template
2. Fill in sample data (all fields)
3. Upload CSV to wizard
4. Complete wizard
5. Download final CSV
6. **Verify:** All uploaded data preserved
7. **Expected:** Perfect data integrity

#### Test 4: Mixed Service Types
1. Create 3 clients:
   - Client A: monitoring, domestic
   - Client B: filing, domestic
   - Client C: filing, foreign
2. Complete wizard
3. Download CSV
4. **Verify:** Service Type and Entity Type correct for each
5. **Verify:** Pricing reflects correct tiers

#### Test 5: Disclosure vs Exemption Paths
1. Create 2 clients:
   - Client A: disclosure (add beneficial owners)
   - Client B: exemption (add exemption explanation)
2. Complete wizard
3. Download CSV
4. **Verify:**
   - Client A: Beneficial owner data populated
   - Client B: Exemption fields populated
   - Both: Company core data populated

#### Test 6: Admin Export Validation
1. As admin, view submissions
2. Click "Export CSV"
3. Open exported file
4. **Verify:** Firm-level data accurate
5. **Note:** Individual client data not in this export (by design)

---

### Compliance Checklist

#### Before Each Release
- [ ] All wizard fields captured in database
- [ ] All database fields included in CSV exports
- [ ] Fictitious Name (DBA) in all exports
- [ ] Service Type tracked per client
- [ ] Entity Type auto-detected correctly
- [ ] Date Authority Filed NY for foreign entities
- [ ] Company Address fields captured
- [ ] Company Applicant data preserved
- [ ] Beneficial Owner complete data (not just Last 4)
- [ ] Ownership percentages included
- [ ] Issuing Country/State for all IDs
- [ ] Exemption explanation required and editable
- [ ] CSV Template Validator passes 100%
- [ ] Round-trip tests pass (upload → download)

#### Regulatory Requirements
- [ ] PII encrypted in transit and at rest
- [ ] Sensitive data (SSN, ID numbers) masked in UI
- [ ] Full ID numbers only in secure admin exports
- [ ] Audit log captures all data access
- [ ] Data retention policy enforced
- [ ] GDPR compliance for EU contacts
- [ ] User consent for data storage

---

## 🚨 Critical Warnings

### Data Integrity
1. **Never remove fields from CSV exports** - Regulatory requirement
2. **Always test round-trip** - Upload → Process → Download
3. **Validate before deploy** - Use CSV Form Validator tool
4. **Monitor data loss** - Check audit logs for incomplete records

### Security
1. **Mask sensitive data** - Never display full SSN in client UI
2. **Audit all exports** - Log who exported what data when
3. **Encrypt exports** - Use secure download links only
4. **Time-limit links** - Download links expire after 1 hour

### Compliance
1. **Document changes** - Update this file for any field changes
2. **Test thoroughly** - All 6 tests MUST pass before release
3. **User training** - Educate admins on new fields
4. **Version control** - Tag releases with CSV schema version

---

## 📞 Support & Contact

**Technical Issues:**
- Email: admin@nylta.com
- Phone: (555) 123-4567

**Regulatory Questions:**
- Compliance Department: compliance@nylta.com

**System Updates:**
- Check this documentation for latest version
- Subscribe to admin email list for notifications

---

## 📄 Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 2.0 | 2026-02-03 | Complete documentation overhaul, CSV specifications | System Admin |
| 1.5 | 2026-01-15 | Added Fictitious Name field | Dev Team |
| 1.4 | 2026-01-10 | Service Type tracking added | Dev Team |
| 1.3 | 2025-12-20 | Entity Type auto-detection | Dev Team |
| 1.2 | 2025-12-15 | Company Applicant optional | Dev Team |
| 1.1 | 2025-12-01 | Dual-path wizard implemented | Dev Team |
| 1.0 | 2025-11-15 | Initial release | Dev Team |

---

**END OF DOCUMENTATION**

*This document is maintained by the NYLTA development team and updated with each system release. For the latest version, check the admin dashboard documentation section.*
