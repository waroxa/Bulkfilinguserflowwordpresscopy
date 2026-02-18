import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Building2, Search, CheckCircle2 } from "lucide-react";
import { Client } from "../App";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface FilingIntentDecisionProps {
  clients: Client[];
  onComplete: (updatedClients: Client[]) => void;
  onBack: () => void;
}

export default function FilingIntentDecision({ clients, onComplete, onBack }: FilingIntentDecisionProps) {
  // Initialize filing intents from clients (if already set from CSV)
  const [clientIntents, setClientIntents] = useState<{ [key: string]: 'disclosure' | 'exemption' }>(
    clients.reduce((acc, client) => {
      if (client.filingType) {
        acc[client.id] = client.filingType;
      }
      return acc;
    }, {} as { [key: string]: 'disclosure' | 'exemption' })
  );

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const handleIntentChange = (clientId: string, intent: 'disclosure' | 'exemption') => {
    setClientIntents(prev => ({
      ...prev,
      [clientId]: intent
    }));
  };

  const handleContinue = () => {
    // Check if all clients have a filing intent selected
    const allSet = clients.every(client => clientIntents[client.id]);
    
    if (!allSet) {
      alert("Please select a filing intent for all clients before continuing.");
      return;
    }

    // Update clients with their selected filing intents
    const updatedClients = clients.map(client => ({
      ...client,
      filingType: clientIntents[client.id]
    }));

    onComplete(updatedClients);
  };

  const allIntentsSet = clients.every(client => clientIntents[client.id]);
  const disclosureCount = Object.values(clientIntents).filter(i => i === 'disclosure').length;
  const exemptionCount = Object.values(clientIntents).filter(i => i === 'exemption').length;

  // Filter clients based on search query
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
          <h2 className="text-3xl mb-2">Filing Intent - Per Client</h2>
          <p className="text-gray-200">Select disclosure or exemption for each client</p>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 border border-gray-200 p-4 text-center">
              <div className="text-2xl text-[#00274E] mb-1">{clients.length}</div>
              <div className="text-sm text-gray-600">Total Clients</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4 text-center">
              <div className="text-2xl text-blue-700 mb-1">{disclosureCount}</div>
              <div className="text-sm text-gray-600">Disclosure</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 p-4 text-center">
              <div className="text-2xl text-yellow-700 mb-1">{exemptionCount}</div>
              <div className="text-sm text-gray-600">Exemption</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 border-l-4 border-gray-400 p-5 mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-gray-900">Instructions:</strong> For each client below, select whether you are submitting beneficial ownership information (disclosure) or an exemption attestation. You can mix both types in a single batch.
            </p>
          </div>

          {/* Navigation: Dropdown + Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  const isComplete = clientIntents[client.id];
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
              placeholder="Search by LLC Name, DOS ID, or EIN"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Client List */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {filteredClients.map((client, index) => { 
              return (
                <div 
                  key={client.id}
                  id={`client-card-${client.id}`}
                  className="border-2 border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow"
                >
                  {/* Client Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <Building2 className="h-5 w-5 text-[#00274E] mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg text-gray-900 mb-1 break-words">
                        {index + 1}. {client.llcName}
                      </h3>
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

                  {/* Filing Intent Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Disclosure Option */}
                    <button
                      onClick={() => handleIntentChange(client.id, 'disclosure')}
                      className={`text-left border-2 p-4 transition-all ${
                        clientIntents[client.id] === 'disclosure'
                          ? 'border-blue-600 bg-blue-50 shadow-sm'
                          : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                          clientIntents[client.id] === 'disclosure'
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-400'
                        }`}>
                          {clientIntents[client.id] === 'disclosure' && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">
                            Disclosure
                          </p>
                          <p className="text-xs text-gray-600">
                            Submit beneficial owner information
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Exemption Option */}
                    <button
                      onClick={() => handleIntentChange(client.id, 'exemption')}
                      className={`text-left border-2 p-4 transition-all ${
                        clientIntents[client.id] === 'exemption'
                          ? 'border-yellow-600 bg-yellow-50 shadow-sm'
                          : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                          clientIntents[client.id] === 'exemption'
                            ? 'border-yellow-600 bg-yellow-600'
                            : 'border-gray-400'
                        }`}>
                          {clientIntents[client.id] === 'exemption' && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">
                            Claims Exemption
                          </p>
                          <p className="text-xs text-gray-600">
                            Submit exemption attestation
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compliance Notice */}
          <div className="bg-blue-50 border border-blue-200 p-5 mt-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Important</h4>
                <p className="text-sm text-blue-800">
                  NYLTA.com records the information you submit and does not determine eligibility. You are responsible for ensuring the accuracy of your selections.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200 mt-6">
            <Button
              onClick={onBack}
              variant="outline"
              className="px-8 py-6 text-base"
              size="lg"
            >
              Back
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!allIntentsSet}
              className="bg-[#00274E] hover:bg-[#003d73] text-white px-8 py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              size="lg"
            >
              Continue with {clients.length} Client{clients.length !== 1 ? 's' : ''}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Next Steps Preview */}
      <div className="mt-6 bg-gray-50 border border-gray-200 p-5">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">What happens next?</h4>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            <strong>All clients:</strong> You'll verify company applicant information
          </p>
          {disclosureCount > 0 && (
            <p>
              <strong>{disclosureCount} Disclosure client{disclosureCount !== 1 ? 's' : ''}:</strong> You'll provide beneficial owner details
            </p>
          )}
          {exemptionCount > 0 && (
            <p>
              <strong>{exemptionCount} Exemption client{exemptionCount !== 1 ? 's' : ''}:</strong> You'll select exemption categories and provide attestations
            </p>
          )}
        </div>
      </div>
    </div>
  );
}