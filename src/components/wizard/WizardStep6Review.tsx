/**
 * Step 6: Review & Batch Submit
 * Shows full summary of all clients, then submits each to GHL
 * with real-time progress tracking.
 */

import { useMemo } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  CheckCircle2, XCircle, Loader2, Send, Building2, Users, Shield,
  PenTool, AlertTriangle, FileText
} from "lucide-react";
import type { Client } from "../../types";
import type { AttestationData, SubmissionProgress } from "./WizardTypes";
import {
  createClientContact,
  sendOrderConfirmation,
  convertWizardClientToContactData,
} from "../../utils/highlevelContacts";

interface Props {
  clients: Client[];
  attestation: AttestationData;
  firmContactId: string;
  firmName: string;
  firmConfirmation: string;
  progress: SubmissionProgress;
  onProgressChange: (p: SubmissionProgress) => void;
  onBack: () => void;
  onComplete: () => void;
}

export default function WizardStep6Review({
  clients,
  attestation,
  firmContactId,
  firmName,
  firmConfirmation,
  progress,
  onProgressChange,
  onBack,
  onComplete,
}: Props) {
  const disclosureCount = clients.filter((c) => c.filingType !== "exemption").length;
  const exemptionCount = clients.filter((c) => c.filingType === "exemption").length;
  const totalBOs = clients.reduce((sum, c) => sum + (c.beneficialOwners?.length || 0), 0);
  const totalCAs = clients.reduce((sum, c) => sum + (c.companyApplicants?.length || 0), 0);

  // Stable IDs that don't change across re-renders
  const batchId = useMemo(() => `BATCH-${firmConfirmation}-${Date.now().toString(36).toUpperCase()}`, [firmConfirmation]);
  const orderNumber = useMemo(() => `ORD-${Date.now().toString(36).toUpperCase()}`, []);

  // ── Submit all clients ──
  const handleSubmit = async () => {
    const newProgress: SubmissionProgress = {
      total: clients.length,
      completed: 0,
      failed: 0,
      currentClient: "",
      status: "submitting",
      errors: [],
      contactIds: [],
    };
    onProgressChange(newProgress);

    const contactIds: string[] = [];
    const errors: Array<{ clientName: string; error: string }> = [];

    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      newProgress.currentClient = client.llcName;
      newProgress.completed = i;
      onProgressChange({ ...newProgress });

      try {
        // Convert wizard client data to contact data format
        const contactData = convertWizardClientToContactData(client);

        // Apply attestation to every client
        const fullContactData = {
          ...contactData,
          parentFirmId: firmContactId,
          parentFirmName: firmName,
          parentFirmConfirmation: firmConfirmation,
          batchId,
          orderNumber,
          submissionNumber: `${orderNumber}-${(i + 1).toString().padStart(3, "0")}`,
          attestationSignature: attestation.signature,
          attestationFullName: attestation.fullName,
          attestationInitials: attestation.initials,
          attestationTitle: attestation.title,
          attestationDate: attestation.date,
        };

        const contactId = await createClientContact(fullContactData);
        contactIds.push(contactId);

        // Small delay between submissions (rate-limit protection)
        if (i < clients.length - 1) {
          await new Promise((r) => setTimeout(r, 200));
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push({ clientName: client.llcName, error: msg });
        newProgress.failed++;
        console.error(`Failed to submit ${client.llcName}:`, msg);
      }
    }

    // Send order confirmation to firm
    try {
      await sendOrderConfirmation({
        firmContactId,
        firmName,
        confirmationNumber: firmConfirmation,
        orderNumber,
        submissionDate: new Date().toISOString().split("T")[0],
        batchId,
        amountPaid: 0, // Calculated server-side or in payment step
        clientCount: clients.length,
        serviceType: "filing",
        contactEmail: "",
        clients: clients.map((c) => ({
          llcName: c.llcName,
          serviceType: c.serviceType || "filing",
          fee: c.fee || 0,
          filingType: c.filingType || "disclosure",
        })),
      });
    } catch (err: unknown) {
      console.error("Failed to send order confirmation:", err);
    }

    const finalProgress: SubmissionProgress = {
      total: clients.length,
      completed: clients.length,
      failed: errors.length,
      currentClient: "",
      status: errors.length === clients.length ? "error" : "complete",
      errors,
      contactIds,
    };
    onProgressChange(finalProgress);
  };

  const pct = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Review & Submit</h3>
        <p className="text-sm text-gray-500">
          Verify all data before submitting {clients.length} client(s) to GoHighLevel.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <Building2 className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="text-xl font-bold text-blue-800">{clients.length}</p>
          <p className="text-xs text-blue-600">Clients</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <FileText className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-xl font-bold text-green-800">{disclosureCount}</p>
          <p className="text-xs text-green-600">Disclosures</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center">
          <Shield className="w-5 h-5 text-amber-600 mx-auto mb-1" />
          <p className="text-xl font-bold text-amber-800">{exemptionCount}</p>
          <p className="text-xs text-amber-600">Exemptions</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <p className="text-xl font-bold text-purple-800">{totalBOs}</p>
          <p className="text-xs text-purple-600">BOs</p>
        </div>
        <div className="bg-indigo-50 rounded-lg p-3 text-center">
          <PenTool className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
          <p className="text-xl font-bold text-indigo-800">{totalCAs}</p>
          <p className="text-xs text-indigo-600">CAs</p>
        </div>
      </div>

      {/* Attestation Summary */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <PenTool className="w-4 h-4" /> Attestation
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2 text-sm text-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div><span className="text-gray-500">Name:</span> {attestation.fullName}</div>
            <div><span className="text-gray-500">Initials:</span> {attestation.initials}</div>
            <div><span className="text-gray-500">Title:</span> {attestation.title}</div>
            <div><span className="text-gray-500">Date:</span> {attestation.date}</div>
          </div>
        </CardContent>
      </Card>

      {/* Client List Summary */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm">Client Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {clients.map((c, idx) => (
              <div key={c.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs w-6">{idx + 1}.</span>
                  <span className="font-medium">{c.llcName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {c.entityType || "domestic"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs ${c.filingType === "exemption" ? "text-amber-700 border-amber-300" : "text-green-700 border-green-300"}`}
                  >
                    {c.filingType || "disclosure"}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {c.beneficialOwners?.length || 0} BO / {c.companyApplicants?.length || 0} CA
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracker */}
      {progress.status !== "idle" && (
        <Card className={progress.status === "error" ? "border-red-300" : progress.status === "complete" ? "border-green-300" : "border-blue-300"}>
          <CardContent className="py-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {progress.status === "submitting" && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
                {progress.status === "complete" && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                {progress.status === "error" && <XCircle className="w-5 h-5 text-red-600" />}
                <span className="font-semibold">
                  {progress.status === "submitting" && `Submitting: ${progress.currentClient}...`}
                  {progress.status === "complete" && `Submission Complete!`}
                  {progress.status === "error" && `Submission Failed`}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {progress.completed}/{progress.total}
                {progress.failed > 0 && <span className="text-red-500 ml-1">({progress.failed} failed)</span>}
              </span>
            </div>

            <Progress value={pct} className="h-3" />

            {/* Error list */}
            {progress.errors.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-700 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Errors:
                </p>
                {progress.errors.map((err, idx) => (
                  <div key={idx} className="text-xs bg-red-50 border border-red-200 rounded p-2">
                    <span className="font-medium">{err.clientName}:</span> {err.error}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={progress.status === "submitting"}
        >
          Back
        </Button>
        <div className="flex gap-3">
          {progress.status === "idle" && (
            <Button
              onClick={handleSubmit}
              size="lg"
              className="bg-green-600 hover:bg-green-700 px-8"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit {clients.length} Client(s) to GHL
            </Button>
          )}
          {progress.status === "complete" && (
            <Button
              onClick={onComplete}
              size="lg"
              className="bg-[#00274E] hover:bg-[#003d73] px-8"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Done — Return to Dashboard
            </Button>
          )}
          {progress.status === "error" && (
            <>
              <Button variant="outline" onClick={handleSubmit}>
                Retry Failed
              </Button>
              <Button onClick={onComplete} className="bg-[#00274E]">
                Continue to Dashboard
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}