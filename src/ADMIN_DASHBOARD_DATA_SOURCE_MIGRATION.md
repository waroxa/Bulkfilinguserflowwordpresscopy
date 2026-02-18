# Admin Dashboard Data Source Migration Guide

## 🎯 OBJECTIVE

**Current State:** Admin dashboards use mock data (`mockFirmSubmissions` array)  
**Target State:** Admin dashboards pull REAL data from HighLevel CRM in real-time

---

## 📊 CURRENT MOCK DATA LOCATIONS

### Files Using Mock Data

**`/components/AdminDashboard.tsx`**
- Line 91: `const mockFirmSubmissions: FirmSubmission[] = [...]`
- Used throughout for:
  - Revenue calculations
  - Submission lists
  - Analytics charts
  - Status distributions

**`/components/ProcessorDashboard.tsx`**
- Uses mock data for processor queue

**`/components/ChargebacksDashboard.tsx`**
- Uses mock payment records

---

## 🔄 MIGRATION STRATEGY

### Phase 1: Create HighLevel Data Fetching Functions

**File:** `/utils/highlevel.ts`

Add these new functions:

```typescript
/**
 * Fetch all bulk filing submissions from HighLevel
 * Queries contacts with "Bulk Filing Submitted" tag
 * @returns Array of FirmSubmission objects
 */
export async function fetchAllBulkFilingSubmissions(): Promise<FirmSubmission[]> {
  if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
    console.warn('HighLevel API not configured');
    return [];
  }

  try {
    // Search for all contacts with bulk filing tag
    const response = await fetch(
      `${HIGHLEVEL_API_BASE}/contacts/?locationId=${HIGHLEVEL_LOCATION_ID}&tags=Status: Bulk Filing Submitted`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
          'Version': '2021-07-28'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch submissions from HighLevel');
    }

    const data = await response.json();
    const contacts = data.contacts || [];

    // Transform HighLevel contact data to FirmSubmission format
    const submissions: FirmSubmission[] = contacts.map((contact: any) => {
      const customFields = contact.customFields || {};
      
      return {
        id: customFields.Bulk_Submission_Number || contact.id,
        firmName: contact.companyName || 'Unknown Firm',
        firmEIN: customFields.Firm_EIN || '',
        confirmationNumber: customFields.Bulk_Confirmation_Number || '',
        submittedDate: customFields.Bulk_Submission_Date || '',
        clientCount: parseInt(customFields.Bulk_Filing_Count || '0'),
        totalAmount: parseFloat(customFields.Bulk_Payment_Amount || '0'),
        status: customFields.Bulk_Submission_Status || 'Pending Review',
        paymentMethod: customFields.Bulk_Payment_Method || 'ACH',
        lastActivity: contact.dateUpdated || contact.dateAdded,
        contactName: contact.firstName + ' ' + contact.lastName,
        contactEmail: contact.email,
        contactPhone: contact.phone,
        ipAddress: customFields.Bulk_IP_Address
      };
    });

    return submissions;
  } catch (error) {
    console.error('Error fetching bulk filing submissions:', error);
    return [];
  }
}

/**
 * Fetch single submission by ID from HighLevel
 */
export async function fetchSubmissionById(submissionNumber: string): Promise<FirmSubmission | null> {
  const allSubmissions = await fetchAllBulkFilingSubmissions();
  return allSubmissions.find(s => s.id === submissionNumber) || null;
}

/**
 * Update submission status in HighLevel
 */
export async function updateSubmissionStatus(
  contactId: string,
  status: string,
  notes?: string
): Promise<boolean> {
  if (!HIGHLEVEL_API_KEY) return false;

  try {
    const updateData: any = {
      customFields: {
        Bulk_Submission_Status: status
      }
    };

    if (notes) {
      updateData.customFields.Bulk_Filing_Notes = notes;
    }

    const response = await fetch(
      `${HIGHLEVEL_API_BASE}/contacts/${contactId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
          'Version': '2021-07-28'
        },
        body: JSON.stringify(updateData)
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Error updating submission status:', error);
    return false;
  }
}
```

---

### Phase 2: Update Admin Dashboard to Use Real Data

**File:** `/components/AdminDashboard.tsx`

**BEFORE (using mock data):**
```typescript
const mockFirmSubmissions: FirmSubmission[] = [
  // ... mock data
];

