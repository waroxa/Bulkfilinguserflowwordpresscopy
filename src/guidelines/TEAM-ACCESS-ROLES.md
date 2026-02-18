# NYLTA.com Team Access - Role-Based Access Control

## Overview
The NYLTA.com Bulk Filing Portal now supports three distinct team access roles with specific permissions and interface views tailored to each role's responsibilities.

---

## Role Definitions

### 1. **Super Admin** (for Tiffany)
**Full platform access with all administrative privileges**

#### Access Includes:
- ✅ View all submissions (paid, pending, abandoned)
- ✅ Manage pricing settings (tiers, early bird discount)
- ✅ Email marketing campaigns
- ✅ Analytics & reporting dashboard
- ✅ User management capabilities
- ✅ Platform configuration and settings
- ✅ Revenue tracking and financial analytics
- ✅ Submission review and approval workflow

#### UI Features:
- Comprehensive admin dashboard with 5 tabs:
  - Overview (stats, charts, recent activity)
  - Submissions (all firm submissions with detailed review)
  - Statistics (revenue trends, conversion rates)
  - Email Marketing (campaign management)
  - Pricing (tier configuration, discount settings)
- Full CRUD operations on all data
- Advanced filtering and export capabilities
- Role switching capability

---

### 2. **Processor / Filer**
**Limited access to assigned clients and filing operations**

#### Access Includes:
- ✅ View **assigned clients only**
- ✅ Submit filings for assigned clients
- ✅ Update filing status
- ✅ Download client receipts
- ❌ No platform settings access
- ❌ No pricing or marketing access
- ❌ Cannot view other processors' clients

#### UI Features:
- Dedicated Processor Dashboard showing:
  - Stats overview (Total Assigned, Ready to File, Pending Review, Incomplete, Submitted)
  - Assigned clients table with:
    - LLC name, NYDOS ID, EIN
    - Filing status (Exempt/Non-Exempt)
    - Status (Ready to File, Pending Review, Data Incomplete, Submitted)
    - Assigned date
    - Actions (View, Download Receipt)
  - Search and filter functionality
  - Status-based filtering tabs
- Access restriction notice displayed prominently
- No ability to modify platform settings

#### Workflow:
1. Processor logs in and selects "Processor/Filer" role
2. Views list of clients assigned to them
3. Can filter by status: All, Ready, Pending, Incomplete, Submitted
4. Can search by LLC name, NYDOS ID, or EIN
5. Can view client details and download receipts for submitted filings
6. Cannot access pricing, analytics, or other team members' data

---

### 3. **Chargebacks 911** (for Ryan De Freitas)
**Limited access to payment and authorization documentation**

#### Access Includes:
- ✅ View authorization forms
- ✅ Access invoices & receipts
- ✅ View submission data (read-only)
- ✅ Export payment records
- ❌ No client data editing
- ❌ No platform configuration
- ❌ No access to beneficial owner or sensitive client data

#### UI Features:
- Dedicated Chargebacks Dashboard with 4 tabs:
  1. **Payment Records**
     - Payment ID, Submission ID
     - Firm name and contact email
     - Client count
     - Amount, Discount, Final Amount
     - Payment date and method
     - Status (Completed, Pending, Failed)
     - Download invoice action
  
  2. **Authorization Forms**
     - ACH authorization forms
     - Consent forms
     - Downloadable PDFs per transaction
  
  3. **Invoices**
     - Payment invoices
     - Transaction receipts
     - Dual download options (Invoice + Receipt)
  
  4. **Submission Data**
     - Basic submission information
     - Firm details
     - Transaction summary
     - Read-only view (no editing capability)

- Stats overview:
  - Total Transactions
  - Total Revenue
  - Completed Payments
  - Pending Payments
- Advanced search and filtering
- Export all records functionality
- Access restriction notice

#### Use Case:
This role is specifically designed for chargeback dispute resolution and payment verification. Ryan De Freitas can:
- Access all necessary payment documentation
- Download authorization forms to prove legitimate charges
- Export payment records for reconciliation
- View submission data to understand transaction context
- **Cannot** modify any client data or platform settings

---

## How to Access Team Dashboards

