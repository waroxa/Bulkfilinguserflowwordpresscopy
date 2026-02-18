import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import BulkFilingCheckoutAgreements, { AgreementData } from "./BulkFilingCheckoutAgreements";
import { submitBulkFilingToHighLevel, searchHighLevelContactByEmail } from "../utils/highlevel";
import { projectId } from "../utils/supabase/info";
import { useAuth } from "../contexts/AuthContext";
import SubmissionLoadingScreen from "./SubmissionLoadingScreen";

// Import types from parent
interface Client {
  id: string;
  llcName: string;
  nydosId?: string;
  ein?: string;
  filingType?: 'disclosure' | 'exemption';
  exemptionCategory?: string;
  serviceType?: 'monitoring' | 'filing';
  entityType?: 'domestic' | 'foreign';
  dataComplete?: boolean;
  formationDate?: string;
  countryOfFormation?: string;
  stateOfFormation?: string;
  contactEmail?: string;
}

interface FirmInfo {
  firmName: string;
  email: string;
  ein: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface PaymentSelection {
  clientIds: string[];
  totalAmount: number;
}

interface Step5PaymentProps {
  paymentSelection: PaymentSelection;
  firmInfo: FirmInfo;
  clients: Client[]; // Add clients prop
  onComplete: (data: any) => void;
  onBack: () => void;
}

export default function Step5Payment({ paymentSelection, firmInfo, clients, onComplete, onBack }: Step5PaymentProps) {
  const { session } = useAuth(); // Get session from auth context
  const [paymentMethod, setPaymentMethod] = useState<"ach">("ach");
  const [agreementsValid, setAgreementsValid] = useState(false);
  const [agreementData, setAgreementData] = useState<AgreementData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [currentStep, setCurrentStep] = useState("");
  
  const [paymentData, setPaymentData] = useState({
    accountName: "",
    routingNumber: "",
    accountNumber: "",
    accountNumberConfirm: ""
  });
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    state: "NY",
    zip: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filingCount = paymentSelection.clientIds.length;
  
  // Calculate counts and pricing for MIXED service types
  const selectedClients = clients.filter(c => paymentSelection.clientIds.includes(c.id));
  const monitoringClients = selectedClients.filter(c => c.serviceType === 'monitoring');
  const filingClients = selectedClients.filter(c => c.serviceType === 'filing');
  
  // CRITICAL: Volume discounts ONLY apply to FOREIGN filing entities
  const foreignFilingClients = filingClients.filter(c => c.entityType === 'foreign');
  const domesticFilingClients = filingClients.filter(c => c.entityType === 'domestic');
  
  // Determine overall service type for the submission (use 'mixed' if both types exist)
  let serviceType: 'monitoring' | 'filing' | 'mixed';
  if (monitoringClients.length > 0 && filingClients.length > 0) {
    serviceType = 'mixed';
  } else if (monitoringClients.length > 0) {
    serviceType = 'monitoring';
  } else {
    serviceType = 'filing';
  }
  
  const MONITORING_FEE = 249;
  const FILING_FEE = 398;
  
  // Calculate volume discount for FOREIGN filing clients only
  const getForeignFilingPricePerClient = (count: number): number => {
    if (count <= 25) return FILING_FEE; // Tier 1: $398.00 (no discount)
    if (count <= 75) return FILING_FEE * 0.95;  // Tier 2: 5% discount → $378.10
    if (count <= 150) return FILING_FEE * 0.90;  // Tier 3: 10% discount → $358.20
    return FILING_FEE; // Custom pricing over 150
  };
  
  const foreignFilingPricePerClient = getForeignFilingPricePerClient(foreignFilingClients.length);
  const monitoringTotal = monitoringClients.length * MONITORING_FEE;
  const foreignFilingTotal = foreignFilingClients.length * foreignFilingPricePerClient;
  const domesticFilingTotal = domesticFilingClients.length * FILING_FEE; // Always full price
  const subtotal = monitoringTotal + foreignFilingTotal + domesticFilingTotal;
  const totalWithDiscount = subtotal; // No additional discount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreementsValid || !agreementData) {
      alert("Please complete and agree to all required agreements and authorizations.");
      return;
    }

    // Start submission loading
    setIsSubmitting(true);
    setSubmissionProgress(0);
    setSubmissionStatus("Preparing submission...");
    setCurrentStep("Validating client information");

