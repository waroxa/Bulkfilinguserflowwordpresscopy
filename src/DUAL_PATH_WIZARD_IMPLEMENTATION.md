# NYLTA Dual-Path Wizard Implementation Guide

## Overview
This document outlines the implementation of the compliance-ready dual-path bulk filing wizard that supports both **Disclosure Path** (beneficial ownership reporting) and **Exemption Attestation Path** using conditional step visibility.

## ✅ Components Created

### 1. Step1DecisionPoint.tsx
**Purpose:** Decision point where users select their filing path
- **Question:** "Are you submitting beneficial ownership information?"
- **Options:** 
  - Yes → Disclosure Path
  - No → Exemption Attestation Path
- **Features:**
  - Clear visual selection with radio buttons
  - Path preview showing upcoming steps
  - Compliance-safe language: "NYLTA.com records what you submit and does not determine eligibility"

### 2. Step3ExemptionCategory.tsx
**Purpose:** Exemption category selection (Exemption Path ONLY)
- **Categories (in order):**
  1. U.S.-Formed LLC
  2. Not a Reporting Company
  3. All Owners Are U.S. Persons
  4. Other Exemption (requires manual explanation)
  5. Waiting for NYDOS Guidance
- **Features:**
  - Auto-filled explanations for predefined categories
  - Editable explanation field for "Other Exemption"
  - Read-only for standard categories
  - Disclaimer: "Final filing requirements are subject to guidance from the New York Department of State"

### 3. Step4ExemptionAttestation.tsx  
**Purpose:** Signature and attestation (Exemption Path ONLY)
- **Certification Statement:**
  "By signing below, I certify under penalty of perjury that the information provided is true, correct, and complete, and that I am authorized to submit this exemption attestation on behalf of the entity."
- **Features:**
  - Draw signature OR type signature
  - Full legal name field
  - Title/position field
  - Compliance disclaimer at bottom
  - Signature canvas using react-signature-canvas

## 🔄 Filing Path Logic

### Disclosure Path Flow:
```
Step 0: Pre-Filing Survey
Step 1: Upload Client List (Filing Information)
Step 2: Decision Point → SELECT "Yes"
Step 3: Company Applicant ✅ (DISCLOSURE ONLY)
Step 4: Exemption Check (disclosure version)
Step 5: Beneficial Owners
Step 6: Review Summary
Step 7: Payment & Authorization
Step 8: Confirmation
```

### Exemption Attestation Path Flow:
```
Step 0: Pre-Filing Survey
Step 1: Upload Client List (Filing Information)
Step 2: Decision Point → SELECT "No/Exemption"
Step 3: Exemption Category ✅ (EXEMPTION ONLY - SKIPS Company Applicant)
Step 4: Exemption Attestation ✅ (EXEMPTION ONLY)
Step 5: Review Summary
Step 6: Payment & Authorization
Step 7: Confirmation
```

## 📋 Required Next Steps

### Step 1: Update App.tsx State Management
Add to the App component:
```typescript
const [filingPath, setFilingPath] = React.useState<'disclosure' | 'exemption' | null>(null);
const [exemptionCategoryData, setExemptionCategoryData] = React.useState<any>(null);
const [attestationData, setAttestationData] = React.useState<any>(null);
```

**Status:** ✅ COMPLETED

### Step 2: Update Step Titles (Dynamic Based on Path)
```typescript
const getStepTitles = () => {
  const baseSteps = [
    "Pre-Filing Survey",
    "Upload Client List",
    "Filing Path"
  ];
  
  if (!filingPath) {
    return [...baseSteps, "...", "...", "Review", "Payment", "Confirmation"];
  }
  
  if (filingPath === 'disclosure') {
    return [
      ...baseSteps,
      "Company Applicant",
      "Exemption Check",
      "Beneficial Owners",
      "Review Summary",
      "Payment",
      "Confirmation"
    ];
  } else {
    return [
      ...baseSteps,
      "Exemption Category",
      "Exemption Attestation",
      "Review Summary",
      "Payment",
      "Confirmation"
    ];
  }
};
```

### Step 3: Update Step Rendering Logic
Replace the current step rendering with conditional logic:

