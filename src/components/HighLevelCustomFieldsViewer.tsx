import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2 } from "lucide-react";
import { getHighLevelCustomFields } from "../utils/highlevel";

export default function HighLevelCustomFieldsViewer() {
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fields = await getHighLevelCustomFields();
      
      if (fields.length === 0) {
        setError("No custom fields found or API key not configured");
      } else {
        setCustomFields(fields);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch custom fields");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-none border-2 border-[#00274E]">
      <CardHeader className="bg-[#00274E] text-white rounded-none">
        <CardTitle>HighLevel Custom Fields</CardTitle>
        <CardDescription className="text-gray-300">
          View all custom fields configured in your HighLevel location
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {!customFields.length && !error && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Click below to fetch custom fields from HighLevel</p>
            <Button 
              onClick={handleFetch}
              disabled={loading}
              className="min-w-[200px]"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Fetching..." : "Fetch Custom Fields"}
            </Button>
          </div>
        )}

        {error && (
          <Alert className="border-red-500 bg-red-50">
            <AlertDescription className="text-red-900">
              ❌ {error}
            </AlertDescription>
          </Alert>
        )}

        {customFields.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">Found {customFields.length} custom field{customFields.length !== 1 ? 's' : ''}</p>
              <Button 
                onClick={handleFetch}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Refresh
              </Button>
            </div>

            <div className="space-y-3">
              {customFields.map((field, index) => (
                <Card key={field.id || index} className="border border-gray-300">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Field Name</p>
                        <p className="font-medium">{field.name || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Field ID</p>
                        <p className="font-mono text-sm text-blue-600">{field.id || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Field Key</p>
                        <p className="font-mono text-sm">{field.key || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Data Type</p>
                        <Badge variant={
                          field.dataType === "TEXT" ? "default" :
                          field.dataType === "SINGLE_OPTIONS" ? "secondary" :
                          field.dataType === "MULTIPLE_OPTIONS" ? "outline" :
                          "destructive"
                        }>
                          {field.dataType || "UNKNOWN"}
                        </Badge>
                      </div>
                      {field.options && field.options.length > 0 && (
                        <div className="col-span-full">
                          <p className="text-xs text-gray-500 mb-2">Options</p>
                          <div className="flex flex-wrap gap-2">
                            {field.options.map((option: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {option}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Code snippet for developers */}
            <div className="mt-6 p-4 bg-gray-900 text-white rounded-lg overflow-x-auto">
              <p className="text-xs text-gray-400 mb-2">Copy this to your code:</p>
              <pre className="text-xs">
{`const CUSTOM_FIELD_IDS = {
${customFields.map(field => {
  const keyName = field.key || field.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown';
  return `  ${keyName}: '${field.id}', // ${field.dataType}: ${field.name}`;
}).join('\n')}
};`}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
