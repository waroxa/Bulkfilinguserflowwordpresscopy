import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2, AlertTriangle, Search, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Client } from "../App";

interface Step3ExemptionCheckProps {
  clients: Client[];
  onComplete: (clients: Client[]) => void;
  onBack: () => void;
}

export default function Step3ExemptionCheck({ clients, onComplete, onBack }: Step3ExemptionCheckProps) {
  const [currentClientIndex, setCurrentClientIndex] = useState(0);
  const [updatedClients, setUpdatedClients] = useState<Client[]>(clients);
  const [searchTerm, setSearchTerm] = useState("");

  const currentClient = updatedClients[currentClientIndex];

  // Handle filing intent change
  const handleFilingIntentChange = (intent: "disclosure" | "exemption") => {
    const updated = [...updatedClients];
    updated[currentClientIndex] = {
      ...updated[currentClientIndex],
      filingType: intent,
      // Clear exemption details if switching to disclosure
      ...(intent === "disclosure" && {
        exemptionCategory: undefined,
        exemptionExplanation: undefined
      })
    };
    setUpdatedClients(updated);
  };

  const handleNext = () => {
    if (currentClientIndex < updatedClients.length - 1) {
      setCurrentClientIndex(currentClientIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentClientIndex > 0) {
      setCurrentClientIndex(currentClientIndex - 1);
    }
  };

  const handleClientSelect = (index: string) => {
    setCurrentClientIndex(parseInt(index));
  };

  const handleComplete = () => {
    // Validate all clients have filing intent
    const incomplete = updatedClients.filter(c => !c.filingType);
    if (incomplete.length > 0) {
      alert(`Please select filing intent for all clients. ${incomplete.length} client(s) remaining.`);
      return;
    }

    onComplete(updatedClients);
  };

  // Count completed clients
  const completedCount = updatedClients.filter(c => c.filingType).length;

  const isCurrentClientComplete = !!currentClient.filingType;

  // Get counts for summary
  const disclosureCount = updatedClients.filter(c => c.filingType === "disclosure").length;
  const exemptionCount = updatedClients.filter(c => c.filingType === "exemption").length;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="border-2 border-[#00274E] rounded-none">
        <CardHeader className="bg-[#00274E] text-white rounded-none">
          <CardTitle>Filing Intent</CardTitle>
          <CardDescription className="text-gray-300">
            Select your filing path for each client
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {/* CRITICAL: Per-Client Intent Explanation */}
          <Alert className="mb-6 border-blue-500 bg-blue-50">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <strong>Filing intent is declared per client.</strong><br/>
              Each client can have a different filing intent (disclosure or exemption). NYLTA.com records 
              the information you provide and does not determine eligibility or exemption status.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#00274E]" />
              <span className="text-sm">
                Progress: <strong>{completedCount} of {updatedClients.length}</strong> clients completed
              </span>
            </div>
            {completedCount > 0 && (
              <div className="text-sm text-gray-600">
                {disclosureCount} disclosure, {exemptionCount} exemption
              </div>
            )}
          </div>

          {/* Search and Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by LLC name or NYDOS ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-none"
              />
            </div>

            {/* Client Dropdown */}
            <Select value={currentClientIndex.toString()} onValueChange={handleClientSelect}>
              <SelectTrigger className="rounded-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {updatedClients.map((client, index) => {
                  const isComplete = !!client.filingType;
                  return (
                    <SelectItem key={index} value={index.toString()}>
                      <div className="flex items-center gap-2">
                        {isComplete ? (
                          <CheckCircle2 className="h-4 w-4 text-[#00274E]" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        )}
                        <span>{client.llcName} ({client.nydosId})</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Current Client Form */}
      <Card className="border-2 border-gray-300 rounded-none">
        <CardHeader className="bg-gray-50 border-b-2 border-gray-300 rounded-none">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {isCurrentClientComplete && <CheckCircle2 className="h-5 w-5 text-[#00274E]" />}
                {currentClient.llcName}
              </CardTitle>
              <CardDescription>
                NYDOS ID: {currentClient.nydosId} • EIN: {currentClient.ein || 'Not provided'}
              </CardDescription>
            </div>
            <div className="text-sm text-gray-600">
              Client {currentClientIndex + 1} of {updatedClients.length}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Filing Intent Selection */}
          <div className="space-y-4">
            <Label className="text-base">What is this client submitting?</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Disclosure Option */}
              <Card 
                className={`cursor-pointer transition-all border-2 rounded-none ${
                  currentClient.filingType === "disclosure" 
                    ? "border-[#00274E] bg-yellow-50" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => handleFilingIntentChange("disclosure")}
              >
                <CardContent className="pt-6 text-center">
                  <div className="mb-2">
                    <AlertTriangle className={`h-8 w-8 mx-auto ${
                      currentClient.filingType === "disclosure" ? "text-[#00274E]" : "text-gray-400"
                    }`} />
                  </div>
                  <h4 className="font-semibold mb-2">Beneficial Ownership Disclosure</h4>
                  <p className="text-sm text-gray-600">
                    Client will provide company applicant details and beneficial owner information
                  </p>
                </CardContent>
              </Card>

              {/* Exemption Option */}
              <Card 
                className={`cursor-pointer transition-all border-2 rounded-none ${
                  currentClient.filingType === "exemption" 
                    ? "border-[#00274E] bg-yellow-50" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => handleFilingIntentChange("exemption")}
              >
                <CardContent className="pt-6 text-center">
                  <div className="mb-2">
                    <CheckCircle2 className={`h-8 w-8 mx-auto ${
                      currentClient.filingType === "exemption" ? "text-[#00274E]" : "text-gray-400"
                    }`} />
                  </div>
                  <h4 className="font-semibold mb-2">Exemption Attestation</h4>
                  <p className="text-sm text-gray-600">
                    Client will attest that they meet specific exemption criteria based on the information provided
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Disclosure Info */}
          {currentClient.filingType === "disclosure" && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Next steps for this client:</strong><br/>
                You will provide company applicant details and beneficial owner information in the next steps.
              </AlertDescription>
            </Alert>
          )}

          {/* Exemption Info */}
          {currentClient.filingType === "exemption" && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <Info className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Next steps for this client:</strong><br/>
                You will select an exemption category and provide company applicant details (if known) in the next steps.
              </AlertDescription>
            </Alert>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentClientIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous Client
            </Button>

            {currentClientIndex < updatedClients.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!currentClient.filingType}
              >
                Next Client
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={completedCount !== updatedClients.length}
                className="bg-[#00274E] hover:bg-[#00274E]/90"
              >
                Continue
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleComplete}
          disabled={completedCount !== updatedClients.length}
          className="bg-[#00274E] hover:bg-[#00274E]/90"
        >
          Continue ({completedCount}/{updatedClients.length} Complete)
        </Button>
      </div>
    </div>
  );
}