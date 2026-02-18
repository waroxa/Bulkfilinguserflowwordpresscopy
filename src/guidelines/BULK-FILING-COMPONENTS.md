# NYLTA.com Bulk Filing Components Documentation

## Overview
This document covers 5 new components built for the NYLTA.com bulk filing system, including download management, ACH payment processing, and admin transcript uploads.

---

## 🎯 How to Access the Demo

### Method 1: Direct URL
Add `#demo` to the URL:
```
https://your-app-url.com/#demo
```

### Method 2: From Code
The demo automatically loads when the URL hash is `#demo`.

---

## 1️⃣ Download Manager Component

### Purpose
Allows users to select multiple client filings and download them as PDFs in batch.

### File Location
`/components/DownloadManager.tsx`

### Features
- **Dynamic Counter**: Shows "X selected out of Y" clients
- **Bulk Selection**: Select All / Deselect All buttons
- **Status Badges**: Filed, Processing, Pending with color coding
- **Checkbox Selection**: Click row or checkbox to select
- **Batch Download**: Download multiple PDFs at once
- **PDF Generation**: Includes NYLTA header, logo, and filing data

### Props Interface
```typescript
interface DownloadManagerProps {
  clients: Client[];
  onDownload?: (selectedIds: string[]) => void;
}

interface Client {
  id: string;
  clientName: string;
  entityName: string;
  ein: string;
  status: "Filed" | "Processing" | "Pending";
  filedDate?: string;
  confirmationNumber?: string;
}
```

### Usage Example
```tsx
import DownloadManager from "./components/DownloadManager";

<DownloadManager 
  clients={clientList}
  onDownload={(selectedIds) => {
    console.log("Downloading:", selectedIds);
  }}
/>
```

### PDF Contents
Each downloaded PDF includes:
- NYLTA.com header and logo
- Client name and entity name
- EIN and status
- Filed date and confirmation number
- Timestamp of generation
- Filing platform details

### Styling
- **Table Layout**: Clean, bordered table with hover effects
- **Color Coding**: 
  - Filed: Green badges
  - Processing: Yellow badges
  - Pending: Gray badges
- **Navy Action Button**: Primary download button in NYLTA navy
- **Selected Row Highlight**: Blue background for selected items

---

## 2️⃣ Client PDF Download Card

### Purpose
Individual card-style component for downloading a single client's filing record.

### File Location
`/components/ClientPDFDownloadCard.tsx`

### Features
- **Card Layout**: Professional card design with icon
- **Status Display**: Visual status badges
- **NYDOS Confirmation**: Shows confirmation number when available
- **Beneficial Owner Count**: Displays number of beneficial owners
- **Individual Download**: Downloads comprehensive PDF for single client

### Props Interface
```typescript
interface ClientPDFDownloadCardProps {
  clientName: string;
  businessName: string;
  nydosConfirmation?: string;
  dateFiled?: string;
  status: "Filed" | "In Review" | "Pending";
  beneficialOwners?: Array<{
    name: string;
    dob: string;
    address: string;
  }>;
  onDownload?: () => void;
}
```

### Usage Example
```tsx
import ClientPDFDownloadCard from "./components/ClientPDFDownloadCard";

<ClientPDFDownloadCard
  clientName="John Smith"
  businessName="Tech Innovations LLC"
  nydosConfirmation="NYDOS-2025-112501"
  dateFiled="November 25, 2025"
  status="Filed"
  beneficialOwners={[
    { name: "John Smith", dob: "1980-05-15", address: "123 Main St, NY" }
  ]}
/>
```

### PDF Contents
- NYLTA.com logo and header
- Client and business information
- NYDOS confirmation number
- Filing date and status
- Timestamp
- **Complete beneficial owner details**:
  - Full name
  - Date of birth
  - Full address
- Contact information and support details

### Layout
- **Icon Section**: Navy square with FileText icon
- **Info Section**: Name, business, status, dates
- **Action Section**: Full-width download button
- **Hover Effect**: Card border changes to navy on hover

---

## 3️⃣ ACH Payment Form

