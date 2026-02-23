import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Download, ChevronDown, Info } from "lucide-react";
import { Client, PaymentSelection } from "../App";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface Step4ReviewSummaryProps {
  clients: Client[];
  onComplete: (selection: PaymentSelection) => void;
  onBack: () => void;
  onUpdateClient?: (clientId: string, updates: Partial<Client>) => void;
}

const FILING_FEE = 398;
const MONITORING_FEE = 249;

// Volume discount percentages (configured in Admin Dashboard)
const TIER1_DISCOUNT = 0;  // No discount for Tier 1 (1-25 filings)
const TIER2_DISCOUNT = 5;  // 5% discount for Tier 2 (26-75 filings)
const TIER3_DISCOUNT = 10; // 10% discount for Tier 3 (76-150 filings)

// Calculate price per filing based on SERVICE TYPE and volume tier with discounts
// Monitoring: $249 flat (data storage only)
// Filing: $398 base with volume discounts (full NYDOS submission)
const getServiceFeePerFiling = (count: number, serviceType: 'monitoring' | 'filing'): number => {
  // Compliance Monitoring: Flat rate, no volume discounts
  if (serviceType === 'monitoring') {
    return MONITORING_FEE; // $249 flat rate
  }
  
  // Bulk Filing: Volume-based tiered pricing with percentage discounts
  if (count <= 25) {
    return FILING_FEE; // Tier 1: $398.00 (no discount)
  }
  if (count <= 75) {
    return FILING_FEE * (1 - TIER2_DISCOUNT / 100);  // Tier 2: 5% volume discount → $378.10
  }
  if (count <= 150) {
    return FILING_FEE * (1 - TIER3_DISCOUNT / 100);  // Tier 3: 10% volume discount → $358.20
  }
  return FILING_FEE; // Custom pricing over 150 (no automatic discount)
};

