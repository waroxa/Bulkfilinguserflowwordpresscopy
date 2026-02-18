# NYLTA Field Reference - Exact Match to nylta.com/filing

This document lists all fields that must match exactly across our wizard, based on the client reference from nylta.com/filing.

## Red Info Box (Top of Page)

**Styling**: Red border (border-2 border-red-500), light red background (bg-red-50)

**Content**:
```
To confirm your NYLTA filing status, you will need to provide identifying details from a valid form of identification.

Accepted forms include a state-issued driver's license, state ID, U.S. passport, or foreign passport.

You do not need to upload a copy of your ID — only enter the document type, number, and issuing jurisdiction for verification.
```

---

## Company Information Section

### Section Header
- **Title**: "Company Information"
- **Description**: "Enter your LLC's basic information below to begin your NYLTA filing."

### Fields

#### 1. Legal Business Name
- **Label**: "Legal Business Name *"
- **Placeholder**: "Legal Business Name"
- **Help Text**: "The legal business name of the entity that is the subject of this filing. Enter the exact legal name of your LLC, including punctuation and capitalization as shown on your NY DOS record."
- **Required**: Yes
- **Field Name**: `llcName` or `legalBusinessName`

#### 2. Fictitious Name (DBA)
- **Label**: "Fictitious Name (DBA)"
- **Placeholder**: "Enter the fictitious name used in New York, if any. Leave blank if none."
- **Help Text**: None
- **Required**: No
- **Field Name**: `fictitiousName` or `dba`

#### 3. NY DOS ID Number
- **Label**: "NY DOS ID Number *"
- **Placeholder**: "NY DOS ID Number"
- **Help Text**: "This is a series of numbers assigned when your LLC was formed or authorized in New York."
- **Required**: Yes
- **Field Name**: `nydosId`

#### 4. EIN / Federal Tax ID (Dropdown)
- **Label**: "EIN / Federal Tax ID *"
- **Type**: Select/Dropdown
- **Placeholder**: "Select an option..."
- **Options**:
  - "I have an EIN"
  - "I don't have an EIN yet"
  - "Foreign Tax ID"
- **Required**: Yes
- **Field Name**: `einType` or `einStatus`

#### 5. EIN / Federal Tax ID (Input)
- **Label**: "EIN / Federal Tax ID *"
- **Placeholder**: "EIN / Federal Tax ID"
- **Help Text**: "Enter your LLC's 9-digit EIN issued by the IRS."
- **Required**: Yes (unless "don't have yet" selected)
- **Field Name**: `ein`

---

## Company Address Section

### Section Header
- **Title**: "Company Address"
- **Description**: None (just the title)

### Fields

#### 1. Street Address
- **Label**: "Street Address *"
- **Placeholder**: "Street Address (number, street, and apt. or suite no)"
- **Help Text**: None
- **Required**: Yes
- **Field Name**: `streetAddress` or `address`
- **Full Width**: Yes (spans 2 columns)

#### 2. City
- **Label**: "City *"
- **Placeholder**: "City"
- **Help Text**: None
- **Required**: Yes
- **Field Name**: `city`

#### 3. Country
- **Label**: "Country *"
- **Type**: Select/Dropdown
- **Placeholder**: "Select an option"
- **Required**: Yes
- **Field Name**: `country` or `countryOfFormation`

#### 4. State
- **Label**: "State *"
- **Placeholder**: "Select a country first"
- **Help Text**: None
- **Required**: Yes (if Country is USA)
- **Field Name**: `state` or `stateOfFormation`
- **Conditional**: Only enabled after country is selected

#### 5. Zip Code
- **Label**: "Zip Code *"
- **Placeholder**: "Zip Code"
- **Help Text**: None
- **Required**: Yes
- **Field Name**: `zipCode`

---

## Formation Information Section

### Section Header
- **Title**: "Formation Information"

### Fields

#### 1. Date of Formation / Registration
- **Label**: "Date of Formation / Registration *"
- **Type**: Date picker
- **Placeholder**: "MM/DD/YYYY" or date picker
- **Required**: Yes
- **Field Name**: `formationDate` or `dateOfFormation`

---

## Company Applicant Section (Beneficial Ownership Disclosure Path ONLY)

### Section Header
- **Title**: "Company Applicant"
- **Description**: Information about the person who filed the formation documents

### Fields

(To be specified based on additional screenshots - not fully visible in current images)

---

## Beneficial Owner(s) Section (Beneficial Ownership Disclosure Path ONLY)

### Section Header
- **Title**: "Beneficial Owner(s)"
- **Description**: Information about individuals with 25%+ ownership or substantial control

### Fields

(To be specified based on additional screenshots - not fully visible in current images)

---

## Exemption Category Section (Exemption Attestation Path ONLY)

### Section Header
- **Title**: "Exemption Category"

### Fields

(To be specified based on additional screenshots)

---

## Implementation Notes

1. **Red asterisk** (*) should be red color: `text-red-600`
2. **Help text** should be: `text-xs text-gray-500 mt-1`
3. **Section headers** should be: `text-lg text-gray-900 font-semibold`
4. **Section descriptions** should be: `text-sm text-gray-600 mb-4`
5. **Placeholders** should match exactly character-for-character
6. **Red info box** should use: `bg-red-50 border-2 border-red-500 p-4`
7. **Grid layout**: Use `grid-cols-1 md:grid-cols-2 gap-4` for most sections
8. **Full-width fields**: Use `md:col-span-2` class

---

## Files to Update

1. `/components/Step2ClientUpload.tsx` - Client upload wizard manual entry
2. `/components/Step2CompanyApplicant.tsx` - Company applicant fields (BO path only)
3. `/components/Step3BeneficialOwners.tsx` - Beneficial owner fields (BO path only)
4. `/components/Step3ExemptionCategory.tsx` - Exemption category (Exemption path only)
5. `/components/ProcessorDashboard.tsx` - View/edit dialog for existing submissions
6. Any other components that display or collect this information

---

## Additional Screenshots Needed

To complete this specification, please provide screenshots of:
1. ✅ Company Information section (provided)
2. ✅ Company Address section (provided)
3. ✅ Formation Information section (partially visible)
4. ❌ Company Applicant section (full view needed)
5. ❌ Beneficial Owner section (full view needed)
6. ❌ Exemption Category section (full view needed)
7. ❌ Any other sections with form fields

---

## Quick Implementation Checklist

- [ ] Update field labels to match exactly
- [ ] Update placeholders to match exactly
- [ ] Add help text under fields where specified
- [ ] Add red info box at top of filing pages
- [ ] Change "LLC Legal Name" to "Legal Business Name"
- [ ] Add "Fictitious Name (DBA)" field
- [ ] Change "NY DOS ID" to "NY DOS ID Number"
- [ ] Add EIN dropdown for type selection
- [ ] Update all address field placeholders
- [ ] Change "Country of Formation" to just "Country"
- [ ] Change "State (if USA)" to just "State"
- [ ] Make State field conditional with "Select a country first" placeholder
- [ ] Update Formation Date label to "Date of Formation / Registration"
- [ ] Ensure all required fields have red asterisks
- [ ] Test all conditional logic (EIN dropdown, State conditional on Country)