### Purpose
Secure ACH-only payment form for bulk filing submissions with full authorization.

### File Location
`/components/ACHPaymentForm.tsx`

### Features
- **Two-Column Layout**: Form on left, agreement summary on right
- **Bank Account Fields**: Company name, routing, account number
- **Confirmation Field**: Re-enter account number for verification
- **Billing Address**: Full address capture
- **Authorized Signer**: Name and title fields
- **Required Checkboxes**: ACH agreement and terms of service
- **Initials Authorization**: Required initials field for electronic signature
- **Collapsible Agreement**: View full terms in sidebar
- **Form Validation**: Real-time error checking
- **Security Notice**: NACHA-compliant messaging

### Props Interface
```typescript
interface ACHPaymentFormProps {
  totalAmount: number;
  clientCount: number;
  onSubmit?: (data: ACHFormData) => void;
}

interface ACHFormData {
  companyAccountName: string;
  routingNumber: string;
  accountNumber: string;
  accountNumberConfirm: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  authorizedSignerName: string;
  authorizedSignerTitle: string;
  initials: string;
  agreedToACH: boolean;
  agreedToTerms: boolean;
}
```

### Usage Example
```tsx
import ACHPaymentForm from "./components/ACHPaymentForm";

<ACHPaymentForm
  totalAmount={3582.00}
  clientCount={5}
  onSubmit={(data) => {
    // Process ACH payment
    console.log("Payment data:", data);
  }}
/>
```

### Form Sections

#### 1. Payment Summary (Top)
- Navy gradient card
- Large dollar amount display
- Shield icon
- Client count

#### 2. Bank Account Information
- Company account name
- Routing number (9 digits, numeric only)
- Account number (masked password field)
- Re-enter account number (validation)

#### 3. Billing Address
- Street address
- City, State, ZIP
- Default state: NY

#### 4. Authorized Signer
- Full legal name
- Title (President, CFO, etc.)

#### 5. Authorization Checkboxes
**ACH Agreement Checkbox:**
- Text: "I have read and agree to the Bulk Service / ACH Authorization Agreement"
- Required initials field below
- Placeholder: "Enter initials"
- Max length: 4 characters
- Auto-uppercase

**Terms Checkbox:**
- Text: "I have read and agree to the Terms of Service and Privacy Policy"
- Links to terms documents

#### 6. Submit Button
- Full width
- Lock icon
- Shows total amount
- Text: "Authorize ACH Payment - $X,XXX.XX"

### Validation Rules
- Company account name: Required
- Routing number: Exactly 9 digits
- Account number: Required, minimum 4 characters
- Account number confirmation: Must match account number
- Authorized signer name: Required
- Authorized signer title: Required
- Initials: Required
- ACH agreement: Must be checked
- Terms agreement: Must be checked

### Error Handling
- Red border on invalid fields
- Error messages below each field
- Validation on blur and submit
- Clear errors when user types

---

## 4️⃣ ACH Authorization Agreement

### Purpose
Legal agreement integrated into the payment form, viewable in collapsible sidebar.

### Location
Integrated into `/components/ACHPaymentForm.tsx` (right sidebar)

### Features
- **Collapsible Panel**: Show/hide full agreement
- **Bullet Summary**: Key points when collapsed
- **Full Text**: Complete agreement when expanded
- **Sticky Sidebar**: Stays visible while scrolling
- **NACHA Badge**: Compliance indicator

### Agreement Content

#### Full Agreement Sections:
1. **Authorization to Debit**
   - Client authorizes NYLTA.com to debit provided bank account
   - Covers all selected filings

2. **Payment Terms**
   - Full payment due at submission
   - Batch submissions supported

3. **Data Accuracy**
   - Client responsible for accurate data
   - Review requirements

4. **Returned ACH Fee**
   - $25 fee for returned transactions
   - Automatic assessment

5. **Revocation**
   - 10 days written notice required
   - Email to support@nylta.com

6. **Electronic Signature**
   - Initials capture
   - Timestamp recording
   - Account last 4 digits
   - Constitutes legal authorization

