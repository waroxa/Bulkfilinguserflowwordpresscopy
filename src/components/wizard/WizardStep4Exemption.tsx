/**
 * Step 4: Exemption Handling
 * For clients with filingType === 'exemption', select category and provide explanation.
 * Clients with disclosure filings skip this step (auto-passes validation).
 */

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Shield, CheckCircle2, Info } from "lucide-react";
import type { Client } from "../../types";
import { EXEMPTION_CATEGORIES } from "./WizardTypes";

interface Props {
  clients: Client[];
  onClientsChange: (clients: Client[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function WizardStep4Exemption({ clients, onClientsChange, onNext, onBack }: Props) {
  const exemptClients = clients.filter((c) => c.filingType === "exemption");
  const disclosureClients = clients.filter((c) => c.filingType !== "exemption");

  const update = (id: string, updates: Partial<Client>) => {
    onClientsChange(clients.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const allValid = exemptClients.every(
    (c) => c.exemptionCategory && c.exemptionExplanation?.trim()
  );

  // If no exemption clients, auto-pass
  if (exemptClients.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Exemption Filings</h3>
            <p className="text-gray-500 mb-6">
              All {clients.length} client(s) are filing full disclosures. This step is not required.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={onBack}>Back</Button>
              <Button onClick={onNext} className="bg-[#00274E] hover:bg-[#003d73] px-8">
                Next: Attestation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Exemption Details</h3>
          <p className="text-sm text-gray-500">
            {exemptClients.length} client(s) filing exemptions &middot; {disclosureClients.length} disclosure(s)
          </p>
        </div>
        <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50">
          <Shield className="w-3 h-3 mr-1" /> {exemptClients.length} exemptions
        </Badge>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Exemption Filing Requirements</p>
          <p>Each exemption filing requires a valid category and a supporting explanation. The authorized signer will attest in the next step.</p>
        </div>
      </div>

      {/* Exemption forms */}
      <div className="space-y-4">
        {exemptClients.map((client, idx) => (
          <Card key={client.id}>
            <CardHeader className="py-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600" />
                {client.llcName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Exemption Category *</Label>
                <select
                  value={client.exemptionCategory || ""}
                  onChange={(e) => update(client.id, { exemptionCategory: e.target.value })}
                  className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm"
                >
                  <option value="">Select an exemption category...</option>
                  {EXEMPTION_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs">Explanation / Supporting Facts *</Label>
                <Textarea
                  value={client.exemptionExplanation || ""}
                  onChange={(e) => update(client.id, { exemptionExplanation: e.target.value })}
                  placeholder="Provide a detailed explanation of why this entity qualifies for the selected exemption category..."
                  rows={3}
                  className="text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Authorized Signer Full Name</Label>
                  <Input
                    value={client.exemptionAttestationFullName || ""}
                    onChange={(e) => update(client.id, { exemptionAttestationFullName: e.target.value })}
                    placeholder="Full legal name"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Position / Title</Label>
                  <Input
                    value={client.exemptionAttestationTitle || ""}
                    onChange={(e) => update(client.id, { exemptionAttestationTitle: e.target.value })}
                    placeholder="e.g. Managing Member"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Attestation Date</Label>
                  <Input
                    type="date"
                    value={client.exemptionAttestationDate || new Date().toISOString().split("T")[0]}
                    onChange={(e) => update(client.id, { exemptionAttestationDate: e.target.value })}
                    className="text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button
          onClick={onNext}
          disabled={!allValid}
          className="bg-[#00274E] hover:bg-[#003d73] px-8"
        >
          Next: Attestation
        </Button>
      </div>
    </div>
  );
}
