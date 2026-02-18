import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, FileText } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";

interface Step4ExemptionAttestationProps {
  onComplete: (data: AttestationData) => void;
  onBack: () => void;
  initialData?: AttestationData;
}

export interface AttestationData {
  signature: string;
  fullName: string;
  title: string;
  attestedAt: string;
}

export default function Step4ExemptionAttestation({ 
  onComplete, 
  onBack, 
  initialData 
}: Step4ExemptionAttestationProps) {
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [errors, setErrors] = useState<{fullName?: string; title?: string; signature?: string}>({});
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('type'); // Default to typed signature
  const [typedSignature, setTypedSignature] = useState('');
  
  const signaturePadRef = useRef<SignatureCanvas>(null);

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
    setTypedSignature('');
    setErrors(prev => ({ ...prev, signature: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: {fullName?: string; title?: string; signature?: string} = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    // Check signature
    if (signatureMode === 'draw') {
      if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
        newErrors.signature = 'Signature is required';
      }
    } else {
      if (!typedSignature.trim()) {
        newErrors.signature = 'Signature is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    let signatureData = '';
    if (signatureMode === 'draw' && signaturePadRef.current) {
      signatureData = signaturePadRef.current.toDataURL();
    } else {
      signatureData = `typed:${typedSignature}`;
    }

    const attestationData: AttestationData = {
      signature: signatureData,
      fullName: fullName.trim(),
      title: title.trim(),
      attestedAt: new Date().toISOString()
    };

    onComplete(attestationData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="border-2 border-gray-200 shadow-sm rounded-none">
        <CardHeader className="border-b border-gray-200 bg-white">
          <CardTitle 
            className="text-gray-900"
            style={{ fontFamily: 'Libre Baskerville, serif' }}
          >
            Exemption Attestation
          </CardTitle>
          <p className="text-gray-600 mt-2 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Certify the exemption submission under penalty of perjury
          </p>
        </CardHeader>

        <CardContent className="p-8 bg-white space-y-6">
          {/* Certification Statement */}
          <Alert className="border-[#00274E] bg-blue-50 rounded-none">
            <FileText className="h-5 w-5 text-[#00274E]" />
            <AlertDescription className="text-sm text-gray-900 ml-2 leading-relaxed">
              <strong className="block mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                Certification Statement
              </strong>
              <p style={{ fontFamily: 'Poppins, sans-serif' }}>
                By signing below, I certify under penalty of perjury that the information provided is true, 
                correct, and complete, and that I am authorized to submit this exemption attestation on behalf 
                of the entity.
              </p>
            </AlertDescription>
          </Alert>

          {/* Signature Section */}
          <div className="space-y-4">
            <Label 
              className="text-base text-gray-900"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Authorized Signature*
            </Label>

            {/* Signature Mode Toggle */}
            <div className="flex gap-4 mb-4">
              <Button
                type="button"
                variant={signatureMode === 'draw' ? 'default' : 'outline'}
                onClick={() => {
                  setSignatureMode('draw');
                  setErrors(prev => ({ ...prev, signature: undefined }));
                }}
                className={`rounded-none ${
                  signatureMode === 'draw' 
                    ? 'bg-[#00274E] text-white' 
                    : 'border-gray-300 text-gray-700'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              >
                Draw Signature
              </Button>
              <Button
                type="button"
                variant={signatureMode === 'type' ? 'default' : 'outline'}
                onClick={() => {
                  setSignatureMode('type');
                  setErrors(prev => ({ ...prev, signature: undefined }));
                }}
                className={`rounded-none ${
                  signatureMode === 'type' 
                    ? 'bg-[#00274E] text-white' 
                    : 'border-gray-300 text-gray-700'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              >
                Type Signature
              </Button>
            </div>

            {/* Draw Signature Canvas */}
            {signatureMode === 'draw' && (
              <div className="space-y-2">
                <div className="border-2 border-gray-300 bg-white rounded-none">
                  <SignatureCanvas
                    ref={signaturePadRef}
                    canvasProps={{
                      className: 'w-full h-40',
                      style: { touchAction: 'none' }
                    }}
                    backgroundColor="white"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearSignature}
                  className="text-sm rounded-none border-gray-300"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Clear Signature
                </Button>
              </div>
            )}

            {/* Type Signature Input */}
            {signatureMode === 'type' && (
              <div className="space-y-2">
                <Input
                  type="text"
                  value={typedSignature}
                  onChange={(e) => {
                    setTypedSignature(e.target.value);
                    setErrors(prev => ({ ...prev, signature: undefined }));
                  }}
                  placeholder="Type your full legal name"
                  className="rounded-none border-gray-300 italic text-2xl py-6"
                  style={{ fontFamily: 'Brush Script MT, cursive' }}
                />
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  This typed signature will be used as your legal signature on the attestation
                </p>
              </div>
            )}

            {errors.signature && (
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.signature}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label 
              htmlFor="fullName"
              className="text-base text-gray-900"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Full Legal Name*
            </Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrors(prev => ({ ...prev, fullName: undefined }));
              }}
              placeholder="Enter your full legal name"
              className={`rounded-none ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label 
              htmlFor="title"
              className="text-base text-gray-900"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Title/Position*
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors(prev => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g., Owner, Managing Member, Authorized Representative"
              className={`rounded-none ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />
            {errors.title && (
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Disclaimer */}
          <Alert className="border-yellow-300 bg-yellow-50 rounded-none">
            <AlertCircle className="h-4 w-4 text-yellow-700" />
            <AlertDescription className="text-sm text-gray-900 ml-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <strong>Important:</strong> Final filing requirements are subject to guidance from the New York Department of State.
            </AlertDescription>
          </Alert>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="px-8 py-6 rounded-none border-gray-300"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Back
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              className="px-12 py-6 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#00274E] rounded-none"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Continue to Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}