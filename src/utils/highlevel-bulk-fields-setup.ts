/**
 * HighLevel Bulk Filing Custom Fields Setup
 * 
 * This file contains the structure and curl commands to create custom fields
 * for the bulk filing system in HighLevel.
 * 
 * FOLDER STRUCTURE:
 * 1. NYLTA | Bulk Filing | Account Details (Already created)
 * 2. NYLTA | Bulk Filing | Consents (Already created)
 * 3. NYLTA | Bulk Filing | Filing Information
 * 4. NYLTA | Bulk Filing | Company Applicants
 * 5. NYLTA | Bulk Filing | Beneficial Owners
 * 6. NYLTA | Bulk Filing | Exemptions
 * 7. NYLTA | Bulk Filing | Submissions
 * 8. NYLTA | Bulk Filing | Others
 */

export const HIGHLEVEL_CONFIG = {
  API_KEY: 'YOUR_API_KEY_HERE',
  LOCATION_ID: 'YOUR_LOCATION_ID_HERE',
  API_BASE: 'https://services.leadconnectorhq.com'
};

/**
 * FOLDER IDs (Replace with your actual folder IDs from HighLevel)
 * Get these by viewing the folder in HighLevel and copying the ID from the URL
 */
export const FOLDER_IDS = {
  ACCOUNT_DETAILS: 'FOLDER_ID_HERE',      // Already has 5 fields
  CONSENTS: 'FOLDER_ID_HERE',             // Already has 2 fields
  FILING_INFORMATION: 'FOLDER_ID_HERE',
  COMPANY_APPLICANTS: 'FOLDER_ID_HERE',
  BENEFICIAL_OWNERS: 'FOLDER_ID_HERE',
  EXEMPTIONS: 'FOLDER_ID_HERE',
  SUBMISSIONS: 'FOLDER_ID_HERE',
  OTHERS: 'FOLDER_ID_HERE'
};

/**
 * Custom Fields Definitions for Bulk Filing
 */
