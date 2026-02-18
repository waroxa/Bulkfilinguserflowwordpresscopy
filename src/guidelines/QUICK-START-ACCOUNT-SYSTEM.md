# Quick Start: Account Approval & Onboarding System

## 🚀 How to Test the System

### Option 1: Admin Dashboard
1. Go to Landing Page
2. Click "Admin Access" 
3. Navigate to **"Accounts"** tab (new tab, 2nd from left)
4. See account management interface
5. Test Approve/Reject/View actions

### Option 2: Onboarding Demo
1. Go to URL: `#demo` (or click Bulk Filing Demo)
2. Click **"🎯 Onboarding"** tab (first tab)
3. Click blue "Simulate First-Time Login" button
4. Experience 4-step welcome wizard
5. Click through all steps or skip tutorial

---

## 📊 System Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION                        │
│  User submits account request with firm details            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 ADMIN REVIEW (New!)                         │
│  Admin Dashboard → Accounts Tab                             │
│  • View pending requests                                    │
│  • Search & filter                                          │
│  • Approve or Reject                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│   APPROVED   │          │   REJECTED   │
│              │          │              │
│ • Generate   │          │ • Send       │
│   username   │          │   rejection  │
│ • Generate   │          │   email with │
│   password   │          │   reason     │
│ • Email      │          │              │
│   credentials│          │ • Done       │
└──────┬───────┘          └──────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│              FIRST-TIME LOGIN (New!)                        │
│  User receives email → Logs in with credentials             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              WELCOME WIZARD (New!)                          │
│  4-Step Interactive Tutorial:                               │
│  1. Welcome & What You Need                                 │
│  2. How Bulk Filing Works                                   │
│  3. Key Features You'll Love                                │
│  4. Ready to Start?                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           FIRM PROFILE SETUP (Updated!)                     │
│  Step 1: Firm Information                                   │
│  • Firm details (name, EIN, address, etc.)                  │
│  • Register up to 3 workers (NEW!)                          │
│  • Agree to terms                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              READY FOR BULK FILING                          │
│  Profile Complete → Can now upload clients & file           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Components

### 1. AdminAccountManagement
**Where:** Admin Dashboard → Accounts tab  
**What:** Approve/reject accounts, manage users  
**File:** `/components/AdminAccountManagement.tsx`

**Features:**
- 📊 Stats cards (Pending/Approved/Rejected)
- 🔍 Search by firm/contact/email
- 🎯 Filter by status
- ✅ Approve with auto-credentials
- ❌ Reject with reason
- 📧 Resend credentials
- 👁️ View account details

### 2. FirstTimeUserWizard
**Where:** Pops up on first login  
**What:** 4-step welcome tutorial  
**File:** `/components/FirstTimeUserWizard.tsx`

**Steps:**
1. **Welcome** - "What you'll need" checklist
2. **How It Works** - 4-card process + pricing
3. **Features** - Worker registration, CSV upload, exemptions, payment
4. **Ready?** - Next steps checklist

### 3. FirstTimeLoginSimulator
**Where:** Bulk Filing Demo → Onboarding tab  
**What:** Test button for the wizard  
**File:** `/components/FirstTimeLoginSimulator.tsx`

---

## 📋 Data Model

```typescript
interface UserAccount {
  id: string;
  firmName: string;
  contactPerson: string;
  email: string;
  phone: string;
  professionalType: "Attorney" | "CPA" | "Compliance";
  submittedDate: string;
  status: "Pending" | "Approved" | "Rejected";
  
  // After approval:
  credentials?: {
    username: string;           // Auto-generated
    temporaryPassword: string;  // Auto-generated
    sentDate?: string;
  };
  
  // Tracking:
  firstLogin?: boolean;        // Has user logged in?
  profileComplete?: boolean;   // Has user completed profile?
  
  // Optional:
  ein?: string;
  address?: string;
  rejectionReason?: string;    // If rejected
}
```

---

## 🎨 Visual Guide

### Admin Interface

