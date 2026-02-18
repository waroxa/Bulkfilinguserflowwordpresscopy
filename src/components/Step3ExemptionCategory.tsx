import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Info, AlertCircle, Building2, CheckCircle2 } from "lucide-react";
import { Client } from "../App";
import { Input } from "./ui/input";

interface Step3ExemptionCategoryProps {
  clients: Client[]; // Only exemption clients are passed
  totalClients?: number; // Total number of clients in the batch (for progress display)
  onComplete: (updatedClients: Client[]) => void;
  onBack: () => void;
}

const EXEMPTION_CATEGORIES = [
  {
    value: "Bank",
    label: "Bank",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Credit Union",
    label: "Credit Union",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Depository Institution Holding Company",
    label: "Depository Institution Holding Company",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Money Services Business",
    label: "Money Services Business",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Broker or Dealer in Securities",
    label: "Broker or Dealer in Securities",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Securities Exchange or Clearing Agency",
    label: "Securities Exchange or Clearing Agency",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Other Exchange Act Registered Entity",
    label: "Other Exchange Act Registered Entity",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Investment Company or Investment Adviser",
    label: "Investment Company or Investment Adviser",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Venture Capital Fund Adviser",
    label: "Venture Capital Fund Adviser",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Insurance Company",
    label: "Insurance Company",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "State-Licensed Insurance Producer",
    label: "State-Licensed Insurance Producer",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Commodity Exchange Act Registered Entity",
    label: "Commodity Exchange Act Registered Entity",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Accounting Firm",
    label: "Accounting Firm",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Public Utility",
    label: "Public Utility",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Financial Market Utility",
    label: "Financial Market Utility",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Pooled Investment Vehicle",
    label: "Pooled Investment Vehicle",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Tax-Exempt Entity",
    label: "Tax-Exempt Entity",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Entity Assisting a Tax-Exempt Entity",
    label: "Entity Assisting a Tax-Exempt Entity",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Large Operating Company",
    label: "Large Operating Company",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Subsidiary of Certain Exempt Entities",
    label: "Subsidiary of Certain Exempt Entities",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Inactive Entity",
    label: "Inactive Entity",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "Governmental Authority",
    label: "Governmental Authority",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  },
  {
    value: "U.S.-Formed LLC",
    label: "U.S.-Formed LLC",
    autoExplanation: "The entity qualifies for the selected exemption based on the information provided."
  }
];

