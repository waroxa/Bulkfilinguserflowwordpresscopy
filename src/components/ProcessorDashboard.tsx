import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ArrowLeft, Search, CheckCircle2, AlertCircle, FileText, Download, Edit2, Save, X, Loader2, Activity } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Footer from "./Footer";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import jsPDF from "jspdf";
import { fetchAllBulkFilingSubmissions, FirmSubmission } from "../utils/highlevel";
import { useAuth } from "../contexts/AuthContext";

interface ProcessorDashboardProps {
  onBack: () => void;
}

// Client data structure for processor view
interface ProcessorClient {
  id: string;
  llcName: string;
  nydosId: string;
  ein: string;
  status: string;
  assignedDate: string;
  filingStatus: string;
  dataComplete: boolean;
  formationDate?: string;
  address?: string;
  email?: string;
  phone?: string;
  beneficialOwners?: any[];
  companyApplicant?: any;
  exemptionReason?: string;
  submittedDate?: string;
  receiptNumber?: string;
}

export default function ProcessorDashboard({ onBack }: ProcessorDashboardProps) {
  const { session } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [assignedClients, setAssignedClients] = useState<ProcessorClient[]>([]);
  const [viewingClient, setViewingClient] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_review: { label: "Pending Review", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
      ready_to_file: { label: "Ready to File", className: "bg-green-100 text-green-800 border-green-300" },
      data_incomplete: { label: "Data Incomplete", className: "bg-red-100 text-red-800 border-red-300" },
      submitted: { label: "Submitted", className: "bg-blue-100 text-blue-800 border-blue-300" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_review;
    return <Badge className={`${config.className} border rounded-none`}>{config.label}</Badge>;
  };

  const filteredClients = assignedClients.filter(client => {
    const matchesSearch = 
      client.llcName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.nydosId.includes(searchQuery) ||
      client.ein.includes(searchQuery);
    
    const matchesStatus = selectedStatus === "all" || client.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: assignedClients.length,
    readyToFile: assignedClients.filter(c => c.status === "ready_to_file").length,
    pendingReview: assignedClients.filter(c => c.status === "pending_review").length,
    incomplete: assignedClients.filter(c => c.status === "data_incomplete").length,
    submitted: assignedClients.filter(c => c.status === "submitted").length
  };

  const handleViewClient = (client: any) => {
    setViewingClient(client);
    setEditedClient({ ...client });
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedClient({ ...viewingClient });
    }
  };

  const handleSaveChanges = () => {
    setAssignedClients(clients =>
      clients.map(c => c.id === editedClient.id ? editedClient : c)
    );
    setViewingClient(editedClient);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedClient({ ...editedClient, [field]: value });
  };

  const handleBeneficialOwnerChange = (index: number, field: string, value: string) => {
    const updatedOwners = [...editedClient.beneficialOwners];
    updatedOwners[index] = { ...updatedOwners[index], [field]: value };
    setEditedClient({ ...editedClient, beneficialOwners: updatedOwners });
  };

  const downloadReceipt = async (client: any) => {
    const doc = new jsPDF();
    
    // Add NYLTA.com header with logo
    doc.setFillColor(0, 39, 78); // Navy blue
    doc.rect(0, 0, 220, 40, 'F');
    
    // Add logo text (since we can't easily embed images without URL)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('NYLTA.com', 15, 25);
    
    doc.setFontSize(10);
    doc.text('New York LLC Transparency Act Filing', 15, 33);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Receipt Title
    doc.setFontSize(18);
    doc.text('FILING RECEIPT', 105, 55, { align: 'center' });
    
    // Receipt Number
    doc.setFontSize(12);
    doc.text(`Receipt Number: ${client.receiptNumber || 'N/A'}`, 15, 70);
    doc.text(`Submitted Date: ${client.submittedDate || 'N/A'}`, 15, 78);
    
    // Horizontal line
    doc.setDrawColor(0, 39, 78);
    doc.setLineWidth(0.5);
    doc.line(15, 85, 195, 85);
    
    // Company Information
    doc.setFontSize(14);
    doc.text('Company Information', 15, 95);
    doc.setFontSize(10);
    doc.text(`LLC Name: ${client.llcName}`, 15, 105);
    doc.text(`NYDOS ID: ${client.nydosId}`, 15, 112);
    doc.text(`EIN: ${client.ein}`, 15, 119);
    doc.text(`Formation Date: ${client.formationDate}`, 15, 126);
    doc.text(`Address: ${client.address}`, 15, 133);
    doc.text(`Email: ${client.email}`, 15, 140);
    doc.text(`Phone: ${client.phone}`, 15, 147);
    
    // Filing Status
    doc.setFontSize(14);
    doc.text('Filing Details', 15, 160);
    doc.setFontSize(10);
    doc.text(`Filing Status: ${client.filingStatus}`, 15, 170);
    
    let yPos = 180;
    
    // Beneficial Owners or Exemption
    if (client.filingStatus === 'Non-Exempt' && client.beneficialOwners) {
      doc.setFontSize(14);
      doc.text('Beneficial Owners', 15, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      client.beneficialOwners.forEach((owner: any, index: number) => {
        doc.text(`${index + 1}. ${owner.name}`, 15, yPos);
        yPos += 7;
        doc.text(`   Address: ${owner.address}`, 15, yPos);
        yPos += 7;
        doc.text(`   DOB: ${owner.dob} | ID Type: ${owner.idType} | ID: ${owner.idNumber}`, 15, yPos);
        yPos += 10;
      });
    } else if (client.exemptionReason) {
      doc.text(`Exemption Reason: ${client.exemptionReason}`, 15, yPos);
      yPos += 10;
    }
    
    // Company Applicant
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.text('Company Applicant', 15, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.text(`Name: ${client.companyApplicant.name}`, 15, yPos);
    yPos += 7;
    doc.text(`Firm: ${client.companyApplicant.firmName}`, 15, yPos);
    yPos += 7;
    doc.text(`Address: ${client.companyApplicant.address}`, 15, yPos);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('This receipt confirms submission of NYLTA filing. Processing typically completes within 1-2 business days.', 105, 280, { align: 'center' });
    doc.text('NYLTA.com™ is operated by New Way Enterprise LLC', 105, 285, { align: 'center' });
    
    // Save the PDF
    doc.save(`NYLTA-Receipt-${client.llcName.replace(/\s+/g, '-')}.pdf`);
  };

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      console.log('📊 Loading processor clients from RewardLion...');
      
      try {
        const submissions = await fetchAllBulkFilingSubmissions();
        console.log(`✅ Loaded ${submissions.length} submissions for processor`);
        
        // Transform submissions to processor client format
        const clients: ProcessorClient[] = submissions.map((sub) => ({
          id: sub.id,
          llcName: sub.firmName,
          nydosId: sub.confirmationNumber.substring(0, 8), // Use first 8 chars of confirmation as ID
          ein: sub.firmEIN,
          status: sub.status === 'Paid' ? 'submitted' : sub.status === 'Pending Review' ? 'pending_review' : 'ready_to_file',
          assignedDate: sub.submittedDate,
          filingStatus: sub.clients && sub.clients.length > 0 ? (sub.clients[0].exemptStatus === 'exempt' ? 'Exempt' : 'Non-Exempt') : 'Non-Exempt',
          dataComplete: true,
          formationDate: sub.clients && sub.clients.length > 0 ? sub.clients[0].formationDate : undefined,
          address: sub.clients && sub.clients.length > 0 ? sub.clients[0].address : undefined,
          email: sub.contactEmail,
          phone: sub.contactPhone,
          beneficialOwners: sub.clients && sub.clients.length > 0 ? sub.clients[0].beneficialOwners : [],
          companyApplicant: { 
            name: sub.authorization?.authorizedBy || 'N/A',
            firmName: sub.firmName,
            address: sub.firmAddress || 'N/A'
          },
          exemptionReason: sub.clients && sub.clients.length > 0 ? sub.clients[0].exemptionReason : undefined,
          submittedDate: sub.submittedDate,
          receiptNumber: sub.confirmationNumber
        }));
        
        setAssignedClients(clients);
        console.log(`✅ Mapped ${clients.length} clients for processor view`);
      } catch (error) {
        console.error("❌ Error fetching processor clients:", error);
        setAssignedClients([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing processor clients...');
      fetchClients();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#00274E] border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ImageWithFallback 
                src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                alt="NYLTA.com Logo"
                className="h-8 sm:h-10 md:h-12 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-none"
              />
              <div className="border-l-2 border-white/30 pl-4">
                <h1 className="text-white">Processor Dashboard</h1>
                <p className="text-gray-300 text-sm">Filing Operations & Client Management</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onBack}
              className="bg-white border-2 border-white hover:bg-gray-100 text-[#00274E] rounded-none px-6 py-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="border-2 border-[#00274E]">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Total Assigned</CardDescription>
              <CardTitle className="text-3xl text-[#00274E]">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="border-2 border-green-300">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Ready to File</CardDescription>
              <CardTitle className="text-3xl text-green-700">{stats.readyToFile}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-2 border-yellow-300">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Pending Review</CardDescription>
              <CardTitle className="text-3xl text-yellow-700">{stats.pendingReview}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-2 border-red-300">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Incomplete</CardDescription>
              <CardTitle className="text-3xl text-red-700">{stats.incomplete}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-2 border-blue-300">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Submitted</CardDescription>
              <CardTitle className="text-3xl text-blue-700">{stats.submitted}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="border border-gray-300">
          <CardHeader className="bg-white border-b-4 border-yellow-400">
            <CardTitle className="text-[#00274E]">Assigned Clients</CardTitle>
            <CardDescription>View and manage your assigned client filings</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by LLC name, NYDOS ID, or EIN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-none"
                />
              </div>
              <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-full md:w-auto">
                <TabsList className="bg-gray-100 rounded-none">
                  <TabsTrigger value="all" className="rounded-none">All</TabsTrigger>
                  <TabsTrigger value="ready_to_file" className="rounded-none">Ready</TabsTrigger>
                  <TabsTrigger value="pending_review" className="rounded-none">Pending</TabsTrigger>
                  <TabsTrigger value="data_incomplete" className="rounded-none">Incomplete</TabsTrigger>
                  <TabsTrigger value="submitted" className="rounded-none">Submitted</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Clients Table */}
            <div className="border border-gray-300 rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-gray-900">LLC Name</TableHead>
                    <TableHead className="text-gray-900">NYDOS ID</TableHead>
                    <TableHead className="text-gray-900">EIN</TableHead>
                    <TableHead className="text-gray-900">Filing Status</TableHead>
                    <TableHead className="text-gray-900">Status</TableHead>
                    <TableHead className="text-gray-900">Assigned Date</TableHead>
                    <TableHead className="text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading clients...
                      </TableCell>
                    </TableRow>
                  ) : filteredClients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No clients found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClients.map((client) => (
                      <TableRow key={client.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {client.dataComplete ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-gray-900">{client.llcName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">{client.nydosId}</TableCell>
                        <TableCell className="text-gray-600">{client.ein}</TableCell>
                        <TableCell>
                          <Badge className={`rounded-none ${
                            client.filingStatus === "Exempt" 
                              ? "bg-blue-100 text-blue-800 border-blue-300 border" 
                              : "bg-gray-100 text-gray-800 border-gray-300 border"
                          }`}>
                            {client.filingStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(client.status)}</TableCell>
                        <TableCell className="text-gray-600">{client.assignedDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-none border-gray-300"
                                  onClick={() => handleViewClient(client)}
                                >
                                  <FileText className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-[#00274E] text-2xl">
                                    {isEditing ? 'Edit Client Details' : 'Client Filing Details'}
                                  </DialogTitle>
                                  <DialogDescription>
                                    {isEditing ? 'Make changes to the client information below' : 'View complete filing information for this client'}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                {(viewingClient && editedClient) && (
                                  <div className="space-y-6">
                                    {/* Action Buttons */}
                                    <div className="flex gap-2 justify-end border-b pb-4">
                                      {!isEditing ? (
                                        <Button
                                          onClick={handleEditToggle}
                                          className="bg-[#00274E] hover:bg-[#003366] text-white rounded-none"
                                        >
                                          <Edit2 className="h-4 w-4 mr-2" />
                                          Edit Details
                                        </Button>
                                      ) : (
                                        <>
                                          <Button
                                            onClick={() => {
                                              setIsEditing(false);
                                              setEditedClient({ ...viewingClient });
                                            }}
                                            variant="outline"
                                            className="rounded-none"
                                          >
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                          </Button>
                                          <Button
                                            onClick={handleSaveChanges}
                                            className="bg-green-600 hover:bg-green-700 text-white rounded-none"
                                          >
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                          </Button>
                                        </>
                                      )}
                                    </div>

                                    {/* Company Information */}
                                    <div>
                                      <h3 className="text-lg text-[#00274E] mb-4 border-b-2 border-yellow-400 pb-2">Company Information</h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-gray-700">LLC Name</Label>
                                          <Input
                                            value={editedClient.llcName}
                                            onChange={(e) => handleInputChange('llcName', e.target.value)}
                                            disabled={!isEditing}
                                            className="mt-1 rounded-none"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-gray-700">NYDOS ID</Label>
                                          <Input
                                            value={editedClient.nydosId}
                                            onChange={(e) => handleInputChange('nydosId', e.target.value)}
                                            disabled={!isEditing}
                                            className="mt-1 rounded-none"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-gray-700">EIN</Label>
                                          <Input
                                            value={editedClient.ein}
                                            onChange={(e) => handleInputChange('ein', e.target.value)}
                                            disabled={!isEditing}
                                            className="mt-1 rounded-none"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-gray-700">Formation Date</Label>
                                          <Input
                                            type="date"
                                            value={editedClient.formationDate}
                                            onChange={(e) => handleInputChange('formationDate', e.target.value)}
                                            disabled={!isEditing}
                                            className="mt-1 rounded-none"
                                          />
                                        </div>
                                        <div className="col-span-2">
                                          <Label className="text-gray-700">Address</Label>
                                          <Input
                                            value={editedClient.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            disabled={!isEditing}
                                            className="mt-1 rounded-none"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-gray-700">Email</Label>
                                          <Input
                                            type="email"
                                            value={editedClient.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            disabled={!isEditing}
                                            className="mt-1 rounded-none"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-gray-700">Phone</Label>
                                          <Input
                                            type="tel"
                                            value={editedClient.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            disabled={!isEditing}
                                            className="mt-1 rounded-none"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Filing Status */}
                                    <div>
                                      <h3 className="text-lg text-[#00274E] mb-4 border-b-2 border-yellow-400 pb-2">Filing Status</h3>
                                      <div className="flex items-center gap-4">
                                        <Badge className={`rounded-none ${
                                          editedClient.filingStatus === "Exempt" 
                                            ? "bg-blue-100 text-blue-800 border-blue-300 border" 
                                            : "bg-gray-100 text-gray-800 border-gray-300 border"
                                        }`}>
                                          {editedClient.filingStatus}
                                        </Badge>
                                        {getStatusBadge(editedClient.status)}
                                      </div>
                                    </div>

                                    {/* Beneficial Owners (Non-Exempt) */}
                                    {editedClient.filingStatus === 'Non-Exempt' && editedClient.beneficialOwners && (
                                      <div>
                                        <h3 className="text-lg text-[#00274E] mb-4 border-b-2 border-yellow-400 pb-2">Beneficial Owners</h3>
                                        {editedClient.beneficialOwners.map((owner: any, index: number) => (
                                          <div key={index} className="mb-6 p-4 border border-gray-300 rounded-none bg-gray-50">
                                            <h4 className="text-sm text-gray-700 mb-3">Owner {index + 1}</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                <Label className="text-gray-700">Name</Label>
                                                <Input
                                                  value={owner.name}
                                                  onChange={(e) => handleBeneficialOwnerChange(index, 'name', e.target.value)}
                                                  disabled={!isEditing}
                                                  className="mt-1 rounded-none"
                                                />
                                              </div>
                                              <div>
                                                <Label className="text-gray-700">Date of Birth</Label>
                                                <Input
                                                  type="date"
                                                  value={owner.dob}
                                                  onChange={(e) => handleBeneficialOwnerChange(index, 'dob', e.target.value)}
                                                  disabled={!isEditing}
                                                  className="mt-1 rounded-none"
                                                />
                                              </div>
                                              <div className="col-span-2">
                                                <Label className="text-gray-700">Address</Label>
                                                <Input
                                                  value={owner.address}
                                                  onChange={(e) => handleBeneficialOwnerChange(index, 'address', e.target.value)}
                                                  disabled={!isEditing}
                                                  className="mt-1 rounded-none"
                                                />
                                              </div>
                                              <div>
                                                <Label className="text-gray-700">ID Type</Label>
                                                <Input
                                                  value={owner.idType}
                                                  onChange={(e) => handleBeneficialOwnerChange(index, 'idType', e.target.value)}
                                                  disabled={!isEditing}
                                                  className="mt-1 rounded-none"
                                                />
                                              </div>
                                              <div>
                                                <Label className="text-gray-700">ID Number (Last 4 digits)</Label>
                                                <Input
                                                  value={owner.idNumber}
                                                  onChange={(e) => handleBeneficialOwnerChange(index, 'idNumber', e.target.value)}
                                                  disabled={!isEditing}
                                                  className="mt-1 rounded-none"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Exemption Reason (Exempt) */}
                                    {editedClient.filingStatus === 'Exempt' && (
                                      <div>
                                        <h3 className="text-lg text-[#00274E] mb-4 border-b-2 border-yellow-400 pb-2">Exemption Details</h3>
                                        <div>
                                          <Label className="text-gray-700">Exemption Reason</Label>
                                          <Input
                                            value={editedClient.exemptionReason || ''}
                                            onChange={(e) => handleInputChange('exemptionReason', e.target.value)}
                                            disabled={!isEditing}
                                            className="mt-1 rounded-none"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {/* Company Applicant */}
                                    <div>
                                      <h3 className="text-lg text-[#00274E] mb-4 border-b-2 border-yellow-400 pb-2">Company Applicant</h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-gray-700">Name</Label>
                                          <Input
                                            value={editedClient.companyApplicant?.name || ''}
                                            disabled
                                            className="mt-1 rounded-none bg-gray-100"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-gray-700">Firm Name</Label>
                                          <Input
                                            value={editedClient.companyApplicant?.firmName || ''}
                                            disabled
                                            className="mt-1 rounded-none bg-gray-100"
                                          />
                                        </div>
                                        <div className="col-span-2">
                                          <Label className="text-gray-700">Address</Label>
                                          <Input
                                            value={editedClient.companyApplicant?.address || ''}
                                            disabled
                                            className="mt-1 rounded-none bg-gray-100"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Submission Details (if submitted) */}
                                    {editedClient.status === 'submitted' && (
                                      <div>
                                        <h3 className="text-lg text-[#00274E] mb-4 border-b-2 border-yellow-400 pb-2">Submission Details</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label className="text-gray-700">Assigned Date</Label>
                                            <Input
                                              value={editedClient.assignedDate}
                                              disabled
                                              className="mt-1 rounded-none bg-gray-100"
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-gray-700">Submitted Date</Label>
                                            <Input
                                              value={editedClient.submittedDate}
                                              disabled
                                              className="mt-1 rounded-none bg-gray-100"
                                            />
                                          </div>
                                          {editedClient.receiptNumber && (
                                            <div className="col-span-2">
                                              <Label className="text-gray-700">Receipt Number</Label>
                                              <Input
                                                value={editedClient.receiptNumber}
                                                disabled
                                                className="mt-1 rounded-none bg-gray-100"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            {client.status === "submitted" && (
                              <Button
                                size="sm"
                                className="bg-[#00274E] hover:bg-[#003366] text-white rounded-none"
                                onClick={() => downloadReceipt(client)}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Receipt
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {filteredClients.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredClients.length} of {assignedClients.length} assigned clients
              </div>
            )}
          </CardContent>
        </Card>

        {/* Access Restrictions Notice */}
        <Card className="mt-8 border-2 border-gray-300 bg-gray-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-gray-900 mb-2">Processor/Filer Access Restrictions</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• You can only view and manage clients assigned to you</li>
                  <li>• Platform settings, pricing, and marketing tools are not accessible</li>
                  <li>• Contact your administrator for client reassignment or access changes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            NYLTA.com™ Processor Dashboard • Limited Access Portal
          </p>
        </div>
      </footer>
    </div>
  );
}