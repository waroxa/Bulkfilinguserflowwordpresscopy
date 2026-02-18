import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { 
  Sparkles, 
  Building2, 
  Users, 
  FileCheck, 
  CreditCard, 
  CheckCircle2,
  ArrowRight,
  Rocket
} from "lucide-react";

interface FirstTimeUserWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onStartProfile: () => void;
  firmName?: string;
  contactName?: string;
}

export default function FirstTimeUserWizard({ 
  isOpen, 
  onClose, 
  onStartProfile,
  firmName = "your firm",
  contactName = ""
}: FirstTimeUserWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to NYLTA.com! 🎉",
      icon: <Sparkles className="h-16 w-16 text-yellow-400" />,
      content: (
        <div className="space-y-4 text-center">
          <p className="text-xl">
            Hello {contactName ? <strong>{contactName}</strong> : "there"}! 
          </p>
          <p className="text-base text-gray-700">
            Your account has been approved and you're ready to get started with bulk NYLTA filing for {firmName}.
          </p>
          <p className="text-base text-gray-700">
            Before you can file for your clients, we need to complete your firm's profile. This quick setup will only take 2-3 minutes.
          </p>
          <div className="bg-blue-50 border-2 border-blue-200 rounded p-4 mt-6">
            <p className="text-base text-blue-900">
              <strong>📋 What you'll need:</strong>
            </p>
            <ul className="text-left text-sm text-blue-800 mt-2 space-y-1 ml-6">
              <li>✓ Firm's complete address</li>
              <li>✓ EIN (Employer Identification Number)</li>
              <li>✓ Professional license information</li>
              <li>✓ Contact details</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "How Bulk Filing Works",
      icon: <FileCheck className="h-16 w-16 text-blue-600" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 border-[#00274E]">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-[#00274E] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-base mb-1">Complete Firm Profile</h4>
                    <p className="text-sm text-gray-600">
                      Fill out your firm information and register workers (optional)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-base mb-1">Upload Client List</h4>
                    <p className="text-sm text-gray-600">
                      Upload CSV file with your clients (1 or more)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-base mb-1">Add Company Applicants</h4>
                    <p className="text-sm text-gray-600">
                      Assign firm representatives to each client
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="text-base mb-1">Review & Submit</h4>
                    <p className="text-sm text-gray-600">
                      Check exemptions, add beneficial owners, and submit
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-400 rounded p-4">
            <p className="text-base text-gray-900">
              <strong>💰 Tiered Pricing Benefits:</strong>
            </p>
            <ul className="text-sm text-gray-700 mt-2 space-y-1">
              <li>• 10-25 filings: <strong>$398</strong> per filing</li>
              <li>• 26-75 filings: <strong>$389</strong> per filing</li>
              <li>• 76-150 filings: <strong>$375</strong> per filing</li>
              <li>• 150+ filings: <strong>Custom pricing</strong></li>
            </ul>
            <p className="text-sm text-yellow-900 mt-3">
              🎁 <strong>Early Bird Special:</strong> First 25 firms get an additional 10% discount!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Key Features You'll Love",
      icon: <Rocket className="h-16 w-16 text-green-600" />,
      content: (
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded">
              <Users className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-base mb-1">Register Firm Workers</h4>
                <p className="text-sm text-gray-600">
                  Save up to 3 firm workers' information. Quickly assign them as Company Applicants for any client without re-entering data.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded">
              <FileCheck className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-base mb-1">CSV Bulk Upload</h4>
                <p className="text-sm text-gray-600">
                  Upload all clients at once using our CSV template. No need to enter each client manually.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded">
              <CheckCircle2 className="h-8 w-8 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-base mb-1">Exemption Management</h4>
                <p className="text-sm text-gray-600">
                  Easily mark clients as exempt and provide exemption attestations. Only non-exempt clients require beneficial owner information.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded">
              <CreditCard className="h-8 w-8 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-base mb-1">Flexible Payment Options</h4>
                <p className="text-sm text-gray-600">
                  Pay via ACH bank transfer or credit card. Secure, encrypted, and compliant with PCI standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Start?",
      icon: <Building2 className="h-16 w-16 text-[#00274E]" />,
      content: (
        <div className="space-y-6 text-center">
          <p className="text-xl text-gray-700">
            Let's complete your firm profile to unlock bulk filing!
          </p>

          <div className="bg-gradient-to-r from-[#00274E] to-[#003d7a] text-white rounded-lg p-6">
            <h3 className="text-xl mb-4" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              What Happens Next?
            </h3>
            <div className="text-left space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong>Step 1:</strong> Fill out your firm information (name, address, EIN, etc.)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong>Step 2:</strong> Optionally register up to 3 firm workers for quick assignment
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong>Step 3:</strong> Agree to terms and conditions
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong>Done!</strong> You'll be able to start uploading clients immediately
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded p-4">
            <p className="text-sm text-blue-900">
              <strong>💡 Tip:</strong> Have your firm's EIN and address handy. You can always skip registering firm workers for now and add them later.
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStartProfile();
      onClose();
    }
  };

  const handleSkip = () => {
    onStartProfile();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6 py-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center flex-1">
                <div
                  className={`h-2 flex-1 rounded-full transition-all ${
                    index <= currentStep ? 'bg-[#00274E]' : 'bg-gray-200'
                  }`}
                />
                {index < steps.length - 1 && (
                  <div className="w-2" />
                )}
              </div>
            ))}
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            {steps[currentStep].icon}
          </div>

          {/* Title */}
          <h2 
            className="text-3xl text-center text-[#00274E]" 
            style={{ fontFamily: 'Libre Baskerville, serif' }}
          >
            {steps[currentStep].title}
          </h2>

          {/* Content */}
          <div className="min-h-[300px]">
            {steps[currentStep].content}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t-2 border-gray-200">
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>

            <div className="flex gap-3">
              {currentStep < steps.length - 1 ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    className="rounded-none border-2 border-gray-300"
                  >
                    Skip Tutorial
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-[#00274E] hover:bg-[#003366] text-white rounded-none min-w-[140px]"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-none min-w-[200px]"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Firm Profile Setup
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
