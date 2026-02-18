import { useEffect, useState } from 'react';
import { getCustomFieldIds } from '../utils/highlevel';

/**
 * Admin utility page to fetch and display HighLevel custom field IDs
 * Navigate to /admin/fetch-custom-fields to use this tool
 */
export default function FetchCustomFieldsPage() {
  const [fieldIds, setFieldIds] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchFields = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const ids = await getCustomFieldIds();
      setFieldIds(ids);
      
      if (Object.keys(ids).length === 0) {
        setError('No custom fields found or API error occurred');
      }
    } catch (err) {
      setError('Failed to fetch custom field IDs: ' + String(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl mb-6">HighLevel Custom Field ID Fetcher</h1>
          
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              This utility fetches custom field IDs from your HighLevel location.
              These IDs are required for the API to work properly.
            </p>
            
            <button
              onClick={handleFetchFields}
              disabled={loading}
              className="bg-[#00274E] text-white px-6 py-2 hover:bg-[#003d73] disabled:opacity-50"
            >
              {loading ? 'Fetching...' : 'Fetch Custom Field IDs'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
              <strong>Error:</strong> {error}
            </div>
          )}

          {fieldIds && Object.keys(fieldIds).length > 0 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
                <strong>✅ Success!</strong> Custom field IDs fetched successfully.
              </div>

              <div>
                <h2 className="text-lg mb-3">Custom Field Mapping</h2>
                <div className="bg-gray-50 border border-gray-200 rounded p-4 space-y-2">
                  {Object.entries(fieldIds).map(([key, id]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                      <span className="text-gray-700">{key}</span>
                      <code className="bg-white px-3 py-1 rounded border border-gray-300 text-sm">
                        {id}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg mb-3">Environment Variables (Copy & Paste)</h2>
                <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
                  <div>VITE_HL_FIELD_ACCOUNT_STATUS={fieldIds['account_status'] || 'NOT_FOUND'}</div>
                  <div>VITE_HL_FIELD_ACCOUNT_TYPE={fieldIds['account_type'] || 'NOT_FOUND'}</div>
                  <div>VITE_HL_FIELD_PROFESSIONAL_TYPE={fieldIds['professional_type'] || 'NOT_FOUND'}</div>
                  <div>VITE_HL_FIELD_SMS_CONSENT={fieldIds['sms_consent'] || 'NOT_FOUND'}</div>
                  <div>VITE_HL_FIELD_EMAIL_MARKETING_CONSENT={fieldIds['email_marketing_consent'] || 'NOT_FOUND'}</div>
                  <div>VITE_HL_FIELD_FIRM_PROFILE_COMPLETED={fieldIds['firm_profile_completed'] || 'NOT_FOUND'}</div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
                <strong>⚠️ Next Steps:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Copy the environment variables above</li>
                  <li>Add them to your Supabase environment variables</li>
                  <li>Restart your application for changes to take effect</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
