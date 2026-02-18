import { useState } from "react";
import { Download, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface Client {
  id: string;
  clientName: string;
  entityName: string;
  ein: string;
  status: "Filed" | "Processing" | "Pending";
  filedDate?: string;
  confirmationNumber?: string;
}

interface DownloadManagerProps {
  clients: Client[];
  onDownload?: (selectedIds: string[]) => void;
}

export default function DownloadManager({ clients, onDownload }: DownloadManagerProps) {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  const toggleClient = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map(c => c.id));
    }
  };

  const handleDownload = async () => {
    if (selectedClients.length > 0 && onDownload) {
      onDownload(selectedClients);
    }
    
    // Generate PDFs for each selected client
    for (const clientId of selectedClients) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        await generateClientPDF(client);
      }
    }
  };

  const generateClientPDF = async (client: Client) => {
    const { downloadPDF } = await import('../utils/pdfGenerator');
    
    await downloadPDF(
      {
        clientName: client.clientName,
        entityName: client.entityName,
        ein: client.ein,
        status: client.status,
        filedDate: client.filedDate,
        confirmationNumber: client.confirmationNumber
      },
      `NYLTA_Filing_${client.entityName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      'simple'
    );
  };

  const getStatusBadge = (status: Client['status']) => {
    switch (status) {
      case "Filed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300 border rounded-none">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Filed
          </Badge>
        );
      case "Processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 border rounded-none">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-300 border rounded-none">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <Card className="border-2 border-gray-300">
      <CardHeader className="bg-white border-b-4 border-yellow-400">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-[#00274E] text-2xl mb-2">
              Download Selected Files ({selectedClients.length} of {clients.length})
            </CardTitle>
            <CardDescription className="text-base">
              Choose which filing records you want to download as PDFs
            </CardDescription>
            <div className="mt-2">
              <Badge className="bg-[#00274E] text-white border-[#00274E] rounded-none text-sm">
                {selectedClients.length} selected out of {clients.length}
              </Badge>
            </div>
          </div>
          <FileText className="h-12 w-12 text-[#00274E]" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Client Selection Table */}
        <div className="border-2 border-gray-300 rounded-none overflow-hidden mb-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 border-b-2 border-gray-300">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedClients.length === clients.length}
                    onCheckedChange={toggleSelectAll}
                    className="rounded-none"
                  />
                </TableHead>
                <TableHead className="text-gray-900">Client Name</TableHead>
                <TableHead className="text-gray-900">Entity Name</TableHead>
                <TableHead className="text-gray-900">EIN</TableHead>
                <TableHead className="text-gray-900">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No clients available for download
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow 
                    key={client.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedClients.includes(client.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => toggleClient(client.id)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={() => toggleClient(client.id)}
                        className="rounded-none"
                      />
                    </TableCell>
                    <TableCell className="text-gray-900">{client.clientName}</TableCell>
                    <TableCell className="text-gray-900">{client.entityName}</TableCell>
                    <TableCell className="font-mono text-gray-600">{client.ein}</TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={toggleSelectAll}
            className="border-2 border-gray-300 rounded-none px-6 py-6"
          >
            {selectedClients.length === clients.length ? "Deselect All" : "Select All"}
          </Button>
          
          <Button
            onClick={handleDownload}
            disabled={selectedClients.length === 0}
            className="bg-[#00274E] hover:bg-[#003366] text-white rounded-none px-8 py-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Selected ({selectedClients.length})
          </Button>
        </div>

        {selectedClients.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-none">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> PDF files will include NYLTA.com header, logo, filing data, 
              timestamp, and all relevant submission details. Each file will download separately.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
