import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface TermsOfServiceProps {
  onBack: () => void;
}

export default function TermsOfService({ onBack }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#00274E] text-white py-6 border-b-4 border-yellow-400">
        <div className="max-w-4xl mx-auto px-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:text-yellow-400 hover:bg-[#003366] mb-4 -ml-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-gray-300">NYLTA.com™ — Effective January 1, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to NYLTA.com™, operated by New Way Enterprise LLC, a Florida limited liability company 
              ("Company," "we," "our," or "us"). By accessing or using our platform (the "Platform"), you 
              ("Client," "you," or "your") agree to be bound by these Terms of Service ("Terms").
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you do not agree to these Terms, you may not access or use the Platform.
            </p>
          </section>

          {/* Platform Overview */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">2. Platform Overview</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              NYLTA.com™ is a private, non-government compliance technology platform that provides secure, 
              cloud-based workflows to support compliance with the New York LLC Transparency Act ("NYLTA").
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">Services include:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Compliance Review:</strong> Assessment of NYLTA applicability based on current guidance from the New York Department of State ("NYDOS")</li>
              <li><strong>Compliance Monitoring:</strong> Tracking of NYLTA guidance, interpretations, and implementation updates</li>
              <li><strong>Filing Preparation:</strong> Preparation of beneficial ownership disclosures or exemption attestations</li>
              <li><strong>Filing Facilitation:</strong> Electronic submission to NYDOS when required or voluntarily elected</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              NYLTA.com™ provides technology and facilitation services only. We are not a government agency 
              and do not provide legal, tax, or financial advice.
            </p>
          </section>

          {/* Bulk Pricing */}
          <section className="bg-gray-50 p-6 border-l-4 border-[#00274E]">
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">3. Bulk NYLTA Compliance Pricing</h2>
            <p className="text-gray-700 leading-relaxed mb-4 italic">
              Built for CPAs, Law Firms, and Professional Service Providers
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              NYLTA.com™ offers bulk pricing for firms managing NYLTA compliance for multiple client entities. 
              Our bulk model is designed to be simple, transparent, and flexible, while aligning with evolving 
              guidance from the New York Department of State.
            </p>
            <p className="text-gray-700 leading-relaxed font-semibold mb-6">
              There are no credits, no subscriptions required, and no automatic filings.
            </p>

            {/* Flexible Bulk Orders */}
            <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Bulk Orders</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Submit 1 or more entities per checkout - no minimum required</li>
              <li>Within a bulk order, you may enroll each entity in the service that best fits its current compliance needs</li>
              <li>You may mix services freely within the same bulk order</li>
            </ul>

            {/* Available Services */}
            <h3 className="text-xl font-bold text-gray-900 mb-3">Available Services & Pricing</h3>
            
            <div className="bg-white p-4 border border-gray-300 mb-4">
              <h4 className="text-lg font-bold text-[#00274E] mb-2">Compliance Review & Monitoring</h4>
              <p className="text-2xl font-bold text-gray-900 mb-3">$249 per entity</p>
              <p className="text-gray-700 mb-2">Includes:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Structured NYLTA compliance review</li>
                <li>Secure information collection</li>
                <li>Ongoing monitoring of NYLTA guidance and implementation updates</li>
                <li>Notifications if filing requirements change</li>
              </ul>
              <p className="text-gray-600 italic mt-3 text-sm">
                Monitoring services may be provided even if no filing is required at the time of enrollment.
              </p>
            </div>

            <div className="bg-white p-4 border border-gray-300 mb-6">
              <h4 className="text-lg font-bold text-[#00274E] mb-2">Filing Services</h4>
              <p className="text-2xl font-bold text-gray-900 mb-3">$398 per entity (all-inclusive)</p>
              <p className="text-gray-700 mb-2">Includes:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Compliance review</li>
                <li>Monitoring</li>
                <li>Filing preparation</li>
                <li>Filing facilitation with the New York Department of State (only when legally required or voluntarily elected and expressly authorized)</li>
              </ul>
            </div>

            {/* Mix & Match */}
            <h3 className="text-xl font-bold text-gray-900 mb-3">Mix & Match — One Checkout</h3>
            <p className="text-gray-700 mb-3">You may combine services within the same bulk order.</p>
            <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
              <p className="text-gray-700 font-semibold mb-2">Example:</p>
              <ul className="list-none space-y-1 text-gray-700 mb-3">
                <li>• 5 entities enrolled in Filing Services</li>
                <li>• 5 entities enrolled in Monitoring Services</li>
              </ul>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-green-700">✔ Submit any quantity</div>
                <div className="flex items-center text-green-700">✔ One checkout</div>
                <div className="flex items-center text-green-700">✔ No credits</div>
                <div className="flex items-center text-green-700">✔ No unused balances</div>
              </div>
            </div>

            {/* Monitoring to Filing */}
            <h3 className="text-xl font-bold text-gray-900 mb-3">Monitoring → Filing Later</h3>
            <p className="text-gray-700 mb-3">
              If an entity is enrolled in Monitoring Services only ($249) and later:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-3">
              <li>NYDOS guidance changes and a filing becomes required, or</li>
              <li>The firm elects to file at its discretion,</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Then only the <strong>remaining balance of $149 per entity</strong> is due before filing submission.
            </p>
            <p className="text-gray-700 font-semibold">
              No filing occurs and no balance is charged without express authorization.
            </p>
          </section>

          {/* Voluntary Filings */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">4. Voluntary Filings</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Some entities — including domestic U.S. LLCs — may not be required to file under current guidance.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Firms may still elect to submit a filing at their discretion.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">All voluntary filings:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Require express authorization</li>
              <li>Are clearly disclosed as client-directed</li>
              <li>Are subject to the same pricing and refund terms</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4 font-semibold">
              NYLTA.com™ does not represent that voluntary filings are required.
            </p>
          </section>

          {/* No Automatic Filings */}
          <section className="bg-yellow-50 p-6 border-l-4 border-yellow-400">
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">5. No Automatic Filings. No Automatic Charges.</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>NYLTA.com™ never submits filings automatically</li>
              <li>Filing fees are charged only when authorized</li>
              <li>Monitoring does not obligate future filing</li>
              <li><strong>You remain in control of every submission</strong></li>
            </ul>
          </section>

          {/* Client Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">6. Client Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-3">The Client agrees to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide accurate, complete, and current information for each entity</li>
              <li>Obtain and maintain proper authority from underlying clients</li>
              <li>Review all information prior to authorizing any filing</li>
              <li>Respond promptly to requests for clarification</li>
              <li>Maintain ongoing compliance obligations beyond any filing</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              NYLTA.com™ is not responsible for penalties, delays, or consequences resulting from 
              inaccurate or incomplete information provided by the Client.
            </p>
          </section>

          {/* Refund Policy */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">7. Refund Policy</h2>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Monitoring Services:</h3>
              <p className="text-gray-700 leading-relaxed">
                Compliance Review & Monitoring services are refundable only within thirty (30) days of 
                the purchase date, provided that no substantive monitoring services have commenced. After 
                this period, or once monitoring services begin, fees are non-refundable.
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Filing Services:</h3>
              <p className="text-gray-700 leading-relaxed">
                Filing-related fees (including any $149 balance) are refundable only if requested prior 
                to submission or attempted submission to NYDOS. Once submission is attempted, services 
                are deemed rendered and non-refundable.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Refunds are not provided for inaccurate information, rejections outside our control, or 
              regulatory changes occurring after services are rendered.
            </p>
          </section>

          {/* Who Bulk Pricing Is For */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">8. Who Bulk Pricing Is For</h2>
            <p className="text-gray-700 leading-relaxed mb-3">Bulk pricing is ideal for:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>CPAs and accounting firms</li>
              <li>Law firms</li>
              <li>Registered agents</li>
              <li>Corporate service providers</li>
              <li>Any firm managing NYLTA compliance for multiple entities</li>
            </ul>
          </section>

          {/* Why Firms Choose NYLTA.com */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">9. Why Firms Choose NYLTA.com™</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>NY-focused NYLTA compliance platform</li>
              <li>Compliance-first, not filing-first</li>
              <li>Transparent pricing</li>
              <li>No credit tracking</li>
              <li>No pressure to file</li>
              <li>Built to adapt as guidance evolves</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">10. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All Platform software, workflows, content, and branding are owned by or licensed to 
              New Way Enterprise LLC. Unauthorized use is prohibited.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">11. Disclaimers</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Platform is provided on an "as-is" and "as-available" basis. We do not guarantee 
              filing acceptance, accuracy, or uninterrupted service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              NYLTA.com™ is not affiliated with the New York Department of State or any government agency.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">12. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, liability is limited to the amount paid by the 
              Client for services in the twelve (12) months preceding the claim.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">13. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              The Client agrees to indemnify and hold harmless NYLTA.com™, New Way Enterprise LLC, and 
              their officers, employees, and contractors from claims arising from Client use of the 
              Platform, breach of these Terms, or information provided.
            </p>
          </section>

          {/* Modifications to Services */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">14. Modifications to Services</h2>
            <p className="text-gray-700 leading-relaxed">
              We may modify, suspend, or discontinue services in response to regulatory guidance, system 
              availability, or operational needs. Changes made in good-faith reliance on government 
              guidance do not constitute a breach of these Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">15. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of the State of Florida, without regard to 
              conflict-of-law principles.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">16. Contact Information</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>
                <strong>NYLTA.com™</strong><br />
                A DBA of New Way Enterprise LLC
              </p>
              <p>
                <strong>Physical Address:</strong><br />
                66 W Flagler St, STE 900-11220<br />
                Miami, FL 33130
              </p>
              <p>
                <strong>Mailing Address (Correspondence Only):</strong><br />
                1060 Broadway #1192<br />
                Albany, NY 12204
              </p>
              <p>
                <strong>Email:</strong> support@nylta.com<br />
                <strong>Bulk Support:</strong> bulk@nylta.com
              </p>
            </div>
          </section>

          {/* Entire Agreement */}
          <section className="border-t-2 border-gray-300 pt-8">
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">17. Entire Agreement</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service, together with the Privacy Policy and any applicable service 
              agreements, constitute the entire agreement between the parties.
            </p>
          </section>

          {/* Effective Date */}
          <div className="bg-gray-100 p-6 text-center mt-12">
            <p className="text-gray-700 font-semibold">
              Effective Date: January 1, 2026
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Last Updated: January 1, 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
