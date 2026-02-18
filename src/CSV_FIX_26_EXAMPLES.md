# CSV TEMPLATE WITH 26 COMPLETE EXAMPLES

## Required Fields (marked with * in wizard):

### Client Basic Info:
- LLC Legal Name*
- NY DOS ID*
- Formation Date*
- Contact Email*
- Country of Formation*
- State (if USA - required if Country is USA)*
- Filing Type (disclosure/exemption)*

### For DISCLOSURE Path:
- Company Applicant fields (if disclosure)
- Beneficial Owner fields (minimum 1):
  - Full Name*
  - Date of Birth*
  - Street Address*
  - City*
  - State*
  - ZIP Code*
  - Country*
  - ID Type*
  - ID Number*
  - ID Issuing Country*
  - ID Issuing State (if USA)*
  - Ownership %*

### For EXEMPTION Path:
- Exemption Category*
- Exemption Explanation*

## CSV Example Data

The downloadTemplate function needs to be updated to include 26 complete rows with ALL required fields filled.

### Tier Testing:
- Rows 1-24: Standard examples (under 25 threshold)
- Rows 25: Exactly 25 (triggers Tier 2 discount)
- Row 26: 26th entity (confirms Tier 2 discount applies)

### Examples should include:
- 13 Disclosure (beneficial ownership) examples
- 13 Exemption examples
- Mix of domestic and foreign entities
- All required fields completed
- Realistic test data

### Sample Row Format:
```
"Acme Manufacturing LLC","1234567","12-3456789","2020-01-15","USA","New York","contact@acme.com","disclosure","","","John Smith","1985-03-20","123 Main St, New York, NY 10001","Passport","AB123456","USA","New York","Founder","","","","","","","","Maria Garcia","1990-06-15","456 Oak Ave, Brooklyn, NY 11201","Driver License","DL789012","USA","New York","25","Co-Owner","","","","","","","","",""
```

I'll create the complete update to Step2ClientUpload.tsx with the full 26-row CSV template.
