import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { CheckCircle, AlertCircle, Loader2, Plus } from 'lucide-react';
import { getHighLevelCustomFields } from '../utils/highlevel';
import { projectId } from '../utils/supabase/info';

const HIGHLEVEL_API_KEY = typeof import.meta.env !== 'undefined' ? (import.meta.env.VITE_HIGHLEVEL_API_KEY || '') : '';
const HIGHLEVEL_LOCATION_ID = typeof import.meta.env !== 'undefined' ? (import.meta.env.VITE_HIGHLEVEL_LOCATION_ID || 'fXXJzwVf8OtANDf2M4VP') : 'fXXJzwVf8OtANDf2M4VP';
const HIGHLEVEL_BASE_URL = "https://services.leadconnectorhq.com";

interface FieldToCreate {
  fieldKey: string;
  name: string;
  dataType: 'TEXT' | 'DATE' | 'NUMERICAL' | 'LARGE_TEXT';
}

// All required custom fields with their data types
const REQUIRED_FIELDS: FieldToCreate[] = [
  // Account Details
  { fieldKey: 'account_type', name: 'Account Type', dataType: 'TEXT' },
  { fieldKey: 'parent_firm_id', name: 'Parent Firm ID', dataType: 'TEXT' },
  { fieldKey: 'parent_firm_name', name: 'Parent Firm Name', dataType: 'TEXT' },
  { fieldKey: 'parent_firm_confirmation', name: 'Parent Firm Confirmation', dataType: 'TEXT' },
  
  // Firm Fields
  { fieldKey: 'firm_name', name: 'Firm Name', dataType: 'TEXT' },
  { fieldKey: 'firm_ein', name: 'Firm EIN', dataType: 'TEXT' },
  { fieldKey: 'firm_confirmation_number', name: 'Firm Confirmation Number', dataType: 'TEXT' },
  
  // Filing Information - Company Information
  { fieldKey: 'filing_information_-_company_information_-_legal_business_name', name: 'Filing Information - Company Information - Legal Business Name', dataType: 'TEXT' },
  { fieldKey: 'filing_information_-_company_information_-_fictitious_name_(dba)', name: 'Filing Information - Company Information - Fictitious Name (DBA)', dataType: 'TEXT' },
  { fieldKey: 'filing_information_-_company_information_-_ny_dos_id_number', name: 'Filing Information - Company Information - NY DOS ID Number', dataType: 'TEXT' },
  { fieldKey: 'filing_information_-_company_information_-_ein_/_federal_tax_id', name: 'Filing Information - Company Information - EIN / Federal Tax ID', dataType: 'TEXT' },
  { fieldKey: 'filing_information_-_formation_information_-_date_of_formation_/_registration', name: 'Filing Information - Formation Information - Date of Formation / Registration', dataType: 'DATE' },
  
  // Filing Information - Company Address
  { fieldKey: 'filing_information_-_company_address_-_street_address', name: 'Filing Information - Company Address - Street Address', dataType: 'TEXT' },
  { fieldKey: 'filing_information_-_company_address_-_city', name: 'Filing Information - Company Address - City', dataType: 'TEXT' },
  { fieldKey: 'filing_information_-_company_address_-_state', name: 'Filing Information - Company Address - State', dataType: 'TEXT' },
  { fieldKey: 'filing_information_-_company_address_-_zip_code', name: 'Filing Information - Company Address - Zip Code', dataType: 'NUMERICAL' },
  { fieldKey: 'filing_information_-_company_address_-_country', name: 'Filing Information - Company Address - Country', dataType: 'TEXT' },
  
  // Filing Information - Formation Details
  { fieldKey: 'filing_information_-_formation_information_-_country_of_formation', name: 'Filing Information - Formation Information - Country of Formation', dataType: 'TEXT' },
  { fieldKey: 'filing_information_-_formation_information_-_state_of_formation', name: 'Filing Information - Formation Information - State of Formation', dataType: 'TEXT' },
  { fieldKey: 'filing_information_-_formation_information_-_date_application_for_authority_filed_in_new_york', name: 'Filing Information - Formation Information - Date Application for Authority Filed in New York', dataType: 'DATE' },
  
  // Submissions
  { fieldKey: 'bulk_filing_contact_email', name: 'Bulk Filing Contact Email', dataType: 'TEXT' },
  
  // Exemptions
  { fieldKey: 'select_exemption_category', name: 'Select Exemption Category', dataType: 'TEXT' },
  { fieldKey: 'explanation_/_supporting_facts', name: 'Explanation / Supporting Facts', dataType: 'LARGE_TEXT' },
  
  // Company Applicant 1
  { fieldKey: 'company_applicant_-_full_legal_name', name: 'Company Applicant - Full Legal Name', dataType: 'TEXT' },
  { fieldKey: 'company_applicant_-_information_-_date_of_birth', name: 'Company Applicant - Information - Date of Birth', dataType: 'DATE' },
  { fieldKey: 'company_applicant_-_current_address_-_street_address', name: 'Company Applicant - Current Address - Street Address', dataType: 'TEXT' },
  { fieldKey: 'company_applicant_-_identity_verification_-_what_type_of_id_are_you_providing?', name: 'Company Applicant - Identity Verification - What type of ID are you Providing?', dataType: 'TEXT' },
  { fieldKey: 'company_applicant_-_identity_verification_-_id_number', name: 'Company Applicant - Identity Verification - ID Number', dataType: 'TEXT' },
  { fieldKey: 'company_applicant_-_identity_verification_-_issuance_country', name: 'Company Applicant - Identity Verification - Issuance Country', dataType: 'TEXT' },
  { fieldKey: 'company_applicant_-_identity_verification_-_issuance_state', name: 'Company Applicant - Identity Verification - Issuance State', dataType: 'TEXT' },
  { fieldKey: 'company_applicant_-_title_or_role', name: 'Company Applicant - Title or Role', dataType: 'TEXT' },
  
  // Company Applicant 2
  { fieldKey: 'company_applicant_2_-_full_legal_name', name: 'Company Applicant 2 - Full Legal Name', dataType: 'TEXT' },
  { fieldKey: 'company_applicant_2_-_information_-_date_of_birth', name: 'Company Applicant 2 - Information - Date of Birth', dataType: 'DATE' },
  { fieldKey: 'company_applicant_2_-_current_address_-_street_address', name: 'Company Applicant 2 - Current Address - Street Address', dataType: 'TEXT' },
  { fieldKey: 'company_applicant_2_-_identity_verification_-_what_type_of_id_are_you_providing?', name: 'Company Applicant 2 - Identity Verification - What type of ID are you Providing?', dataType: 'TEXT' },
  { fieldKey: 'company_applicant_2_-_identity_verification_-_id_number', name: 'Company Applicant 2 - Identity Verification - ID Number', dataType: 'TEXT' },
  { fieldKey: 'company_applicant_2_-_identity_verification_-_issuance_country', name: 'Company Applicant 2 - Identity Verification - Issuance Country', dataType: 'TEXT' },
  { fieldKey: 'company_applicant_2_-_identity_verification_-_issuance_state', name: 'Company Applicant 2 - Identity Verification - Issuance State', dataType: 'TEXT' },
  { fieldKey: 'company_applicant_2_-_title_or_role', name: 'Company Applicant 2 - Title or Role', dataType: 'TEXT' },
  
  // Beneficial Owner 1
  { fieldKey: 'beneficial_owner_-_information_-_full_name', name: 'Beneficial Owner - Information - Full Name', dataType: 'TEXT' },
  { fieldKey: 'beneficial_owner_-_information_-_date_of_birth', name: 'Beneficial Owner - Information - Date of Birth', dataType: 'DATE' },
  { fieldKey: 'beneficial_owner_-_current_address_-_street_address', name: 'Beneficial Owner - Current Address - Street Address', dataType: 'TEXT' },
  { fieldKey: 'beneficial_owner_-_identity_verification_-_what_type_of_id_are_you_providing?', name: 'Beneficial Owner - Identity Verification - What type of ID are you Providing?', dataType: 'TEXT' },
  { fieldKey: 'beneficial_owner_-_identity_verification_-_id_number', name: 'Beneficial Owner - Identity Verification - ID Number', dataType: 'TEXT' },
  { fieldKey: 'beneficial_owner_-_identity_verification_-_issuance_country', name: 'Beneficial Owner - Identity Verification - Issuance Country', dataType: 'TEXT' },
  { fieldKey: 'beneficial_owner_-_identity_verification_-_issuance_state', name: 'Beneficial Owner - Identity Verification - Issuance State', dataType: 'TEXT' },
  { fieldKey: 'beneficial_owner_-_current_address_-_ownership_percentage', name: 'Beneficial Owner - Current Address - Ownership Percentage', dataType: 'NUMERICAL' },
  { fieldKey: 'beneficial_owner_-_current_address_-_position_/_title', name: 'Beneficial Owner - Current Address - Position / Title', dataType: 'TEXT' },
];

