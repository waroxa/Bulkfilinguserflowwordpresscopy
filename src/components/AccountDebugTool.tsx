import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { SERVER_URL } from "../utils/supabase/client";

export default function AccountDebugTool() {
  const { session, account } = useAuth();
  const [accountData, setAccountData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkAccount = async () => {
    if (!session?.access_token) {
      alert('No session found');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/account`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAccountData(data.account);
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Debug Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkAccount} disabled={loading}>
          {loading ? 'Loading...' : 'Check My Account'}
        </Button>

        {accountData && (
          <div>
            <h3 className="font-bold mb-2">Your Account Data:</h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(accountData, null, 2)}
            </pre>
            <div className="mt-4 space-y-2">
              <p><strong>User ID:</strong> {accountData.userId}</p>
              <p><strong>Email:</strong> {accountData.email}</p>
              <p><strong>Role:</strong> <span className="font-bold text-blue-600">{accountData.role}</span></p>
              <p><strong>Status:</strong> {accountData.status}</p>
            </div>
          </div>
        )}

        {account && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Context Account Data:</h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(account, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
