# 📍 ADDRESS FIELD STANDARD - NYLTA.com System-Wide Rule

## ⚠️ CRITICAL SYSTEM-WIDE REQUIREMENT

**This document establishes the MANDATORY standard for ALL address fields throughout the NYLTA.com bulk filing system.**

> 🚨 **DO NOT DEVIATE FROM THIS PATTERN** - All address collection points MUST follow this exact implementation to ensure data consistency, international compliance, and proper validation.

---

## 🎯 Core Principle

**Everywhere an address is required in the system, the following logic MUST be applied:**

1. **Country Field** = Dropdown with ALL countries (not a text input)
2. **State/Province Field** = Conditionally visible based on selected country:
   - **United States** → Dropdown with US_STATES
   - **Canada** → Dropdown with CANADIAN_PROVINCES
   - **All other countries** → Free text input
3. **ZIP/Postal Code Label** = Dynamic based on country:
   - **United States** → "ZIP Code"
   - **All other countries** → "Postal Code"
4. **Address Format** = Pipe-delimited string: `street|city|state|zipCode|country`

---

## 📋 Implementation Requirements

### 1. Country Dropdown (REQUIRED)

```typescript
// ✅ CORRECT - Use this COUNTRIES array
const COUNTRIES = [
  "United States", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus",
  "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "North Korea", "South Korea",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
  "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
  "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
  "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
  "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay",
  "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// ✅ CORRECT - US States array
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

// ✅ CORRECT - Canadian Provinces/Territories array
const CANADIAN_PROVINCES = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
  "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island",
  "Quebec", "Saskatchewan", "Yukon"
];

// ✅ CORRECT - Country as dropdown
<Select value={country} onValueChange={(val) => setCountry(val)}>
  <SelectTrigger className="rounded-none border-gray-300">
    <SelectValue placeholder="Select Country" />
  </SelectTrigger>
  <SelectContent>
    {COUNTRIES.map(c => (
      <SelectItem key={c} value={c}>{c}</SelectItem>
    ))}
  </SelectContent>
</Select>

// ❌ INCORRECT - Never use text input for country
<Input value={country} onChange={...} placeholder="Country" />
```

### 2. Conditional State/Province Field (REQUIRED)

```typescript
// ✅ CORRECT - State/Province field conditionally visible based on country
{country === "United States" ? (
  <div className="space-y-2">
    <Label>State *</Label>
    <Select value={state} onValueChange={(val) => setState(val)}>
      <SelectTrigger className="rounded-none border-gray-300">
        <SelectValue placeholder="Select State" />
      </SelectTrigger>
      <SelectContent>
        {US_STATES.map(s => (
          <SelectItem key={s} value={s}>{s}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
) : country === "Canada" ? (
  <div className="space-y-2">
    <Label>Province *</Label>
    <Select value={state} onValueChange={(val) => setState(val)}>
      <SelectTrigger className="rounded-none border-gray-300">
        <SelectValue placeholder="Select Province" />
      </SelectTrigger>
      <SelectContent>
        {CANADIAN_PROVINCES.map(p => (
          <SelectItem key={p} value={p}>{p}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
) : (
  <div className="space-y-2">
    <Label>State/Province</Label>
    <Input
      value={state}
      onChange={(e) => setState(e.target.value)}
      placeholder="State or Province"
      className="rounded-none border-gray-300"
    />
  </div>
)}

// ❌ INCORRECT - State always visible regardless of country
<Select value={state} onValueChange={...}>
  {US_STATES.map(...)}
</Select>
```

### 3. Dynamic ZIP/Postal Code Label (RECOMMENDED)

```typescript
// ✅ CORRECT - Label changes based on country
<Label>{country === "United States" ? "ZIP Code" : "Postal Code"} *</Label>
<Input
  value={zipCode}
  onChange={(e) => setZipCode(e.target.value)}
  placeholder={country === "United States" ? "10001" : "Postal Code"}
  className="rounded-none border-gray-300"
/>
```

### 4. Address Storage Format (REQUIRED)

```typescript
// ✅ CORRECT - Pipe-delimited format
address: "123 Main Street|New York|New York|10001|United States"

// Parse address
const addressParts = address.split('|');
const street = addressParts[0] || "";
const city = addressParts[1] || "";
const state = addressParts[2] || "";
const zipCode = addressParts[3] || "";
const country = addressParts[4] || "United States";

// Update address field
const handleAddressUpdate = (index: number, value: string) => {
  const parts = address.split('|');
  parts[index] = value;
  setAddress(parts.join('|'));
};
```

---

## 📍 Where This Standard MUST Be Applied

### Current Locations Requiring Address Input:

1. ✅ **Step 3: Company Applicant** (`/components/Step3FirmCompanyApplicant.tsx`)
   - **Status**: ✅ COMPLIANT - Reference implementation
   - Residential Address fields for firm representatives
   
