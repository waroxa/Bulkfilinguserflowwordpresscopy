# Add "Mark as Paid" Button to Admin Submissions Table

## Location
File: `/components/AdminDashboard.tsx`
Line: ~1475 (in the Actions column of the submissions table)

## Code to Add
Add this button BEFORE the "Upgrade" button:

```tsx
{/* Mark as Paid Button - Only for Pending Review submissions */}
{submission.status === 'Pending Review' && (
  <Button
    variant="outline"
    size="sm"
    className="border-green-500 text-green-700 hover:bg-green-50"
    onClick={() => {
      if (confirm(`Mark ${submission.firmName} as PAID?\n\nAmount: $${submission.totalAmount.toLocaleString()}\nClients: ${submission.clientCount}\n\nThis will approve the payment and update the status.`)) {
        const updatedSubmissions = submissions.map(s => 
          s.id === submission.id 
            ? { ...s, status: 'Paid' as const, reviewedBy: 'Admin', reviewedDate: new Date().toISOString() }
            : s
        );
        setSubmissions(updatedSubmissions);
        alert(`✅ Payment approved for ${submission.firmName}!`);
      }
    }}
    title="Approve payment and mark as paid"
  >
    ✓ Mark as Paid
  </Button>
)}
```

This button will:
- Only appear for submissions with status "Pending Review"
- Show green styling
- Ask for confirmation before marking as paid
- Update the submission status to "Paid" 
- Record who reviewed it and when
