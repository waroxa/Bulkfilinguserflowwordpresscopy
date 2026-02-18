import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import BulkFilingCheckoutAgreements, { AgreementData } from "./BulkFilingCheckoutAgreements";
import { CheckCircle2 } from "lucide-react";

export default function BulkFilingCheckoutAgreementsDemo() {
  const [isValid, setIsValid] = useState(false);
  const [agreementData, setAgreementData] = useState<AgreementData | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleValidationChange = (valid: boolean, data: AgreementData) => {
    setIsValid(valid);
    setAgreementData(data);
  };

  const handleCheckout = () => {
    if (isValid && agreementData) {
      setShowSuccess(true);
      console.log("Checkout authorized with data:", agreementData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="rounded-none border-2 border-[#00274E]">
          <CardHeader className="bg-[#00274E] text-white rounded-none">
            <CardTitle>Bulk Filing Checkout</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 border-2 border-gray-300">
                <div>
                  <p className="text-sm text-gray-600">Total Filings Selected</p>
                  <p className="text-2xl text-gray-900" style={{ fontFamily: 'Libre Baskerville, serif' }}>12 Filings</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Amount Due</p>
                  <p className="text-2xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>$4,776.00</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Review and agree to the terms below to complete your bulk filing checkout.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Agreements Component */}
        <BulkFilingCheckoutAgreements
          companyName="Smith & Associates CPA Firm"
          companyAddress="123 Main Street, Suite 500, New York, NY 10001"
          onValidationChange={handleValidationChange}
        />

        {/* Checkout Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleCheckout}
            disabled={!isValid}
            className="bg-[#00274E] hover:bg-[#003366] text-white px-8 py-6 rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Checkout & Submit Payment
          </Button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <Card className="rounded-none border-2 border-green-500 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-green-900">
                    <strong>Authorization Complete!</strong>
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Your agreement has been recorded. Proceeding to payment processing...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Info (for demo purposes) */}
        <Card className="rounded-none border border-gray-300">
          <CardHeader>
            <CardTitle className="text-base">Validation Status (Demo)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm font-mono">
              <p>Valid: <span className={isValid ? "text-green-600" : "text-red-600"}>{isValid ? "✓" : "✗"}</span></p>
              {agreementData && (
                <>
                  <p>Bulk Service Agreed: <span className={agreementData.bulkServiceAgreed ? "text-green-600" : "text-red-600"}>{agreementData.bulkServiceAgreed ? "✓" : "✗"}</span></p>
                  <p>Terms Agreed: <span className={agreementData.termsAgreed ? "text-green-600" : "text-red-600"}>{agreementData.termsAgreed ? "✓" : "✗"}</span></p>
                  <p>Initials: <span className={agreementData.initials.length >= 2 ? "text-green-600" : "text-red-600"}>{agreementData.initials || "(empty)"}</span></p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
