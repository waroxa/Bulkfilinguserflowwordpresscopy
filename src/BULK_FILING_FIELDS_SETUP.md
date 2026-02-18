# HighLevel Bulk Filing Custom Fields Setup

## 📋 Overview

This document contains curl commands to create **separate custom fields for bulk filing** that won't conflict with your existing single filing fields.

All fields are prefixed with `Bulk_` to avoid conflicts.

---

## 🔧 Setup Instructions

### Step 1: Get Your Credentials

1. **API Key**: Log into HighLevel → Settings → API → Create API Key
2. **Location ID**: Your location ID from the URL when viewing custom fields

### Step 2: Replace Variables

In all curl commands below, replace:
- `YOUR_API_KEY_HERE` with your actual API key
- `YOUR_LOCATION_ID_HERE` with your actual location ID

### Step 3: Run the Commands

Copy and paste each curl command into your terminal. They will create the fields in HighLevel.

### Step 4: Organize Into Folders

After creating the fields, go to HighLevel → Custom Fields → Drag and drop fields into the appropriate folders:

- **Account Details** (already exists)
- **Consents** (already exists)
- **Filing Information**
- **Company Applicants**
- **Beneficial Owners**
- **Exemptions**
- **Submissions**
- **Others**

---

## 📁 FILING INFORMATION FOLDER

### LLC Legal Name
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_LLC_Legal_Name",
  "dataType": "TEXT",
  "placeholder": "ABC Company LLC",
  "position": 0
}'
```

### NY DOS ID
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_NY_DOS_ID",
  "dataType": "TEXT",
  "placeholder": "1234567",
  "position": 0
}'
```

### EIN
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_EIN",
  "dataType": "TEXT",
  "placeholder": "12-3456789",
  "position": 0
}'
```

### Formation Date
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_Formation_Date",
  "dataType": "DATE",
  "position": 0
}'
```

### Country of Formation
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_Country_of_Formation",
  "dataType": "TEXT",
  "placeholder": "United States",
  "position": 0
}'
```

### State of Formation
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_State_of_Formation",
  "dataType": "TEXT",
  "placeholder": "New York",
  "position": 0
}'
```

### Contact Email
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_Contact_Email",
  "dataType": "TEXT",
  "placeholder": "contact@company.com",
  "position": 0
}'
```

### ZIP Code
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_ZIP_Code",
  "dataType": "NUMERICAL",
  "placeholder": "10001",
  "position": 0
}'
```

### Filing Type
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_Type",
  "dataType": "SINGLE_OPTIONS",
  "options": ["Beneficial Ownership Disclosure", "Claims Exemption"],
  "position": 0
}'
```

---

## 👤 COMPANY APPLICANTS FOLDER

### CA1 - Full Name
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_Full_Name",
  "dataType": "TEXT",
  "placeholder": "John Doe",
  "position": 0
}'
```

### CA1 - DOB
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_DOB",
  "dataType": "DATE",
  "position": 0
}'
```

### CA1 - Address
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_Address",
  "dataType": "TEXT",
  "placeholder": "Street|City|State|ZIP|Country|Email",
  "position": 0
}'
```

### CA1 - ID Type
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_ID_Type",
  "dataType": "SINGLE_OPTIONS",
  "options": ["SSN", "Driver License", "Passport", "State ID", "Foreign Passport"],
  "position": 0
}'
```

### CA1 - ID Number (FULL)
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_ID_Number",
  "dataType": "TEXT",
  "placeholder": "Full ID Number",
  "position": 0
}'
```

### CA1 - Issuing Country
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_Issuing_Country",
  "dataType": "TEXT",
  "placeholder": "United States",
  "position": 0
}'
```

### CA1 - Issuing State
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_Issuing_State",
  "dataType": "TEXT",
  "placeholder": "New York",
  "position": 0
}'
```

