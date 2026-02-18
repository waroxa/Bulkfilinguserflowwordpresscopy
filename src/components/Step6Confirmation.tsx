import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2, Download, Mail, Shield, Clock, FileCheck, HelpCircle } from "lucide-react";
import { generateReceiptPDF } from "./PDFGenerator";
import { Separator } from "./ui/separator";

interface Step6ConfirmationProps {
  data: any;
}

export default function Step6Confirmation({ data }: Step6ConfirmationProps) {
  // Handle null data case
  if (!data || !data.clients) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="rounded-none border-2 border-gray-300">
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 text-lg">Loading confirmation details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const confirmationNumber = data.timestamp.substring(0, 13).replace(/[-:]/g, '');
  const batchId = `NYLTA-${confirmationNumber}`;
  
  // Calculate service type breakdown
  const selectedClients = data.clients || [];
  const monitoringClients = selectedClients.filter((c: any) => c.serviceType === 'monitoring');
  const filingClients = selectedClients.filter((c: any) => c.serviceType === 'filing');

  const handleDownloadReceipt = async () => {
    // Check if firmInfo exists before generating PDF
    if (!data.firmInfo) {
      console.error('Cannot generate receipt: Firm information is missing');
      alert('Unable to generate receipt. Firm information is missing.');
      return;
    }
    
    await generateReceiptPDF({
      firmInfo: data.firmInfo,
      clients: data.clients,
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod,
      signature: data.signature,
      initials: data.initials,
      timestamp: data.timestamp
    });
  };

  const handleDownloadClientSummaries = () => {
    // Build comprehensive CSV with all data (supports up to 4 beneficial owners)
    const headers = [
      "LLC Name",
      "Fictitious Name (DBA)",
      "NYDOS ID",
      "EIN",
      "Formation Date",
      "Contact Email",
      "Filing Status",
      "Exemption Type",
      "Exemption Explanation",
      "Beneficial Owner 1 - Full Name",
      "BO1 - DOB",
      "BO1 - Address",
      "BO1 - ID Type",
      "BO1 - ID Last 4",
      "Beneficial Owner 2 - Full Name",
      "BO2 - DOB",
      "BO2 - Address",
      "BO2 - ID Type",
      "BO2 - ID Last 4",
      "Beneficial Owner 3 - Full Name",
      "BO3 - DOB",
      "BO3 - Address",
      "BO3 - ID Type",
      "BO3 - ID Last 4",
      "Beneficial Owner 4 - Full Name",
      "BO4 - DOB",
      "BO4 - Address",
      "BO4 - ID Type",
      "BO4 - ID Last 4",
      "Fee",
      "Date Filed",
      "Confirmation Number"
    ];

    const rows = data.clients.map((c: any) => {
      const bo1 = c.beneficialOwners?.[0];
      const bo2 = c.beneficialOwners?.[1];
      const bo3 = c.beneficialOwners?.[2];
      const bo4 = c.beneficialOwners?.[3];
      
      return [
        c.llcName || "",
        c.fictitiousName || "",
        c.nydosId || "",
        c.ein || "",
        c.formationDate || "",
        c.contactEmail || "",
        c.filingStatus || "",
        c.exemptionType || "",
        c.exemptionExplanation || "",
        bo1?.fullName || "",
        bo1?.dob || "",
        bo1?.address || "",
        bo1?.idType || "",
        bo1?.idLast4 || "",
        bo2?.fullName || "",
        bo2?.dob || "",
        bo2?.address || "",
        bo2?.idType || "",
        bo2?.idLast4 || "",
        bo3?.fullName || "",
        bo3?.dob || "",
        bo3?.address || "",
        bo3?.idType || "",
        bo3?.idLast4 || "",
        bo4?.fullName || "",
        bo4?.dob || "",
        bo4?.address || "",
        bo4?.idType || "",
        bo4?.idLast4 || "",
        "$398",
        new Date(data.timestamp).toLocaleDateString(),
        `#${confirmationNumber}`
      ].map(field => {
        // Escape commas and quotes in CSV
        const str = String(field);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NYLTA-Filing-Summary-${new Date().getTime()}.csv`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="rounded-none border-2 border-[#00274E]">
        <CardHeader className="text-center pb-6 bg-[#00274E] text-white rounded-none border-b-4 border-yellow-400">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl mb-2">Submission Confirmed!</CardTitle>
          <p className="text-gray-200 text-lg">Your bulk filing has been received and payment authorized</p>
        </CardHeader>
        
        <CardContent className="pt-6">
          {/* Batch ID Block - Prominent */}
          <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-6 text-center mb-6">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Reference / Batch ID</p>
            <p className="text-3xl font-bold text-[#00274E] font-mono tracking-wider">{batchId}</p>
            <p className="text-xs text-gray-600 mt-2">Save this ID for your records</p>
          </div>

          {/* Quick Status Alert */}
          <Alert className="bg-yellow-50 border-yellow-300 mb-6">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold text-gray-900 mb-1">Processing Status: Received & Under Review</p>
              <p className="text-sm text-gray-700">
                Your submission is queued for compliance review. You'll receive updates via email at{' '}
                <span className="font-semibold">{data.firmInfo?.email || 'your registered email'}</span>
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* ACH / Payment Summary Section */}
      <Card className="rounded-none border-2 border-gray-300">
        <CardHeader className="bg-gray-50 border-b-2 border-gray-200 rounded-none">
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-[#00274E]" />
            Payment Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Authorized Signer</p>
                <p className="text-base font-semibold text-gray-900">{data.signature || data.agreementData?.fullLegalName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Firm / Payer Name</p>
                <p className="text-base font-semibold text-gray-900">{data.firmInfo?.firmName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Method</p>
                <p className="text-base font-semibold text-gray-900">
                  {data.paymentMethod === 'ach' ? 'ACH Bank Transfer' : 'Credit Card'}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Submission Date</p>
                <p className="text-base font-semibold text-gray-900">{new Date(data.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Service Breakdown</p>
                <div className="text-sm text-gray-700 space-y-1">
                  {filingClients.length > 0 && (
                    <p>• {filingClients.length} Filing service{filingClients.length !== 1 ? 's' : ''}</p>
                  )}
                  {monitoringClients.length > 0 && (
                    <p>• {monitoringClients.length} Monitoring service{monitoringClients.length !== 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Paid</p>
                <p className="text-2xl font-bold text-[#00274E]">${data.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Documents - Primary & Secondary Actions */}
      <Card className="rounded-none border-2 border-[#00274E]">
        <CardHeader className="bg-[#00274E] text-white rounded-none border-b-4 border-yellow-400">
          <CardTitle>Download Your Documents</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Primary CTA */}
          <Button 
            onClick={handleDownloadReceipt} 
            size="lg"
            className="w-full bg-[#00274E] hover:bg-[#003d71] text-white border-2 border-yellow-400"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Receipt (PDF)
          </Button>
          
          {/* Secondary Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleDownloadClientSummaries} 
              variant="outline" 
              className="flex-1 border-2 border-gray-300"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Filing Summary (CSV)
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-2 border-gray-300"
            >
              <Mail className="mr-2 h-4 w-4" />
              Resend Confirmation Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* What Happens Next */}
      <Card className="rounded-none border-2 border-gray-300">
        <CardHeader className="bg-gray-50 border-b-2 border-gray-200 rounded-none">
          <CardTitle>What Happens Next</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-[#00274E] font-bold text-lg">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Internal Compliance Review</h3>
                <p className="text-sm text-gray-600">
                  Our team will review your submissions for accuracy and completeness within 1-2 business days.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-[#00274E] font-bold text-lg">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">NYDOS Submission</h3>
                <p className="text-sm text-gray-600">
                  Once reviewed and when NYDOS systems are available, filings will be submitted directly to the New York Department of State.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-[#00274E] font-bold text-lg">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Individual Confirmations</h3>
                <p className="text-sm text-gray-600">
                  You'll receive NYDOS confirmation numbers for each entity once filings are processed by the state.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confidentiality & Data Security */}
      <Card className="rounded-none border-2 border-green-200 bg-green-50">
        <CardHeader className="border-b border-green-200">
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Shield className="h-5 w-5" />
            Confidentiality & Data Security
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            All submitted information is encrypted and stored securely in compliance with data protection standards. 
            Your client data is handled with strict confidentiality and will only be transmitted to NYDOS for official filing purposes. 
            We do not share, sell, or disclose your information to third parties.
          </p>
        </CardContent>
      </Card>

      {/* Support Contact */}
      <Card className="rounded-none border-2 border-blue-200 bg-blue-50">
        <CardHeader className="border-b border-blue-200">
          <CardTitle className="flex items-center gap-2 text-[#00274E]">
            <HelpCircle className="h-5 w-5" />
            Need Assistance?
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-gray-700 mb-3">
            Our bulk filing support team is available to answer questions and provide updates on your submission.
          </p>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600" />
            <a href="mailto:bulk@nylta.com" className="text-blue-600 font-semibold hover:underline">
              bulk@nylta.com
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert className="border-gray-300 bg-gray-50">
        <AlertDescription className="text-xs text-gray-600 leading-relaxed">
          <strong>Important Disclaimer:</strong> NYLTA.com™ is a private compliance technology platform operated by New Way Enterprise LLC. 
          We are not affiliated with, endorsed by, or operated by the New York Department of State (NYDOS) or any government agency. 
          This platform provides compliance preparation and filing facilitation services only. Final filing acceptance and processing times are determined by NYDOS.
        </AlertDescription>
      </Alert>

      {/* Return to Dashboard */}
      <div className="text-center pt-4">
        <Button 
          size="lg" 
          onClick={() => window.location.href = '/dashboard'}
          className="bg-[#00274E] hover:bg-[#003d71] text-white"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}