export default function Step4ReviewSummary({ clients, onComplete, onBack, onUpdateClient }: Step4ReviewSummaryProps) {
  const [selectedClients, setSelectedClients] = useState<Set<string>>(
    new Set(clients.filter(c => c.dataComplete).map(c => c.id))
  );
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());

  const handleToggleClient = (clientId: string) => {
    const newSelected = new Set(selectedClients);
    if (newSelected.has(clientId)) {
      newSelected.delete(clientId);
    } else {
      newSelected.add(clientId);
    }
    setSelectedClients(newSelected);
  };

  const handleToggleAll = () => {
    const readyClients = clients.filter(c => c.dataComplete);
    if (selectedClients.size === readyClients.length) {
      setSelectedClients(new Set());
    } else {
      setSelectedClients(new Set(readyClients.map(c => c.id)));
    }
  };

  const toggleExpanded = (clientId: string) => {
    const newExpanded = new Set(expandedClients);
    if (newExpanded.has(clientId)) {
      newExpanded.delete(clientId);
    } else {
      newExpanded.add(clientId);
    }
    setExpandedClients(newExpanded);
  };

  const handleDownloadRemaining = () => {
    const remaining = clients.filter(c => !selectedClients.has(c.id));
    
    const headers = [
      "LLC Name",
      "Fictitious Name (DBA)",
      "NYDOS ID",
      "EIN",
      "Formation Date",
      "Contact Email",
      "Filing Type",
      "Exemption Category",
      "Exemption Explanation",
    ];
    
    const rows = remaining.map(c => {
      const bo1 = c.beneficialOwners?.[0];
      const bo2 = c.beneficialOwners?.[1];
      const bo3 = c.beneficialOwners?.[2];
      const bo4 = c.beneficialOwners?.[3];
      
      return [
        c.llcName || "",
        c.fictitiousName || "",
        c.nydosId || "",
        c.ein || "",
        c.formationDate || "",
        c.contactEmail || "",
        c.filingType || "",
        c.exemptionCategory || "",
        c.exemptionExplanation || "",
      ].map(field => {
        const str = String(field);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'remaining-clients.csv';
    a.click();
  };

  const handleContinue = () => {
    if (selectedClients.size === 0) {
      alert("Please select at least one filing to continue");
      return;
    }

    // Get selected client objects to check their service types
    const selectedClientObjects = clients.filter(c => selectedClients.has(c.id));
    
    // Determine service type (all clients in a batch should have the same serviceType)
    const serviceType = selectedClientObjects[0]?.serviceType || 'filing';
    
    // Calculate total based on service type and volume
    const pricePerClient = getServiceFeePerFiling(selectedClients.size, serviceType);
    const totalAmount = selectedClients.size * pricePerClient;

    console.log(`Payment calculation: ${selectedClients.size} clients × $${pricePerClient} (${serviceType}) = $${totalAmount}`);

    onComplete({
      clientIds: Array.from(selectedClients),
      totalAmount: totalAmount
    });
  };

  // Calculate counts by service type
  const monitoringCount = clients.filter(c => c.serviceType === 'monitoring').length;
  const filingCount = clients.filter(c => c.serviceType === 'filing').length;
  
  // Calculate pricing for SELECTED clients only (can have mixed service types)
  const selectedClientObjects = clients.filter(c => selectedClients.has(c.id));
  const selectedMonitoringClients = selectedClientObjects.filter(c => c.serviceType === 'monitoring');
  const selectedFilingClients = selectedClientObjects.filter(c => c.serviceType === 'filing');
  
  // CRITICAL: Volume discounts apply to ALL filing entities (25+ filings)
  // Discounts do NOT apply to monitoring clients
  // Count ALL filing clients (both domestic and foreign) for volume discount tiers
  const totalFilingCount = selectedFilingClients.length;
  
  // Calculate total: monitoring is flat $249, filing gets volume discounts at 25+ filings
  const monitoringTotal = selectedMonitoringClients.length * MONITORING_FEE;
  
  // ALL filing entities: get volume discount based on TOTAL filing count (domestic + foreign)
  const filingPricePerClient = getServiceFeePerFiling(totalFilingCount, 'filing');
  const filingTotal = totalFilingCount * filingPricePerClient;
  
  const totalAmount = monitoringTotal + filingTotal;
  
  const readyCount = clients.filter(c => c.dataComplete).length;
  const incompleteCount = clients.filter(c => !c.dataComplete).length;
  
  // Calculate discount information for filing clients
  const basePrice = FILING_FEE;
  const volumeDiscount = totalFilingCount <= 25 ? TIER1_DISCOUNT :
                        totalFilingCount <= 75 ? TIER2_DISCOUNT :
                        totalFilingCount <= 150 ? TIER3_DISCOUNT : 0;
  const savingsPerFilingClient = basePrice - filingPricePerClient;
  const totalFilingSavings = savingsPerFilingClient * totalFilingCount;

  return (
    <Card className="max-w-6xl mx-auto rounded-none border-2 border-[#00274E]">
      <CardHeader className="bg-[#00274E] text-white rounded-none pb-6 border-b-4 border-yellow-400">
        <CardTitle>Step 4 – Review Summary & Select Filings to Pay</CardTitle>
        <CardDescription className="text-gray-300">
          Review all clients, confirm accuracy, and select which filings to pay for now.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600">Total Clients</p>
            <p className="text-2xl text-blue-900">{clients.length}</p>
          </div>
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
            <p className="text-sm text-blue-700">Monitoring</p>
            <p className="text-2xl text-blue-900">{monitoringCount}</p>
            <p className="text-xs text-blue-600">$249 each</p>
          </div>
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
            <p className="text-sm text-yellow-700">Filing</p>
            <p className="text-2xl text-yellow-900">{filingCount}</p>
            <p className="text-xs text-yellow-600">$398 each</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-[#00274E]">Ready to File</p>
            <p className="text-2xl text-[#00274E]">{readyCount}</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-600">Incomplete Data</p>
            <p className="text-2xl text-orange-900">{incompleteCount}</p>
          </div>
        </div>

        {/* Voluntary Filing Notice - appears when domestic entities may not be required to file */}
        {selectedClientObjects.some(c => c.entityType === 'domestic') && (
          <Alert className="mb-6 bg-amber-50 border-2 border-amber-300">
            <AlertDescription>
              <div className="space-y-3">
                <h4 className="font-semibold text-amber-900 text-sm uppercase tracking-wide">
                  ⚠️ Voluntary Filing Notice
                </h4>
                <p className="text-sm text-gray-800 leading-relaxed">
                  The Client acknowledges that, under current NYDOS guidance, certain entities — including domestic U.S. LLCs — may not be required to file under NYLTA at this time.
                </p>
                <p className="text-sm text-gray-800 leading-relaxed">
                  The Platform may permit the Client to voluntarily elect to submit a filing for such entities.
                </p>
                <p className="text-sm text-gray-800 leading-relaxed font-semibold">
                  By authorizing a voluntary filing, the Client expressly acknowledges that:
                </p>
                <ul className="text-sm text-gray-800 leading-relaxed space-y-1 pl-4">
                  <li>• The filing is submitted at the Client's discretion;</li>
                  <li>• The filing is made at the direction of the underlying entity; and</li>
                  <li>• NYLTA.com™ has not represented that such filing is required.</li>
                </ul>
                <p className="text-xs text-gray-700 leading-relaxed italic pt-2">
                  Voluntary filings are treated as client-directed submissions and are subject to the same authorization, fee, and refund terms as required filings.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Alert className="mb-6">
          <AlertDescription>
            <div className="flex justify-between items-center">
              <div>
                <p>Selected: {selectedClients.size} filing(s)</p>
                <p className="text-2xl mt-1">Total: ${totalAmount.toLocaleString()}</p>
                {selectedMonitoringClients.length > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    {selectedMonitoringClients.length} Monitoring × $249 = ${monitoringTotal.toLocaleString()}
                  </p>
                )}
                {selectedFilingClients.length > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    {selectedFilingClients.length} Filing × ${filingPricePerClient.toLocaleString()} = ${filingTotal.toLocaleString()}
                    {volumeDiscount > 0 && <span className="text-green-600 ml-1">(${totalFilingSavings.toLocaleString()} saved)</span>}
                  </p>
                )}
                {selectedFilingClients.length > 0 && totalFilingCount <= 25 && volumeDiscount === 0 && (
                  <p className="text-xs text-gray-500 mt-1 italic">
                    Volume discounts start at 25+ filings • 76+ filings for maximum savings
                  </p>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={handleDownloadRemaining}>
                <Download className="mr-2 h-4 w-4" />
                Download Remaining Clients
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedClients.size === readyCount && readyCount > 0}
                    onCheckedChange={handleToggleAll}
                  />
                </TableHead>
                <TableHead>LLC Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Filing Type</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1.5">
                    Service Level
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs bg-[#00274E] text-white">
                          <p className="text-sm"><strong>Foreign entities</strong> (formed outside USA) <strong>MUST file ($398)</strong>.</p>
                          <p className="text-sm mt-1"><strong>Domestic entities</strong> (USA) can toggle between <strong>Monitoring ($249)</strong> and <strong>Filing ($398)</strong>.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
                <TableHead>Data Complete</TableHead>
                <TableHead className="text-right">Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.flatMap((client) => {
                const rows = [
                  <TableRow key={client.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedClients.has(client.id)}
                        disabled={!client.dataComplete}
                        onCheckedChange={() => handleToggleClient(client.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleExpanded(client.id)}
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${expandedClients.has(client.id) ? 'rotate-180' : ''}`} />
                        </Button>
                        <div>
                          <p>{client.llcName}</p>
                          {client.nydosId && (
                            <p className="text-xs text-gray-500">ID: {client.nydosId}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.dataComplete ? "default" : "secondary"}>
                        {client.dataComplete ? "Ready" : "Missing Owner Info"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.filingType === "exemption" ? "outline" : "default"}>
                        {client.filingType === "disclosure" ? "Beneficial Ownership Disclosure" : "Claims Exemption"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {client.entityType === 'foreign' ? (
                        // Foreign entities MUST file - no choice
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[#00274E] text-white">
                            Filing ($398)
                          </Badge>
                          <span className="text-xs text-gray-500">Required</span>
                        </div>
                      ) : (
                        // Domestic entities can choose
                        <Select
                          value={client.serviceType || "monitoring"}
                          onValueChange={(value: "monitoring" | "filing") => {
                            if (onUpdateClient) {
                              onUpdateClient(client.id, { serviceType: value });
                            }
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monitoring">
                              <div className="flex items-center gap-2">
                                <span>Monitoring</span>
                                <span className="text-xs text-gray-500">($249)</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="filing">
                              <div className="flex items-center gap-2">
                                <span>Filing</span>
                                <span className="text-xs text-gray-500">($398)</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      {client.dataComplete ? (
                        <span className="text-[#00274E]">✓</span>
                      ) : (
                        <span className="text-orange-600">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {client.dataComplete ? (
                        `$${client.serviceType === 'monitoring' ? MONITORING_FEE.toLocaleString() : FILING_FEE.toLocaleString()}`
                      ) : "—"}
                    </TableCell>
                  </TableRow>
                ];
                if (expandedClients.has(client.id)) {
                  rows.push(
                    <TableRow key={`${client.id}-details`}>
                      <TableCell colSpan={6} className="bg-gray-50">
                        <div className="p-4 space-y-4">
                          {/* Basic Company Information */}
                          <div>
                            <p className="text-sm mb-3">Company Information</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-gray-500">LLC Name</p>
                                <p className="text-sm">{client.llcName}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">NYDOS ID</p>
                                <p className="text-sm">{client.nydosId || "—"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">EIN</p>
                                <p className="text-sm">{client.ein || "—"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Formation Date</p>
                                <p className="text-sm">{client.formationDate || "—"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Country of Formation</p>
                                <p className="text-sm">{client.countryOfFormation || "—"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">State of Formation</p>
                                <p className="text-sm">{client.stateOfFormation || "—"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">ZIP Code</p>
                                <p className="text-sm">{client.zipCode || "—"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Contact Email</p>
                                <p className="text-sm">{client.contactEmail || "—"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Filing Type</p>
                                <p className="text-sm">
                                  <Badge variant={client.filingType === "exemption" ? "outline" : "default"}>
                                    {client.filingType === "disclosure" ? "Beneficial Ownership Disclosure" : "Claims Exemption"}
                                  </Badge>
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Data Complete</p>
                                <p className="text-sm">
                                  {client.dataComplete ? (
                                    <span className="text-[#00274E]">✓ Yes</span>
                                  ) : (
                                    <span className="text-orange-600">✗ No</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Exemption Information */}
                          {client.filingType === "exemption" && (
                            <div className="border-t pt-4">
                              <p className="text-sm mb-3">Exemption Information</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500">Exemption Category</p>
                                  <p className="text-sm">{client.exemptionCategory || "—"}</p>
                                </div>
                                {client.exemptionExplanation && (
                                  <div className="col-span-full">
                                    <p className="text-xs text-gray-500">Explanation</p>
                                    <p className="text-sm">{client.exemptionExplanation}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Company Applicants (for both disclosure AND exemption filings) */}
                          {client.companyApplicants && client.companyApplicants.length > 0 && (
                            <div className="border-t pt-4">
                              <p className="text-sm mb-3">
                                Company Applicants ({client.companyApplicants.length})
                              </p>
                              <div className="space-y-4">
                                {client.companyApplicants.map((applicant: any, index: number) => {
                                  // Parse address if pipe-delimited
                                  const addressParts = applicant.address?.split('|') || [];
                                  const formattedAddress = addressParts.length === 5
                                    ? `${addressParts[0]}, ${addressParts[1]}, ${addressParts[2]} ${addressParts[3]}, ${addressParts[4]}`
                                    : applicant.address || "—";

                                  return (
                                    <div key={applicant.id || index} className="border rounded-lg p-4 bg-white">
                                      <p className="text-sm mb-3">
                                        <Badge variant="secondary">Applicant {index + 1}</Badge>
                                      </p>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-xs text-gray-500">Full Name</p>
                                          <p className="text-sm">{applicant.fullName || "—"}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">Date of Birth</p>
                                          <p className="text-sm">{applicant.dob || "—"}</p>
                                        </div>
                                        <div className="col-span-full">
                                          <p className="text-xs text-gray-500">Residential Address</p>
                                          <p className="text-sm">{formattedAddress}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">ID Type</p>
                                          <p className="text-sm">{applicant.idType || "—"}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">ID Number</p>
                                          <p className="text-sm">{applicant.idNumber || "—"}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">ID Issuing Country</p>
                                          <p className="text-sm">{applicant.issuingCountry || "—"}</p>
                                        </div>
                                        {applicant.issuingState && (
                                          <div>
                                            <p className="text-xs text-gray-500">ID Issuing State/Province</p>
                                            <p className="text-sm">{applicant.issuingState}</p>
                                          </div>
                                        )}
                                        {applicant.role && (
                                          <div>
                                            <p className="text-xs text-gray-500">Role</p>
                                            <p className="text-sm">{applicant.role}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Beneficial Owners */}
                          {client.filingType === "disclosure" && (
                            <div className="border-t pt-4">
                              <p className="text-sm mb-3">
                                Beneficial Owners ({client.beneficialOwners?.length || 0})
                              </p>
                              {client.beneficialOwners && client.beneficialOwners.length > 0 ? (
                                <div className="space-y-4">
                                  {client.beneficialOwners.map((owner, index) => {
                                    // Parse address if pipe-delimited
                                    const addressParts = owner.address?.split('|') || [];
                                    const formattedAddress = addressParts.length === 5
                                      ? `${addressParts[0]}, ${addressParts[1]}, ${addressParts[2]} ${addressParts[3]}, ${addressParts[4]}`
                                      : owner.address || "—";

                                    return (
                                      <div key={owner.id} className="border rounded-lg p-4 bg-white">
                                        <p className="text-sm mb-3">
                                          <Badge variant="secondary">Owner {index + 1}</Badge>
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-xs text-gray-500">Full Name</p>
                                            <p className="text-sm">{owner.fullName || "—"}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs text-gray-500">Date of Birth</p>
                                            <p className="text-sm">{owner.dob || "—"}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs text-gray-500">Address Type</p>
                                            <p className="text-sm">{owner.addressType || "—"}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs text-gray-500">Ownership Percentage</p>
                                            <p className="text-sm">{owner.ownershipPercentage ? `${owner.ownershipPercentage}%` : "—"}</p>
                                          </div>
                                          <div className="col-span-full">
                                            <p className="text-xs text-gray-500">{owner.addressType === "Business" ? "Business Address" : "Residential Address"}</p>
                                            <p className="text-sm">{formattedAddress}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs text-gray-500">ID Type</p>
                                            <p className="text-sm">{owner.idType || "—"}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs text-gray-500">ID Number</p>
                                            <p className="text-sm">{owner.idNumber || "—"}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs text-gray-500">ID Issuing Country</p>
                                            <p className="text-sm">{owner.issuingCountry || "—"}</p>
                                          </div>
                                          {owner.issuingState && (
                                            <div>
                                              <p className="text-xs text-gray-500">ID Issuing State/Province</p>
                                              <p className="text-sm">{owner.issuingState}</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <Alert>
                                  <AlertDescription className="text-sm text-orange-600">
                                    No beneficial owners added yet. This client cannot be filed until at least one beneficial owner is added.
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
                return rows;
              })}
            </TableBody>
          </Table>
        </div>

        {incompleteCount > 0 && (
          <Alert className="mt-4">
            <AlertDescription>
              <p className="text-sm text-orange-600">
                {incompleteCount} client(s) have incomplete data and cannot be selected for payment. 
                You can go back to complete their information or download the list for later.
              </p>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleContinue} size="lg" disabled={selectedClients.size === 0}>
            Continue to Payment ({selectedClients.size} filing{selectedClients.size !== 1 ? 's' : ''})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}