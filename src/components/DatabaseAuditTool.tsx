import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Download,
  RefreshCw,
  Eye,
  Shield,
  FileText,
  Users,
  CreditCard,
  Loader2,
  Search
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { SERVER_URL } from "../utils/supabase/client";
import { toast } from "sonner";

interface DataCategory {
  name: string;
  prefix: string;
  icon: any;
  color: string;
  count: number;
  sampleKeys: string[];
  critical: boolean;
}

interface AuditResult {
  totalKeys: number;
  categories: DataCategory[];
  warnings: string[];
  errors: string[];
  lastChecked: string;
  dataIntegrity: 'excellent' | 'good' | 'warning' | 'critical';
}

export default function DatabaseAuditTool() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [viewingData, setViewingData] = useState(false);

  // Run comprehensive database audit
  const runAudit = async () => {
    if (!session?.access_token) {
      toast.error('No session found');
      return;
    }

    setLoading(true);
    try {
      console.log('Calling database audit endpoint...');
      const response = await fetch(`${SERVER_URL}/admin/database-audit`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Audit data received:', data);
        setAuditResult(data.audit);
        toast.success('Database audit complete!');
      } else {
        const errorText = await response.text();
        console.error('Audit failed:', response.status, errorText);
        try {
          const error = JSON.parse(errorText);
          toast.error(error.error || 'Audit failed');
        } catch {
          toast.error(`Audit failed: ${response.status} ${errorText || response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error running audit:', error);
      toast.error(`Error running database audit: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // View detailed data for a category
  const viewCategoryData = async (prefix: string, categoryName: string) => {
    if (!session?.access_token) return;

    setViewingData(true);
    setSelectedCategory(categoryName);

    try {
      const response = await fetch(`${SERVER_URL}/admin/database-category?prefix=${encodeURIComponent(prefix)}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategoryData(data.items || []);
      } else {
        toast.error('Failed to load category data');
      }
    } catch (error) {
      console.error('Error loading category:', error);
      toast.error('Error loading category data');
    } finally {
      setViewingData(false);
    }
  };

  // Export all database data
  const exportAllData = async () => {
    if (!session?.access_token) return;

    try {
      const response = await fetch(`${SERVER_URL}/admin/database-export`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Create downloadable JSON file
        const blob = new Blob([JSON.stringify(data.export, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nylta-database-backup-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Database exported successfully!');
      } else {
        toast.error('Export failed');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Error exporting database');
    }
  };

  // Test persistence (write, read, verify, delete)
  const testPersistence = async () => {
    if (!session?.access_token) return;

    try {
      const testKey = `test:persistence:${Date.now()}`;
      const testData = {
        timestamp: new Date().toISOString(),
        randomValue: Math.random(),
        testMessage: 'Database persistence test'
      };

      // Test write
      const writeResponse = await fetch(`${SERVER_URL}/admin/database-test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: testKey, data: testData }),
      });

      if (!writeResponse.ok) {
        toast.error('❌ Write test failed!');
        return;
      }

      // Test read
      const readResponse = await fetch(`${SERVER_URL}/admin/database-test?key=${encodeURIComponent(testKey)}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!readResponse.ok) {
        toast.error('❌ Read test failed!');
        return;
      }

      const readData = await readResponse.json();

      // Verify data matches
      if (JSON.stringify(readData.data) === JSON.stringify(testData)) {
        toast.success('✅ Database persistence test PASSED!');
      } else {
        toast.error('❌ Data verification failed!');
      }

      // Cleanup test data
      await fetch(`${SERVER_URL}/admin/database-test?key=${encodeURIComponent(testKey)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

    } catch (error) {
      console.error('Error testing persistence:', error);
      toast.error('❌ Persistence test failed!');
    }
  };

  const getIntegrityColor = (integrity: string) => {
    switch (integrity) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-[#00274E]">
        <CardHeader className="bg-[#00274E] text-white border-b-4 border-yellow-400">
          <CardTitle className="text-2xl flex items-center gap-3">
            <Database className="h-8 w-8" />
            Database Persistence Audit Tool
          </CardTitle>
          <CardDescription className="text-gray-200 mt-2">
            Verify that ALL data is being properly saved to the database. ZERO data loss tolerance.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <Button 
              onClick={runAudit}
              disabled={loading}
              className="bg-[#00274E] hover:bg-[#003366]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Audit...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Run Full Audit
                </>
              )}
            </Button>

            <Button 
              onClick={testPersistence}
              variant="outline"
              className="border-green-500 text-green-700 hover:bg-green-50"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Test Persistence
            </Button>

            <Button 
              onClick={exportAllData}
              variant="outline"
              className="border-blue-500 text-blue-700 hover:bg-blue-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Export All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Results */}
      {auditResult && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Database Keys</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#00274E]">{auditResult.totalKeys}</div>
                <p className="text-xs text-gray-500 mt-1">All stored records</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Data Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{auditResult.categories.length}</div>
                <p className="text-xs text-gray-500 mt-1">Different data types</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Data Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`${getIntegrityColor(auditResult.dataIntegrity)} text-sm px-3 py-1`}>
                  {auditResult.dataIntegrity.toUpperCase()}
                </Badge>
                <p className="text-xs text-gray-500 mt-2">Overall health</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Issues Found</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {auditResult.errors.length + auditResult.warnings.length}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {auditResult.errors.length} errors, {auditResult.warnings.length} warnings
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Warnings and Errors */}
          {(auditResult.warnings.length > 0 || auditResult.errors.length > 0) && (
            <Card className="border-2 border-yellow-400">
              <CardHeader className="bg-yellow-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Issues Detected
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {auditResult.errors.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Critical Errors ({auditResult.errors.length})
                    </h4>
                    <ul className="space-y-1">
                      {auditResult.errors.map((error, i) => (
                        <li key={i} className="text-sm text-red-700 bg-red-50 p-2 rounded">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {auditResult.warnings.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-yellow-600 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Warnings ({auditResult.warnings.length})
                    </h4>
                    <ul className="space-y-1">
                      {auditResult.warnings.map((warning, i) => (
                        <li key={i} className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Data Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Data Categories Breakdown</CardTitle>
              <CardDescription>
                All data types stored in the database. Click to view details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditResult.categories.map((category) => {
                  const Icon = category.icon || Database;
                  return (
                    <div 
                      key={category.prefix}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#00274E] hover:bg-gray-50 cursor-pointer transition-all"
                      onClick={() => viewCategoryData(category.prefix, category.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`${category.color} p-2 rounded-lg`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{category.name}</h4>
                            <p className="text-sm text-gray-500">Prefix: {category.prefix}*</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#00274E]">{category.count}</div>
                          <div className="text-xs text-gray-500">records</div>
                          {category.critical && (
                            <Badge variant="destructive" className="mt-1">CRITICAL</Badge>
                          )}
                        </div>
                      </div>
                      {category.sampleKeys.length > 0 && (
                        <div className="mt-3 text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                          Sample: {category.sampleKeys[0]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Category Detail View */}
          {selectedCategory && (
            <Card className="border-2 border-blue-500">
              <CardHeader className="bg-blue-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    {selectedCategory} - Detailed View
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {viewingData ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                    <p className="text-gray-600 mt-2">Loading data...</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {categoryData.map((item, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded border border-gray-200">
                        <div className="font-mono text-xs text-gray-600 mb-2">{item.key}</div>
                        <pre className="text-xs overflow-x-auto bg-white p-2 rounded border border-gray-300">
                          {JSON.stringify(item.value, null, 2)}
                        </pre>
                      </div>
                    ))}
                    {categoryData.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No data found in this category
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Last Checked */}
          <div className="text-center text-sm text-gray-500">
            Last checked: {new Date(auditResult.lastChecked).toLocaleString()}
          </div>
        </>
      )}

      {/* Initial State */}
      {!auditResult && !loading && (
        <Card className="border-2 border-gray-300">
          <CardContent className="py-16 text-center">
            <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Audit Results Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Click "Run Full Audit" to verify all data is properly persisted
            </p>
            <Button 
              onClick={runAudit}
              className="bg-[#00274E] hover:bg-[#003366]"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Your First Audit
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}