const thisMonthSubmissions = mockFirmSubmissions.filter(s => {
  const date = new Date(s.submittedDate);
  return date.getMonth() === thisMonth && s.status === "Paid";
});
```

**AFTER (using real data):**
```typescript
import { fetchAllBulkFilingSubmissions, updateSubmissionStatus } from '../utils/highlevel';

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [submissions, setSubmissions] = useState<FirmSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from HighLevel on component mount
  useEffect(() => {
    const loadSubmissions = async () => {
      setLoading(true);
      const data = await fetchAllBulkFilingSubmissions();
      setSubmissions(data);
      setLoading(false);
    };

    loadSubmissions();

    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(loadSubmissions, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats from real data
  const thisMonthSubmissions = submissions.filter(s => {
    const date = new Date(s.submittedDate);
    return date.getMonth() === thisMonth && s.status === "Paid";
  });

  // Rest of the calculations use 'submissions' instead of 'mockFirmSubmissions'
  const totalRevenue = submissions
    .filter(s => s.status === "Paid")
    .reduce((acc, s) => acc + s.totalAmount, 0);
}
```

---

### Phase 3: Update Approval/Rejection Functions

**BEFORE:**
```typescript
const handleApprove = (submissionId: string) => {
  console.log('Approve submission:', submissionId);
  // Mock: would update database
};
```

**AFTER:**
```typescript
const handleApprove = async (submissionId: string) => {
  try {
    // Find the submission
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    // Update in HighLevel
    const success = await updateSubmissionStatus(
      submission.contactId, // Need to add contactId to FirmSubmission interface
      'Approved',
      'Submission approved by admin'
    );

    if (success) {
      // Update local state
      setSubmissions(prev => 
        prev.map(s => 
          s.id === submissionId 
            ? { ...s, status: 'Approved' as const } 
            : s
        )
      );

      // Trigger workflows (email, payment processing, etc.)
      await triggerApprovalWorkflow(submissionId);
    }
  } catch (error) {
    console.error('Error approving submission:', error);
  }
};

const handleReject = async (submissionId: string, reason: string, notes: string) => {
  try {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    const success = await updateSubmissionStatus(
      submission.contactId,
      'Rejected',
      `Reason: ${reason}. Notes: ${notes}`
    );

    if (success) {
      setSubmissions(prev => 
        prev.map(s => 
          s.id === submissionId 
            ? { ...s, status: 'Rejected' as const, rejectionReason: reason } 
            : s
        )
      );

      // Trigger rejection workflow (email notification)
      await triggerRejectionWorkflow(submissionId, reason, notes);
    }
  } catch (error) {
    console.error('Error rejecting submission:', error);
  }
};
```

---

### Phase 4: Add Loading States

```typescript
export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [submissions, setSubmissions] = useState<FirmSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllBulkFilingSubmissions();
        setSubmissions(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#00274E]" />
          <p className="mt-4 text-gray-600">Loading submissions from HighLevel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert className="bg-red-50 border-red-300 max-w-md">
          <AlertDescription>
            <p className="text-red-800 font-semibold">Error loading data</p>
            <p className="text-red-700 mt-2">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Rest of component...
}
```

---

### Phase 5: Update All Chart Data Sources

**BEFORE:**
```typescript
const statusDistributionData = [
  { name: 'Paid', value: totalPaidSubmissions, color: '#00274E' },
  { name: 'Pending Review', value: mockFirmSubmissions.filter(s => s.status === 'Pending Review').length, color: '#FFD700' },
  // ...
];
```

**AFTER:**
```typescript
const statusDistributionData = [
  { name: 'Paid', value: totalPaidSubmissions, color: '#00274E' },
  { name: 'Pending Review', value: submissions.filter(s => s.status === 'Pending Review').length, color: '#FFD700' },
  { name: 'Processing', value: processingSubmissions, color: '#6B7280' },
  { name: 'Abandoned', value: totalAbandonedSubmissions, color: '#D1D5DB' },
];

const clientVolumeData = [
  { range: '1-5', count: submissions.filter(s => s.clientCount >= 1 && s.clientCount <= 5).length },
  { range: '6-10', count: submissions.filter(s => s.clientCount >= 6 && s.clientCount <= 10).length },
  { range: '11-15', count: submissions.filter(s => s.clientCount >= 11 && s.clientCount <= 15).length },
  { range: '16-20', count: submissions.filter(s => s.clientCount >= 16 && s.clientCount <= 20).length },
  { range: '20+', count: submissions.filter(s => s.clientCount > 20).length },
];
```

---

### Phase 6: Update Firm Dashboard

**File:** `/components/Dashboard.tsx`

Add real data fetching:

```typescript
import { fetchAllBulkFilingSubmissions } from '../utils/highlevel';

export default function Dashboard() {
  const { user } = useAuth();
  const [mySubmissions, setMySubmissions] = useState<FirmSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMySubmissions = async () => {
      if (!user?.email) return;

      setLoading(true);
      const allSubmissions = await fetchAllBulkFilingSubmissions();
      
      // Filter to only this firm's submissions
      const firmSubmissions = allSubmissions.filter(
        s => s.contactEmail === user.email
      );
      
      setMySubmissions(firmSubmissions);
      setLoading(false);
    };

    loadMySubmissions();

    // Refresh every minute
    const interval = setInterval(loadMySubmissions, 60000);
    return () => clearInterval(interval);
  }, [user?.email]);

  // Rest of component uses mySubmissions...
}
```

---

### Phase 7: Update Processor Dashboard

**File:** `/components/ProcessorDashboard.tsx`

```typescript
import { fetchAllBulkFilingSubmissions, updateSubmissionStatus } from '../utils/highlevel';

