import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { generateAdminSubmissionPDF, generateAdminSummaryPDF } from "./AdminSubmissionPDF";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../contexts/AuthContext";
import { SERVER_URL } from "../utils/supabase/client";
import { fetchAllBulkFilingSubmissions, updateSubmissionStatus, type FirmSubmission as HighLevelSubmission } from "../utils/highlevel";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Building2,
  Download,
  Search,
  Filter,
  ArrowLeft,
  Eye,
  BarChart3,
  Activity,
  Mail,
  ClipboardCheck,
  Shield,
  Wrench,
  Loader2
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import SubmissionReviewDialog from "./SubmissionReviewDialog";
import AdminPricingSettings from "./AdminPricingSettings";
import RoleSelector, { UserRole } from "./RoleSelector";
import ProcessorDashboard from "./ProcessorDashboard";
import ChargebacksDashboard from "./ChargebacksDashboard";
import AdminTools from "./AdminTools";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AdminDashboardProps {
  onBack: () => void;
  onNavigateToDocs?: () => void;
}

interface FirmSubmission {
  id: string;
  firmName: string;
  firmEIN: string;
  confirmationNumber: string;
  submittedDate: string;
  clientCount: number;
  totalAmount: number;
  status: "Paid" | "Processing" | "Abandoned" | "Pending Review" | "Approved" | "Rejected";
  paymentMethod: string;
  lastActivity: string;
  daysInactive?: number;
  reviewedBy?: string;
  reviewedDate?: string;
  rejectionReason?: string;
  serviceType?: 'monitoring' | 'filing'; // NEW: Track which service tier
  // Firm contact information
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  firmAddress?: string;
  // Client data with full details
  clients?: Array<{
    llcName: string;
    ein: string;
    exemptStatus: "exempt" | "non-exempt";
    formationDate?: string;
    county?: string;
    address?: string;
    beneficialOwners?: Array<{
      name: string;
      dob: string;
      ssn: string;
      address: string;
    }>;
    exemptionReason?: string;
  }>;
}

interface UserAccount {
  userId: string;
  firmName: string;
  contactName: string;
  email: string;
  phone?: string;
  role: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  isFirstLogin: boolean;
  firmProfileCompleted: boolean;
  isFrozen?: boolean;
}

