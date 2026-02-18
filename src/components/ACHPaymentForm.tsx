import { useState } from "react";
import { Shield, Lock, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import BulkFilingCheckoutAgreements, { AgreementData } from "./BulkFilingCheckoutAgreements";

interface ACHPaymentFormProps {
  totalAmount: number;
  clientCount: number;
  firmName?: string;
  firmAddress?: string;
  onSubmit?: (data: ACHFormData) => void;
}

export interface ACHFormData {
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

export default function ACHPaymentForm({ totalAmount, clientCount, firmName, firmAddress, onSubmit }: ACHPaymentFormProps) {
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementsValid, setAgreementsValid] = useState(false);
  const [agreementData, setAgreementData] = useState<AgreementData | null>(null);
  
  const [formData, setFormData] = useState<ACHFormData>({
    companyAccountName: "",
    routingNumber: "",
    accountNumber: "",
    accountNumberConfirm: "",
    billingAddress: {
      street: "",
      city: "",
      state: "NY",
      zip: ""
    },
    authorizedSignerName: "",
    authorizedSignerTitle: "",
    initials: "",
    agreedToACH: false,
    agreedToTerms: false
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ACHFormData, string>>>({});

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('billingAddress.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field as keyof ACHFormData]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ACHFormData, string>> = {};

    if (!formData.companyAccountName.trim()) {
      newErrors.companyAccountName = "Company account name is required";
    }

    if (!formData.routingNumber || formData.routingNumber.length !== 9) {
      newErrors.routingNumber = "Routing number must be 9 digits";
    }

    if (!formData.accountNumber || formData.accountNumber.length < 4) {
      newErrors.accountNumber = "Account number is required";
    }

    if (formData.accountNumber !== formData.accountNumberConfirm) {
      newErrors.accountNumberConfirm = "Account numbers do not match";
    }

    if (!formData.authorizedSignerName.trim()) {
      newErrors.authorizedSignerName = "Authorized signer name is required";
    }

    if (!formData.authorizedSignerTitle.trim()) {
      newErrors.authorizedSignerTitle = "Authorized signer title is required";
    }

    if (!formData.initials.trim()) {
      newErrors.initials = "Initials are required to authorize ACH debit";
    }

    if (!formData.agreedToACH) {
      newErrors.agreedToACH = "You must agree to the ACH Authorization Agreement";
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = "You must agree to the Terms of Service and Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (onSubmit) {
        onSubmit(formData);
      }
      alert("ACH Payment Authorized! (This is a demo)");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-[#00274E] mb-2">Secure ACH Payment</h1>
        <p className="text-gray-600 text-lg">
          Authorize payment for {clientCount} bulk filing{clientCount !== 1 ? 's' : ''}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Summary */}
            <Card className="border-2 border-[#00274E] bg-gradient-to-br from-[#00274E] to-[#003d7a]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-gray-300 text-sm mb-1">Total Amount Due</p>
                    <p className="text-4xl" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                      ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Shield className="h-16 w-16 text-yellow-400" />
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-gray-300 text-sm">
                    Payment for {clientCount} NYLTA bulk filing{clientCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Bank Account Information */}
            <Card className="border-2 border-gray-300">
              <CardHeader className="bg-white border-b-4 border-yellow-400">
                <CardTitle className="text-[#00274E]">Bank Account Information</CardTitle>
                <CardDescription>Enter your business bank account details for ACH payment</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="companyAccountName" className="text-gray-900 mb-2 block">
                    Company Account Name *
                  </Label>
                  <Input
                    id="companyAccountName"
                    type="text"
                    placeholder="Company name as it appears on bank account"
                    value={formData.companyAccountName}
                    onChange={(e) => handleInputChange('companyAccountName', e.target.value)}
                    className={`rounded-none ${errors.companyAccountName ? 'border-red-500' : ''}`}
                  />
                  {errors.companyAccountName && (
                    <p className="text-red-600 text-sm mt-1">{errors.companyAccountName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="routingNumber" className="text-gray-900 mb-2 block">
                      Routing Number *
                    </Label>
                    <Input
                      id="routingNumber"
                      type="text"
                      placeholder="9 digits"
                      maxLength={9}
                      value={formData.routingNumber}
                      onChange={(e) => handleInputChange('routingNumber', e.target.value.replace(/\D/g, ''))}
                      className={`rounded-none font-mono ${errors.routingNumber ? 'border-red-500' : ''}`}
                    />
                    {errors.routingNumber && (
                      <p className="text-red-600 text-sm mt-1">{errors.routingNumber}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="accountNumber" className="text-gray-900 mb-2 block">
                      Account Number *
                    </Label>
                    <Input
                      id="accountNumber"
                      type="password"
                      placeholder="Enter account number"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      className={`rounded-none font-mono ${errors.accountNumber ? 'border-red-500' : ''}`}
                    />
                    {errors.accountNumber && (
                      <p className="text-red-600 text-sm mt-1">{errors.accountNumber}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="accountNumberConfirm" className="text-gray-900 mb-2 block">
                    Re-enter Account Number *
                  </Label>
                  <Input
                    id="accountNumberConfirm"
                    type="text"
                    placeholder="Confirm account number"
                    value={formData.accountNumberConfirm}
                    onChange={(e) => handleInputChange('accountNumberConfirm', e.target.value)}
                    className={`rounded-none font-mono ${errors.accountNumberConfirm ? 'border-red-500' : ''}`}
                  />
                  {errors.accountNumberConfirm && (
                    <p className="text-red-600 text-sm mt-1">{errors.accountNumberConfirm}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card className="border-2 border-gray-300">
              <CardHeader className="bg-white border-b-4 border-yellow-400">
                <CardTitle className="text-[#00274E]">Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="street" className="text-gray-900 mb-2 block">
                    Street Address *
                  </Label>
                  <Input
                    id="street"
                    type="text"
                    placeholder="123 Main Street"
                    value={formData.billingAddress.street}
                    onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                    className="rounded-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-gray-900 mb-2 block">
                      City *
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="New York"
                      value={formData.billingAddress.city}
                      onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                      className="rounded-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state" className="text-gray-900 mb-2 block">
                      State *
                    </Label>
                    <Input
                      id="state"
                      type="text"
                      value={formData.billingAddress.state}
                      onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                      className="rounded-none"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="zip" className="text-gray-900 mb-2 block">
                      ZIP Code *
                    </Label>
                    <Input
                      id="zip"
                      type="text"
                      placeholder="10001"
                      maxLength={5}
                      value={formData.billingAddress.zip}
                      onChange={(e) => handleInputChange('billingAddress.zip', e.target.value.replace(/\D/g, ''))}
                      className="rounded-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Authorized Signer */}
            <Card className="border-2 border-gray-300">
              <CardHeader className="bg-white border-b-4 border-yellow-400">
                <CardTitle className="text-[#00274E]">Authorized Signer</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="signerName" className="text-gray-900 mb-2 block">
                    Authorized Signer Name *
                  </Label>
                  <Input
                    id="signerName"
                    type="text"
                    placeholder="Full legal name"
                    value={formData.authorizedSignerName}
                    onChange={(e) => handleInputChange('authorizedSignerName', e.target.value)}
                    className={`rounded-none ${errors.authorizedSignerName ? 'border-red-500' : ''}`}
                  />
                  {errors.authorizedSignerName && (
                    <p className="text-red-600 text-sm mt-1">{errors.authorizedSignerName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="signerTitle" className="text-gray-900 mb-2 block">
                    Authorized Signer Title *
                  </Label>
                  <Input
                    id="signerTitle"
                    type="text"
                    placeholder="e.g., President, CFO, Managing Member"
                    value={formData.authorizedSignerTitle}
                    onChange={(e) => handleInputChange('authorizedSignerTitle', e.target.value)}
                    className={`rounded-none ${errors.authorizedSignerTitle ? 'border-red-500' : ''}`}
                  />
                  {errors.authorizedSignerTitle && (
                    <p className="text-red-600 text-sm mt-1">{errors.authorizedSignerTitle}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bulk Filing Checkout Agreements - Replaces old authorization section */}
            <BulkFilingCheckoutAgreements
              companyName={formData.companyAccountName || firmName || "[Your Firm Name]"}
              companyAddress={
                formData.billingAddress.street 
                  ? `${formData.billingAddress.street}, ${formData.billingAddress.city}, ${formData.billingAddress.state} ${formData.billingAddress.zip}`
                  : firmAddress || "[Your Firm Address]"
              }
              onValidationChange={(isValid, data) => {
                setAgreementsValid(isValid);
                setAgreementData(data);
                // Sync data to main form state
                setFormData(prev => ({
                  ...prev,
                  agreedToACH: data.bulkServiceAgreed,
                  agreedToTerms: data.termsAgreed,
                  initials: data.initials
                }));
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!agreementsValid}
              className="w-full bg-[#00274E] hover:bg-[#003366] text-white rounded-none py-8 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock className="mr-2 h-5 w-5" />
              Authorize ACH Payment - ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Button>

            {/* Security Notice */}
            <Card className="border-2 border-gray-300 bg-gray-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#00274E] mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">
                      <strong>Secure ACH Processing:</strong> Your bank account information is encrypted 
                      and processed through NACHA-compliant secure channels.
                    </p>
                    <p>
                      Payment will be debited from your account within 1-2 business days. You will receive 
                      a confirmation email with your authorization details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Agreement Summary */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-gray-300 sticky top-4">
              <CardHeader className="bg-gray-100 border-b-2 border-gray-300">
                <CardTitle className="text-[#00274E] text-lg">ACH Authorization Agreement</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAgreement(!showAgreement)}
                  className="w-full rounded-none border-2 border-[#00274E] mb-4"
                >
                  {showAgreement ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                  {showAgreement ? "Hide" : "View"} Agreement
                </Button>

                {showAgreement && (
                  <div className="space-y-3 text-sm text-gray-700 max-h-96 overflow-y-auto pr-2">
                    <h4 className="text-base text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                      Bulk Service / ACH Authorization Agreement
                    </h4>
                    <p className="text-xs text-gray-500">
                      New Way Enterprise LLC d/b/a NYLTA.com
                    </p>

                    <div className="space-y-2">
                      <p>
                        <strong>1. Authorization to Debit</strong><br />
                        Client authorizes NYLTA.com to debit the provided bank account for all selected filings.
                      </p>

                      <p>
                        <strong>2. Payment Terms</strong><br />
                        Full payment is due at submission. Batch submissions are supported.
                      </p>

                      <p>
                        <strong>3. Data Accuracy</strong><br />
                        Client is responsible for providing accurate data for all filings.
                      </p>

                      <p>
                        <strong>4. Returned ACH Fee</strong><br />
                        A fee of $25 will be charged for any returned ACH transactions.
                      </p>

                      <p>
                        <strong>5. Revocation</strong><br />
                        Authorization revocation requires 10 days written notice to support@nylta.com.
                      </p>

                      <p>
                        <strong>6. Electronic Signature</strong><br />
                        Your initials, timestamp, and account last 4 digits will be captured as your 
                        electronic signature authorizing this transaction.
                      </p>

                      <p className="text-xs text-gray-500 pt-2 border-t border-gray-300">
                        Full legal agreement will be provided in confirmation email and available for 
                        download after payment authorization.
                      </p>
                    </div>
                  </div>
                )}

                {!showAgreement && (
                  <div className="space-y-2 text-xs text-gray-600">
                    <p className="flex items-start gap-2">
                      <span className="text-[#00274E]">✓</span>
                      Authorization to debit client bank account
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-[#00274E]">✓</span>
                      Full payment due at submission
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-[#00274E]">✓</span>
                      Batch submissions supported
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-[#00274E]">✓</span>
                      Client responsible for accurate data
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-[#00274E]">✓</span>
                      Returned ACH fee: $25
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-[#00274E]">✓</span>
                      10-day notice for revocation
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-300">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <img 
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300274E'%3E%3Cpath d='M12 2L2 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z'/%3E%3C/svg%3E"
                      alt="Secure"
                      className="h-4 w-4"
                    />
                    <span>NACHA-Compliant ACH Processing</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}