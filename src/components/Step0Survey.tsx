import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface Step0SurveyProps {
  onComplete: () => void;
}

export default function Step0Survey({ onComplete }: Step0SurveyProps) {
  const [formData, setFormData] = useState({
    firmType: "CPA Firm",
    numberOfClients: "25",
    filingFrequency: "Monthly",
    primaryChallenges: "Managing multiple client deadlines and ensuring accurate beneficial owner information",
    softwareCurrentlyUsed: "Excel spreadsheets and manual tracking",
    helpfulFeatures: "Automated reminders, bulk upload capability, and integrated compliance checking"
  });

  useEffect(() => {
    // Load the survey embed script
    const script = document.createElement('script');
    script.src = 'https://link.nylta.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="space-y-6">
      <Card className="border border-gray-300">
        <CardHeader className="bg-white border-b-4 border-yellow-400">
          <CardTitle className="text-[#00274E]">Pre-Filing Survey</CardTitle>
          <CardDescription>
            Please complete this brief survey before starting your bulk filing process. This helps us understand your needs and improve our service.
          </CardDescription>
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
                <option value="1-10">1-10 clients</option>
                <option value="11-25">11-25 clients</option>
                <option value="25">26-50 clients</option>
                <option value="51-100">51-100 clients</option>
                <option value="101-250">101-250 clients</option>
                <option value="250+">250+ clients</option>
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
                  className="bg-[#00274E] hover:bg-[#003366] text-white px-8 py-6 rounded-none"
                >
                  Continue to Bulk Filing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#00274E] rounded-full mt-2"></div>
            <div>
              <p className="text-gray-700">
                <strong className="text-[#00274E]">Why this survey?</strong> This helps us understand your filing needs and provide better support throughout the process. Your responses help improve our service.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <em>Demo Note: This form is pre-filled with sample data for demonstration purposes.</em>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}