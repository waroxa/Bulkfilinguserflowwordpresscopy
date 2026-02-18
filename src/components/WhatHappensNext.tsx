import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { CheckCircle, Shield, Phone, Mail, Users, ArrowLeft, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface WhatHappensNextProps {
  onBack?: () => void;
}

export default function WhatHappensNext({ onBack }: WhatHappensNextProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-[#00274E] border-b-4 border-yellow-400 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-white hover:bg-white/10 mb-4 rounded-none"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          )}
          <div className="text-center">
            <h1 className="text-white mb-2">NYLTA.com</h1>
            <p className="text-gray-300 text-sm">New York LLC Transparency Act Bulk Filing Portal</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-[#00274E] mb-4">What Happens Next</h1>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            Your NYLTA Bulk Filing account has been approved.
          </p>
        </div>

        {/* Intro Message */}
        <Card className="border-2 border-gray-200 rounded-none mb-8">
          <CardContent className="pt-6">
            <p className="text-gray-700 text-lg leading-relaxed">
              To complete setup securely, our compliance team will contact you by phone to provide your login credentials and review next steps.
            </p>
          </CardContent>
        </Card>

        {/* Timeline Steps */}
        <div className="mb-8 space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-[#00274E] mb-2">Step 1: Account Approved</h3>
              <p className="text-gray-700 leading-relaxed">
                Your firm has been reviewed and approved for bulk filing access. You are now in our onboarding queue.
              </p>
            </div>
          </div>

          {/* Connecting Line */}
          <div className="ml-6 border-l-2 border-gray-300 h-8"></div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-[#00274E] rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-[#00274E] mb-2">Step 2: Onboarding Call</h3>
              <p className="text-gray-700 leading-relaxed">
                A compliance specialist will call you within 1-2 business days to verify your information and securely provide your login credentials.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Please ensure the phone number you provided is reachable during business hours.
              </p>
            </div>
          </div>

          {/* Connecting Line */}
          <div className="ml-6 border-l-2 border-gray-300 h-8"></div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-[#00274E] mb-2">Step 3: Portal Access Granted</h3>
              <p className="text-gray-700 leading-relaxed">
                After onboarding, you can log in to the portal, complete your firm profile, and begin submitting bulk filings for your clients.
              </p>
            </div>
          </div>
        </div>

        {/* Security Callout */}
        <Card className="border-2 border-blue-300 bg-blue-50 rounded-none mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Shield className="h-6 w-6 text-[#00274E] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-[#00274E] mb-2">Security Notice</h4>
                <p className="text-gray-700 leading-relaxed">
                  For security reasons, login credentials are never sent by email. Our team will provide them directly during your onboarding call.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Button */}
        <div className="text-center mb-8">
          <Button
            onClick={() => {
              if (onBack) {
                onBack();
              } else {
                window.location.href = 'https://www.bulk.nylta.com';
              }
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-[#00274E] px-12 py-6 rounded-none border-2 border-[#00274E]"
          >
            I Understand — Waiting for My Call
          </Button>
        </div>

        {/* Support Contact */}
        <div className="text-center mb-12">
          <p className="text-gray-600 mb-2">Questions about your account or onboarding?</p>
          <a 
            href="mailto:bulk@nylta.com" 
            className="text-[#00274E] hover:underline inline-flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Contact Support
          </a>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-gray-200 my-8"></div>

        {/* What to Expect Section */}
        <div className="mb-12">
          <h3 className="text-[#00274E] mb-4 text-center">What to Expect During Your Onboarding Call</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border border-gray-300 rounded-none">
              <CardContent className="pt-6">
                <h4 className="text-[#00274E] mb-3">We Will:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-green-600 flex-shrink-0">✓</span>
                    <span>Verify your firm information</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 flex-shrink-0">✓</span>
                    <span>Provide your secure login credentials</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 flex-shrink-0">✓</span>
                    <span>Walk you through the bulk filing process</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 flex-shrink-0">✓</span>
                    <span>Answer any questions you have</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-300 rounded-none">
              <CardContent className="pt-6">
                <h4 className="text-[#00274E] mb-3">Please Have Ready:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-[#00274E] flex-shrink-0">•</span>
                    <span>Your firm's EIN (if applicable)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#00274E] flex-shrink-0">•</span>
                    <span>List of authorized users who will access the portal</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#00274E] flex-shrink-0">•</span>
                    <span>Estimated number of clients you'll be filing for</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#00274E] flex-shrink-0">•</span>
                    <span>Any questions about the filing process</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Info */}
        <Card className="border border-gray-300 rounded-none bg-gray-50 mb-8">
          <CardContent className="pt-6">
            <h4 className="text-[#00274E] mb-3">Important Reminders</h4>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Typical onboarding call duration:</strong> 10-15 minutes
              </p>
              <p>
                <strong>Call scheduling:</strong> Calls are made during business hours (Monday-Friday, 9 AM - 5 PM ET)
              </p>
              <p>
                <strong>Missed call?</strong> Our team will leave a voicemail with a callback number. We will attempt to reach you 2-3 times before sending a follow-up email.
              </p>
              <p>
                <strong>Need to reschedule?</strong> Email us at <a href="mailto:bulk@nylta.com" className="text-[#00274E] hover:underline">bulk@nylta.com</a> with your preferred time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 border-t-2 border-gray-300 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              <strong className="text-[#00274E]">Compliance Disclaimer:</strong> NYLTA.com is a private compliance technology platform operated by New Way Enterprise LLC. We are not affiliated with the New York Department of State or any government agency.
            </p>
            <div className="border-t border-gray-300 pt-4">
              <p className="text-sm text-gray-600">
                <strong>Contact:</strong> <a href="mailto:bulk@nylta.com" className="text-[#00274E] hover:underline">bulk@nylta.com</a> | 
                <strong> Support Hours:</strong> Monday-Friday, 9 AM - 5 PM ET
              </p>
            </div>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} New Way Enterprise LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}