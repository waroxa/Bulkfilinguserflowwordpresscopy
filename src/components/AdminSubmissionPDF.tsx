import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ClientData {
  id: string;
  entityName: string;
  ein: string;
  address: string;
  formationDate: string;
  exemptStatus: string;
  exemptionReason?: string;
}

interface SubmissionData {
  confirmationNumber: string;
  firmName: string;
  firmEIN: string;
  submittedDate: string;
  clientCount: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  reviewedBy?: string;
  reviewedDate?: string;
  ipAddress?: string;
  authorization?: {
    authorizedBy: string;
    authorizationDate: string;
    authorizationMethod: string;
    accountLast4?: string;
  };
  clients?: ClientData[];
}

export const generateAdminSubmissionPDF = (submission: SubmissionData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPosition = 20;

  // Add NYLTA Logo
  doc.setFillColor(0, 39, 78); // Navy #00274E
  doc.rect(0, 0, pageWidth, 35, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("NYLTA.COM", margin, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("New York Limited Transparency Act Filing", margin, 27);

  // Reset text color
  doc.setTextColor(0, 0, 0);
  yPosition = 50;

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("ADMIN SUBMISSION REPORT", margin, yPosition);
  yPosition += 10;

  // Generated Date & Time
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  const generatedDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
  doc.text(`Generated: ${generatedDate}`, margin, yPosition);
  yPosition += 10;

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // SUBMISSION INFORMATION
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 39, 78);
  doc.text("SUBMISSION INFORMATION", margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const submissionInfo = [
    ["Confirmation Number:", submission.confirmationNumber],
    ["Status:", submission.status],
    ["Firm Name:", submission.firmName],
    ["Firm EIN:", submission.firmEIN],
    ["Submitted Date:", new Date(submission.submittedDate).toLocaleString()],
    ["Client Count:", submission.clientCount.toString()],
    ["Total Amount:", `$${submission.totalAmount.toFixed(2)}`],
    ["Payment Method:", submission.paymentMethod],
  ];

  if (submission.reviewedBy) {
    submissionInfo.push(["Reviewed By:", submission.reviewedBy]);
  }
  if (submission.reviewedDate) {
    submissionInfo.push(["Reviewed Date:", new Date(submission.reviewedDate).toLocaleString()]);
  }

  submissionInfo.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(value, margin + 55, yPosition);
    yPosition += 6;
  });

  yPosition += 5;

  // IP ADDRESS SECTION
  if (submission.ipAddress) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 39, 78);
    doc.text("SUBMISSION DETAILS", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    
    doc.setFont("helvetica", "bold");
    doc.text("IP Address:", margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(submission.ipAddress, margin + 55, yPosition);
    yPosition += 6;

    doc.setFont("helvetica", "bold");
    doc.text("Submission Source:", margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text("NYLTA.com Bulk Filing Portal", margin + 55, yPosition);
    yPosition += 10;
  }

  // AUTHORIZATION SECTION
  if (submission.authorization) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 39, 78);
    doc.text("AUTHORIZATION DETAILS", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const authInfo = [
      ["Authorized By:", submission.authorization.authorizedBy],
      ["Authorization Date:", new Date(submission.authorization.authorizationDate).toLocaleString()],
      ["Authorization Method:", submission.authorization.authorizationMethod],
    ];

    if (submission.authorization.accountLast4) {
      authInfo.push(["Account Last 4 Digits:", `****${submission.authorization.accountLast4}`]);
    }

    authInfo.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, margin, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(value, margin + 55, yPosition);
      yPosition += 6;
    });

    yPosition += 5;
  }

  // CLIENT DATA TABLE
  if (submission.clients && submission.clients.length > 0) {
    // Check if we need a new page
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 39, 78);
    doc.text("CLIENT DETAILS", margin, yPosition);
    yPosition += 8;

    // Create table data
    const tableData = submission.clients.map(client => [
      client.entityName,
      client.ein,
      client.exemptStatus.toUpperCase(),
      client.formationDate,
      client.exemptionReason || "N/A"
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Entity Name', 'EIN', 'Status', 'Formation Date', 'Exemption Reason']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 39, 78], // Navy
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 30 },
        4: { cellWidth: 45 }
      },
      margin: { left: margin, right: margin }
    });

    // @ts-ignore - autoTable adds finalY property
    yPosition = doc.lastAutoTable.finalY + 10;
  }

  // Footer with timestamp and page number
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const footerY = doc.internal.pageSize.getHeight() - 10;
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    
    // Left: Document info
    doc.text(
      `NYLTA.com Admin Report | Conf# ${submission.confirmationNumber}`,
      margin,
      footerY
    );
    
    // Right: Page number
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin - 20,
      footerY
    );
  }

  // Save the PDF
  const fileName = `NYLTA_Admin_${submission.confirmationNumber}_${Date.now()}.pdf`;
  doc.save(fileName);
};

// Generate summary PDF for multiple submissions
export const generateAdminSummaryPDF = (submissions: SubmissionData[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPosition = 20;

  // Add NYLTA Logo
  doc.setFillColor(0, 39, 78);
  doc.rect(0, 0, pageWidth, 35, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("NYLTA.COM", margin, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Bulk Filing Summary Report", margin, 27);

  doc.setTextColor(0, 0, 0);
  yPosition = 50;

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("SUBMISSIONS SUMMARY", margin, yPosition);
  yPosition += 10;

  // Generated Date
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPosition);
  yPosition += 10;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Summary Statistics
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 39, 78);
  doc.text("SUMMARY STATISTICS", margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const totalRevenue = submissions.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalClients = submissions.reduce((sum, s) => sum + s.clientCount, 0);
  const paidCount = submissions.filter(s => s.status === "Paid" || s.status === "Approved").length;

  const stats = [
    ["Total Submissions:", submissions.length.toString()],
    ["Paid Submissions:", paidCount.toString()],
    ["Total Clients:", totalClients.toString()],
    ["Total Revenue:", `$${totalRevenue.toFixed(2)}`],
  ];

  stats.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(value, margin + 55, yPosition);
    yPosition += 6;
  });

  yPosition += 10;

  // Submissions Table
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 39, 78);
  doc.text("ALL SUBMISSIONS", margin, yPosition);
  yPosition += 8;

  const tableData = submissions.map(sub => [
    sub.confirmationNumber,
    sub.firmName,
    sub.status,
    sub.clientCount.toString(),
    `$${sub.totalAmount.toFixed(2)}`,
    new Date(sub.submittedDate).toLocaleDateString()
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['Confirmation #', 'Firm', 'Status', 'Clients', 'Amount', 'Date']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 39, 78],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 3
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 45 },
      2: { cellWidth: 25 },
      3: { cellWidth: 20 },
      4: { cellWidth: 25 },
      5: { cellWidth: 30 }
    },
    margin: { left: margin, right: margin }
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const footerY = doc.internal.pageSize.getHeight() - 10;
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("NYLTA.com Admin Summary Report", margin, footerY);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, footerY);
  }

  const fileName = `NYLTA_Admin_Summary_${Date.now()}.pdf`;
  doc.save(fileName);
};
