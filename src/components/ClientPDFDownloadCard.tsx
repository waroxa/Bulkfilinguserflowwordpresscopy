import { Download, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface ClientPDFDownloadCardProps {
  clientName: string;
  businessName: string;
  nydosConfirmation?: string;
  dateFiled?: string;
  status: "Filed" | "In Review" | "Pending";
  beneficialOwners?: Array<{
    name: string;
    dob: string;
    address: string;
  }>;
  onDownload?: () => void;
}

export default function ClientPDFDownloadCard({
  clientName,
  businessName,
  nydosConfirmation = "Pending",
  dateFiled,
  status,
  beneficialOwners = [],
  onDownload
}: ClientPDFDownloadCardProps) {

  const handleDownload = async () => {
    if (onDownload) {
      onDownload();
    }

    // Generate proper PDF
    const { downloadPDF } = await import('../utils/pdfGenerator');
    
    await downloadPDF(
      {
        clientName,
        entityName: businessName,
        confirmationNumber: nydosConfirmation,
        filedDate: dateFiled,
        status,
        beneficialOwners
      },
      `NYLTA_${businessName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      'simple'
    );
  };

  const getStatusBadge = () => {
    switch (status) {
      case "Filed":
        return (
          <Badge className="bg-green-100 text-green-800 border-2 border-green-300 rounded-none">
            Filed
          </Badge>
        );
      case "In Review":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-2 border-yellow-300 rounded-none">
            In Review
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-2 border-gray-300 rounded-none">
            Pending
          </Badge>
        );
    }
  };

  return (
    <Card className="border-2 border-gray-300 hover:border-[#00274E] transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-[#00274E] rounded-none flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-3">
              <h3 className="text-lg text-gray-900 mb-1" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                {clientName}
              </h3>
              <p className="text-base text-gray-700 mb-2">{businessName}</p>
              <div className="flex items-center gap-3 flex-wrap">
                {getStatusBadge()}
                {nydosConfirmation !== "Pending" && (
                  <span className="text-sm text-gray-600">
                    Confirmation: <span className="font-mono">{nydosConfirmation}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              {dateFiled && (
                <div>
                  <span className="text-gray-500">Date Filed:</span>
                  <p className="text-gray-900">{dateFiled}</p>
                </div>
              )}
              {beneficialOwners.length > 0 && (
                <div>
                  <span className="text-gray-500">Beneficial Owners:</span>
                  <p className="text-gray-900">{beneficialOwners.length}</p>
                </div>
              )}
            </div>

            <Button
              onClick={handleDownload}
              className="bg-[#00274E] hover:bg-[#003366] text-white rounded-none w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