export default function Step3ExemptionCategory({ 
  clients, 
  totalClients,
  onComplete, 
  onBack 
}: Step3ExemptionCategoryProps) {
  // Initialize state for each client's exemption data
  const [clientExemptions, setClientExemptions] = useState<Record<string, { category: string; explanation: string }>>(
    clients.reduce((acc, client) => {
      acc[client.id] = {
        category: client.exemptionCategory || '',
        explanation: client.exemptionExplanation || ''
      };
      return acc;
    }, {} as Record<string, { category: string; explanation: string }>)
  );

  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = (clientId: string, value: string) => {
    // When category changes, clear the explanation and force user to provide their own
    setClientExemptions(prev => ({
      ...prev,
      [clientId]: {
        category: value,
        explanation: '' // Always empty - user must provide their own explanation
      }
    }));
  };

  const handleExplanationChange = (clientId: string, value: string) => {
    setClientExemptions(prev => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        explanation: value
      }
    }));
  };

  const handleContinue = () => {
    // Validate all clients have category selected
    const incomplete = clients.filter(client => !clientExemptions[client.id]?.category);
    
    if (incomplete.length > 0) {
      alert(`Please select exemption categories for all clients. ${incomplete.length} client(s) incomplete.`);
      return;
    }

    // Update clients with exemption data
    const updatedClients = clients.map(client => ({
      ...client,
      exemptionCategory: clientExemptions[client.id].category,
      exemptionExplanation: clientExemptions[client.id].explanation
    }));

    onComplete(updatedClients);
  };

  const completedCount = clients.filter(client => clientExemptions[client.id]?.category).length;

  // Filter clients based on search
  const filteredClients = clients.filter(client => 
    client.llcName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.nydosId && client.nydosId.includes(searchQuery)) ||
    (client.ein && client.ein.includes(searchQuery))
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white border-2 border-gray-200 shadow-sm">
        {/* Header */}
        <div className="bg-[#00274E] text-white px-8 py-6 border-b-4 border-yellow-400">
          <h2 className="text-3xl mb-2">Exemption Category - Per Client</h2>
          <p className="text-gray-200">Select exemption category for each client claiming exemption</p>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {/* Progress */}
          <div className="bg-gray-50 border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                Progress: <strong>{completedCount} of {totalClients || clients.length}</strong> clients completed
              </span>
              {completedCount === clients.length && (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
            </div>
          </div>

          {/* Important Notice */}
          <Alert className="border-blue-200 bg-blue-50 mb-6">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-gray-900 ml-2">
              <strong className="block mb-1">Important Notice</strong>
              You are submitting an exemption attestation based on the information you provide. 
              NYLTA.com does not determine eligibility.
            </AlertDescription>
          </Alert>

          {/* Navigation: Dropdown + Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Client Dropdown Navigation */}
            <Select
              value={filteredClients.length > 0 ? filteredClients[0]?.id : ''}
              onValueChange={(clientId) => {
                const element = document.getElementById(`client-card-${clientId}`);
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Jump to client..." />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client, idx) => {
                  const isComplete = clientExemptions[client.id]?.category;
                  return (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center gap-2">
                        {isComplete && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                        <span>{idx + 1}. {client.llcName}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Search Bar */}
            <Input
              type="text"
              placeholder="Search by LLC name or NYDOS ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Client List */}
          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
            {filteredClients.map((client, index) => {
              const isOtherExemption = clientExemptions[client.id]?.category === 'Other Exemption';
              const isComplete = clientExemptions[client.id]?.category && 
                (!isOtherExemption || clientExemptions[client.id]?.explanation?.trim());

              return (
                <div 
                  key={client.id}
                  id={`client-card-${client.id}`}
                  className={`border-2 bg-white p-6 ${
                    isComplete ? 'border-green-500' : 'border-gray-200'
                  }`}
                >
                  {/* Client Header */}
                  <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-200">
                    <Building2 className="h-5 w-5 text-[#00274E] mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg text-gray-900 break-words">
                          {client.llcName}
                        </h3>
                        {isComplete && (
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        {client.nydosId && (
                          <span>DOS ID: {client.nydosId}</span>
                        )}
                        {client.ein && (
                          <span>EIN: {client.ein}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Exemption Category Selection */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`category-${client.id}`} className="text-base text-gray-900 mb-2 block">
                        Select Exemption Category*
                      </Label>
                      <Select 
                        value={clientExemptions[client.id]?.category || ''} 
                        onValueChange={(value) => handleCategoryChange(client.id, value)}
                      >
                        <SelectTrigger 
                          id={`category-${client.id}`}
                          className="border-gray-300"
                        >
                          <SelectValue placeholder="Choose an exemption category..." />
                        </SelectTrigger>
                        <SelectContent>
                          {EXEMPTION_CATEGORIES.map((category) => (
                            <SelectItem 
                              key={category.value} 
                              value={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Selected Category Display */}
                    {clientExemptions[client.id]?.category && (
                      <div className="p-3 bg-gray-50 border border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">
                          Selected: {clientExemptions[client.id].category}
                        </p>
                      </div>
                    )}

                    {/* Explanation Field - ALWAYS REQUIRED */}
                    {clientExemptions[client.id]?.category && (
                      <div>
                        <Label htmlFor={`explanation-${client.id}`} className="text-base text-gray-900 mb-2 block">
                          Exemption Explanation*
                        </Label>
                        <Textarea
                          id={`explanation-${client.id}`}
                          value={clientExemptions[client.id]?.explanation || ''}
                          onChange={(e) => handleExplanationChange(client.id, e.target.value)}
                          placeholder=""
                          rows={3}
                          className="resize-none border-gray-300"
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Disclaimer */}
          <Alert className="border-yellow-300 bg-yellow-50 mt-6">
            <AlertCircle className="h-4 w-4 text-yellow-700" />
            <AlertDescription className="text-sm text-gray-900 ml-2">
              <strong>Disclaimer:</strong> Final filing requirements are subject to guidance from the New York Department of State.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200 mt-6">
            <Button
              onClick={onBack}
              variant="outline"
              className="px-8 py-6 text-base border-gray-300"
              size="lg"
            >
              Back
            </Button>

            <Button
              onClick={handleContinue}
              disabled={completedCount !== clients.length}
              className="bg-[#00274E] hover:bg-[#003d73] text-white px-8 py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              Continue with {clients.length} Exemption Client{clients.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}