export const BULK_FILING_CUSTOM_FIELDS = {
  
  // ==========================================
  // FILING INFORMATION FOLDER
  // ==========================================
  FILING_INFORMATION: [
    {
      name: 'Bulk_Filing_LLC_Legal_Name',
      placeholder: 'ABC Company LLC',
      dataType: 'TEXT',
      description: 'Legal name of the LLC for bulk filing'
    },
    {
      name: 'Bulk_Filing_NY_DOS_ID',
      placeholder: '1234567',
      dataType: 'TEXT',
      description: 'NY Department of State ID Number'
    },
    {
      name: 'Bulk_Filing_EIN',
      placeholder: '12-3456789',
      dataType: 'TEXT',
      description: 'Federal Tax ID / EIN'
    },
    {
      name: 'Bulk_Filing_Formation_Date',
      placeholder: '',
      dataType: 'DATE',
      description: 'Date of formation or registration'
    },
    {
      name: 'Bulk_Filing_Country_of_Formation',
      placeholder: 'United States',
      dataType: 'TEXT',
      description: 'Country where entity was formed'
    },
    {
      name: 'Bulk_Filing_State_of_Formation',
      placeholder: 'New York',
      dataType: 'TEXT',
      description: 'State of formation (if USA)'
    },
    {
      name: 'Bulk_Filing_Contact_Email',
      placeholder: 'contact@company.com',
      dataType: 'TEXT',
      description: 'Contact email for the LLC'
    },
    {
      name: 'Bulk_Filing_ZIP_Code',
      placeholder: '10001',
      dataType: 'NUMERICAL',
      description: 'ZIP code of the LLC'
    },
    {
      name: 'Bulk_Filing_Type',
      placeholder: '',
      dataType: 'SINGLE_OPTIONS',
      description: 'Type of filing',
      options: ['Beneficial Ownership Disclosure', 'Claims Exemption']
    }
  ],

  // ==========================================
  // COMPANY APPLICANTS FOLDER
  // ==========================================
  COMPANY_APPLICANTS: [
    // Company Applicant 1
    { name: 'Bulk_CA1_Full_Name', dataType: 'TEXT', placeholder: 'John Doe' },
    { name: 'Bulk_CA1_DOB', dataType: 'DATE', placeholder: '' },
    { name: 'Bulk_CA1_Address', dataType: 'TEXT', placeholder: '123 Main St|New York|NY|10001|United States|email@example.com' },
    { name: 'Bulk_CA1_ID_Type', dataType: 'SINGLE_OPTIONS', options: ['SSN', 'Driver License', 'Passport', 'State ID', 'Foreign Passport'] },
    { name: 'Bulk_CA1_ID_Number', dataType: 'TEXT', placeholder: 'XXX-XX-XXXX or ID Number' },
    { name: 'Bulk_CA1_Issuing_Country', dataType: 'TEXT', placeholder: 'United States' },
    { name: 'Bulk_CA1_Issuing_State', dataType: 'TEXT', placeholder: 'New York' },
    { name: 'Bulk_CA1_Role', dataType: 'TEXT', placeholder: 'Filing Agent' },

    // Company Applicant 2
    { name: 'Bulk_CA2_Full_Name', dataType: 'TEXT', placeholder: 'Jane Smith' },
    { name: 'Bulk_CA2_DOB', dataType: 'DATE', placeholder: '' },
    { name: 'Bulk_CA2_Address', dataType: 'TEXT', placeholder: '123 Main St|New York|NY|10001|United States|email@example.com' },
    { name: 'Bulk_CA2_ID_Type', dataType: 'SINGLE_OPTIONS', options: ['SSN', 'Driver License', 'Passport', 'State ID', 'Foreign Passport'] },
    { name: 'Bulk_CA2_ID_Number', dataType: 'TEXT', placeholder: 'XXX-XX-XXXX or ID Number' },
    { name: 'Bulk_CA2_Issuing_Country', dataType: 'TEXT', placeholder: 'United States' },
    { name: 'Bulk_CA2_Issuing_State', dataType: 'TEXT', placeholder: 'New York' },
    { name: 'Bulk_CA2_Role', dataType: 'TEXT', placeholder: 'Filing Agent' }
  ],

  // ==========================================
  // BENEFICIAL OWNERS FOLDER (BO1-BO9)
  // ==========================================
  BENEFICIAL_OWNERS: [
    // BO1
    { name: 'Bulk_BO1_Full_Name', dataType: 'TEXT', placeholder: 'John Doe' },
    { name: 'Bulk_BO1_DOB', dataType: 'DATE', placeholder: '' },
    { name: 'Bulk_BO1_Address', dataType: 'TEXT', placeholder: '123 Main St|New York|NY|10001|United States' },
    { name: 'Bulk_BO1_Address_Type', dataType: 'SINGLE_OPTIONS', options: ['Residential', 'Business'] },
    { name: 'Bulk_BO1_ID_Type', dataType: 'SINGLE_OPTIONS', options: ['SSN', 'Driver License', 'Passport', 'State ID', 'Foreign Passport'] },
    { name: 'Bulk_BO1_ID_Number', dataType: 'TEXT', placeholder: 'Full ID Number' },
    { name: 'Bulk_BO1_Issuing_Country', dataType: 'TEXT', placeholder: 'United States' },
    { name: 'Bulk_BO1_Issuing_State', dataType: 'TEXT', placeholder: 'New York' },
    { name: 'Bulk_BO1_Ownership_Percentage', dataType: 'NUMERICAL', placeholder: '25' },

    // BO2
    { name: 'Bulk_BO2_Full_Name', dataType: 'TEXT', placeholder: 'Jane Smith' },
    { name: 'Bulk_BO2_DOB', dataType: 'DATE', placeholder: '' },
    { name: 'Bulk_BO2_Address', dataType: 'TEXT', placeholder: '456 Oak Ave|Brooklyn|NY|11201|United States' },
    { name: 'Bulk_BO2_Address_Type', dataType: 'SINGLE_OPTIONS', options: ['Residential', 'Business'] },
    { name: 'Bulk_BO2_ID_Type', dataType: 'SINGLE_OPTIONS', options: ['SSN', 'Driver License', 'Passport', 'State ID', 'Foreign Passport'] },
    { name: 'Bulk_BO2_ID_Number', dataType: 'TEXT', placeholder: 'Full ID Number' },
    { name: 'Bulk_BO2_Issuing_Country', dataType: 'TEXT', placeholder: 'United States' },
    { name: 'Bulk_BO2_Issuing_State', dataType: 'TEXT', placeholder: 'New York' },
    { name: 'Bulk_BO2_Ownership_Percentage', dataType: 'NUMERICAL', placeholder: '25' },

    // BO3
    { name: 'Bulk_BO3_Full_Name', dataType: 'TEXT', placeholder: '' },
    { name: 'Bulk_BO3_DOB', dataType: 'DATE', placeholder: '' },
    { name: 'Bulk_BO3_Address', dataType: 'TEXT', placeholder: '' },
    { name: 'Bulk_BO3_Address_Type', dataType: 'SINGLE_OPTIONS', options: ['Residential', 'Business'] },
    { name: 'Bulk_BO3_ID_Type', dataType: 'SINGLE_OPTIONS', options: ['SSN', 'Driver License', 'Passport', 'State ID', 'Foreign Passport'] },
    { name: 'Bulk_BO3_ID_Number', dataType: 'TEXT', placeholder: 'Full ID Number' },
    { name: 'Bulk_BO3_Issuing_Country', dataType: 'TEXT', placeholder: '' },
    { name: 'Bulk_BO3_Issuing_State', dataType: 'TEXT', placeholder: '' },
    { name: 'Bulk_BO3_Ownership_Percentage', dataType: 'NUMERICAL', placeholder: '' },

    // BO4
    { name: 'Bulk_BO4_Full_Name', dataType: 'TEXT', placeholder: '' },
    { name: 'Bulk_BO4_DOB', dataType: 'DATE', placeholder: '' },
    { name: 'Bulk_BO4_Address', dataType: 'TEXT', placeholder: '' },
    { name: 'Bulk_BO4_Address_Type', dataType: 'SINGLE_OPTIONS', options: ['Residential', 'Business'] },
    { name: 'Bulk_BO4_ID_Type', dataType: 'SINGLE_OPTIONS', options: ['SSN', 'Driver License', 'Passport', 'State ID', 'Foreign Passport'] },
    { name: 'Bulk_BO4_ID_Number', dataType: 'TEXT', placeholder: 'Full ID Number' },
    { name: 'Bulk_BO4_Issuing_Country', dataType: 'TEXT', placeholder: '' },
    { name: 'Bulk_BO4_Issuing_State', dataType: 'TEXT', placeholder: '' },
    { name: 'Bulk_BO4_Ownership_Percentage', dataType: 'NUMERICAL', placeholder: '' },

    // Continue for BO5-BO9 (abbreviated for space)
    { name: 'Bulk_BO5_Full_Name', dataType: 'TEXT', placeholder: '' },
    { name: 'Bulk_BO5_DOB', dataType: 'DATE', placeholder: '' },
    { name: 'Bulk_BO5_ID_Number', dataType: 'TEXT', placeholder: 'Full ID Number' },
    { name: 'Bulk_BO5_Ownership_Percentage', dataType: 'NUMERICAL', placeholder: '' }
    // ... Add BO6-BO9 following same pattern
  ],

  // ==========================================
  // EXEMPTIONS FOLDER
  // ==========================================
  EXEMPTIONS: [
    {
      name: 'Bulk_Exemption_Category',
      dataType: 'SINGLE_OPTIONS',
      placeholder: '',
      description: 'Exemption category claimed',
      options: [
        'Securities reporting issuer',
        'Governmental authority',
        'Bank',
        'Credit union',
        'Depository institution holding company',
        'Money services business',
        'Broker or dealer in securities',
        'Securities exchange or clearing agency',
        'Other Exchange Act registered entity',
        'Investment company or investment adviser',
        'Venture capital fund adviser',
        'Insurance company',
        'State-licensed insurance producer',
        'Commodity Exchange Act registered entity',
        'Accounting firm',
        'Public utility',
        'Financial market utility',
        'Pooled investment vehicle',
        'Tax-exempt entity',
        'Entity assisting a tax-exempt entity',
        'Large operating company',
        'Subsidiary of certain exempt entities',
        'Inactive entity'
      ]
    },
    {
      name: 'Bulk_Exemption_Explanation',
      dataType: 'LARGE_TEXT',
      placeholder: 'Provide detailed explanation for exemption claim...',
      description: 'Detailed explanation and supporting facts for exemption'
    }
  ],

  // ==========================================
  // SUBMISSIONS FOLDER
  // ==========================================
  SUBMISSIONS: [
    { name: 'Bulk_Submission_Date', dataType: 'DATE', placeholder: '', description: 'Date of bulk filing submission' },
    { name: 'Bulk_Total_Amount', dataType: 'NUMERICAL', placeholder: '0', description: 'Total amount paid for bulk filing' },
    { name: 'Bulk_Number_of_Filings', dataType: 'NUMERICAL', placeholder: '0', description: 'Total number of filings in this batch' },
    { name: 'Bulk_Payment_Status', dataType: 'SINGLE_OPTIONS', options: ['Pending', 'Paid', 'Processing', 'Complete', 'Failed'] },
    { name: 'Bulk_Confirmation_Number', dataType: 'TEXT', placeholder: '', description: 'Unique confirmation number' },
    { name: 'Bulk_Payment_Method', dataType: 'SINGLE_OPTIONS', options: ['ACH', 'Credit Card', 'Wire Transfer'] }
  ],

  // ==========================================
  // OTHERS FOLDER
  // ==========================================
  OTHERS: [
    { name: 'Bulk_Filing_Notes', dataType: 'LARGE_TEXT', placeholder: 'Any additional notes...' },
    { name: 'Bulk_Processing_Status', dataType: 'SINGLE_OPTIONS', options: ['Uploaded', 'Validated', 'Submitted', 'Complete', 'Error'] },
    { name: 'Bulk_Processor_Name', dataType: 'TEXT', placeholder: 'Name of person processing' }
  ]
};