```
┌──────────────────────────────────────────────────────┐
│ 📊 Account Management                                │
├──────────────────────────────────────────────────────┤
│                                                      │
│ [Pending: 2]  [Approved: 5]  [Rejected: 1]          │
│                                                      │
│ 🔍 Search: [____________] Filter: [All Statuses ▼]  │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ Firm Name    │ Contact  │ Status    │ Actions  │  │
│ ├────────────────────────────────────────────────┤  │
│ │ Smith Law    │ J. Smith │ 🟡 Pending│ [View]   │  │
│ │              │          │           │ [✅ Approve]│
│ │              │          │           │ [❌ Reject]│
│ ├────────────────────────────────────────────────┤  │
│ │ Global CPA   │ S. Johnson│🟢Approved│ [View]   │  │
│ │              │          │ Not Logged│ [📧 Resend]│
│ │              │          │ Incomplete│           │  │
│ └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Welcome Wizard

```
┌──────────────────────────────────────────────────────┐
│ [████████████████░░░░] Step 3 of 4                   │
├──────────────────────────────────────────────────────┤
│                                                      │
│                    🚀                                │
│                                                      │
│          Key Features You'll Love                    │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐                │
│  │ 👥 Workers   │  │ 📄 CSV Upload│                │
│  │ Register 3   │  │ Bulk import  │                │
│  │ firm workers │  │ all clients  │                │
│  └──────────────┘  └──────────────┘                │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐                │
│  │ ✅ Exemptions│  │ 💳 Payment   │                │
│  │ Mark exempt  │  │ ACH or card  │                │
│  │ clients easy │  │ options      │                │
│  └──────────────┘  └──────────────┘                │
│                                                      │
│                          [Skip Tutorial] [Next →]   │
└──────────────────────────────────────────────────────┘
```

---

## ✅ Testing Checklist (Quick)

### Admin Account Management
- [ ] Open Admin Dashboard → Accounts tab
- [ ] See 3 stat cards (Pending/Approved/Rejected)
- [ ] Search for account
- [ ] Filter by status
- [ ] Click "Approve" → See credentials dialog
- [ ] Click "Reject" → Enter reason
- [ ] Click "View" → See full details
- [ ] Click "Resend" on approved account

### First-Time User Wizard
- [ ] Open Bulk Filing Demo (#demo)
- [ ] Go to "🎯 Onboarding" tab
- [ ] Click "Simulate First-Time Login"
- [ ] See wizard with progress bar
- [ ] Click "Next" through all 4 steps
- [ ] OR click "Skip Tutorial"
- [ ] Final step has "Start Firm Profile Setup" button
- [ ] Clicking button closes wizard

### Firm Profile Integration
- [ ] After wizard, user goes to Step 1: Firm Info
- [ ] Can register up to 3 workers
- [ ] Each worker has Name, Email, Title
- [ ] Can add/remove workers
- [ ] "Add Worker" shows count (X/3)
- [ ] Disabled at 3 workers

---

## 🔑 Key Features

### Auto-Generated Credentials
- **Username:** `firmname_contactname`
  - Example: `smithlaw_johnsmith`
  - Lowercase, no spaces/special chars
  
- **Password:** 12-character random
  - Uppercase + lowercase + numbers + symbols
  - Example: `Kp9$mNx2Lq4R`

### Status Tracking
- **Account Status:** Pending → Approved/Rejected
- **Login Status:** Not Logged In → Logged In
- **Profile Status:** Incomplete → Complete

### Email Notifications
- **Approval:** Sends username + password
- **Rejection:** Sends reason
- **Resend:** Re-sends credentials

---

## 🎯 Navigation Guide

### For Admins:
```
Landing Page 
  → Click "Admin Access"
    → Admin Dashboard
      → Click "Accounts" tab
        → Account Management Interface
```

### For Testing Wizard:
```
Landing Page
  → Click "Bulk Filing Demo" (or add #demo to URL)
    → Click "🎯 Onboarding" tab
      → Click "Simulate First-Time Login"
        → Wizard appears
```

### For New Users (Real Flow):
```
Email with credentials
  → Login at NYLTA.com
    → First login detected
      → Wizard auto-appears
        → Complete wizard
          → Redirected to Step 1: Firm Info
            → Complete profile
              → Ready for bulk filing
```

---

## 💡 Quick Tips

**For Admins:**
- Approve accounts within 24 hours
- Always provide clear rejection reasons
- Use "View" to see full account details before approving
- "Resend" if user didn't receive credentials

**For Users:**
- Check spam folder for credentials email
- Save your username and password
- Complete the wizard (only 2 minutes)
- Have EIN and address ready for profile setup
- Registering workers is optional but recommended

**For Developers:**
- Check sessionStorage for firstTimeUser flag
- Use #demo URL for quick testing
- All dialogs use squared buttons (rounded-none)
- Colors: Navy #00274E, Yellow for accents
- Typography: Libre Baskerville for headings

---

## 🚀 Production Deployment Notes

**Before Launch:**
1. Replace `alert()` calls with actual email sending
2. Implement password hashing (bcrypt)
3. Add password change on first login
4. Set up email service (SendGrid, AWS SES, etc.)
5. Add session management
6. Implement authentication middleware
7. Add rate limiting
8. Set up HTTPS
9. Configure email templates
10. Test email deliverability

**Security:**
- Never store passwords in plain text
- Hash all passwords with salt
- Use secure sessions
- Validate all inputs
- Sanitize user data
- Implement CSRF protection

---

## 📞 Support

**Documentation:**
- Full guide: `/guidelines/ACCOUNT-APPROVAL-AND-ONBOARDING-SYSTEM.md`
- Company applicant updates: `/guidelines/COMPANY-APPLICANT-AND-BENEFICIAL-OWNER-UPDATES.md`

**Components:**
- AdminAccountManagement: `/components/AdminAccountManagement.tsx`
- FirstTimeUserWizard: `/components/FirstTimeUserWizard.tsx`
- FirstTimeLoginSimulator: `/components/FirstTimeLoginSimulator.tsx`

**Modified Files:**
- App.tsx - Wizard integration
- AdminDashboard.tsx - Accounts tab
- BulkFilingDemo.tsx - Onboarding demo

---

**Created:** November 28, 2025  
**Version:** 1.0  
**Status:** ✅ Ready for Testing
