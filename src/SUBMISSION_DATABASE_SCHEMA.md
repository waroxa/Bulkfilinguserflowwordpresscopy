# 🎯 NYLTA SUBMISSIONS DATABASE SCHEMA

## CRITICAL: MONITORING → FILING UPGRADE SYSTEM

This document explains how the database tracks monitoring submissions and handles upgrades to filing service.

---

## 📊 DATABASE STRUCTURE

### 1. **submission:{submissionNumber}** - MAIN SUBMISSION RECORD

**Purpose:** Stores all submission data (monitoring or filing)

**Key Fields:**
```javascript
{
  // Basic Info
  submissionNumber: "NYLTA-20240205-ABC123",
  userId: "user-uuid-here",
  firmName: "Firm Name",
  serviceType: "monitoring" | "filing",
  
  // Client Data
  clientCount: 10,
  clients: [
    {
      llcName: "Company ABC LLC",
      nyDosId: "123456",
      ein: "12-3456789",
      // ... all client fields
    }
  ],
  
  // Status Tracking
  submittedDate: "2024-02-05T10:30:00Z",
  status: "pending" | "processing" | "completed",
  
  // Payment Info
  amountPaid: 249, // or 398 for filing
  paymentStatus: "pending" | "paid",
  paymentId: "payment:NYLTA-20240205-ABC123",
  
  // ⭐ UPGRADE TRACKING (CRITICAL)
  isUpgradeable: true, // true ONLY for monitoring submissions
  upgradedToSubmissionNumber: null, // becomes "NYLTA-xxx" when upgraded
  originalMonitoringSubmission: null, // set on filing submission if it came from upgrade
  upgradePaymentId: null, // payment:NYLTA-xxx for the upgrade transaction
  
  // Timestamps
  createdAt: "2024-02-05T10:30:00Z",
  updatedAt: "2024-02-05T10:30:00Z"
}
```

---

### 2. **payment:{submissionNumber}** - PAYMENT TRANSACTIONS

**Purpose:** Track all payment transactions (initial, upgrades, refunds)

**Key Fields:**
```javascript
{
  paymentId: "payment:NYLTA-20240205-ABC123",
  submissionNumber: "NYLTA-20240205-ABC123",
  linkedSubmissionId: "submission:NYLTA-20240205-ABC123",
  
  userId: "user-uuid-here",
  firmName: "Firm Name",
  
  // Payment Details
  serviceType: "monitoring" | "filing" | "upgrade",
  amountPaid: 249, // or 398 or 149 (for upgrade)
  paymentStatus: "pending" | "paid" | "failed",
  paymentMethod: "stripe" | "check" | "wire",
  transactionId: "stripe-txn-id",
  
  // Upgrade Tracking
  isUpgradePayment: false, // true if this is an upgrade transaction
  originalPaymentId: null, // payment:NYLTA-xxx of the original monitoring payment
  
  // Timestamps
  createdAt: "2024-02-05T10:30:00Z"
}
```

---

### 3. **monitoring_upgradeable:{userId}** - UPGRADE INDEX

**Purpose:** Quick lookup of monitoring submissions eligible for upgrade

**Key Fields:**
```javascript
{
  submissions: [
    {
      submissionNumber: "NYLTA-20240205-ABC123",
      firmName: "Firm Name",
      clientCount: 10,
      submittedDate: "2024-02-05T10:30:00Z",
      amountPaid: 249,
      isUpgraded: false // becomes true when upgraded
    }
  ]
}
```

---

## 🔄 UPGRADE WORKFLOW

### SCENARIO: Firm Submits Monitoring, Then Upgrades to Filing

#### **STEP 1: Initial Monitoring Submission**

**What happens:**
1. User pays $249 for Compliance Monitoring
2. System creates:

