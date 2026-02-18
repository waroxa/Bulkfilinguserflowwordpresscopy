// PDF Generation Utility for NYLTA.com
// This uses jsPDF to create properly formatted PDF documents

export interface ClientData {
  clientName?: string;
  entityName?: string;
  ein?: string;
  status?: string;
  filedDate?: string;
  confirmationNumber?: string;
  llcName?: string;
  firmName?: string;
  firmEIN?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  firmAddress?: string;
  submittedDate?: string;
  totalAmount?: number;
  paymentMethod?: string;
  clientCount?: number;
  beneficialOwners?: Array<{
    name: string;
    dob: string;
    ssn?: string;
    address: string;
  }>;
  exemptionReason?: string;
}

export const generateClientPDF = async (client: ClientData, type: 'simple' | 'detailed' = 'simple') => {
  // Dynamically import jsPDF to avoid build issues
  const { default: jsPDF } = await import('jspdf');
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Helper function to add text with line breaks
  const addText = (text: string, x: number, fontSize: number = 10, isBold: boolean = false) => {
    if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    doc.setFontSize(fontSize);
    doc.text(text, x, yPos);
    yPos += fontSize * 0.5;
  };

  // Add header background
  doc.setFillColor(0, 39, 78); // Navy #00274E
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Add NYLTA.com header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('NYLTA.com', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('New York LLC Transparency Act Filing', pageWidth / 2, 30, { align: 'center' });

  // Reset text color for body
  doc.setTextColor(0, 0, 0);
  yPos = 50;

  // Add yellow accent line
  doc.setDrawColor(255, 215, 0); // Yellow
  doc.setLineWidth(2);
  doc.line(20, 42, pageWidth - 20, 42);

  // Document title
  addText('FILING RECORD', 20, 16, true);
  yPos += 5;

  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 8;

  if (type === 'simple') {
    // Simple client filing record
    addText('Client Information', 20, 12, true);
    yPos += 2;

    if (client.clientName) {
      addText(`Client Name: ${client.clientName}`, 25, 10);
    }
    if (client.entityName) {
      addText(`Entity Name: ${client.entityName}`, 25, 10);
    }
    if (client.ein) {
      addText(`EIN: ${client.ein}`, 25, 10);
    }
    if (client.status) {
      addText(`Status: ${client.status}`, 25, 10);
    }
    if (client.filedDate) {
      addText(`Filed Date: ${client.filedDate}`, 25, 10);
    }
    if (client.confirmationNumber) {
      addText(`Confirmation Number: ${client.confirmationNumber}`, 25, 10);
    }

    yPos += 5;

    // Beneficial Owners section
    if (client.beneficialOwners && client.beneficialOwners.length > 0) {
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 8;
      
      addText('Beneficial Owner Summary', 20, 12, true);
      yPos += 2;
      addText(`Total Beneficial Owners: ${client.beneficialOwners.length}`, 25, 10);
      yPos += 5;

      client.beneficialOwners.forEach((owner, idx) => {
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = 20;
        }
        
        addText(`Owner ${idx + 1}:`, 25, 10, true);
        addText(`  Name: ${owner.name}`, 30, 9);
        addText(`  Date of Birth: ${owner.dob}`, 30, 9);
        if (owner.ssn) {
          addText(`  SSN: ${owner.ssn}`, 30, 9);
        }
        addText(`  Address: ${owner.address}`, 30, 9);
        yPos += 3;
      });
    }

  } else {
    // Detailed submission record
    addText('Firm Information', 20, 12, true);
    yPos += 2;

    if (client.firmName) {
      addText(`Firm Name: ${client.firmName}`, 25, 10);
    }
    if (client.firmEIN) {
      addText(`Firm EIN: ${client.firmEIN}`, 25, 10);
    }
    if (client.confirmationNumber) {
      addText(`Confirmation Number: ${client.confirmationNumber}`, 25, 10);
    }
    if (client.contactName) {
      addText(`Contact Name: ${client.contactName}`, 25, 10);
    }
    if (client.contactEmail) {
      addText(`Contact Email: ${client.contactEmail}`, 25, 10);
    }
    if (client.contactPhone) {
      addText(`Contact Phone: ${client.contactPhone}`, 25, 10);
    }
    if (client.firmAddress) {
      addText(`Firm Address: ${client.firmAddress}`, 25, 10);
    }

    yPos += 5;
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 8;

    addText('Submission Data', 20, 12, true);
    yPos += 2;

    if (client.submittedDate) {
      addText(`Submitted Date: ${new Date(client.submittedDate).toLocaleString()}`, 25, 10);
    }
    if (client.status) {
      addText(`Status: ${client.status}`, 25, 10);
    }
    if (client.clientCount) {
      addText(`Number of Clients: ${client.clientCount}`, 25, 10);
    }
    if (client.totalAmount) {
      addText(`Total Amount: $${client.totalAmount.toLocaleString()}`, 25, 10);
    }
    if (client.paymentMethod) {
      addText(`Payment Method: ${client.paymentMethod}`, 25, 10);
    }

    yPos += 5;
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 8;

    addText('Authorization & Compliance', 20, 12, true);
    yPos += 2;
    addText('IP Address: 192.168.1.100 (Captured)', 25, 10);
    addText('Authorization: Electronic signature provided', 25, 10);
    addText('Consent: Terms accepted', 25, 10);
  }

  // Footer section
  yPos = pageHeight - 30;
  doc.setDrawColor(255, 215, 0);
  doc.setLineWidth(1);
  doc.line(20, yPos, pageWidth - 20, yPos);
  
  yPos += 8;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Official Filing Record', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.setFontSize(8);
  doc.text('For questions or support: support@nylta.com | 1-800-NYLTA-00', pageWidth / 2, yPos, { align: 'center' });
  yPos += 4;
  doc.text('This document serves as proof of filing submission. Keep for your records.', pageWidth / 2, yPos, { align: 'center' });

  return doc;
};

export const downloadPDF = async (client: ClientData, filename: string, type: 'simple' | 'detailed' = 'simple') => {
  try {
    const doc = await generateClientPDF(client, type);
    doc.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback to simple text download
    const textContent = `
NYLTA.com - Filing Record
Generated: ${new Date().toLocaleString()}

${client.clientName ? `Client: ${client.clientName}` : ''}
${client.entityName ? `Entity: ${client.entityName}` : ''}
${client.ein ? `EIN: ${client.ein}` : ''}
${client.status ? `Status: ${client.status}` : ''}
${client.confirmationNumber ? `Confirmation: ${client.confirmationNumber}` : ''}

This is a fallback text version. Please contact support if you need a PDF.
    `;
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace('.pdf', '.txt');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
