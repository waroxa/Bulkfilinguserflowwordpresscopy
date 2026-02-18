import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { isHighLevelConfigured } from "../utils/highlevel";

/**
 * RewardLion Integration Status Component
 * 
 * Displays whether RewardLion CRM integration is properly configured.
 * Can be used in admin dashboard or settings page.
 */
export default function HighLevelStatus() {
  const configured = isHighLevelConfigured();

  return (
    <Card className="border-2 border-gray-200 rounded-none">
      <CardHeader>
        <CardTitle className="text-[#00274E] flex items-center gap-2">
          {configured ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          )}
          RewardLion CRM Integration
        </CardTitle>
      </CardHeader>
      <CardContent>
        {configured ? (
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-700 font-medium">Integration Active</p>
                <p className="text-sm text-gray-600">
                  Contacts are being automatically created in RewardLion when users sign up.
                </p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p className="text-sm text-green-800">
                <strong>Features enabled:</strong>
              </p>
              <ul className="text-sm text-green-700 mt-2 space-y-1 ml-4">
                <li>• Automatic contact creation on signup</li>
                <li>• Lead tagging and categorization</li>
                <li>• Custom field population (firm name, type, status)</li>
                <li>• Source tracking for analytics</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-700 font-medium">Integration Not Configured</p>
                <p className="text-sm text-gray-600">
                  RewardLion API credentials are not set. User signups will still work, but contacts won't be synced to RewardLion.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-sm text-blue-800">
                <strong>To enable RewardLion integration:</strong>
              </p>
              <ol className="text-sm text-blue-700 mt-2 space-y-1 ml-4">
                <li>1. Get your API key from RewardLion Settings → API</li>
                <li>2. Get your Location ID from Business Profile</li>
                <li>3. Add to environment variables:
                  <ul className="ml-4 mt-1 font-mono text-xs">
                    <li>VITE_HIGHLEVEL_API_KEY</li>
                    <li>VITE_HIGHLEVEL_LOCATION_ID</li>
                  </ul>
                </li>
                <li>4. Restart your server</li>
              </ol>
              <p className="text-xs text-blue-600 mt-2">
                See <code className="bg-white px-1 rounded">HIGHLEVEL_SETUP_GUIDE.md</code> for detailed instructions.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