```typescript
{/* Main Content */}
<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {currentStep === 0 && (
    <Step0Survey onComplete={handleStep0Complete} />
  )}
  
  {currentStep === 1 && (
    <Step2ClientUpload onComplete={handleStep1Complete} onBack={handleBack} initialClients={clients} />
  )}
  
  {/* DECISION POINT - Step 2 */}
  {currentStep === 2 && (
    <Step1DecisionPoint 
      onComplete={(path) => {
        setFilingPath(path);
        setCurrentStep(3);
      }}
      onBack={handleBack}
      initialPath={filingPath}
    />
  )}
  
  {/* DISCLOSURE PATH - Steps 3-5 */}
  {currentStep === 3 && filingPath === 'disclosure' && (
    <Step2CompanyApplicant 
      clients={clients} 
      firmWorkers={firmInfo?.authorizedUsers}
      onComplete={handleStep2Complete} 
      onBack={handleBack} 
    />
  )}
  
  {currentStep === 4 && filingPath === 'disclosure' && (
    <Step3ExemptionCheck 
      clients={clients} 
      onComplete={handleStep3Complete} 
      onBack={handleBack} 
    />
  )}
  
  {currentStep === 5 && filingPath === 'disclosure' && (
    <Step3BeneficialOwners 
      clients={clients} 
      onComplete={handleStep4Complete} 
      onBack={handleBack} 
    />
  )}
  
  {/* EXEMPTION PATH - Steps 3-4 */}
  {currentStep === 3 && filingPath === 'exemption' && (
    <Step3ExemptionCategory 
      onComplete={(data) => {
        setExemptionCategoryData(data);
        setCurrentStep(4);
      }}
      onBack={handleBack}
      initialData={exemptionCategoryData}
    />
  )}
  
  {currentStep === 4 && filingPath === 'exemption' && (
    <Step4ExemptionAttestation 
      onComplete={(data) => {
        setAttestationData(data);
        setCurrentStep(5);
      }}
      onBack={handleBack}
      initialData={attestationData}
    />
  )}
  
  {/* SHARED STEPS - Review, Payment, Confirmation */}
  {/* Disclosure path: step 6-8, Exemption path: step 5-7 */}
  {((currentStep === 6 && filingPath === 'disclosure') || (currentStep === 5 && filingPath === 'exemption')) && (
    <Step4ReviewSummary 
      clients={clients} 
      filingPath={filingPath}
      exemptionData={filingPath === 'exemption' ? {
        category: exemptionCategoryData,
        attestation: attestationData
      } : null}
      onComplete={handleStep5Complete} 
      onBack={handleBack} 
    />
  )}
  
  {((currentStep === 7 && filingPath === 'disclosure') || (currentStep === 6 && filingPath === 'exemption')) && (
    <Step5Payment 
      paymentSelection={paymentSelection} 
      firmInfo={firmInfo!}
      onComplete={handleStep6Complete} 
      onBack={handleBack} 
    />
  )}
  
  {((currentStep === 8 && filingPath === 'disclosure') || (currentStep === 7 && filingPath === 'exemption')) && (
    <Step6Confirmation 
      data={confirmationData}
      filingPath={filingPath}
    />
  )}
</main>
```

### Step 4: Update Review Summary Component
Modify `Step4ReviewSummary.tsx` to display different information based on filing path:

**For Disclosure Path:**
- Company details
- Company Applicant information
- Beneficial Owners list
- Exemption check results

**For Exemption Path:**
- Company details
- Exemption category selected
- Exemption explanation
- Attestation signature preview
- Attester name and title

### Step 5: Update Confirmation Component
Modify `Step6Confirmation.tsx` to show path-specific confirmation:

**For Disclosure Path:**
- "Beneficial Ownership Disclosure Submitted"
- Company applicant summary
- Beneficial owners count

**For Exemption Path:**
- "Exemption Attestation Submitted"
- Exemption category
- Attester information
- Disclaimer: "Final filing requirements are subject to guidance from the New York Department of State"

### Step 6: Add Package Dependency
Install react-signature-canvas for signature drawing:
```bash
npm install react-signature-canvas
npm install --save-dev @types/react-signature-canvas
```

**Note:** The package is already imported in the code and will be auto-installed by the platform.

## 🚫 Non-Negotiable Rules (Enforced)

### ✅ Language Compliance
- ❌ NEVER use: "You are exempt", "No filing required", "NYLTA confirms you qualify"
- ✅ ALWAYS use: "You are submitting...", "Based on information you provide", "NYLTA.com records what you submit"

