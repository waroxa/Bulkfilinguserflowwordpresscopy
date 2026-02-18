import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface BulkFilingCheckoutAgreementsProps {
  companyName: string;
  companyAddress: string;
  onValidationChange: (isValid: boolean, data: AgreementData) => void;
}

export interface AgreementData {
  bulkServiceAgreed: boolean;
  termsAgreed: boolean;
  initials: string;
  fullLegalName: string;
}

export default function BulkFilingCheckoutAgreements({
  companyName,
  companyAddress,
  onValidationChange,
}: BulkFilingCheckoutAgreementsProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [bulkServiceAgreed, setBulkServiceAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [initials, setInitials] = useState("");
  const [fullLegalName, setFullLegalName] = useState("");

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrolledToBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 1;
    
    if (scrolledToBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  // Update parent component whenever validation state changes
  const updateValidation = (
    bulkService: boolean,
    terms: boolean,
    init: string,
    fullName: string
  ) => {
    const isValid = bulkService && terms && init.trim().length >= 2 && fullName.trim().length > 0;
    onValidationChange(isValid, {
      bulkServiceAgreed: bulkService,
      termsAgreed: terms,
      initials: init,
      fullLegalName: fullName,
    });
  };

  const handleBulkServiceChange = (checked: boolean) => {
    setBulkServiceAgreed(checked);
    updateValidation(checked, termsAgreed, initials, fullLegalName);
  };

  const handleTermsChange = (checked: boolean) => {
    setTermsAgreed(checked);
    updateValidation(bulkServiceAgreed, checked, initials, fullLegalName);
  };

  const handleInitialsChange = (value: string) => {
    setInitials(value);
    updateValidation(bulkServiceAgreed, termsAgreed, value, fullLegalName);
  };

  // Validation handler for fullLegalName
  const handleFullLegalNameChange = (value: string) => {
    setFullLegalName(value);
    // Validate that it's a proper full name (at least first and last name)
    const isValid = value.trim().split(/\s+/).length >= 2 && value.trim().length >= 3;
    const allValid = bulkServiceAgreed && termsAgreed && initials.length >= 2 && isValid;
    
    if (onValidationChange) {
      onValidationChange(allValid, {
        bulkServiceAgreed,
        termsAgreed,
        initials,
        fullLegalName: value
      });
    }
  };

  return (
    <Card className="rounded-none border-2 border-[#00274E]">
      <CardHeader className="bg-[#00274E] text-white rounded-none">
        <CardTitle>Bulk Filing Checkout Agreements</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Scrollable Agreement Container */}
        <div className="space-y-3">
          <Label className="text-base text-gray-900">
            Bulk Service / ACH Authorization Agreement
          </Label>
          
          <div
            className="border-2 border-gray-300 rounded-none h-96 overflow-y-auto p-6 bg-gray-50"
            onScroll={handleScroll}
          >
            <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
              <div>
                <h3 className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  NYLTA.com™ BULK CLIENT SERVICE AGREEMENT & ACH AUTHORIZATION
                </h3>
                <p className="text-gray-600 italic mb-4">
                  Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-gray-600 mb-2">
                  Business Name: NYLTA.com™ (a DBA of New Way Enterprise LLC)
                </p>
                {companyName && (
                  <p className="text-gray-600 mb-4">
                    <strong>Client Firm:</strong> {companyName}
                  </p>
                )}
              </div>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>1. Agreement to Terms</strong>
                </h4>
                <p className="mb-3">
                  By creating an account, submitting information, or authorizing payment through the NYLTA.com™ platform (the "Platform"), the undersigned firm or organization ("Client," "you") agrees to this Bulk Client Service Agreement & ACH Authorization ("Agreement").
                </p>
                <p className="mb-3">
                  NYLTA.com™ is operated by New Way Enterprise LLC, a Florida limited liability company ("Company," "we," "our," or "us").
                </p>
                <p className="mb-3">
                  This Agreement governs the Client's use of the Platform to perform compliance review, compliance monitoring, filing preparation, and filing facilitation services related to the New York LLC Transparency Act ("NYLTA") on behalf of multiple client entities.
                </p>
                <p>
                  If you do not agree to this Agreement, you may not use the Platform.
                </p>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>2. Overview of Services</strong>
                </h4>
                <p className="mb-3">
                  NYLTA.com™ is a private, non-government compliance technology platform that provides secure, cloud-based workflows to support NYLTA compliance.
                </p>
                <p className="mb-3">
                  For bulk clients — including law firms, accounting firms, and other professional service providers — the Platform enables centralized intake, management, and tracking of multiple client entities.
                </p>
                <p className="mb-2">Services may include, individually or in combination:</p>
                <ul className="list-disc pl-6 space-y-1 mb-3">
                  <li><strong>Compliance Review</strong> to assess applicability of NYLTA requirements based on current guidance issued by the New York Department of State ("NYDOS");</li>
                  <li><strong>Compliance Review & Monitoring</strong> to track NYLTA-related guidance, interpretations, and implementation updates;</li>
                  <li><strong>Filing Preparation</strong> of beneficial ownership disclosures or exemption attestations when applicable; and</li>
                  <li><strong>Filing Facilitation</strong> with NYDOS only when legally required or voluntarily elected and expressly authorized.</li>
                </ul>
                <p>
                  NYLTA.com™ provides technology and facilitation services only. We are not a government agency and do not provide legal, tax, or financial advice. Responsibility for legal determinations, client advice, and the accuracy of submitted information remains with the Client.
                </p>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>3. Bulk Orders, Entity Volume & Service Selection</strong>
                </h4>
                <p className="mb-3">
                  There is no minimum number of entities required to use the Platform.
                </p>
                <p className="mb-3">
                  The Client may submit any number of entities, from a single entity to multiple entities, in a single checkout transaction.
                </p>
                <p className="mb-2">For each entity, the Client may independently select one or more services, including:</p>
                <ul className="list-disc pl-6 space-y-1 mb-3">
                  <li>Compliance Review & Monitoring only; and/or</li>
                  <li>Filing services (which include monitoring).</li>
                </ul>
                <p className="mb-3">
                  The Client may mix different service selections across entities within the same checkout.
                </p>
                <p className="mb-3">
                  Fees are calculated solely based on the services selected for each entity at checkout.
                </p>
                <p>
                  There are no prepaid balances, credits, minimum commitments, or rollover value.
                </p>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>4. Service Commencement & Authorization</strong>
                </h4>
                <p className="mb-3">
                  NYLTA.com™ may provide compliance review and monitoring services before or after the effective date of NYLTA, depending on current regulatory guidance.
                </p>
                <p className="mb-2">Filing preparation and filing facilitation services are performed only when:</p>
                <ul className="list-disc pl-6 space-y-1 mb-3">
                  <li>A filing is legally required under applicable guidance; or</li>
                  <li>A filing is voluntarily elected at the Client's discretion;</li>
                </ul>
                <p className="mb-2">and in all cases:</p>
                <ul className="list-disc pl-6 space-y-1 mb-3">
                  <li>Government filing systems are technically available; and</li>
                  <li>The Client provides express authorization for each entity.</li>
                </ul>
                <p>
                  Submission of information for review or monitoring does not result in automatic filing.
                </p>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>5. Voluntary / Discretionary Filings</strong>
                </h4>
                <p className="mb-3">
                  The Client acknowledges that, under current NYDOS guidance, certain entities — including domestic U.S. LLCs — may not be required to file under NYLTA at this time.
                </p>
                <p className="mb-3">
                  The Platform may permit the Client to voluntarily elect to submit a filing for such entities.
                </p>
                <p className="mb-2">By authorizing a voluntary filing, the Client expressly acknowledges that:</p>
                <ul className="list-disc pl-6 space-y-1 mb-3">
                  <li>The filing is submitted at the Client's discretion;</li>
                  <li>The filing is made at the direction of the underlying entity; and</li>
                  <li>NYLTA.com™ has not represented that such filing is required.</li>
                </ul>
                <p>
                  Voluntary filings are treated as client-directed submissions and are subject to the same authorization, fee, and refund terms as required filings.
                </p>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>6. Fees</strong>
                </h4>
                
                <div className="mb-3">
                  <p className="text-gray-900 mb-1"><strong>(a) Compliance Review & Monitoring</strong></p>
                  <p className="mb-2">Compliance Review & Monitoring services are offered at $249.00 per entity, covering up to twelve (12) months of monitoring.</p>
                  <p>Monitoring services may be provided even if no filing is required at the time of enrollment.</p>
                </div>

                <div className="mb-3">
                  <p className="text-gray-900 mb-1"><strong>(b) Filing Services</strong></p>
                  <p>Filing services are offered at a total all-inclusive fee of $398.00 per entity, which includes Compliance Review & Monitoring.</p>
                </div>

                <div className="mb-3">
                  <p className="text-gray-900 mb-1"><strong>(c) Filing Balance When Monitoring Was Purchased First</strong></p>
                  <p className="mb-2">If Compliance Review & Monitoring services were previously purchased for an entity and:</p>
                  <ul className="list-disc pl-6 space-y-1 mb-2">
                    <li>A filing later becomes required; or</li>
                    <li>The Client voluntarily elects to file,</li>
                  </ul>
                  <p>the Client will be required to pay only the remaining balance of $149.00 per entity prior to submission.</p>
                </div>

                <div>
                  <p className="text-gray-900 mb-1"><strong>(d) Authorization Required</strong></p>
                  <p>No filing will be submitted and no filing-related fee will be charged unless and until the Client provides express authorization for that specific entity.</p>
                </div>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>7. Client Responsibilities</strong>
                </h4>
                <p className="mb-2">The Client agrees to:</p>
                <ul className="list-disc pl-6 space-y-1 mb-3">
                  <li>Provide accurate, complete, and current information for each entity;</li>
                  <li>Obtain and maintain proper authority from underlying clients;</li>
                  <li>Review all information prior to authorizing any filing;</li>
                  <li>Respond promptly to requests for clarification; and</li>
                  <li>Maintain ongoing compliance obligations beyond any filing.</li>
                </ul>
                <p>
                  NYLTA.com™ is not responsible for penalties, delays, or consequences resulting from inaccurate or incomplete information provided by the Client.
                </p>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>8. Refund Policy</strong>
                </h4>
                <div className="mb-3">
                  <p className="text-gray-900 mb-1"><strong>Monitoring Services:</strong></p>
                  <p>Compliance Review & Monitoring services are refundable only within thirty (30) days of the purchase date, provided that no substantive monitoring services have commenced. After this period, or once monitoring services begin, fees are non-refundable.</p>
                </div>
                <div className="mb-3">
                  <p className="text-gray-900 mb-1"><strong>Filing Services:</strong></p>
                  <p>Filing-related fees (including any $149 balance) are refundable only if requested prior to submission or attempted submission to NYDOS. Once submission is attempted, services are deemed rendered and non-refundable.</p>
                </div>
                <p>
                  Refunds are not provided for inaccurate information, rejections outside our control, or regulatory changes occurring after services are rendered.
                </p>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>9. Authorization for Payment (ACH)</strong>
                </h4>
                <p className="mb-3">
                  The Client authorizes NYLTA.com™ ("Merchant") to electronically debit the Client's designated bank account via the Automated Clearing House (ACH) network for the total amount due for the services expressly selected and authorized at checkout.
                </p>
                <p className="mb-3">
                  The Client also authorizes electronic credit entries to the same account in the event of an erroneous debit or approved refund.
                </p>
                <p>
                  Each completed bulk checkout constitutes a separate batch authorization. Any future services require a new authorization.
                </p>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>10. Returned Payments & Fees</strong>
                </h4>
                <p>
                  The Client agrees to maintain sufficient funds to cover all authorized debits. A $25 returned-item fee may be assessed for any ACH debit returned unpaid. Returned or rejected payments do not relieve the Client of payment obligations.
                </p>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>11. No Automatic Filings</strong>
                </h4>
                <p>
                  NYLTA.com™ does not automatically submit filings to any government agency. All filings require express Client authorization.
                </p>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>12. Intellectual Property</strong>
                </h4>
                <p>
                  All Platform software, workflows, content, and branding are owned by or licensed to New Way Enterprise LLC. Unauthorized use is prohibited.
                </p>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>13. Modifications to Services</strong>
                </h4>
                <p>
                  We may modify, suspend, or discontinue services in response to regulatory guidance, system availability, or operational needs. Changes made in good-faith reliance on government guidance do not constitute a breach of this Agreement.
                </p>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>14. Disclaimers</strong>
                </h4>
                <p className="mb-3">
                  The Platform is provided on an "as-is" and "as-available" basis. We do not guarantee filing acceptance, accuracy, or uninterrupted service.
                </p>
                <p>
                  NYLTA.com™ is not affiliated with the New York Department of State or any government agency.
                </p>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>15. Limitation of Liability</strong>
                </h4>
                <p>
                  To the maximum extent permitted by law, liability is limited to the amount paid by the Client for services in the twelve (12) months preceding the claim.
                </p>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>16. Indemnification</strong>
                </h4>
                <p>
                  The Client agrees to indemnify and hold harmless NYLTA.com™, New Way Enterprise LLC, and their officers, employees, and contractors from claims arising from Client use of the Platform, breach of this Agreement, or information provided.
                </p>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>17. Governing Law</strong>
                </h4>
                <p>
                  This Agreement is governed by the laws of the State of Florida, without regard to conflict-of-law principles.
                </p>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>18. Entire Agreement</strong>
                </h4>
                <p>
                  This Agreement, together with the Terms of Service and Privacy Policy, constitutes the entire agreement between the parties.
                </p>
              </section>

              <section className="pt-4">
                <h4 className="text-gray-900 mb-2">
                  <strong>19. Contact Information</strong>
                </h4>
                <p className="mb-3">
                  NYLTA.com™<br />
                  A DBA of New Way Enterprise LLC<br />
                  66 W Flagler St, STE 900-11220<br />
                  Miami, FL 33130
                </p>
                <p className="mb-3">
                  Mailing Address (Correspondence Only):<br />
                  1060 Broadway #1192<br />
                  Albany, NY 12204
                </p>
                <p>
                  bulk@nylta.com
                </p>
              </section>

              <section className="pt-4 border-t border-gray-300 mt-6">
                <p className="italic text-gray-600 text-sm">
                  By scrolling to the bottom of this box and completing the authorization fields below, you acknowledge that you have read and agree to be bound by this Bulk Client Service Agreement & ACH Authorization.
                </p>
              </section>
            </div>
          </div>

          {!hasScrolledToBottom && (
            <p className="text-sm text-blue-600 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              Please scroll to the bottom to continue
            </p>
          )}
        </div>

        {/* Agreement Checkboxes and Initials */}
        {hasScrolledToBottom && (
          <div className="space-y-6 pt-4 border-t-2 border-gray-200">
            {/* Bulk Service Agreement Checkbox */}
            <div className={`border rounded-lg p-4 ${bulkServiceAgreed ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="bulkServiceAgreement"
                  checked={bulkServiceAgreed}
                  onCheckedChange={(checked) => handleBulkServiceChange(checked as boolean)}
                  className="mt-0.5 flex-shrink-0"
                />
                <label htmlFor="bulkServiceAgreement" className="text-sm cursor-pointer leading-relaxed flex-1 text-gray-900">
                  I have read and agree to the Bulk Service / ACH Authorization Agreement, including the full payment terms.
                </label>
              </div>
            </div>

            {/* Initials Field */}
            <div>
              <Label htmlFor="signerInitials" className="text-gray-900">
                Authorized Signer Initials *
              </Label>
              <Input
                id="signerInitials"
                placeholder="Enter your initials"
                value={initials}
                onChange={(e) => handleInitialsChange(e.target.value)}
                maxLength={4}
                className="border-2 border-yellow-400 uppercase"
                style={{ textTransform: 'uppercase' }}
              />
              <p className="text-sm text-gray-600 mt-1">
                Typing your initials here serves as your electronic signature authorizing ACH payment in full for the selected filings.
              </p>
            </div>

            {/* Full Legal Name Field */}
            <div>
              <Label htmlFor="fullLegalName" className="text-gray-900">
                Authorized Signer Full Legal Name *
              </Label>
              <Input
                id="fullLegalName"
                placeholder="Enter your full legal name"
                value={fullLegalName}
                onChange={(e) => handleFullLegalNameChange(e.target.value)}
                className="border-2 border-yellow-400"
              />
              <p className="text-sm text-gray-600 mt-1">
                Enter the full legal name of the authorized signer.
              </p>
            </div>

            {/* Terms of Service Checkbox */}
            <div className={`border rounded-lg p-4 ${termsAgreed ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="termsAgreement"
                  checked={termsAgreed}
                  onCheckedChange={(checked) => handleTermsChange(checked as boolean)}
                  className="mt-0.5 flex-shrink-0"
                />
                <label htmlFor="termsAgreement" className="text-sm cursor-pointer leading-relaxed flex-1 text-gray-900">
                  I have read and agree to the{" "}
                  <a 
                    href="/terms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a 
                    href="/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </a>.
                </label>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}