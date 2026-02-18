import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Alert, AlertDescription } from "./ui/alert";
import { Settings, Check, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

/**
 * HIGHLEVEL ENVIRONMENT SWITCHER
 * Toggle between Production and Staging HighLevel credentials
 */

interface HighLevelCredentials {
  apiKey: string;
  locationId: string;
}

export default function HighLevelEnvSwitcher() {
  const [isStaging, setIsStaging] = useState(false);
  const [productionCreds, setProductionCreds] = useState<HighLevelCredentials>({
    apiKey: '',
    locationId: ''
  });
  const [stagingCreds, setStagingCreds] = useState<HighLevelCredentials>({
    apiKey: '',
    locationId: ''
  });
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved credentials from localStorage
  useEffect(() => {
    const savedProd = localStorage.getItem('highlevel_production_creds');
    const savedStaging = localStorage.getItem('highlevel_staging_creds');
    const savedEnv = localStorage.getItem('highlevel_environment');

    if (savedProd) {
      try {
        setProductionCreds(JSON.parse(savedProd));
      } catch (e) {
        console.error('Failed to parse production credentials');
      }
    } else {
      // Set current environment variables as production defaults (if available)
      const defaultApiKey = typeof import.meta !== 'undefined' && import.meta.env?.VITE_HIGHLEVEL_API_KEY || '';
      const defaultLocationId = typeof import.meta !== 'undefined' && import.meta.env?.VITE_HIGHLEVEL_LOCATION_ID || '';
      
      setProductionCreds({
        apiKey: defaultApiKey,
        locationId: defaultLocationId
      });
    }

    if (savedStaging) {
      try {
        setStagingCreds(JSON.parse(savedStaging));
      } catch (e) {
        console.error('Failed to parse staging credentials');
      }
    }

    if (savedEnv === 'staging') {
      setIsStaging(true);
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);

    // Save to localStorage
    localStorage.setItem('highlevel_production_creds', JSON.stringify(productionCreds));
    localStorage.setItem('highlevel_staging_creds', JSON.stringify(stagingCreds));

    toast.success('Credentials saved successfully!');
    
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  const handleToggleEnvironment = (checked: boolean) => {
    setIsStaging(checked);
    localStorage.setItem('highlevel_environment', checked ? 'staging' : 'production');

    const env = checked ? 'Staging' : 'Production';
    const creds = checked ? stagingCreds : productionCreds;

    // Update environment variables (requires page reload to take effect)
    if (typeof window !== 'undefined') {
      (window as any).VITE_HIGHLEVEL_API_KEY = creds.apiKey;
      (window as any).VITE_HIGHLEVEL_LOCATION_ID = creds.locationId;
    }

    toast.success(`Switched to ${env} environment`, {
      description: 'Please refresh the page for changes to take full effect'
    });
  };

  const handleReloadPage = () => {
    window.location.reload();
  };

  const currentCreds = isStaging ? stagingCreds : productionCreds;
  const hasProductionCreds = productionCreds.apiKey && productionCreds.locationId;
  const hasStagingCreds = stagingCreds.apiKey && stagingCreds.locationId;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-[#00274E]">
        <CardHeader className="bg-[#00274E] text-white">
          <CardTitle className="text-2xl flex items-center gap-3">
            <Settings className="h-8 w-8" />
            HighLevel Environment Switcher
          </CardTitle>
          <CardDescription className="text-gray-200 mt-2">
            Toggle between Production and Staging HighLevel credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Current Environment Status */}
          <div className="mb-6 p-4 border-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Current Environment
                </h3>
                <div className="flex items-center gap-2">
                  <Badge className={isStaging ? 'bg-orange-500' : 'bg-green-600'}>
                    {isStaging ? 'STAGING' : 'PRODUCTION'}
                  </Badge>
                  {currentCreds.apiKey && currentCreds.locationId ? (
                    <span className="text-sm text-gray-600">
                      ✓ Configured
                    </span>
                  ) : (
                    <span className="text-sm text-red-600">
                      ⚠ Not Configured
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  Production
                </span>
                <Switch
                  checked={isStaging}
                  onCheckedChange={handleToggleEnvironment}
                  disabled={!hasStagingCreds && isStaging}
                />
                <span className="text-sm font-medium text-gray-700">
                  Staging
                </span>
              </div>
            </div>
          </div>

          {/* Warning Alert */}
          {isStaging && (
            <Alert className="mb-6 border-orange-300 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Staging Mode Active:</strong> All HighLevel API calls will use the staging credentials. 
                Remember to switch back to Production after testing!
              </AlertDescription>
            </Alert>
          )}

          {/* Production Credentials */}
          <Card className="mb-6 border-2 border-green-300">
            <CardHeader className="bg-green-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Production Credentials</CardTitle>
                {hasProductionCreds && <Check className="h-5 w-5 text-green-600" />}
              </div>
              <CardDescription>
                Live environment - currently active for real customers
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="prod-api-key">API Key</Label>
                <Input
                  id="prod-api-key"
                  type={showApiKeys ? "text" : "password"}
                  value={productionCreds.apiKey}
                  onChange={(e) => setProductionCreds({ ...productionCreds, apiKey: e.target.value })}
                  placeholder="Enter production API key"
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <Label htmlFor="prod-location-id">Location ID</Label>
                <Input
                  id="prod-location-id"
                  value={productionCreds.locationId}
                  onChange={(e) => setProductionCreds({ ...productionCreds, locationId: e.target.value })}
                  placeholder="Enter production location ID"
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Staging Credentials */}
          <Card className="mb-6 border-2 border-orange-300">
            <CardHeader className="bg-orange-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Staging Credentials</CardTitle>
                {hasStagingCreds && <Check className="h-5 w-5 text-orange-600" />}
              </div>
              <CardDescription>
                Test environment - for testing before production deployment
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="staging-api-key">API Key</Label>
                <Input
                  id="staging-api-key"
                  type={showApiKeys ? "text" : "password"}
                  value={stagingCreds.apiKey}
                  onChange={(e) => setStagingCreds({ ...stagingCreds, apiKey: e.target.value })}
                  placeholder="Enter staging API key"
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <Label htmlFor="staging-location-id">Location ID</Label>
                <Input
                  id="staging-location-id"
                  value={stagingCreds.locationId}
                  onChange={(e) => setStagingCreds({ ...stagingCreds, locationId: e.target.value })}
                  placeholder="Enter staging location ID"
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Switch
                id="show-api-keys"
                checked={showApiKeys}
                onCheckedChange={setShowApiKeys}
              />
              <Label htmlFor="show-api-keys" className="cursor-pointer">
                Show API Keys
              </Label>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#00274E] hover:bg-[#003366] flex-1"
              >
                {isSaving ? 'Saving...' : 'Save Credentials'}
              </Button>
              
              <Button
                onClick={handleReloadPage}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-300 rounded p-4">
            <h4 className="font-semibold text-blue-900 mb-2">📋 How to Use:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Enter your <strong>Production</strong> credentials (current live environment)</li>
              <li>Enter your <strong>Staging</strong> credentials (test environment)</li>
              <li>Click <strong>"Save Credentials"</strong></li>
              <li>Toggle the switch to activate <strong>Staging</strong> mode</li>
              <li>Click <strong>"Reload Page"</strong> to apply changes</li>
              <li>Run your tests at 1 PM with staging environment</li>
              <li>Toggle back to <strong>Production</strong> when done</li>
            </ol>
          </div>

          {/* Current Active Credentials Display */}
          <div className="mt-6 bg-gray-50 border-2 border-gray-300 rounded p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              Currently Active Credentials:
            </h4>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">API Key:</span>
                <span className="text-gray-900">
                  {currentCreds.apiKey ? 
                    (showApiKeys ? currentCreds.apiKey : `${currentCreds.apiKey.slice(0, 8)}...${currentCreds.apiKey.slice(-4)}`) 
                    : 'Not set'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Location ID:</span>
                <span className="text-gray-900">
                  {currentCreds.locationId || 'Not set'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}