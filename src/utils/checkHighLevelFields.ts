/**
 * GoHighLevel Custom Fields Diagnostic Tool
 * 
 * This utility checks which custom fields exist in your GoHighLevel account
 * and compares them with the fields we're trying to send.
 */

import { fetchGoHighLevelApiKeys } from './highlevelApiKeys';

const HIGHLEVEL_BASE_URL = "https://services.leadconnectorhq.com";

// All custom fields we're trying to send
const REQUIRED_CUSTOM_FIELDS = [
  // Account Details
  'account_type',
  'parent_firm_id',
  'parent_firm_name',
  'parent_firm_confirmation',
  
  // Firm Fields
  'firm_name',
  'firm_ein',
  'firm_confirmation_number',
  
  // Filing Information - Company Information
  'filing_information__company_information__legal_business_name',
  'filing_information__company_information__fictitious_name',
  'filing_information__company_information__nydos_id',
  'filing_information__company_information__ein',
  'filing_information__company_information__formation_date',
  
  // Filing Information - Company Address
  'filing_information__company_address__street_address',
  'filing_information__company_address__city',
  'filing_information__company_address__state',
  'filing_information__company_address__zip_code',
  'filing_information__company_address__country',
  
  // Filing Information - Formation Details
  'filing_information__formation__country_of_formation',
  'filing_information__formation__state_of_formation',
  'filing_information__formation__entity_type',
  'filing_information__formation__date_authority_filed_ny',
  
  // Submissions
  'submissions__service_type',
  'submissions__filing_type',
  'submissions__contact_email',
  
  // Exemptions
  'exemptions__category',
  'exemptions__explanation',
  
  // Counts
  'beneficial_owners__count',
  'company_applicants__count',
  
  // Company Applicant 1
  'company_applicants__applicant_1__full_name',
  'company_applicants__applicant_1__dob',
  'company_applicants__applicant_1__address',
  'company_applicants__applicant_1__id_type',
  'company_applicants__applicant_1__id_number',
  'company_applicants__applicant_1__issuing_country',
  'company_applicants__applicant_1__issuing_state',
  'company_applicants__applicant_1__role',
  
  // Company Applicant 2
  'company_applicants__applicant_2__full_name',
  'company_applicants__applicant_2__dob',
  'company_applicants__applicant_2__address',
  'company_applicants__applicant_2__id_type',
  'company_applicants__applicant_2__id_number',
  'company_applicants__applicant_2__issuing_country',
  'company_applicants__applicant_2__issuing_state',
  'company_applicants__applicant_2__role',
  
  // Beneficial Owner 1
  'beneficial_owners__owner_1__full_name',
  'beneficial_owners__owner_1__dob',
  'beneficial_owners__owner_1__address',
  'beneficial_owners__owner_1__id_type',
  'beneficial_owners__owner_1__id_number',
  'beneficial_owners__owner_1__issuing_country',
  'beneficial_owners__owner_1__issuing_state',
  'beneficial_owners__owner_1__ownership_percentage',
  'beneficial_owners__owner_1__position_title',
  
  // Beneficial Owner 2
  'beneficial_owners__owner_2__full_name',
  'beneficial_owners__owner_2__dob',
  'beneficial_owners__owner_2__address',
  'beneficial_owners__owner_2__id_type',
  'beneficial_owners__owner_2__id_number',
  'beneficial_owners__owner_2__issuing_country',
  'beneficial_owners__owner_2__issuing_state',
  'beneficial_owners__owner_2__ownership_percentage',
  'beneficial_owners__owner_2__position_title',
  
  // Beneficial Owner 3
  'beneficial_owners__owner_3__full_name',
  'beneficial_owners__owner_3__dob',
  'beneficial_owners__owner_3__address',
  'beneficial_owners__owner_3__id_type',
  'beneficial_owners__owner_3__id_number',
  'beneficial_owners__owner_3__issuing_country',
  'beneficial_owners__owner_3__issuing_state',
  'beneficial_owners__owner_3__ownership_percentage',
  'beneficial_owners__owner_3__position_title',
  
  // Beneficial Owner 4
  'beneficial_owners__owner_4__full_name',
  'beneficial_owners__owner_4__dob',
  'beneficial_owners__owner_4__address',
  'beneficial_owners__owner_4__id_type',
  'beneficial_owners__owner_4__id_number',
  'beneficial_owners__owner_4__issuing_country',
  'beneficial_owners__owner_4__issuing_state',
  'beneficial_owners__owner_4__ownership_percentage',
  'beneficial_owners__owner_4__position_title',
  
  // Order tracking
  'last_order_number',
  'last_order_date',
  'last_order_amount',
  'last_order_client_count',
  'total_orders'
];