// Generate Beneficial Owners 2-9
for (let i = 2; i <= 9; i++) {
  REQUIRED_FIELDS.push(
    { fieldKey: `beneficial_owner_${i}_-_information_-_full_name`, name: `Beneficial Owner ${i} - Information - Full Name`, dataType: 'TEXT' },
    { fieldKey: `beneficial_owner_${i}_-_information_-_date_of_birth`, name: `Beneficial Owner ${i} - Information - Date of Birth`, dataType: 'DATE' },
    { fieldKey: `beneficial_owner_${i}_-_current_address_-_street_address`, name: `Beneficial Owner ${i} - Current Address - Street Address`, dataType: 'TEXT' },
    { fieldKey: `beneficial_owner_${i}_-_identity_verification_-_what_type_of_id_are_you_providing?`, name: `Beneficial Owner ${i} - Identity Verification - What type of ID are you Providing?`, dataType: 'TEXT' },
    { fieldKey: `beneficial_owner_${i}_-_identity_verification_-_id_number`, name: `Beneficial Owner ${i} - Identity Verification - ID Number`, dataType: 'TEXT' },
    { fieldKey: `beneficial_owner_${i}_-_identity_verification_-_issuance_country`, name: `Beneficial Owner ${i} - Identity Verification - Issuance Country`, dataType: 'TEXT' },
    { fieldKey: `beneficial_owner_${i}_-_identity_verification_-_issuance_state`, name: `Beneficial Owner ${i} - Identity Verification - Issuance State`, dataType: 'TEXT' },
    { fieldKey: `beneficial_owner_${i}_-_current_address_-_ownership_percentage`, name: `Beneficial Owner ${i} - Current Address - Ownership Percentage`, dataType: 'NUMERICAL' },
    { fieldKey: `beneficial_owner_${i}_-_current_address_-_position_/_title`, name: `Beneficial Owner ${i} - Current Address - Position / Title`, dataType: 'TEXT' }
  );
}

