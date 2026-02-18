// HighLevel API Integration for NYLTA Bulk Filing System
// Version: 2021-07-28

import { projectId } from './supabase/info';

// HighLevel API Configuration
const HIGHLEVEL_API_BASE = 'https://services.leadconnectorhq.com';
const HIGHLEVEL_API_KEY = typeof import.meta.env !== 'undefined' ? (import.meta.env.VITE_HIGHLEVEL_API_KEY || 'pit-cca7bd65-1fe1-4754-88d7-a51883d631f2') : 'pit-cca7bd65-1fe1-4754-88d7-a51883d631f2';
const HIGHLEVEL_LOCATION_ID = typeof import.meta.env !== 'undefined' ? (import.meta.env.VITE_HIGHLEVEL_LOCATION_ID || 'fXXJzwVf8OtANDf2M4VP') : 'fXXJzwVf8OtANDf2M4VP';
const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2c01e603`;

// Audit Log Helper - Send logs to backend for storage
async function sendAuditLog(logData: {
  action: string;
  contactId?: string;
  email?: string;
  firmName?: string;
  success: boolean;
  requestBody?: any;
  responseStatus?: number;
  responseBody?: string;
  errorMessage?: string;
  metadata?: any;
}) {
  try {
    // Fire and forget - don't block the main flow
    fetch(`${SERVER_URL}/audit/highlevel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        ...logData
      })
    }).catch(err => {
      console.warn('⚠️ Failed to send audit log to backend:', err);
    });
  } catch (error) {
    console.warn('⚠️ Audit logging error:', error);
  }
}

// Custom Field IDs from HighLevel (fetched from API - these are the actual IDs)
// IMPORTANT: "id" is REQUIRED, "key" is optional
// These IDs are hardcoded because they don't change once created
const CUSTOM_FIELD_IDS = {
  account_status: 'QPQCb7cCLTOIwJe1Z5Ga',        // MULTIPLE_OPTIONS: Pending/Approved/Rejected
  account_type: 'mkk0bFNhEkVuymkCsdsa',           // TEXT: "Bulk Filing"
  professional_type: 'HuUznPV2qotnywk87Igu',      // TEXT: "CPA", "Attorney", etc.
  sms_consent: 'aaEG7lpUBE6UPfsN9AAy',            // SINGLE_OPTIONS: "Yes"/"No" (not boolean!)
  email_marketing_consent: 'gmpkdmeewuCFVBaSiGA8', // SINGLE_OPTIONS: "Yes"/"No" (not boolean!)
  firm_profile_completed: 'GyeqdV8Sr9mDkEW2HScI'  // TEXT: "true"/"false" (stored as string)
};

// HighLevel Contact Interface
export interface HighLevelContact {
  id?: string;
  locationId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
  country?: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

/**
 * Parse full name into first and last name
 * @param fullName - Full name to parse
 */
export function parseFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  return { firstName, lastName };
}

/**
 * Create or update HighLevel contact using upsert endpoint
 * Uses POST /contacts/upsert endpoint (Version 2021-07-28)
 * IMPORTANT: Uses customFields (plural) as array with id and field_value (key is optional, omit it)
 * @param contactData - Contact data to create/update
 */
