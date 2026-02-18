# HighLevel Bulk Filing Custom Fields - Ready to Use with Folder Assignment

**Location ID:** `fXXJzwVf8OtANDf2M4VP`  
**API Key:** `pit-cca7bd65-1fe1-4754-88d7-a51883d631f2`

## 📋 Folder Structure
- **NYLTA | Bulk Filing | Filing Information** → `aYcLgQCSQi2MBW7hoJk1`
- **NYLTA | Bulk Filing | Company Applicants** → `o6Ju3zq8UEdClNek4nTU`
- **NYLTA | Bulk Filing | Beneficial Owners** → `51935tnrVzkRicxmLWaR`
- **NYLTA | Bulk Filing | Exemptions** → `BXh6srbj80ulWEp4r7K8`
- **NYLTA | Bulk Filing | Others** → `jXKjHBcthtbNxBIVG0PA`

## Instructions
1. Copy each curl command below
2. Paste into your terminal
3. Press Enter
4. Wait for the response
5. Move to the next command

**All fields will be automatically organized into the correct folders!**

---

## 📁 FILING INFORMATION FOLDER
**Parent ID:** `aYcLgQCSQi2MBW7hoJk1`

### 1. LLC Legal Name
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_LLC_Legal_Name",
  "dataType": "TEXT",
  "placeholder": "ABC Company LLC",
  "position": 0,
  "parentId": "aYcLgQCSQi2MBW7hoJk1"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Filing Information

### 2. NY DOS ID
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_NY_DOS_ID",
  "dataType": "TEXT",
  "placeholder": "1234567",
  "position": 0,
  "parentId": "aYcLgQCSQi2MBW7hoJk1"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Filing Information

### 3. EIN
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_EIN",
  "dataType": "TEXT",
  "placeholder": "12-3456789",
  "position": 0,
  "parentId": "aYcLgQCSQi2MBW7hoJk1"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Filing Information

### 4. Formation Date
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_Formation_Date",
  "dataType": "DATE",
  "position": 0,
  "parentId": "aYcLgQCSQi2MBW7hoJk1"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Filing Information

### 5. Country of Formation
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_Country_of_Formation",
  "dataType": "TEXT",
  "placeholder": "United States",
  "position": 0,
  "parentId": "aYcLgQCSQi2MBW7hoJk1"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Filing Information

### 6. State of Formation
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_State_of_Formation",
  "dataType": "TEXT",
  "placeholder": "New York",
  "position": 0,
  "parentId": "aYcLgQCSQi2MBW7hoJk1"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Filing Information

### 7. Contact Email
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_Contact_Email",
  "dataType": "TEXT",
  "placeholder": "contact@company.com",
  "position": 0,
  "parentId": "aYcLgQCSQi2MBW7hoJk1"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Filing Information

### 8. ZIP Code
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_ZIP_Code",
  "dataType": "NUMERICAL",
  "placeholder": "10001",
  "position": 0,
  "parentId": "aYcLgQCSQi2MBW7hoJk1"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Filing Information

### 9. Filing Type
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_Type",
  "dataType": "SINGLE_OPTIONS",
  "options": ["Beneficial Ownership Disclosure", "Claims Exemption"],
  "position": 0,
  "parentId": "aYcLgQCSQi2MBW7hoJk1"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Filing Information

---

## 👤 COMPANY APPLICANTS FOLDER
**Parent ID:** `o6Ju3zq8UEdClNek4nTU`

### Company Applicant 1 - All Fields

#### CA1 - Full Name
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_Full_Name",
  "dataType": "TEXT",
  "placeholder": "John Doe",
  "position": 0,
  "parentId": "o6Ju3zq8UEdClNek4nTU"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Company Applicants

#### CA1 - DOB
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_DOB",
  "dataType": "DATE",
  "position": 0,
  "parentId": "o6Ju3zq8UEdClNek4nTU"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Company Applicants

#### CA1 - Address
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_Address",
  "dataType": "TEXT",
  "placeholder": "123 Main St, New York, NY 10001, United States",
  "position": 0,
  "parentId": "o6Ju3zq8UEdClNek4nTU"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Company Applicants

#### CA1 - ID Type
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_ID_Type",
  "dataType": "SINGLE_OPTIONS",
  "options": ["SSN", "Driver License", "Passport", "State ID", "Foreign Passport"],
  "position": 0,
  "parentId": "o6Ju3zq8UEdClNek4nTU"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Company Applicants

