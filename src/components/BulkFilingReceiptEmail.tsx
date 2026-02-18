/**
 * Bulk Filing Receipt Email Template
 * 
 * Transactional email design for bulk filing confirmation.
 * This component generates the HTML structure that can be sent via email service.
 */

interface BulkFilingReceiptEmailProps {
  batchId: string;
  authorizedSignerName: string;
  firmName: string;
  submissionDate: string;
  filingCount: number;
  monitoringCount: number;
  totalPaid: number;
  paymentMethod: string;
  dashboardUrl?: string;
}

export default function BulkFilingReceiptEmail({
  batchId,
  authorizedSignerName,
  firmName,
  submissionDate,
  filingCount,
  monitoringCount,
  totalPaid,
  paymentMethod,
  dashboardUrl = "https://nylta.com/dashboard"
}: BulkFilingReceiptEmailProps) {
  
  // This component returns the HTML structure as a string for email sending
  const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bulk Filing Receipt – Confirmation</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #00274E;
      padding: 32px 24px;
      text-align: center;
      border-bottom: 4px solid #FDB813;
    }
    .logo {
      color: #ffffff;
      font-size: 28px;
      font-weight: bold;
      margin: 0;
      font-family: 'Libre Baskerville', serif;
    }
    .tagline {
      color: #FDB813;
      font-size: 14px;
      margin-top: 8px;
    }
    .content {
      padding: 32px 24px;
    }
    .success-icon {
      text-align: center;
      margin-bottom: 24px;
    }
    .success-icon svg {
      width: 64px;
      height: 64px;
      color: #22c55e;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #00274E;
      text-align: center;
      margin: 0 0 8px 0;
    }
    .subtitle {
      font-size: 16px;
      color: #6b7280;
      text-align: center;
      margin: 0 0 32px 0;
    }
    .receipt-block {
      background-color: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 32px;
    }
    .receipt-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .receipt-row:last-child {
      border-bottom: none;
    }
    .receipt-label {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
    }
    .receipt-value {
      font-size: 14px;
      color: #111827;
      font-weight: 600;
      text-align: right;
    }
    .batch-id {
      background-color: #dbeafe;
      border: 2px solid #3b82f6;
      border-radius: 6px;
      padding: 16px;
      text-align: center;
      margin-bottom: 24px;
    }
    .batch-id-label {
      font-size: 12px;
      color: #1e40af;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .batch-id-value {
      font-size: 20px;
      font-weight: bold;
      color: #1e3a8a;
      font-family: 'Courier New', monospace;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #00274E;
      margin: 32px 0 16px 0;
    }
    .steps {
      margin-bottom: 32px;
    }
    .step {
      display: flex;
      margin-bottom: 16px;
      align-items: flex-start;
    }
    .step-number {
      background-color: #FDB813;
      color: #00274E;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
      flex-shrink: 0;
      margin-right: 16px;
    }
    .step-content {
      flex: 1;
    }
    .step-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 4px 0;
    }
    .step-description {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }
    .cta-button {
      display: block;
      width: 100%;
      max-width: 400px;
      margin: 0 auto 32px auto;
      padding: 16px 32px;
      background-color: #00274E;
      color: #ffffff !important;
      text-decoration: none;
      text-align: center;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      border: 2px solid #FDB813;
    }
    .cta-button:hover {
      background-color: #003d71;
    }
    .support-section {
      background-color: #f9fafb;
      border-left: 4px solid #FDB813;
      padding: 16px;
      margin: 24px 0;
    }
    .support-title {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 8px 0;
    }
    .support-text {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }
    .support-email {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 600;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px;
      text-align: center;
      border-top: 2px solid #e5e7eb;
    }
    .disclaimer {
      font-size: 12px;
      color: #6b7280;
      line-height: 1.6;
      margin: 0 0 16px 0;
    }
    .footer-links {
      font-size: 12px;
      color: #6b7280;
    }
    .footer-link {
      color: #3b82f6;
      text-decoration: none;
      margin: 0 8px;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 24px 16px;
      }
      .receipt-block {
        padding: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1 class="logo">NYLTA.com™</h1>
      <p class="tagline">New York LLC Transparency Act Compliance</p>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Success Icon -->
      <div class="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
        </svg>
      </div>

      <h1 class="title">Bulk Filing Receipt – Confirmation</h1>
      <p class="subtitle">Your bulk submission has been received and authorized</p>

      <!-- Batch ID -->
      <div class="batch-id">
        <div class="batch-id-label">Confirmation / Batch ID</div>
        <div class="batch-id-value">${batchId}</div>
      </div>

      <!-- Receipt Summary -->
      <div class="receipt-block">
        <div class="receipt-row">
          <span class="receipt-label">Authorized Signer</span>
          <span class="receipt-value">${authorizedSignerName}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Firm Name</span>
          <span class="receipt-value">${firmName}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Submission Date</span>
          <span class="receipt-value">${submissionDate}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Filing Count</span>
          <span class="receipt-value">${filingCount} filing${filingCount !== 1 ? 's' : ''}</span>
        </div>
        ${monitoringCount > 0 ? `
        <div class="receipt-row">
          <span class="receipt-label">Monitoring Count</span>
          <span class="receipt-value">${monitoringCount} entit${monitoringCount !== 1 ? 'ies' : 'y'}</span>
        </div>
        ` : ''}
        <div class="receipt-row">
          <span class="receipt-label">Total Paid</span>
          <span class="receipt-value">$${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Payment Method</span>
          <span class="receipt-value">${paymentMethod}</span>
        </div>
      </div>

      <!-- What Happens Next -->
      <h2 class="section-title">What Happens Next</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3 class="step-title">Internal Review</h3>
            <p class="step-description">Our compliance team will review your submissions for completeness and accuracy within 1-2 business days.</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3 class="step-title">Submit to NYDOS</h3>
            <p class="step-description">Once reviewed, filings will be submitted directly to the New York Department of State's system.</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3 class="step-title">Confirmation Report</h3>
            <p class="step-description">You'll receive individual confirmation numbers for each filing once processed by NYDOS.</p>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <a href="${dashboardUrl}" class="cta-button">
        Access Bulk Filing Dashboard
      </a>

      <!-- Support Section -->
      <div class="support-section">
        <h3 class="support-title">Questions or Need Assistance?</h3>
        <p class="support-text">
          Our bulk filing support team is here to help.<br>
          Contact us at <a href="mailto:bulk@nylta.com" class="support-email">bulk@nylta.com</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="disclaimer">
        <strong>Important:</strong> NYLTA.com™ is a private compliance technology platform operated by New Way Enterprise LLC. 
        We are not affiliated with, endorsed by, or operated by the New York Department of State (NYDOS) or any government agency. 
        This platform provides compliance preparation and filing facilitation services only.
      </p>
      <div class="footer-links">
        <a href="https://nylta.com/terms" class="footer-link">Terms of Service</a>
        <a href="https://nylta.com/privacy" class="footer-link">Privacy Policy</a>
        <a href="mailto:bulk@nylta.com" class="footer-link">Support</a>
      </div>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">
        © ${new Date().getFullYear()} NYLTA.com™ – A DBA of New Way Enterprise LLC
      </p>
    </div>
  </div>
</body>
</html>
  `;

  return (
    <div dangerouslySetInnerHTML={{ __html: emailHTML }} />
  );
}

/**
 * Export function to generate email HTML string (for sending via email service)
 */
export function generateBulkFilingReceiptEmailHTML(props: BulkFilingReceiptEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bulk Filing Receipt – Confirmation</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #00274E;
      padding: 32px 24px;
      text-align: center;
      border-bottom: 4px solid #FDB813;
    }
    .logo {
      color: #ffffff;
      font-size: 28px;
      font-weight: bold;
      margin: 0;
      font-family: 'Libre Baskerville', serif;
    }
    .tagline {
      color: #FDB813;
      font-size: 14px;
      margin-top: 8px;
    }
    .content {
      padding: 32px 24px;
    }
    .success-icon {
      text-align: center;
      margin-bottom: 24px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #00274E;
      text-align: center;
      margin: 0 0 8px 0;
    }
    .subtitle {
      font-size: 16px;
      color: #6b7280;
      text-align: center;
      margin: 0 0 32px 0;
    }
    .receipt-block {
      background-color: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 32px;
    }
    .receipt-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .receipt-row:last-child {
      border-bottom: none;
    }
    .receipt-label {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
    }
    .receipt-value {
      font-size: 14px;
      color: #111827;
      font-weight: 600;
      text-align: right;
    }
    .batch-id {
      background-color: #dbeafe;
      border: 2px solid #3b82f6;
      border-radius: 6px;
      padding: 16px;
      text-align: center;
      margin-bottom: 24px;
    }
    .batch-id-label {
      font-size: 12px;
      color: #1e40af;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .batch-id-value {
      font-size: 20px;
      font-weight: bold;
      color: #1e3a8a;
      font-family: 'Courier New', monospace;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #00274E;
      margin: 32px 0 16px 0;
    }
    .steps {
      margin-bottom: 32px;
    }
    .step {
      display: flex;
      margin-bottom: 16px;
      align-items: flex-start;
    }
    .step-number {
      background-color: #FDB813;
      color: #00274E;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
      flex-shrink: 0;
      margin-right: 16px;
    }
    .step-content {
      flex: 1;
    }
    .step-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 4px 0;
    }
    .step-description {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }
    .cta-button {
      display: block;
      width: 100%;
      max-width: 400px;
      margin: 0 auto 32px auto;
      padding: 16px 32px;
      background-color: #00274E;
      color: #ffffff !important;
      text-decoration: none;
      text-align: center;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      border: 2px solid #FDB813;
    }
    .support-section {
      background-color: #f9fafb;
      border-left: 4px solid #FDB813;
      padding: 16px;
      margin: 24px 0;
    }
    .support-title {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 8px 0;
    }
    .support-text {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }
    .support-email {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 600;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px;
      text-align: center;
      border-top: 2px solid #e5e7eb;
    }
    .disclaimer {
      font-size: 12px;
      color: #6b7280;
      line-height: 1.6;
      margin: 0 0 16px 0;
    }
    .footer-links {
      font-size: 12px;
      color: #6b7280;
    }
    .footer-link {
      color: #3b82f6;
      text-decoration: none;
      margin: 0 8px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="logo">NYLTA.com™</h1>
      <p class="tagline">New York LLC Transparency Act Compliance</p>
    </div>
    <div class="content">
      <div class="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64" style="color: #22c55e;">
          <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
        </svg>
      </div>
      <h1 class="title">Bulk Filing Receipt – Confirmation</h1>
      <p class="subtitle">Your bulk submission has been received and authorized</p>
      <div class="batch-id">
        <div class="batch-id-label">Confirmation / Batch ID</div>
        <div class="batch-id-value">${props.batchId}</div>
      </div>
      <div class="receipt-block">
        <div class="receipt-row">
          <span class="receipt-label">Authorized Signer</span>
          <span class="receipt-value">${props.authorizedSignerName}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Firm Name</span>
          <span class="receipt-value">${props.firmName}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Submission Date</span>
          <span class="receipt-value">${props.submissionDate}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Filing Count</span>
          <span class="receipt-value">${props.filingCount} filing${props.filingCount !== 1 ? 's' : ''}</span>
        </div>
        ${props.monitoringCount > 0 ? `
        <div class="receipt-row">
          <span class="receipt-label">Monitoring Count</span>
          <span class="receipt-value">${props.monitoringCount} entit${props.monitoringCount !== 1 ? 'ies' : 'y'}</span>
        </div>
        ` : ''}
        <div class="receipt-row">
          <span class="receipt-label">Total Paid</span>
          <span class="receipt-value">$${props.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Payment Method</span>
          <span class="receipt-value">${props.paymentMethod}</span>
        </div>
      </div>
      <h2 class="section-title">What Happens Next</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3 class="step-title">Internal Review</h3>
            <p class="step-description">Our compliance team will review your submissions for completeness and accuracy within 1-2 business days.</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3 class="step-title">Submit to NYDOS</h3>
            <p class="step-description">Once reviewed, filings will be submitted directly to the New York Department of State's system.</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3 class="step-title">Confirmation Report</h3>
            <p class="step-description">You'll receive individual confirmation numbers for each filing once processed by NYDOS.</p>
          </div>
        </div>
      </div>
      <a href="${props.dashboardUrl || 'https://nylta.com/dashboard'}" class="cta-button">
        Access Bulk Filing Dashboard
      </a>
      <div class="support-section">
        <h3 class="support-title">Questions or Need Assistance?</h3>
        <p class="support-text">
          Our bulk filing support team is here to help.<br>
          Contact us at <a href="mailto:bulk@nylta.com" class="support-email">bulk@nylta.com</a>
        </p>
      </div>
    </div>
    <div class="footer">
      <p class="disclaimer">
        <strong>Important:</strong> NYLTA.com™ is a private compliance technology platform operated by New Way Enterprise LLC. 
        We are not affiliated with, endorsed by, or operated by the New York Department of State (NYDOS) or any government agency. 
        This platform provides compliance preparation and filing facilitation services only.
      </p>
      <div class="footer-links">
        <a href="https://nylta.com/terms" class="footer-link">Terms of Service</a>
        <a href="https://nylta.com/privacy" class="footer-link">Privacy Policy</a>
        <a href="mailto:bulk@nylta.com" class="footer-link">Support</a>
      </div>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">
        © ${new Date().getFullYear()} NYLTA.com™ – A DBA of New Way Enterprise LLC
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
