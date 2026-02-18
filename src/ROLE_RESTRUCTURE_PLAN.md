# Role Restructuring Plan

## ✅ COMPLETED
- Removed "Accounts" tab from Super Admin dashboard
- Updated navigation from 6 tabs to 5 tabs (grid-cols-6 → grid-cols-5)

## 📋 ROLE STRUCTURE

### Super Admin (Tiffany)
**Purpose:** Platform administration - manages FIRMS only
**Key Permissions:**
- ✅ View firm profiles (created via signup)
- ✅ Manage billing
- ✅ View all filings
- ✅ Platform configuration (pricing, settings)
- ✅ Access statistics
- ❌ NO employee account management (manager handles this)

### Manager (Ryan De Freitas)
**Purpose:** Team management - assigns work to processors
**Key Permissions:**
- ✅ View firm profiles
- ✅ Access billing information
- ✅ View payment records
- ✅ Export authorization forms
- ✅ **CREATE employee accounts (processors/filers)**
- ✅ **ASSIGN submissions to processors**
- ❌ NO filing access
- ❌ NO platform configuration

### Processor/Filer (Filing Team Members)
**Purpose:** Execute assigned filings
**Key Permissions:**
- ✅ View assigned filings only
- ✅ Submit filings for assigned clients
- ✅ Update filing status
- ✅ Download client receipts
- ❌ NO unassigned submissions access
- ❌ NO admin settings access

## 🔄 ACCOUNT TYPE DISTINCTION

### Firm Accounts
- Created via **public signup form** (LandingPage.tsx)
- Roles: CPA, Attorney, Compliance
- Status: pending → approved → active
- Managed by: Super Admin
- Purpose: Paying customers who submit bulk filings

### Employee Accounts
- Created by **Manager** from internal dashboard
- Roles: processor_filer
- Status: active (immediate)
- Managed by: Manager
- Purpose: Internal team members who process filings

## 🛠️ IMPLEMENTATION NEEDED

### 1. Database Schema Update
Add `account_type` field to users table:
```sql
ALTER TABLE auth.users 
ADD COLUMN account_type TEXT DEFAULT 'firm';
-- Values: 'firm' | 'employee'
```

### 2. Manager Dashboard
Create `/components/ManagerDashboard.tsx`:
- View all firm submissions
- Assign submissions to processors
- Create processor accounts
- View team performance

### 3. Processor Dashboard
Update `/components/ProcessorDashboard.tsx`:
- Show only assigned submissions
- File assigned clients
- Update status
- No access to unassigned work

### 4. Super Admin Filtering
Update AdminDashboard to:
- Filter accounts where `account_type = 'firm'`
- Show only firm statistics
- Remove employee management UI

### 5. Signup Flow Update
Update signup to set:
```javascript
account_type: 'firm',
created_via: 'public_signup'
```

### 6. Manager Employee Creation
New API endpoint: `/create-employee`
```javascript
{
  email, password, firstName, lastName, role: 'processor_filer',
  account_type: 'employee',
  created_by: manager_id
}
```

## 🎯 USER FLOWS

### Firm Signs Up
1. Firm fills out signup form on LandingPage
2. Account created with `account_type: 'firm'`
3. Super Admin approves
4. Firm can login and submit bulk filings

### Manager Creates Employee
1. Manager navigates to Team Management
2. Click "Add Team Member"
3. Fill in processor details
4. Account created with `account_type: 'employee'`
5. Processor can login immediately

### Manager Assigns Work
1. Manager views pending submissions
2. Select submission
3. Click "Assign to Processor"
4. Choose processor from dropdown
5. Processor sees it in their queue

### Processor Works
1. Login as processor
2. See assigned submissions only
3. Complete filing for assigned clients
4. Mark as complete
5. Manager and firm see updated status

## 🔒 SECURITY RULES

1. Super Admin can ONLY view/manage firms
2. Manager can ONLY view/manage employees
3. Processors can ONLY view assigned work
4. No cross-account visibility
5. All actions logged for audit

## 📊 REPORTING

- Super Admin: Firm revenue, firm conversion, firm activity
- Manager: Processor performance, assignment load, completion rates
- Processor: Personal stats, assigned workload
