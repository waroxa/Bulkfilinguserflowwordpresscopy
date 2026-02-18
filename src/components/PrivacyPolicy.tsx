import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
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
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-300">NYLTA.com™ — Effective January 1, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              NYLTA.com™ (the "Platform"), operated by New Way Enterprise LLC ("Company," "we," "our," or "us"), 
              is committed to protecting the privacy and security of your personal information.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
              you use our Platform to facilitate compliance with the New York LLC Transparency Act ("NYLTA").
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using the Platform, you agree to the collection and use of information in accordance with 
              this Privacy Policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">2. Information We Collect</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">2.1 Information You Provide</h3>
              <p className="text-gray-700 mb-3">We collect information that you voluntarily provide when using the Platform:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Account Information:</strong> Name, email address, phone number, firm name, professional credentials, and business address</li>
                <li><strong>Entity Information:</strong> LLC names, NYDOS IDs, formation dates, addresses, and ownership structures</li>
                <li><strong>Beneficial Owner Information:</strong> Names, addresses, dates of birth, identification documents, and ownership percentages</li>
                <li><strong>Company Applicant Information:</strong> Names, addresses, and identification details for authorized filers</li>
                <li><strong>Payment Information:</strong> Bank account details (for ACH), billing addresses, and transaction records</li>
                <li><strong>Exemption Information:</strong> Exemption category selections and related documentation</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-gray-700 mb-3">We automatically collect certain information when you access the Platform:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the Platform, and click patterns</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
                <li><strong>Log Data:</strong> Access times, error logs, and system diagnostics</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2.3 Information from Third Parties</h3>
              <p className="text-gray-700 mb-3">We may receive information from:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Payment Processors:</strong> Transaction confirmations and payment status updates</li>
                <li><strong>NYDOS:</strong> Filing status updates and acknowledgment receipts</li>
                <li><strong>CRM Systems:</strong> Contact management and workflow automation data</li>
              </ul>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-3">We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Service Delivery:</strong> To provide compliance review, monitoring, filing preparation, and filing facilitation services</li>
              <li><strong>Account Management:</strong> To create and manage your account, authenticate access, and provide customer support</li>
              <li><strong>Payment Processing:</strong> To process payments, prevent fraud, and maintain financial records</li>
              <li><strong>Filing Submissions:</strong> To prepare and submit filings to NYDOS on your behalf when authorized</li>
              <li><strong>Compliance Monitoring:</strong> To track regulatory changes and notify you of updated filing requirements</li>
              <li><strong>Communication:</strong> To send service updates, compliance alerts, and administrative messages</li>
              <li><strong>Platform Improvement:</strong> To analyze usage patterns, improve features, and enhance user experience</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
            </ul>
          </section>

          {/* How We Share Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">4. How We Share Your Information</h2>
            <p className="text-gray-700 mb-4">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">4.1 Government Agencies</h3>
                <p className="text-gray-700">
                  When you authorize a filing, we submit the required information to the New York Department 
                  of State as part of our filing facilitation services.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">4.2 Service Providers</h3>
                <p className="text-gray-700 mb-2">
                  We engage trusted third-party service providers to support Platform operations:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Payment processors (ACH and card processing)</li>
                  <li>Cloud hosting and data storage providers</li>
                  <li>CRM and workflow automation systems</li>
                  <li>Email delivery and notification services</li>
                </ul>
                <p className="text-gray-700 mt-2">
                  All service providers are contractually obligated to protect your information.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">4.3 Legal Requirements</h3>
                <p className="text-gray-700">
                  We may disclose your information when required by law, court order, subpoena, or to 
                  protect our rights, property, or safety.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">4.4 Business Transfers</h3>
                <p className="text-gray-700">
                  In the event of a merger, acquisition, or sale of assets, your information may be 
                  transferred to the successor entity.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">4.5 With Your Consent</h3>
                <p className="text-gray-700">
                  We may share your information with other parties when you provide explicit consent.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="bg-blue-50 p-6 border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Encryption:</strong> Data is encrypted in transit (TLS/SSL) and at rest</li>
              <li><strong>Access Controls:</strong> Role-based access restrictions and multi-factor authentication</li>
              <li><strong>Secure Infrastructure:</strong> Cloud-hosted on enterprise-grade platforms with regular security audits</li>
              <li><strong>Data Backups:</strong> Regular automated backups with secure storage</li>
              <li><strong>Monitoring:</strong> Continuous system monitoring for unauthorized access attempts</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              While we take reasonable precautions, no system is completely secure. You are responsible 
              for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">6. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We retain your information for as long as necessary to provide services and comply with 
              legal obligations:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Active Accounts:</strong> Information is retained while your account is active and for monitoring periods</li>
              <li><strong>Filing Records:</strong> Filing-related information is retained for at least seven (7) years for regulatory compliance</li>
              <li><strong>Payment Records:</strong> Financial records are retained in accordance with tax and accounting requirements</li>
              <li><strong>Legal Holds:</strong> Information subject to legal holds or investigations is retained as required</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              After the retention period expires, we securely delete or anonymize your information.
            </p>
          </section>

          {/* Your Rights and Choices */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">7. Your Rights and Choices</h2>
            <p className="text-gray-700 mb-3">You have the following rights regarding your information:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your information (subject to legal retention requirements)</li>
              <li><strong>Data Portability:</strong> Request a copy of your information in a structured, machine-readable format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications (compliance notifications will continue)</li>
              <li><strong>Account Closure:</strong> Close your account at any time (subject to outstanding obligations)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, contact us at support@nylta.com. We will respond within 30 days.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your experience:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Essential Cookies:</strong> Required for authentication, security, and basic Platform functionality</li>
              <li><strong>Performance Cookies:</strong> Help us understand how you use the Platform and identify areas for improvement</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You can control cookies through your browser settings, but disabling essential cookies may 
              affect Platform functionality.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">9. Third-Party Links</h2>
            <p className="text-gray-700 leading-relaxed">
              The Platform may contain links to third-party websites (e.g., NYDOS, payment processors). 
              We are not responsible for the privacy practices of these external sites. We encourage you 
              to review their privacy policies before providing any information.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              The Platform is not intended for individuals under 18 years of age. We do not knowingly 
              collect personal information from children. If we discover that we have inadvertently 
              collected information from a child, we will delete it immediately.
            </p>
          </section>

          {/* California Privacy Rights */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">11. California Privacy Rights (CCPA)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you are a California resident, you have additional rights under the California Consumer 
              Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Right to know what personal information we collect, use, and disclose</li>
              <li>Right to request deletion of your personal information</li>
              <li>Right to opt-out of the "sale" of personal information (we do not sell personal information)</li>
              <li>Right to non-discrimination for exercising your privacy rights</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, contact us at support@nylta.com or call us at the number provided below.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">12. International Users</h2>
            <p className="text-gray-700 leading-relaxed">
              The Platform is operated in the United States and is intended for users in the United States. 
              If you access the Platform from outside the U.S., your information will be transferred to, 
              stored, and processed in the United States, where data protection laws may differ from those 
              in your jurisdiction.
            </p>
          </section>

          {/* Changes to This Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">13. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices or 
              applicable laws. We will notify you of material changes by:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Posting the updated Privacy Policy on the Platform with a new "Effective Date"</li>
              <li>Sending an email notification to your registered email address</li>
              <li>Displaying a prominent notice on the Platform</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Your continued use of the Platform after changes are posted constitutes acceptance of the 
              updated Privacy Policy.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-bold text-[#00274E] mb-4">14. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, 
              please contact us:
            </p>
            <div className="bg-gray-50 p-6 border border-gray-300">
              <p className="text-gray-700 mb-2">
                <strong>NYLTA.com™</strong><br />
                A DBA of New Way Enterprise LLC
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Physical Address:</strong><br />
                66 W Flagler St, STE 900-11220<br />
                Miami, FL 33130
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Mailing Address (Correspondence Only):</strong><br />
                1060 Broadway #1192<br />
                Albany, NY 12204
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> support@nylta.com<br />
                <strong>Privacy Inquiries:</strong> privacy@nylta.com<br />
                <strong>Bulk Support:</strong> bulk@nylta.com
              </p>
            </div>
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