```javascript
// submission:NYLTA-20240205-MON001
{
  submissionNumber: "NYLTA-20240205-MON001",
  userId: "user-123",
  firmName: "ABC Accounting",
  serviceType: "monitoring",
  clientCount: 10,
  amountPaid: 249,
  paymentStatus: "paid",
  status: "completed",
  isUpgradeable: true, // ⭐ KEY FIELD
  upgradedToSubmissionNumber: null,
  originalMonitoringSubmission: null,
  clients: [...] // client data stored
}

// payment:NYLTA-20240205-MON001
{
  paymentId: "payment:NYLTA-20240205-MON001",
  submissionNumber: "NYLTA-20240205-MON001",
  linkedSubmissionId: "submission:NYLTA-20240205-MON001",
  serviceType: "monitoring",
  amountPaid: 249,
  paymentStatus: "paid",
  isUpgradePayment: false
}

// monitoring_upgradeable:user-123
{
  submissions: [
    {
      submissionNumber: "NYLTA-20240205-MON001",
      firmName: "ABC Accounting",
      clientCount: 10,
      submittedDate: "2024-02-05T10:30:00Z",
      amountPaid: 249,
      isUpgraded: false // ⭐ Shows in dashboard as upgradeable
    }
  ]
}
```

#### **STEP 2: User Decides to Upgrade to Filing**

**What happens:**
1. User clicks "Upgrade to Filing" in dashboard
2. System charges **$149** (difference between $398 and $249)
3. System creates NEW filing submission and links it:

```javascript
// NEW: submission:NYLTA-20240205-FIL001 (Filing submission)
{
  submissionNumber: "NYLTA-20240205-FIL001",
  userId: "user-123",
  firmName: "ABC Accounting",
  serviceType: "filing", // ⭐ NOW FILING
  clientCount: 10,
  amountPaid: 398, // TOTAL amount (249 + 149)
  paymentStatus: "paid",
  status: "pending", // Ready for NYDOS submission
  isUpgradeable: false, // Filing cannot be upgraded
  upgradedToSubmissionNumber: null,
  originalMonitoringSubmission: "NYLTA-20240205-MON001", // ⭐ LINK TO MONITORING
  upgradePaymentId: "payment:NYLTA-20240205-FIL001-UPGRADE",
  clients: [...] // SAME client data as monitoring
}

// UPDATED: submission:NYLTA-20240205-MON001 (Original monitoring)
{
  submissionNumber: "NYLTA-20240205-MON001",
  userId: "user-123",
  firmName: "ABC Accounting",
  serviceType: "monitoring",
  clientCount: 10,
  amountPaid: 249,
  paymentStatus: "paid",
  status: "completed",
  isUpgradeable: false, // ⭐ NO LONGER UPGRADEABLE
  upgradedToSubmissionNumber: "NYLTA-20240205-FIL001", // ⭐ LINK TO FILING
  originalMonitoringSubmission: null
}

// NEW: payment:NYLTA-20240205-FIL001-UPGRADE (Upgrade payment)
{
  paymentId: "payment:NYLTA-20240205-FIL001-UPGRADE",
  submissionNumber: "NYLTA-20240205-FIL001",
  linkedSubmissionId: "submission:NYLTA-20240205-FIL001",
  serviceType: "upgrade",
  amountPaid: 149, // ⭐ ONLY THE DIFFERENCE
  paymentStatus: "paid",
  isUpgradePayment: true, // ⭐ MARKS THIS AS UPGRADE
  originalPaymentId: "payment:NYLTA-20240205-MON001", // LINK TO ORIGINAL
  originalSubmissionId: "submission:NYLTA-20240205-MON001"
}

// UPDATED: monitoring_upgradeable:user-123
{
  submissions: [
    {
      submissionNumber: "NYLTA-20240205-MON001",
      firmName: "ABC Accounting",
      clientCount: 10,
      submittedDate: "2024-02-05T10:30:00Z",
      amountPaid: 249,
      isUpgraded: true, // ⭐ NO LONGER SHOWS AS UPGRADEABLE
      upgradedToSubmissionNumber: "NYLTA-20240205-FIL001"
    }
  ]
}
```

