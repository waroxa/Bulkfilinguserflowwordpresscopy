import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CheckCircle2, XCircle, RefreshCw, Clock, Building2, FileText, Eye, Search, BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { SERVER_URL } from "../utils/supabase/client";
import { useAuth } from "../contexts/AuthContext";

interface SubmissionLog {
  timestamp: string;
  action: string;
  userId: string;
  firmName: string;
  clientName: string;
  contactId: string;
  batchId: string;
  orderNumber: string;
  submissionNumber: string;
  success: boolean;
  errorMessage: string;
  fieldCount: number;
  tags: string[];
  duration: number;
  requestPayload?: any;
  responseBody?: any;
  metadata?: Record<string, any>;
}

interface LogStats {
  total: number;
  success: number;
  failures: number;
  avgDurationMs: number;
}

export default function SubmissionLogViewer() {
  const { session } = useAuth();
  const [logs, setLogs] = useState<SubmissionLog[]>([]);
  const [stats, setStats] = useState<LogStats>({ total: 0, success: 0, failures: 0, avgDurationMs: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<SubmissionLog | null>(null);

  const fetchLogs = async () => {
    if (!session?.access_token) {
      setError("No active session. Please log in as admin.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const url = actionFilter && actionFilter !== "all"
        ? `${SERVER_URL}/admin/submission-logs?action=${actionFilter}&limit=200`
        : `${SERVER_URL}/admin/submission-logs?limit=200`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to fetch logs: ${response.status} - ${errText}`);
      }

      const data = await response.json();
      setLogs(data.logs || []);
      setStats(data.stats || { total: 0, success: 0, failures: 0, avgDurationMs: 0 });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Error fetching submission logs:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (log.clientName || "").toLowerCase().includes(term) ||
      (log.firmName || "").toLowerCase().includes(term) ||
      (log.contactId || "").toLowerCase().includes(term) ||
      (log.batchId || "").toLowerCase().includes(term) ||
      (log.orderNumber || "").toLowerCase().includes(term) ||
      (log.errorMessage || "").toLowerCase().includes(term)
    );
  });

  const actionLabel = (action: string) => {
    switch (action) {
      case "CLIENT_CONTACT_UPSERT": return "Client Upsert";
      case "ORDER_CONFIRMATION": return "Order Confirm";
      case "BATCH_COMPLETE": return "Batch Done";
      default: return action;
    }
  };

  const actionColor = (action: string) => {
    switch (action) {
      case "CLIENT_CONTACT_UPSERT": return "bg-blue-100 text-blue-800";
      case "ORDER_CONFIRMATION": return "bg-purple-100 text-purple-800";
      case "BATCH_COMPLETE": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-emerald-700 text-white rounded-t-lg">
          <CardTitle className="text-xl flex items-center gap-3">
            <FileText className="w-6 h-6" />
            GHL Submission Logs
          </CardTitle>
          <CardDescription className="text-emerald-100">
            Every client contact upsert and order confirmation sent to GoHighLevel
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <BarChart3 className="w-5 h-5 text-gray-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Logs</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-700">{stats.success}</p>
              <p className="text-xs text-green-600">Successful</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <XCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-700">{stats.failures}</p>
              <p className="text-xs text-red-600">Failed</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-blue-700">{stats.avgDurationMs}ms</p>
              <p className="text-xs text-blue-600">Avg Duration</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by client, firm, batch, or error..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="CLIENT_CONTACT_UPSERT">Client Upserts</SelectItem>
                <SelectItem value="ORDER_CONFIRMATION">Order Confirmations</SelectItem>
                <SelectItem value="BATCH_COMPLETE">Batch Complete</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchLogs} variant="outline" disabled={loading} className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Table */}
          {filteredLogs.length === 0 && !loading ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No submission logs yet.</p>
              <p className="text-sm mt-1">Logs will appear here after bulk filing submissions are sent to GHL.</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-auto max-h-[600px]">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead className="w-[140px]">Time</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Client / Firm</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead className="text-right">Fields</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log, idx) => (
                    <TableRow key={idx} className={!log.success ? "bg-red-50/50" : ""}>
                      <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${actionColor(log.action)}`}>
                          {actionLabel(log.action)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {log.success ? (
                          <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> OK
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-700 border-red-300 bg-red-50">
                            <XCircle className="w-3 h-3 mr-1" /> Fail
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          {log.clientName && (
                            <p className="text-sm font-medium text-gray-900 truncate">{log.clientName}</p>
                          )}
                          {log.firmName && (
                            <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                              <Building2 className="w-3 h-3" /> {log.firmName}
                            </p>
                          )}
                          {log.errorMessage && (
                            <p className="text-xs text-red-600 truncate mt-0.5">{log.errorMessage}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-gray-600">{log.batchId || "-"}</TableCell>
                      <TableCell className="text-right text-sm text-gray-700">{log.fieldCount || 0}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Submission Log Detail</DialogTitle>
            <DialogDescription>
              {selectedLog?.action} at {selectedLog ? new Date(selectedLog.timestamp).toLocaleString() : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-gray-500">Action:</span> <strong>{selectedLog.action}</strong></div>
                <div><span className="text-gray-500">Status:</span> {selectedLog.success ? <span className="text-green-700">Success</span> : <span className="text-red-700">Failed</span>}</div>
                <div><span className="text-gray-500">Client:</span> {selectedLog.clientName || "-"}</div>
                <div><span className="text-gray-500">Firm:</span> {selectedLog.firmName || "-"}</div>
                <div><span className="text-gray-500">Contact ID:</span> <code className="text-xs bg-gray-100 px-1 rounded">{selectedLog.contactId || "-"}</code></div>
                <div><span className="text-gray-500">Batch:</span> {selectedLog.batchId || "-"}</div>
                <div><span className="text-gray-500">Order #:</span> {selectedLog.orderNumber || "-"}</div>
                <div><span className="text-gray-500">Submission #:</span> {selectedLog.submissionNumber || "-"}</div>
                <div><span className="text-gray-500">Fields Sent:</span> {selectedLog.fieldCount}</div>
                <div><span className="text-gray-500">Duration:</span> {selectedLog.duration}ms</div>
                <div><span className="text-gray-500">User ID:</span> <code className="text-xs bg-gray-100 px-1 rounded">{selectedLog.userId}</code></div>
              </div>
              {selectedLog.tags && selectedLog.tags.length > 0 && (
                <div>
                  <p className="text-gray-500 mb-1">Tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedLog.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedLog.errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-red-800 font-medium">Error:</p>
                  <p className="text-red-700 text-xs mt-1">{selectedLog.errorMessage}</p>
                </div>
              )}
              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <p className="text-gray-500 mb-1">Metadata:</p>
                  <pre className="bg-gray-50 border rounded p-3 text-xs overflow-auto max-h-48">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
              {selectedLog.requestPayload && (
                <details className="border rounded p-3">
                  <summary className="cursor-pointer text-gray-600 font-medium">Request Payload</summary>
                  <pre className="mt-2 text-xs overflow-auto max-h-48">
                    {JSON.stringify(selectedLog.requestPayload, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