export default function ProcessorDashboard() {
  const [queue, setQueue] = useState<FirmSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQueue = async () => {
      setLoading(true);
      const allSubmissions = await fetchAllBulkFilingSubmissions();
      
      // Filter to pending review status
      const pendingQueue = allSubmissions.filter(
        s => s.status === 'Pending Review'
      );
      
      setQueue(pendingQueue);
      setLoading(false);
    };

    loadQueue();

    // Refresh every 15 seconds for processors
    const interval = setInterval(loadQueue, 15000);
    return () => clearInterval(interval);
  }, []);

  // Rest of component...
}
```

---

## 🔍 DATA CONSISTENCY VERIFICATION

### Checklist for Each Dashboard

**Admin Dashboard:**
- [ ] Uses `fetchAllBulkFilingSubmissions()` not `mockFirmSubmissions`
- [ ] Updates refresh from HighLevel API every 30 seconds
- [ ] All metrics calculated from real data
- [ ] All charts use real data
- [ ] Status updates write back to HighLevel
- [ ] No localStorage dependencies

**Firm Dashboard:**
- [ ] Fetches data via HighLevel API filtered by firm email
- [ ] Shows only submissions for logged-in firm
- [ ] Real-time status updates
- [ ] No mock/cached data

**Processor Dashboard:**
- [ ] Fetches pending queue from HighLevel
- [ ] Updates refresh automatically
- [ ] Status changes write to HighLevel
- [ ] Real-time data sync

---

## 🚀 IMPLEMENTATION STEPS

### Step 1: Add HighLevel Fetching Functions
```bash
# Edit /utils/highlevel.ts
# Add fetchAllBulkFilingSubmissions()
# Add fetchSubmissionById()
# Add updateSubmissionStatus()
```

### Step 2: Update AdminDashboard.tsx
```bash
# Replace mockFirmSubmissions with useState<FirmSubmission[]>
# Add useEffect to fetch from HighLevel
# Update all references to use submissions state
# Add loading/error states
```

### Step 3: Update Dashboard.tsx (Firm)
```bash
# Add data fetching for firm submissions
# Filter by user email
# Add auto-refresh
```

### Step 4: Update ProcessorDashboard.tsx
```bash
# Add data fetching for pending queue
# Add auto-refresh
# Update status change handlers
```

### Step 5: Update ChargebacksDashboard.tsx
```bash
# Replace mock payment records with HighLevel data
# Add fetching function
```

### Step 6: Remove All Mock Data
```bash
# Delete mockFirmSubmissions array
# Delete all other mock data arrays
# Search for "mock" in codebase and verify removal
```

### Step 7: Test Everything
```bash
# Run all test cases from TEST_CASE_MANUAL.md
# Verify data consistency
# Check real-time updates
# Confirm no localStorage usage
```

---

## ⚠️ CRITICAL REQUIREMENTS

### Must Haves

1. **NO localStorage for submission data**
   - localStorage can be used for:
     - User session tokens
     - UI preferences (dark mode, etc.)
     - Temporary wizard state (in-progress bulk filing)
   - localStorage CANNOT be used for:
     - Submitted bulk filings
     - Firm profiles
     - Payment records
     - Admin data

2. **Real-time Data Sync**
   - Admin dashboard refreshes every 30 seconds
   - Firm dashboard refreshes every 60 seconds
   - Processor dashboard refreshes every 15 seconds
   - Use `setInterval` for auto-refresh

3. **HighLevel API as Source of Truth**
   - All submission data stored in HighLevel
   - All custom fields populated
   - All tags applied
   - All notes created

4. **Proper Error Handling**
   - Show user-friendly error messages
   - Retry functionality
   - Fallback UI if HighLevel unavailable

5. **Loading States**
   - Show spinner while fetching
   - Prevent actions during loading
   - Clear indication of data freshness

---

## 📊 DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                     USER SUBMITS BULK FILING                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│         submitBulkFilingToHighLevel() Function              │
│  - Generates submission number                              │
│  - Captures IP address                                      │
│  - Writes all 108 custom fields                            │
│  - Creates detailed note                                    │
│  - Adds workflow tags                                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  HIGHLEVEL CRM (Source of Truth)            │
│  - Contact record updated                                   │
│  - Custom fields populated                                  │
│  - Tags applied                                             │
│  - Workflows triggered                                      │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
             │                            │
    ┌────────▼────────┐          ┌───────▼──────────┐
    │  Admin Dashboard│          │  Firm Dashboard  │
    │  fetchAllBulk   │          │  fetchFiltered   │
    │  FilingSubmis-  │          │  ByEmail()       │
    │  sions()        │          │                  │
    │  Every 30s      │          │  Every 60s       │
    └────────┬────────┘          └───────┬──────────┘
             │                            │
             │                            │
    ┌────────▼───────────────────────────▼──────────┐
    │         REAL-TIME DATA DISPLAYED               │
    │  - Latest status                               │
    │  - Accurate metrics                            │
    │  - Live updates                                │
    └────────────────────────────────────────────────┘
```