#### Collapsed View (Bullet Points):
- ✓ Authorization to debit client bank account
- ✓ Full payment due at submission
- ✓ Batch submissions supported
- ✓ Client responsible for accurate data
- ✓ Returned ACH fee: $25
- ✓ 10-day notice for revocation

### Legal Entity
**New Way Enterprise LLC d/b/a NYLTA.com**

### Implementation Notes
- Full legal text available in confirmation email
- PDF download after authorization
- Electronic signature captured:
  - User initials
  - Timestamp
  - Account last 4 digits (for verification)
  - IP address (backend)

---

## 5️⃣ Admin Transcript Upload Manager

### Purpose
Admin interface for uploading government confirmation transcripts that appear in user dashboards.

### File Location
`/components/AdminTranscriptUpload.tsx`

### Features
- **Stats Dashboard**: Overview cards showing totals
- **Upload Manager Table**: Client list with upload status
- **File Validation**: PDF only, max 10MB
- **Replace Functionality**: Update existing transcripts
- **Remove Option**: Delete uploaded files with confirmation
- **Timestamp Tracking**: Shows when and who uploaded
- **Automatic User Display**: Transcripts appear in user dashboard immediately

### Props Interface
```typescript
interface AdminTranscriptUploadProps {
  clients: Client[];
  onFileUpload?: (clientId: string, file: File) => void;
  onFileRemove?: (clientId: string) => void;
}

interface Client {
  id: string;
  clientName: string;
  companyName: string;
  status: "Filed" | "Awaiting Transcript" | "Pending";
  uploadedFile?: {
    name: string;
    uploadedAt: string;
    uploadedBy: string;
  };
}
```

### Usage Example
```tsx
import AdminTranscriptUpload from "./components/AdminTranscriptUpload";

<AdminTranscriptUpload
  clients={clientList}
  onFileUpload={(clientId, file) => {
    // Handle file upload to backend
    console.log("Upload:", clientId, file);
  }}
  onFileRemove={(clientId) => {
    // Handle file removal
    console.log("Remove:", clientId);
  }}
/>
```

### Stats Cards (Top Row)
1. **Total Clients**: Count of all clients
2. **Transcripts Uploaded**: Filed count (green)
3. **Awaiting Transcript**: Pending uploads (yellow)
4. **Pending Filing**: Not yet filed (gray)

### Upload Table Columns
1. **Client Name**: Individual's name
2. **Company Name**: Business entity name
3. **Status**: Badge showing current state
4. **Uploaded File**: 
   - Shows "None" if not uploaded
   - Shows filename, timestamp, uploader if uploaded
5. **Actions**:
   - "Upload Transcript (PDF)" button if none
   - "Replace File" + "Remove" buttons if uploaded

### File Validation
- **Accepted Format**: PDF only (`application/pdf`)
- **Maximum Size**: 10MB
- **Error Handling**: Alerts for invalid files
- **Upload Simulation**: 1.5 second delay (replace with real upload)

### Status Flow
1. **Pending** → Client not yet filed
2. **Awaiting Transcript** → Filed, waiting for upload
3. **Filed** → Transcript uploaded and available

### Visual Indicators
- **Green Background**: Rows with uploaded transcripts
- **File Icon**: Green checkmark for uploaded files
- **Loading State**: "Uploading..." text during upload
- **Confirmation Modal**: "Are you sure?" on remove

### User Dashboard Integration
Once admin uploads a transcript:
- File automatically appears in user's dashboard
- User can download their official confirmation
- Shows filename and upload date
- Available immediately (no delay)

---

## 🎨 Design System

### Color Palette
- **Navy**: #00274E (primary brand color)
- **Yellow**: #FFD700 (accents, borders)
- **Green**: Success states (filed, uploaded)
- **Yellow/Amber**: Warning states (processing, awaiting)
- **Gray**: Neutral states (pending)
- **White**: Backgrounds
- **Red**: Errors and removals

### Typography
- **Headings**: Libre Baskerville (serif, professional)
- **Body**: ui-sans-serif (clean, readable)
- **Monospace**: EINs, routing numbers, account numbers

