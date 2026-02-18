import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { FileText, CheckCircle, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

/**
 * FIELD MAPPING VIEWER
 * Shows all wizard fields, their HighLevel custom field names, and counts per step
 */

interface FieldMapping {
  fieldName: string;
  required: boolean;
  highLevelFieldName: string;
  fieldType: string;
  exampleValue: string;
}

interface StepFields {
  stepName: string;
  stepNumber: number;
  fields: FieldMapping[];
}

export default function FieldMappingViewer() {
  const [selectedService, setSelectedService] = useState<'filing' | 'monitoring'>('filing');

  // STEP 1: Firm Information (Same for both)
  const step1Firm: StepFields = {
    stepName: "Firm Information",
    stepNumber: 1,
    fields: [
      { fieldName: "Firm Name*", required: true, highLevelFieldName: "firm_name", fieldType: "text", exampleValue: "ABC Accounting LLC" },
      { fieldName: "Contact Person*", required: true, highLevelFieldName: "contact_person", fieldType: "text", exampleValue: "John Smith" },
      { fieldName: "Email*", required: true, highLevelFieldName: "email", fieldType: "email", exampleValue: "john@abcaccounting.com" },
      { fieldName: "Phone*", required: true, highLevelFieldName: "phone", fieldType: "phone", exampleValue: "+1 (212) 555-1234" },
      { fieldName: "Firm EIN", required: false, highLevelFieldName: "firm_ein", fieldType: "text", exampleValue: "12-3456789" },
      { fieldName: "Address", required: false, highLevelFieldName: "address1", fieldType: "text", exampleValue: "123 Main St" },
      { fieldName: "City", required: false, highLevelFieldName: "city", fieldType: "text", exampleValue: "New York" },
      { fieldName: "State", required: false, highLevelFieldName: "state", fieldType: "text", exampleValue: "NY" },
      { fieldName: "ZIP Code", required: false, highLevelFieldName: "postal_code", fieldType: "text", exampleValue: "10001" }
    ]
  };

  // STEP 2: Client Upload (Same for both)
  const step2Client: StepFields = {
    stepName: "Client Information",
    stepNumber: 2,
    fields: [
      { fieldName: "LLC Legal Name*", required: true, highLevelFieldName: "llc_legal_name", fieldType: "text", exampleValue: "Manhattan Holdings LLC" },
      { fieldName: "Fictitious Name (DBA)", required: false, highLevelFieldName: "fictitious_name_dba", fieldType: "text", exampleValue: "Manhattan Services" },
      { fieldName: "NY DOS ID*", required: true, highLevelFieldName: "ny_dos_id", fieldType: "text", exampleValue: "1234567" },
      { fieldName: "EIN*", required: true, highLevelFieldName: "ein", fieldType: "text", exampleValue: "12-3456789" },
      { fieldName: "Formation Date*", required: true, highLevelFieldName: "formation_date", fieldType: "date", exampleValue: "2020-01-15" },
      { fieldName: "Country of Formation*", required: true, highLevelFieldName: "country_of_formation", fieldType: "select", exampleValue: "United States" },
      { fieldName: "State*", required: true, highLevelFieldName: "state_of_formation", fieldType: "select", exampleValue: "New York" },
      { fieldName: "Date Authority Filed NY", required: false, highLevelFieldName: "date_authority_filed_ny", fieldType: "date", exampleValue: "2021-06-15" },
      { fieldName: "Contact Email*", required: true, highLevelFieldName: "contact_email", fieldType: "email", exampleValue: "contact@manhattan.com" },
      { fieldName: "Filing Type*", required: true, highLevelFieldName: "filing_type", fieldType: "select", exampleValue: "disclosure" },
      { fieldName: "Service Level", required: false, highLevelFieldName: "service_level", fieldType: "auto-set", exampleValue: "filing" }
    ]
  };

  // STEP 3A: Company Applicant (ONLY FOR DISCLOSURE - FILING)
  const step3CompanyApplicant: StepFields = {
    stepName: "Company Applicant Information",
    stepNumber: 3,
    fields: [
      { fieldName: "Full Name*", required: true, highLevelFieldName: "ca_full_name", fieldType: "text", exampleValue: "John Smith" },
      { fieldName: "Date of Birth*", required: true, highLevelFieldName: "ca_dob", fieldType: "date", exampleValue: "1985-03-20" },
      { fieldName: "Street Address*", required: true, highLevelFieldName: "ca_street_address", fieldType: "text", exampleValue: "123 Main St" },
      { fieldName: "City*", required: true, highLevelFieldName: "ca_city", fieldType: "text", exampleValue: "New York" },
      { fieldName: "State*", required: true, highLevelFieldName: "ca_state", fieldType: "text", exampleValue: "NY" },
      { fieldName: "ZIP Code*", required: true, highLevelFieldName: "ca_zip_code", fieldType: "text", exampleValue: "10001" },
      { fieldName: "Country*", required: true, highLevelFieldName: "ca_country", fieldType: "select", exampleValue: "United States" },
      { fieldName: "ID Type*", required: true, highLevelFieldName: "ca_id_type", fieldType: "select", exampleValue: "Passport" },
      { fieldName: "ID Number*", required: true, highLevelFieldName: "ca_id_number", fieldType: "text", exampleValue: "AB123456" },
      { fieldName: "ID Issuing Country*", required: true, highLevelFieldName: "ca_id_issuing_country", fieldType: "select", exampleValue: "United States" },
      { fieldName: "ID Issuing State*", required: true, highLevelFieldName: "ca_id_issuing_state", fieldType: "select", exampleValue: "New York" },
      { fieldName: "SSN/ITIN", required: false, highLevelFieldName: "ca_ssn_itin", fieldType: "text", exampleValue: "XXX-XX-1234" },
      { fieldName: "Role*", required: true, highLevelFieldName: "ca_role", fieldType: "text", exampleValue: "Founder" }
    ]
  };

  // STEP 3B: Beneficial Owners (FOR DISCLOSURE - FILING)
  const step3BeneficialOwners: StepFields = {
    stepName: "Beneficial Owner Information",
    stepNumber: 3,
    fields: [
      { fieldName: "Full Name*", required: true, highLevelFieldName: "bo_full_name", fieldType: "text", exampleValue: "Maria Garcia" },
      { fieldName: "Date of Birth*", required: true, highLevelFieldName: "bo_dob", fieldType: "date", exampleValue: "1990-06-15" },
      { fieldName: "Street Address*", required: true, highLevelFieldName: "bo_street_address", fieldType: "text", exampleValue: "456 Oak Ave" },
      { fieldName: "City*", required: true, highLevelFieldName: "bo_city", fieldType: "text", exampleValue: "Brooklyn" },
      { fieldName: "State*", required: true, highLevelFieldName: "bo_state", fieldType: "text", exampleValue: "NY" },
      { fieldName: "ZIP Code*", required: true, highLevelFieldName: "bo_zip_code", fieldType: "text", exampleValue: "11201" },
      { fieldName: "Country*", required: true, highLevelFieldName: "bo_country", fieldType: "select", exampleValue: "United States" },
      { fieldName: "ID Type*", required: true, highLevelFieldName: "bo_id_type", fieldType: "select", exampleValue: "Driver License" },
      { fieldName: "ID Number*", required: true, highLevelFieldName: "bo_id_number", fieldType: "text", exampleValue: "DL789012" },
      { fieldName: "ID Issuing Country*", required: true, highLevelFieldName: "bo_id_issuing_country", fieldType: "select", exampleValue: "United States" },
      { fieldName: "ID Issuing State*", required: true, highLevelFieldName: "bo_id_issuing_state", fieldType: "select", exampleValue: "New York" },
      { fieldName: "Ownership %*", required: true, highLevelFieldName: "bo_ownership_percentage", fieldType: "number", exampleValue: "25" },
      { fieldName: "Role", required: false, highLevelFieldName: "bo_role", fieldType: "text", exampleValue: "Co-Owner" }
    ]
  };

  // STEP 3C: Exemption (FOR EXEMPTION - MONITORING)
  const step3Exemption: StepFields = {
    stepName: "Exemption Attestation",
    stepNumber: 3,
    fields: [
      { fieldName: "Exemption Category*", required: true, highLevelFieldName: "exemption_category", fieldType: "select", exampleValue: "Regulated financial institution" },
      { fieldName: "Exemption Explanation*", required: true, highLevelFieldName: "exemption_explanation", fieldType: "textarea", exampleValue: "Entity is a state-chartered bank regulated by NYDFS." }
    ]
  };

  // STEP 4: Review (No fields, just display)
  const step4Review: StepFields = {
    stepName: "Review Summary",
    stepNumber: 4,
    fields: []
  };

  // STEP 5: Payment
  const step5Payment: StepFields = {
    stepName: "Payment Information",
    stepNumber: 5,
    fields: [
      { fieldName: "Account Name*", required: true, highLevelFieldName: "payment_account_name", fieldType: "text", exampleValue: "ABC Accounting LLC" },
      { fieldName: "Routing Number*", required: true, highLevelFieldName: "payment_routing_number", fieldType: "text", exampleValue: "021000021" },
      { fieldName: "Account Number*", required: true, highLevelFieldName: "payment_account_number", fieldType: "text", exampleValue: "1234567890" },
      { fieldName: "Billing Street*", required: true, highLevelFieldName: "billing_street", fieldType: "text", exampleValue: "123 Main St" },
      { fieldName: "Billing City*", required: true, highLevelFieldName: "billing_city", fieldType: "text", exampleValue: "New York" },
      { fieldName: "Billing State*", required: true, highLevelFieldName: "billing_state", fieldType: "select", exampleValue: "NY" },
      { fieldName: "Billing ZIP*", required: true, highLevelFieldName: "billing_zip", fieldType: "text", exampleValue: "10001" }
    ]
  };

  // Build filing flow (disclosure path)
  const filingSteps = [
    step1Firm,
    step2Client,
    step3CompanyApplicant,
    step3BeneficialOwners,
    step4Review,
    step5Payment
  ];

  // Build monitoring flow (exemption path)
  const monitoringSteps = [
    step1Firm,
    step2Client,
    step3Exemption,
    step4Review,
    step5Payment
  ];

  const steps = selectedService === 'filing' ? filingSteps : monitoringSteps;

  // Calculate totals
  const totalFields = steps.reduce((sum, step) => sum + step.fields.length, 0);
  const requiredFields = steps.reduce((sum, step) => sum + step.fields.filter(f => f.required).length, 0);
  const optionalFields = totalFields - requiredFields;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-[#00274E]">
        <CardHeader className="bg-[#00274E] text-white">
          <CardTitle className="text-2xl flex items-center gap-3">
            <FileText className="h-8 w-8" />
            Wizard Field Mapping Viewer
          </CardTitle>
          <CardDescription className="text-gray-200 mt-2">
            Complete list of all fields in the wizard with HighLevel custom field names
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Service Type Selector */}
          <div className="mb-6">
            <Tabs value={selectedService} onValueChange={(v) => setSelectedService(v as 'filing' | 'monitoring')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="filing">Bulk Filing (Disclosure)</TabsTrigger>
                <TabsTrigger value="monitoring">Compliance Monitoring (Exemption)</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-300">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{totalFields}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Fields</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-300">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{requiredFields}</div>
                  <div className="text-sm text-gray-600 mt-1">Required (*)</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-300">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{optionalFields}</div>
                  <div className="text-sm text-gray-600 mt-1">Optional</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-300">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{steps.length}</div>
                  <div className="text-sm text-gray-600 mt-1">Steps</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Field Details by Step */}
          <div className="space-y-6">
            {steps.map((step) => (
              <Card key={step.stepNumber} className="border-2">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Step {step.stepNumber}: {step.stepName}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {step.fields.length} fields ({step.fields.filter(f => f.required).length} required)
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {step.fields.length} fields
                    </Badge>
                  </div>
                </CardHeader>
                {step.fields.length > 0 && (
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">Field Name</TableHead>
                            <TableHead className="w-[100px]">Required</TableHead>
                            <TableHead className="w-[250px]">HighLevel Custom Field</TableHead>
                            <TableHead className="w-[100px]">Type</TableHead>
                            <TableHead>Example Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {step.fields.map((field, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{field.fieldName}</TableCell>
                              <TableCell>
                                {field.required ? (
                                  <CheckCircle className="h-5 w-5 text-red-600" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-gray-400" />
                                )}
                              </TableCell>
                              <TableCell>
                                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                  {field.highLevelFieldName}
                                </code>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">{field.fieldType}</Badge>
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">{field.exampleValue}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Service Comparison */}
          <Card className="border-2 border-yellow-400 bg-yellow-50 mt-6">
            <CardHeader>
              <CardTitle>📊 Service Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Bulk Filing (Disclosure)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Total Fields:</strong> {filingSteps.reduce((sum, step) => sum + step.fields.length, 0)}</li>
                    <li>• <strong>Required:</strong> {filingSteps.reduce((sum, step) => sum + step.fields.filter(f => f.required).length, 0)}</li>
                    <li>• <strong>Includes:</strong> Company Applicant + Beneficial Owners</li>
                    <li>• <strong>Price:</strong> $398 per client</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Compliance Monitoring (Exemption)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Total Fields:</strong> {monitoringSteps.reduce((sum, step) => sum + step.fields.length, 0)}</li>
                    <li>• <strong>Required:</strong> {monitoringSteps.reduce((sum, step) => sum + step.fields.filter(f => f.required).length, 0)}</li>
                    <li>• <strong>Includes:</strong> Exemption Category + Explanation</li>
                    <li>• <strong>Price:</strong> $249 per client</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
