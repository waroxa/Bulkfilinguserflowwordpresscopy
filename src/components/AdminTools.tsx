import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ArrowLeft, Wrench, FileSpreadsheet, CheckCircle2, XCircle, AlertTriangle, Database, Code, ClipboardCheck, Plus, Shield, UserCog, Settings, FileText } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import HighLevelCustomFieldsViewer from "./HighLevelCustomFieldsViewer";
import AdminCurlTestTool from "./AdminCurlTestTool";
import AdminTestEnvironment from "./AdminTestEnvironment";
import GoHighLevelFieldCreator from "./GoHighLevelFieldCreator";
import AuditLogViewer from "./AuditLogViewer";
import SubmissionLogViewer from "./SubmissionLogViewer";
import AccountDebugTool from "./AccountDebugTool";
import SimpleDataViewer from "./SimpleDataViewer";
import CSVTemplateGenerator from "./CSVTemplateGenerator";
import FieldMappingViewer from "./FieldMappingViewer";
import HighLevelEnvSwitcher from "./HighLevelEnvSwitcher";

interface AdminToolsProps {
  onBack: () => void;
}

/**
 * ADMIN TOOLS PAGE
 * 
 * Central hub for all developer and admin tools.
 * Add new tools here as cards in the toolsList array.
 */

interface ValidationResult {
  field: string;
  inCSV: boolean;
  inForm: boolean;
  status: 'match' | 'csv-only' | 'form-only';
}

