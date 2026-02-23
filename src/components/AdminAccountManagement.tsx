import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { SERVER_URL } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Search, UserCheck, UserX, Eye, Send, Mail, XCircle, CheckCircle2, Clock, Key, Trash2, RefreshCw, Lock, Unlock, Wifi, WifiOff, Loader2 } from "lucide-react";
// GHL firm contact is now created server-side during approval — no direct GHL calls needed here

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
  isFrozen?: boolean;
  workers?: any[];
  ghlFirmContactId?: string;
  highLevelContactId?: string;
  highLevelTags?: string[];
  highLevelSyncStatus?: 'success' | 'failed' | 'pending';
  highLevelSyncError?: string;
  firmProfileCompleted?: boolean;
  rejectionReason?: string;
}

export default function AdminAccountManagement() {
  const { session } = useAuth();
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<UserAccount | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showChangeToPendingDialog, setShowChangeToPendingDialog] = useState(false);
  const [showFreezeDialog, setShowFreezeDialog] = useState(false);
  const [showUnfreezeDialog, setShowUnfreezeDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [generatedUsername, setGeneratedUsername] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [cleanupEmail, setCleanupEmail] = useState("");
  const [showCleanupDialog, setShowCleanupDialog] = useState(false);
  const [creatingGhlContact, setCreatingGhlContact] = useState(false);
  const [ghlTestResult, setGhlTestResult] = useState<{
    ok: boolean;
    statusCode?: number;
    locationId?: string;
    locationName?: string;
    keyPrefix?: string;
    elapsedMs?: number;
    error?: string;
  } | null>(null);
  const [testingGhlConn, setTestingGhlConn] = useState(false);

  // Test GHL API connectivity
  const handleTestGhlConnection = async () => {
    if (!session?.access_token) {
      toast.error('Not authenticated');
      return;
    }
    setTestingGhlConn(true);
    setGhlTestResult(null);
    try {
      const res = await fetch(`${SERVER_URL}/admin/ghl/test-connection`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      // Safely parse — if the response isn't valid JSON, show the raw text
      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        // Edge function returned non-JSON (deployment error, gateway issue, etc.)
        console.error('Non-JSON response from test-connection:', text.substring(0, 500));
        setGhlTestResult({ ok: false, error: `Server returned non-JSON (HTTP ${res.status}): ${text.substring(0, 200)}` });
        toast.error(`Server error: non-JSON response (HTTP ${res.status})`);
        return;
      }
      setGhlTestResult(data);
      if (data.ok) {
        toast.success(`GHL connected ✓ — ${data.locationName || data.locationId}`);
      } else {
        toast.error(`GHL connection failed: ${data.error || `HTTP ${data.statusCode}`}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setGhlTestResult({ ok: false, error: msg });
      toast.error(`Network error: ${msg}`);
    } finally {
      setTestingGhlConn(false);
    }
  };

  // Create or recreate GHL firm contact for an account
  const handleCreateGhlContact = async (account: UserAccount) => {
    if (!session?.access_token) {
      toast.error("Not authenticated");
      return;
    }

    setCreatingGhlContact(true);
    try {
      console.log('Creating GHL firm contact for:', account.email, '| userId:', account.userId);
      const url = `${SERVER_URL}/admin/accounts/${account.userId}/create-ghl-contact`;
      console.log('POST →', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({})
      });

      const responseText = await response.text();
      console.log('Response status:', response.status, '| Body:', responseText);

      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error(`Server returned invalid JSON (HTTP ${response.status}): ${responseText.substring(0, 200)}`);
      }

      if (!response.ok) {
        console.error('GHL contact creation error:', data);
        throw new Error(data.error || data.details || `Failed to create GHL contact (HTTP ${response.status})`);
      }

      toast.success(`GHL firm contact created: ${data.ghlFirmContactId}`);
      console.log('GHL firm contact created:', data.ghlFirmContactId);

      // Update the selected account in state so the UI reflects the new ID
      if (selectedAccount && selectedAccount.userId === account.userId) {
        setSelectedAccount({
          ...selectedAccount,
          ghlFirmContactId: data.ghlFirmContactId,
          highLevelContactId: data.ghlFirmContactId,
        });
      }

      // Refresh the accounts list
      await fetchAccounts();
    } catch (error) {
      console.error('Error creating GHL contact:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create GHL contact');
    } finally {
      setCreatingGhlContact(false);
    }
  };

  // Fetch accounts from backend
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    if (!session?.access_token) {
      toast.error("Not authenticated");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${SERVER_URL}/admin/accounts`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch accounts');
      }

      const data = await response.json();
      setAccounts(data.accounts || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (account: UserAccount) => {
    setSelectedAccount(account);
    setShowApprovalDialog(true);
  };

  const confirmApproval = async () => {
    if (!selectedAccount || !session?.access_token) return;

    try {
      console.log('Starting approval process for:', selectedAccount.email);
      console.log('Making request to:', `${SERVER_URL}/admin/accounts/${selectedAccount.userId}/approve`);
      
      const response = await fetch(`${SERVER_URL}/admin/accounts/${selectedAccount.userId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({})
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Approval error response:', error);
        throw new Error(error.error || 'Failed to approve account');
      }

      const data = await response.json();
      console.log('Approval success:', data);
      
      // Store generated credentials for display
      if (data.credentials) {
        setGeneratedUsername(data.credentials.username);
        setGeneratedPassword(data.credentials.temporaryPassword);
      }
      
      toast.success(`Account approved! Credentials generated for ${selectedAccount.email}`);
      
      // GHL firm contact is now created server-side during approval.
      // The server endpoint creates the firm contact via POST /contacts/
      // and stores the ghlFirmContactId on the account automatically.
      console.log('✅ Server handled GHL firm contact creation during approval');
      
      // Refresh accounts list
      await fetchAccounts();
      
      // Close approval dialog and open credentials dialog
      setShowApprovalDialog(false);
      setShowCredentialsDialog(true);
    } catch (error) {
      console.error('Error approving account:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to approve account');
    }
  };

  const handleReject = (account: UserAccount) => {
    setSelectedAccount(account);
    setShowRejectionDialog(true);
  };

  const confirmRejection = async () => {
    if (!selectedAccount || !rejectionReason.trim() || !session?.access_token) {
      toast.error("Please provide a rejection reason.");
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/admin/accounts/${selectedAccount.userId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          rejectionReason
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reject account');
      }

      toast.success(`Account rejected. Notification sent to ${selectedAccount.email}`);
      
      // Refresh accounts list
      await fetchAccounts();
      
      setShowRejectionDialog(false);
      setSelectedAccount(null);
      setRejectionReason("");
    } catch (error) {
      console.error('Error rejecting account:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reject account');
    }
  };

  const generateUsername = (firmName: string, contactName: string) => {
    const safeFirmName = firmName || '';
    const safeContactName = contactName || '';
    const firmPart = safeFirmName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15);
    const namePart = safeContactName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10);
    return `${firmPart}_${namePart}`;
  };

  const generateTemporaryPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleResendCredentials = (account: UserAccount) => {
    if (!account.workers || account.workers.length === 0) return;
    
    alert(`Credentials resent to ${account.email}\nUsername: ${account.workers[0].username}\nPassword: ${account.workers[0].temporaryPassword}`);
    
    const updatedAccounts = accounts.map(acc =>
      acc.userId === account.userId && acc.workers
        ? {
            ...acc,
            workers: [
              {
                ...acc.workers[0],
                sentDate: new Date().toISOString()
              }
            ]
          }
        : acc
    );
    setAccounts(updatedAccounts);
  };

  const handleResetPassword = async (account: UserAccount) => {
    if (!session?.access_token) {
      toast.error("Not authenticated");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to reset the password for ${account.contactName} (${account.firmName})?\n\nA new temporary password will be generated and sent to ${account.email}.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${SERVER_URL}/admin/accounts/${account.userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reset password');
      }

      const data = await response.json();
      
      toast.success(`Password reset successfully! New credentials sent to ${account.email}`);
      
      // Show the new credentials
      if (data.credentials) {
        setSelectedAccount(account);
        setGeneratedUsername(data.credentials.username);
        setGeneratedPassword(data.credentials.temporaryPassword);
        setShowCredentialsDialog(true);
        setShowDetailsDialog(false);
      }
      
      // Refresh accounts list
      await fetchAccounts();
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reset password');
    }
  };

  const handleViewDetails = (account: UserAccount) => {
    setSelectedAccount(account);
    setGhlTestResult(null); // reset previous test result
    setShowDetailsDialog(true);
  };

  const handleChangeToPending = (account: UserAccount) => {
    setSelectedAccount(account);
    setShowChangeToPendingDialog(true);
  };

  const confirmChangeToPending = async () => {
    if (!selectedAccount || !session?.access_token) return;

    try {
      const response = await fetch(`${SERVER_URL}/admin/accounts/${selectedAccount.userId}/change-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          status: 'pending'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to change status');
      }

      toast.success(`Account status changed to pending for ${selectedAccount.email}`);
      
      // Refresh accounts list
      await fetchAccounts();
      
      setShowChangeToPendingDialog(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error('Error changing status:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to change status');
    }
  };

  const handleDeleteAccount = (account: UserAccount) => {
    setSelectedAccount(account);
    setShowDeleteDialog(true);
  };

  const confirmDeleteAccount = async () => {
    if (!selectedAccount || !session?.access_token) return;

    try {
      const response = await fetch(`${SERVER_URL}/admin/accounts/${selectedAccount.userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete account');
      }

      toast.success(`Account request for ${selectedAccount.email} has been deleted`);
      
      // Refresh accounts list
      await fetchAccounts();
      
      setShowDeleteDialog(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete account');
    }
  };

  const handleFreezeAccount = (account: UserAccount) => {
    setSelectedAccount(account);
    setShowFreezeDialog(true);
  };

  const confirmFreezeAccount = async () => {
    if (!selectedAccount || !session?.access_token) return;

    try {
      const response = await fetch(`${SERVER_URL}/admin/accounts/${selectedAccount.userId}/freeze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to freeze account');
      }

      toast.success(`Account ${selectedAccount.email} has been frozen`);
      
      // Refresh accounts list
      await fetchAccounts();
      
      setShowFreezeDialog(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error('Error freezing account:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to freeze account');
    }
  };

  const handleUnfreezeAccount = (account: UserAccount) => {
    setSelectedAccount(account);
    setShowUnfreezeDialog(true);
  };

  const confirmUnfreezeAccount = async () => {
    if (!selectedAccount || !session?.access_token) return;

    try {
      const response = await fetch(`${SERVER_URL}/admin/accounts/${selectedAccount.userId}/unfreeze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to unfreeze account');
      }

      toast.success(`Account ${selectedAccount.email} has been unfrozen`);
      
      // Refresh accounts list
      await fetchAccounts();
      
      setShowUnfreezeDialog(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error('Error unfreezing account:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to unfreeze account');
    }
  };

  const handleCleanupEmail = async () => {
    if (!cleanupEmail.trim() || !session?.access_token) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/admin/accounts/by-email/${encodeURIComponent(cleanupEmail)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cleanup account');
      }

      if (data.success) {
        toast.success(`✅ Successfully cleaned up ${cleanupEmail}. Email is now available for registration.`);
        setCleanupEmail("");
        setShowCleanupDialog(false);
        // Refresh accounts list
        await fetchAccounts();
      } else {
        toast.info(data.message || 'No account found');
      }
    } catch (error) {
      console.error('Error cleaning up email:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to cleanup account');
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      (account.firmName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (account.contactName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (account.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const pendingCount = accounts.filter(a => a.status === "pending").length;
  const approvedCount = accounts.filter(a => a.status === "approved").length;
  const rejectedCount = accounts.filter(a => a.status === "rejected").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-600 hover:bg-red-700"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
          Account Management
        </h1>
        <p className="text-base text-gray-600">
          Review, approve, and manage user account registrations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-yellow-400">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              {pendingCount}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Approved Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              {approvedCount}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              {rejectedCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-2 border-gray-300">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Accounts</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by firm name, contact, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-gray-300"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => setShowCleanupDialog(true)}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 rounded-none"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Cleanup Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card className="border-2 border-gray-300">
        <CardHeader className="bg-[#00274E] text-white">
          <CardTitle>Account Requests</CardTitle>
          <CardDescription className="text-gray-300">
            {filteredAccounts.length} account{filteredAccounts.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Firm Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.userId}>
                  <TableCell>
                    <div>
                      <div>{account.firmName}</div>
                      <div className="text-sm text-gray-500">{account.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{account.contactName}</div>
                      <div className="text-sm text-gray-500">{account.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-none">
                      {account.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(account.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(account.status)}</TableCell>
                  <TableCell>
                    {account.status === "approved" && (
                      <div className="text-sm">
                        {account.isFrozen ? (
                          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                            <Lock className="h-3 w-3 mr-1" />
                            Frozen
                          </Badge>
                        ) : account.isFirstLogin ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                            Logged In
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-600">
                            Not Logged In
                          </Badge>
                        )}
                        <br />
                        {account.workers && account.workers[0] && account.workers[0].temporaryPassword ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 mt-1">
                            Complete
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300 mt-1">
                            Incomplete
                          </Badge>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(account)}
                        className="rounded-none"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>

                      {account.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(account)}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-none"
                          >
                            <UserCheck className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(account)}
                            className="border-red-300 text-red-600 hover:bg-red-50 rounded-none"
                          >
                            <UserX className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}

                      {account.status === "approved" && account.workers && account.workers[0] && account.workers[0].temporaryPassword && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedAccount(account);
                              setGeneratedUsername(account.workers[0].username);
                              setGeneratedPassword(account.workers[0].temporaryPassword);
                              setShowCredentialsDialog(true);
                            }}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-none"
                          >
                            <Key className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResendCredentials(account)}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-none"
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Resend
                          </Button>
                          {account.isFrozen ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnfreezeAccount(account)}
                              className="border-green-300 text-green-600 hover:bg-green-50 rounded-none"
                            >
                              <Unlock className="h-3 w-3 mr-1" />
                              Unfreeze
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleFreezeAccount(account)}
                              className="border-orange-300 text-orange-600 hover:bg-orange-50 rounded-none"
                            >
                              <Lock className="h-3 w-3 mr-1" />
                              Freeze
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAccount(account)}
                            className="border-red-300 text-red-600 hover:bg-red-50 rounded-none"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </>
                      )}

                      {account.status === "rejected" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(account)}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-none"
                          >
                            <UserCheck className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleChangeToPending(account)}
                            className="border-yellow-300 text-yellow-600 hover:bg-yellow-50 rounded-none"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            To Pending
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAccount(account)}
                            className="border-red-300 text-red-600 hover:bg-red-50 rounded-none"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAccounts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No accounts found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              Approve Account & Generate Credentials
            </DialogTitle>
            <DialogDescription className="text-sm">
              This will create login credentials and send them to the user.
            </DialogDescription>
          </DialogHeader>

          {selectedAccount && (
            <div className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-sm">
                  <strong>Account Details:</strong>
                  <br />
                  Firm: {selectedAccount.firmName}
                  <br />
                  Contact: {selectedAccount.contactName}
                  <br />
                  Email: <span className="break-all">{selectedAccount.email}</span>
                </AlertDescription>
              </Alert>

              <Card className="border-2 border-gray-300 bg-gray-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base">Generated Credentials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm">Username</Label>
                    <Input
                      value={selectedAccount.email}
                      readOnly
                      className="font-mono bg-white text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Temporary Password</Label>
                    <Input
                      value={generateTemporaryPassword()}
                      readOnly
                      className="font-mono bg-white text-sm"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      User will be required to change password on first login
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Alert className="border-yellow-400 bg-yellow-50">
                <AlertDescription className="text-xs sm:text-sm text-yellow-900">
                  <strong>⚠️ Important:</strong> An email will be sent to <span className="break-all">{selectedAccount.email}</span> with:
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>Login credentials (username & temporary password)</li>
                    <li>Link to the NYLTA.com platform</li>
                    <li>Instructions for first-time login</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowApprovalDialog(false)}
              className="rounded-none w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApproval}
              className="bg-green-600 hover:bg-green-700 text-white rounded-none w-full sm:w-auto"
            >
              <Mail className="h-4 w-4 mr-2" />
              Approve & Send Credentials
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl text-red-600">
              <UserX className="h-6 w-6" />
              Reject Account Application
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. This will be sent to the applicant.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Rejection Reason *</Label>
              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full min-h-[120px] p-3 border-2 border-gray-300 rounded"
                placeholder="e.g., Unable to verify professional credentials, Missing required documentation, etc."
              />
            </div>

            {selectedAccount && (
              <Alert className="border-gray-300">
                <AlertDescription>
                  Rejection email will be sent to: <strong>{selectedAccount.email}</strong>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectionDialog(false);
                setRejectionReason("");
              }}
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRejection}
              className="bg-red-600 hover:bg-red-700 text-white rounded-none"
              disabled={!rejectionReason.trim()}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Account Details</DialogTitle>
            <DialogDescription className="text-sm">
              View complete information about this account registration.
            </DialogDescription>
          </DialogHeader>

          {selectedAccount && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600 text-sm">Firm Name</Label>
                  <p className="text-sm sm:text-base mt-1 break-words">{selectedAccount.firmName}</p>
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Contact Person</Label>
                  <p className="text-sm sm:text-base mt-1 break-words">{selectedAccount.contactName}</p>
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Email</Label>
                  <p className="text-sm sm:text-base mt-1 break-all">{selectedAccount.email}</p>
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Phone</Label>
                  <p className="text-sm sm:text-base mt-1">{selectedAccount.phone}</p>
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Professional Type</Label>
                  <p className="text-sm sm:text-base mt-1">{selectedAccount.role}</p>
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedAccount.status)}</div>
                </div>
              </div>

              {/* GHL Connection Test Panel */}
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-blue-600" />
                    GoHighLevel — API Connection Test
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-gray-600">
                    Run this first to confirm your API key and Location ID are valid before creating a firm contact.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={testingGhlConn}
                    onClick={handleTestGhlConnection}
                    className="rounded-none border-blue-400 text-blue-700 hover:bg-blue-100 w-full sm:w-auto"
                  >
                    {testingGhlConn ? (
                      <><Loader2 className="h-3 w-3 mr-1 animate-spin" />Testing...</>
                    ) : (
                      <><Wifi className="h-3 w-3 mr-1" />Test GHL Connection</>
                    )}
                  </Button>

                  {ghlTestResult && (
                    <div className={`rounded p-3 text-xs font-mono space-y-1 ${ghlTestResult.ok ? 'bg-green-50 border border-green-300 text-green-900' : 'bg-red-50 border border-red-300 text-red-900'}`}>
                      <div className="flex items-center gap-1 font-semibold">
                        {ghlTestResult.ok
                          ? <><CheckCircle2 className="h-3 w-3" /> Connected successfully</>
                          : <><WifiOff className="h-3 w-3" /> Connection failed</>
                        }
                      </div>
                      {ghlTestResult.locationId && <div>Location ID: {ghlTestResult.locationId}</div>}
                      {ghlTestResult.locationName && <div>Location Name: {ghlTestResult.locationName}</div>}
                      {ghlTestResult.keyPrefix && <div>API Key: {ghlTestResult.keyPrefix}</div>}
                      {ghlTestResult.elapsedMs !== undefined && <div>Response time: {ghlTestResult.elapsedMs}ms</div>}
                      {ghlTestResult.statusCode !== undefined && <div>HTTP Status: {ghlTestResult.statusCode}</div>}
                      {ghlTestResult.error && <div>Error: {ghlTestResult.error}</div>}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* GHL Firm Contact Section — always show so admins can create/recreate */}
              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    🔗 GoHighLevel — Firm Contact (Parent)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-gray-600 text-xs sm:text-sm">GHL Firm Contact ID</Label>
                    {selectedAccount.ghlFirmContactId || selectedAccount.highLevelContactId ? (
                      <p className="text-xs sm:text-sm mt-1 font-mono break-all text-green-700 font-semibold">
                        {selectedAccount.ghlFirmContactId || selectedAccount.highLevelContactId}
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm mt-1 text-red-600 font-semibold">
                        Not created — submissions will fail
                      </p>
                    )}
                  </div>

                  {/* Create / Recreate button */}
                  <div className="pt-2 border-t border-purple-200">
                    <Button
                      size="sm"
                      disabled={creatingGhlContact}
                      onClick={() => handleCreateGhlContact(selectedAccount)}
                      className={`rounded-none w-full sm:w-auto ${
                        selectedAccount.ghlFirmContactId || selectedAccount.highLevelContactId
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {creatingGhlContact ? (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          Creating...
                        </>
                      ) : selectedAccount.ghlFirmContactId || selectedAccount.highLevelContactId ? (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Recreate GHL Firm Contact
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Create GHL Firm Contact
                        </>
                      )}
                    </Button>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {selectedAccount.ghlFirmContactId || selectedAccount.highLevelContactId
                        ? 'Creates a new contact in GHL (may duplicate if old one still exists)'
                        : 'Required before this firm can submit filings to GHL'}
                    </p>
                  </div>

                  {selectedAccount.highLevelTags && selectedAccount.highLevelTags.length > 0 && (
                    <div>
                      <Label className="text-gray-600 text-xs sm:text-sm">Tags</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedAccount.highLevelTags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAccount.highLevelSyncError && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-xs text-red-800">
                        <strong>Error:</strong> {selectedAccount.highLevelSyncError}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {selectedAccount.workers && selectedAccount.workers[0] && (
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Login Credentials
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-gray-600 text-xs sm:text-sm">Username</Label>
                      <p className="text-xs sm:text-base mt-1 font-mono break-all">{selectedAccount.workers[0].username}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600 text-xs sm:text-sm">Temporary Password</Label>
                      <p className="text-xs sm:text-base mt-1 font-mono break-all">{selectedAccount.workers[0].temporaryPassword}</p>
                    </div>
                    {selectedAccount.workers[0].sentDate && (
                      <div>
                        <Label className="text-gray-600 text-xs sm:text-sm">Credentials Sent</Label>
                        <p className="text-xs sm:text-sm mt-1">
                          {new Date(selectedAccount.workers[0].sentDate).toLocaleString()}
                        </p>
                      </div>
                    )}
                    <div>
                      <Label className="text-gray-600 text-xs sm:text-sm">First Login</Label>
                      <p className="text-xs sm:text-sm mt-1">
                        {selectedAccount.isFirstLogin ? "❌ Not yet" : "✅ Completed"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-600 text-xs sm:text-sm">Profile Complete</Label>
                      <p className="text-xs sm:text-sm mt-1">
                        {selectedAccount.firmProfileCompleted ? "✅ Complete" : "⚠️ Incomplete"}
                      </p>
                    </div>
                    
                    {/* Reset Actions */}
                    <div className="pt-4 flex flex-col sm:flex-row gap-2 border-t border-blue-300 mt-4">
                      <Button
                        size="sm"
                        onClick={() => handleResetPassword(selectedAccount)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-none w-full sm:w-auto"
                      >
                        <Key className="h-3 w-3 mr-1" />
                        Reset Password
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResendCredentials(selectedAccount)}
                        className="border-blue-300 text-blue-600 hover:bg-blue-100 rounded-none w-full sm:w-auto"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Resend Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedAccount.rejectionReason && (
                <Alert className="border-red-300 bg-red-50">
                  <AlertDescription className="text-xs sm:text-sm text-red-900">
                    <strong>Rejection Reason:</strong>
                    <br />
                    {selectedAccount.rejectionReason}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              onClick={() => setShowDetailsDialog(false)}
              className="bg-[#00274E] hover:bg-[#003366] text-white rounded-none w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Credentials Dialog */}
      <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <UserCheck className="h-6 w-6 text-green-600" />
              Account Credentials
            </DialogTitle>
            <DialogDescription>
              These are the login credentials for the approved account.
            </DialogDescription>
          </DialogHeader>

          {selectedAccount && (
            <div className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription>
                  <strong>Account Details:</strong>
                  <br />
                  Firm: {selectedAccount.firmName}
                  <br />
                  Contact: {selectedAccount.contactName}
                  <br />
                  Email: {selectedAccount.email}
                </AlertDescription>
              </Alert>

              <Card className="border-2 border-gray-300 bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-base">Generated Credentials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Username</Label>
                    <Input
                      value={generatedUsername}
                      readOnly
                      className="font-mono bg-white"
                    />
                  </div>
                  <div>
                    <Label>Temporary Password</Label>
                    <Input
                      value={generatedPassword}
                      readOnly
                      className="font-mono bg-white"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      User will be required to change password on first login
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Alert className="border-yellow-400 bg-yellow-50">
                <AlertDescription className="text-yellow-900">
                  <strong>⚠️ Important:</strong> An email will be sent to {selectedAccount.email} with:
                  <ul className="list-disc ml-5 mt-2">
                    <li>Login credentials (username & temporary password)</li>
                    <li>Link to the NYLTA.com platform</li>
                    <li>Instructions for first-time login</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCredentialsDialog(false)}
              className="rounded-none"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change to Pending Dialog */}
      <Dialog open={showChangeToPendingDialog} onOpenChange={setShowChangeToPendingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl text-yellow-600">
              <Clock className="h-6 w-6" />
              Change Account Status to Pending
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status of this account to pending?
            </DialogDescription>
          </DialogHeader>

          {selectedAccount && (
            <div className="space-y-4">
              <Alert className="border-gray-300">
                <AlertDescription>
                  Account will be set to pending for: <strong>{selectedAccount.email}</strong>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowChangeToPendingDialog(false);
                setSelectedAccount(null);
              }}
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmChangeToPending}
              className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-none"
            >
              <Clock className="h-4 w-4 mr-2" />
              Change to Pending
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl text-red-600">
              <Trash2 className="h-6 w-6" />
              Delete Account Request
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this account request?
            </DialogDescription>
          </DialogHeader>

          {selectedAccount && (
            <div className="space-y-4">
              <Alert className="border-gray-300">
                <AlertDescription>
                  Account request will be deleted for: <strong>{selectedAccount.email}</strong>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedAccount(null);
              }}
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white rounded-none"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Freeze Account Dialog */}
      <Dialog open={showFreezeDialog} onOpenChange={setShowFreezeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl text-red-600">
              <Lock className="h-6 w-6" />
              Freeze Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to freeze this account?
            </DialogDescription>
          </DialogHeader>

          {selectedAccount && (
            <div className="space-y-4">
              <Alert className="border-gray-300">
                <AlertDescription>
                  Account will be frozen for: <strong>{selectedAccount.email}</strong>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowFreezeDialog(false);
                setSelectedAccount(null);
              }}
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmFreezeAccount}
              className="bg-red-600 hover:bg-red-700 text-white rounded-none"
            >
              <Lock className="h-4 w-4 mr-2" />
              Freeze Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unfreeze Account Dialog */}
      <Dialog open={showUnfreezeDialog} onOpenChange={setShowUnfreezeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl text-green-600">
              <Unlock className="h-6 w-6" />
              Unfreeze Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to unfreeze this account?
            </DialogDescription>
          </DialogHeader>

          {selectedAccount && (
            <div className="space-y-4">
              <Alert className="border-gray-300">
                <AlertDescription>
                  Account will be unfrozen for: <strong>{selectedAccount.email}</strong>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowUnfreezeDialog(false);
                setSelectedAccount(null);
              }}
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmUnfreezeAccount}
              className="bg-green-600 hover:bg-green-700 text-white rounded-none"
            >
              <Unlock className="h-4 w-4 mr-2" />
              Unfreeze Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cleanup Email Dialog */}
      <Dialog open={showCleanupDialog} onOpenChange={setShowCleanupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl text-red-600">
              <Trash2 className="h-6 w-6" />
              Cleanup Email
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cleanup this email address? This will delete the account request and make the email available for registration.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="cleanupEmail">Email Address *</Label>
              <Input
                id="cleanupEmail"
                value={cleanupEmail}
                onChange={(e) => setCleanupEmail(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded"
                placeholder="e.g., user@example.com"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCleanupDialog(false);
                setCleanupEmail("");
              }}
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCleanupEmail}
              className="bg-red-600 hover:bg-red-700 text-white rounded-none"
              disabled={!cleanupEmail.trim()}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Cleanup Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}