import { jsPDF } from 'jspdf';
import { Client, FirmInfo } from '../App';

interface ReceiptData {
  firmInfo: FirmInfo;
  clients: Client[];
  totalAmount: number;
  paymentMethod: string;
  signature: string;
  initials: string;
  timestamp: string;
}

export const generateReceiptPDF = async (data: ReceiptData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Load and add logo image
  try {
    const logoUrl = 'https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp';
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    const reader = new FileReader();
    
    await new Promise((resolve) => {
      reader.onloadend = () => {
        const base64data = reader.result as string;
        // Add logo centered at top
        const logoWidth = 40;
        const logoHeight = 15;
        doc.addImage(base64data, 'WEBP', (pageWidth - logoWidth) / 2, yPos, logoWidth, logoHeight);
        yPos += logoHeight + 5;
        resolve(null);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    // Fallback to text if image fails
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 71, 171);
    doc.text('NYLTA.com', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
  }
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('New Way Enterprise LLC', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  // Title
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Bulk Filing Receipt', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  // Horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(15, yPos, pageWidth - 15, yPos);
  yPos += 10;
  
  // Confirmation Number
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Confirmation Number:', 15, yPos);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  const confirmationNumber = data.timestamp.substring(0, 13).replace(/[-:]/g, '');
  doc.text(`#${confirmationNumber}`, 70, yPos);
  
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Date & Time:', 15, yPos);
  doc.setTextColor(0, 0, 0);
  doc.text(new Date(data.timestamp).toLocaleString(), 70, yPos);
  
  yPos += 12;
  
  // Firm Information Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 71, 171);
  doc.text('Firm Information', 15, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const firmDetails = [
    ['Firm Name:', data.firmInfo?.firmName || 'N/A'],
    ['Contact Person:', data.firmInfo?.contactPerson || 'N/A'],
    ['Email:', data.firmInfo?.email || 'N/A'],
    ['Phone:', data.firmInfo?.phone || 'N/A'],
    ['EIN:', data.firmInfo?.ein || 'N/A'],
    ['Professional Type:', data.firmInfo?.professionalType || 'N/A']
  ];
  
  firmDetails.forEach(([label, value]) => {
    doc.setTextColor(100, 100, 100);
    doc.text(label, 15, yPos);
    doc.setTextColor(0, 0, 0);
    doc.text(value, 55, yPos);
    yPos += 5;
  });
  
  yPos += 7;
  
  // Transaction Summary Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 71, 171);
  doc.text('Transaction Summary', 15, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const transactionDetails = [
    ['Number of Filings:', data.clients.length.toString()],
    ['Filing Fee (per client):', '$398'],
    ['Total Amount Paid:', `$${data.totalAmount.toLocaleString()}`],
    ['Payment Method:', data.paymentMethod === 'ach' ? 'ACH Debit' : 'Credit Card']
  ];
  
  transactionDetails.forEach(([label, value]) => {
    doc.setTextColor(100, 100, 100);
    doc.text(label, 15, yPos);
    doc.setTextColor(0, 0, 0);
    if (label === 'Total Amount Paid:') {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
    }
    doc.text(value, 65, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    yPos += 5;
  });
  
  yPos += 7;
  
  // Authorization Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 71, 171);
  doc.text('Authorization', 15, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Authorized Signature:', 15, yPos);
  doc.setTextColor(0, 0, 0);
  doc.text(data.signature, 55, yPos);
  yPos += 5;
  
  doc.setTextColor(100, 100, 100);
  doc.text('Initials:', 15, yPos);
  doc.setTextColor(0, 0, 0);
  doc.text(data.initials, 55, yPos);
  
  yPos += 12;
  
  // Clients Filed Summary Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 71, 171);
  doc.text(`Clients Filed (${data.clients.length})`, 15, yPos);
  yPos += 8;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  // Table header
  doc.setFillColor(240, 240, 240);
  doc.rect(15, yPos - 4, pageWidth - 30, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('LLC Name', 17, yPos);
  doc.text('NYDOS ID', 100, yPos);
  doc.text('Status', 145, yPos);
  doc.text('Fee', 175, yPos);
  yPos += 6;
  
  doc.setFont('helvetica', 'normal');
  
  // Table rows
  data.clients.forEach((client, index) => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
      
      // Repeat header on new page
      doc.setFillColor(240, 240, 240);
      doc.rect(15, yPos - 4, pageWidth - 30, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text('LLC Name', 17, yPos);
      doc.text('NYDOS ID', 100, yPos);
      doc.text('Status', 145, yPos);
      doc.text('Fee', 175, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
    }
    
    const llcName = client.llcName.length > 30 ? client.llcName.substring(0, 27) + '...' : client.llcName;
    doc.setTextColor(0, 0, 0);
    doc.text(llcName, 17, yPos);
    doc.text(client.nydosId || '—', 100, yPos);
    doc.setTextColor(0, 128, 0);
    doc.text('Filed', 145, yPos);
    doc.setTextColor(0, 0, 0);
    doc.text('$398', 175, yPos);
    
    yPos += 5;
    
    // Light separator line
    if (index < data.clients.length - 1) {
      doc.setDrawColor(230, 230, 230);
      doc.line(15, yPos, pageWidth - 15, yPos);
      yPos += 1;
    }
  });
  
  // New page for detailed client information
  doc.addPage();
  yPos = 20;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 71, 171);
  doc.text('Detailed Client Information', 15, yPos);
  yPos += 10;
  
  doc.setDrawColor(200, 200, 200);
  doc.line(15, yPos, pageWidth - 15, yPos);
  yPos += 10;
  
  // Loop through each client and show full details
  data.clients.forEach((client: Client, index: number) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Client header
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`${index + 1}. ${client.llcName}`, 15, yPos);
    yPos += 7;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    // Basic information
    const basicInfo = [
      ['NYDOS ID:', client.nydosId || '—'],
      ['EIN:', client.ein || '—'],
      ['Formation Date:', client.formationDate || '—'],
      ['Contact Email:', client.contactEmail || '—'],
      ['Filing Status:', client.filingStatus]
    ];
    
    basicInfo.forEach(([label, value]) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.setTextColor(100, 100, 100);
      doc.text(label, 20, yPos);
      doc.setTextColor(0, 0, 0);
      doc.text(String(value), 65, yPos);
      yPos += 5;
    });
    
    // Exemption details if applicable
    if (client.filingStatus === 'Exempt') {
      yPos += 2;
      if (yPos > 275) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 71, 171);
      doc.text('Exemption Information:', 20, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      
      doc.setTextColor(100, 100, 100);
      doc.text('Type:', 20, yPos);
      doc.setTextColor(0, 0, 0);
      doc.text(client.exemptionType || '—', 65, yPos);
      yPos += 5;
      
      if (client.exemptionExplanation) {
        doc.setTextColor(100, 100, 100);
        doc.text('Explanation:', 20, yPos);
        yPos += 5;
        doc.setTextColor(0, 0, 0);
        // Wrap long text
        const splitText = doc.splitTextToSize(client.exemptionExplanation, 160);
        splitText.forEach((line: string) => {
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, 20, yPos);
          yPos += 4;
        });
      }
    }
    
    // Beneficial owners if applicable
    if (client.filingStatus === 'Non-Exempt' && client.beneficialOwners && client.beneficialOwners.length > 0) {
      yPos += 2;
      if (yPos > 275) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 71, 171);
      doc.text(`Beneficial Owners (${client.beneficialOwners.length}):`, 20, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      
      client.beneficialOwners.forEach((owner, ownerIndex) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`Owner ${ownerIndex + 1}:`, 20, yPos);
        yPos += 5;
        doc.setFont('helvetica', 'normal');
        
        const ownerInfo = [
          ['Full Name:', owner.fullName || '—'],
          ['Date of Birth:', owner.dob || '—'],
          ['Address:', owner.address || '—'],
          ['ID Type:', owner.idType || '—'],
          ['ID Last 4:', owner.idLast4 ? `****${owner.idLast4}` : '—']
        ];
        
        ownerInfo.forEach(([label, value]) => {
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
          doc.setTextColor(100, 100, 100);
          doc.text(label, 25, yPos);
          doc.setTextColor(0, 0, 0);
          // Handle long addresses
          if (label === 'Address:') {
            const splitAddress = doc.splitTextToSize(String(value), 140);
            splitAddress.forEach((line: string) => {
              if (yPos > 280) {
                doc.addPage();
                yPos = 20;
              }
              doc.text(line, 65, yPos);
              yPos += 4;
            });
          } else {
            doc.text(String(value), 65, yPos);
            yPos += 4;
          }
        });
        
        yPos += 2;
      });
    }
    
    // Separator between clients
    if (index < data.clients.length - 1) {
      yPos += 3;
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.setDrawColor(220, 220, 220);
      doc.line(15, yPos, pageWidth - 15, yPos);
      yPos += 8;
    }
  });
  
  // Add new page for Important Notice
  doc.addPage();
  yPos = 20;
  
  // Important Filing Timeline Notice Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 71, 171);
  doc.text('Important Filing Timeline Notice', 15, yPos);
  yPos += 8;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const noticeText = 'Your information has been securely received and recorded by NYLTA.com and is now undergoing compliance review for accuracy and completeness. Once official filing instructions and submission mechanisms are issued by the New York Department of State, your bulk filing will be prepared for submission in accordance with NYLTA requirements. You will receive additional confirmation updates as the process progresses.';
  
  const splitNotice = doc.splitTextToSize(noticeText, pageWidth - 30);
  splitNotice.forEach((line: string) => {
    doc.text(line, 15, yPos);
    yPos += 5;
  });
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'italic');
  doc.text('This is an official receipt from NYLTA.com (New Way Enterprise LLC)', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, footerY + 4, { align: 'center' });
  
  // Save the PDF
  doc.save(`NYLTA-Receipt-${confirmationNumber}.pdf`);
};