export async function createHighLevelContact(contactData: HighLevelContact): Promise<string | null> {
  if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
    console.warn('⚠️ HighLevel API key not configured. Skipping contact creation.');
    return null;
  }

  try {
    console.log('📤 Creating HighLevel contact via upsert endpoint:', contactData.email);

    // Build base request body
    const requestBody: any = {
      locationId: HIGHLEVEL_LOCATION_ID,
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      email: contactData.email
    };

    // Add optional fields
    if (contactData.phone) requestBody.phone = contactData.phone;
    if (contactData.companyName) requestBody.companyName = contactData.companyName;
    if (contactData.country) requestBody.country = contactData.country;
    if (contactData.tags && contactData.tags.length > 0) requestBody.tags = contactData.tags;

    // Add custom fields in correct format: customFields (plural) as array with id and field_value
    // API Version 2021-07-28 requires: id (REQUIRED), field_value (value), key (optional - omit it)
    if (contactData.customFields) {
      const customFieldsArray: Array<{id: string; field_value: any}> = [];
      
      Object.entries(contactData.customFields)
        .filter(([key]) => !['country', 'companyName'].includes(key)) // Exclude top-level fields
        .forEach(([key, value]) => {
          // Get the field ID from our mapping
          const fieldId = (CUSTOM_FIELD_IDS as any)[key];
          
          if (!fieldId) {
            console.warn(`⚠️ No field ID found for custom field: ${key}`);
            return;
          }
          
          // Convert values to correct format based on field type:
          // - sms_consent and email_marketing_consent: "Yes"/"No" (SINGLE_OPTIONS)
          // - firm_profile_completed: "true"/"false" (TEXT)
          // - account_status: "Pending"/"Approved"/"Rejected" (MULTIPLE_OPTIONS)
          // - Others: string values
          let fieldValue: any;
          
          if (key === 'sms_consent' || key === 'email_marketing_consent') {
            // Convert boolean to "Yes"/"No" for SINGLE_OPTIONS fields
            if (typeof value === 'boolean') {
              fieldValue = value ? 'Yes' : 'No';
            } else if (value === 'true' || value === true) {
              fieldValue = 'Yes';
            } else if (value === 'false' || value === false) {
              fieldValue = 'No';
            } else {
              fieldValue = String(value); // Keep as-is if already a string
            }
          } else if (key === 'firm_profile_completed') {
            // Convert boolean to string "true"/"false" for TEXT field
            if (typeof value === 'boolean') {
              fieldValue = value ? 'true' : 'false';
            } else {
              fieldValue = String(value);
            }
          } else {
            // For all other fields, use string value
            fieldValue = String(value);
          }
          
          // Only include id and field_value (key is optional and not needed)
          customFieldsArray.push({
            id: fieldId,
            field_value: fieldValue
          });
        });
      
      if (customFieldsArray.length > 0) {
        requestBody.customFields = customFieldsArray; // Plural!
      }
    }

    console.log('📤 HighLevel upsert request body:', JSON.stringify(requestBody, null, 2));

    const startTime = Date.now();
    let responseStatus = 0;
    let responseBody = '';
    let success = false;
    let errorMessage = '';

    const response = await fetch(`${HIGHLEVEL_API_BASE}/contacts/upsert`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(requestBody)
    });

    responseStatus = response.status;
    const responseText = await response.text();
    responseBody = responseText;
    console.log('📥 HighLevel response status:', response.status, response.ok ? 'OK' : 'ERROR');
    console.log('📥 HighLevel response body:', responseText);

    if (!response.ok) {
      console.error('❌ HighLevel API Error Response (Status ' + response.status + '):');
      console.error('❌ Raw error text:', responseText);
      errorMessage = `HTTP ${response.status}: ${responseText}`;
      success = false;
      
      // Log failure
      await sendAuditLog({
        action: 'CONTACT_CREATE',
        email: contactData.email,
        firmName: contactData.companyName,
        success: false,
        requestBody,
        responseStatus,
        responseBody: responseText,
        errorMessage,
        metadata: {
          duration: Date.now() - startTime
        }
      });
      
      return null;
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse HighLevel response as JSON:', e);
      errorMessage = 'Failed to parse response JSON';
      
      // Log parsing failure
      await sendAuditLog({
        action: 'CONTACT_CREATE',
        email: contactData.email,
        firmName: contactData.companyName,
        success: false,
        requestBody,
        responseStatus,
        responseBody: responseText,
        errorMessage,
        metadata: {
          duration: Date.now() - startTime
        }
      });
      
      return null;
    }

    // Extract contact ID from response
    const contactId = responseData?.contact?.id || null;
    
    if (contactId) {
      console.log('✅ HighLevel contact created/updated via upsert:', contactId);
      success = true;
      
      // Log success
      await sendAuditLog({
        action: 'CONTACT_CREATE',
        contactId,
        email: contactData.email,
        firmName: contactData.companyName,
        success: true,
        requestBody,
        responseStatus,
        responseBody: responseText,
        metadata: {
          duration: Date.now() - startTime,
          tags: contactData.tags
        }
      });
    } else {
      console.warn('⚠️ No contact ID in response, but request succeeded');
      errorMessage = 'No contact ID in response';
      
      // Log partial success
      await sendAuditLog({
        action: 'CONTACT_CREATE',
        email: contactData.email,
        firmName: contactData.companyName,
        success: false,
        requestBody,
        responseStatus,
        responseBody: responseText,
        errorMessage,
        metadata: {
          duration: Date.now() - startTime
        }
      });
    }

    return contactId;

  } catch (error) {
    console.error('❌ Failed to create HighLevel contact:', error);
    return null;
  }
}

