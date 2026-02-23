/**
 * Step 3: People — Company Applicants & Beneficial Owners
 * CA fields hidden when filingType === 'exemption'.
 * Up to 3 CAs, up to 9 BOs per client.
 */

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Plus, Trash2, Users, UserPlus, ChevronDown, ChevronUp, Building2 } from "lucide-react";
import type { Client, CompanyApplicant, BeneficialOwner } from "../../types";

interface Props {
  clients: Client[];
  onClientsChange: (clients: Client[]) => void;
  onNext: () => void;
  onBack: () => void;
}

function genId() {
  return `p_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

function emptyCA(): CompanyApplicant {
  return {
    id: genId(), fullName: "", dob: "", idType: "", idNumber: "",
    issuingCountry: "United States", issuingState: "",
  };
}

function emptyBO(): BeneficialOwner {
  return {
    id: genId(), fullName: "", dob: "", ownershipPercentage: "",
    position: "", idType: "", idNumber: "",
    issuingCountry: "United States", issuingState: "",
  };
}

export default function WizardStep3People({ clients, onClientsChange, onNext, onBack }: Props) {
  const [activeClientId, setActiveClientId] = useState<string | null>(clients[0]?.id || null);

  const update = (id: string, updates: Partial<Client>) => {
    onClientsChange(clients.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  // ── CA helpers ──
  const addCA = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client || (client.companyApplicants?.length || 0) >= 3) return;
    update(clientId, { companyApplicants: [...(client.companyApplicants || []), emptyCA()] });
  };

  const updateCA = (clientId: string, caId: string, updates: Partial<CompanyApplicant>) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    update(clientId, {
      companyApplicants: (client.companyApplicants || []).map((ca) =>
        ca.id === caId ? { ...ca, ...updates } : ca
      ),
    });
  };

  const removeCA = (clientId: string, caId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    update(clientId, { companyApplicants: (client.companyApplicants || []).filter((ca) => ca.id !== caId) });
  };

  // ── BO helpers ──
  const addBO = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client || (client.beneficialOwners?.length || 0) >= 9) return;
    update(clientId, { beneficialOwners: [...(client.beneficialOwners || []), emptyBO()] });
  };

  const updateBO = (clientId: string, boId: string, updates: Partial<BeneficialOwner>) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    update(clientId, {
      beneficialOwners: (client.beneficialOwners || []).map((bo) =>
        bo.id === boId ? { ...bo, ...updates } : bo
      ),
    });
  };

  const removeBO = (clientId: string, boId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    update(clientId, { beneficialOwners: (client.beneficialOwners || []).filter((bo) => bo.id !== boId) });
  };

  // Check disclosure clients have at least 1 BO
  const allValid = clients.every((c) => {
    if (c.filingType === "exemption") return true;
    return (c.beneficialOwners?.length || 0) >= 1 &&
      c.beneficialOwners!.every((bo) => bo.fullName.trim());
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">People: Company Applicants & Beneficial Owners</h3>
        <p className="text-sm text-gray-500">Add CAs (up to 3) and BOs (up to 9) per client. CA section hidden for exemption filings.</p>
      </div>

      {/* Client selector tabs */}
      <div className="flex flex-wrap gap-2">
        {clients.map((c, idx) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveClientId(c.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              activeClientId === c.id
                ? "bg-[#00274E] text-white border-[#00274E]"
                : "bg-white text-gray-700 border-gray-200 hover:border-[#00274E]"
            }`}
          >
            {c.llcName || `Client #${idx + 1}`}
            {c.filingType === "exemption" && (
              <Badge variant="outline" className="ml-2 text-xs py-0">Exempt</Badge>
            )}
          </button>
        ))}
      </div>

      {/* Active client detail */}
      {clients.filter((c) => c.id === activeClientId).map((client) => (
        <div key={client.id} className="space-y-4">
          {/* Company Applicants — hidden for exemption */}
          {client.filingType !== "exemption" && (
            <Card>
              <CardHeader className="py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  Company Applicants ({client.companyApplicants?.length || 0}/3)
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addCA(client.id)}
                  disabled={(client.companyApplicants?.length || 0) >= 3}
                >
                  <Plus className="w-3 h-3 mr-1" /> Add CA
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {(!client.companyApplicants || client.companyApplicants.length === 0) && (
                  <p className="text-sm text-gray-400 text-center py-4">No company applicants added yet.</p>
                )}
                {(client.companyApplicants || []).map((ca, caIdx) => (
                  <div key={ca.id} className="border rounded-lg p-3 space-y-3 bg-blue-50/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-700">CA {caIdx + 1}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeCA(client.id, ca.id)} className="text-red-400 h-7">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Full Name</Label>
                        <Input value={ca.fullName} onChange={(e) => updateCA(client.id, ca.id, { fullName: e.target.value })} placeholder="Jane Doe" className="h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Date of Birth</Label>
                        <Input type="date" value={ca.dob} onChange={(e) => updateCA(client.id, ca.id, { dob: e.target.value })} className="h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Title / Role</Label>
                        <Input value={ca.titleOrRole || ""} onChange={(e) => updateCA(client.id, ca.id, { titleOrRole: e.target.value })} placeholder="Manager" className="h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Street Address</Label>
                        <Input value={ca.streetAddress || ""} onChange={(e) => updateCA(client.id, ca.id, { streetAddress: e.target.value })} className="h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">City</Label>
                        <Input value={ca.city || ""} onChange={(e) => updateCA(client.id, ca.id, { city: e.target.value })} className="h-8 text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div>
                          <Label className="text-xs">State</Label>
                          <Input value={ca.state || ""} onChange={(e) => updateCA(client.id, ca.id, { state: e.target.value })} className="h-8 text-sm" />
                        </div>
                        <div>
                          <Label className="text-xs">Zip</Label>
                          <Input value={ca.zipCode || ""} onChange={(e) => updateCA(client.id, ca.id, { zipCode: e.target.value })} className="h-8 text-sm" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">ID Type</Label>
                        <select value={ca.idType} onChange={(e) => updateCA(client.id, ca.id, { idType: e.target.value })} className="w-full h-8 rounded border border-gray-200 px-2 text-sm">
                          <option value="">Select...</option>
                          <option value="State-Issued ID">State-Issued ID</option>
                          <option value="US Passport">US Passport</option>
                          <option value="Foreign Passport">Foreign Passport</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs">ID Number</Label>
                        <Input value={ca.idNumber} onChange={(e) => updateCA(client.id, ca.id, { idNumber: e.target.value })} className="h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">ID Expiration</Label>
                        <Input type="date" value={ca.idExpirationDate || ""} onChange={(e) => updateCA(client.id, ca.id, { idExpirationDate: e.target.value })} className="h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Issuing Country</Label>
                        <Input value={ca.issuingCountry} onChange={(e) => updateCA(client.id, ca.id, { issuingCountry: e.target.value })} className="h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Issuing State</Label>
                        <Input value={ca.issuingState} onChange={(e) => updateCA(client.id, ca.id, { issuingState: e.target.value })} className="h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Email</Label>
                        <Input type="email" value={ca.email || ""} onChange={(e) => updateCA(client.id, ca.id, { email: e.target.value })} className="h-8 text-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Beneficial Owners */}
          <Card>
            <CardHeader className="py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                Beneficial Owners ({client.beneficialOwners?.length || 0}/9)
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addBO(client.id)}
                disabled={(client.beneficialOwners?.length || 0) >= 9}
              >
                <Plus className="w-3 h-3 mr-1" /> Add BO
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {(!client.beneficialOwners || client.beneficialOwners.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-4">
                  {client.filingType === "exemption"
                    ? "BOs optional for exemption filings."
                    : "At least 1 beneficial owner required."}
                </p>
              )}
              {(client.beneficialOwners || []).map((bo, boIdx) => (
                <div key={bo.id} className="border rounded-lg p-3 space-y-3 bg-green-50/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-green-700">BO {boIdx + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeBO(client.id, bo.id)} className="text-red-400 h-7">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Full Name *</Label>
                      <Input value={bo.fullName} onChange={(e) => updateBO(client.id, bo.id, { fullName: e.target.value })} placeholder="John Smith" className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Date of Birth</Label>
                      <Input type="date" value={bo.dob} onChange={(e) => updateBO(client.id, bo.id, { dob: e.target.value })} className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Ownership %</Label>
                      <Input value={bo.ownershipPercentage || ""} onChange={(e) => updateBO(client.id, bo.id, { ownershipPercentage: e.target.value })} placeholder="25" className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Position / Title</Label>
                      <Input value={bo.position || ""} onChange={(e) => updateBO(client.id, bo.id, { position: e.target.value })} placeholder="CEO" className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Street Address</Label>
                      <Input value={bo.streetAddress || ""} onChange={(e) => updateBO(client.id, bo.id, { streetAddress: e.target.value })} className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">City</Label>
                      <Input value={bo.city || ""} onChange={(e) => updateBO(client.id, bo.id, { city: e.target.value })} className="h-8 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div>
                        <Label className="text-xs">State</Label>
                        <Input value={bo.state || ""} onChange={(e) => updateBO(client.id, bo.id, { state: e.target.value })} className="h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Zip</Label>
                        <Input value={bo.zipCode || ""} onChange={(e) => updateBO(client.id, bo.id, { zipCode: e.target.value })} className="h-8 text-sm" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Country</Label>
                      <Input value={bo.country || "United States"} onChange={(e) => updateBO(client.id, bo.id, { country: e.target.value })} className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Address Type</Label>
                      <select value={bo.addressType || ""} onChange={(e) => updateBO(client.id, bo.id, { addressType: e.target.value as any })} className="w-full h-8 rounded border border-gray-200 px-2 text-sm">
                        <option value="">Select...</option>
                        <option value="Residential">Residential</option>
                        <option value="Business">Business</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">ID Type</Label>
                      <select value={bo.idType || ""} onChange={(e) => updateBO(client.id, bo.id, { idType: e.target.value })} className="w-full h-8 rounded border border-gray-200 px-2 text-sm">
                        <option value="">Select...</option>
                        <option value="State-Issued ID">State-Issued ID</option>
                        <option value="US Passport">US Passport</option>
                        <option value="Foreign Passport">Foreign Passport</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">ID Number</Label>
                      <Input value={bo.idNumber || ""} onChange={(e) => updateBO(client.id, bo.id, { idNumber: e.target.value })} className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">ID Expiration</Label>
                      <Input type="date" value={bo.idExpirationDate || ""} onChange={(e) => updateBO(client.id, bo.id, { idExpirationDate: e.target.value })} className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Issuing Country</Label>
                      <Input value={bo.issuingCountry || "United States"} onChange={(e) => updateBO(client.id, bo.id, { issuingCountry: e.target.value })} className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Issuing State</Label>
                      <Input value={bo.issuingState || ""} onChange={(e) => updateBO(client.id, bo.id, { issuingState: e.target.value })} className="h-8 text-sm" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button
          onClick={onNext}
          disabled={!allValid}
          className="bg-[#00274E] hover:bg-[#003d73] px-8"
        >
          Next: Exemption
        </Button>
      </div>
    </div>
  );
}
