import { Button } from "./ui/button";
import { Card, CardContent, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CheckCircle2, XCircle, Lock } from "lucide-react";

interface ProfileCompletionGateProps {
  onCompleteFirmProfile: () => void;
  firmProfileData?: any;
}

export default function ProfileCompletionGate({ onCompleteFirmProfile, firmProfileData }: ProfileCompletionGateProps) {
  // Determine which fields are complete
  const checklistItems = [
    {
      label: "Firm Name",
      isComplete: !!firmProfileData?.firmName
    },
    {
      label: "Address",
      isComplete: !!(firmProfileData?.address && firmProfileData?.city && firmProfileData?.state && firmProfileData?.zipCode)
    },
    {
      label: "Professional Type",
      isComplete: !!firmProfileData?.professionalType
    },
    {
      label: "Primary Contact Information",
      isComplete: !!(firmProfileData?.contactPerson && firmProfileData?.email && firmProfileData?.phone)
    },
    {
      label: "Authorized Users",
      isComplete: !!(firmProfileData?.authorizedFilers && firmProfileData.authorizedFilers.length > 0)
    }
  ];

  const allComplete = checklistItems.every(item => item.isComplete);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b-4 border-yellow-400">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <ImageWithFallback 
              src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
              alt="NYLTA.com Logo"
              className="h-8 sm:h-10 md:h-12 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-none"
            />
          </div>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl w-full">
          <div className="bg-white border-2 border-[#00274E] shadow-lg">
            {/* Title Section */}
            <div className="bg-[#00274E] text-white px-8 py-6">
              <h1 className="text-3xl mb-2">Complete Your Firm Profile</h1>
              <p className="text-gray-200 text-base">
                Required to access the NYLTA Bulk Filing Portal
              </p>
            </div>

            {/* Body Section */}
            <div className="px-8 py-8">
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                Before you can begin using the NYLTA Bulk Filing Portal, we need to collect required firm information. This ensures accurate records and compliance throughout the filing process.
              </p>

              {/* Checklist */}
              <div className="bg-gray-50 border-2 border-gray-200 p-6 mb-8">
                <h2 className="text-[#00274E] mb-4 text-lg">
                  Required Information:
                </h2>
                <div className="space-y-3">
                  {checklistItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {item.isComplete ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`text-base ${item.isComplete ? 'text-gray-900' : 'text-gray-600'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Access Restricted Notice */}
              <div className="bg-red-50 border-l-4 border-red-500 p-5 mb-8">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-red-900 font-semibold mb-2">Access Currently Restricted</h3>
                    <p className="text-red-800 text-sm mb-3">
                      Until you complete your firm profile, you will <strong>not be able to</strong>:
                    </p>
                    <ul className="space-y-2 text-red-800 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Start a new bulk filing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Upload client lists</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Access the filing wizard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Submit NYLTA reports</span>
                      </li>
                    </ul>
                    <p className="mt-3 text-red-800 text-sm">
                      <strong>Complete your profile below to unlock full access.</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-blue-900 font-semibold mb-1">Important</h3>
                    <p className="text-blue-800 text-sm">
                      You will not be able to access the dashboard, bulk filing wizard, or any actions until your firm profile is complete.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={onCompleteFirmProfile}
                className="w-full bg-[#00274E] hover:bg-[#003d73] text-white py-6 text-lg"
                size="lg"
              >
                Complete Firm Profile
              </Button>

              {/* Footer Note */}
              <p className="text-sm text-gray-500 text-center mt-6">
                This is a one-time setup process. Your information will be saved for all future filings.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            NYLTA.com™ is operated by New Way Enterprise LLC and is not affiliated with the New York Department of State or any government agency.
          </p>
        </div>
      </footer>
    </div>
  );
}