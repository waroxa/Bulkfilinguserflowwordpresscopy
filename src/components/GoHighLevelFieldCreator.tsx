import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { CheckCircle, AlertCircle, Loader2, Plus, FolderPlus, Zap } from 'lucide-react';
import { fetchGoHighLevelApiKeys } from '../utils/highlevelApiKeys';

const HIGHLEVEL_BASE_URL = "https://services.leadconnectorhq.com";

interface FieldDef {
  key: string;       // The custom field key (used by contacts API)
  name: string;      // Human-readable display name for GHL UI
  dataType: string;   // TEXT, DATE, NUMERICAL, LARGE_TEXT, SIGNATURE
  group: string;     // Logical grouping for the UI
}

// ─── COMPLETE FIELD DEFINITIONS (Maria's simplified keys) ────────────────────

function buildAllFields(): FieldDef[] {
  const fields: FieldDef[] = [];

  // ── Account / Internal ──
  fields.push(
    { key: 'account_type', name: 'account type', dataType: 'TEXT', group: 'Account' },
    { key: 'parent_firm_id', name: 'parent firm id', dataType: 'TEXT', group: 'Account' },
    { key: 'parent_firm_name', name: 'parent firm name', dataType: 'TEXT', group: 'Account' },
    { key: 'parent_firm_confirmation', name: 'parent firm confirmation', dataType: 'TEXT', group: 'Account' }
  );

  // ── Firm Information ──
  fields.push(
    { key: 'firm_name', name: 'firm name', dataType: 'TEXT', group: 'Firm' },
    { key: 'contact_name', name: 'contact name', dataType: 'TEXT', group: 'Firm' },
    { key: 'contact_email', name: 'contact email', dataType: 'TEXT', group: 'Firm' },
    { key: 'contact_phone', name: 'contact phone', dataType: 'TEXT', group: 'Firm' },
    { key: 'firm_ein', name: 'firm ein', dataType: 'TEXT', group: 'Firm' },
    { key: 'firm_street_address', name: 'firm street address', dataType: 'TEXT', group: 'Firm' },
    { key: 'firm_city', name: 'firm city', dataType: 'TEXT', group: 'Firm' },
    { key: 'firm_state', name: 'firm state', dataType: 'TEXT', group: 'Firm' },
    { key: 'firm_zip_code', name: 'firm zip code', dataType: 'TEXT', group: 'Firm' },
    { key: 'firm_country', name: 'firm country', dataType: 'TEXT', group: 'Firm' },
    { key: 'firm_confirmation_number', name: 'firm confirmation number', dataType: 'TEXT', group: 'Firm' }
  );

  // ── LLC / Client Information ──
  fields.push(
    { key: 'llc_legal_name', name: 'llc legal name', dataType: 'TEXT', group: 'LLC Info' },
    { key: 'fictitious_name_dba', name: 'fictitious name dba', dataType: 'TEXT', group: 'LLC Info' },
    { key: 'nydos_id', name: 'nydos id', dataType: 'TEXT', group: 'LLC Info' },
    { key: 'ein', name: 'ein', dataType: 'TEXT', group: 'LLC Info' },
    { key: 'entity_type', name: 'entity type', dataType: 'TEXT', group: 'LLC Info' },
    { key: 'service_type', name: 'service type', dataType: 'TEXT', group: 'LLC Info' }
  );

  // ── Company Address ──
  fields.push(
    { key: 'company_street_address', name: 'company street address', dataType: 'TEXT', group: 'Company Address' },
    { key: 'company_city', name: 'company city', dataType: 'TEXT', group: 'Company Address' },
    { key: 'company_state', name: 'company state', dataType: 'TEXT', group: 'Company Address' },
    { key: 'company_zip_code', name: 'company zip code', dataType: 'TEXT', group: 'Company Address' },
    { key: 'company_country', name: 'company country', dataType: 'TEXT', group: 'Company Address' }
  );

  // ── Formation Information ──
  fields.push(
    { key: 'formation_date', name: 'formation date', dataType: 'TEXT', group: 'Formation' },
    { key: 'country_of_formation', name: 'country of formation', dataType: 'TEXT', group: 'Formation' },
    { key: 'state_of_formation', name: 'state of formation', dataType: 'TEXT', group: 'Formation' },
    { key: 'date_authority_filed_ny', name: 'date authority filed ny', dataType: 'TEXT', group: 'Formation' }
  );

  // ── Contact & Counts ──
  fields.push(
    { key: 'llc_contact_email', name: 'llc contact email', dataType: 'TEXT', group: 'Contact' },
    { key: 'filing_type', name: 'filing type', dataType: 'TEXT', group: 'Contact' },
    { key: 'beneficial_owners__count', name: 'beneficial_owners__count', dataType: 'TEXT', group: 'Contact' },
    { key: 'company_applicants__count', name: 'company_applicants__count', dataType: 'TEXT', group: 'Contact' }
  );

  // ── Exemption ──
  fields.push(
    { key: 'exemption_category', name: 'exemption category', dataType: 'TEXT', group: 'Exemption' },
    { key: 'exemption_explanation', name: 'exemption explanation', dataType: 'LARGE_TEXT', group: 'Exemption' }
  );

  // ── Attestation ──
  fields.push(
    { key: 'attestation_signature', name: 'attestation signature', dataType: 'TEXT', group: 'Attestation' },
    { key: 'attestation_initials', name: 'attestation initials', dataType: 'TEXT', group: 'Attestation' },
    { key: 'attestation_title', name: 'attestation title', dataType: 'TEXT', group: 'Attestation' },
    { key: 'attestation_date', name: 'attestation date', dataType: 'TEXT', group: 'Attestation' }
  );

  // ── Company Applicants 1-3 (15 fields each) ──
  for (let ca = 1; ca <= 3; ca++) {
    const prefix = `ca${ca}`;
    const label = `ca${ca}`;
    fields.push(
      { key: `${prefix}_full_name`, name: `${label} full name`, dataType: 'TEXT', group: `Company Applicant ${ca}` },
      { key: `${prefix}_dob`, name: `${label} dob`, dataType: 'TEXT', group: `Company Applicant ${ca}` },
      { key: `${prefix}_street_address`, name: `${label} street address`, dataType: 'TEXT', group: `Company Applicant ${ca}` },
      { key: `${prefix}_city`, name: `${label} city`, dataType: 'TEXT', group: `Company Applicant ${ca}` },
      { key: `${prefix}_state`, name: `${label} state`, dataType: 'TEXT', group: `Company Applicant ${ca}` },
      { key: `${prefix}_zip_code`, name: `${label} zip code`, dataType: 'TEXT', group: `Company Applicant ${ca}` },
      { key: `${prefix}_country`, name: `${label} country`, dataType: 'TEXT', group: `Company Applicant ${ca}` },
      { key: `${prefix}_id_type`, name: `${label} id type`, dataType: 'TEXT', group: `Company Applicant ${ca}` },
      { key: `${prefix}_id_number`, name: `${label} id number`, dataType: 'TEXT', group: `Company Applicant ${ca}` },
      { key: `${prefix}_id_expiration_date`, name: `${label} id expiration date`, dataType: 'TEXT', group: `Company Applicant ${ca}` },
      { key: `${prefix}_issuing_country`, name: `${label} issuing country`, dataType: 'TEXT', group: `Company Applicant ${ca}` },
      { key: `${prefix}_issuing_state`, name: `${label} issuing state`, dataType: 'TEXT', group: `Company Applicant ${ca}` },
      { key: `${prefix}_title_or_role`, name: `${label} title or role`, dataType: 'TEXT', group: `Company Applicant ${ca}` },
      { key: `${prefix}_phone`, name: `${label} phone`, dataType: 'TEXT', group: `Company Applicant ${ca}` },
      { key: `${prefix}_email`, name: `${label} email`, dataType: 'TEXT', group: `Company Applicant ${ca}` }
    );
  }

  // ── Beneficial Owners 1-9 (15 fields each) ──
  for (let bo = 1; bo <= 9; bo++) {
    const prefix = `bo${bo}`;
    const label = `bo${bo}`;
    fields.push(
      { key: `${prefix}_full_name`, name: `${label} full name`, dataType: 'TEXT', group: `Beneficial Owner ${bo}` },
      { key: `${prefix}_dob`, name: `${label} dob`, dataType: 'TEXT', group: `Beneficial Owner ${bo}` },
      { key: `${prefix}_street_address`, name: `${label} street address`, dataType: 'TEXT', group: `Beneficial Owner ${bo}` },
      { key: `${prefix}_city`, name: `${label} city`, dataType: 'TEXT', group: `Beneficial Owner ${bo}` },
      { key: `${prefix}_state`, name: `${label} state`, dataType: 'TEXT', group: `Beneficial Owner ${bo}` },
      { key: `${prefix}_zip_code`, name: `${label} zip code`, dataType: 'TEXT', group: `Beneficial Owner ${bo}` },
      { key: `${prefix}_country`, name: `${label} country`, dataType: 'TEXT', group: `Beneficial Owner ${bo}` },
      { key: `${prefix}_address_type`, name: `${label} address type`, dataType: 'TEXT', group: `Beneficial Owner ${bo}` },
      { key: `${prefix}_id_type`, name: `${label} id type`, dataType: 'TEXT', group: `Beneficial Owner ${bo}` },
      { key: `${prefix}_id_number`, name: `${label} id number`, dataType: 'TEXT', group: `Beneficial Owner ${bo}` },
      { key: `${prefix}_id_expiration_date`, name: `${label} id expiration date`, dataType: 'TEXT', group: `Beneficial Owner ${bo}` },
      { key: `${prefix}_issuing_country`, name: `${label} issuing country`, dataType: 'TEXT', group: `Beneficial Owner ${bo}` },
      { key: `${prefix}_issuing_state`, name: `${label} issuing state`, dataType: 'TEXT', group: `Beneficial Owner ${bo}` },
      { key: `${prefix}_ownership_percentage`, name: `${label} ownership percentage`, dataType: 'TEXT', group: `Beneficial Owner ${bo}` },
      { key: `${prefix}_position_or_title`, name: `${label} position or title`, dataType: 'TEXT', group: `Beneficial Owner ${bo}` }
    );
  }

  // ── Order / Submission Tracking ──
  fields.push(
    { key: 'order_number', name: 'order number', dataType: 'TEXT', group: 'Submissions' },
    { key: 'submission_date', name: 'submission date', dataType: 'TEXT', group: 'Submissions' },
    { key: 'payment_date', name: 'payment date', dataType: 'TEXT', group: 'Submissions' },
    { key: 'amount_paid', name: 'amount paid', dataType: 'TEXT', group: 'Submissions' },
    { key: 'client_count', name: 'client count', dataType: 'TEXT', group: 'Submissions' },
    { key: 'batch_id', name: 'batch id', dataType: 'TEXT', group: 'Submissions' },
    { key: 'bulk_service_type', name: 'bulk service type', dataType: 'TEXT', group: 'Submissions' },
    { key: 'submission_status', name: 'submission status', dataType: 'TEXT', group: 'Submissions' },
    { key: 'payment_status', name: 'payment status', dataType: 'TEXT', group: 'Submissions' },
    { key: 'bulk_ip_address', name: 'bulk ip address', dataType: 'TEXT', group: 'Submissions' }
  );

  // ── ACH Payment ──
  fields.push(
    { key: 'ach_routing_number', name: 'ach routing number', dataType: 'TEXT', group: 'ACH Payment' },
    { key: 'ach_account_number', name: 'ach account number', dataType: 'TEXT', group: 'ACH Payment' },
    { key: 'ach_account_type', name: 'ach account type', dataType: 'TEXT', group: 'ACH Payment' },
    { key: 'ach_billing_street_address', name: 'ach billing street address', dataType: 'TEXT', group: 'ACH Payment' },
    { key: 'ach_billing_city', name: 'ach billing city', dataType: 'TEXT', group: 'ACH Payment' },
    { key: 'ach_billing_state', name: 'ach billing state', dataType: 'TEXT', group: 'ACH Payment' },
    { key: 'ach_billing_zip_code', name: 'ach billing zip code', dataType: 'TEXT', group: 'ACH Payment' },
    { key: 'ach_billing_country', name: 'ach billing country', dataType: 'TEXT', group: 'ACH Payment' }
  );

  return fields;
}

