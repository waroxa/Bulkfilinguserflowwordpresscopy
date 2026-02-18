import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Code, Send, CheckCircle2, XCircle, Copy, Loader2 } from "lucide-react";
import { submitBulkFilingToHighLevel, searchHighLevelContactByEmail } from "../utils/highlevel";

export default function AdminCurlTestTool() {
  const [testEmail, setTestEmail] = useState("test@example.com");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    submissionNumber?: string;
    message: string;
    details?: any;
  } | null>(null);

  // Generate sample curl command
  const generateSampleCurl = () => {
    return `curl -X POST 'https://api.nylta.com/bulk-filing/submit' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -d '{
    "firmInfo": {
      "firmName": "Test CPA Firm",
      "contactPerson": "John Doe",
      "email": "${testEmail}",
      "phone": "(555) 123-4567",
      "ein": "12-3456789",
      "address": "123 Test St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "clients": [
      {
        "id": "test-client-1",
        "llcName": "Test LLC 1",
        "nydosId": "1234567",
        "ein": "98-7654321",
        "formationDate": "2024-01-15",
        "countryOfFormation": "United States",
        "stateOfFormation": "New York",
        "zipCode": "10001",
        "contactEmail": "client1@test.com",
        "filingType": "disclosure",
        "companyApplicants": [
          {
            "fullName": "Jane Smith",
            "dob": "1985-05-15",
            "address": "456 Main St, New York, NY 10001",
            "idType": "Driver License",
            "idNumber": "D1234567",
            "issuingCountry": "United States",
            "issuingState": "New York",
            "role": "Filing Agent"
          }
        ],
        "beneficialOwners": [
          {
            "fullName": "Robert Johnson",
            "dob": "1980-03-20",
            "address": "789 Oak Ave, New York, NY 10002",
            "addressType": "Residential",
            "ownershipPercentage": 50,
            "idType": "Passport",
            "idNumber": "P987654",
            "issuingCountry": "United States"
          }
        ]
      },
      {
        "id": "test-client-2",
        "llcName": "Test LLC 2",
        "nydosId": "7654321",
        "ein": "11-2233445",
        "formationDate": "2024-02-20",
        "countryOfFormation": "United States",
        "stateOfFormation": "New York",
        "zipCode": "10002",
        "contactEmail": "client2@test.com",
        "filingType": "exemption",
        "exemptionCategory": "Large Operating Company",
        "exemptionExplanation": "This entity employs more than 20 full-time employees in the United States."
      }
    ],
    "paymentSelection": {
      "clientIds": ["test-client-1", "test-client-2"],
      "totalAmount": 180.00
    },
    "timestamp": "${new Date().toISOString()}"
  }'`;
  };

  const [curlCommand, setCurlCommand] = useState(generateSampleCurl());

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
  };

  const handleTestSubmission = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Parse the test data
      const testData = {
        firmInfo: {
          firmName: "Test CPA Firm",
          contactPerson: "John Doe",
          email: testEmail,
          phone: "(555) 123-4567",
          ein: "12-3456789",
          address: "123 Test St",
          city: "New York",
          state: "NY",
          zipCode: "10001"
        },
        clients: [
          {
            id: "test-client-1",
            llcName: "Test LLC 1",
            nydosId: "1234567",
            ein: "98-7654321",
            formationDate: "2024-01-15",
            countryOfFormation: "United States",
            stateOfFormation: "New York",
            zipCode: "10001",
            contactEmail: "client1@test.com",
            filingType: "disclosure",
            companyApplicants: [
              {
                fullName: "Jane Smith",
                dob: "1985-05-15",
                address: "456 Main St, New York, NY 10001",
                idType: "Driver License",
                idNumber: "D1234567",
                issuingCountry: "United States",
                issuingState: "New York",
                role: "Filing Agent"
              }
            ],
            beneficialOwners: [
              {
                fullName: "Robert Johnson",
                dob: "1980-03-20",
                address: "789 Oak Ave, New York, NY 10002",
                addressType: "Residential",
                ownershipPercentage: 50,
                idType: "Passport",
                idNumber: "P987654",
                issuingCountry: "United States"
              }
            ]
          },
          {
            id: "test-client-2",
            llcName: "Test LLC 2",
            nydosId: "7654321",
            ein: "11-2233445",
            formationDate: "2024-02-20",
            countryOfFormation: "United States",
            stateOfFormation: "New York",
            zipCode: "10002",
            contactEmail: "client2@test.com",
            filingType: "exemption",
            exemptionCategory: "Large Operating Company",
            exemptionExplanation: "This entity employs more than 20 full-time employees in the United States."
          }
        ],
        paymentSelection: {
          clientIds: ["test-client-1", "test-client-2"],
          totalAmount: 180.00
        },
        timestamp: new Date().toISOString()
      };

      // Search for HighLevel contact
      console.log('🔄 Searching for HighLevel contact with email:', testEmail);
      const contactId = await searchHighLevelContactByEmail(testEmail);

      if (!contactId) {
        setResult({
          success: false,
          message: `No HighLevel contact found for email: ${testEmail}. Please create a contact first or use an existing contact's email.`,
          details: null
        });
        setLoading(false);
        return;
      }

      console.log('✅ Contact found:', contactId);

      // Get test IP
      let testIP = 'Test-Submission';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        testIP = ipData.ip + ' (Test)';
      } catch {
        console.warn('Could not fetch IP address');
      }

      // Submit to HighLevel
      const submissionResult = await submitBulkFilingToHighLevel(
        contactId,
        testData,
        testIP
      );

      if (submissionResult.success) {
        setResult({
          success: true,
          submissionNumber: submissionResult.submissionNumber,
          message: 'Test submission completed successfully!',
          details: {
            contactId,
            submissionNumber: submissionResult.submissionNumber,
            clientCount: testData.clients.length,
            totalAmount: testData.paymentSelection.totalAmount,
            ipAddress: testIP,
            timestamp: testData.timestamp
          }
        });
      } else {
        setResult({
          success: false,
          message: 'Failed to submit test data to HighLevel. Check console for details.',
          details: null
        });
      }
    } catch (error: any) {
      console.error('❌ Test submission error:', error);
      setResult({
        success: false,
        message: `Error: ${error.message || 'Unknown error occurred'}`,
        details: null
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-none border-2 border-[#00274E]">
        <CardHeader className="bg-[#00274E] text-white rounded-none">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            <CardTitle>Curl Test Submission Tool</CardTitle>
          </div>
          <CardDescription className="text-gray-300">
            Test bulk filing submissions to HighLevel CRM with sample data
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Test Email Input */}
          <div>
            <Label htmlFor="testEmail">Test Contact Email (must exist in HighLevel)</Label>
            <input
              id="testEmail"
              type="email"
              value={testEmail}
              onChange={(e) => {
                setTestEmail(e.target.value);
                setCurlCommand(generateSampleCurl());
              }}
              className="w-full px-3 py-2 border-2 border-yellow-400 rounded"
              placeholder="test@example.com"
            />
            <p className="text-sm text-gray-600 mt-1">
              This email must already exist as a contact in your HighLevel account
            </p>
          </div>

          {/* Sample Curl Command */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Sample Curl Command</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCopyCurl}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>
            <Textarea
              value={curlCommand}
              onChange={(e) => setCurlCommand(e.target.value)}
              rows={30}
              className="font-mono text-sm border-2 border-gray-300"
              readOnly
            />
          </div>

          {/* Test Button */}
          <div className="flex gap-4">
            <Button
              onClick={handleTestSubmission}
              disabled={loading || !testEmail}
              className="flex-1 bg-[#00274E] hover:bg-[#001a35]"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting Test...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Test to HighLevel
                </>
              )}
            </Button>
          </div>

          {/* Result Display */}
          {result && (
            <Alert className={result.success ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}>
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className={result.success ? "text-green-800" : "text-red-800"}>
                        {result.message}
                      </p>
                      {result.success && result.details && (
                        <div className="mt-3 p-3 bg-white rounded border border-green-200">
                          <p className="text-sm mb-2"><strong>Submission Details:</strong></p>
                          <ul className="text-sm space-y-1 text-gray-700">
                            <li>• <strong>Submission Number:</strong> {result.submissionNumber}</li>
                            <li>• <strong>Contact ID:</strong> {result.details.contactId}</li>
                            <li>• <strong>Clients Submitted:</strong> {result.details.clientCount}</li>
                            <li>• <strong>Total Amount:</strong> ${result.details.totalAmount.toFixed(2)}</li>
                            <li>• <strong>IP Address:</strong> {result.details.ipAddress}</li>
                            <li>• <strong>Timestamp:</strong> {new Date(result.details.timestamp).toLocaleString()}</li>
                          </ul>
                          <p className="text-sm mt-3 text-green-700">
                            ✅ Check HighLevel contact record for custom fields and notes!
                          </p>
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          {/* Instructions */}
          <Alert className="bg-blue-50 border-blue-300">
            <AlertDescription className="text-sm text-gray-700">
              <p className="mb-2"><strong>How to Use This Tool:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Enter an email address that exists as a contact in your HighLevel account</li>
                <li>Review the sample curl command (it will update with your email)</li>
                <li>Click "Submit Test to HighLevel" to send test data</li>
                <li>Check the contact record in HighLevel to verify all custom fields populated</li>
                <li>Look for the detailed note with submission information</li>
                <li>Verify workflow tags were added correctly</li>
              </ol>
              <p className="mt-3 text-blue-700">
                <strong>Note:</strong> This tool submits real data to HighLevel. Use a test contact email.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