### Method 1: From Landing Page
1. Click "LOG IN / CREATE ACCOUNT"
2. In the modal, click the hidden admin access button (gray dot in footer)
3. Select your role from the Role Selector screen

### Method 2: From Dashboard
1. Log in to your account
2. Click "Admin Access" button in the header
3. Select your role from the Role Selector screen

### Role Selector Interface
The role selector displays three role cards:
- Each card shows the role name, typical user, icon, and permissions list
- Click a card to select that role
- Optionally enter your name for personalized dashboard greeting
- Click "Continue to Dashboard" to proceed

---

## Role Switching

### Super Admin
- Can switch roles using the "Switch Role" button in the header
- Returns to Role Selector screen
- Allows testing different role perspectives

### Processor/Filer & Chargebacks 911
- Can return to Role Selector using the "Back" button
- Cannot escalate privileges (security feature)

---

## Security Features

1. **Role-Based UI Rendering**: Each role sees only their permitted interface
2. **Data Isolation**: Processors only see assigned clients
3. **Read-Only Enforcement**: Chargebacks 911 cannot edit any data
4. **Action Restrictions**: UI buttons/actions only appear for permitted operations
5. **Clear Access Notices**: Each dashboard displays access restriction information

---

## Technical Implementation

### Files Created:
1. `/components/RoleSelector.tsx` - Role selection interface
2. `/components/ProcessorDashboard.tsx` - Processor/Filer dashboard
3. `/components/ChargebacksDashboard.tsx` - Chargebacks 911 dashboard

### Files Modified:
1. `/components/AdminDashboard.tsx` - Added role routing and Super Admin enhancements

### Key Features:
- Type-safe role definitions using TypeScript
- Conditional rendering based on selected role
- Mock data for demonstration (ready for backend integration)
- Responsive design matching NYLTA.com brand guidelines
- Navy (#00274E), gray, white, and yellow color scheme
- Squared buttons and professional aesthetic

---

## Future Enhancements

### Phase 2 (Backend Integration):
- [ ] Database-backed role assignment
- [ ] User authentication and session management
- [ ] Real client assignment system for processors
- [ ] Actual payment record fetching from Stripe/payment processor
- [ ] Document generation and storage (authorization forms, invoices)
- [ ] Audit logging for all role-based actions

### Phase 3 (Advanced Features):
- [ ] Role hierarchy and permission inheritance
- [ ] Custom role creation
- [ ] Multi-role assignment (e.g., Processor + Limited Admin)
- [ ] Client auto-assignment rules
- [ ] Email notifications for assigned clients
- [ ] Real-time collaboration features

---

## Testing Checklist

### Super Admin Role:
- ✅ Can access all 5 dashboard tabs
- ✅ Can view all submissions
- ✅ Can modify pricing settings
- ✅ Can switch to other roles
- ✅ Displays user name if provided

### Processor/Filer Role:
- ✅ Only sees assigned clients table
- ✅ Cannot access pricing or marketing
- ✅ Can filter and search clients
- ✅ Can view client details
- ✅ Access restriction notice visible

### Chargebacks 911 Role:
- ✅ Can view all payment records
- ✅ Can access authorization forms
- ✅ Can download invoices and receipts
- ✅ Cannot edit any data
- ✅ Export functionality works

---

## Notes for Development Team

1. **Mock Data**: All three dashboards currently use mock data. This needs to be replaced with actual API calls when backend is ready.

2. **Authentication**: The role selector is currently accessible without authentication. Implement proper authentication before production deployment.

3. **Authorization**: Frontend role checks should be mirrored on the backend to prevent unauthorized API access.

4. **Assigned Client Logic**: The processor dashboard currently shows all mock clients. Implement actual assignment logic based on user ID.

5. **Document Storage**: Authorization forms and invoices need actual file generation and secure storage implementation.

6. **Audit Trail**: Implement logging for all actions taken by each role for compliance and debugging.

---

## Support & Questions

For questions about team access roles or to request additional permissions, contact the platform administrator.

**Document Version**: 1.0  
**Last Updated**: November 28, 2025  
**Maintained By**: NYLTA.com Development Team
