/**
 * Step 2: Company Info — fill in remaining details for each client LLC
 * Formation date, country/state, address, entity/filing type, DBA, etc.
 */

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Building2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import type { Client } from "../../types";

interface Props {
  clients: Client[];
  onClientsChange: (clients: Client[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function WizardStep2CompanyInfo({ clients, onClientsChange, onNext, onBack }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(clients[0]?.id || null);

  const update = (id: string, updates: Partial<Client>) => {
    onClientsChange(clients.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const isClientValid = (c: Client) => {
    return (
      c.llcName.trim() &&
      c.formationDate &&
      c.countryOfFormation &&
      c.contactEmail
    );
  };

  const allValid = clients.every(isClientValid);

  const validCount = clients.filter(isClientValid).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
          <p className="text-sm text-gray-500">Complete the details for each client LLC</p>
        </div>
        <Badge variant={allValid ? "default" : "outline"} className={allValid ? "bg-green-600" : ""}>
          {validCount}/{clients.length} complete
        </Badge>
      </div>

      <div className="space-y-3">
        {clients.map((client, idx) => {
          const isExpanded = expandedId === client.id;
          const valid = isClientValid(client);

          return (
            <Card key={client.id} className={`transition-shadow ${isExpanded ? "ring-2 ring-[#00274E]/20" : ""}`}>
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : client.id)}
                className="w-full"
              >
                <CardHeader className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className={`w-5 h-5 ${valid ? "text-green-600" : "text-gray-400"}`} />
                      <div className="text-left">
                        <CardTitle className="text-sm">{client.llcName || `Client #${idx + 1}`}</CardTitle>
                        <p className="text-xs text-gray-500">
                          {client.entityType || "domestic"} &middot; {client.filingType || "disclosure"}
                          {!valid && <span className="text-red-500 ml-2">Incomplete</span>}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </CardHeader>
              </button>

              {isExpanded && (
                <CardContent className="pt-0 pb-4 px-4 space-y-4">
                  {/* Row 1: Basics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">Formation Date *</Label>
                      <Input
                        type="date"
                        value={client.formationDate || ""}
                        onChange={(e) => update(client.id, { formationDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Country of Formation *</Label>
                      <Input
                        value={client.countryOfFormation || "United States"}
                        onChange={(e) => update(client.id, { countryOfFormation: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">State of Formation</Label>
                      <Input
                        value={client.stateOfFormation || ""}
                        onChange={(e) => update(client.id, { stateOfFormation: e.target.value })}
                        placeholder="New York"
                      />
                    </div>
                  </div>

                  {/* Row 2: Contact & Filing */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">Contact Email *</Label>
                      <Input
                        type="email"
                        value={client.contactEmail || ""}
                        onChange={(e) => update(client.id, { contactEmail: e.target.value })}
                        placeholder="contact@llc.com"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Fictitious Name / DBA</Label>
                      <Input
                        value={client.fictitiousName || ""}
                        onChange={(e) => update(client.id, { fictitiousName: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">NY DOS ID</Label>
                      <Input
                        value={client.nydosId || ""}
                        onChange={(e) => update(client.id, { nydosId: e.target.value })}
                        placeholder="1234567"
                      />
                    </div>
                  </div>

                  {/* Row 3: Foreign entity fields */}
                  {client.entityType === "foreign" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-medium text-amber-800">Foreign Entity — additional fields required</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Date Authority Filed in NY</Label>
                          <Input
                            type="date"
                            value={client.dateAuthorityFiledNY || ""}
                            onChange={(e) => update(client.id, { dateAuthorityFiledNY: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Row 4: Company Address */}
                  <div>
                    <Label className="text-xs font-medium text-gray-600 mb-2 block">Company Address</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <Input
                          value={client.companyStreetAddress || ""}
                          onChange={(e) => update(client.id, { companyStreetAddress: e.target.value })}
                          placeholder="Street Address"
                        />
                      </div>
                      <Input
                        value={client.companyCity || ""}
                        onChange={(e) => update(client.id, { companyCity: e.target.value })}
                        placeholder="City"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={client.companyState || ""}
                          onChange={(e) => update(client.id, { companyState: e.target.value })}
                          placeholder="State"
                        />
                        <Input
                          value={client.companyZipCode || ""}
                          onChange={(e) => update(client.id, { companyZipCode: e.target.value })}
                          placeholder="Zip"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button
          onClick={onNext}
          disabled={!allValid}
          className="bg-[#00274E] hover:bg-[#003d73] px-8"
        >
          Next: People (CA / BO)
        </Button>
      </div>
    </div>
  );
}