### Button Styles
- **Primary**: Navy background, white text, squared corners
- **Secondary**: White background, navy border
- **Danger**: Red text/border for remove actions
- **Disabled**: Gray background, cursor-not-allowed

### Status Badges
All badges use `rounded-none` for squared appearance:
- **Filed**: `bg-green-100 text-green-800 border-green-300`
- **Processing/In Review**: `bg-yellow-100 text-yellow-800 border-yellow-300`
- **Pending/Awaiting**: `bg-gray-100 text-gray-800 border-gray-300`

### Card Borders
- Standard cards: `border-2 border-gray-300`
- Primary cards: `border-2 border-[#00274E]`
- Success cards: `border-2 border-green-300`
- Warning cards: `border-2 border-yellow-300`
- Info cards: `border-2 border-blue-200`

### Border Accents
Key sections use yellow border accent:
- `border-b-4 border-yellow-400` for card headers
- Matches NYLTA branding guidelines

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (single column)
- **Tablet**: 768px - 1024px (adapted layouts)
- **Desktop**: > 1024px (full multi-column)

### Mobile Adaptations
- Tables become scrollable
- Two-column forms become single column
- Cards stack vertically
- Sidebar moves below main content (ACH form)
- Reduced padding on smaller screens

### Grid Layouts
- Stats cards: 1 column mobile, 4 columns desktop
- PDF download cards: 1 column mobile, 2 columns desktop
- ACH form: 1 column mobile, 3-column desktop (2 col form + 1 col sidebar)

---

## 🔐 Security Considerations

### ACH Payment Form
- **Password Fields**: Account number masked on entry
- **Confirmation Required**: Must re-enter account number
- **No Storage**: Do not store account numbers client-side
- **HTTPS Required**: SSL/TLS for transmission
- **PCI Compliance**: Follow PCI-DSS if applicable
- **Session Timeout**: Clear sensitive data on timeout

### Data Handling
- ⚠️ **Sensitive Data**: Account numbers, routing numbers, SSNs
- ⚠️ **PII**: Names, DOB, addresses in beneficial owner data
- ✅ **Encryption**: All sensitive data must be encrypted in transit and at rest
- ✅ **Access Control**: Role-based permissions for admin uploads
- ✅ **Audit Trail**: Log all file uploads, downloads, and transactions

### File Upload Security
- Validate file types server-side (not just client-side)
- Scan uploaded files for malware
- Store files in secure location
- Generate unique filenames (prevent overwriting)
- Limit file sizes (prevent DoS)
- Authenticate admin users before allowing uploads

---

## 🧪 Testing Checklist

### Download Manager
- [ ] Select individual clients via checkbox
- [ ] Select individual clients via row click
- [ ] Select All functionality
- [ ] Deselect All functionality
- [ ] Counter updates correctly
- [ ] Download button disabled when none selected
- [ ] Download button shows correct count
- [ ] PDFs generate with correct data
- [ ] PDFs download successfully
- [ ] Status badges display correctly
- [ ] Table responsive on mobile

### Client PDF Download Card
- [ ] Card displays all information correctly
- [ ] Status badge matches client status
- [ ] NYDOS confirmation shows/hides appropriately
- [ ] Beneficial owner count accurate
- [ ] Download button triggers PDF generation
- [ ] PDF includes complete beneficial owner details
- [ ] Card hover effect works
- [ ] Responsive layout on mobile

### ACH Payment Form
- [ ] Form validation works on all fields
- [ ] Routing number accepts only 9 digits
- [ ] Account number is masked
- [ ] Account number confirmation validates match
- [ ] Initials field auto-uppercases
- [ ] Checkboxes required before submit
- [ ] Error messages display correctly
- [ ] Error messages clear when user types
- [ ] Agreement expands/collapses
- [ ] Submit button shows correct amount
- [ ] Form submission triggers callback
- [ ] Two-column layout responsive
- [ ] Mobile layout stacks properly
- [ ] Security notice displays