interface CustomFieldInfo {
  id: string;
  name: string;
  key: string;
  fieldKey: string;
  dataType: string;
  position: number;
}

interface FieldComparisonResult {
  existingFields: CustomFieldInfo[];
  missingFields: string[];
  totalRequired: number;
  totalExisting: number;
  percentageComplete: number;
}

/**
 * Fetch all custom fields from GoHighLevel
 */
export async function fetchGoHighLevelCustomFields(): Promise<CustomFieldInfo[]> {
  const config = await fetchGoHighLevelApiKeys();
  
  if (!config.apiKey || config.apiKey === '') {
    throw new Error('GoHighLevel API key not configured in database');
  }

  try {
    console.log('🔍 Fetching custom fields from GoHighLevel...');
    
    const response = await fetch(
      `${HIGHLEVEL_BASE_URL}/locations/${config.locationId}/customFields`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to fetch custom fields:', errorText);
      throw new Error(`Failed to fetch custom fields: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Fetched custom fields successfully');
    
    return data.customFields || [];
  } catch (error) {
    console.error('❌ Error fetching custom fields:', error);
    throw error;
  }
}

/**
 * Compare required fields with existing fields in GoHighLevel
 */
export async function compareCustomFields(): Promise<FieldComparisonResult> {
  try {
    const existingFields = await fetchGoHighLevelCustomFields();
    
    // Extract field keys from existing fields
    const existingFieldKeys = new Set(
      existingFields.map(field => field.fieldKey || field.key || field.name)
    );
    
    // Find missing fields
    const missingFields = REQUIRED_CUSTOM_FIELDS.filter(
      requiredField => !existingFieldKeys.has(requiredField)
    );
    
    const totalRequired = REQUIRED_CUSTOM_FIELDS.length;
    const totalExisting = totalRequired - missingFields.length;
    const percentageComplete = Math.round((totalExisting / totalRequired) * 100);
    
    console.log('\n📊 CUSTOM FIELDS COMPARISON REPORT');
    console.log('=====================================');
    console.log(`Total Required: ${totalRequired}`);
    console.log(`Total Existing: ${totalExisting}`);
    console.log(`Missing: ${missingFields.length}`);
    console.log(`Completion: ${percentageComplete}%`);
    console.log('=====================================\n');
    
    if (missingFields.length > 0) {
      console.log('❌ MISSING CUSTOM FIELDS:');
      missingFields.forEach((field, index) => {
        console.log(`${index + 1}. ${field}`);
      });
      console.log('\n');
    } else {
      console.log('✅ All required custom fields exist!');
    }
    
    return {
      existingFields,
      missingFields,
      totalRequired,
      totalExisting,
      percentageComplete
    };
  } catch (error) {
    console.error('❌ Error comparing custom fields:', error);
    throw error;
  }
}

/**
 * Generate instructions for creating missing fields
 */
export function generateFieldCreationInstructions(missingFields: string[]): string {
  if (missingFields.length === 0) {
    return '✅ No missing fields! Your GoHighLevel account is fully configured.';
  }
  
  let instructions = `
🔧 INSTRUCTIONS TO CREATE MISSING CUSTOM FIELDS IN GOHIGHLEVEL
================================================================

You need to create ${missingFields.length} custom fields in your GoHighLevel account.

Go to: Settings → Custom Fields → Add Custom Field

For each field below, create a "Text" type custom field with the exact field key:

`;

  missingFields.forEach((field, index) => {
    // Generate a user-friendly name from the field key
    const friendlyName = field
      .split('__')
      .map(part => part.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '))
      .join(' - ');
    
    instructions += `
${index + 1}. Field Key: ${field}
   Display Name: ${friendlyName}
   Type: Text (Single Line)
   
`;
  });
  
  instructions += `
================================================================

💡 TIP: You can copy-paste these field keys directly into GoHighLevel
to ensure they match exactly.

⚠️ IMPORTANT: The field keys must match EXACTLY (including underscores
and case) for the integration to work properly.
`;
  
  return instructions;
}

export { REQUIRED_CUSTOM_FIELDS };
export type { CustomFieldInfo, FieldComparisonResult };