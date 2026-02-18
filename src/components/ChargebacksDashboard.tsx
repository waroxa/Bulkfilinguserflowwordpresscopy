import { useState, useEffect } from "react";
import { ArrowLeft, Download, FileText, DollarSign, Search, Calendar, Filter, Loader2, Activity } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { fetchAllBulkFilingSubmissions, FirmSubmission } from "../utils/highlevel";
import { useAuth } from "../contexts/AuthContext";
import jsPDF from "jspdf";

interface ChargebacksDashboardProps {
  onBack: () => void;
}

//Payment record interface
interface PaymentRecord {
  id: string;
  submissionId: string;
  firmName: string;
  contactEmail: string;
  amount: number;
  discount: number;
  finalAmount: number;
  clientCount: number;
  paymentDate: string;
  paymentMethod: string;
  status: string;
  authorizationForm: boolean;
  invoice: boolean;
}

export default function ChargebacksDashboard({ onBack }: ChargebacksDashboardProps) {
  const { session } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: "Completed", className: "bg-green-100 text-green-800 border-green-300" },
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
      failed: { label: "Failed", className: "bg-red-100 text-red-800 border-red-300" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={`${config.className} border rounded-none`}>{config.label}</Badge>;
  };

  const filteredRecords = paymentRecords.filter(record => {
    const matchesSearch = 
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.submissionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.firmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalTransactions: paymentRecords.length,
    totalRevenue: paymentRecords.reduce((sum, r) => sum + r.finalAmount, 0),
    completedPayments: paymentRecords.filter(r => r.status === "completed").length,
    pendingPayments: paymentRecords.filter(r => r.status === "pending").length
  };

  // Export to CSV function
  const exportToCSV = () => {
    if (paymentRecords.length === 0) {
      alert('No payment records to export');
      return;
    }

    const headers = [
      'Payment ID',
      'Submission ID',
      'Firm Name',
      'Contact Email',
      'Client Count',
      'Amount',
      'Discount',
      'Final Amount',
      'Payment Date',
      'Payment Method',
      'Status'
    ];

    const rows = paymentRecords.map(record => [
      record.id,
      record.submissionId,
      record.firmName,
      record.contactEmail,
      record.clientCount,
      record.amount,
      record.discount,
      record.finalAmount,
      record.paymentDate,
      record.paymentMethod,
      record.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `nylta_payment_records_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate Invoice PDF
  const generateInvoice = (record: PaymentRecord) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(0, 39, 78);
    doc.rect(0, 0, 220, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('NYLTA.com', 15, 25);
    doc.setFontSize(10);
    doc.text('New York LLC Transparency Act Filing', 15, 33);
    
    // Invoice Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text('INVOICE', 105, 55, { align: 'center' });
    
    // Invoice Details
    doc.setFontSize(10);
    doc.text(`Invoice Number: ${record.id}`, 15, 70);
    doc.text(`Submission ID: ${record.submissionId}`, 15, 77);
    doc.text(`Date: ${record.paymentDate}`, 15, 84);
    
    // Line
    doc.setDrawColor(0, 39, 78);
    doc.setLineWidth(0.5);
    doc.line(15, 90, 195, 90);
    
    // Bill To
    doc.setFontSize(12);
    doc.text('BILL TO:', 15, 100);
    doc.setFontSize(10);
    doc.text(record.firmName, 15, 108);
    doc.text(record.contactEmail, 15, 115);
    
    // Services Table
    doc.setFontSize(12);
    doc.text('SERVICES', 15, 130);
    
    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 135, 180, 8, 'F');
    doc.setFontSize(10);
    doc.text('Description', 20, 140);
    doc.text('Qty', 130, 140);
    doc.text('Amount', 170, 140, { align: 'right' });
    
    // Table Row
    doc.text(`NYLTA Filing Service (${record.clientCount} clients)`, 20, 150);
    doc.text('1', 130, 150);
    doc.text(`$${record.amount.toFixed(2)}`, 190, 150, { align: 'right' });
    
    // Subtotal
    doc.line(15, 155, 195, 155);
    doc.text('Subtotal:', 130, 163);
    doc.text(`$${record.amount.toFixed(2)}`, 190, 163, { align: 'right' });
    
    // Discount
    doc.text('Early Bird Discount (10%):', 110, 170);
    doc.text(`-$${record.discount.toFixed(2)}`, 190, 170, { align: 'right' });
    
    // Total
    doc.setFontSize(12);
    doc.setFillColor(255, 215, 0);
    doc.rect(110, 175, 85, 10, 'F');
    doc.text('TOTAL:', 115, 182);
    doc.text(`$${record.finalAmount.toFixed(2)}`, 190, 182, { align: 'right' });
    
    // Payment Info
    doc.setFontSize(10);
    doc.text('Payment Method:', 15, 200);
    doc.text(record.paymentMethod, 60, 200);
    doc.text('Status:', 15, 207);
    doc.text(record.status.toUpperCase(), 60, 207);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your business!', 105, 270, { align: 'center' });
    doc.text('NYLTA.com™ is operated by New Way Enterprise LLC', 105, 277, { align: 'center' });
    doc.text('For questions, contact support@nylta.com', 105, 284, { align: 'center' });
    
    // Save
    doc.save(`NYLTA-Invoice-${record.id}.pdf`);
  };

  // Fetch real payment records from RewardLion
  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      console.log('💳 Loading payment records from RewardLion...');
      
      try {
        const submissions = await fetchAllBulkFilingSubmissions();
        console.log(`✅ Loaded ${submissions.length} submissions for manager`);
        
        // Transform submissions to payment records
        const records: PaymentRecord[] = submissions
          .filter(sub => sub.status === 'Paid' || sub.status === 'Processing')
          .map(sub => ({
            id: `PAY-${sub.confirmationNumber}`,
            submissionId: sub.confirmationNumber,
            firmName: sub.firmName,
            contactEmail: sub.contactEmail || '',
            amount: sub.totalAmount,
            discount: sub.totalAmount * 0.1, // Assume 10% discount
            finalAmount: sub.totalAmount,
            clientCount: sub.clientCount,
            paymentDate: sub.submittedDate,
            paymentMethod: sub.paymentMethod || 'ACH',
            status: sub.status === 'Paid' ? 'completed' : 'pending',
            authorizationForm: true,
            invoice: true
          }));
        
        setPaymentRecords(records);
        console.log(`✅ Transformed ${records.length} payment records`);
      } catch (error) {
        console.error('❌ Error fetching payment records:', error);
        setPaymentRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing payment records...');
      fetchPayments();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-700 border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ImageWithFallback 
                src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                alt="NYLTA.com Logo"
                className="h-8 sm:h-10 md:h-12 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-none"
              />
              <div className="border-l-2 border-white/30 pl-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-white">Manager Dashboard</h1>
                  <Badge className="bg-green-600 text-white">
                    <Activity className="w-3 h-3 mr-1" />
                    Live Data
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm">Payment Tracking & Financial Oversight</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onBack}
              className="bg-white border-2 border-white hover:bg-gray-100 text-gray-700 rounded-none px-6 py-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-gray-600">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Total Transactions</CardDescription>
              <CardTitle className="text-3xl text-gray-700">{stats.totalTransactions}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="border-2 border-green-300">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Total Revenue</CardDescription>
              <CardTitle className="text-2xl text-green-700">${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-2 border-green-300">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Completed</CardDescription>
              <CardTitle className="text-3xl text-green-700">{stats.completedPayments}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-2 border-yellow-300">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Pending</CardDescription>
              <CardTitle className="text-3xl text-yellow-700">{stats.pendingPayments}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content - Tabs */}
        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList className="bg-gray-100 rounded-none border border-gray-300">
            <TabsTrigger value="payments" className="rounded-none">Payment Records</TabsTrigger>
            <TabsTrigger value="authorizations" className="rounded-none">Authorization Forms</TabsTrigger>
            <TabsTrigger value="invoices" className="rounded-none">Invoices</TabsTrigger>
            <TabsTrigger value="submissions" className="rounded-none">Submission Data</TabsTrigger>
          </TabsList>

          {/* Payment Records Tab */}
          <TabsContent value="payments">
            <Card className="border border-gray-300">
              <CardHeader className="bg-white border-b-4 border-yellow-400">
                <CardTitle className="text-gray-700">Payment Records</CardTitle>
                <CardDescription>View and export payment transaction data</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by payment ID, submission ID, or firm name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-none"
                    />
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full md:w-48 rounded-none">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    className="bg-gray-700 hover:bg-gray-800 text-white rounded-none px-6"
                    onClick={exportToCSV}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                  </Button>
                </div>

                {/* Payment Table */}
                <div className="border border-gray-300 rounded-none overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        <TableHead className="text-gray-900">Payment ID</TableHead>
                        <TableHead className="text-gray-900">Submission ID</TableHead>
                        <TableHead className="text-gray-900">Firm Name</TableHead>
                        <TableHead className="text-gray-900">Clients</TableHead>
                        <TableHead className="text-gray-900">Amount</TableHead>
                        <TableHead className="text-gray-900">Discount</TableHead>
                        <TableHead className="text-gray-900">Final Amount</TableHead>
                        <TableHead className="text-gray-900">Date</TableHead>
                        <TableHead className="text-gray-900">Status</TableHead>
                        <TableHead className="text-gray-900">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8">
                            <div className="flex items-center justify-center gap-2 text-gray-500">
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Loading payment records...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredRecords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                            No payment records found. Use the Test Submission Tool to create data.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRecords.map((record) => (
                          <TableRow key={record.id} className="hover:bg-gray-50">
                            <TableCell className="text-gray-900">{record.id}</TableCell>
                            <TableCell className="text-gray-600">{record.submissionId}</TableCell>
                            <TableCell className="text-gray-900">{record.firmName}</TableCell>
                            <TableCell className="text-gray-600">{record.clientCount}</TableCell>
                            <TableCell className="text-gray-600">${record.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                            <TableCell className="text-green-600">-${record.discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                            <TableCell className="text-gray-900">${record.finalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                            <TableCell className="text-gray-600">{record.paymentDate}</TableCell>
                            <TableCell>{getStatusBadge(record.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-none border-gray-300"
                                  onClick={() => generateInvoice(record)}
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Invoice
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Authorization Forms Tab */}
          <TabsContent value="authorizations">
            <Card className="border border-gray-300">
              <CardHeader className="bg-white border-b-4 border-yellow-400">
                <CardTitle className="text-gray-700">Authorization Forms</CardTitle>
                <CardDescription>Download ACH authorization and consent forms</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border border-gray-300 rounded-none hover:bg-gray-50">
                      <div className="flex-1">
                        <p className="text-gray-900">{record.firmName}</p>
                        <p className="text-sm text-gray-600">Payment ID: {record.id} • {record.paymentDate}</p>
                      </div>
                      <Button
                        variant="outline"
                        className="rounded-none border-gray-300"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Download Authorization
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <Card className="border border-gray-300">
              <CardHeader className="bg-white border-b-4 border-yellow-400">
                <CardTitle className="text-gray-700">Invoices & Receipts</CardTitle>
                <CardDescription>Download payment invoices and transaction receipts</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border border-gray-300 rounded-none hover:bg-gray-50">
                      <div className="flex-1">
                        <p className="text-gray-900">{record.firmName}</p>
                        <p className="text-sm text-gray-600">
                          {record.id} • ${record.finalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} • {record.paymentDate}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="rounded-none border-gray-300"
                        >
                          <DollarSign className="mr-2 h-4 w-4" />
                          Invoice
                        </Button>
                        <Button
                          className="bg-gray-700 hover:bg-gray-800 text-white rounded-none"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Receipt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submission Data Tab */}
          <TabsContent value="submissions">
            <Card className="border border-gray-300">
              <CardHeader className="bg-white border-b-4 border-yellow-400">
                <CardTitle className="text-gray-700">Submission Data</CardTitle>
                <CardDescription>View basic submission information (no client data editing)</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div key={record.id} className="p-4 border border-gray-300 rounded-none">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-gray-900">{record.submissionId}</p>
                          <p className="text-sm text-gray-600">{record.firmName} • {record.contactEmail}</p>
                        </div>
                        {getStatusBadge(record.status)}
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Clients Filed</p>
                          <p className="text-gray-900">{record.clientCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Submission Date</p>
                          <p className="text-gray-900">{record.paymentDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Payment Method</p>
                          <p className="text-gray-900">{record.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Amount</p>
                          <p className="text-gray-900">${record.finalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Access Notice */}
        <Card className="mt-8 border-2 border-gray-300 bg-gray-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <FileText className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-gray-900 mb-2">Manager Access Restrictions</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Access limited to firm profiles, billing, and payment records</li>
                  <li>• NO access to client filings or filing data</li>
                  <li>• Can view authorization forms, invoices, and submission summaries</li>
                  <li>• No ability to edit client data or platform configurations</li>
                  <li>• Contact platform administrator for additional access requests</li>
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
            NYLTA.com™ Manager Portal • Billing & Payment Access Only
          </p>
        </div>
      </footer>
    </div>
  );
}