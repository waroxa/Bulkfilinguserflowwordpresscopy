import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";

export default function CreateAdminAccount() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const createAdmin = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('https://wkmtqrvqngukkyjvvazb.supabase.co/functions/v1/make-server-2c01e603/setup/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'waroxa@gmail.com',
          password: '1nthenameofJesus$$$',
          firmName: 'NYLTA Admin',
          contactName: 'Admin User'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: `✅ Admin account created successfully!\n\nEmail: waroxa@gmail.com\nUser ID: ${data.userId}\n\nYou can now login with your credentials.`
        });
      } else {
        setResult({
          success: false,
          message: `❌ Error: ${data.error || 'Failed to create admin account'}`
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-2 border-gray-300">
        <CardHeader className="bg-[#00274E] text-white">
          <CardTitle className="text-2xl" style={{ fontFamily: 'Libre Baskerville, serif' }}>
            Create Admin Account
          </CardTitle>
          <CardDescription className="text-gray-300">
            One-time admin account setup
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> waroxa@gmail.com
            </p>
            <p className="text-sm text-gray-600">
              <strong>Password:</strong> ••••••••••••••
            </p>
            <p className="text-sm text-gray-600">
              <strong>Role:</strong> Admin
            </p>
          </div>

          <Button
            onClick={createAdmin}
            disabled={loading}
            className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#00274E] rounded-none"
          >
            {loading ? 'Creating...' : 'Create Admin Account'}
          </Button>

          {result && (
            <Alert className={result.success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}>
              <AlertDescription className={result.success ? 'text-green-900' : 'text-red-900'}>
                <div className="flex items-start gap-2">
                  {result.success ? (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                  <pre className="whitespace-pre-wrap text-sm">{result.message}</pre>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {result?.success && (
            <div className="pt-4 border-t">
              <Button
                onClick={() => window.location.href = '/'}
                className="w-full bg-[#00274E] hover:bg-[#003366] text-white rounded-none"
              >
                Go to Login Page
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