#### CA1 - ID Number (FULL)
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_ID_Number",
  "dataType": "TEXT",
  "placeholder": "Full ID Number",
  "position": 0,
  "parentId": "o6Ju3zq8UEdClNek4nTU"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Company Applicants

#### CA1 - Issuing Country
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_Issuing_Country",
  "dataType": "TEXT",
  "placeholder": "United States",
  "position": 0,
  "parentId": "o6Ju3zq8UEdClNek4nTU"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Company Applicants

#### CA1 - Issuing State
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_Issuing_State",
  "dataType": "TEXT",
  "placeholder": "New York",
  "position": 0,
  "parentId": "o6Ju3zq8UEdClNek4nTU"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Company Applicants

#### CA1 - Role
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_Role",
  "dataType": "TEXT",
  "placeholder": "Filing Agent",
  "position": 0,
  "parentId": "o6Ju3zq8UEdClNek4nTU"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Company Applicants

### Company Applicant 2 - All Fields

#### CA2 - Full Name
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA2_Full_Name",
  "dataType": "TEXT",
  "placeholder": "Jane Smith",
  "position": 0,
  "parentId": "o6Ju3zq8UEdClNek4nTU"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Company Applicants

#### CA2 - DOB
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA2_DOB",
  "dataType": "DATE",
  "position": 0,
  "parentId": "o6Ju3zq8UEdClNek4nTU"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Company Applicants

#### CA2 - Address
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA2_Address",
  "dataType": "TEXT",
  "placeholder": "456 Oak Ave, Brooklyn, NY 11201, United States",
  "position": 0,
  "parentId": "o6Ju3zq8UEdClNek4nTU"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Company Applicants

#### CA2 - ID Type
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA2_ID_Type",
  "dataType": "SINGLE_OPTIONS",
  "options": ["SSN", "Driver License", "Passport", "State ID", "Foreign Passport"],
  "position": 0,
  "parentId": "o6Ju3zq8UEdClNek4nTU"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Company Applicants

#### CA2 - ID Number (FULL)
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA2_ID_Number",
  "dataType": "TEXT",
  "placeholder": "Full ID Number",
  "position": 0,
  "parentId": "o6Ju3zq8UEdClNek4nTU"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Company Applicants

#### CA2 - Issuing Country
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA2_Issuing_Country",
  "dataType": "TEXT",
  "placeholder": "United States",
  "position": 0,
  "parentId": "o6Ju3zq8UEdClNek4nTU"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Company Applicants

#### CA2 - Issuing State
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA2_Issuing_State",
  "dataType": "TEXT",
  "placeholder": "New York",
  "position": 0,
  "parentId": "o6Ju3zq8UEdClNek4nTU"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Company Applicants

#### CA2 - Role
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA2_Role",
  "dataType": "TEXT",
  "placeholder": "Company Representative",
  "position": 0,
  "parentId": "o6Ju3zq8UEdClNek4nTU"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Company Applicants

---

## 👥 BENEFICIAL OWNERS FOLDER (9 Owners)
**Parent ID:** `51935tnrVzkRicxmLWaR`