export default function AdminDashboard({ onBack, onNavigateToDocs }: AdminDashboardProps) {
  const { session } = useAuth();
  // All useState hooks must be called before any conditional returns
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [selectedView, setSelectedView] = useState<"overview" | "submissions" | "stats" | "pricing" | "tools">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Paid" | "Processing" | "Abandoned" | "Abandoned30+">("all");
  const [serviceFilter, setServiceFilter] = useState<"all" | "monitoring" | "filing">("all");
  const [selectedSubmission, setSelectedSubmission] = useState<FirmSubmission | null>(null);
  const [pricingSettings, setPricingSettings] = useState({
    // Service Level Base Prices
    monitoring_price: 249,
    filing_base_price: 398,
    
    // Volume Discount Tiers (for FILING only, applied to foreign entities)
    tier1_min: 1,
    tier1_max: 25,
    tier1_discount: 0,  // 0% discount for 1-25 filings → $398.00
    tier2_min: 26,
    tier2_max: 75,
    tier2_discount: 5,  // 5% discount for 26-75 filings → $378.10
    tier3_min: 76,
    tier3_max: 150,
    tier3_discount: 10, // 10% discount for 76-150 filings → $358.20
    tier4_min: 151,
    tier4_discount: 0,  // Custom pricing over 150
  });
  
  // Real account data from database
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);

  // Real submissions data from RewardLion
  const [submissions, setSubmissions] = useState<FirmSubmission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);

  // Fetch real accounts from database
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!session?.access_token) {
        setAccountsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${SERVER_URL}/admin/accounts`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAccounts(data.accounts || []);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setAccountsLoading(false);
      }
    };

    fetchAccounts();
  }, [session]);

  // Fetch real submissions from HighLevel
  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setSubmissionsLoading(true);
        setSubmissionsError(null);
        console.log('📊 Loading submissions from RewardLion...');
        const data = await fetchAllBulkFilingSubmissions();
        
        // Filter to only show submissions from the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentSubmissions = data.filter(sub => {
          const subDate = new Date(sub.submittedDate);
          return subDate >= sevenDaysAgo;
        });
        
        console.log('✅ Loaded submissions:', recentSubmissions.length, 'recent out of', data.length, 'total');
        setSubmissions(recentSubmissions);
      } catch (error: any) {
        console.error('❌ Error loading submissions:', error);
        setSubmissionsError(error.message || 'Failed to load submissions');
      } finally {
        setSubmissionsLoading(false);
      }
    };

    loadSubmissions();

    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(loadSubmissions, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats from real data
  const thisMonth = new Date().getMonth();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const thisMonthSubmissions = submissions.filter(s => {
    const date = new Date(s.submittedDate);
    return date.getMonth() === thisMonth && s.status === "Paid";
  });
  const lastMonthSubmissions = submissions.filter(s => {
    const date = new Date(s.submittedDate);
    return date.getMonth() === lastMonth && s.status === "Paid";
  });

  const thisMonthRevenue = thisMonthSubmissions.reduce((acc, s) => acc + s.totalAmount, 0);
  const lastMonthRevenue = lastMonthSubmissions.reduce((acc, s) => acc + s.totalAmount, 0);
  const revenueGrowth = lastMonthRevenue > 0 
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0;

  const totalRevenue = submissions
    .filter(s => s.status === "Paid")
    .reduce((acc, s) => acc + s.totalAmount, 0);
  const totalPaidSubmissions = submissions.filter(s => s.status === "Paid").length;
  const totalAbandonedSubmissions = submissions.filter(s => s.status === "Abandoned").length;
  const abandonedOver31Days = submissions.filter(
    s => s.status === "Abandoned" && s.daysInactive && s.daysInactive > 31
  ).length;
  const processingSubmissions = submissions.filter(s => s.status === "Processing").length;

  // Helper function to safely format numbers and avoid NaN
  const formatCurrency = (value: number) => {
    return isNaN(value) || !isFinite(value) ? "$0" : `$${value.toLocaleString()}`;
  };

  const formatNumber = (value: number) => {
    return isNaN(value) || !isFinite(value) ? "0" : value.toLocaleString();
  };

  const formatPercentage = (value: number) => {
    return isNaN(value) || !isFinite(value) ? "0.0%" : `${value.toFixed(1)}%`;
  };

  // Safe calculations
  const totalClientsFiled = submissions.reduce((acc, s) => s.status === "Paid" ? acc + s.clientCount : acc, 0);
  const conversionRate = submissions.length > 0 
    ? (totalPaidSubmissions / submissions.length) * 100 
    : 0;
  const avgRevenuePerSubmission = totalPaidSubmissions > 0 
    ? totalRevenue / totalPaidSubmissions 
    : 0;
  const avgRevenuePerClient = totalClientsFiled > 0
    ? totalRevenue / totalClientsFiled
    : 0;
  
  // Service type breakdown - COUNT BY INDIVIDUAL CLIENTS, not submissions
  // A submission can have MIXED service types (some monitoring, some filing)
  let monitoringRevenue = 0;
  let filingRevenue = 0;
  let monitoringClients = 0;
  let filingClients = 0;
  
  const MONITORING_FEE = 249;
  const FILING_FEE = 398;
  
  submissions.filter(s => s.status === 'Paid').forEach(submission => {
    // Check if submission has clients array with individual serviceType
    if (submission.clients && Array.isArray(submission.clients)) {
      const monCount = submission.clients.filter((c: any) => c.serviceType === 'monitoring').length;
      const filCount = submission.clients.filter((c: any) => c.serviceType === 'filing').length;
      
      monitoringClients += monCount;
      filingClients += filCount;
      
      // Calculate revenue: monitoring is flat $249, filing gets remaining amount
      const submissionMonitoringRevenue = monCount * MONITORING_FEE;
      const submissionFilingRevenue = submission.totalAmount - submissionMonitoringRevenue;
      
      monitoringRevenue += submissionMonitoringRevenue;
      filingRevenue += submissionFilingRevenue;
    } else {
      // Legacy: Old submissions without individual client serviceType
      // Use submission-level serviceType
      if (submission.serviceType === 'monitoring') {
        monitoringClients += submission.clientCount;
        monitoringRevenue += submission.totalAmount;
      } else if (submission.serviceType === 'filing') {
        filingClients += submission.clientCount;
        filingRevenue += submission.totalAmount;
      }
    }
  });

  // Calculate submission counts by service type (for display in service cards)
  const monitoringSubmissions = submissions.filter(s => 
    s.status === 'Paid' && s.serviceType === 'monitoring'
  );
  const filingSubmissions = submissions.filter(s => 
    s.status === 'Paid' && s.serviceType === 'filing'
  );

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.firmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.confirmationNumber.includes(searchTerm) ||
      submission.firmEIN.includes(searchTerm);
    
    let matchesStatus = false;
    if (statusFilter === "all") {
      matchesStatus = true;
    } else if (statusFilter === "Abandoned30+") {
      matchesStatus = submission.status === "Abandoned" && submission.daysInactive !== undefined && submission.daysInactive > 30;
    } else {
      matchesStatus = submission.status === statusFilter;
    }
    
    // Service type filter
    let matchesService = false;
    if (serviceFilter === "all") {
      matchesService = true;
    } else {
      matchesService = submission.serviceType === serviceFilter;
    }
    
    return matchesSearch && matchesStatus && matchesService;
  });

  // Calculate real monthly revenue data from submissions
  const calculateMonthlyData = () => {
    const now = new Date();
    const monthlyData: Array<{ month: string; revenue: number; submissions: number; clients: number }> = [];
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = targetDate.toLocaleString('en-US', { month: 'short' });
      const monthIndex = targetDate.getMonth();
      const yearIndex = targetDate.getFullYear();
      
      // Filter submissions for this month
      const monthSubmissions = submissions.filter(s => {
        const subDate = new Date(s.submittedDate);
        return subDate.getMonth() === monthIndex && 
               subDate.getFullYear() === yearIndex &&
               s.status === 'Paid';
      });
      
      monthlyData.push({
        month: monthName,
        revenue: monthSubmissions.reduce((acc, s) => acc + s.totalAmount, 0),
        submissions: monthSubmissions.length,
        clients: monthSubmissions.reduce((acc, s) => acc + s.clientCount, 0)
      });
    }
    
    return monthlyData;
  };
  
  const monthlyRevenueData = calculateMonthlyData();

  // Status distribution data
  const statusDistributionData = [
    { name: 'Paid', value: totalPaidSubmissions, color: '#00274E' }, // Navy
    { name: 'Pending Review', value: submissions.filter(s => s.status === 'Pending Review').length, color: '#FFD700' }, // Yellow
    { name: 'Processing', value: processingSubmissions, color: '#6B7280' }, // Gray
    { name: 'Abandoned', value: totalAbandonedSubmissions, color: '#D1D5DB' }, // Light Gray
  ];

  const clientVolumeData = [
    { range: '1-5', count: submissions.filter(s => s.clientCount >= 1 && s.clientCount <= 5).length },
    { range: '6-10', count: submissions.filter(s => s.clientCount >= 6 && s.clientCount <= 10).length },
    { range: '11-15', count: submissions.filter(s => s.clientCount >= 11 && s.clientCount <= 15).length },
    { range: '16-20', count: submissions.filter(s => s.clientCount >= 16 && s.clientCount <= 20).length },
    { range: '20+', count: submissions.filter(s => s.clientCount > 20).length },
  ];

  // Calculate real weekly submissions data (last 4 weeks)
  const calculateWeeklyData = () => {
    const weeklyData = [];
    const now = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i * 7 + 7) * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      
      const weekSubs = submissions.filter(s => {
        const subDate = new Date(s.submittedDate);
        return subDate >= weekStart && subDate < weekEnd && s.status === 'Paid';
      });
      
      weeklyData.push({
        week: `Week ${4 - i}`,
        submissions: weekSubs.length,
        revenue: weekSubs.reduce((acc, s) => acc + s.totalAmount, 0)
      });
    }
    
    return weeklyData;
  };
  
  const weeklySubmissionsData = calculateWeeklyData();

  // Calculate real revenue by pricing tier
  const calculateRevenueByTier = () => {
    const tiers = [
      { name: '1-25 clients', min: 1, max: 25 },
      { name: '26-75 clients', min: 26, max: 75 },
      { name: '76-150 clients', min: 76, max: 150 },
      { name: '150+ clients', min: 151, max: Infinity }
    ];
    
    const tierData = tiers.map(tier => {
      const tierSubs = submissions.filter(s => 
        s.clientCount >= tier.min && 
        s.clientCount <= tier.max &&
        s.status === 'Paid'
      );
      
      const revenue = tierSubs.reduce((acc, s) => acc + s.totalAmount, 0);
      return {
        tier: tier.name,
        revenue,
        percentage: 0 // Will calculate below
      };
    });
    
    // Calculate percentages
    const totalRev = tierData.reduce((acc, t) => acc + t.revenue, 0);
    if (totalRev > 0) {
      tierData.forEach(t => {
        t.percentage = Math.round((t.revenue / totalRev) * 100);
      });
    }
    
    return tierData;
  };
  
  const revenueByTierData = calculateRevenueByTier();

  // CSV Export Helper Function
  const exportToCSV = () => {
    if (submissions.length === 0) {
      alert('No submissions to export');
      return;
    }

    // CSV headers
    const headers = [
      'Firm Name',
      'EIN',
      'Confirmation Number',
      'Submitted Date',
      'Client Count',
      'Total Amount',
      'Status',
      'Payment Method',
      'Contact Name',
      'Contact Email',
      'Contact Phone',
      'IP Address',
      'Last Activity'
    ];

    // Convert submissions to CSV rows
    const rows = submissions.map(sub => [
      sub.firmName || '',
      sub.firmEIN || '',
      sub.confirmationNumber || '',
      sub.submittedDate || '',
      sub.clientCount || 0,
      sub.totalAmount || 0,
      sub.status || '',
      sub.paymentMethod || '',
      sub.contactName || '',
      sub.contactEmail || '',
      sub.contactPhone || '',
      sub.ipAddress || '',
      sub.lastActivity || ''
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `nylta_submissions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Export Function for Statistical Report
  const exportToPDF = () => {
    if (submissions.length === 0) {
      alert('No submissions to export');
      return;
    }

    // Create comprehensive PDF report content
    const reportContent = `
NYLTA BULK FILING SYSTEM - STATISTICAL REPORT
Generated: ${new Date().toLocaleString()}
Report Period: All Time

═══════════════════════════════════════════════════════════

EXECUTIVE SUMMARY

Total Submissions: ${submissions.length}
Total Revenue: $${totalRevenue.toLocaleString()}
Total Clients Filed: ${totalClientsFiledCount.toLocaleString()}
Total Firms: ${totalFirmsCount}

Payment Status Distribution:
- Paid: ${totalPaidSubmissions} (${Math.round((totalPaidSubmissions / submissions.length) * 100)}%)
- Processing: ${processingSubmissions} (${Math.round((processingSubmissions / submissions.length) * 100)}%)
- Pending Review: ${submissions.filter(s => s.status === 'Pending Review').length}
- Abandoned: ${totalAbandonedSubmissions}

Revenue by Payment Method:
${Object.entries(submissions.reduce((acc, s) => {
  const method = s.paymentMethod || 'Unknown';
  acc[method] = (acc[method] || 0) + s.totalAmount;
  return acc;
}, {} as Record<string, number>))
  .sort((a, b) => b[1] - a[1])
  .map(([method, amount]) => `- ${method}: $${amount.toLocaleString()}`)
  .join('\n')}

═══════════════════════════════════════════════════════════

TOP PERFORMING FIRMS

${submissions
  .sort((a, b) => b.totalAmount - a.totalAmount)
  .slice(0, 10)
  .map((s, i) => `${i + 1}. ${s.firmName}
   EIN: ${s.firmEIN}
   Clients Filed: ${s.clientCount}
   Revenue: $${s.totalAmount.toLocaleString()}
   Status: ${s.status}
   ───────────────────────────────────────────────────`)
  .join('\n')}

═══════════════════════════════════════════════════════════

ALL SUBMISSIONS

${submissions.map((s, i) => `
Submission #${i + 1}
─────────────────────────────────────────────────────────
Firm: ${s.firmName}
EIN: ${s.firmEIN}
Confirmation: ${s.confirmationNumber}
Date: ${new Date(s.submittedDate).toLocaleString()}
Clients: ${s.clientCount}
Amount: $${s.totalAmount.toLocaleString()}
Status: ${s.status}
Payment: ${s.paymentMethod}
Contact: ${s.contactName} (${s.contactEmail})
IP: ${s.ipAddress || 'N/A'}
`).join('\n')}

═══════════════════════════════════════════════════════════

NOTES:
- This report contains confidential business information
- Generated automatically from RewardLion CRM database
- For internal use only
- Report accuracy depends on data quality at time of generation

═══════════════════════════════════════════════════════════
End of Report
    `.trim();

    // Create and download the PDF as text file (browsers handle PDF generation)
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `NYLTA_Statistical_Report_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success message
    alert('Statistical report downloaded successfully!\\n\\nNote: Report is in text format for compatibility. You can convert to PDF using any text-to-PDF tool.');
  };

  // Show loading state while fetching submissions
  if (submissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#00274E] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Loading Dashboard...</h3>
              <p className="text-gray-600">Fetching real-time data from RewardLion CRM...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state if loading failed
  if (submissionsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md border-red-300">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 mx-auto text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-red-900">Error Loading Data</h3>
              <p className="text-gray-700 mb-4">{submissionsError}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-[#00274E] hover:bg-[#003366]"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
      case "Approved":
        return <Badge className="bg-[#00274E] text-white border-[#00274E]">✓ Paid</Badge>;
      case "Processing":
        return <Badge className="bg-gray-500 text-white border-gray-500">Processing</Badge>;
      case "Abandoned":
        return <Badge className="bg-gray-700 text-white border-gray-700">Abandoned</Badge>;
      case "Pending Review":
        return <Badge className="bg-gray-600 text-white border-gray-600">Pending Review</Badge>;
      case "Rejected":
        return <Badge className="bg-gray-800 text-white border-gray-800">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle role selection
  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
  };

  // Show role selector if no role is selected
  if (!currentRole) {
    return <RoleSelector onRoleSelect={handleRoleSelect} onBack={onBack} />;
  }

  // Show processor dashboard for processor/filer role
  if (currentRole === "processor_filer") {
    return <ProcessorDashboard onBack={() => setCurrentRole(null)} />;
  }

  // Show manager dashboard for manager role (no filings)
  if (currentRole === "manager") {
    return <ChargebacksDashboard onBack={() => setCurrentRole(null)} />;
  }

  // Continue with Super Admin dashboard below for super_admin role
  if (selectedSubmission) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="outline" 
            onClick={() => setSelectedSubmission(null)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Submissions
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedSubmission.firmName}</CardTitle>
                  <CardDescription className="mt-2">
                    Confirmation #{selectedSubmission.confirmationNumber}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedSubmission.status)}
                  <Button 
                    className="bg-[#00274E] hover:bg-[#003366] text-white rounded-none"
                    onClick={async () => {
                      // Generate and download PDF using proper PDF generator
                      const { downloadPDF } = await import('../utils/pdfGenerator');
                      
                      await downloadPDF(
                        {
                          firmName: selectedSubmission.firmName,
                          firmEIN: selectedSubmission.firmEIN,
                          confirmationNumber: selectedSubmission.confirmationNumber,
                          contactName: selectedSubmission.contactName,
                          contactEmail: selectedSubmission.contactEmail,
                          contactPhone: selectedSubmission.contactPhone,
                          firmAddress: selectedSubmission.firmAddress,
                          submittedDate: selectedSubmission.submittedDate,
                          status: selectedSubmission.status,
                          clientCount: selectedSubmission.clientCount,
                          totalAmount: selectedSubmission.totalAmount,
                          paymentMethod: selectedSubmission.paymentMethod
                        },
                        `NYLTA_Submission_${selectedSubmission.confirmationNumber}_${new Date().toISOString().split('T')[0]}.pdf`,
                        'detailed'
                      );
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Client PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Firm Information */}
              <div className="mb-8">
                <h3 className="text-xl mb-4 text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>Firm Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Firm EIN</p>
                    <p className="text-base">{selectedSubmission.firmEIN}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Submitted Date</p>
                    <p className="text-base">{new Date(selectedSubmission.submittedDate).toLocaleString()}</p>
                  </div>
                  {selectedSubmission.contactName && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Contact Name</p>
                      <p className="text-base">{selectedSubmission.contactName}</p>
                    </div>
                  )}
                  {selectedSubmission.contactEmail && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Contact Email</p>
                      <p className="text-base">{selectedSubmission.contactEmail}</p>
                    </div>
                  )}
                  {selectedSubmission.contactPhone && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Contact Phone</p>
                      <p className="text-base">{selectedSubmission.contactPhone}</p>
                    </div>
                  )}
                  {selectedSubmission.firmAddress && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Firm Address</p>
                      <p className="text-base">{selectedSubmission.firmAddress}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Number of Clients</p>
                    <p className="text-base">{selectedSubmission.clientCount} filings</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="text-base">${selectedSubmission.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                    <p className="text-base">{selectedSubmission.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Last Activity</p>
                    <p className="text-base">{new Date(selectedSubmission.lastActivity).toLocaleString()}</p>
                  </div>
                  {selectedSubmission.daysInactive && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Days Inactive</p>
                      <p className="text-base text-red-600">{selectedSubmission.daysInactive} days</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Details */}
              {selectedSubmission.clients && selectedSubmission.clients.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl mb-4 text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                    Client Details ({selectedSubmission.clients.length} {selectedSubmission.clients.length === 1 ? 'Client' : 'Clients'})
                  </h3>
                  <div className="space-y-6">
                    {selectedSubmission.clients.map((client, index) => (
                      <Card key={index} className="border-2 border-gray-200">
                        <CardHeader className="bg-gray-50 pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{client.llcName}</CardTitle>
                            <Badge className={client.exemptStatus === 'exempt' ? 'bg-yellow-500' : 'bg-[#00274E]'}>
                              {client.exemptStatus === 'exempt' ? 'Exempt' : 'Non-Exempt'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">EIN</p>
                              <p className="font-mono">{client.ein}</p>
                            </div>
                            {client.formationDate && (
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Formation Date</p>
                                <p>{client.formationDate}</p>
                              </div>
                            )}
                            {client.county && (
                              <div>
                                <p className="text-sm text-gray-500 mb-1">County</p>
                                <p>{client.county}</p>
                              </div>
                            )}
                            {client.address && (
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Address</p>
                                <p>{client.address}</p>
                              </div>
                            )}
                          </div>

                          {/* Exempt Reason */}
                          {client.exemptStatus === 'exempt' && client.exemptionReason && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                              <p className="text-sm text-gray-600 mb-1">Exemption Reason</p>
                              <p className="text-base">{client.exemptionReason}</p>
                            </div>
                          )}

                          {/* Beneficial Owners */}
                          {client.beneficialOwners && client.beneficialOwners.length > 0 && (
                            <div className="mt-4">
                              <p className="text-base mb-3" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                                Beneficial Owners ({client.beneficialOwners.length})
                              </p>
                              <div className="space-y-3">
                                {client.beneficialOwners.map((owner, ownerIndex) => (
                                  <div key={ownerIndex} className="p-4 bg-blue-50 border border-blue-200 rounded">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div>
                                        <p className="text-xs text-gray-500 mb-1">Name</p>
                                        <p className="text-sm">{owner.name}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                                        <p className="text-sm">{owner.dob}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 mb-1">SSN</p>
                                        <p className="text-sm font-mono">{owner.ssn}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 mb-1">Address</p>
                                        <p className="text-sm">{owner.address}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Abandoned Submission Notice */}
              {selectedSubmission.status === "Abandoned" && selectedSubmission.daysInactive && selectedSubmission.daysInactive > 31 && (
                <div className="mt-6 p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-yellow-900 text-lg mb-2">
                        <strong>Action Available:</strong> This submission has been abandoned for over 31 days.
                      </p>
                      <p className="text-sm text-yellow-800 mb-4">
                        You can now use the information from this abandoned submission for administrative purposes. All client data, beneficial owner information, and firm contact details submitted are viewable above.
                      </p>
                      <Button variant="outline" size="sm" className="border-yellow-600 text-yellow-900 hover:bg-yellow-100">
                        <Download className="mr-2 h-4 w-4" />
                        Export All Abandoned Data
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#00274E] border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <ImageWithFallback 
                src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                alt="NYLTA.com Logo"
                className="h-10 sm:h-12 md:h-14 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-none"
              />
              <div className="border-l-2 border-white/30 pl-6">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-white text-3xl">Super Admin Dashboard</h1>
                  <Badge className="bg-yellow-400 text-[#00274E] border-yellow-400 rounded-none">
                    <Shield className="h-3 w-3 mr-1" />
                    Full Access
                  </Badge>
                </div>
                <p className="text-gray-300">
                  Manage bulk filing submissions and revenue
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={onNavigateToDocs || (() => window.location.href = '/docs')} 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-none"
              >
                <FileText className="mr-2 h-4 w-4" />
                Documentation
              </Button>
              <Button 
                onClick={() => setCurrentRole(null)} 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-none"
              >
                Switch Role
              </Button>
              <Button onClick={onBack} variant="outline" className="bg-white rounded-none">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Exit Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)} className="mb-6">
          <TabsList className="grid w-full max-w-6xl grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="tools">
              <Wrench className="mr-2 h-4 w-4" />
              Tools
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Header Card */}
            <Card className="border-2 border-[#00274E] bg-white">
              <CardContent className="py-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl text-[#00274E] mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                      Dashboard Overview
                    </h2>
                    <p className="text-base text-gray-600">
                      Monitor your bulk filing submissions, revenue, and system performance
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className="bg-green-600 text-white">
                      <Activity className="w-3 h-3 mr-1" />
                      Live Data from RewardLion CRM
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {submissions.length} {submissions.length === 1 ? 'submission' : 'submissions'} loaded
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real Account Statistics from Database */}
            <Card className="border-2 border-[#00274E] bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="h-6 w-6 text-[#00274E]" />
                  Account Statistics (Live Database)
                </CardTitle>
                <CardDescription>Real-time account management data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border-2 border-gray-200">
                    <div className="text-3xl text-[#00274E] mb-1" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                      {accountsLoading ? "..." : accounts.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Accounts</div>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-400">
                    <div className="text-3xl text-[#00274E] mb-1" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                      {accountsLoading ? "..." : accounts.filter(a => a.status === 'pending').length}
                    </div>
                    <div className="text-sm text-gray-700">Pending</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-400">
                    <div className="text-3xl text-[#00274E] mb-1" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                      {accountsLoading ? "..." : accounts.filter(a => a.status === 'approved').length}
                    </div>
                    <div className="text-sm text-gray-700">Approved</div>
                  </div>
                  
                  <div className="text-center p-4 bg-red-50 rounded-lg border-2 border-red-400">
                    <div className="text-3xl text-[#00274E] mb-1" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                      {accountsLoading ? "..." : accounts.filter(a => a.status === 'rejected').length}
                    </div>
                    <div className="text-sm text-gray-700">Rejected</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-100 rounded-lg border-2 border-gray-400">
                    <div className="text-3xl text-[#00274E] mb-1" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                      {accountsLoading ? "..." : accounts.filter(a => a.isFrozen).length}
                    </div>
                    <div className="text-sm text-gray-700">Frozen</div>
                  </div>
                </div>
                
                {!accountsLoading && accounts.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm text-gray-700 mb-2">Recent Signups</h4>
                    <div className="space-y-2">
                      {accounts
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 3)
                        .map(account => (
                          <div key={account.userId} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                            <div>
                              <div className="text-sm">{account.firmName}</div>
                              <div className="text-xs text-gray-500">{account.contactName} • {account.email}</div>
                            </div>
                            <Badge 
                              variant={account.status === 'approved' ? 'default' : account.status === 'pending' ? 'secondary' : 'destructive'}
                            >
                              {account.status}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Revenue Metrics Row (Demo Data) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-[#00274E] bg-gradient-to-br from-[#00274E] to-[#003d7a]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-gray-200 text-sm uppercase tracking-wider">This Month Revenue</CardDescription>
                    <DollarSign className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-4xl text-white mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                    {formatCurrency(thisMonthRevenue)}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm">
                    {revenueGrowth >= 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        <span className="text-green-400">{formatPercentage(revenueGrowth)} vs last month</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-400" />
                        <span className="text-red-400">{formatPercentage(Math.abs(revenueGrowth))} vs last month</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm mt-2">{thisMonthSubmissions.length} paid submissions</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-300 bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-gray-600 text-sm uppercase tracking-wider">Last Month Revenue</CardDescription>
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-4xl text-[#00274E] mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                    {formatCurrency(lastMonthRevenue)}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">{lastMonthSubmissions.length} paid submissions</p>
                  <p className="text-gray-500 text-sm mt-2">{lastMonthSubmissions.reduce((acc, s) => acc + s.clientCount, 0)} total clients filed</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-gray-700 text-sm uppercase tracking-wider">Total Revenue</CardDescription>
                    <TrendingUp className="h-8 w-8 text-[#00274E]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-4xl text-[#00274E] mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                    {formatCurrency(totalRevenue)}
                  </CardTitle>
                  <p className="text-gray-700 text-sm">All-time revenue</p>
                  <p className="text-gray-600 text-sm mt-2">{totalPaidSubmissions} total paid submissions</p>
                </CardContent>
              </Card>
            </div>

            {/* System Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-2 border-[#00274E] hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-gray-600 text-xs uppercase tracking-wider">Active Firms</CardDescription>
                    <Building2 className="h-6 w-6 text-[#00274E]" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-4xl text-[#00274E] mb-1" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                    {formatNumber(new Set(submissions.map(s => s.firmEIN)).size)}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">Unique firms</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#00274E] hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-gray-600 text-xs uppercase tracking-wider">Paid Submissions</CardDescription>
                    <CheckCircle2 className="h-6 w-6 text-[#00274E]" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-4xl text-[#00274E] mb-1" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                    {formatNumber(totalPaidSubmissions)}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">Completed</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-400 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-gray-600 text-xs uppercase tracking-wider">Processing</CardDescription>
                    <Clock className="h-6 w-6 text-gray-600" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-4xl text-gray-700 mb-1" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                    {formatNumber(processingSubmissions)}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">In progress</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-gray-600 text-xs uppercase tracking-wider">Abandoned</CardDescription>
                    <AlertTriangle className="h-6 w-6 text-gray-700" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-4xl text-gray-800 mb-1" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                    {formatNumber(totalAbandonedSubmissions)}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">{abandonedOver31Days} over 31 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Service Type Breakdown Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-gray-700 text-sm uppercase tracking-wider flex items-center gap-2">
                      <span>💙</span> Compliance Monitoring
                    </CardDescription>
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Revenue</p>
                      <CardTitle className="text-2xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                        {formatCurrency(monitoringRevenue)}
                      </CardTitle>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Clients</p>
                      <CardTitle className="text-2xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                        {formatNumber(monitoringClients)}
                      </CardTitle>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">{monitoringSubmissions.length} submissions ($249 each)</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3 border-blue-500 text-blue-700 hover:bg-blue-100"
                    onClick={() => {
                      setSelectedView('submissions');
                      setServiceFilter('monitoring');
                    }}
                  >
                    View Monitoring Clients →
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-gray-700 text-sm uppercase tracking-wider flex items-center gap-2">
                      <span>⭐</span> Bulk Filing
                    </CardDescription>
                    <CheckCircle2 className="h-6 w-6 text-yellow-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Revenue</p>
                      <CardTitle className="text-2xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                        {formatCurrency(filingRevenue)}
                      </CardTitle>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Clients</p>
                      <CardTitle className="text-2xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                        {formatNumber(filingClients)}
                      </CardTitle>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">{filingSubmissions.length} submissions ($358-398 each)</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3 border-yellow-500 text-yellow-700 hover:bg-yellow-100"
                    onClick={() => {
                      setSelectedView('submissions');
                      setServiceFilter('filing');
                    }}
                  >
                    View Filing Clients →
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-6 mt-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by firm name, EIN, or confirmation number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-64">
                    <Label htmlFor="status">Status Filter</Label>
                    <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Abandoned">Abandoned (All)</SelectItem>
                        <SelectItem value="Abandoned30+">Abandoned &gt;30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-64">
                    <Label htmlFor="service">Service Type</Label>
                    <Select value={serviceFilter} onValueChange={(v: any) => setServiceFilter(v)}>
                      <SelectTrigger id="service">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        <SelectItem value="monitoring">💙 Monitoring Only</SelectItem>
                        <SelectItem value="filing">⭐ Bulk Filing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submissions Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Submissions ({filteredSubmissions.length})</CardTitle>
                    {serviceFilter !== 'all' && (
                      <p className="text-sm text-gray-500 mt-1">
                        Filtered: {serviceFilter === 'monitoring' ? '💙 Monitoring Only' : '⭐ Bulk Filing Only'}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        generateAdminSummaryPDF(
                          filteredSubmissions.map(s => ({
                            confirmationNumber: s.confirmationNumber,
                            firmName: s.firmName,
                            firmEIN: s.firmEIN,
                            submittedDate: s.submittedDate,
                            clientCount: s.clientCount,
                            totalAmount: s.totalAmount,
                            status: s.status,
                            paymentMethod: s.paymentMethod,
                            reviewedBy: s.reviewedBy,
                            reviewedDate: s.reviewedDate,
                            ipAddress: s.ipAddress,
                            authorization: s.authorization
                          }))
                        );
                      }}
                      className="rounded-none border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export All as PDF
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-none" onClick={exportToCSV}>
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Firm Name</TableHead>
                      <TableHead>Confirmation #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Clients</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id} className={
                        submission.status === "Abandoned" && submission.daysInactive && submission.daysInactive > 31 
                          ? "bg-red-50" 
                          : ""
                      }>
                        <TableCell>
                          <div>
                            <p>{submission.firmName}</p>
                            <p className="text-xs text-gray-500">{submission.firmEIN}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{submission.confirmationNumber}</TableCell>
                        <TableCell>{new Date(submission.submittedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={submission.serviceType === 'monitoring' ? 'outline' : 'default'}>
                            {submission.serviceType === 'monitoring' ? '💙 Monitoring' : '⭐ Filing'}
                          </Badge>
                        </TableCell>
                        <TableCell>{submission.clientCount}</TableCell>
                        <TableCell>${submission.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          {getStatusBadge(submission.status)}
                          {submission.daysInactive && submission.daysInactive > 31 && (
                            <p className="text-xs text-red-600 mt-1">
                              {submission.daysInactive} days inactive
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {/* Mark as Paid Button */}
                            {submission.status === 'Pending Review' && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-green-500 text-green-700 hover:bg-green-50"
                                onClick={() => {
                                  if (confirm(`Mark ${submission.firmName} as PAID?\n\nAmount: $${submission.totalAmount.toLocaleString()}\nClients: ${submission.clientCount}`)) {
                                    const updatedSubmissions = submissions.map(s => 
                                      s.id === submission.id 
                                        ? { ...s, status: 'Paid' as const, reviewedBy: 'Admin', reviewedDate: new Date().toISOString() }
                                        : s
                                    );
                                    setSubmissions(updatedSubmissions);
                                    alert(`✅ Payment approved!`);
                                  }
                                }}
                              >
                                ✓ Mark Paid
                              </Button>
                            )}
                            {/* Upgrade to Filing Button - Only for Monitoring submissions that are Paid */}
                            {submission.serviceType === 'monitoring' && submission.status === 'Paid' && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                                onClick={() => {
                                  if (confirm(`Upgrade ${submission.firmName} to Bulk Filing?\n\nUpgrade Cost: $149 (${submission.clientCount} clients)\nOriginal: $${submission.totalAmount} monitoring\nTotal for filing: $${submission.totalAmount + (submission.clientCount * 149)}`)) {
                                    alert('Upgrade functionality will be implemented with payment processing.');
                                  }
                                }}
                                title="Upgrade to Filing Service - Pay only $149 difference per client"
                              >
                                ⭐ Upgrade
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSubmission(submission)}
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              className="bg-[#00274E] hover:bg-[#003366] text-white rounded-none"
                              onClick={() => {
                                generateAdminSubmissionPDF({
                                  confirmationNumber: submission.confirmationNumber,
                                  firmName: submission.firmName,
                                  firmEIN: submission.firmEIN,
                                  submittedDate: submission.submittedDate,
                                  clientCount: submission.clientCount,
                                  totalAmount: submission.totalAmount,
                                  status: submission.status,
                                  paymentMethod: submission.paymentMethod,
                                  reviewedBy: submission.reviewedBy,
                                  reviewedDate: submission.reviewedDate,
                                  ipAddress: submission.ipAddress,
                                  authorization: submission.authorization,
                                  clients: submission.clients?.map(c => ({
                                    id: c.llcName,
                                    entityName: c.llcName,
                                    ein: c.ein,
                                    address: c.address || "N/A",
                                    formationDate: c.formationDate || "N/A",
                                    exemptStatus: c.exemptStatus,
                                    exemptionReason: c.exemptionReason
                                  }))
                                });
                              }}
                              title="Download Admin PDF with IP & Authorization"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6 mt-6">
            {/* Header Card */}
            <Card className="border-2 border-[#00274E] bg-white">
              <CardContent className="py-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl text-[#00274E] mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                      Performance Statistics
                    </h2>
                    <p className="text-base text-gray-600">
                      Detailed analytics and trends from real submission data
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className="bg-green-600 text-white">
                      <Activity className="w-3 h-3 mr-1" />
                      Real-Time Analytics
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Last 6 months • {submissions.filter(s => s.status === 'Paid').length} paid submissions
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-2 border-[#00274E]">
                <CardHeader className="bg-gray-50 pb-4">
                  <CardDescription className="text-base text-gray-700">Total Revenue</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-5xl mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                    ${totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-base text-gray-600">All-time</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-300">
                <CardHeader className="bg-gray-50 pb-4">
                  <CardDescription className="text-base text-gray-700">Total Clients Filed</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-5xl mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                    {totalClientsFiled}
                  </p>
                  <p className="text-base text-gray-600">Successful filings</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-300">
                <CardHeader className="bg-gray-50 pb-4">
                  <CardDescription className="text-base text-gray-700">Conversion Rate</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-5xl mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                    {formatPercentage(conversionRate)}
                  </p>
                  <p className="text-base text-gray-600">Paid vs Total</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-300">
                <CardHeader className="bg-gray-50 pb-4">
                  <CardDescription className="text-base text-gray-700">Avg Revenue/Submission</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-5xl mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                    {formatCurrency(avgRevenuePerSubmission)}
                  </p>
                  <p className="text-base text-gray-600">Per paid submission</p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Trend Chart */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">Revenue Trend Analysis (Last 6 Months)</CardTitle>
                <CardDescription>Monthly revenue, submissions, and client filing volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#6B7280', fontSize: 14 }}
                      axisLine={{ stroke: '#D1D5DB' }}
                    />
                    <YAxis 
                      tick={{ fill: '#6B7280', fontSize: 14 }}
                      axisLine={{ stroke: '#D1D5DB' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        border: '2px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#00274E" 
                      fill="#00274E" 
                      fillOpacity={0.6}
                      name="Revenue ($)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-gray-200">
                  <div className="text-center">
                    <p className="text-base text-gray-600 mb-2">6-Month Total</p>
                    <p className="text-3xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                      ${monthlyRevenueData.reduce((acc, d) => acc + d.revenue, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-base text-gray-600 mb-2">Total Submissions</p>
                    <p className="text-3xl text-gray-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                      {monthlyRevenueData.reduce((acc, d) => acc + d.submissions, 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-base text-gray-600 mb-2">Total Clients</p>
                    <p className="text-3xl text-gray-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                      {monthlyRevenueData.reduce((acc, d) => acc + d.clients, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Submission Status Distribution */}
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl">Submission Status Distribution</CardTitle>
                  <CardDescription>Breakdown of all submissions by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-6 space-y-3">
                    {statusDistributionData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                          <span className="text-base">{item.name}</span>
                        </div>
                        <span className="text-2xl" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Client Volume Distribution */}
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl">Client Volume Distribution</CardTitle>
                  <CardDescription>Submissions grouped by number of clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={clientVolumeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="range" 
                        tick={{ fill: '#6B7280', fontSize: 14 }}
                        label={{ value: 'Clients per Submission', position: 'insideBottom', offset: -5, fill: '#6B7280' }}
                      />
                      <YAxis 
                        tick={{ fill: '#6B7280', fontSize: 14 }}
                        label={{ value: 'Number of Submissions', angle: -90, position: 'insideLeft', fill: '#6B7280' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFFFFF', 
                          border: '2px solid #D1D5DB',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="count" fill="#00274E" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-6 pt-6 border-t-2 border-gray-200 text-center">
                    <p className="text-base text-gray-600 mb-2">Most Common Range</p>
                    <p className="text-3xl text-gray-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                      {clientVolumeData.sort((a, b) => b.count - a.count)[0].range} clients
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weekly Submission Pattern */}
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl">Weekly Submission Pattern (November)</CardTitle>
                  <CardDescription>Submissions and revenue by week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklySubmissionsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="week" 
                        tick={{ fill: '#6B7280', fontSize: 14 }}
                      />
                      <YAxis 
                        yAxisId="left"
                        tick={{ fill: '#6B7280', fontSize: 14 }}
                        label={{ value: 'Submissions', angle: -90, position: 'insideLeft', fill: '#6B7280' }}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right"
                        tick={{ fill: '#6B7280', fontSize: 14 }}
                        label={{ value: 'Revenue ($)', angle: 90, position: 'insideRight', fill: '#6B7280' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFFFFF', 
                          border: '2px solid #D1D5DB',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="submissions" 
                        stroke="#4B5563" 
                        strokeWidth={3}
                        dot={{ fill: '#4B5563', r: 6 }}
                        name="Submissions"
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#00274E" 
                        strokeWidth={3}
                        dot={{ fill: '#00274E', r: 6 }}
                        name="Revenue ($)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue by Pricing Tier */}
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl">Revenue by Pricing Tier</CardTitle>
                  <CardDescription>Which client volume ranges generate the most revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueByTierData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        type="number"
                        tick={{ fill: '#6B7280', fontSize: 14 }}
                        label={{ value: 'Revenue ($)', position: 'bottom', fill: '#6B7280' }}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="tier" 
                        tick={{ fill: '#6B7280', fontSize: 13 }}
                        width={120}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFFFFF', 
                          border: '2px solid #00274E',
                          borderRadius: '8px'
                        }}
                        formatter={(value: any) => ['$' + value.toLocaleString(), 'Revenue']}
                      />
                      <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                        {revenueByTierData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#FFD700' : '#00274E'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-6 pt-6 border-t-2 border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-base text-gray-600 mb-2">Highest Revenue Tier</p>
                        <p className="text-2xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                          {revenueByTierData.length > 0 && revenueByTierData.some(t => t.revenue > 0)
                            ? revenueByTierData.sort((a, b) => b.revenue - a.revenue)[0].tier
                            : 'N/A'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-base text-gray-600 mb-2">Revenue Share</p>
                        <p className="text-2xl text-[#FFD700]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                          {revenueByTierData.length > 0 && revenueByTierData.some(t => t.revenue > 0)
                            ? revenueByTierData.sort((a, b) => b.revenue - a.revenue)[0].percentage + '%'
                            : '0%'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Firms Table */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">Top Performing Firms</CardTitle>
                <CardDescription>Firms ranked by total revenue contributed</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-base">Rank</TableHead>
                      <TableHead className="text-base">Firm Name</TableHead>
                      <TableHead className="text-base">EIN</TableHead>
                      <TableHead className="text-base">Clients Filed</TableHead>
                      <TableHead className="text-base">Total Revenue</TableHead>
                      <TableHead className="text-base">Avg per Client</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions
                      .filter(s => s.status === "Paid")
                      .sort((a, b) => b.totalAmount - a.totalAmount)
                      .slice(0, 5)
                      .map((submission, index) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <span className="text-2xl" style={{ fontFamily: 'Libre Baskerville, serif' }}>#{index + 1}</span>
                          </TableCell>
                          <TableCell>
                            <p className="text-base">{submission.firmName}</p>
                          </TableCell>
                          <TableCell className="font-mono">{submission.firmEIN}</TableCell>
                          <TableCell className="text-base">{submission.clientCount}</TableCell>
                          <TableCell>
                            <span className="text-xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                              ${submission.totalAmount.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-base">
                            ${(submission.totalAmount / submission.clientCount).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Data Export */}
            <Card className="border-2 border-[#00274E]">
              <CardContent className="py-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                      Export Statistical Reports
                    </h3>
                    <p className="text-base text-gray-600">
                      Download comprehensive data reports for external analysis and record-keeping
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="border-[#00274E]" onClick={exportToCSV}>
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </Button>
                    <Button className="bg-[#00274E] hover:bg-[#003d73]" onClick={exportToPDF}>
                      <Download className="mr-2 h-4 w-4" />
                      Export PDF Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6 mt-6">
            <AdminPricingSettings />
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6 mt-6">
            <AdminTools onBack={() => setSelectedView("overview")} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}