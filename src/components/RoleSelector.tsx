import { useState } from "react";
import { Shield, User, FileText, LogOut, Home, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export type UserRole = "super_admin" | "processor_filer" | "manager";

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
  onBack?: () => void;
}

export default function RoleSelector({ onRoleSelect, onBack }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  const roles = [
    {
      id: "super_admin" as UserRole,
      name: "Super Admin",
      user: "Tiffany",
      icon: Shield,
      color: "bg-[#00274E]",
      borderColor: "border-[#00274E]",
      description: "Full platform access with all administrative privileges",
      permissions: [
        "Access firm profiles",
        "Manage billing",
        "View all filings",
        "Manage all users",
        "Platform configuration",
        "Email marketing campaigns"
      ]
    },
    {
      id: "processor_filer" as UserRole,
      name: "Processor / Filer",
      user: "Filing Team Members",
      icon: FileText,
      color: "bg-blue-600",
      borderColor: "border-blue-600",
      description: "Limited access to assigned clients and filing operations",
      permissions: [
        "View assigned filings only",
        "Submit filings for assigned clients",
        "Update filing status",
        "Download client receipts",
        "No unassigned submissions access",
        "No admin settings access"
      ]
    },
    {
      id: "manager" as UserRole,
      name: "Manager",
      user: "Ryan De Freitas",
      icon: User,
      color: "bg-green-700",
      borderColor: "border-green-700",
      description: "Management access without filing visibility",
      permissions: [
        "View firm profiles",
        "Access billing information",
        "View payment records",
        "Export authorization forms",
        "No filing access",
        "No platform configuration"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same as Dashboard */}
      <header className="sticky top-0 z-50 bg-[#00274E] text-white shadow-md border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <ImageWithFallback 
                src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                alt="NYLTA.com Logo"
                className="h-10 sm:h-12 w-auto"
              />
              <div>
                <h1 className="text-xl sm:text-2xl text-white">Team Access Portal</h1>
                <p className="text-gray-300 text-sm">Select your role to continue</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="bg-white text-[#00274E] border-white hover:bg-gray-100"
                  size="sm"
                >
                  <Home className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              )}
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white hover:text-[#00274E]"
                size="sm"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Log Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Explanation */}
        <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="h-6 w-6 text-[#00274E]" />
            </div>
            <div className="flex-1">
              <h2 className="text-gray-900 text-2xl mb-3">
                Welcome to NYLTA.com Team Access
              </h2>
              <p className="text-gray-700 mb-3 leading-relaxed">
                Our role-based access system ensures that each team member has the appropriate permissions for their responsibilities. 
                Please select your role below to access your personalized dashboard with the tools and data you need.
              </p>
              <div className="bg-white border border-yellow-200 p-4 rounded">
                <p className="text-sm text-gray-700 mb-2">
                  <strong className="text-[#00274E]">How it works:</strong>
                </p>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Review the three available roles and their permissions below</li>
                  <li>Click on the card that matches your position or responsibilities</li>
                  <li>Click "Continue to Dashboard" to access your workspace</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Instruction */}
        <div className="text-center mb-6">
          <h3 className="text-gray-900 mb-2">Select Your Role</h3>
          <p className="text-gray-600">Click on the card that best describes your position</p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-200 border-2 ${
                  isSelected 
                    ? 'border-yellow-400 shadow-xl scale-105' 
                    : role.borderColor + ' hover:shadow-lg hover:scale-102'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader className={`${role.color} text-white border-b-4 ${isSelected ? 'border-yellow-400' : 'border-gray-200'} relative`}>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-[#00274E] text-xl">✓</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white text-xl">{role.name}</CardTitle>
                      <CardDescription className="text-gray-200 text-sm">{role.user}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 bg-white">
                  <p className="text-gray-700 mb-4 leading-relaxed">{role.description}</p>
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-900">Key Permissions:</p>
                    <ul className="space-y-2">
                      {role.permissions.map((permission, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-600 mt-0.5 font-bold">✓</span>
                          <span>{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Continue Section - Only show when role selected */}
        {selectedRole && (
          <Card className="border-2 border-yellow-400 shadow-lg bg-gradient-to-r from-yellow-50 to-white">
            <CardHeader className="bg-[#00274E] border-b-4 border-yellow-400">
              <CardTitle className="text-white">Continue to Dashboard</CardTitle>
              <CardDescription className="text-gray-200">
                Click below to access your {roles.find(r => r.id === selectedRole)?.name} dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button
                onClick={handleContinue}
                className="bg-[#00274E] hover:bg-[#003d73] text-white px-8 py-6 w-full"
                size="lg"
              >
                Continue to Dashboard →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Alert className="mt-8 border-blue-200 bg-blue-50">
          <AlertDescription className="text-gray-700">
            <strong className="text-[#00274E]">Need help selecting a role?</strong> Contact your team administrator 
            or reach out to support at{' '}
            <a href="mailto:bulk@nylta.com" className="text-[#00274E] underline hover:text-blue-700">
              bulk@nylta.com
            </a>
            {' '}for assistance with access permissions.
          </AlertDescription>
        </Alert>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔒 NYLTA.com™ Team Access Portal • Secure Role-Based Access Control
          </p>
        </div>
      </main>
    </div>
  );
}