/**
 * Generate curl commands for creating custom fields
 */
export function generateCurlCommands() {
  const commands: string[] = [];

  Object.entries(BULK_FILING_CUSTOM_FIELDS).forEach(([folderKey, fields]) => {
    const folderName = folderKey.replace(/_/g, ' ');
    
    commands.push(`\n# ==========================================`);
    commands.push(`# ${folderName} FOLDER`);
    commands.push(`# ==========================================\n`);

    fields.forEach((field) => {
      const body: any = {
        name: field.name,
        dataType: field.dataType,
        position: 0
      };

      if (field.placeholder) {
        body.placeholder = field.placeholder;
      }

      if (field.description) {
        body.description = field.description;
      }

      if (field.options) {
        body.options = field.options;
      }

      const curl = `curl --location 'https://services.leadconnectorhq.com/locations/${HIGHLEVEL_CONFIG.LOCATION_ID}/customFields' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer ${HIGHLEVEL_CONFIG.API_KEY}' \\
--header 'Version: 2021-07-28' \\
--data '${JSON.stringify(body, null, 2)}'`;

      commands.push(`# Create: ${field.name}`);
      commands.push(curl);
      commands.push('');
    });
  });

  return commands.join('\n');
}

// Example usage in Node.js:
// console.log(generateCurlCommands());
