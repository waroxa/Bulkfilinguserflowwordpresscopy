import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import DownloadManager from "./DownloadManager";
import ClientPDFDownloadCard from "./ClientPDFDownloadCard";
import ACHPaymentForm from "./ACHPaymentForm";
import AdminTranscriptUpload from "./AdminTranscriptUpload";
import FirstTimeLoginSimulator from "./FirstTimeLoginSimulator";
import FirstTimeUserWizard from "./FirstTimeUserWizard";

// Mock data
const mockClients = [
  {
    id: "1",
    clientName: "John Smith",
    entityName: "Tech Innovations LLC",
    ein: "12-3456789",
    status: "Filed" as const,
    filedDate: "2025-11-25",
    confirmationNumber: "NYDOS-2025-112501"
  },
  {
    id: "2",
    clientName: "Sarah Johnson",
    entityName: "Green Energy Solutions LLC",
    ein: "23-4567890",
    status: "Processing" as const
  },
  {
    id: "3",
    clientName: "Michael Brown",
    entityName: "Metro Real Estate Holdings LLC",
    ein: "34-5678901",
    status: "Filed" as const,
    filedDate: "2025-11-26",
    confirmationNumber: "NYDOS-2025-112601"
  },
  {
    id: "4",
    clientName: "Emily Davis",
    entityName: "Consulting Partners LLC",
    ein: "45-6789012",
    status: "Pending" as const
  },
  {
    id: "5",
    clientName: "David Wilson",
    entityName: "Healthcare Services Group LLC",
    ein: "56-7890123",
    status: "Filed" as const,
    filedDate: "2025-11-27",
    confirmationNumber: "NYDOS-2025-112701"
  }
];

const mockAdminClients = [
  {
    id: "1",
    clientName: "John Smith",
    companyName: "Tech Innovations LLC",
    status: "Filed" as const,
    uploadedFile: {
      name: "NYDOS_Transcript_Tech_Innovations.pdf",
      uploadedAt: "2025-11-25T10:30:00",
      uploadedBy: "Admin User"
    }
  },
  {
    id: "2",
    clientName: "Sarah Johnson",
    companyName: "Green Energy Solutions LLC",
    status: "Awaiting Transcript" as const
  },
  {
    id: "3",
    clientName: "Michael Brown",
    companyName: "Metro Real Estate Holdings LLC",
    status: "Filed" as const,
    uploadedFile: {
      name: "NYDOS_Transcript_Metro_Real_Estate.pdf",
      uploadedAt: "2025-11-26T14:15:00",
      uploadedBy: "Admin User"
    }
  },
  {
    id: "4",
    clientName: "Emily Davis",
    companyName: "Consulting Partners LLC",
    status: "Pending" as const
  },
  {
    id: "5",
    clientName: "David Wilson",
    companyName: "Healthcare Services Group LLC",
    status: "Awaiting Transcript" as const
  }
];