export default function AdminTools({ onBack }: AdminToolsProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [csvValidationResults, setCsvValidationResults] = useState<ValidationResult[]>([]);
  const [csvTestRun, setCsvTestRun] = useState(false);

  // ===================================================================
  // TOOL: CSV Form Validator
  // ===================================================================
  
  const runCsvValidation = () => {
    // Define CSV Template Headers (from downloadTemplate function)
    const csvHeaders = [
      'LLC Legal Name',
      'NY DOS ID',
      'EIN (12-3456789)',
      'Formation Date (YYYY-MM-DD)',
      'Country of Formation',
      'State (if USA)',
      'Contact Email',
      'Filing Type (disclosure/exemption)',
      'Exemption Category',
      'Exemption Explanation',
      'Company Applicant 1 - Full Name',
      'CA1 - DOB (YYYY-MM-DD)',
      'CA1 - Address',
      'CA1 - ID Type',
      'CA1 - ID Number',
      'CA1 - Issuing Country',
      'CA1 - Issuing State',
      'CA1 - Role',
      'Company Applicant 2 - Full Name',
      'CA2 - DOB (YYYY-MM-DD)',
      'CA2 - Address',
      'CA2 - ID Type',
      'CA2 - ID Number',
      'CA2 - Issuing Country',
      'CA2 - Issuing State',
      'CA2 - Role',
      'BO1 - Full Name',
      'BO1 - DOB (YYYY-MM-DD)',
      'BO1 - Address',
      'BO1 - ID Type',
      'BO1 - ID Number',
      'BO1 - Issuing Country',
      'BO1 - Issuing State',
      'BO1 - Ownership %',
      'BO1 - Role',
      'BO2 - Full Name',
      'BO2 - DOB (YYYY-MM-DD)',
      'BO2 - Address',
      'BO2 - ID Type',
      'BO2 - ID Number',
      'BO2 - Issuing Country',
      'BO2 - Issuing State',
      'BO2 - Ownership %',
      'BO2 - Role'
    ];

    // Define Manual Entry Form Fields
    const manualFormFields = [
      'LLC Legal Name',
      'NY DOS ID',
      'EIN (12-3456789)',
      'Formation Date (YYYY-MM-DD)',
      'Country of Formation',
      'State (if USA)',
      'Contact Email',
      'Filing Type (disclosure/exemption)',
    ];

    // Wizard-only fields
    const wizardOnlyFields = [
      'Exemption Category',
      'Exemption Explanation',
      'Company Applicant 1 - Full Name',
      'CA1 - DOB (YYYY-MM-DD)',
      'CA1 - Address',
      'CA1 - ID Type',
      'CA1 - ID Number',
      'CA1 - Issuing Country',
      'CA1 - Issuing State',
      'CA1 - Role',
      'Company Applicant 2 - Full Name',
      'CA2 - DOB (YYYY-MM-DD)',
      'CA2 - Address',
      'CA2 - ID Type',
      'CA2 - ID Number',
      'CA2 - Issuing Country',
      'CA2 - Issuing State',
      'CA2 - Role',
      'BO1 - Full Name',
      'BO1 - DOB (YYYY-MM-DD)',
      'BO1 - Address',
      'BO1 - ID Type',
      'BO1 - ID Number',
      'BO1 - Issuing Country',
      'BO1 - Issuing State',
      'BO1 - Ownership %',
      'BO1 - Role',
      'BO2 - Full Name',
      'BO2 - DOB (YYYY-MM-DD)',
      'BO2 - Address',
      'BO2 - ID Type',
      'BO2 - ID Number',
      'BO2 - Issuing Country',
      'BO2 - Issuing State',
      'BO2 - Ownership %',
      'BO2 - Role'
    ];

    const validationResults: ValidationResult[] = [];
    const allFields = new Set([...csvHeaders, ...manualFormFields, ...wizardOnlyFields]);

    allFields.forEach(field => {
      const inCSV = csvHeaders.includes(field);
      const inForm = manualFormFields.includes(field);
      const inWizard = wizardOnlyFields.includes(field);

      let status: 'match' | 'csv-only' | 'form-only';
      
      if (inForm && inCSV) {
        status = 'match';
      } else if (inCSV && !inForm && inWizard) {
        status = 'match';
      } else if (inCSV && !inForm && !inWizard) {
        status = 'csv-only';
      } else {
        status = 'form-only';
      }

      validationResults.push({
        field,
        inCSV,
        inForm: inForm || inWizard,
        status
      });
    });

    validationResults.sort((a, b) => {
      if (a.status === 'match' && b.status !== 'match') return 1;
      if (a.status !== 'match' && b.status === 'match') return -1;
      return 0;
    });

    setCsvValidationResults(validationResults);
    setCsvTestRun(true);
  };

  const csvMatchCount = csvValidationResults.filter(r => r.status === 'match').length;
  const csvOnlyCount = csvValidationResults.filter(r => r.status === 'csv-only').length;
  const formOnlyCount = csvValidationResults.filter(r => r.status === 'form-only').length;
  const csvAllMatch = csvOnlyCount === 0 && formOnlyCount === 0;

  // ===================================================================
  // TOOLS LIST - Add new tools here
  // ===================================================================
  
  const toolsList = [
    {
      id: 'csv-validator',
      name: 'CSV ↔ Form Validator',
      description: 'Validates that CSV template headers match the manual entry form fields',
      icon: FileSpreadsheet,
      color: 'bg-blue-600',
      category: 'Development'
    },
    {
      id: 'highlevel-fields',
      name: 'HighLevel Custom Fields',
      description: 'View and export all custom fields from your HighLevel CRM location',
      icon: Database,
      color: 'bg-green-600',
      category: 'Integration'
    },
    {
      id: 'curl-test',
      name: 'Admin Curl Test Tool',
      description: 'Test API endpoints using cURL commands',
      icon: Code,
      color: 'bg-purple-600',
      category: 'Development'
    },
    {
      id: 'test-environment',
      name: 'Admin Test Environment',
      description: 'Comprehensive testing suite for all admin dashboard features',
      icon: ClipboardCheck,
      color: 'bg-red-600',
      category: 'Testing'
    },
    {
      id: 'go-highlevel-field-creator',
      name: 'GHL Field Setup (Maria Keys)',
      description: 'Create all 238 custom fields in GHL using simplified keys (ca1_, bo1_, etc.) with folder support',
      icon: Plus,
      color: 'bg-orange-600',
      category: 'Integration'
    },
    {
      id: 'audit-logs',
      name: 'Audit Logs',
      description: 'View system audit logs and API activity',
      icon: Shield,
      color: 'bg-indigo-600',
      category: 'Security'
    },
    {
      id: 'submission-logs',
      name: 'Submission Logs',
      description: 'View GHL submission logs — every client contact upsert and order confirmation',
      icon: FileText,
      color: 'bg-emerald-600',
      category: 'Security'
    },
    {
      id: 'simple-data-viewer',
      name: 'Database Schema Viewer',
      description: 'View complete database structure and data mappings',
      icon: Database,
      color: 'bg-teal-600',
      category: 'Database'
    },
    {
      id: 'account-debug',
      name: 'Account Debug Tool',
      description: 'Debug and troubleshoot account issues',
      icon: UserCog,
      color: 'bg-pink-600',
      category: 'Support'
    },
    {
      id: 'csv-template-generator',
      name: 'CSV Template Generator',
      description: 'Generate CSV templates for data import',
      icon: FileSpreadsheet,
      color: 'bg-gray-600',
      category: 'Data Management'
    },
    {
      id: 'field-mapping-viewer',
      name: 'Field Mapping Viewer',
      description: 'View and manage field mappings between systems',
      icon: Database,
      color: 'bg-yellow-600',
      category: 'Data Management'
    },
    {
      id: 'highlevel-env-switcher',
      name: 'HighLevel Environment Switcher',
      description: 'Toggle between Production and Staging HighLevel credentials',
      icon: Settings,
      color: 'bg-purple-600',
      category: 'Integration'
    }
  ];

  // ===================================================================
  // RENDER
  // ===================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ImageWithFallback 
                src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                alt="NYLTA.com Logo"
                className="h-8 sm:h-10 md:h-12 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-none"
              />
              <div>
                <div className="flex items-center gap-3">
                  <Wrench className="w-6 h-6 text-[#00274E]" />
                  <h1 className="text-gray-900 text-2xl">Admin Tools</h1>
                </div>
                <p className="text-gray-600 text-sm mt-1">Development & validation utilities</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2 border-gray-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Show Tools List */}
        {!activeTool && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl text-gray-900 mb-2">Available Tools</h2>
              <p className="text-gray-600">Select a tool to begin</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toolsList.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Card 
                    key={tool.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-gray-200"
                    onClick={() => setActiveTool(tool.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`${tool.color} p-3 rounded-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{tool.name}</CardTitle>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {tool.category}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600">
                        {tool.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Placeholder for future tools */}
            <div className="mt-8 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
              <Wrench className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-700 mb-2">More tools coming soon</p>
              <p className="text-sm text-gray-600">
                New development and validation tools will be added here
              </p>
            </div>
          </div>
        )}

        {/* CSV Form Validator Tool */}
        {activeTool === 'csv-validator' && (
          <div>
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveTool(null);
                setCsvTestRun(false);
                setCsvValidationResults([]);
              }}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Button>

            <Card>
              <CardHeader className="bg-[#00274E] text-white">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <FileSpreadsheet className="w-6 h-6" />
                  CSV Template ↔ Manual Form Validator
                </CardTitle>
                <CardDescription className="text-gray-200 mt-2">
                  Run this test to ensure the CSV template headers match the manual entry form fields
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Run Test Button */}
                  <div>
                    <Button 
                      onClick={runCsvValidation}
                      className="w-full bg-[#00274E] hover:bg-[#003d73] text-white py-6 text-lg"
                      size="lg"
                    >
                      🧪 Run Validation Test
                    </Button>
                  </div>

                  {/* Test Results */}
                  {csvTestRun && (
                    <>
                      {/* Summary */}
                      <div className={`border-l-4 p-6 ${csvAllMatch ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500'}`}>
                        <div className="flex items-start gap-3">
                          {csvAllMatch ? (
                            <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                          )}
                          <div>
                            <h3 className={`text-lg font-bold mb-2 ${csvAllMatch ? 'text-green-900' : 'text-yellow-900'}`}>
                              {csvAllMatch ? '✅ All Fields Match!' : '⚠️ Discrepancies Found'}
                            </h3>
                            <div className="space-y-1 text-sm">
                              <p className="text-gray-700">
                                <strong>✓ Matching Fields:</strong> {csvMatchCount}
                              </p>
                              {csvOnlyCount > 0 && (
                                <p className="text-red-700">
                                  <strong>⚠ CSV Only (not in form):</strong> {csvOnlyCount}
                                </p>
                              )}
                              {formOnlyCount > 0 && (
                                <p className="text-red-700">
                                  <strong>⚠ Form Only (not in CSV):</strong> {formOnlyCount}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Field Breakdown */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Field-by-Field Analysis:</h3>
                        
                        {/* Show issues first if any */}
                        {(csvOnlyCount > 0 || formOnlyCount > 0) && (
                          <div className="mb-6 space-y-2">
                            <h4 className="font-semibold text-red-900">🚨 Issues Found:</h4>
                            {csvValidationResults.filter(r => r.status !== 'match').map((result, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded">
                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{result.field}</p>
                                  <p className="text-sm text-red-700">
                                    {result.status === 'csv-only' && 'In CSV template but NOT in manual form'}
                                    {result.status === 'form-only' && 'In manual form but NOT in CSV template'}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Show all matching fields */}
                        <details className="border border-gray-200 rounded p-4">
                          <summary className="cursor-pointer font-semibold text-gray-900 hover:text-[#00274E]">
                            ✅ View All Matching Fields ({csvMatchCount})
                          </summary>
                          <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                            {csvValidationResults.filter(r => r.status === 'match').map((result, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-2 bg-green-50 border border-green-200 rounded">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <p className="text-sm text-gray-900">{result.field}</p>
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>

                      {/* Instructions */}
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">📋 How to Fix Issues:</h4>
                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                          <li><strong>CSV Only:</strong> Add the field to the manual entry form in Step2ClientUpload.tsx</li>
                          <li><strong>Form Only:</strong> Add the field to the CSV template headers in downloadTemplate()</li>
                          <li><strong>After fixing:</strong> Run this test again to verify</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {!csvTestRun && (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <p className="text-gray-600">
                        Click "Run Validation Test" above to check if CSV and form fields match
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* HighLevel Custom Fields Tool */}
        {activeTool === 'highlevel-fields' && (
          <div>
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveTool(null);
              }}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Button>

            <HighLevelCustomFieldsViewer />
          </div>
        )}

        {/* Admin Curl Test Tool */}
        {activeTool === 'curl-test' && (
          <div>
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveTool(null);
              }}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Button>

            <AdminCurlTestTool />
          </div>
        )}

        {/* Admin Test Environment Tool */}
        {activeTool === 'test-environment' && (
          <AdminTestEnvironment 
            onBack={() => setActiveTool(null)} 
          />
        )}

        {/* Go HighLevel Field Creator Tool */}
        {activeTool === 'go-highlevel-field-creator' && (
          <div>
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveTool(null);
              }}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Button>

            <GoHighLevelFieldCreator />
          </div>
        )}

        {/* Audit Logs Tool */}
        {activeTool === 'audit-logs' && (
          <div>
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveTool(null);
              }}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Button>

            <AuditLogViewer />
          </div>
        )}

        {/* Submission Logs Tool */}
        {activeTool === 'submission-logs' && (
          <div>
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveTool(null);
              }}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Button>

            <SubmissionLogViewer />
          </div>
        )}

        {/* Account Debug Tool */}
        {activeTool === 'account-debug' && (
          <div>
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveTool(null);
              }}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Button>

            <AccountDebugTool />
          </div>
        )}

        {/* Simple Data Viewer Tool */}
        {activeTool === 'simple-data-viewer' && (
          <div>
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveTool(null);
              }}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Button>

            <SimpleDataViewer />
          </div>
        )}

        {/* CSV Template Generator Tool */}
        {activeTool === 'csv-template-generator' && (
          <div>
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveTool(null);
              }}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Button>

            <CSVTemplateGenerator />
          </div>
        )}

        {/* Field Mapping Viewer Tool */}
        {activeTool === 'field-mapping-viewer' && (
          <div>
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveTool(null);
              }}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Button>

            <FieldMappingViewer />
          </div>
        )}

        {/* HighLevel Environment Switcher Tool */}
        {activeTool === 'highlevel-env-switcher' && (
          <div>
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveTool(null);
              }}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Button>

            <HighLevelEnvSwitcher />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            NYLTA.com™ Admin Tools - Internal Development Utilities
          </p>
        </div>
      </footer>
    </div>
  );
}