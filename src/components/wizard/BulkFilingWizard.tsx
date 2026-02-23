/**
 * BulkFilingWizard — 6-step orchestrator
 *
 * Steps:
 *   1. CSV Upload / Manual Add
 *   2. Company Info
 *   3. People (CA / BO)
 *   4. Exemption Handling
 *   5. Attestation (signature canvas)
 *   6. Review & Batch Submit (with progress tracking)
 *
 * State persisted to sessionStorage so refreshes don't lose data.
 */

import { useState, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import type { Client } from "../../types";
import type { WizardStep, AttestationData, SubmissionProgress } from "./WizardTypes";
import WizardStepIndicator from "./WizardStepIndicator";
import WizardStep1Upload from "./WizardStep1Upload";
import WizardStep2CompanyInfo from "./WizardStep2CompanyInfo";
import WizardStep3People from "./WizardStep3People";
import WizardStep4Exemption from "./WizardStep4Exemption";
import WizardStep5Attestation from "./WizardStep5Attestation";
import WizardStep6Review from "./WizardStep6Review";

interface Props {
  firmContactId: string;
  firmName: string;
  firmConfirmation: string;
  onBack: () => void;
  onComplete: () => void;
}

const STORAGE_KEY = "nylta_bulk_wizard_state";

function loadSaved(): { clients: Client[]; step: WizardStep; attestation: AttestationData | null } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(clients: Client[], step: WizardStep, attestation: AttestationData | null) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ clients, step, attestation }));
  } catch {
    // quota exceeded — silently ignore
  }
}

export default function BulkFilingWizard({
  firmContactId,
  firmName,
  firmConfirmation,
  onBack,
  onComplete,
}: Props) {
  const saved = loadSaved();
  const [step, setStep] = useState<WizardStep>(saved?.step || 1);
  const [clients, setClients] = useState<Client[]>(saved?.clients || []);
  const [attestation, setAttestation] = useState<AttestationData | null>(saved?.attestation || null);
  const [progress, setProgress] = useState<SubmissionProgress>({
    total: 0,
    completed: 0,
    failed: 0,
    currentClient: "",
    status: "idle",
    errors: [],
    contactIds: [],
  });

  // Persist to sessionStorage
  useEffect(() => {
    saveState(clients, step, attestation);
  }, [clients, step, attestation]);

  const completedSteps = new Set<number>();
  if (clients.length > 0) completedSteps.add(1);
  if (step > 2) completedSteps.add(2);
  if (step > 3) completedSteps.add(3);
  if (step > 4) completedSteps.add(4);
  if (step > 5) completedSteps.add(5);
  if (progress.status === "complete") completedSteps.add(6);

  const handleComplete = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    onComplete();
  }, [onComplete]);

  const handleBack = () => {
    if (step === 1) {
      onBack();
    } else {
      setStep((s) => (s - 1) as WizardStep);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-yellow-400 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                alt="NYLTA.com Logo"
                className="h-8 sm:h-10 w-auto"
              />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Bulk Filing Wizard</h1>
                <p className="text-xs text-gray-500">
                  {firmName} &middot; {firmConfirmation}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit
            </Button>
          </div>

          {/* Step Indicator */}
          <WizardStepIndicator
            current={step}
            completedSteps={completedSteps}
            onStepClick={(s) => {
              if (s < step || completedSteps.has(s)) setStep(s);
            }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 1 && (
          <WizardStep1Upload
            clients={clients}
            onClientsChange={setClients}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <WizardStep2CompanyInfo
            clients={clients}
            onClientsChange={setClients}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <WizardStep3People
            clients={clients}
            onClientsChange={setClients}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <WizardStep4Exemption
            clients={clients}
            onClientsChange={setClients}
            onNext={() => setStep(5)}
            onBack={() => setStep(3)}
          />
        )}

        {step === 5 && (
          <WizardStep5Attestation
            attestation={attestation}
            onAttestationChange={setAttestation}
            clientCount={clients.length}
            onNext={() => setStep(6)}
            onBack={() => setStep(4)}
          />
        )}

        {step === 6 && attestation && (
          <WizardStep6Review
            clients={clients}
            attestation={attestation}
            firmContactId={firmContactId}
            firmName={firmName}
            firmConfirmation={firmConfirmation}
            progress={progress}
            onProgressChange={setProgress}
            onBack={() => setStep(5)}
            onComplete={handleComplete}
          />
        )}
      </main>
    </div>
  );
}
