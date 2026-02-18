import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CheckCircle2, XCircle, Search, Filter, Eye, RefreshCw, Clock, User, Mail, Building2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { SERVER_URL } from "../utils/supabase/client";
import { useAuth } from "../contexts/AuthContext";

interface AuditLog {
  timestamp: string;
  action: string;
  contactId?: string;
  userId?: string;
  firmName?: string;
  email?: string;
  success: boolean;
  requestBody?: any;
  responseStatus?: number;
  responseBody?: string;
  errorMessage?: string;
  metadata?: any;
}

export default function AuditLogViewer() {
  const { session } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failure">("all");
  const [actionFilter, setActionFilter] = useState<"all" | "CONTACT_CREATE" | "ACCOUNT_APPROVAL_UPDATE">("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Fetch audit logs
  const fetchLogs = async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${SERVER_URL}/admin/audit-logs`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
        setFilteredLogs(data.logs || []);
      } else {
        console.error('Failed to fetch audit logs');
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [session]);

  // Apply filters
  useEffect(() => {
    let filtered = [...logs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.firmName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.contactId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(log => 
        statusFilter === "success" ? log.success : !log.success
      );
    }

    // Action filter
    if (actionFilter !== "all") {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, statusFilter, actionFilter]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'CONTACT_CREATE':
        return 'Contact Creation';
      case 'ACCOUNT_APPROVAL_UPDATE':
        return 'Approval Update';
      default:
        return action;
    }
  };

  const successCount = logs.filter(l => l.success).length;
  const failureCount = logs.filter(l => !l.success).length;
  const successRate = logs.length > 0 ? ((successCount / logs.length) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-[#00274E]">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Total API Calls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              {logs.length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-400">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Successful</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-green-600" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              {successCount}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-400">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Failed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-red-600" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              {failureCount}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-400">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Success Rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              {successRate}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>RewardLion API Audit Logs</span>
            <Button 
              onClick={fetchLogs} 
              disabled={loading}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>
            Complete history of all RewardLion API interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by email, firm name, contact ID, or action..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-gray-300 h-12"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-full md:w-[180px] border-2 border-gray-300 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success Only</SelectItem>
                <SelectItem value="failure">Failures Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={actionFilter} onValueChange={(v: any) => setActionFilter(v)}>
              <SelectTrigger className="w-full md:w-[200px] border-2 border-gray-300 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="CONTACT_CREATE">Contact Creation</SelectItem>
                <SelectItem value="ACCOUNT_APPROVAL_UPDATE">Approval Update</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Logs Table */}
          <div className="border-2 border-gray-200 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Email/Firm</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>HTTP Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Loading audit logs...
                    </TableCell>
                  </TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getActionLabel(log.action)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {log.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              {log.email}
                            </div>
                          )}
                          {log.firmName && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Building2 className="h-3 w-3 text-gray-400" />
                              {log.firmName}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.success ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Success
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            <XCircle className="h-3 w-3 mr-1" />
                            Failed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {log.responseStatus && (
                          <Badge variant={log.responseStatus >= 200 && log.responseStatus < 300 ? "default" : "destructive"}>
                            {log.responseStatus}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {log.metadata?.duration ? `${log.metadata.duration}ms` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              {selectedLog && formatTimestamp(selectedLog.timestamp)}
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Action</label>
                  <div className="text-base mt-1">{getActionLabel(selectedLog.action)}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <div className="mt-1">
                    {selectedLog.success ? (
                      <Badge className="bg-green-100 text-green-800">Success</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Failed</Badge>
                    )}
                  </div>
                </div>
                {selectedLog.email && (
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <div className="text-base mt-1">{selectedLog.email}</div>
                  </div>
                )}
                {selectedLog.firmName && (
                  <div>
                    <label className="text-sm text-gray-600">Firm Name</label>
                    <div className="text-base mt-1">{selectedLog.firmName}</div>
                  </div>
                )}
                {selectedLog.contactId && (
                  <div>
                    <label className="text-sm text-gray-600">Contact ID</label>
                    <div className="text-base mt-1 font-mono text-sm">{selectedLog.contactId}</div>
                  </div>
                )}
                {selectedLog.userId && (
                  <div>
                    <label className="text-sm text-gray-600">User ID</label>
                    <div className="text-base mt-1 font-mono text-sm">{selectedLog.userId}</div>
                  </div>
                )}
                {selectedLog.responseStatus && (
                  <div>
                    <label className="text-sm text-gray-600">HTTP Status</label>
                    <div className="text-base mt-1">{selectedLog.responseStatus}</div>
                  </div>
                )}
                {selectedLog.metadata?.duration && (
                  <div>
                    <label className="text-sm text-gray-600">Duration</label>
                    <div className="text-base mt-1">{selectedLog.metadata.duration}ms</div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {selectedLog.errorMessage && (
                <div>
                  <label className="text-sm text-gray-600">Error Message</label>
                  <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                    {selectedLog.errorMessage}
                  </div>
                </div>
              )}

              {/* Request Body */}
              {selectedLog.requestBody && (
                <div>
                  <label className="text-sm text-gray-600">Request Body</label>
                  <pre className="mt-1 p-3 bg-gray-100 border border-gray-200 rounded text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.requestBody, null, 2)}
                  </pre>
                </div>
              )}

              {/* Response Body */}
              {selectedLog.responseBody && (
                <div>
                  <label className="text-sm text-gray-600">Response Body</label>
                  <pre className="mt-1 p-3 bg-gray-100 border border-gray-200 rounded text-xs overflow-x-auto max-h-[200px]">
                    {selectedLog.responseBody}
                  </pre>
                </div>
              )}

              {/* Metadata */}
              {selectedLog.metadata && (
                <div>
                  <label className="text-sm text-gray-600">Metadata</label>
                  <pre className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