---

## 🚨 CRITICAL BUSINESS RULES

### ✅ **ZERO DOUBLE-CHARGING ENFORCEMENT**

**Rule:** A user can NEVER be charged twice for the same service.

**Enforcement:**
1. `isUpgradeable` field prevents showing upgrade option after upgrade
2. `upgradedToSubmissionNumber` links monitoring to filing
3. `originalMonitoringSubmission` links filing back to monitoring
4. Database checks prevent duplicate upgrade payments

**Code Example:**
```javascript
// Check if submission can be upgraded
const canUpgrade = (submission) => {
  return (
    submission.serviceType === 'monitoring' &&
    submission.isUpgradeable === true &&
    submission.upgradedToSubmissionNumber === null &&
    submission.paymentStatus === 'paid'
  );
};

// Calculate upgrade cost
const getUpgradeCost = (originalAmount) => {
  const FILING_COST = 398;
  return FILING_COST - originalAmount; // $398 - $249 = $149
};
```

---

## 📈 QUERY PATTERNS

### **Get All Monitoring Submissions for User**
```javascript
const monitoringSubmissions = await kv.getByPrefix(`submission:`);
const userMonitoring = monitoringSubmissions.filter(s => 
  s.userId === userId && 
  s.serviceType === 'monitoring'
);
```

### **Get All Upgradeable Submissions for User**
```javascript
const upgradeIndex = await kv.get(`monitoring_upgradeable:${userId}`);
const upgradeable = upgradeIndex.submissions.filter(s => !s.isUpgraded);
```

### **Get All Filing Submissions for User**
```javascript
const filingSubmissions = await kv.getByPrefix(`submission:`);
const userFilings = filingSubmissions.filter(s => 
  s.userId === userId && 
  s.serviceType === 'filing'
);
```

### **Get Upgrade History for a Submission**
```javascript
// Get original monitoring submission
const monitoring = await kv.get(`submission:${monitoringNumber}`);

// Get the filing it was upgraded to
if (monitoring.upgradedToSubmissionNumber) {
  const filing = await kv.get(`submission:${monitoring.upgradedToSubmissionNumber}`);
  const upgradePayment = await kv.get(`payment:${monitoring.upgradedToSubmissionNumber}-UPGRADE`);
  
  // Now you have complete upgrade history
}
```

---

## 💰 PRICING SUMMARY

| Service | Price | Upgrade Cost | Total If Upgraded |
|---------|-------|--------------|-------------------|
| **Compliance Monitoring** | $249 | - | $249 |
| **Bulk Filing** | $398 | - | $398 |
| **Monitoring → Filing** | $249 | +$149 | $398 |

**KEY:** Monitoring clients pay $249 first, then $149 to upgrade = $398 total (same as direct filing)

---

## ✅ IMPLEMENTATION CHECKLIST

- [x] Database schema designed
- [x] Upgrade tracking fields defined
- [x] Payment linking structure created
- [x] Double-charging prevention built in
- [ ] Create submission on wizard completion
- [ ] Update Dashboard to show upgrade options
- [ ] Build upgrade payment flow
- [ ] Test monitoring → filing upgrade
- [ ] Verify zero double-charging

---

## 🎯 NEXT STEPS

1. **Update Step6Confirmation** to create `submission:` record
2. **Update Dashboard** to show monitoring submissions with upgrade button
3. **Create Upgrade Payment Flow** to charge $149 difference
4. **Update Manager Dashboard** to see both monitoring and filing submissions
5. **Test complete workflow** from monitoring → upgrade → filing

---

**📌 This schema ensures:**
✅ All data is persisted  
✅ Zero double-charging  
✅ Complete upgrade tracking  
✅ Easy querying for dashboards  
✅ Audit trail for all transactions