### ✅ Component Visibility
- **Company Applicant** appears ONLY in Disclosure Path (Step 3 after "Yes" selection)
- **Company Applicant** NEVER appears in Exemption Path
- **Exemption Category** appears ONLY in Exemption Path (Step 3 after "No" selection)
- **Exemption Attestation** appears ONLY in Exemption Path (Step 4)

### ✅ Disclaimers
All exemption-related steps include:
> "Final filing requirements are subject to guidance from the New York Department of State."

### ✅ Single Wizard Shell
- No duplicate flows - one wizard with conditional step visibility
- Same header, footer, progress bar throughout
- Step numbers adjust based on path (Disclosure: 9 steps, Exemption: 8 steps)

## 🎨 Design Adherence

### Colors
- Primary Navy: `#00274E`
- Accent Yellow: `#fbbf24`
- Hover Yellow: `#f59e0b`
- White backgrounds with gray borders

### Typography
- Headings: `font-family: 'Libre Baskerville, serif'`
- Body text: `font-family: 'Poppins, sans-serif'`

### Components
- Squared buttons: `rounded-none`
- Squared inputs: `rounded-none`
- Sharp cards: `rounded-none`
- Border style: `border-2` for emphasis, `border` for standard

## 📊 Session Storage Updates

Add to save exemption path data:
```typescript
React.useEffect(() => {
  if (filingPath) {
    sessionStorage.setItem('nylta_filingPath', filingPath);
  }
  if (exemptionCategoryData) {
    sessionStorage.setItem('nylta_exemptionCategory', JSON.stringify(exemptionCategoryData));
  }
  if (attestationData) {
    sessionStorage.setItem('nylta_attestationData', JSON.stringify(attestationData));
  }
}, [filingPath, exemptionCategoryData, attestationData]);
```

Load on mount:
```typescript
const savedFilingPath = sessionStorage.getItem('nylta_filingPath');
const savedExemptionCategory = sessionStorage.getItem('nylta_exemptionCategory');
const savedAttestation = sessionStorage.getItem('nylta_attestationData');

if (savedFilingPath) setFilingPath(savedFilingPath as 'disclosure' | 'exemption');
if (savedExemptionCategory) setExemptionCategoryData(JSON.parse(savedExemptionCategory));
if (savedAttestation) setAttestationData(JSON.parse(savedAttestation));
```

## 🧪 Testing Checklist

### Disclosure Path Test
- [ ] Survey completes → advances to Client Upload
- [ ] Client Upload saves clients → advances to Decision Point
- [ ] Select "Yes" → advances to Company Applicant (Step 3)
- [ ] Company Applicant visible and functional
- [ ] Advances to Exemption Check → Beneficial Owners → Review → Payment → Confirmation
- [ ] Back button works at each step
- [ ] Progress bar shows correct steps
- [ ] Step indicators show 9 total steps

### Exemption Path Test
- [ ] Survey completes → advances to Client Upload
- [ ] Client Upload saves clients → advances to Decision Point
- [ ] Select "No/Exemption" → advances to Exemption Category (Step 3)
- [ ] Company Applicant is HIDDEN and skipped
- [ ] Exemption Category selection works
- [ ] Auto-explanation fills for standard categories
- [ ] "Other Exemption" requires manual explanation
- [ ] Advances to Exemption Attestation
- [ ] Signature canvas works (draw mode)
- [ ] Typed signature works (type mode)
- [ ] Name and title fields validate
- [ ] Advances to Review → Payment → Confirmation
- [ ] Back button works at each step
- [ ] Progress bar shows correct steps
- [ ] Step indicators show 8 total steps

### Language Compliance Test
- [ ] No "you are exempt" language anywhere
- [ ] All disclaimers present in exemption steps
- [ ] "NYLTA.com does not determine eligibility" appears on Decision Point
- [ ] "Final filing requirements subject to NYDOS guidance" appears on exemption steps

## 📝 Summary

This dual-path wizard implementation provides:
1. ✅ **Conditional step visibility** - same wizard shell, different paths
2. ✅ **Compliance-safe language** - no legal determinations
3. ✅ **Company Applicant isolation** - only in Disclosure path
4. ✅ **Professional design** - matches NYLTA.com aesthetic
5. ✅ **Signature attestation** - draw or type signature
6. ✅ **Category-based exemptions** - with auto-fill explanations
7. ✅ **Proper disclaimers** - NYDOS guidance notice

**Status:** Components created. Ready for App.tsx integration and step rendering logic updates.