### CA1 - Role
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_Role",
  "dataType": "TEXT",
  "placeholder": "Filing Agent",
  "position": 0
}'
```

### CA2 Fields (Repeat for Company Applicant 2)
```bash
# CA2 - Full Name
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{"name": "Bulk_CA2_Full_Name", "dataType": "TEXT", "position": 0}'

# CA2 - DOB
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{"name": "Bulk_CA2_DOB", "dataType": "DATE", "position": 0}'

# CA2 - ID Number (FULL)
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{"name": "Bulk_CA2_ID_Number", "dataType": "TEXT", "placeholder": "Full ID Number", "position": 0}'

# CA2 - Role
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{"name": "Bulk_CA2_Role", "dataType": "TEXT", "position": 0}'
```

---

## 👥 BENEFICIAL OWNERS FOLDER

### BO1 Fields
```bash
# BO1 - Full Name
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{"name": "Bulk_BO1_Full_Name", "dataType": "TEXT", "position": 0}'

# BO1 - DOB
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{"name": "Bulk_BO1_DOB", "dataType": "DATE", "position": 0}'

# BO1 - ID Number (FULL)
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{"name": "Bulk_BO1_ID_Number", "dataType": "TEXT", "placeholder": "Full ID Number", "position": 0}'

# BO1 - Ownership Percentage
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{"name": "Bulk_BO1_Ownership_Percentage", "dataType": "NUMERICAL", "placeholder": "25", "position": 0}'
```

**Repeat for BO2, BO3, BO4, BO5, BO6, BO7, BO8, BO9** (just change BO1 to BO2, BO3, etc.)

---

## ⚠️ EXEMPTIONS FOLDER

### Exemption Category
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Exemption_Category",
  "dataType": "SINGLE_OPTIONS",
  "options": [
    "Securities reporting issuer",
    "Governmental authority",
    "Bank",
    "Large operating company",
    "Inactive entity"
  ],
  "position": 0
}'
```

### Exemption Explanation
```bash
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Exemption_Explanation",
  "dataType": "LARGE_TEXT",
  "placeholder": "Detailed explanation...",
  "position": 0
}'
```

---

## 📊 SUBMISSIONS FOLDER

```bash
# Submission Date
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{"name": "Bulk_Submission_Date", "dataType": "DATE", "position": 0}'

# Total Amount
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{"name": "Bulk_Total_Amount", "dataType": "NUMERICAL", "position": 0}'

# Number of Filings
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{"name": "Bulk_Number_of_Filings", "dataType": "NUMERICAL", "position": 0}'

# Payment Status
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{"name": "Bulk_Payment_Status", "dataType": "SINGLE_OPTIONS", "options": ["Pending", "Paid", "Processing", "Complete"], "position": 0}'

# Confirmation Number
curl --location 'https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID_HERE/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Version: 2021-07-28' \
--data '{"name": "Bulk_Confirmation_Number", "dataType": "TEXT", "position": 0}'
```

---

## ✅ Summary

**Total Fields to Create:** ~80-100 fields (depending on how many BO fields you need)

**Organization:**
- Filing Information: 9 fields
- Company Applicants: 16 fields (2 applicants × 8 fields each)
- Beneficial Owners: 81 fields (9 owners × 9 fields each)
- Exemptions: 2 fields
- Submissions: 5 fields
- Others: 3 fields

**All fields are prefixed with `Bulk_` to avoid conflicts with single filing fields.**

---

## 🔗 Next Steps

1. Create the fields using the curl commands above
2. Organize them into folders in HighLevel UI
3. Update your bulk filing submission code to map data to these new field IDs
4. Test with a small batch first

---

## 📝 Notes

- **Account Details** and **Consents** folders already have fields created
- You can view all created fields using the HighLevel Custom Fields Viewer tool in your Admin Dashboard
- After creating fields, you'll need to update the `submitBulkFilingToHighLevel()` function to populate these custom fields with actual data