export default function BulkFilingDemo() {
  const [selectedTab, setSelectedTab] = useState("download-manager");
  const [showWizard, setShowWizard] = useState(false);

  const handleFirstTimeLogin = () => {
    setShowWizard(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#00274E] border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-6">
            <ImageWithFallback 
              src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
              alt="NYLTA.com Logo"
              className="h-10 sm:h-12 md:h-14 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-none"
            />
            <div className="border-l-2 border-white/30 pl-6">
              <h1 className="text-white text-3xl mb-2">Bulk Filing Components Demo</h1>
              <p className="text-gray-300">Interactive preview of all new components</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-gray-100 rounded-none border-2 border-gray-300">
            <TabsTrigger value="onboarding" className="rounded-none text-xs">
              🎯 Onboard
            </TabsTrigger>
            <TabsTrigger value="download-manager" className="rounded-none text-xs">
              1️⃣ Downloads
            </TabsTrigger>
            <TabsTrigger value="client-cards" className="rounded-none text-xs">
              2️⃣ PDF Cards
            </TabsTrigger>
            <TabsTrigger value="ach-payment" className="rounded-none text-xs">
              3️⃣ ACH Pay
            </TabsTrigger>
            <TabsTrigger value="ach-agreement" className="rounded-none text-xs">
              4️⃣ Agreement
            </TabsTrigger>
            <TabsTrigger value="admin-upload" className="rounded-none text-xs">
              5️⃣ Upload
            </TabsTrigger>
            <TabsTrigger value="admin-pdf" className="rounded-none text-xs">
              6️⃣ Admin PDF
            </TabsTrigger>
          </TabsList>

          {/* 🎯 First-Time User Onboarding */}
          <TabsContent value="onboarding" className="space-y-4">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <h3 className="text-lg text-blue-900 mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  🎯 First-Time User Onboarding System
                </h3>
                <p className="text-sm text-blue-800 mb-4">
                  Complete account approval workflow: Admin approves account → Generates credentials → User logs in for first time → Sees welcome wizard → Completes firm profile
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border-2 border-gray-300 rounded p-4">
                    <h4 className="text-base mb-2">👨‍💼 Admin Side</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✅ Review pending account requests</li>
                      <li>✅ Approve/Reject applications</li>
                      <li>✅ Auto-generate username & password</li>
                      <li>✅ Send credentials via email</li>
                      <li>✅ Track login & profile status</li>
                    </ul>
                  </div>
                  <div className="bg-white border-2 border-gray-300 rounded p-4">
                    <h4 className="text-base mb-2">👤 User Side</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✅ Receives login credentials</li>
                      <li>✅ First login triggers wizard</li>
                      <li>✅ 4-step welcome tutorial</li>
                      <li>✅ Guided to firm profile setup</li>
                      <li>✅ Can register up to 3 workers</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl mb-4" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  Simulate First-Time User
                </h3>
                <FirstTimeLoginSimulator onFirstTimeLogin={handleFirstTimeLogin} />
              </div>

              <Card className="border-2 border-gray-300">
                <CardHeader className="bg-[#00274E] text-white">
                  <CardTitle>What Happens When You Click?</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
                        1
                      </div>
                      <div>
                        <p className="text-sm"><strong>Welcome Screen</strong></p>
                        <p className="text-xs text-gray-600">Greets user, explains what's needed</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
                        2
                      </div>
                      <div>
                        <p className="text-sm"><strong>How It Works</strong></p>
                        <p className="text-xs text-gray-600">4-step filing process overview</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
                        3
                      </div>
                      <div>
                        <p className="text-sm"><strong>Key Features</strong></p>
                        <p className="text-xs text-gray-600">Worker registration, CSV upload, pricing</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
                        4
                      </div>
                      <div>
                        <p className="text-sm"><strong>Start Profile Setup</strong></p>
                        <p className="text-xs text-gray-600">Redirects to Step 1: Firm Information</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-900">Admin Account Management Features</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-800 mb-4">
                  Available in Admin Dashboard → <strong>Accounts</strong> tab
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border-2 border-purple-200 rounded p-3">
                    <h4 className="text-sm mb-2">📊 Stats Dashboard</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Pending approvals count</li>
                      <li>• Approved accounts count</li>
                      <li>• Rejected accounts count</li>
                    </ul>
                  </div>
                  <div className="bg-white border-2 border-purple-200 rounded p-3">
                    <h4 className="text-sm mb-2">🔍 Search & Filter</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Search by firm/contact/email</li>
                      <li>• Filter by status</li>
                      <li>• View detailed account info</li>
                    </ul>
                  </div>
                  <div className="bg-white border-2 border-purple-200 rounded p-3">
                    <h4 className="text-sm mb-2">⚡ Quick Actions</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Approve with auto-credentials</li>
                      <li>• Reject with reason</li>
                      <li>• Resend credentials</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 1️⃣ Download Manager */}
          <TabsContent value="download-manager" className="space-y-4">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <h3 className="text-lg text-blue-900 mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  1️⃣ Bulk Filing – Download Section (User Dashboard)
                </h3>
                <p className="text-sm text-blue-800">
                  Component allows users to select multiple client filings and download them as PDFs. 
                  Features dynamic counter, checkboxes, Select All/Deselect All, and status badges.
                </p>
              </CardContent>
            </Card>
            
            <DownloadManager 
              clients={mockClients}
              onDownload={(selectedIds) => {
                console.log("Downloading files for clients:", selectedIds);
              }}
            />
          </TabsContent>

          {/* 2️⃣ Client PDF Download Cards */}
          <TabsContent value="client-cards" className="space-y-4">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <h3 className="text-lg text-blue-900 mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  2️⃣ Individual Client PDF Download Block
                </h3>
                <p className="text-sm text-blue-800">
                  Card-style component for each client showing filing details with individual download button. 
                  PDF includes NYLTA logo, filing data, timestamp, and beneficial owner summary.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ClientPDFDownloadCard
                clientName="John Smith"
                businessName="Tech Innovations LLC"
                nydosConfirmation="NYDOS-2025-112501"
                dateFiled="November 25, 2025"
                status="Filed"
                beneficialOwners={[
                  { name: "John Smith", dob: "1980-05-15", address: "123 Main St, New York, NY 10001" },
                  { name: "Jane Doe", dob: "1985-08-22", address: "456 Oak Ave, Brooklyn, NY 11201" }
                ]}
              />

              <ClientPDFDownloadCard
                clientName="Sarah Johnson"
                businessName="Green Energy Solutions LLC"
                status="In Review"
                beneficialOwners={[
                  { name: "Sarah Johnson", dob: "1975-03-10", address: "789 Pine St, Queens, NY 11354" }
                ]}
              />

              <ClientPDFDownloadCard
                clientName="Michael Brown"
                businessName="Metro Real Estate Holdings LLC"
                nydosConfirmation="NYDOS-2025-112601"
                dateFiled="November 26, 2025"
                status="Filed"
                beneficialOwners={[
                  { name: "Michael Brown", dob: "1972-11-30", address: "321 Elm St, Manhattan, NY 10002" },
                  { name: "Lisa Brown", dob: "1978-06-18", address: "321 Elm St, Manhattan, NY 10002" },
                  { name: "Robert Chen", dob: "1983-09-25", address: "654 Cedar Ln, Bronx, NY 10451" }
                ]}
              />

              <ClientPDFDownloadCard
                clientName="Emily Davis"
                businessName="Consulting Partners LLC"
                status="Pending"
              />
            </div>
          </TabsContent>

          {/* 3️⃣ & 4️⃣ ACH Payment Form */}
          <TabsContent value="ach-payment" className="space-y-4">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <h3 className="text-lg text-blue-900 mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  3️⃣ Bulk Filing Payment Page – ACH Only
                </h3>
                <p className="text-sm text-blue-800 mb-2">
                  Secure ACH payment form with bank account details, billing address, authorized signer, 
                  and required checkboxes with initials authorization.
                </p>
                <p className="text-sm text-blue-800">
                  Right sidebar shows collapsible ACH Authorization Agreement (4️⃣) with complete terms.
                </p>
              </CardContent>
            </Card>

            <ACHPaymentForm
              totalAmount={3582.00}
              clientCount={5}
              firmName="Smith & Associates CPA Firm"
              firmAddress="123 Main Street, Suite 500, New York, NY 10001"
              onSubmit={(data) => {
                console.log("ACH Payment Submitted:", data);
              }}
            />
          </TabsContent>

          {/* 4️⃣ Agreement (shown in ACH form) */}
          <TabsContent value="ach-agreement" className="space-y-4">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <h3 className="text-lg text-blue-900 mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  4️⃣ ACH Authorization Agreement
                </h3>
                <p className="text-sm text-blue-800">
                  The agreement is integrated into the payment form (Tab 3️⃣) as a collapsible panel 
                  in the right sidebar. Click "View Agreement" to expand and read the full terms.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300">
              <CardHeader className="bg-white border-b-4 border-yellow-400">
                <CardTitle className="text-[#00274E]">ACH Authorization Agreement Content</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 text-sm">
                <div>
                  <h3 className="text-base text-[#00274E] mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                    Bulk Service / ACH Authorization Agreement
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    New Way Enterprise LLC d/b/a NYLTA.com
                  </p>

                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-900 mb-1"><strong>1. Authorization to Debit</strong></p>
                      <p className="text-gray-600">
                        Client authorizes NYLTA.com to debit the provided bank account for all selected filings.
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-900 mb-1"><strong>2. Payment Terms</strong></p>
                      <p className="text-gray-600">
                        Full payment is due at submission. Batch submissions are supported.
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-900 mb-1"><strong>3. Data Accuracy</strong></p>
                      <p className="text-gray-600">
                        Client is responsible for providing accurate data for all filings.
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-900 mb-1"><strong>4. Returned ACH Fee</strong></p>
                      <p className="text-gray-600">
                        A fee of $25 will be charged for any returned ACH transactions.
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-900 mb-1"><strong>5. Revocation</strong></p>
                      <p className="text-gray-600">
                        Authorization revocation requires 10 days written notice to support@nylta.com.
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-900 mb-1"><strong>6. Electronic Signature</strong></p>
                      <p className="text-gray-600">
                        Your initials, timestamp, and account last 4 digits will be captured as your 
                        electronic signature authorizing this transaction.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 5️⃣ Admin Transcript Upload */}
          <TabsContent value="admin-upload" className="space-y-4">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <h3 className="text-lg text-blue-900 mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  5️⃣ Admin Panel — Transcript / Government Confirmation Upload
                </h3>
                <p className="text-sm text-blue-800">
                  Admin interface for uploading government confirmation transcripts. Once uploaded, 
                  transcripts automatically appear in the user-facing dashboard for download.
                </p>
              </CardContent>
            </Card>

            <AdminTranscriptUpload
              clients={mockAdminClients}
              onFileUpload={(clientId, file) => {
                console.log("File uploaded for client:", clientId, file.name);
              }}
              onFileRemove={(clientId) => {
                console.log("File removed for client:", clientId);
              }}
            />
          </TabsContent>

          {/* 6️⃣ Admin PDF Download */}
          <TabsContent value="admin-pdf" className="space-y-4">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <h3 className="text-lg text-blue-900 mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  6️⃣ Admin Dashboard — Download Client PDF with Full Details
                </h3>
                <p className="text-sm text-blue-800 mb-4">
                  Admin-specific PDF generation that includes complete submission details, IP address, 
                  authorization information, and client data tables for compliance and record-keeping.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border-2 border-gray-300 rounded p-4">
                    <h4 className="text-base mb-2">📄 Submission Info</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Confirmation number</li>
                      <li>• Firm details & EIN</li>
                      <li>• Submit date & timestamp</li>
                      <li>• Status & payment method</li>
                      <li>• Reviewed by admin info</li>
                    </ul>
                  </div>
                  <div className="bg-white border-2 border-gray-300 rounded p-4">
                    <h4 className="text-base mb-2">🔒 Security Details</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>IP Address</strong> of submission</li>
                      <li>• Submission source</li>
                      <li>• <strong>Authorization</strong> signature</li>
                      <li>• Authorized by name</li>
                      <li>• Account last 4 digits</li>
                    </ul>
                  </div>
                  <div className="bg-white border-2 border-gray-300 rounded p-4">
                    <h4 className="text-base mb-2">📊 Client Data</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Full client list table</li>
                      <li>• Entity names & EINs</li>
                      <li>• Exempt status</li>
                      <li>• Formation dates</li>
                      <li>• Exemption reasons</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-900">Where to Find It</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white border-2 border-purple-200 rounded p-4">
                    <h4 className="text-base mb-2">📍 Admin Dashboard → Submissions Tab</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Each submission row has a <strong>Download button</strong> (📥 icon) that generates 
                      the admin-specific PDF with all compliance details.
                    </p>
                    <div className="bg-gray-50 border-2 border-gray-300 rounded p-3 font-mono text-sm">
                      <div className="flex items-center justify-between py-2 border-b">
                        <span>Smith & Associates CPA</span>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-gray-200 rounded text-xs">👁️ View</button>
                          <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs">📥 Download</button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        ↑ Click download to generate admin PDF
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-purple-200 rounded p-4">
                    <h4 className="text-base mb-2">📦 Bulk Export Available</h4>
                    <p className="text-sm text-gray-700">
                      Use the <strong>"Export All as PDF"</strong> button to generate a summary 
                      report of all filtered submissions with statistics and a table view.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-900">✅ What's Included in Admin PDF</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-base mb-2">📋 Page 1 - Submission Details</h4>
                    <div className="bg-white border-2 border-green-200 rounded p-3 text-sm">
                      <ul className="space-y-1 text-gray-700">
                        <li>✓ <strong>NYLTA Header</strong> with branding</li>
                        <li>✓ <strong>Confirmation Number</strong> & status</li>
                        <li>✓ <strong>Firm Information</strong> (name, EIN)</li>
                        <li>✓ <strong>Submission Timestamp</strong></li>
                        <li>✓ <strong>Client Count</strong> & Total Amount</li>
                        <li>✓ <strong>Payment Method</strong> (ACH/Card)</li>
                        <li>✓ <strong>Reviewed By</strong> admin name & date</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base mb-2">🔐 Page 1 - Security & Auth</h4>
                    <div className="bg-white border-2 border-green-200 rounded p-3 text-sm">
                      <ul className="space-y-1 text-gray-700">
                        <li>✓ <strong>IP Address</strong> of submission</li>
                        <li>✓ <strong>Submission Source</strong> (platform)</li>
                        <li>✓ <strong>Authorized By</strong> (signer name)</li>
                        <li>✓ <strong>Authorization Date</strong> & time</li>
                        <li>✓ <strong>Authorization Method</strong> (ACH/Card)</li>
                        <li>✓ <strong>Account Last 4 Digits</strong></li>
                      </ul>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="text-base mb-2">📊 Page 2+ - Client Data Table</h4>
                    <div className="bg-white border-2 border-green-200 rounded p-3 text-sm">
                      <p className="text-gray-700 mb-2">
                        Professional table with all client information:
                      </p>
                      <div className="bg-gray-50 border border-gray-300 rounded p-2 font-mono text-xs">
                        <div className="grid grid-cols-5 gap-2 mb-1 font-bold">
                          <div>Entity Name</div>
                          <div>EIN</div>
                          <div>Status</div>
                          <div>Formation</div>
                          <div>Exemption</div>
                        </div>
                        <div className="grid grid-cols-5 gap-2 text-gray-600">
                          <div>Tech LLC</div>
                          <div>12-345...</div>
                          <div>EXEMPT</div>
                          <div>2022-05...</div>
                          <div>Govt Entity</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-400 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-900">⚠️ Admin Use Only</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-yellow-900">
                    <strong>Important:</strong> This PDF contains sensitive information including IP addresses 
                    and authorization details. It is intended for:
                  </p>
                  <ul className="text-sm text-yellow-800 space-y-1 ml-5">
                    <li>✓ <strong>Compliance Records:</strong> Internal audit trails</li>
                    <li>✓ <strong>Legal Documentation:</strong> Proof of submission & authorization</li>
                    <li>✓ <strong>Dispute Resolution:</strong> Timestamped evidence with IP tracking</li>
                    <li>✓ <strong>Government Audits:</strong> Complete filing records with authorization</li>
                  </ul>
                  <p className="text-sm text-yellow-900 mt-3">
                    <strong>🔒 Security Note:</strong> Regular user-facing PDFs (from Download Manager or Client PDF Cards) 
                    do <strong>NOT</strong> include IP addresses or authorization details for privacy reasons.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* First-Time User Wizard Dialog */}
      <FirstTimeUserWizard 
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onStartProfile={() => {
          setShowWizard(false);
          alert("In a real application, this would redirect to Step 1: Firm Information form");
        }}
        firmName="Demo Firm LLC"
        contactName="Demo User"
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            NYLTA.com™ Bulk Filing Components • Professional Filing Service
          </p>
        </div>
      </footer>
    </div>
  );
}