    // Submit to RewardLion via HighLevel
    const submitToRewardLion = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const { ip: userIP } = await response.json();
        console.log('User IP:', userIP);

        // searchHighLevelContactByEmail returns string | null (contact ID), NOT an object
        const contactId = await searchHighLevelContactByEmail(firmInfo.email);
        
        if (contactId) {
          console.log('Found HighLevel contact:', contactId);
          
          const result = await submitBulkFilingToHighLevel(contactId, {
            firmInfo,
            clients,
            paymentSelection,
            timestamp: new Date().toISOString()
          }, userIP);
          
          if (result.success) {
            console.log(`✅ Bulk filing submitted - Submission #${result.submissionNumber}`);
          }
        } else {
          console.warn('⚠️ No RewardLion contact found for email:', firmInfo.email);
        }
      } catch (error) {
        console.error('❌ RewardLion submission error:', error);
        // Don't block the flow if RewardLion fails
      }
    };

    // Save payment record to database
    const savePaymentRecord = async () => {
      try {
        if (!session?.access_token) {
          console.warn('⚠️ No auth session found, skipping payment record creation');
          return;
        }

        const submissionNumber = `SUB-${Date.now()}`;
        const paymentRecord = {
          firmName: firmInfo.firmName,
          firmEIN: firmInfo.ein,
          submissionNumber,
          serviceType,
          clientCount: selectedClients.length,
          amountPaid: totalWithDiscount,
          paymentStatus: 'pending',
          paymentMethod: 'ach',
          clients: selectedClients.map(c => ({
            id: c.id,
            llcName: c.llcName,
            nydosId: c.nydosId,
            ein: c.ein,
            filingType: c.filingType,
            serviceType: c.serviceType, // Include individual client's service type
            exemptionCategory: c.exemptionCategory
          })),
          metadata: {
            ipAddress: await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(d => d.ip).catch(() => 'unknown')
          }
        };

        console.log('📝 Creating payment record:', {
          serviceType,
          clientCount: selectedClients.length,
          amountPaid: totalWithDiscount,
          submissionNumber
        });

        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2c01e603/payments`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paymentRecord)
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Payment record created successfully:', data);
        } else {
          // Silently log - endpoint may not be implemented yet
          console.log('ℹ️ Payment endpoint not available (404) - feature not yet implemented');
        }
      } catch (error) {
        // Silently handle - this is a non-critical feature
        console.log('ℹ️ Payment record feature not available:', error instanceof Error ? error.message : 'Unknown error');
        // Don't block the flow if payment record fails
      }
    };

    // Fire both submissions (non-blocking)
    setSubmissionProgress(20);
    setCurrentStep("Creating payment records");
    
    await Promise.all([
      submitToRewardLion(),
      savePaymentRecord()
    ]);
    
    setSubmissionProgress(60);
    setCurrentStep("Syncing to HighLevel CRM");

    // Save incomplete clients as drafts for future completion
    const saveIncompleteDrafts = async () => {
      try {
        if (!session?.access_token) {
          console.warn('⚠️ No auth session found, skipping draft save');
          return;
        }

        const incompleteClients = clients.filter(c => !c.dataComplete);
        
        if (incompleteClients.length === 0) {
          console.log('✅ No incomplete clients to save as drafts');
          return;
        }

        // Check if firmInfo is available
        if (!firmInfo || !firmInfo.firmName) {
          console.warn('⚠️ Firm info not available, skipping draft save');
          return;
        }

        const draftRecord = {
          firmName: firmInfo.firmName,
          firmEIN: firmInfo.ein,
          clientCount: incompleteClients.length,
          clients: incompleteClients.map(c => ({
            id: c.id,
            llcName: c.llcName,
            nydosId: c.nydosId,
            ein: c.ein,
            formationDate: c.formationDate,
            countryOfFormation: c.countryOfFormation,
            stateOfFormation: c.stateOfFormation,
            contactEmail: c.contactEmail,
            filingType: c.filingType,
            serviceType: c.serviceType,
            entityType: c.entityType,
            exemptionCategory: c.exemptionCategory,
            dataComplete: false
          })),
          createdAt: new Date().toISOString()
        };

        console.log(`📝 Saving ${incompleteClients.length} incomplete clients as drafts`);

        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2c01e603/drafts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(draftRecord)
        });

        if (response.ok) {
          console.log('✅ Draft clients saved successfully');
        } else {
          // Silently log - endpoint may not be implemented yet
          console.log('ℹ️ Draft save endpoint not available (404) - feature not yet implemented');
        }
      } catch (error) {
        // Silently handle - this is a non-critical feature
        console.log('ℹ️ Draft save feature not available:', error instanceof Error ? error.message : 'Unknown error');
        // Don't block the flow if draft save fails
      }
    };

    await saveIncompleteDrafts();

    setSubmissionProgress(80);
    setCurrentStep("Finalizing submission");
    
    // Small delay for user feedback
    setTimeout(() => {
      setSubmissionProgress(100);
      setSubmissionStatus("Submission complete!");
      setCurrentStep("Generating confirmation");
      
      // Wait a moment before completing
      setTimeout(() => {
        setIsSubmitting(false);
        onComplete({
          paymentMethod,
          paymentData,
          billingAddress,
          totalAmount: totalWithDiscount,
          agreementData,
          timestamp: new Date().toISOString()
        });
      }, 1000);
    }, 500);
  };

  return (
    <>
      {/* Submission Loading Screen */}
      <SubmissionLoadingScreen 
        isVisible={isSubmitting}
        progress={submissionProgress}
        statusMessage={submissionStatus}
        clientCount={selectedClients.length}
        currentStep={currentStep}
      />
      
      <Card className="max-w-4xl mx-auto rounded-none border-2 border-[#00274E]">
        <CardHeader className="bg-[#00274E] text-white rounded-none pb-6 border-b-4 border-yellow-400">
          <CardTitle>Step 5 – Payment & Authorization</CardTitle>
          <CardDescription className="text-gray-300">
            Securely collect payment authorization and finalize your bulk transaction.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="mb-4">Payment Summary</h3>
            <div className="space-y-2">
              {/* Show breakdown for monitoring clients */}
              {monitoringClients.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Compliance Monitoring:</span>
                  <span>{monitoringClients.length} × $249 = ${monitoringTotal.toLocaleString()}</span>
                </div>
              )}
              
              {/* Show breakdown for FOREIGN filing clients (with volume discount) */}
              {foreignFilingClients.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Foreign Entity Filing:</span>
                  <span>{foreignFilingClients.length} × ${foreignFilingPricePerClient.toLocaleString()} = ${foreignFilingTotal.toLocaleString()}</span>
                </div>
              )}
              
              {/* Show breakdown for DOMESTIC filing clients (always full price) */}
              {domesticFilingClients.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Domestic Entity Filing:</span>
                  <span>{domesticFilingClients.length} × $398 = ${domesticFilingTotal.toLocaleString()}</span>
                </div>
              )}
              
              {/* Volume discount indicator for FOREIGN filing only */}
              {foreignFilingClients.length > 25 && (
                <div className="flex justify-between text-xs text-green-700">
                  <span>Volume Discount Applied (Foreign Filings):</span>
                  <span>${((FILING_FEE - foreignFilingPricePerClient) * foreignFilingClients.length).toLocaleString()} saved</span>
                </div>
              )}
              
              <Separator className="my-3" />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span>${totalWithDiscount.toFixed(2)}</span>
              </div>
              
              <div className="text-xs text-gray-600 mt-2">
                Total entities: {selectedClients.length} ({monitoringClients.length} Monitoring + {foreignFilingClients.length} Foreign Filing + {domesticFilingClients.length} Domestic Filing)
              </div>
            </div>
          </div>

          {/* Voluntary Filing Compliance Confirmation - appears if any domestic entities are selected */}
          {clients.some(c => paymentSelection.clientIds.includes(c.id) && c.entityType === 'domestic') && (
            <Alert className="bg-amber-50 border-2 border-amber-400">
              <AlertDescription>
                <div className="space-y-3">
                  <h4 className="font-semibold text-amber-900 text-sm uppercase tracking-wide">
                    ⚠️ Voluntary Filing Confirmation
                  </h4>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    <strong>Important Notice:</strong> Certain entities you have selected may not be required to file under NYLTA under current NYDOS guidance. You are electing to submit these filings voluntarily at your Client's direction.
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    By proceeding with payment, you confirm that:
                  </p>
                  <ul className="text-sm text-gray-800 leading-relaxed space-y-1 pl-4">
                    <li>• Selected filings are being submitted voluntarily at the Client's direction</li>
                    <li>• NYLTA.com™ has not represented that such filings are required</li>
                    <li>• You understand these are client-directed submissions</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Payment Method */}
          <div>
            <Label className="mb-3 block">Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={(value: "ach") => setPaymentMethod(value)}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="ach" id="ach" />
                <Label htmlFor="ach" className="cursor-pointer">
                  ACH Debit (Preferred for bulk - no processing fee)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* ACH Fields */}
          {paymentMethod === "ach" && (
            <div className="space-y-4 border rounded-lg p-4">
              <h4 className="text-sm">ACH Banking Information</h4>
              <div>
                <Label htmlFor="accountName">Company Account Name *</Label>
                <Input
                  id="accountName"
                  placeholder="Smith & Associates CPA"
                  value={paymentData.accountName}
                  onChange={(e) => setPaymentData({ ...paymentData, accountName: e.target.value })}
                  className={errors.accountName ? "border-red-500" : "border-2 border-yellow-400"}
                />
                {errors.accountName && <p className="text-sm text-red-500 mt-1">{errors.accountName}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="routingNumber">Company Routing Number *</Label>
                  <Input
                    id="routingNumber"
                    placeholder="021000021"
                    maxLength={9}
                    value={paymentData.routingNumber}
                    onChange={(e) => setPaymentData({ ...paymentData, routingNumber: e.target.value })}
                    className={errors.routingNumber ? "border-red-500" : "border-2 border-yellow-400"}
                  />
                  {errors.routingNumber && <p className="text-sm text-red-500 mt-1">{errors.routingNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="accountNumber">Company Account Number *</Label>
                  <Input
                    id="accountNumber"
                    type="password"
                    placeholder="••••••••••"
                    value={paymentData.accountNumber}
                    onChange={(e) => setPaymentData({ ...paymentData, accountNumber: e.target.value })}
                    className={errors.accountNumber ? "border-red-500" : "border-2 border-yellow-400"}
                  />
                  {errors.accountNumber && <p className="text-sm text-red-500 mt-1">{errors.accountNumber}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="accountNumberConfirm">Confirm Company Account Number *</Label>
                <Input
                  id="accountNumberConfirm"
                  placeholder="Re-enter account number"
                  value={paymentData.accountNumberConfirm}
                  onChange={(e) => setPaymentData({ ...paymentData, accountNumberConfirm: e.target.value })}
                  className={errors.accountNumberConfirm ? "border-red-500" : "border-2 border-yellow-400"}
                />
                {errors.accountNumberConfirm && <p className="text-sm text-red-500 mt-1">{errors.accountNumberConfirm}</p>}
              </div>
            </div>
          )}

          {/* Billing Address */}
          <div className="space-y-4 border rounded-lg p-4">
            <h4 className="text-sm">Billing Address</h4>
            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                placeholder="123 Main St"
                value={billingAddress.street}
                onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                className={errors.street ? "border-red-500" : "border-2 border-yellow-400"}
              />
              {errors.street && <p className="text-sm text-red-500 mt-1">{errors.street}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={billingAddress.city}
                  onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                  className={errors.city ? "border-red-500" : "border-2 border-yellow-400"}
                />
                {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={billingAddress.state}
                  onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                  className={errors.state ? "border-red-500" : "border-2 border-yellow-400"}
                />
                {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="zip">Zip Code *</Label>
              <Input
                id="zip"
                placeholder="10001"
                value={billingAddress.zip}
                onChange={(e) => setBillingAddress({ ...billingAddress, zip: e.target.value })}
                className={errors.zip ? "border-red-500" : "border-2 border-yellow-400"}
              />
              {errors.zip && <p className="text-sm text-red-500 mt-1">{errors.zip}</p>}
            </div>
          </div>

          {/* Bulk Filing Checkout Agreements - Replaces old authorization section */}
          <BulkFilingCheckoutAgreements
            companyName={firmInfo?.firmName || ""}
            companyAddress={
              firmInfo && firmInfo.address && firmInfo.city && firmInfo.state && firmInfo.zipCode
                ? `${firmInfo.address}, ${firmInfo.city}, ${firmInfo.state} ${firmInfo.zipCode}`
                : ""
            }
            onValidationChange={(isValid, data) => {
              setAgreementsValid(isValid);
              setAgreementData(data);
            }}
          />
          {errors.agreements && <p className="text-sm text-red-500">{errors.agreements}</p>}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button 
              type="submit" 
              size="lg" 
              className="min-w-[200px]"
              disabled={!agreementsValid}
            >
              Submit Payment - ${totalWithDiscount.toLocaleString()}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </>
  );
}