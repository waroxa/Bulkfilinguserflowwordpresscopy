import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle, Eye, FileCheck, Shield } from "lucide-react";

interface ServiceSelectionProps {
  onSelect: (serviceType: 'monitoring' | 'filing') => void;
  onBack: () => void;
}

export default function ServiceSelection({ onSelect, onBack }: ServiceSelectionProps) {
  const [selectedService, setSelectedService] = useState<'monitoring' | 'filing' | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl text-[#00274E] mb-4" style={{ fontFamily: 'Libre Baskerville, serif' }}>
            Choose Your Service
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Select the service tier that matches your firm's compliance needs. You can upgrade from Monitoring to Filing anytime.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Compliance Monitoring */}
          <Card 
            className={`cursor-pointer transition-all duration-300 ${
              selectedService === 'monitoring' 
                ? 'border-4 border-blue-500 shadow-2xl scale-105' 
                : 'border-2 border-gray-300 hover:border-blue-400 hover:shadow-lg'
            }`}
            onClick={() => setSelectedService('monitoring')}
          >
            <CardHeader className={`transition-all duration-300 ${
              selectedService === 'monitoring' 
                ? 'bg-blue-500 border-b-4 border-blue-600' 
                : 'bg-gray-100 border-b-2 border-gray-300'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${
                    selectedService === 'monitoring' ? 'bg-white' : 'bg-blue-100'
                  }`}>
                    <Eye className={`h-6 w-6 ${
                      selectedService === 'monitoring' ? 'text-blue-500' : 'text-blue-600'
                    }`} />
                  </div>
                  <CardTitle className={`text-2xl ${
                    selectedService === 'monitoring' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Compliance Monitoring
                  </CardTitle>
                </div>
                {selectedService === 'monitoring' && (
                  <CheckCircle className="h-8 w-8 text-white" />
                )}
              </div>
              <CardDescription className={
                selectedService === 'monitoring' ? 'text-blue-100' : 'text-gray-600'
              }>
                DATA STORAGE & READINESS SERVICE
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6">
                <p className="text-gray-900 mb-1">
                  <span className="text-5xl font-bold text-blue-600">$249</span>
                </p>
                <p className="text-sm text-gray-600">per client entity</p>
              </div>

              <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-sm text-gray-700 font-semibold mb-2">Perfect for:</p>
                <p className="text-sm text-gray-700">
                  Firms preparing client data and maintaining compliance readiness without immediate NYDOS submission
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm">What's Included:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Secure data storage in compliance-ready format</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Real-time data validation and error checking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Beneficial owner & exemption data management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Upgrade to filing anytime (pay only $149 difference)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Email support for data management</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-400 p-3">
                <p className="text-xs text-blue-800 font-semibold">
                  💡 Perfect for firms preparing client data in advance
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Filing */}
          <Card 
            className={`cursor-pointer transition-all duration-300 relative ${
              selectedService === 'filing' 
                ? 'border-4 border-[#fbbf24] shadow-2xl scale-105' 
                : 'border-2 border-gray-300 hover:border-[#fbbf24] hover:shadow-lg'
            }`}
            onClick={() => setSelectedService('filing')}
          >
            {/* Most Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#fbbf24] text-[#00274E] px-6 py-1 rounded-full text-sm font-bold shadow-lg">
              MOST POPULAR
            </div>

            <CardHeader className={`transition-all duration-300 ${
              selectedService === 'filing' 
                ? 'bg-[#00274E] border-b-4 border-[#fbbf24]' 
                : 'bg-gray-100 border-b-2 border-gray-300'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${
                    selectedService === 'filing' ? 'bg-[#fbbf24]' : 'bg-yellow-100'
                  }`}>
                    <FileCheck className={`h-6 w-6 ${
                      selectedService === 'filing' ? 'text-[#00274E]' : 'text-[#00274E]'
                    }`} />
                  </div>
                  <CardTitle className={`text-2xl ${
                    selectedService === 'filing' ? 'text-white' : 'text-gray-900'
                  }`}>
                    BULK FILING
                  </CardTitle>
                </div>
                {selectedService === 'filing' && (
                  <CheckCircle className="h-8 w-8 text-[#fbbf24]" />
                )}
              </div>
              <CardDescription className={
                selectedService === 'filing' ? 'text-gray-300' : 'text-gray-600'
              }>
                COMPLETE NYDOS FILING SERVICE
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6">
                <p className="text-gray-900 mb-1">
                  <span className="text-5xl font-bold text-[#00274E]">$398</span>
                </p>
                <p className="text-sm text-gray-600">per client entity</p>
                <p className="text-xs text-gray-500 mt-1">(Volume discounts available)</p>
              </div>

              <div className="mb-6 bg-yellow-50 border-l-4 border-[#fbbf24] p-4">
                <p className="text-sm text-gray-700">
                  <strong className="text-[#00274E]">Full-service filing</strong> including official NYDOS submission, confirmation, and compliance certificates.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm">EVERYTHING IN MONITORING, PLUS:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700"><strong>Official submission to NY Department of State</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Government filing confirmation & tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Official compliance certificates (PDF)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Status tracking & confirmation emails</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Ongoing compliance monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Professional filing documentation</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 bg-green-50 border border-green-200 p-3">
                <p className="text-xs text-green-800">
                  <strong>✓ Complete Service:</strong> Official NYDOS filing with full confirmation and compliance tracking
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Guarantee */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded p-6 mb-8 max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="bg-[#00274E] rounded-full p-3 flex-shrink-0">
              <Shield className="h-6 w-6 text-[#fbbf24]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#00274E] mb-2">
                Our Upgrade Guarantee: Never Pay Twice
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Start with <strong>Compliance Monitoring ($249)</strong> and upgrade to <strong>Bulk Filing</strong> anytime by paying only the <strong>$149 difference</strong>. 
                Zero double-charging guaranteed at the database level.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-2 border-gray-400 rounded-none"
          >
            ← Back to Dashboard
          </Button>

          <Button
            onClick={() => selectedService && onSelect(selectedService)}
            disabled={!selectedService}
            className="bg-[#00274E] hover:bg-[#003d73] text-white px-12 py-6 rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {selectedService === 'monitoring' && 'Continue with Monitoring →'}
            {selectedService === 'filing' && 'Continue with Bulk Filing →'}
            {!selectedService && 'Select a Service to Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}