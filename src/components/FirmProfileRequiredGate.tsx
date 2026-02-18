import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, Building2, CheckCircle2, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface FirmProfileRequiredGateProps {
  onCompleteFirmProfile: () => void;
  onBackToDashboard: () => void;
}

export default function FirmProfileRequiredGate({ 
  onCompleteFirmProfile, 
  onBackToDashboard 
}: FirmProfileRequiredGateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-yellow-400">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <ImageWithFallback 
              src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
              alt="NYLTA.com Logo"
              className="h-8 sm:h-10 md:h-12 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-none"
            />
            <div>
              <h1 className="text-gray-900 text-3xl">Firm Profile Required</h1>
              <p className="text-gray-600 mt-1">Complete your profile to start bulk filing</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-2 border-[#00274E] shadow-lg">
          <CardContent className="pt-12 pb-10">
            {/* Warning Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-100 rounded-full p-4">
                <AlertCircle className="w-12 h-12 text-yellow-600" />
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-3xl text-[#00274E] text-center mb-4">
              Firm Profile Completion Required
            </h2>
            <p className="text-gray-600 text-center mb-8 text-lg">
              Before you can start bulk filing, you need to complete your firm profile. This is a one-time setup.
            </p>

            {/* Alert Banner */}
            <Alert className="mb-8 border-yellow-400 bg-yellow-50">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <AlertDescription className="text-yellow-900">
                <strong>Action Required:</strong> Your firm profile is incomplete. You cannot access the bulk filing wizard until this prerequisite is completed.
              </AlertDescription>
            </Alert>

            {/* Why This Is Required */}
            <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
              <h3 className="font-semibold text-[#00274E] mb-4 text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Why is this required?
              </h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  Your firm profile information is essential for processing NYLTA bulk filings. We need this information to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Identify your firm:</strong> Legal business name and EIN are required for all submissions</li>
                  <li><strong>Authorize filers:</strong> Designate which team members can submit filings on behalf of your firm</li>
                  <li><strong>Process payments:</strong> Billing address and contact information for ACH transactions</li>
                  <li><strong>Comply with regulations:</strong> NYDOS requires complete firm information for all bulk filing submissions</li>
                </ul>
              </div>
            </div>

            {/* What You'll Need */}
            <div className="bg-blue-50 border border-blue-200 p-6 mb-8">
              <h3 className="font-semibold text-[#00274E] mb-4 text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                What you'll need to complete your profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="font-semibold mb-2">Firm Information:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Legal Business Name</li>
                    <li>Federal EIN</li>
                    <li>Business Address</li>
                    <li>Contact Email & Phone</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Authorized Filers:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Full Name (at least 1 person)</li>
                    <li>Email Address</li>
                    <li>Job Title/Role</li>
                    <li>Filing Authorization</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Estimated time: 5-10 minutes</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={onCompleteFirmProfile}
                className="bg-[#00274E] hover:bg-[#003d73] text-white px-12 py-6 text-lg"
                size="lg"
              >
                Complete Firm Profile Now
              </Button>
              <Button
                onClick={onBackToDashboard}
                variant="outline"
                className="border-gray-300 text-gray-700 px-8 py-6 text-lg"
                size="lg"
              >
                Back to Dashboard
              </Button>
            </div>

            {/* Additional Information */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                This is a <strong>one-time setup</strong>. Once your firm profile is complete, you can start bulk filing immediately and won't need to complete this step again.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            NYLTA.com™ is operated by New Way Enterprise LLC and is not affiliated with the New York Department of State or any government agency.
          </p>
        </div>
      </footer>
    </div>
  );
}