2. ✅ **Step 3: Beneficial Owners** (`/components/Step3BeneficialOwners.tsx`)
   - **Status**: ✅ COMPLIANT - Updated 2026-01-04
   - Residential/Business Address for beneficial owners
   - **Features**: 
     - Country dropdown with full COUNTRIES array
     - Conditional State field (dropdown for US, text input for others)
     - Dynamic ZIP/Postal Code labels
   
3. ⚠️ **Firm Profile** (`/components/FirmProfile.tsx`)
   - **Status**: ⚠️ NEEDS VERIFICATION
   - Firm business address
   - **Action Required**: Verify compliance and update if needed

4. ⚠️ **Step 2: Client Upload (Manual Entry)** (`/components/Step2ClientUpload.tsx`)
   - **Status**: ✅ VERIFIED COMPLIANT (Country of Formation field)
   - Company formation address
   - **Note**: This was recently updated and is compliant

---

## 🔧 Reference Implementation

### File: `/components/Step3FirmCompanyApplicant.tsx`

This is the **GOLD STANDARD** implementation. All other address fields should replicate this exact pattern.

**Key Features:**
- Lines 35-54: Complete COUNTRIES array
- Line 157: Parse address from pipe-delimited string
- Lines 409-441: Street, City, State (conditional), ZIP, Country fields
- Lines 420-440: Conditional State field logic
- Lines 444-451: Dynamic ZIP/Postal Code label
- Lines 453-465: Country dropdown implementation

**Visual Reference:**
![Address Field Pattern](figma:asset/309499652f74ab125dff10567d045700dd29b8d0.png)

---

## 🚨 Common Mistakes to Avoid

### ❌ Mistake #1: Country as Text Input
```typescript
// WRONG
<Input value={country} onChange={...} placeholder="Country" />
```

### ❌ Mistake #2: State Always Visible
```typescript
// WRONG
<Select value={state} ...>
  {US_STATES.map(...)}
</Select>
```

### ❌ Mistake #3: Hard-Coded US-Only Logic
```typescript
// WRONG
<Label>ZIP Code *</Label>
<Label>State *</Label>
```

### ❌ Mistake #4: Inconsistent Address Format
```typescript
// WRONG
address: { street: "...", city: "...", state: "..." }
// CORRECT
address: "street|city|state|zipCode|country"
```

---

## ✅ Validation Checklist

Before deploying any component with address fields, verify:

- [ ] Country field is a `<Select>` dropdown with ALL countries from COUNTRIES array
- [ ] State/Province field conditionally renders based on country
- [ ] ZIP Code label changes to "Postal Code" for non-US addresses  
- [ ] Address stored as pipe-delimited string format
- [ ] State dropdown uses US_STATES array when visible
- [ ] Non-US addresses allow free-text state/province input
- [ ] Default country value is "United States"
- [ ] Address parsing correctly splits pipe-delimited format

---

## 🔄 Update Priority

**Completed:**
1. ✅ **COMPLETE**: `Step3BeneficialOwners.tsx` now follows ADDRESS_FIELD_STANDARD (2026-01-04)
2. ✅ **COMPLETE**: `Step2ClientUpload.tsx` Country of Formation field is compliant

**Immediate Action Required:**
1. **MEDIUM PRIORITY**: Verify `FirmProfile.tsx` compliance
2. **LOW PRIORITY**: Document any other address collection points

---

## 📝 Version History

- **v1.1** (2026-01-04): Expanded to include Canadian provinces and conditional province dropdowns
  - Added CANADIAN_PROVINCES array (13 provinces/territories)
  - Updated State/Province field to support US (dropdown), Canada (dropdown), and Other (text input)
  - Updated both Step3FirmCompanyApplicant and Step3BeneficialOwners
- **v1.0** (2026-01-04): Initial documentation based on Step3FirmCompanyApplicant implementation
  - Established core principles for address field standardization
  - Reference commit: Post-Country of Formation dropdown update

---

## 🎓 Training Note

**For all developers working on NYLTA.com:**

When you see a task involving address collection, STOP and read this document first. The address pattern is non-negotiable and must be consistent across the entire application. When in doubt, copy the implementation from `Step3FirmCompanyApplicant.tsx` lines 409-465.

**Questions? Check the reference implementation first. Still confused? Ask for clarification rather than guessing.**

---

## 🔗 Related Files

- Reference Implementation: `/components/Step3FirmCompanyApplicant.tsx`
- CSV Validator: `/components/AdminTools.tsx` (validates field consistency)
- Country List: Lines 35-54 in `Step3FirmCompanyApplicant.tsx`
- US States List: Lines 10-31 in `Step3FirmCompanyApplicant.tsx`
- Canadian Provinces List: Lines 33-53 in `Step3FirmCompanyApplicant.tsx`