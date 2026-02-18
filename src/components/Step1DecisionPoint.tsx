import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Info } from "lucide-react";
import { useState } from "react";

interface Step1DecisionPointProps {
  onComplete: (filingPath: 'disclosure' | 'exemption') => void;
  onBack: () => void;
  initialPath?: 'disclosure' | 'exemption';
}

export default function Step1DecisionPoint({ onComplete, onBack, initialPath }: Step1DecisionPointProps) {
  const [selectedPath, setSelectedPath] = useState<'disclosure' | 'exemption' | ''>(initialPath || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!selectedPath) {
      setError('Please select a filing path to continue');
      return;
    }
    onComplete(selectedPath);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="border-2 border-gray-200 shadow-sm rounded-none">
        <CardHeader className="border-b border-gray-200 bg-white">
          <CardTitle 
            className="text-gray-900"
            style={{ fontFamily: 'Libre Baskerville, serif' }}
          >
            Filing Path Selection
          </CardTitle>
          <p className="text-gray-600 mt-2 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Select the appropriate filing path for your submission
          </p>
        </CardHeader>

        <CardContent className="p-8 bg-white space-y-6">
          {/* Helper Alert */}
          <Alert className="border-blue-200 bg-blue-50 rounded-none">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-gray-700 ml-2">
              Your selection determines the filing path. NYLTA.com records what you submit and does not determine eligibility.
            </AlertDescription>
          </Alert>

          {/* Main Question */}
          <div className="space-y-4">
            <Label 
              className="text-lg text-gray-900"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Are you submitting beneficial ownership information?
            </Label>

            <RadioGroup 
              value={selectedPath} 
              onValueChange={(value) => {
                setSelectedPath(value as 'disclosure' | 'exemption');
                setError('');
              }}
              className="space-y-4 mt-4"
            >
              {/* Option 1: Disclosure Path */}
              <div 
                className={`border-2 p-6 cursor-pointer transition-all rounded-none ${
                  selectedPath === 'disclosure' 
                    ? 'border-[#00274E] bg-blue-50' 
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                onClick={() => {
                  setSelectedPath('disclosure');
                  setError('');
                }}
              >
                <div className="flex items-start gap-4">
                  <RadioGroupItem 
                    value="disclosure" 
                    id="disclosure" 
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor="disclosure" 
                      className="cursor-pointer text-base text-gray-900"
                      style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                    >
                      Yes — I am submitting beneficial ownership information
                    </Label>
                    <p className="text-sm text-gray-600 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Select this option if you are filing beneficial ownership disclosure for reporting companies. 
                      This path includes company applicant and beneficial owner information.
                    </p>
                  </div>
                </div>
              </div>

              {/* Option 2: Exemption Path */}
              <div 
                className={`border-2 p-6 cursor-pointer transition-all rounded-none ${
                  selectedPath === 'exemption' 
                    ? 'border-[#00274E] bg-blue-50' 
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                onClick={() => {
                  setSelectedPath('exemption');
                  setError('');
                }}
              >
                <div className="flex items-start gap-4">
                  <RadioGroupItem 
                    value="exemption" 
                    id="exemption" 
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor="exemption" 
                      className="cursor-pointer text-base text-gray-900"
                      style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                    >
                      No — I am submitting an exemption attestation
                    </Label>
                    <p className="text-sm text-gray-600 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Select this option if you believe the entity qualifies for an exemption and you are submitting 
                      an attestation based on the exemption category.
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-600 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {error}
              </p>
            )}
          </div>

          {/* Path Details */}
          {selectedPath && (
            <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-none">
              <h4 
                className="text-sm text-gray-900 mb-3"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              >
                {selectedPath === 'disclosure' ? 'Disclosure Path Includes:' : 'Exemption Attestation Path Includes:'}
              </h4>
              <ul className="space-y-2 text-sm text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {selectedPath === 'disclosure' ? (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00274E] mt-0.5">•</span>
                      <span>Filing Information (company details)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00274E] mt-0.5">•</span>
                      <span>Company Applicant information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00274E] mt-0.5">•</span>
                      <span>Beneficial Owner details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00274E] mt-0.5">•</span>
                      <span>Review and submission</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00274E] mt-0.5">•</span>
                      <span>Filing Information (company details)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00274E] mt-0.5">•</span>
                      <span>Exemption category selection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00274E] mt-0.5">•</span>
                      <span>Attestation and authorized signature</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00274E] mt-0.5">•</span>
                      <span>Review and submission</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="px-8 py-6 rounded-none border-gray-300"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Back
            </Button>

            <Button
              type="button"
              onClick={handleContinue}
              className="px-12 py-6 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#00274E] rounded-none"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
