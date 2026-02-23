/**
 * Step 5: Attestation — Signature canvas, full name, initials, title, date
 * Applied to all clients in the batch.
 * Uses HTML Canvas for signature capture (no konva).
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eraser, PenTool, CheckCircle2 } from "lucide-react";
import type { AttestationData } from "./WizardTypes";

interface Props {
  attestation: AttestationData | null;
  onAttestationChange: (att: AttestationData) => void;
  clientCount: number;
  onNext: () => void;
  onBack: () => void;
}

export default function WizardStep5Attestation({
  attestation,
  onAttestationChange,
  clientCount,
  onNext,
  onBack,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [fullName, setFullName] = useState(attestation?.fullName || "");
  const [initials, setInitials] = useState(attestation?.initials || "");
  const [title, setTitle] = useState(attestation?.title || "");
  const [date, setDate] = useState(attestation?.date || new Date().toISOString().split("T")[0]);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1a1a2e";

    // Restore existing signature
    if (attestation?.signature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawn(true);
      };
      img.src = attestation.signature;
    }
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
  };

  const getSignatureData = useCallback((): string => {
    return canvasRef.current?.toDataURL("image/png") || "";
  }, []);

  const isValid = hasDrawn && fullName.trim() && initials.trim() && title.trim() && date;

  const handleNext = () => {
    const sig = getSignatureData();
    onAttestationChange({
      signature: sig,
      fullName: fullName.trim(),
      initials: initials.trim(),
      title: title.trim(),
      date,
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Attestation & Signature</h3>
        <p className="text-sm text-gray-500">
          This attestation applies to all {clientCount} client(s) in this batch submission.
        </p>
      </div>

      {/* Consent text */}
      <Card>
        <CardContent className="py-4">
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-2 max-h-48 overflow-y-auto border">
            <p className="font-semibold">Consent & Attestation</p>
            <p>
              I hereby certify that the information provided in this Beneficial Ownership Information
              Report is true, correct, and complete to the best of my knowledge. I understand that
              willfully providing false information may result in criminal penalties under 31 U.S.C.
              5336(h), including fines up to $10,000 and/or imprisonment for up to 2 years.
            </p>
            <p>
              I authorize NYLTA.com to file this report on behalf of the reporting company identified
              in this submission. I confirm that I am authorized to make this filing on behalf of the
              reporting company.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Signature Canvas */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base flex items-center gap-2">
            <PenTool className="w-4 h-4 text-[#00274E]" />
            Signature
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg bg-white">
            <canvas
              ref={canvasRef}
              className="w-full h-[150px] cursor-crosshair touch-none"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
            />
            {!hasDrawn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-gray-300 text-lg">Sign here</span>
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={clearCanvas} className="flex items-center gap-1">
            <Eraser className="w-3 h-3" /> Clear
          </Button>
        </CardContent>
      </Card>

      {/* Text fields */}
      <Card>
        <CardContent className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Legal Name *</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane A. Doe, Esq."
              />
            </div>
            <div>
              <Label>Initials *</Label>
              <Input
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase())}
                placeholder="JAD"
                maxLength={5}
                className="w-32"
              />
            </div>
            <div>
              <Label>Title / Position *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Managing Partner"
              />
            </div>
            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button
          onClick={handleNext}
          disabled={!isValid}
          className="bg-[#00274E] hover:bg-[#003d73] px-8"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Next: Review & Submit
        </Button>
      </div>
    </div>
  );
}
