# Company Applicant & Beneficial Owner Logic Updates

## Overview
Updated the bulk filing flow to properly handle Company Applicant registration and Beneficial Owner information according to NYLTA requirements.

---

## ✅ Changes Implemented

### 1️⃣ **Company Applicant Logic**

#### Key Requirements:
- ✅ **Must always be someone from the law firm** (not optional)
- ✅ **No longer choosing from client's beneficial owners**
- ✅ **Firms can register up to 3 workers during firm registration**
- ✅ **During bulk filing, can select one of the 3 registered workers OR enter a new person**

#### What Changed:

**A. Firm Registration (Step 1) - Added Worker Registration:**
- New section: "Register Firm Workers (Optional)"
- Firms can add up to 3 workers with:
  - Full Name
  - Email
  - Job Title
- Each worker can be added/removed individually
- Workers are stored in `FirmInfo.registeredWorkers` array

**B. Company Applicant Step (Step 3):**
- **Dropdown Selection:** Shows all registered workers from firm
- **Manual Entry Option:** "Enter New Person Manually" option in dropdown
- **Always Required:** Exactly ONE company applicant per client
- **Pre-filled Fields:** When selecting a registered worker, name and title auto-populate
- **From Firm Only:** Clear messaging that applicant must be from law firm

#### Updated Interface:
```typescript
export interface FirmWorker {
  id: string;
  fullName: string;
  email: string;
  title: string;
}

export interface FirmInfo {
  // ... existing fields
  registeredWorkers?: FirmWorker[];
}
```

---

### 2️⃣ **Beneficial Owner Fields**

#### Updated Requirements:
- ✅ **Date format:** yyyy-mm-dd (with calendar popup)
- ✅ **Ownership %:** Required field with validation
- ✅ **Organizer Role:** Checkbox to indicate if person is an organizer
- ✅ **Address Type:** Residential or Business address designation

#### What Changed:

**A. New Fields Added:**
```typescript
export interface BeneficialOwner {
  id: string;
  fullName: string;
  dob: string;  // Format: yyyy-mm-dd
  address: string;
  addressType?: "Residential" | "Business";  // NEW
  idType: string;
  idNumber: string;
  issuingCountry?: string;
  issuingState?: string;
  ownershipPercentage: string;  // Existing, now with helper text
  isOrganizer?: boolean;  // NEW
}
```

**B. Form Updates (Step 3 - Exemption Check):**

1. **Date of Birth Field:**
   - Label: "Date of Birth * (yyyy-mm-dd format)"
   - Uses DatePicker component with calendar popup
   - Helper text: "Click to open calendar popup"
   - Displays in yyyy-mm-dd format

2. **Address Field:**
   - Label changed from "Residential Address" to just "Address"
   - New dropdown below: "Address Type"
   - Options:
     - Residential Address
     - Business Address

3. **Ownership Percentage:**
   - Existing field kept
   - Added helper text: "Must be 25% or greater to qualify as beneficial owner"
   - Placeholder: "e.g., 50% or 25.5%"

4. **Organizer Checkbox (NEW):**
   - Checkbox: "This person is an Organizer of the company"
   - Helper text: "Check this box if this beneficial owner also served as an organizer during formation"
   - Stored as boolean in `isOrganizer` field

---

### 3️⃣ **Identity Verification Logic**

