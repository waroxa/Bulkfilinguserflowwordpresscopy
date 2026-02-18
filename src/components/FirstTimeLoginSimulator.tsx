import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { UserCheck, LogIn } from "lucide-react";

interface FirstTimeLoginSimulatorProps {
  onFirstTimeLogin: () => void;
}

export default function FirstTimeLoginSimulator({ onFirstTimeLogin }: FirstTimeLoginSimulatorProps) {
  return (
    <Card className="border-2 border-blue-300 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-blue-600" />
          Simulate First-Time User Login
        </CardTitle>
        <CardDescription>
          Test the onboarding wizard for new users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-4">
          This simulates a user who has just been approved by the admin and is logging in for the first time. 
          They will see the welcome wizard and then be guided to complete their firm profile.
        </p>
        <Button
          onClick={onFirstTimeLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-none w-full"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Simulate First-Time Login
        </Button>
      </CardContent>
    </Card>
  );
}