### Admin Transcript Upload
- [ ] Stats cards calculate correctly
- [ ] File upload accepts PDF only
- [ ] File upload rejects files > 10MB
- [ ] File upload shows loading state
- [ ] Uploaded file displays with metadata
- [ ] Replace button works for uploaded files
- [ ] Remove button shows confirmation
- [ ] Remove button deletes file
- [ ] Status changes after upload
- [ ] Row highlighting works for uploaded
- [ ] Table responsive on mobile
- [ ] Instructions card displays

---

## 🚀 Implementation Guide

### Step 1: Install Components
Copy these files to your project:
```
/components/DownloadManager.tsx
/components/ClientPDFDownloadCard.tsx
/components/ACHPaymentForm.tsx
/components/AdminTranscriptUpload.tsx
/components/BulkFilingDemo.tsx (optional demo)
```

### Step 2: Backend Integration

#### For Download Manager:
```typescript
// Replace mock PDF generation with real backend call
const handleDownload = async (selectedIds: string[]) => {
  const response = await fetch('/api/download-pdfs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientIds: selectedIds })
  });
  
  const blob = await response.blob();
  // Trigger download
};
```

#### For ACH Payment:
```typescript
// Process ACH payment securely on backend
const handleACHSubmit = async (formData: ACHFormData) => {
  const response = await fetch('/api/process-ach-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...formData,
      // Add additional security tokens
      timestamp: new Date().toISOString(),
      ipAddress: await getClientIP()
    })
  });
  
  return response.json();
};
```

#### For Transcript Upload:
```typescript
// Upload file to secure storage
const handleFileUpload = async (clientId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('clientId', clientId);
  
  const response = await fetch('/api/upload-transcript', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};
```

### Step 3: Environment Variables
```env
# Add to .env file
VITE_API_BASE_URL=https://api.nylta.com
VITE_ACH_PROCESSOR_URL=https://payments.nylta.com
VITE_FILE_STORAGE_URL=https://storage.nylta.com
```

### Step 4: Add to Routing
```typescript
// In your routing file
import DownloadManager from './components/DownloadManager';
import ACHPaymentForm from './components/ACHPaymentForm';
import AdminTranscriptUpload from './components/AdminTranscriptUpload';

// User routes
<Route path="/downloads" element={<DownloadManager />} />
<Route path="/payment" element={<ACHPaymentForm />} />

// Admin routes
<Route path="/admin/transcripts" element={<AdminTranscriptUpload />} />
```

---

## 📦 Dependencies

All components use existing NYLTA UI components:
- `./components/ui/button`
- `./components/ui/card`
- `./components/ui/input`
- `./components/ui/label`
- `./components/ui/checkbox`
- `./components/ui/badge`
- `./components/ui/table`
- `lucide-react` (icons)

No additional npm packages required!

---

## 🔄 Future Enhancements

### Phase 2 Features
1. **Real PDF Generation**: Use jsPDF or pdfmake for formatted PDFs
2. **Batch ZIP Download**: Download all selected as single ZIP file
3. **Email Delivery**: Option to email PDFs instead of download
4. **Advanced Filters**: Filter by date, status, amount
5. **Bulk Actions**: Bulk status updates, bulk notifications
6. **Transcript Preview**: Preview uploaded transcripts before saving
7. **Version History**: Track multiple versions of transcripts
8. **Digital Signatures**: Add cryptographic signatures to PDFs

### Phase 3 Features
1. **Webhook Integration**: Notify external systems of uploads
2. **API Documentation**: OpenAPI/Swagger docs
3. **Multi-payment Options**: Credit card, wire transfer
4. **Recurring Payments**: Subscription-based bulk filing
5. **White-label Options**: Customizable branding
6. **International Support**: Multi-currency, multi-language

---

## 📞 Support

### For Questions:
- Email: support@nylta.com
- Phone: 1-800-NYLTA-00

### For Bug Reports:
- Include component name
- Provide steps to reproduce
- Include browser/device information
- Attach screenshots if applicable

---

**Document Version**: 1.0  
**Last Updated**: November 28, 2025  
**Components**: 5 (All Complete ✅)  
**Maintained By**: NYLTA.com Development Team
