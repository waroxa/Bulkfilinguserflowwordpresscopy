#!/bin/bash

# ==========================================
# HIGHLEVEL BULK FILING CUSTOM FIELDS SETUP
# ==========================================
# 
# INSTRUCTIONS:
# 1. Replace YOUR_API_KEY with your actual HighLevel API key
# 2. Replace YOUR_LOCATION_ID with your actual location ID
# 3. Run this script: bash create-bulk-filing-fields.sh
#
# This will create custom fields organized in your folder structure:
# - Account Details (already exists)
# - Consents (already exists)
# - Filing Information
# - Company Applicants
# - Beneficial Owners
# - Exemptions
# - Submissions
# - Others

API_KEY="YOUR_API_KEY_HERE"
LOCATION_ID="YOUR_LOCATION_ID_HERE"
API_BASE="https://services.leadconnectorhq.com"

# ==========================================
# FILING INFORMATION FOLDER
# ==========================================

echo "Creating Filing Information fields..."

# LLC Legal Name
curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_LLC_Legal_Name",
  "dataType": "TEXT",
  "placeholder": "ABC Company LLC",
  "position": 0
}'

# NY DOS ID
curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_NY_DOS_ID",
  "dataType": "TEXT",
  "placeholder": "1234567",
  "position": 0
}'

# EIN
curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_EIN",
  "dataType": "TEXT",
  "placeholder": "12-3456789",
  "position": 0
}'

# Formation Date
curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_Formation_Date",
  "dataType": "DATE",
  "position": 0
}'

# Country of Formation
curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_Country_of_Formation",
  "dataType": "TEXT",
  "placeholder": "United States",
  "position": 0
}'

# State of Formation
curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_State_of_Formation",
  "dataType": "TEXT",
  "placeholder": "New York",
  "position": 0
}'

# Contact Email
curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_Contact_Email",
  "dataType": "TEXT",
  "placeholder": "contact@company.com",
  "position": 0
}'

# ZIP Code
curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_ZIP_Code",
  "dataType": "NUMERICAL",
  "placeholder": "10001",
  "position": 0
}'

# Filing Type
curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Filing_Type",
  "dataType": "SINGLE_OPTIONS",
  "options": ["Beneficial Ownership Disclosure", "Claims Exemption"],
  "position": 0
}'

# ==========================================
# COMPANY APPLICANTS FOLDER
# ==========================================

echo "Creating Company Applicants fields..."

# CA1 Fields
curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_Full_Name",
  "dataType": "TEXT",
  "placeholder": "John Doe",
  "position": 0
}'

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_DOB",
  "dataType": "DATE",
  "position": 0
}'

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_Address",
  "dataType": "TEXT",
  "placeholder": "123 Main St|New York|NY|10001|United States|email@example.com",
  "position": 0
}'

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_ID_Type",
  "dataType": "SINGLE_OPTIONS",
  "options": ["SSN", "Driver License", "Passport", "State ID", "Foreign Passport"],
  "position": 0
}'

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_ID_Number",
  "dataType": "TEXT",
  "placeholder": "Full ID Number",
  "position": 0
}'

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_Issuing_Country",
  "dataType": "TEXT",
  "placeholder": "United States",
  "position": 0
}'

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_Issuing_State",
  "dataType": "TEXT",
  "placeholder": "New York",
  "position": 0
}'

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA1_Role",
  "dataType": "TEXT",
  "placeholder": "Filing Agent",
  "position": 0
}'

# CA2 Fields (same structure as CA1)
curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA2_Full_Name",
  "dataType": "TEXT",
  "placeholder": "Jane Smith",
  "position": 0
}'

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA2_DOB",
  "dataType": "DATE",
  "position": 0
}'

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_CA2_ID_Number",
  "dataType": "TEXT",
  "placeholder": "Full ID Number",
  "position": 0
}'

# ==========================================
# BENEFICIAL OWNERS FOLDER
# ==========================================

echo "Creating Beneficial Owners fields..."

# BO1 Fields
curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_BO1_Full_Name",
  "dataType": "TEXT",
  "placeholder": "John Doe",
  "position": 0
}'

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_BO1_DOB",
  "dataType": "DATE",
  "position": 0
}'

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_BO1_ID_Number",
  "dataType": "TEXT",
  "placeholder": "Full ID Number",
  "position": 0
}'

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_BO1_Ownership_Percentage",
  "dataType": "NUMERICAL",
  "placeholder": "25",
  "position": 0
}'

# Repeat for BO2-BO9...

# ==========================================
# EXEMPTIONS FOLDER
# ==========================================

echo "Creating Exemptions fields..."

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
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

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Exemption_Explanation",
  "dataType": "LARGE_TEXT",
  "placeholder": "Provide detailed explanation for exemption claim...",
  "position": 0
}'

# ==========================================
# SUBMISSIONS FOLDER
# ==========================================

echo "Creating Submissions fields..."

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Submission_Date",
  "dataType": "DATE",
  "position": 0
}'

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Total_Amount",
  "dataType": "NUMERICAL",
  "placeholder": "0",
  "position": 0
}'

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Number_of_Filings",
  "dataType": "NUMERICAL",
  "placeholder": "0",
  "position": 0
}'

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Payment_Status",
  "dataType": "SINGLE_OPTIONS",
  "options": ["Pending", "Paid", "Processing", "Complete", "Failed"],
  "position": 0
}'

curl --location "${API_BASE}/locations/${LOCATION_ID}/customFields" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${API_KEY}" \
--header 'Version: 2021-07-28' \
--data '{
  "name": "Bulk_Confirmation_Number",
  "dataType": "TEXT",
  "position": 0
}'

echo "✅ All bulk filing custom fields created!"
echo "Now organize them into folders in the HighLevel UI"