const ALL_FIELDS = buildAllFields();

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function GoHighLevelFieldCreator() {
  const [creating, setCreating] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [results, setResults] = useState<{ created: number; failed: number; skipped: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [folderId, setFolderId] = useState('1UWqf4ak97XhDeoXlfY7');
  const [customLocationId, setCustomLocationId] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [serverApiKey, setServerApiKey] = useState('');
  const [serverLocationId, setServerLocationId] = useState('QWhUZ1cxgQgSMFYGloyK');

  // Load API keys from server on mount
  useEffect(() => {
    fetchGoHighLevelApiKeys()
      .then(config => {
        setServerApiKey(config.apiKey);
        setServerLocationId(config.locationId);
      })
      .catch(() => { /* will use manual entry */ });
  }, []);

  // Resolve effective credentials (manual override > server-fetched)
  const effectiveApiKey = customApiKey || serverApiKey;
  const effectiveLocationId = customLocationId || serverLocationId;

  const addLog = (msg: string) => {
    setProgress(prev => [...prev, msg]);
  };

  // ── Fetch existing fields to avoid duplicates ──
  const fetchExistingFields = async (apiKey: string, locationId: string): Promise<Set<string>> => {
    const response = await fetch(
      `${HIGHLEVEL_BASE_URL}/locations/${locationId}/customFields`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Version': '2021-07-28',
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to fetch existing fields: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const fieldsList = data.customFields || data || [];
    
    // Build set of existing field keys (strip "contact." prefix if present)
    const keys = new Set<string>();
    fieldsList.forEach((f: any) => {
      const fk = f.fieldKey || f.key || '';
      // GHL stores keys as "contact.field_name" — strip the prefix
      const cleaned = fk.startsWith('contact.') ? fk.substring(8) : fk;
      if (cleaned) keys.add(cleaned);
      // Also add the raw name lowercased with underscores in case that's how they match
      if (f.name) {
        keys.add(f.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''));
      }
    });

    return keys;
  };

  // ── Create a single custom field ──
  const createField = async (
    apiKey: string,
    locationId: string,
    field: FieldDef,
    parentId: string
  ): Promise<{ success: boolean; fieldKey?: string; error?: string }> => {
    try {
      const body: any = {
        name: field.name,
        dataType: field.dataType,
        model: 'contact'
      };

      // Add to folder if specified
      if (parentId) {
        body.parentId = parentId;
      }

      const response = await fetch(
        `${HIGHLEVEL_BASE_URL}/locations/${locationId}/customFields`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28',
            'Accept': 'application/json'
          },
          body: JSON.stringify(body)
        }
      );

      if (response.ok) {
        const data = await response.json();
        const createdKey = data.customField?.fieldKey || data.fieldKey || '';
        return { success: true, fieldKey: createdKey };
      } else {
        const errData = await response.text();
        return { success: false, error: `${response.status}: ${errData}` };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // ── Main: Create all missing fields ──
  const createMissingFields = async () => {
    setCreating(true);
    setProgress([]);
    setResults(null);
    setError(null);

    const apiKey = effectiveApiKey;
    const locationId = effectiveLocationId;

    if (!apiKey) {
      setError('No API key configured. Set VITE_HIGHLEVEL_API_KEY or enter one below.');
      setCreating(false);
      return;
    }

    try {
      addLog(`Using Location: ${locationId}`);
      addLog(`API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 6)}`);
      addLog(`Folder ID: ${folderId || '(root — no folder)'}`);
      addLog(`Total fields defined: ${ALL_FIELDS.length}`);
      addLog('');
      addLog('Fetching existing custom fields...');

      const existingKeys = await fetchExistingFields(apiKey, locationId);
      addLog(`Found ${existingKeys.size} existing field keys in GHL`);

      // Determine which fields need creating
      const toCreate = ALL_FIELDS.filter(f => !existingKeys.has(f.key));
      const skipped = ALL_FIELDS.length - toCreate.length;

      if (toCreate.length === 0) {
        addLog('');
        addLog('ALL FIELDS ALREADY EXIST! Nothing to create.');
        setResults({ created: 0, failed: 0, skipped, total: ALL_FIELDS.length });
        setCreating(false);
        return;
      }

      addLog(`${skipped} fields already exist (skipping)`);
      addLog(`${toCreate.length} fields to create...`);
      addLog('');

      let created = 0;
      let failed = 0;
      const keyMap: Array<{ expected: string; actual: string }> = [];

      for (let i = 0; i < toCreate.length; i++) {
        const field = toCreate[i];
        const result = await createField(apiKey, locationId, field, folderId);

        if (result.success) {
          created++;
          const actualKey = result.fieldKey?.replace('contact.', '') || '?';
          keyMap.push({ expected: field.key, actual: actualKey });

          // Warn if generated key doesn't match expected
          if (actualKey !== field.key && actualKey !== '?') {
            addLog(`[${i + 1}/${toCreate.length}] CREATED: "${field.name}" — KEY MISMATCH: expected="${field.key}" got="${actualKey}"`);
          } else {
            addLog(`[${i + 1}/${toCreate.length}] CREATED: ${field.key}`);
          }
        } else {
          failed++;
          addLog(`[${i + 1}/${toCreate.length}] FAILED: ${field.key} — ${result.error}`);
        }

        // Rate limit: 200ms between requests
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      addLog('');
      addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      addLog(`DONE! Created: ${created} | Failed: ${failed} | Skipped: ${skipped}`);

      // Show key mismatches if any
      const mismatches = keyMap.filter(k => k.actual !== k.expected && k.actual !== '?');
      if (mismatches.length > 0) {
        addLog('');
        addLog('KEY MISMATCHES (may need code update):');
        mismatches.forEach(m => {
          addLog(`  Code sends: "${m.expected}" — GHL created: "${m.actual}"`);
        });
      }

      setResults({ created, failed, skipped, total: ALL_FIELDS.length });

    } catch (err: any) {
      setError(err.message || 'Failed to create custom fields');
      console.error('Error creating fields:', err);
    } finally {
      setCreating(false);
    }
  };

  // ── Download fields list as CSV ──
  const downloadFieldsList = () => {
    let csv = 'Group,Field Key,Display Name,Data Type\n';
    ALL_FIELDS.forEach(f => {
      csv += `"${f.group}","${f.key}","${f.name}","${f.dataType}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nylta-ghl-fields-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Group summary for display ──
  const groupSummary = ALL_FIELDS.reduce<Record<string, number>>((acc, f) => {
    acc[f.group] = (acc[f.group] || 0) + 1;
    return acc;
  }, {});

  return (
    <Card className="border-2 border-[#00274E]">
      <CardHeader className="bg-[#00274E] text-white">
        <CardTitle className="flex items-center gap-2">
          <FolderPlus className="h-5 w-5" />
          GoHighLevel Custom Field Creator
        </CardTitle>
        <CardDescription className="text-gray-300">
          Create all {ALL_FIELDS.length} custom fields in your GHL location using Maria's simplified keys
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Config Section */}
          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfig(!showConfig)}
              className="text-xs"
            >
              {showConfig ? 'Hide' : 'Show'} Configuration
            </Button>

            {showConfig && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                <div>
                  <Label className="text-xs text-gray-600">API Key (leave blank to use env var)</Label>
                  <Input
                    type="password"
                    value={customApiKey}
                    onChange={e => setCustomApiKey(e.target.value)}
                    placeholder={effectiveApiKey ? `${effectiveApiKey.substring(0, 10)}...` : 'Enter API key'}
                    className="font-mono text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Location ID (leave blank to use env var)</Label>
                  <Input
                    value={customLocationId}
                    onChange={e => setCustomLocationId(e.target.value)}
                    placeholder={effectiveLocationId || 'Enter location ID'}
                    className="font-mono text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Folder ID (all fields will be created inside this folder)</Label>
                  <Input
                    value={folderId}
                    onChange={e => setFolderId(e.target.value)}
                    placeholder="e.g. 1UWqf4ak97XhDeoXlfY7"
                    className="font-mono text-xs"
                  />
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Effective Location: <code className="bg-gray-200 px-1 rounded">{effectiveLocationId}</code></p>
                  <p>Effective API Key: <code className="bg-gray-200 px-1 rounded">{effectiveApiKey ? `${effectiveApiKey.substring(0, 10)}...` : '(not set)'}</code></p>
                  <p>Folder: <code className="bg-gray-200 px-1 rounded">{folderId || '(root)'}</code></p>
                </div>
              </div>
            )}
          </div>

          {/* Field Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {ALL_FIELDS.length} Fields Across {Object.keys(groupSummary).length} Groups
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(groupSummary).map(([group, count]) => (
                <Badge key={group} variant="secondary" className="text-xs">
                  {group}: {count}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {!creating && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={createMissingFields}
                size="lg"
                className="bg-[#00274E] hover:bg-[#003d73] text-white py-6"
                disabled={!effectiveApiKey}
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Missing Fields
              </Button>
              <Button
                onClick={downloadFieldsList}
                variant="outline"
                size="lg"
                className="py-6"
              >
                Download CSV ({ALL_FIELDS.length} fields)
              </Button>
            </div>
          )}

          {!effectiveApiKey && (
            <Alert className="border-amber-300 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                No API key detected. Click "Show Configuration" and enter your GHL API key, or set <code>VITE_HIGHLEVEL_API_KEY</code>.
              </AlertDescription>
            </Alert>
          )}

          {/* Progress */}
          {creating && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="font-semibold">Creating custom fields...</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert className="border-red-300 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Progress Log */}
          {progress.length > 0 && (
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-xs max-h-[500px] overflow-y-auto">
              {progress.map((line, index) => (
                <div key={index} className={`py-0.5 ${
                  line.includes('FAILED') ? 'text-red-400' :
                  line.includes('CREATED') ? 'text-green-400' :
                  line.includes('MISMATCH') ? 'text-yellow-400' :
                  line.includes('DONE') ? 'text-cyan-400 font-bold' :
                  ''
                }`}>
                  {line}
                </div>
              ))}
            </div>
          )}

          {/* Results Summary */}
          {results && (
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <p className="text-xs text-blue-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-blue-900">{results.total}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <p className="text-xs text-green-600 mb-1">Created</p>
                <p className="text-2xl font-bold text-green-900">{results.created}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Skipped</p>
                <p className="text-2xl font-bold text-gray-900">{results.skipped}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-xs text-red-600 mb-1">Failed</p>
                <p className="text-2xl font-bold text-red-900">{results.failed}</p>
              </div>
            </div>
          )}

          {/* Success */}
          {results && results.failed === 0 && results.created > 0 && (
            <Alert className="bg-green-50 border-2 border-green-300">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>All fields created successfully!</strong> Submissions will now populate these custom fields in GoHighLevel.
              </AlertDescription>
            </Alert>
          )}

          {/* Retry */}
          {results && results.failed > 0 && (
            <Button onClick={createMissingFields} variant="outline" className="w-full">
              Retry ({results.failed} failed fields)
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}