# Admin Dashboard - Real Data Implementation

## Summary
Replace all `mockFirmSubmissions` references with real data from HighLevel via `submissions` state.

## Changes Made

### 1. Imports Added
```typescript
import { fetchAllBulkFilingSubmissions, updateSubmissionStatus, type FirmSubmission as HighLevelSubmission } from "../utils/highlevel";
import { Loader2 } from "lucide-react";
```

### 2. State Added
```typescript
// Real submissions data from HighLevel
const [submissions, setSubmissions] = useState<FirmSubmission[]>([]);
const [submissionsLoading, setSubmissionsLoading] = useState(true);
const [submissionsError, setSubmissionsError] = useState<string | null>(null);
```

### 3. UseEffect Added
```typescript
// Fetch real submissions from HighLevel
useEffect(() => {
  const loadSubmissions = async () => {
    try {
      setSubmissionsLoading(true);
      setSubmissionsError(null);
      console.log('📊 Loading submissions from HighLevel...');
      const data = await fetchAllBulkFilingSubmissions();
      console.log('✅ Loaded submissions:', data.length);
      setSubmissions(data);
    } catch (error: any) {
      console.error('❌ Error loading submissions:', error);
      setSubmissionsError(error.message || 'Failed to load submissions');
    } finally {
      setSubmissionsLoading(false);
    }
  };

  loadSubmissions();

  // Auto-refresh every 30 seconds for real-time updates
  const interval = setInterval(loadSubmissions, 30000);
  return () => clearInterval(interval);
}, []);
```

### 4. All mockFirmSubmissions Replacements

**BEFORE** → **AFTER**

1. Line 93: `const mockFirmSubmissions: FirmSubmission[] = [...]` → **DELETE THIS ENTIRE CONST** (lines 93-333)

2. Line 435: `mockFirmSubmissions.filter` → `submissions.filter`

3. Line 439: `mockFirmSubmissions.filter` → `submissions.filter`

4. Line 450: `mockFirmSubmissions` → `submissions`

5. Line 453: `mockFirmSubmissions.filter` → `submissions.filter`

6. Line 454: `mockFirmSubmissions.filter` → `submissions.filter`

7. Line 455: `mockFirmSubmissions.filter` → `submissions.filter`

8. Line 458: `mockFirmSubmissions.filter` → `submissions.filter`

9. Line 474: `mockFirmSubmissions.reduce` → `submissions.reduce`

10. Line 475-476: `mockFirmSubmissions.length` → `submissions.length` (appears twice)

11. Line 485: `mockFirmSubmissions.filter` → `submissions.filter`

12. Line 516: `mockFirmSubmissions.filter` → `submissions.filter`

13. Lines 522-526 (5 times): `mockFirmSubmissions.filter` → `submissions.filter`

14. Line 1040: `mockFirmSubmissions.map` → `submissions.map`

15. Line 1100: `mockFirmSubmissions.slice` → `submissions.slice`

16. Line 1631: `mockFirmSubmissions` → `submissions`

### 5. Loading State UI

Add this BEFORE the main return statement (around line 580):

```typescript
// Show loading state while fetching submissions
if (submissionsLoading) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#00274E] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Loading Dashboard...</h3>
            <p className="text-gray-600">Fetching submissions from HighLevel CRM...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Show error state if loading failed
if (submissionsError) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md border-red-300">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-red-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-red-900">Error Loading Data</h3>
            <p className="text-gray-700 mb-4">{submissionsError}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-[#00274E] hover:bg-[#003366]"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Testing Checklist

After making these changes:

- [ ] Run curl test tool to create test submissions in HighLevel
- [ ] Verify admin dashboard loads real data
- [ ] Check that statistics calculate correctly
- [ ] Verify charts display real data
- [ ] Test auto-refresh (wait 30 seconds, check console for refresh logs)
- [ ] Check that "No submissions yet" shows when HighLevel has no data
- [ ] Verify search and filtering work with real data
- [ ] Test approve/reject buttons update HighLevel
- [ ] Verify PDF generation works with real data

## Expected Behavior

**When HighLevel has NO submissions:**
- Dashboard shows $0 revenue
- 0 submissions
- Empty tables
- Charts show all zeros
- "No submissions found" messages

**When HighLevel has submissions:**
- Dashboard shows real revenue totals
- Real submission counts
- Populated tables with actual data
- Charts reflect real data
- Auto-refreshes every 30 seconds

## Verification

Run this in browser console after changes:

```javascript
// Check if using real data
console.log('Submissions loaded from HighLevel:', window.location.pathname.includes('admin'));

// Force refresh to see new data
window.location.reload();
```

## Next Steps

1. Apply all 21 replacements
2. Delete the mockFirmSubmissions const (lines 93-333)
3. Add loading/error states
4. Test with curl tool
5. Verify real-time updates
6. Check all dashboards pull from HighLevel

---

**Status:** Ready to implement  
**Files to modify:** `/components/AdminDashboard.tsx`  
**Lines to change:** 21 occurrences + 1 deletion + loading states