/**
 * Update an existing HighLevel contact (including custom fields)
 * Uses PUT /contacts/{id} endpoint (Version 2021-07-28)
 * IMPORTANT: Uses customFields (plural) as array with id and field_value (key is optional, omit it)
 * @param contactId - HighLevel contact ID
 * @param updates - Fields to update (can include customFields)
 */
export async function updateHighLevelContact(
  contactId: string, 
  updates: Partial<HighLevelContact>
): Promise<boolean> {
  if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
    console.warn('⚠️ HighLevel API key not configured. Skipping contact update.');
    return false;
  }

  try {
    console.log('📤 Updating HighLevel contact:', contactId);
    console.log('📤 Update payload (before conversion):', JSON.stringify(updates, null, 2));

    // Convert customFields to array format with id and field_value (omit key)
    const requestBody: any = { ...updates };
    if (requestBody.customFields) {
      const customFieldsArray: Array<{id: string; field_value: any}> = [];
      
      Object.entries(requestBody.customFields).forEach(([key, value]) => {
        // Get the field ID from our mapping
        const fieldId = (CUSTOM_FIELD_IDS as any)[key];
        
        if (!fieldId) {
          console.warn(`⚠️ No field ID found for custom field: ${key}`);
          return;
        }
        
        // Convert values based on field type
        let fieldValue: any;
        
        if (key === 'sms_consent' || key === 'email_marketing_consent') {
          // Convert boolean to "Yes"/"No" for SINGLE_OPTIONS fields
          if (typeof value === 'boolean') {
            fieldValue = value ? 'Yes' : 'No';
          } else if (value === 'true' || value === true) {
            fieldValue = 'Yes';
          } else if (value === 'false' || value === false) {
            fieldValue = 'No';
          } else {
            fieldValue = String(value);
          }
        } else if (key === 'firm_profile_completed') {
          // Convert boolean to string "true"/"false" for TEXT field
          if (typeof value === 'boolean') {
            fieldValue = value ? 'true' : 'false';
          } else {
            fieldValue = String(value);
          }
        } else {
          // For all other fields, use string value
          fieldValue = String(value);
        }
        
        // Only include id and field_value (no key needed)
        customFieldsArray.push({
          id: fieldId,
          field_value: fieldValue
        });
      });
      
      // Use customFields (plural) for PUT endpoint (not singular!)
      requestBody.customFields = customFieldsArray;
    }

    console.log('📤 Final update payload:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${HIGHLEVEL_API_BASE}/contacts/${contactId}?locationId=${HIGHLEVEL_LOCATION_ID}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HighLevel update error:', response.status, errorText);
      return false;
    }

    const responseText = await response.text();
    console.log('📥 HighLevel update response:', responseText);
    console.log('✅ HighLevel contact updated successfully');
    return true;

  } catch (error) {
    console.error('❌ Failed to update HighLevel contact:', error);
    return false;
  }
}

/**
 * Search for a HighLevel contact by email
 * Uses GET /contacts with query parameters (Version 2021-07-28)
 * @param email - Email to search for
 * @returns Contact ID if found, null otherwise
 */
