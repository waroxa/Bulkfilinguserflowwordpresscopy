import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileText, Download, TrendingUp, DollarSign, CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp, Building2, Eye, Shield, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SERVER_URL } from '../utils/supabase/client';
import { toast } from 'sonner';

interface ClientDetail {
  id: string;
  llcName: string;
  nydosId?: string;
  ein?: string;
  filingType?: 'disclosure' | 'exemption';
  serviceType?: 'monitoring' | 'filing';
  exemptionCategory?: string;
  dataComplete?: boolean;
}

interface Payment {
  id: string;
  submissionNumber: string;
  serviceType: 'monitoring' | 'filing' | 'mixed';
  clientCount: number;
  amountPaid: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  paidAt?: string;
  upgradedFrom?: string;
  upgradedTo?: string;
  firmName?: string;
  firmEIN?: string;
  clients?: ClientDetail[];
  metadata?: {
    originalAmount?: number;
    upgradeAmount?: number;
  };
}

interface Draft {
  id: string;
  firmName: string;
  firmEIN: string;
  clientCount: number;
  clients: ClientDetail[];
  createdAt: string;
}

export default function MySubmissions() {
  const { session } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgradingPayment, setUpgradingPayment] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'filing' | 'monitoring' | 'drafts'>('filing');

  useEffect(() => {
    fetchPayments();
  }, [session]);

  const fetchPayments = async () => {
    if (!session?.access_token) {
      console.log('⚠️ No session token, cannot fetch payments');
      return;
    }

    try {
      const url = `${SERVER_URL}/payments/my-payments`;
      console.log('📥 Fetching payments from server...');
      console.log('URL:', url);
      console.log('SERVER_URL:', SERVER_URL);
      console.log('Auth token:', session.access_token ? 'Present' : 'Missing');
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Payments fetched:', data.payments?.length || 0, 'records');
        console.log('Payment data:', JSON.stringify(data.payments, null, 2));
        setPayments(data.payments || []);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to fetch payments:', response.status, errorText);
        toast.error(`Failed to fetch payments: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error fetching payments:', error);
      toast.error('Error fetching payments');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (payment: Payment) => {
    if (!session?.access_token) return;

    const upgradeAmount = payment.clientCount * 149; // $149 per client
    const totalFiling = payment.clientCount * 398; // Total filing cost

    if (!confirm(
      `Upgrade to Bulk Filing?\n\n` +
      `Original Monitoring: $${payment.amountPaid.toLocaleString()}\n` +
      `Upgrade Cost: $${upgradeAmount.toLocaleString()} ($149 × ${payment.clientCount} clients)\n` +
      `Total Filing Value: $${totalFiling.toLocaleString()}\n\n` +
      `You'll only pay the $${upgradeAmount.toLocaleString()} difference!`
    )) {
      return;
    }

    setUpgradingPayment(payment.id);

    try {
      const response = await fetch(`${SERVER_URL}/payments/upgrade`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalPaymentId: payment.id,
          firmName: payment.firmName,
          firmEIN: payment.firmEIN,
          submissionNumber: `${payment.submissionNumber}-UPGRADE`,
          clientCount: payment.clientCount,
          amountPaid: upgradeAmount,
          paymentStatus: 'pending',
          paymentMethod: 'ach',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Upgrade initiated! Redirecting to payment...');
        
        // Here you would redirect to payment page
        // For now, refresh the payments list
        await fetchPayments();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to initiate upgrade');
      }
    } catch (error) {
      console.error('Error upgrading:', error);
      toast.error('Failed to initiate upgrade');
    } finally {
      setUpgradingPayment(null);
    }
  };

  const toggleRowExpansion = (paymentId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(paymentId)) {
      newExpanded.delete(paymentId);
    } else {
      newExpanded.add(paymentId);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" />Paid</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">Loading your submissions...</p>
        </CardContent>
      </Card>
    );
  }

  // Separate payments by type
  const filingPayments = payments.filter(p => p.serviceType === 'filing');
  const monitoringPayments = payments.filter(p => p.serviceType === 'monitoring' && !p.upgradedTo);
  
  const paidFilings = filingPayments.filter(p => p.paymentStatus === 'paid');
  const paidMonitoring = monitoringPayments.filter(p => p.paymentStatus === 'paid');
  
  const totalFilingClients = paidFilings.reduce((sum, p) => sum + p.clientCount, 0);
  const totalMonitoringClients = paidMonitoring.reduce((sum, p) => sum + p.clientCount, 0);
  const totalFilingPaid = paidFilings.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalMonitoringPaid = paidMonitoring.reduce((sum, p) => sum + p.amountPaid, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#00274E] mb-2">My Submissions</h2>
        <p className="text-gray-600">View and manage your filing history</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'filing' | 'monitoring' | 'drafts')} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="filing" className="data-[state=active]:bg-[#00274E] data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" />
            Bulk Filing ({filingPayments.length})
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Monitoring ({monitoringPayments.length})
          </TabsTrigger>
          <TabsTrigger value="drafts" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
            <Clock className="w-4 h-4 mr-2" />
            Incomplete Drafts ({drafts.length})
          </TabsTrigger>
        </TabsList>

        {/* BULK FILING TAB */}
        <TabsContent value="filing" className="space-y-6">
          {/* Filing Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-yellow-400">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Total Filings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#00274E]">{totalFilingClients}</p>
                <p className="text-sm text-gray-600 mt-1">Clients filed</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-400">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#00274E]">{paidFilings.length}</p>
                <p className="text-sm text-gray-600 mt-1">Submissions</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Total Paid
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#00274E]">${totalFilingPaid.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">Filing fees</p>
              </CardContent>
            </Card>
          </div>

          {/* Filing Submissions Table */}
          {filingPayments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Bulk Filing Submissions Yet</h3>
                <p className="text-gray-500 mb-4">You haven't submitted any bulk filings.</p>
                <p className="text-sm text-gray-400">Start a bulk filing to see submissions here.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Filing History</CardTitle>
                <CardDescription>Complete record of your NYDOS bulk filings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submission #</TableHead>
                      <TableHead>Date Filed</TableHead>
                      <TableHead>Clients</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filingPayments.map((payment) => (
                      <>
                        <TableRow key={payment.id} className="hover:bg-gray-50">
                          <TableCell className="font-mono text-sm font-semibold">
                            {payment.submissionNumber}
                          </TableCell>
                          <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{payment.clientCount}</span>
                              {payment.clients && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleRowExpansion(payment.id)}
                                  className="h-6 px-2"
                                >
                                  {expandedRows.has(payment.id) ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">${payment.amountPaid.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(payment.paymentStatus)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Download className="w-3 h-3 mr-1" />
                                Receipt
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        {/* Expandable Client Details */}
                        {expandedRows.has(payment.id) && payment.clients && (
                          <TableRow>
                            <TableCell colSpan={6} className="bg-gray-50 p-4">
                              <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                                  <Building2 className="w-4 h-4" />
                                  Client Details ({payment.clients.length})
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {payment.clients.map((client) => (
                                    <div key={client.id} className="bg-white border border-gray-200 rounded p-3">
                                      <p className="font-semibold text-sm text-[#00274E]">{client.llcName}</p>
                                      <div className="mt-2 space-y-1 text-xs text-gray-600">
                                        {client.nydosId && <p>NYDOS ID: {client.nydosId}</p>}
                                        {client.ein && <p>EIN: {client.ein}</p>}
                                        <p>
                                          Filing Type: {' '}
                                          <Badge variant={client.filingType === 'disclosure' ? 'default' : 'outline'} className="text-xs">
                                            {client.filingType === 'disclosure' ? 'Beneficial Owner Disclosure' : 'Exemption Attestation'}
                                          </Badge>
                                        </p>
                                        {client.exemptionCategory && (
                                          <p className="text-blue-600">Exemption: {client.exemptionCategory}</p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* MONITORING TAB */}
        <TabsContent value="monitoring" className="space-y-6">
          {/* Monitoring Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-blue-400">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Monitoring Clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#00274E]">{totalMonitoringClients}</p>
                <p className="text-sm text-gray-600 mt-1">Active monitoring</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-400">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Bell className="w-4 h-4" /> Compliance Ready
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#00274E]">{totalMonitoringClients}</p>
                <p className="text-sm text-gray-600 mt-1">Data stored & ready</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Total Paid
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#00274E]">${totalMonitoringPaid.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">Monitoring fees</p>
              </CardContent>
            </Card>
          </div>

          {/* Upgrade Opportunity Banner */}
          {paidMonitoring.length > 0 && (
            <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-yellow-600" />
                  <div>
                    <CardTitle className="text-xl">💰 Upgrade to Bulk Filing Available</CardTitle>
                    <CardDescription className="text-gray-700">
                      You have {totalMonitoringClients} client{totalMonitoringClients > 1 ? 's' : ''} ready to upgrade
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">
                  Upgrade your monitoring clients to full NYDOS filing service. Pay only the difference of $149 per client.
                  No double charging!
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Zero setup needed • Data already stored</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Monitoring Submissions Table */}
          {monitoringPayments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Shield className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Monitoring Submissions Yet</h3>
                <p className="text-gray-500 mb-4">You haven't enrolled any clients in compliance monitoring.</p>
                <p className="text-sm text-gray-400">Monitoring service stores your client data and keeps you ready for future filings.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Monitoring History</CardTitle>
                <CardDescription>Clients enrolled in compliance monitoring service</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submission #</TableHead>
                      <TableHead>Date Enrolled</TableHead>
                      <TableHead>Clients</TableHead>
                      <TableHead>Amount Paid</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monitoringPayments.map((payment) => (
                      <>
                        <TableRow key={payment.id} className="hover:bg-blue-50">
                          <TableCell className="font-mono text-sm font-semibold">
                            {payment.submissionNumber}
                          </TableCell>
                          <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{payment.clientCount}</span>
                              {payment.clients && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleRowExpansion(payment.id)}
                                  className="h-6 px-2"
                                >
                                  {expandedRows.has(payment.id) ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">${payment.amountPaid.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(payment.paymentStatus)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {payment.paymentStatus === 'paid' && (
                                <Button
                                  size="sm"
                                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                                  onClick={() => handleUpgrade(payment)}
                                  disabled={upgradingPayment === payment.id}
                                >
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  {upgradingPayment === payment.id ? 'Processing...' : `Upgrade ($${(payment.clientCount * 149).toLocaleString()})`}
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        {/* Expandable Client Details */}
                        {expandedRows.has(payment.id) && payment.clients && (
                          <TableRow>
                            <TableCell colSpan={6} className="bg-blue-50 p-4">
                              <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                                  <Building2 className="w-4 h-4" />
                                  Monitored Clients ({payment.clients.length})
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {payment.clients.map((client) => (
                                    <div key={client.id} className="bg-white border border-blue-200 rounded p-3">
                                      <div className="flex items-start justify-between">
                                        <p className="font-semibold text-sm text-[#00274E]">{client.llcName}</p>
                                        <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                                          <Shield className="w-3 h-3 mr-1" />
                                          Monitoring
                                        </Badge>
                                      </div>
                                      <div className="mt-2 space-y-1 text-xs text-gray-600">
                                        {client.nydosId && <p>NYDOS ID: {client.nydosId}</p>}
                                        {client.ein && <p>EIN: {client.ein}</p>}
                                        <p>
                                          Filing Type: {' '}
                                          <Badge variant={client.filingType === 'disclosure' ? 'default' : 'outline'} className="text-xs">
                                            {client.filingType === 'disclosure' ? 'Disclosure' : 'Exemption'}
                                          </Badge>
                                        </p>
                                        {client.exemptionCategory && (
                                          <p className="text-blue-600">Exemption: {client.exemptionCategory}</p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                  <p className="text-xs text-gray-700">
                                    💡 <strong>Ready to file?</strong> Click "Upgrade" to submit these clients to NYDOS. 
                                    You'll only pay $149 per client (upgrade fee).
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}