---

## ✅ VERIFICATION CHECKLIST

Before deploying to production:

- [ ] All mock data removed from codebase
- [ ] All dashboards fetch from HighLevel API
- [ ] Auto-refresh intervals implemented
- [ ] Loading states added
- [ ] Error handling implemented
- [ ] No localStorage for critical data
- [ ] Status updates write back to HighLevel
- [ ] Test with real HighLevel account
- [ ] Verify 108 custom fields populate correctly
- [ ] Verify tags trigger workflows
- [ ] Verify notes created properly
- [ ] Test concurrent submissions
- [ ] Test admin approve/reject flows
- [ ] Test firm dashboard filtering
- [ ] Test processor queue real-time updates
- [ ] Run full test suite from TEST_CASE_MANUAL.md

---

## 🎯 SUCCESS CRITERIA

**When complete, the system should:**

1. ✅ Pull ALL submission data from HighLevel CRM
2. ✅ Display real-time updates across all dashboards
3. ✅ Have ZERO dependency on mock data
4. ✅ Have ZERO dependency on localStorage for submissions
5. ✅ Write ALL status changes back to HighLevel
6. ✅ Support concurrent users without conflicts
7. ✅ Handle HighLevel API errors gracefully
8. ✅ Show accurate, consistent data everywhere

---

**Ready to implement? Follow the steps above in order!**