export async function searchHighLevelContactByEmail(email: string): Promise<string | null> {
  if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
    console.warn('⚠️ HighLevel API key not configured. Skipping contact lookup.');
    return null;
  }

  try {
    console.log('🔍 Searching HighLevel for contact:', email);
    console.log('🔍 Location ID:', HIGHLEVEL_LOCATION_ID);

    // Use GET /contacts endpoint with query parameter to search by email
    // This is the correct approach - search through contacts list filtered by email
    const response = await fetch(
      `${HIGHLEVEL_API_BASE}/contacts/?locationId=${HIGHLEVEL_LOCATION_ID}&query=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
          'Version': '2021-07-28'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HighLevel search error:', response.status);
      console.error('❌ HighLevel search error body:', errorText);
      return null;
    }

    const data = await response.json();
    console.log('📥 HighLevel search response:', JSON.stringify(data, null, 2));
    
    // The response contains a "contacts" array - find the one matching the email
    if (data?.contacts && Array.isArray(data.contacts)) {
      const matchingContact = data.contacts.find((contact: any) => 
        contact.email?.toLowerCase() === email.toLowerCase()
      );
      
      if (matchingContact) {
        console.log('✅ HighLevel contact found:', matchingContact.id);
        return matchingContact.id; // Return just the contact ID
      } else {
        console.log('ℹ️ No exact email match found in search results');
        return null;
      }
    }
    
    console.log('ℹ️ No contacts found in HighLevel');
    return null;

  } catch (error) {
    console.error('❌ Failed to search HighLevel contact:', error);
    return null;
  }
}

/**
 * Add tags to a HighLevel contact
 * @param contactId - HighLevel contact ID
 * @param tags - Array of tags to add
 */
export async function addHighLevelTags(contactId: string, tags: string[]): Promise<boolean> {
  if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
    console.warn('⚠️ HighLevel API key not configured. Skipping tag addition.');
    return false;
  }

  try {
    console.log('🏷️ Adding tags to HighLevel contact:', contactId, tags);

    // First, fetch existing contact to get current tags
    const getResponse = await fetch(`${HIGHLEVEL_API_BASE}/contacts/${contactId}?locationId=${HIGHLEVEL_LOCATION_ID}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
        'Version': '2021-07-28'
      }
    });

    if (!getResponse.ok) {
      console.error('❌ Failed to fetch contact for tag update:', getResponse.status);
      return false;
    }

    const contactData = await getResponse.json();
    const existingTags = contactData.contact?.tags || [];
    
    console.log('📋 Existing tags:', existingTags);
    
    // Merge existing tags with new tags (avoid duplicates)
    const mergedTags = [...new Set([...existingTags, ...tags])];
    
    console.log('📋 Merged tags:', mergedTags);

    // Now update contact with merged tags
    const response = await fetch(`${HIGHLEVEL_API_BASE}/contacts/${contactId}?locationId=${HIGHLEVEL_LOCATION_ID}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify({ tags: mergedTags })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HighLevel tag addition error:', response.status, errorText);
      return false;
    }

    console.log('✅ Tags added successfully');
    return true;

  } catch (error) {
    console.error('❌ Failed to add HighLevel tags:', error);
    return false;
  }
}

/**
 * Add a note to a HighLevel contact
 * @param contactId - HighLevel contact ID
 * @param note - Note text
 */
export async function addHighLevelNote(contactId: string, note: string): Promise<boolean> {
  if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
    console.warn('⚠️ HighLevel API key not configured. Skipping note addition.');
    return false;
  }

  try {
    console.log('📝 Adding note to HighLevel contact:', contactId);

    const response = await fetch(`${HIGHLEVEL_API_BASE}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify({
        body: note,
        userId: HIGHLEVEL_LOCATION_ID
      })
    });

    if (!response.ok) {
      console.error('❌ HighLevel note addition error:', response.status);
      return false;
    }

    console.log('✅ Note added successfully');
    return true;

  } catch (error) {
    console.error('❌ Failed to add HighLevel note:', error);
    return false;
  }
}

