import { useState } from "react";
import { Upload, FileText, CheckCircle2, Clock, AlertCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface Client {
  id: string;
  clientName: string;
  companyName: string;
  status: "Filed" | "Awaiting Transcript" | "Pending";
  uploadedFile?: {
    name: string;
    uploadedAt: string;
    uploadedBy: string;
  };
}

interface AdminTranscriptUploadProps {
  clients: Client[];
  onFileUpload?: (clientId: string, file: File) => void;
  onFileRemove?: (clientId: string) => void;
}

export default function AdminTranscriptUpload({ 
  clients, 
  onFileUpload,
  onFileRemove 
}: AdminTranscriptUploadProps) {
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [localClients, setLocalClients] = useState<Client[]>(clients);

  const handleFileSelect = (clientId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadingFor(clientId);

    // Simulate upload
    setTimeout(() => {
      const updatedClients = localClients.map(client => {
        if (client.id === clientId) {
          return {
            ...client,
            status: "Filed" as const,
            uploadedFile: {
              name: file.name,
              uploadedAt: new Date().toISOString(),
              uploadedBy: "Admin User"
            }
          };
        }
        return client;
      });

      setLocalClients(updatedClients);
      setUploadingFor(null);

      if (onFileUpload) {
        onFileUpload(clientId, file);
      }
    }, 1500);
  };

  const handleFileRemove = (clientId: string) => {
    if (!confirm('Are you sure you want to remove this transcript?')) {
      return;
    }

    const updatedClients = localClients.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          status: "Awaiting Transcript" as const,
          uploadedFile: undefined
        };
      }
      return client;
    });

    setLocalClients(updatedClients);

    if (onFileRemove) {
      onFileRemove(clientId);
    }
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
      case "Awaiting Transcript":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 border rounded-none">
            <Clock className="h-3 w-3 mr-1" />
            Awaiting Transcript
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

  const stats = {
    total: localClients.length,
    filed: localClients.filter(c => c.status === "Filed").length,
    awaiting: localClients.filter(c => c.status === "Awaiting Transcript").length,
    pending: localClients.filter(c => c.status === "Pending").length
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-2 border-[#00274E]">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Total Clients</CardDescription>
            <CardTitle className="text-3xl text-[#00274E]">{stats.total}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-2 border-green-300">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Transcripts Uploaded</CardDescription>
            <CardTitle className="text-3xl text-green-700">{stats.filed}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-2 border-yellow-300">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Awaiting Transcript</CardDescription>
            <CardTitle className="text-3xl text-yellow-700">{stats.awaiting}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-2 border-gray-300">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Pending Filing</CardDescription>
            <CardTitle className="text-3xl text-gray-700">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Upload Manager */}
      <Card className="border-2 border-gray-300">
        <CardHeader className="bg-white border-b-4 border-yellow-400">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-[#00274E] text-2xl mb-2">
                Client Transcript Upload Manager
              </CardTitle>
              <CardDescription className="text-base">
                Upload government confirmation transcripts for each client filing
              </CardDescription>
            </div>
            <FileText className="h-12 w-12 text-[#00274E]" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Instructions */}
          <Card className="border-2 border-blue-200 bg-blue-50 mb-6">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="mb-2">
                    <strong>Upload Instructions:</strong>
                  </p>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li>Upload official government confirmation transcripts in PDF format</li>
                    <li>Maximum file size: 10MB per file</li>
                    <li>Uploaded transcripts will automatically appear in the user-facing dashboard</li>
                    <li>Click "Replace File" to update an existing transcript</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clients Table */}
          <div className="border-2 border-gray-300 rounded-none overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 border-b-2 border-gray-300">
                  <TableHead className="text-gray-900">Client Name</TableHead>
                  <TableHead className="text-gray-900">Company Name</TableHead>
                  <TableHead className="text-gray-900">Status</TableHead>
                  <TableHead className="text-gray-900">Uploaded File</TableHead>
                  <TableHead className="text-gray-900 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No clients to manage
                    </TableCell>
                  </TableRow>
                ) : (
                  localClients.map((client) => (
                    <TableRow 
                      key={client.id} 
                      className={`hover:bg-gray-50 ${
                        client.uploadedFile ? 'bg-green-50' : ''
                      }`}
                    >
                      <TableCell className="text-gray-900">{client.clientName}</TableCell>
                      <TableCell className="text-gray-900">{client.companyName}</TableCell>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
                      <TableCell>
                        {client.uploadedFile ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-gray-900">{client.uploadedFile.name}</span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Uploaded {new Date(client.uploadedFile.uploadedAt).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              By {client.uploadedFile.uploadedBy}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">None</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {client.uploadedFile ? (
                            <>
                              <label htmlFor={`upload-${client.id}`}>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="rounded-none border-[#00274E] cursor-pointer"
                                  disabled={uploadingFor === client.id}
                                  onClick={() => document.getElementById(`upload-${client.id}`)?.click()}
                                >
                                  <Upload className="h-3 w-3 mr-1" />
                                  Replace File
                                </Button>
                              </label>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="rounded-none border-red-300 text-red-600 hover:bg-red-50"
                                onClick={() => handleFileRemove(client.id)}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Remove
                              </Button>
                            </>
                          ) : (
                            <label htmlFor={`upload-${client.id}`}>
                              <Button
                                type="button"
                                size="sm"
                                className="bg-[#00274E] hover:bg-[#003366] text-white rounded-none cursor-pointer"
                                disabled={uploadingFor === client.id}
                                onClick={() => document.getElementById(`upload-${client.id}`)?.click()}
                              >
                                <Upload className="h-3 w-3 mr-1" />
                                {uploadingFor === client.id ? 'Uploading...' : 'Upload Transcript (PDF)'}
                              </Button>
                            </label>
                          )}
                          <input
                            id={`upload-${client.id}`}
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => handleFileSelect(client.id, e)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          {localClients.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <p>
                Showing {localClients.length} client{localClients.length !== 1 ? 's' : ''}
              </p>
              <p>
                {stats.filed} of {stats.total} transcripts uploaded
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Dashboard Note */}
      <Card className="border-2 border-green-300 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-900">
              <p className="mb-2">
                <strong>Automatic Display in User Dashboard:</strong>
              </p>
              <p>
                Once a transcript is uploaded, it will automatically appear in the client's dashboard 
                under their filing record. Users can download their official government confirmation 
                transcript directly from their account.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