#### Requirement:
- ✅ **ONLY appears if Company Applicant = Beneficial Owner**
- ✅ **In bulk filing, these are always shown separately** (so verification typically won't apply)

#### Current Implementation:
- Company Applicant step (Step 3) is separate from Beneficial Owners
- Company Applicants are from the law firm
- Beneficial Owners are from the client company
- Since these are different people in bulk filing, identity verification check is not needed
- **Note:** If individual filing is added later, would need to add verification logic

---

## 📋 Updated User Flow

### Step 1: Firm Registration
1. Fill out firm information
2. **NEW:** Optionally register up to 3 firm workers
   - Add Worker button (shows count: 0/3, 1/3, 2/3, 3/3)
   - Each worker: Name, Email, Title
   - Can remove any worker
3. Continue to client upload

### Step 2: Client Upload
*(No changes - CSV upload as before)*

### Step 3: Company Applicant (Per Client)
1. **IF firm has registered workers:**
   - Dropdown shows: List of registered workers + "Enter New Person Manually"
   - Select a worker → Name and Title pre-fill
   - OR select "Manual" → Enter all details fresh

2. **IF firm has NO registered workers:**
   - Manual entry form shown immediately
   
3. **Required Fields:**
   - Full Legal Name
   - Date of Birth (yyyy-mm-dd with calendar)
   - Residential Address
   - Role/Title
   - ID Type (SSN, Passport, Driver License, State ID)
   - ID Number
   - Issuing State (if SSN/DL/State ID) OR Issuing Country (if Passport)

### Step 4: Exemption Check
*(No major changes to flow)*

**For Non-Exempt Clients - Beneficial Owners:**
1. Add beneficial owners (up to 4 per client)
2. **Fields per owner:**
   - Full Legal Name *
   - Date of Birth * (yyyy-mm-dd with calendar popup)
   - Address *
   - **Address Type * (NEW):** Residential or Business
   - **Ownership Percentage *:** With 25% minimum note
   - **Is Organizer (NEW):** Checkbox
   - ID Type *
   - ID Number *
   - Issuing State/Country * (based on ID type)

---

## 🎨 UI/UX Improvements

### Firm Worker Registration
- Card-based design for each worker
- Trash icon to remove workers
- Plus icon to add more (disabled at 3)
- Counter shows "Add Worker (X/3)"

### Company Applicant Selection
- Clean dropdown interface
- Auto-population when selecting registered worker
- Disabled fields when worker is selected (except optional fields)
- Clear messaging: "Company Applicant must be from your law firm"

### Beneficial Owner Forms
- Checkbox with clear label for organizer role
- Dropdown for address type (not radio buttons)
- Helper text for ownership percentage
- Helper text for date format
- Consistent spacing and grouping

---

## 📊 Data Validation

### Company Applicant (Required):
- ✅ Full Name (not empty)
- ✅ Date of Birth (valid date)
- ✅ Address (not empty)
- ✅ ID Number (not empty)
- ✅ Issuing State (if SSN/DL/State ID)
- ✅ Issuing Country (if Passport)

### Beneficial Owner (Required per owner):
- ✅ Full Name (not empty)
- ✅ Date of Birth (valid yyyy-mm-dd format)
- ✅ Address (not empty)
- ✅ Address Type (Residential or Business)
- ✅ Ownership Percentage (must be ≥25%)
- ✅ ID Number (not empty)
- ✅ Issuing State/Country (based on ID type)
- ⚪ Is Organizer (optional checkbox)

---

## 🔄 Backward Compatibility

### Existing Data:
- Old clients without `addressType` will default to "Residential"
- Old clients without `isOrganizer` will default to `false`
- Old firm registrations without `registeredWorkers` will show manual entry only
- All existing validation still applies

### CSV Import:
- CSV templates should be updated to include:
  - Address Type column for beneficial owners
  - Is Organizer column for beneficial owners
- Old CSVs without these columns will still import (defaults applied)

---

## 🚀 Testing Checklist

### Firm Registration:
- [ ] Can add up to 3 workers
- [ ] Can remove workers
- [ ] Add Worker button disabled at 3 workers
- [ ] Worker data saves to firmInfo
- [ ] Can proceed without adding any workers

### Company Applicant:
- [ ] Dropdown shows all registered workers
- [ ] "Enter New Person Manually" option works
- [ ] Selecting worker pre-fills name and title
- [ ] Manual entry allows all fields to be edited
- [ ] Validation prevents continuing with incomplete data
- [ ] Date picker shows calendar popup
- [ ] Date displays in yyyy-mm-dd format

### Beneficial Owners:
- [ ] Can add up to 4 owners per client
- [ ] Address Type dropdown works
- [ ] Organizer checkbox toggles correctly
- [ ] Ownership percentage validation (≥25%)
- [ ] Date picker shows calendar popup
- [ ] Date displays in yyyy-mm-dd format
- [ ] All fields save correctly
- [ ] Can remove owners

### Data Flow:
- [ ] Firm workers persist across steps
- [ ] Company applicant data saves per client
- [ ] Beneficial owner data saves per client
- [ ] Review summary shows all data correctly
- [ ] Payment step receives complete data

---

## 📝 Files Modified

### Core Application Files:
1. `/App.tsx` - Added FirmWorker interface, updated FirmInfo and BeneficialOwner interfaces
2. `/components/Step1FirmInfo.tsx` - Added worker registration section
3. `/components/Step2CompanyApplicant.tsx` - Complete rewrite with dropdown selection
4. `/components/Step3ExemptionCheck.tsx` - Added address type, organizer checkbox, updated date labels

### Type Interfaces Updated:
- `FirmInfo` - Added `registeredWorkers?: FirmWorker[]`
- `FirmWorker` - New interface (id, fullName, email, title)
- `BeneficialOwner` - Added `addressType` and `isOrganizer` fields

---

## 🎯 Key Benefits

1. **Firm Efficiency:** Pre-register workers once, reuse for all filings
2. **Data Consistency:** Registered workers ensure consistent applicant information
3. **Flexibility:** Can still enter new people when needed
4. **Compliance:** Clear separation between firm representative (Company Applicant) and client owners (Beneficial Owners)
5. **Better Data:** Address type and organizer role provide more complete information
6. **User-Friendly:** Calendar popups and clear date format reduce errors

---

## 🔮 Future Enhancements

### Phase 2 Suggestions:
1. **Worker Management Dashboard:** Edit/delete registered workers after initial registration
2. **Default Worker:** Set a default worker for bulk filings
3. **Worker Permissions:** Different access levels for different workers
4. **Bulk Assignment:** Assign same company applicant to multiple clients at once
5. **Verification Logic:** If individual filing is added, implement Company Applicant = Beneficial Owner check
6. **CSV Templates:** Generate downloadable CSV template with new fields
7. **Import Validation:** Enhanced CSV validation for new fields

---

**Updated:** November 28, 2025  
**Version:** 2.0  
**Status:** ✅ Complete and Ready for Testing