/**
 * Get all custom fields from HighLevel location
 * @returns Array of custom fields
 */
export async function getHighLevelCustomFields(): Promise<any[]> {
  if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
    console.warn('⚠️ HighLevel API key not configured. Cannot fetch custom fields.');
    return [];
  }

  try {
    console.log('📋 Fetching HighLevel custom fields...');

    const response = await fetch(
      `${HIGHLEVEL_API_BASE}/locations/${HIGHLEVEL_LOCATION_ID}/customFields`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
          'Version': '2021-07-28'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HighLevel custom fields fetch error:', response.status, errorText);
      return [];
    }

    const data = await response.json();
    console.log('📥 HighLevel custom fields:', data);
    return data?.customFields || [];

  } catch (error) {
    console.error('❌ Failed to fetch HighLevel custom fields:', error);
    return [];
  }
}

/**
 * Submit bulk filing data to HighLevel
 * Writes complete filing data to custom fields and creates audit note
 * @param contactId - HighLevel contact ID
 * @param bulkFilingData - Complete bulk filing submission data
 * @param ipAddress - IP address of the submission
 * @returns Promise<{success: boolean, submissionNumber: string}> - Submission result
 */
export async function submitBulkFilingToHighLevel(
  contactId: string,
  bulkFilingData: {
    firmInfo: any;
    clients: any[];
    paymentSelection: any;
    timestamp: string;
  },
  ipAddress?: string
): Promise<{success: boolean, submissionNumber: string}> {
  if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
    console.warn('⚠️ HighLevel API key not configured. Skipping bulk filing submission.');
    return {success: false, submissionNumber: ''};
  }

  try {
    console.log('📤 Submitting bulk filing data to HighLevel for contact:', contactId);

    // Generate unique submission number
    const submissionDate = new Date(bulkFilingData.timestamp);
    const submissionNumber = `SUB-${submissionDate.getFullYear()}-${String(submissionDate.getMonth() + 1).padStart(2, '0')}${String(submissionDate.getDate()).padStart(2, '0')}${String(submissionDate.getHours()).padStart(2, '0')}${String(submissionDate.getMinutes()).padStart(2, '0')}${String(submissionDate.getSeconds()).padStart(2, '0')}`;

    // Filter to only selected clients
    const selectedClients = bulkFilingData.clients.filter(c => 
      bulkFilingData.paymentSelection.clientIds.includes(c.id)
    );

    // Get service type from first selected client (all should have same type in a batch)
    const serviceType = selectedClients[0]?.serviceType || 'filing';

    // Prepare custom fields data to update contact
    const customFieldUpdates: Record<string, any> = {
      // Submission tracking fields
      Bulk_Submission_Number: submissionNumber,
      Bulk_Submission_Date: submissionDate.toISOString().split('T')[0], // YYYY-MM-DD format
      Bulk_IP_Address: ipAddress || 'Unknown',
      Bulk_Submission_Status: 'Pending',
      Bulk_Payment_Status: 'Pending',
      Bulk_Payment_Amount: bulkFilingData.paymentSelection.totalAmount,
      Bulk_Service_Type: serviceType === 'monitoring' ? 'Compliance Monitoring ($249)' : 'Bulk Filing ($398)', // NEW: Track service tier
      Bulk_Filing_Notes: `Submitted ${selectedClients.length} filings on ${submissionDate.toLocaleString()}`
    };

    // For each client, we'll create multiple contacts or append to a mega note
    // Since HighLevel custom fields are contact-level, we'll store summary data
    // and create a detailed note with all client information
    
    // Update the contact with custom fields
    const updateResponse = await fetch(
      `${HIGHLEVEL_API_BASE}/contacts/${contactId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
          'Version': '2021-07-28'
        },
        body: JSON.stringify({
          customFields: customFieldUpdates
        })
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('❌ Failed to update contact custom fields:', errorText);
    } else {
      console.log('✅ Contact custom fields updated successfully');
    }

    // Format filing data as a detailed note for audit trail
    const noteContent = `
🎯 BULK FILING SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Submission Details:
   • Submission Number: ${submissionNumber}
   • Service Type: ${serviceType === 'monitoring' ? '💙 Compliance Monitoring ($249)' : '⭐ Bulk Filing ($398)'}
   • Submitted: ${new Date(bulkFilingData.timestamp).toLocaleString('en-US', { timeZone: 'America/New_York' })} EST
   • IP Address: ${ipAddress || 'Unknown'}
   • Total Amount: $${bulkFilingData.paymentSelection.totalAmount.toLocaleString()}
   • Number of Filings: ${selectedClients.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 FIRM INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Firm Name: ${bulkFilingData.firmInfo.firmName}
Contact Person: ${bulkFilingData.firmInfo.contactPerson}
Email: ${bulkFilingData.firmInfo.email}
Phone: ${bulkFilingData.firmInfo.phone}
EIN: ${bulkFilingData.firmInfo.ein}
Address: ${bulkFilingData.firmInfo.address}, ${bulkFilingData.firmInfo.city}, ${bulkFilingData.firmInfo.state} ${bulkFilingData.firmInfo.zipCode}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CLIENT FILINGS (${selectedClients.length})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${selectedClients.map((client, index) => `
━━━ ${index + 1}. ${client.llcName} ━━━

📌 Company Information:
   • Fictitious Name (DBA): ${client.fictitiousName || 'N/A'}
   • NYDOS ID: ${client.nydosId || 'N/A'}
   • EIN: ${client.ein || 'N/A'}
   • Formation Date: ${client.formationDate || 'N/A'}
   • Country/State: ${client.countryOfFormation || 'N/A'} / ${client.stateOfFormation || 'N/A'}
   • ZIP Code: ${client.zipCode || 'N/A'}
   • Contact Email: ${client.contactEmail || 'N/A'}
   • Filing Type: ${client.filingType === 'disclosure' ? 'Beneficial Ownership Disclosure' : 'Claims Exemption'}

${client.filingType === 'exemption' ? `
📝 Exemption Details:
   • Category: ${client.exemptionCategory || 'N/A'}
   • Explanation: ${client.exemptionExplanation || 'N/A'}
` : ''}

${client.companyApplicants && client.companyApplicants.length > 0 ? `
👤 Company Applicants (${client.companyApplicants.length}):
${client.companyApplicants.map((applicant: any, idx: number) => `
   Applicant ${idx + 1}:
   • Name: ${applicant.fullName || 'N/A'}
   • DOB: ${applicant.dob || 'N/A'}
   • ID Type: ${applicant.idType || 'N/A'}
   • ID Number: ${applicant.idNumber || 'N/A'}
   • ID Issuing: ${applicant.issuingCountry || 'N/A'}${applicant.issuingState ? ` / ${applicant.issuingState}` : ''}
   • Role: ${applicant.role || 'N/A'}
`).join('')}
` : ''}

${client.filingType === 'disclosure' && client.beneficialOwners && client.beneficialOwners.length > 0 ? `
👥 Beneficial Owners (${client.beneficialOwners.length}):
${client.beneficialOwners.map((owner: any, idx: number) => `
   Owner ${idx + 1}:
   • Name: ${owner.fullName || 'N/A'}
   • DOB: ${owner.dob || 'N/A'}
   • Address Type: ${owner.addressType || 'N/A'}
   • Ownership %: ${owner.ownershipPercentage || 'N/A'}%
   • ID Type: ${owner.idType || 'N/A'}
   • ID Number: ${owner.idNumber || 'N/A'}
   • ID Issuing: ${owner.issuingCountry || 'N/A'}${owner.issuingState ? ` / ${owner.issuingState}` : ''}
`).join('')}
` : ''}
`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Status: Payment Authorized
🔗 Next Step: Processing filings
📧 Client will receive confirmation email
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    // Add the note to the contact
    const noteAdded = await addHighLevelNote(contactId, noteContent);

    if (noteAdded) {
      console.log('✅ Bulk filing note added to HighLevel contact');
      
      // Add tags for workflow automation
      const tags = [
        'Status: Bulk Filing Submitted',
        `Filings: ${selectedClients.length}`,
        selectedClients.every(c => c.filingType === 'disclosure') ? 'Filing Type: Disclosure' : 
        selectedClients.every(c => c.filingType === 'exemption') ? 'Filing Type: Exemption' : 
        'Filing Type: Mixed'
      ];
      
      // Add high value tag if applicable
      if (bulkFilingData.paymentSelection.totalAmount > 5000) {
        tags.push('Priority: High Value');
      }
      
      await addHighLevelTags(contactId, tags);
      
      // Log success to audit log
      await sendAuditLog({
        action: 'BULK_FILING_SUBMISSION',
        contactId,
        email: bulkFilingData.firmInfo.email,
        firmName: bulkFilingData.firmInfo.firmName,
        success: true,
        metadata: {
          submissionNumber,
          filingsCount: selectedClients.length,
          totalAmount: bulkFilingData.paymentSelection.totalAmount,
          timestamp: bulkFilingData.timestamp,
          ipAddress: ipAddress || 'Unknown'
        }
      });
      
      console.log(`✅ Bulk filing data submitted to HighLevel successfully - Submission #${submissionNumber}`);
      return {success: true, submissionNumber};
    }

    console.error('❌ Failed to add note to HighLevel contact');
    return {success: false, submissionNumber};
  } catch (error) {
    console.error('❌ Error submitting bulk filing to HighLevel:', error);
    return {success: false, submissionNumber: ''};
  }
}

// ============================================================
// REAL DATA FETCHING FOR ADMIN DASHBOARD
// ============================================================

export interface FirmSubmission {
  id: string;
  firmName: string;
  firmEIN: string;
  confirmationNumber: string;
  submittedDate: string;
  clientCount: number;
  totalAmount: number;
  status: "Paid" | "Processing" | "Abandoned" | "Pending Review" | "Approved" | "Rejected" | "Pending";
  paymentMethod: string;
  lastActivity: string;
  daysInactive?: number;
  reviewedBy?: string;
  reviewedDate?: string;
  rejectionReason?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  firmAddress?: string;
  ipAddress?: string;
  contactId?: string;
}

/**
 * Fetch all bulk filing submissions from HighLevel
 * Queries contacts with "Bulk Filing" tag or recent submissions
 * @returns Array of FirmSubmission objects
 */
export async function fetchAllBulkFilingSubmissions(): Promise<FirmSubmission[]> {
  if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
    console.warn('⚠️ HighLevel API not configured');
    return [];
  }

  try {
    console.log('📊 Fetching all bulk filing submissions from HighLevel...');

    // Fetch all contacts from the location
    const response = await fetch(
      `${HIGHLEVEL_API_BASE}/contacts/?locationId=${HIGHLEVEL_LOCATION_ID}&limit=100`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
          'Version': '2021-07-28'
        }
      }
    );

    if (!response.ok) {
      console.error('❌ Failed to fetch submissions from HighLevel:', response.status);
      return [];
    }

    const data = await response.json();
    const contacts = data.contacts || [];
    console.log(`📥 Retrieved ${contacts.length} contacts from HighLevel`);

    // Transform HighLevel contact data to FirmSubmission format
    const submissions: FirmSubmission[] = contacts
      .filter((contact: any) => {
        // Filter to only contacts that have submitted bulk filings
        // Check if they have Bulk_Submission_Number or relevant tags
        const hasSubmissionNumber = contact.customField?.Bulk_Submission_Number || 
                                   contact.customFields?.find((f: any) => f.id === 'Bulk_Submission_Number');
        const hasBulkFilingTag = contact.tags?.some((tag: string) => 
          tag.toLowerCase().includes('bulk filing') || 
          tag.toLowerCase().includes('submitted')
        );
        return hasSubmissionNumber || hasBulkFilingTag;
      })
      .map((contact: any) => {
        // Helper to get custom field value
        const getCustomField = (fieldName: string) => {
          // Try direct access first
          if (contact.customField && contact.customField[fieldName]) {
            return contact.customField[fieldName];
          }
          // Try array format
          if (contact.customFields && Array.isArray(contact.customFields)) {
            const field = contact.customFields.find((f: any) => 
              f.id === fieldName || f.key === fieldName || f.name === fieldName
            );
            return field?.value || field?.field_value || '';
          }
          return '';
        };

        const submissionNumber = getCustomField('Bulk_Submission_Number') || `SUB-${contact.id.substring(0, 8)}`;
        const submittedDate = getCustomField('Bulk_Submission_Date') || contact.dateAdded || new Date().toISOString();
        const clientCount = parseInt(getCustomField('Bulk_Filing_Count') || '0') || 0;
        const totalAmount = parseFloat(getCustomField('Bulk_Payment_Amount') || '0') || 0;
        const status = getCustomField('Bulk_Submission_Status') || 'Pending Review';
        const ipAddress = getCustomField('Bulk_IP_Address') || 'Unknown';

        // Calculate days inactive
        const lastActivityDate = new Date(contact.dateUpdated || contact.dateAdded);
        const today = new Date();
        const daysInactive = Math.floor((today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));

        return {
          id: submissionNumber,
          firmName: contact.companyName || 'Unknown Firm',
          firmEIN: getCustomField('Firm_EIN') || '',
          confirmationNumber: submissionNumber,
          submittedDate: submittedDate,
          clientCount: clientCount,
          totalAmount: totalAmount,
          status: status as any,
          paymentMethod: getCustomField('Bulk_Payment_Method') || 'ACH',
          lastActivity: contact.dateUpdated || contact.dateAdded,
          daysInactive: daysInactive,
          contactName: `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
          contactEmail: contact.email,
          contactPhone: contact.phone,
          firmAddress: contact.address1 || '',
          ipAddress: ipAddress,
          contactId: contact.id
        };
      });

    console.log(`✅ Transformed ${submissions.length} bulk filing submissions`);
    return submissions;

  } catch (error) {
    console.error('❌ Error fetching bulk filing submissions:', error);
    return [];
  }
}

/**
 * Fetch single submission by ID from HighLevel
 * @param submissionNumber - Submission number to fetch
 * @returns Single FirmSubmission or null
 */
export async function fetchSubmissionById(submissionNumber: string): Promise<FirmSubmission | null> {
  const allSubmissions = await fetchAllBulkFilingSubmissions();
  return allSubmissions.find(s => s.id === submissionNumber) || null;
}

/**
 * Update submission status in HighLevel
 * @param contactId - HighLevel contact ID
 * @param status - New status
 * @param notes - Optional notes about the status change
 * @returns Success boolean
 */
export async function updateSubmissionStatus(
  contactId: string,
  status: string,
  notes?: string
): Promise<boolean> {
  if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
    console.warn('⚠️ HighLevel API not configured');
    return false;
  }

  try {
    console.log(`📝 Updating submission status for contact ${contactId} to: ${status}`);

    const updateData: any = {
      customFields: {
        Bulk_Submission_Status: status
      }
    };

    if (notes) {
      updateData.customFields.Bulk_Filing_Notes = notes;
    }

    const response = await fetch(
      `${HIGHLEVEL_API_BASE}/contacts/${contactId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
          'Version': '2021-07-28'
        },
        body: JSON.stringify(updateData)
      }
    );

    if (!response.ok) {
      console.error('❌ Failed to update submission status:', response.status);
      return false;
    }

    // Also add a note about the status change
    if (notes) {
      const noteText = `Status updated to: ${status}\n\nNotes: ${notes}\n\nUpdated: ${new Date().toLocaleString()}`;
      await addHighLevelNote(contactId, noteText);
    }

    console.log('✅ Submission status updated successfully');
    return true;

  } catch (error) {
    console.error('❌ Error updating submission status:', error);
    return false;
  }
}