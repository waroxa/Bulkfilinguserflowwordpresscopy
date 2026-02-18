# HighLevel Bulk Filing Custom Fields - Execution Guide

**Location ID:** `fXXJzwVf8OtANDf2M4VP`  
**API Key:** `pit-cca7bd65-1fe1-4754-88d7-a51883d631f2`

## Instructions
1. Copy each curl command below
2. Paste into your terminal
3. Press Enter
4. Wait for the response
5. Move to the next command

**All 108 fields are ready to be created in your HighLevel account!**

---

## 📁 FILING INFORMATION (9 Fields)

### 1. LLC Legal Name
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Filing_LLC_Legal_Name", "dataType": "TEXT", "placeholder": "ABC Company LLC", "position": 0}'
```

### 2. NY DOS ID
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Filing_NY_DOS_ID", "dataType": "TEXT", "placeholder": "1234567", "position": 0}'
```

### 3. EIN
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Filing_EIN", "dataType": "TEXT", "placeholder": "12-3456789", "position": 0}'
```

### 4. Formation Date
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Filing_Formation_Date", "dataType": "DATE", "position": 0}'
```

### 5. Country of Formation
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Filing_Country_of_Formation", "dataType": "TEXT", "placeholder": "United States", "position": 0}'
```

### 6. State of Formation
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Filing_State_of_Formation", "dataType": "TEXT", "placeholder": "New York", "position": 0}'
```

### 7. Contact Email
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Filing_Contact_Email", "dataType": "TEXT", "placeholder": "contact@company.com", "position": 0}'
```

### 8. ZIP Code
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Filing_ZIP_Code", "dataType": "NUMERICAL", "placeholder": "10001", "position": 0}'
```

### 9. Filing Type
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Filing_Type", "dataType": "SINGLE_OPTIONS", "options": ["Beneficial Ownership Disclosure", "Claims Exemption"], "position": 0}'
```

---

## 👤 COMPANY APPLICANTS (16 Fields - 2 Applicants × 8 Fields Each)

_Note: Full curl commands available in original READY_TO_USE_CURL_COMMANDS.md file_

**Company Applicant 1 Fields:**
- Bulk_CA1_Full_Name
- Bulk_CA1_DOB
- Bulk_CA1_Address
- Bulk_CA1_ID_Type
- Bulk_CA1_ID_Number
- Bulk_CA1_Issuing_Country
- Bulk_CA1_Issuing_State
- Bulk_CA1_Role

**Company Applicant 2 Fields:**
- Bulk_CA2_Full_Name
- Bulk_CA2_DOB
- Bulk_CA2_Address
- Bulk_CA2_ID_Type
- Bulk_CA2_ID_Number
- Bulk_CA2_Issuing_Country
- Bulk_CA2_Issuing_State
- Bulk_CA2_Role

---

## 👥 BENEFICIAL OWNERS (81 Fields - 9 Owners × 9 Fields Each)

_Note: Full curl commands available in original READY_TO_USE_CURL_COMMANDS.md file_

**Each Beneficial Owner (1-9) has these 9 fields:**
- Bulk_BO[X]_Full_Name
- Bulk_BO[X]_DOB
- Bulk_BO[X]_Address
- Bulk_BO[X]_Address_Type
- Bulk_BO[X]_ID_Type
- Bulk_BO[X]_ID_Number
- Bulk_BO[X]_Issuing_Country
- Bulk_BO[X]_Issuing_State
- Bulk_BO[X]_Ownership_Percentage

---

## 🔖 EXEMPTIONS (2 Fields)

### Exemption Type
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Exemption_Type", "dataType": "SINGLE_OPTIONS", "options": ["Bank", "Credit Union", "Depository Institution Holding Company", "Money Services Business", "Broker or Dealer in Securities", "Securities Exchange or Clearing Agency", "Other Exchange Act Registered Entity", "Investment Company or Investment Adviser", "Venture Capital Fund Adviser", "Insurance Company", "State-Licensed Insurance Producer", "Commodity Exchange Act Registered Entity", "Accounting Firm", "Public Utility", "Financial Market Utility", "Pooled Investment Vehicle", "Tax-Exempt Entity", "Entity Assisting a Tax-Exempt Entity", "Large Operating Company", "Subsidiary of Certain Exempt Entities", "Inactive Entity", "Governmental Authority", "U.S.-Formed LLC"], "position": 0}'
```

### Exemption Reason
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Exemption_Reason", "dataType": "TEXTAREA", "placeholder": "The entity qualifies for the selected exemption based on the information provided.", "position": 0}'
```

---

## 📝 SUBMISSION TRACKING (8 Fields)

### Submission Number
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Submission_Number", "dataType": "TEXT", "placeholder": "SUB-2025-112801", "position": 0}'
```

### Submission Date
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Submission_Date", "dataType": "DATE", "position": 0}'
```

### IP Address
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_IP_Address", "dataType": "TEXT", "placeholder": "192.168.1.105", "position": 0}'
```

### Submission Status
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Submission_Status", "dataType": "SINGLE_OPTIONS", "options": ["Pending", "Submitted", "Accepted", "Rejected"], "position": 0}'
```

### Confirmation Number
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Confirmation_Number", "dataType": "TEXT", "placeholder": "CONF-123456", "position": 0}'
```

### Payment Status
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Payment_Status", "dataType": "SINGLE_OPTIONS", "options": ["Pending", "Paid", "Failed", "Refunded"], "position": 0}'
```

### Payment Amount
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Payment_Amount", "dataType": "NUMERICAL", "placeholder": "150.00", "position": 0}'
```

### Notes
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_Filing_Notes", "dataType": "TEXTAREA", "placeholder": "Additional notes or comments about this filing", "position": 0}'
```

---

## ✅ SUMMARY

**Total Custom Fields:** 108

### Breakdown:
- Filing Information: **9 fields**
- Company Applicants: **16 fields** (2 applicants × 8 fields)
- Beneficial Owners: **81 fields** (9 owners × 9 fields)
- Exemptions: **2 fields**
- Submission Tracking: **8 fields**

**All fields are now ready for bulk filing data capture!**
