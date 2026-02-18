import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AlertCircle, ClipboardList, Lock } from "lucide-react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { projectId } from '../utils/supabase/info';
import { useAuth } from '../contexts/AuthContext';
import { toast } from "sonner@2.0.3";

interface SurveyCompletionGateProps {
  onCompleteSurvey: () => void;
}

export default function SurveyCompletionGate({ onCompleteSurvey }: SurveyCompletionGateProps) {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firmType: "CPA Firm",
    numberOfClients: "26-50 clients",
    filingFrequency: "Monthly",
    primaryChallenges: "Managing multiple client deadlines and ensuring accurate beneficial owner information",
    softwareCurrentlyUsed: "Excel spreadsheets and manual tracking",
    helpfulFeatures: "Automated reminders, bulk upload capability, and integrated compliance checking"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2c01e603/survey`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            completedAt: new Date().toISOString()
          })
        }
      );

      if (response.ok) {
        toast.success('Survey completed successfully!');
        onCompleteSurvey();
      } else {
        const error = await response.text();
        toast.error('Failed to save survey: ' + error);
      }
    } catch (error) {
      console.error('Survey submission error:', error);
      toast.error('Failed to submit survey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <ImageWithFallback 
              src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
              alt="NYLTA.com Logo"
              className="h-8 sm:h-10 md:h-12 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-none"
            />
            <div>
              <h1 className="text-gray-900 text-3xl">Pre-Filing Survey Required</h1>
              <p className="text-gray-600 mt-1">Complete this survey to access bulk filing</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Alert Box - Survey Required */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg text-yellow-900">
                Survey Completion Required
              </h2>
              <p className="mt-2 text-yellow-800 leading-relaxed">
                Before you can access the bulk filing wizard, we need you to complete a brief pre-filing survey. 
                This helps us understand your needs and improve our service. <strong>This is a one-time requirement.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Survey Form */}
        <Card className="border border-gray-300">
          <CardHeader className="bg-white border-b-4 border-yellow-400">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-6 w-6 text-[#00274E]" />
              <div>
                <CardTitle className="text-[#00274E]">Pre-Filing Survey</CardTitle>
                <CardDescription>
                  Please complete this brief survey before starting your bulk filing process. This helps us understand your needs and improve our service.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Firm Type */}
              <div className="space-y-2">
                <Label htmlFor="firmType" className="text-[#00274E]">
                  What type of firm are you? *
                </Label>
                <select
                  id="firmType"
                  value={formData.firmType}
                  onChange={(e) => setFormData({ ...formData, firmType: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-none focus:outline-none focus:border-[#00274E]"
                  required
                >
                  <option value="CPA Firm">CPA Firm</option>
                  <option value="Law Firm">Law Firm</option>
                  <option value="Corporate Legal Department">Corporate Legal Department</option>
                  <option value="Compliance Consulting">Compliance Consulting</option>
                  <option value="Business Services Provider">Business Services Provider</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Number of Clients */}
              <div className="space-y-2">
                <Label htmlFor="numberOfClients" className="text-[#00274E]">
                  Approximately how many clients do you file NYLTA reports for annually? *
                </Label>
                <select
                  id="numberOfClients"
                  value={formData.numberOfClients}
                  onChange={(e) => setFormData({ ...formData, numberOfClients: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-none focus:outline-none focus:border-[#00274E]"
                  required
                >
                  <option value="1-10 clients">1-10 clients</option>
                  <option value="11-25 clients">11-25 clients</option>
                  <option value="26-50 clients">26-50 clients</option>
                  <option value="51-100 clients">51-100 clients</option>
                  <option value="101-250 clients">101-250 clients</option>
                  <option value="250+ clients">250+ clients</option>
                </select>
              </div>

              {/* Filing Frequency */}
              <div className="space-y-2">
                <Label htmlFor="filingFrequency" className="text-[#00274E]">
                  How often do you process NYLTA filings? *
                </Label>
                <select
                  id="filingFrequency"
                  value={formData.filingFrequency}
                  onChange={(e) => setFormData({ ...formData, filingFrequency: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-none focus:outline-none focus:border-[#00274E]"
                  required
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annually">Annually</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>

              {/* Primary Challenges */}
              <div className="space-y-2">
                <Label htmlFor="primaryChallenges" className="text-[#00274E]">
                  What are your primary challenges with NYLTA compliance? *
                </Label>
                <Textarea
                  id="primaryChallenges"
                  value={formData.primaryChallenges}
                  onChange={(e) => setFormData({ ...formData, primaryChallenges: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-none focus:outline-none focus:border-[#00274E] min-h-[100px]"
                  placeholder="e.g., Managing deadlines, collecting accurate beneficial owner information, tracking exemptions..."
                  required
                />
              </div>

              {/* Current Software */}
              <div className="space-y-2">
                <Label htmlFor="softwareCurrentlyUsed" className="text-[#00274E]">
                  What software or tools do you currently use for NYLTA filing management?
                </Label>
                <Input
                  id="softwareCurrentlyUsed"
                  type="text"
                  value={formData.softwareCurrentlyUsed}
                  onChange={(e) => setFormData({ ...formData, softwareCurrentlyUsed: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-none focus:outline-none focus:border-[#00274E]"
                  placeholder="e.g., Excel, practice management software, custom database..."
                />
              </div>

              {/* Helpful Features */}
              <div className="space-y-2">
                <Label htmlFor="helpfulFeatures" className="text-[#00274E]">
                  What features would be most helpful to you in a bulk filing system?
                </Label>
                <Textarea
                  id="helpfulFeatures"
                  value={formData.helpfulFeatures}
                  onChange={(e) => setFormData({ ...formData, helpfulFeatures: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-none focus:outline-none focus:border-[#00274E] min-h-[100px]"
                  placeholder="e.g., Automated deadline reminders, client portal access, integrated payment processing..."
                />
              </div>

              <div className="pt-4 border-t-2 border-gray-200">
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#00274E] hover:bg-[#003366] text-white px-8 py-6 rounded-none"
                  >
                    {loading ? 'Submitting...' : 'Complete Survey & Continue'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Why This Survey */}
        <Card className="border-2 border-blue-200 bg-blue-50 mt-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00274E] rounded-full mt-2"></div>
              <div>
                <p className="text-gray-700">
                  <strong className="text-[#00274E]">Why this survey?</strong> This helps us understand your filing needs and provide better support throughout the process. Your responses help improve our service and ensure we're meeting the needs of compliance professionals like you.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <em>This is a one-time requirement. Once completed, you'll have full access to the bulk filing system.</em>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            NYLTA.com™ is operated by New Way Enterprise LLC and is not affiliated with the New York Department of State or any government agency.
          </p>
        </div>
      </footer>
    </div>
  );
}