### Beneficial Owner 1 - All Fields

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO1_Full_Name", "dataType": "TEXT", "placeholder": "John Doe", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO1_DOB", "dataType": "DATE", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO1_Address", "dataType": "TEXT", "placeholder": "123 Main St, New York, NY 10001, United States", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO1_Address_Type", "dataType": "SINGLE_OPTIONS", "options": ["Residential", "Business"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO1_ID_Type", "dataType": "SINGLE_OPTIONS", "options": ["SSN", "Driver License", "Passport", "State ID", "Foreign Passport"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO1_ID_Number", "dataType": "TEXT", "placeholder": "Full ID Number", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO1_Issuing_Country", "dataType": "TEXT", "placeholder": "United States", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO1_Issuing_State", "dataType": "TEXT", "placeholder": "New York", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO1_Ownership_Percentage", "dataType": "NUMERICAL", "placeholder": "25", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

### Beneficial Owner 2 - All Fields

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO2_Full_Name", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO2_DOB", "dataType": "DATE", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO2_Address", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO2_Address_Type", "dataType": "SINGLE_OPTIONS", "options": ["Residential", "Business"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO2_ID_Type", "dataType": "SINGLE_OPTIONS", "options": ["SSN", "Driver License", "Passport", "State ID", "Foreign Passport"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO2_ID_Number", "dataType": "TEXT", "placeholder": "Full ID Number", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO2_Issuing_Country", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO2_Issuing_State", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO2_Ownership_Percentage", "dataType": "NUMERICAL", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

### Beneficial Owner 3 - All Fields

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO3_Full_Name", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO3_DOB", "dataType": "DATE", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO3_Address", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO3_Address_Type", "dataType": "SINGLE_OPTIONS", "options": ["Residential", "Business"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO3_ID_Type", "dataType": "SINGLE_OPTIONS", "options": ["SSN", "Driver License", "Passport", "State ID", "Foreign Passport"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO3_ID_Number", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO3_Issuing_Country", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO3_Issuing_State", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO3_Ownership_Percentage", "dataType": "NUMERICAL", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

### Beneficial Owner 4 - All Fields

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO4_Full_Name", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO4_DOB", "dataType": "DATE", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO4_Address", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO4_Address_Type", "dataType": "SINGLE_OPTIONS", "options": ["Residential", "Business"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO4_ID_Type", "dataType": "SINGLE_OPTIONS", "options": ["SSN", "Driver License", "Passport", "State ID", "Foreign Passport"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO4_ID_Number", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO4_Issuing_Country", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO4_Issuing_State", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO4_Ownership_Percentage", "dataType": "NUMERICAL", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

### Beneficial Owner 5 - All Fields

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO5_Full_Name", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO5_DOB", "dataType": "DATE", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO5_Address", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO5_Address_Type", "dataType": "SINGLE_OPTIONS", "options": ["Residential", "Business"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO5_ID_Type", "dataType": "SINGLE_OPTIONS", "options": ["SSN", "Driver License", "Passport", "State ID", "Foreign Passport"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO5_ID_Number", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO5_Issuing_Country", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO5_Issuing_State", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO5_Ownership_Percentage", "dataType": "NUMERICAL", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

### Beneficial Owner 6 - All Fields

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO6_Full_Name", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO6_DOB", "dataType": "DATE", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO6_Address", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO6_Address_Type", "dataType": "SINGLE_OPTIONS", "options": ["Residential", "Business"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO6_ID_Type", "dataType": "SINGLE_OPTIONS", "options": ["SSN", "Driver License", "Passport", "State ID", "Foreign Passport"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO6_ID_Number", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO6_Issuing_Country", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO6_Issuing_State", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO6_Ownership_Percentage", "dataType": "NUMERICAL", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

### Beneficial Owner 7 - All Fields

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO7_Full_Name", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO7_DOB", "dataType": "DATE", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO7_Address", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO7_Address_Type", "dataType": "SINGLE_OPTIONS", "options": ["Residential", "Business"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO7_ID_Type", "dataType": "SINGLE_OPTIONS", "options": ["SSN", "Driver License", "Passport", "State ID", "Foreign Passport"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO7_ID_Number", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO7_Issuing_Country", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO7_Issuing_State", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO7_Ownership_Percentage", "dataType": "NUMERICAL", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

### Beneficial Owner 8 - All Fields

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO8_Full_Name", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO8_DOB", "dataType": "DATE", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO8_Address", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO8_Address_Type", "dataType": "SINGLE_OPTIONS", "options": ["Residential", "Business"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO8_ID_Type", "dataType": "SINGLE_OPTIONS", "options": ["SSN", "Driver License", "Passport", "State ID", "Foreign Passport"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO8_ID_Number", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO8_Issuing_Country", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO8_Issuing_State", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO8_Ownership_Percentage", "dataType": "NUMERICAL", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

### Beneficial Owner 9 - All Fields

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO9_Full_Name", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO9_DOB", "dataType": "DATE", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO9_Address", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO9_Address_Type", "dataType": "SINGLE_OPTIONS", "options": ["Residential", "Business"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO9_ID_Type", "dataType": "SINGLE_OPTIONS", "options": ["SSN", "Driver License", "Passport", "State ID", "Foreign Passport"], "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO9_ID_Number", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO9_Issuing_Country", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO9_Issuing_State", "dataType": "TEXT", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' --header 'Content-Type: application/json' --header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' --header 'Version: 2021-07-28' --data '{"name": "Bulk_BO9_Ownership_Percentage", "dataType": "NUMERICAL", "position": 0, "parentId": "51935tnrVzkRicxmLWaR"}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Beneficial Owners

---

## 🔖 EXEMPTIONS FOLDER
**Parent ID:** `BXh6srbj80ulWEp4r7K8`

### Exemption Type
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Exemption_Type",
  "dataType": "SINGLE_OPTIONS",
  "options": [
    "Bank",
    "Credit Union",
    "Depository Institution Holding Company",
    "Money Services Business",
    "Broker or Dealer in Securities",
    "Securities Exchange or Clearing Agency",
    "Other Exchange Act Registered Entity",
    "Investment Company or Investment Adviser",
    "Venture Capital Fund Adviser",
    "Insurance Company",
    "State-Licensed Insurance Producer",
    "Commodity Exchange Act Registered Entity",
    "Accounting Firm",
    "Public Utility",
    "Financial Market Utility",
    "Pooled Investment Vehicle",
    "Tax-Exempt Entity",
    "Entity Assisting a Tax-Exempt Entity",
    "Large Operating Company",
    "Subsidiary of Certain Exempt Entities",
    "Inactive Entity",
    "Governmental Authority",
    "U.S.-Formed LLC"
  ],
  "position": 0,
  "parentId": "BXh6srbj80ulWEp4r7K8"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Exemptions

### Exemption Reason
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Exemption_Reason",
  "dataType": "TEXTAREA",
  "placeholder": "Provide detailed reasoning for exemption claim",
  "position": 0,
  "parentId": "BXh6srbj80ulWEp4r7K8"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Exemptions

---

## 📝 OTHERS FOLDER (Submission Tracking)
**Parent ID:** `jXKjHBcthtbNxBIVG0PA`

### Submission Number / Order Number
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Submission_Number",
  "dataType": "TEXT",
  "placeholder": "SUB-2025-112801",
  "position": 0,
  "parentId": "jXKjHBcthtbNxBIVG0PA"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Others

### Submission Date
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Submission_Date",
  "dataType": "DATE",
  "position": 0,
  "parentId": "jXKjHBcthtbNxBIVG0PA"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Others

### IP Address
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_IP_Address",
  "dataType": "TEXT",
  "placeholder": "192.168.1.105",
  "position": 0,
  "parentId": "jXKjHBcthtbNxBIVG0PA"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Others

### Submission Status
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Submission_Status",
  "dataType": "SINGLE_OPTIONS",
  "options": ["Pending", "Submitted", "Accepted", "Rejected"],
  "position": 0,
  "parentId": "jXKjHBcthtbNxBIVG0PA"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Others

### Confirmation Number
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Confirmation_Number",
  "dataType": "TEXT",
  "placeholder": "CONF-123456",
  "position": 0,
  "parentId": "jXKjHBcthtbNxBIVG0PA"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Others

### Payment Status
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Payment_Status",
  "dataType": "SINGLE_OPTIONS",
  "options": ["Pending", "Paid", "Failed", "Refunded"],
  "position": 0,
  "parentId": "jXKjHBcthtbNxBIVG0PA"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Others

### Payment Amount
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Payment_Amount",
  "dataType": "NUMERICAL",
  "placeholder": "150.00",
  "position": 0,
  "parentId": "jXKjHBcthtbNxBIVG0PA"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Others

### Notes
```bash
curl --location 'https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2' \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_Notes",
  "dataType": "TEXTAREA",
  "placeholder": "Additional notes or comments about this filing",
  "position": 0,
  "parentId": "jXKjHBcthtbNxBIVG0PA"
}'
```
➜ **Will be created in:** NYLTA | Bulk Filing | Others

---

## ✅ SUMMARY

**Total Fields Created:** 108 fields

### Breakdown by Folder:
- ✅ **NYLTA | Bulk Filing | Filing Information:** 9 fields → `aYcLgQCSQi2MBW7hoJk1`
- ✅ **NYLTA | Bulk Filing | Company Applicants:** 16 fields → `o6Ju3zq8UEdClNek4nTU`
- ✅ **NYLTA | Bulk Filing | Beneficial Owners:** 81 fields (9 owners × 9 fields) → `51935tnrVzkRicxmLWaR`
- ✅ **NYLTA | Bulk Filing | Exemptions:** 2 fields → `BXh6srbj80ulWEp4r7K8`
- ✅ **NYLTA | Bulk Filing | Others:** 8 fields → `jXKjHBcthtbNxBIVG0PA`

### All Fields Automatically Organized Into Folders! 🎉

Each curl command above includes the correct `parentId` that will automatically place the custom field into the designated folder in your HighLevel CRM.

**Ready to execute!** Simply copy and paste each command into your terminal.
