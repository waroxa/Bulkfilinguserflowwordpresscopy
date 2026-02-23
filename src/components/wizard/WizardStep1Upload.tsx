/**
 * Step 1: CSV Upload / Manual Add Clients
 * Parses CSV into Client[], or allows manual entry of basic LLC info.
 */

import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Upload, Plus, Trash2, Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Client } from "../../types";
import { CSV_HEADER_MAP } from "./WizardTypes";

interface Props {
  clients: Client[];
  onClientsChange: (clients: Client[]) => void;
  onNext: () => void;
}

function generateId(): string {
  return `c_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

function emptyClient(): Client {
  return {
    id: generateId(),
    llcName: "",
    countryOfFormation: "United States",
    entityType: "domestic",
    filingType: "disclosure",
    serviceType: "filing",
  };
}

function downloadTemplate() {
  const headers = [
    "LLC Legal Name",
    "NY DOS ID",
    "EIN (12-3456789)",
    "Formation Date (YYYY-MM-DD)",
    "Country of Formation",
    "State (if USA)",
    "Entity Type (domestic/foreign)",
    "Contact Email",
    "Filing Type (disclosure/exemption)",
    "Exemption Category",
    "Exemption Explanation",
    "Fictitious Name / DBA",
    "Date Authority Filed in NY",
    "Company Street Address",
    "Company City",
    "Company State",
    "Company Zip Code",
    "Company Country",
  ];

  const sampleRow = [
    "Acme Solutions LLC",
    "1234567",
    "12-3456789",
    "2020-01-15",
    "United States",
    "New York",
    "domestic",
    "contact@acme.com",
    "disclosure",
    "",
    "",
    "",
    "",
    "123 Main St",
    "New York",
    "NY",
    "10001",
    "United States",
  ];

  const csv = [headers.join(","), sampleRow.join(",")].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "NYLTA_Bulk_Filing_Template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function parseCSV(text: string): Client[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const clients: Client[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Handle quoted commas
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const ch of lines[i]) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { values.push(current.trim()); current = ""; continue; }
      current += ch;
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ""; });

    const client: Client = {
      id: generateId(),
      llcName: "",
      countryOfFormation: "United States",
      entityType: "domestic",
      filingType: "disclosure",
      serviceType: "filing",
    };

    // Map CSV headers to Client fields
    for (const [csvHeader, fieldName] of Object.entries(CSV_HEADER_MAP)) {
      const val = row[csvHeader];
      if (val && val.trim()) {
        (client as any)[fieldName] = val.trim();
      }
    }

    // Normalize entityType & filingType
    if (client.entityType) {
      client.entityType = client.entityType.toLowerCase() === "foreign" ? "foreign" : "domestic";
    }
    if (client.filingType) {
      client.filingType = client.filingType.toLowerCase() === "exemption" ? "exemption" : "disclosure";
    }

    // Only add if we have a name
    if (client.llcName) {
      clients.push(client);
    }
  }

  return clients;
}

export default function WizardStep1Upload({ clients, onClientsChange, onNext }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseCount, setParseCount] = useState<number | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError(null);
    setParseCount(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          setParseError("No valid rows found. Make sure the CSV has an 'LLC Legal Name' column.");
          return;
        }
        onClientsChange([...clients, ...parsed]);
        setParseCount(parsed.length);
      } catch (err) {
        setParseError("Failed to parse CSV file. Please check the format.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addManualClient = () => {
    onClientsChange([...clients, emptyClient()]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    onClientsChange(clients.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const removeClient = (id: string) => {
    onClientsChange(clients.filter((c) => c.id !== id));
  };

  const allValid = clients.length > 0 && clients.every((c) => c.llcName.trim());

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileSpreadsheet className="w-5 h-5 text-[#00274E]" />
            Upload CSV or Add Clients Manually
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="flex items-center justify-center gap-2 w-full py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#00274E] hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-gray-600">Drop CSV file or click to browse</span>
              </label>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={downloadTemplate} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Template
              </Button>
              <Button onClick={addManualClient} className="flex items-center gap-2 bg-[#00274E]">
                <Plus className="w-4 h-4" />
                Add Client Manually
              </Button>
            </div>
          </div>

          {parseError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{parseError}</p>
            </div>
          )}
          {parseCount !== null && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <p className="text-sm text-green-700">Successfully parsed {parseCount} client(s) from CSV.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client List */}
      {clients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Clients ({clients.length})</span>
              <Badge variant="outline">{clients.filter((c) => c.filingType === "exemption").length} exemptions</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {clients.map((client, idx) => (
                <div key={client.id} className="border rounded-lg p-4 space-y-3 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Client #{idx + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeClient(client.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500">LLC Legal Name *</Label>
                      <Input
                        value={client.llcName}
                        onChange={(e) => updateClient(client.id, { llcName: e.target.value })}
                        placeholder="Acme Solutions LLC"
                        className={!client.llcName.trim() ? "border-red-300" : ""}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">NY DOS ID</Label>
                      <Input
                        value={client.nydosId || ""}
                        onChange={(e) => updateClient(client.id, { nydosId: e.target.value })}
                        placeholder="1234567"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">EIN</Label>
                      <Input
                        value={client.ein || ""}
                        onChange={(e) => updateClient(client.id, { ein: e.target.value })}
                        placeholder="12-3456789"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Filing Type</Label>
                      <select
                        value={client.filingType || "disclosure"}
                        onChange={(e) => updateClient(client.id, { filingType: e.target.value as any })}
                        className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm"
                      >
                        <option value="disclosure">Disclosure (Full Filing)</option>
                        <option value="exemption">Exemption</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Entity Type</Label>
                      <select
                        value={client.entityType || "domestic"}
                        onChange={(e) => updateClient(client.id, { entityType: e.target.value as any })}
                        className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm"
                      >
                        <option value="domestic">Domestic</option>
                        <option value="foreign">Foreign</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Contact Email</Label>
                      <Input
                        type="email"
                        value={client.contactEmail || ""}
                        onChange={(e) => updateClient(client.id, { contactEmail: e.target.value })}
                        placeholder="contact@llc.com"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!allValid}
          size="lg"
          className="bg-[#00274E] hover:bg-[#003d73] px-8"
        >
          Next: Company Details
        </Button>
      </div>
    </div>
  );
}