export default function GoHighLevelFieldCreator() {
  const [creating, setCreating] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [results, setResults] = useState<{ created: number; failed: number; skipped: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createMissingFields = async () => {
    setCreating(true);
    setProgress([]);
    setResults(null);
    setError(null);

    try {
      setProgress(prev => [...prev, '🔑 Loading API configuration...']);
      setProgress(prev => [...prev, `📊 Total fields to check: ${REQUIRED_FIELDS.length}`]);

      // Fetch existing fields using the SAME function as the working tool
      setProgress(prev => [...prev, '🔍 Fetching existing custom fields...']);
      const existingFields = await getHighLevelCustomFields();

      if (existingFields.length === 0) {
        throw new Error('No custom fields found or API key not configured');
      }

      const existingFieldKeys = new Set(
        existingFields.map((f: any) => f.fieldKey || f.key || f.name)
      );

      setProgress(prev => [...prev, `✅ Found ${existingFieldKeys.size} existing fields`]);

      // Filter out fields that already exist
      const fieldsToCreate = REQUIRED_FIELDS.filter(field => !existingFieldKeys.has(field.fieldKey));

      if (fieldsToCreate.length === 0) {
        setProgress(prev => [...prev, '🎉 All fields already exist! Nothing to create.']);
        setResults({ created: 0, failed: 0, skipped: REQUIRED_FIELDS.length });
        setCreating(false);
        return;
      }

      setProgress(prev => [...prev, `📝 Creating ${fieldsToCreate.length} missing fields...`]);

      let created = 0;
      let failed = 0;

      // Create missing fields one by one using server endpoint
      for (const field of fieldsToCreate) {
        try {
          const response = await fetch(
            `https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields`,
            {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer pit-cca7bd65-1fe1-4754-88d7-a51883d631f2',
                'Version': '2021-07-28'
              },
              body: JSON.stringify({
                name: field.name,
                dataType: field.dataType,
                model: 'contact'
              })
            }
          );

          if (response.ok) {
            created++;
            setProgress(prev => [...prev, `✅ Created: ${field.fieldKey}`]);
          } else {
            const errorData = await response.json();
            failed++;
            setProgress(prev => [...prev, `❌ Failed: ${field.fieldKey} - ${errorData.message || JSON.stringify(errorData)}`]);
          }

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (err: any) {
          failed++;
          setProgress(prev => [...prev, `❌ Error: ${field.fieldKey} - ${err.message}`]);
          console.error('Field creation error:', field.fieldKey, err);
        }
      }

      setResults({
        created,
        failed,
        skipped: REQUIRED_FIELDS.length - fieldsToCreate.length
      });

      setProgress(prev => [...prev, '']);
      setProgress(prev => [...prev, '🏁 COMPLETED!']);
      setProgress(prev => [...prev, `✅ Created: ${created}`]);
      setProgress(prev => [...prev, `❌ Failed: ${failed}`]);
      setProgress(prev => [...prev, `⏭️ Skipped (already exist): ${REQUIRED_FIELDS.length - fieldsToCreate.length}`]);

    } catch (err: any) {
      setError(err.message || 'Failed to create custom fields');
      console.error('Error creating fields:', err);
    } finally {
      setCreating(false);
    }
  };

  const downloadMissingFieldsList = async () => {
    try {
      const existingFields = await getHighLevelCustomFields();
      const existingFieldKeys = new Set(
        existingFields.map((f: any) => f.fieldKey || f.key || f.name)
      );
      
      const fieldsToCreate = REQUIRED_FIELDS.filter(field => !existingFieldKeys.has(field.fieldKey));
      
      let csvContent = 'Field Key,Display Name,Data Type,cURL Command\n';
      
      fieldsToCreate.forEach(field => {
        const curlCommand = `curl -X POST "https://services.leadconnectorhq.com/locations/fXXJzwVf8OtANDf2M4VP/customFields" -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_API_KEY" -H "Version: 2021-07-28" -d "{\\"name\\":\\"${field.name}\\",\\"dataType\\":\\"${field.dataType}\\",\\"model\\":\\"contact\\"}"`;
        csvContent += `"${field.fieldKey}","${field.name}","${field.dataType}","${curlCommand}"\n`;
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `missing-highlevel-fields-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Failed to download fields list');
    }
  };

  return (
    <Card className="border-2 border-[#00274E]">
      <CardHeader className="bg-[#00274E] text-white">
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Missing GoHighLevel Custom Fields
        </CardTitle>
        <CardDescription className="text-gray-300">
          Automatically create all required custom fields in your GoHighLevel account
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Info Box */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <p className="font-semibold mb-2">This tool will:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Check which custom fields already exist in GoHighLevel</li>
                <li>Create only the missing fields ({REQUIRED_FIELDS.length} total required)</li>
                <li>Skip any fields that already exist</li>
                <li>Show you progress in real-time</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Create Button */}
          {!creating && !results && (
            <div className="space-y-3">
              <Button
                onClick={createMissingFields}
                disabled={creating}
                size="lg"
                className="w-full bg-[#00274E] hover:bg-[#003d73] text-white py-6 text-lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Show Missing Custom Fields
              </Button>
              
              <Button
                onClick={downloadMissingFieldsList}
                variant="outline"
                size="lg"
                className="w-full py-6 text-lg"
              >
                📥 Download CSV with cURL Commands
              </Button>
            </div>
          )}

          {/* Progress */}
          {creating && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-semibold">Creating custom fields...</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert className="border-red-300 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Progress Log */}
          {progress.length > 0 && (
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-xs max-h-96 overflow-y-auto">
              {progress.map((line, index) => (
                <div key={index} className="py-0.5">
                  {line}
                </div>
              ))}
            </div>
          )}

          {/* Results Summary */}
          {results && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-sm text-green-600 mb-1">Created</p>
                <p className="text-3xl font-bold text-green-900">{results.created}</p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-sm text-red-600 mb-1">Failed</p>
                <p className="text-3xl font-bold text-red-900">{results.failed}</p>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Skipped</p>
                <p className="text-3xl font-bold text-gray-900">{results.skipped}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {results && results.failed === 0 && (
            <Alert className="bg-green-50 border-2 border-green-300">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>✅ Success!</strong> All custom fields have been created in GoHighLevel.
                You can now submit bulk filings and all data will be properly stored.
              </AlertDescription>
            </Alert>
          )}

          {/* Try Again Button */}
          {results && results.failed > 0 && (
            <Button
              onClick={createMissingFields}
              variant="outline"
              className="w-full"
            >
              Retry Failed Fields
            </Button>
          )}

          {/* Download Missing Fields List Button */}
          {results && results.skipped > 0 && (
            <Button
              onClick={downloadMissingFieldsList}
              variant="outline"
              className="w-full"
            >
              Download Missing Fields List
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}