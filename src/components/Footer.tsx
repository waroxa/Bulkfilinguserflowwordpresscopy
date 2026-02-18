import { Mail, Building2, MapPin, CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#00274E] mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: NYLTA.com */}
          <div>
            <h3 className="text-white mb-4">NYLTA.com™</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              This platform is not affiliated with the U.S. Government, the New York Department of State, or the Financial Crimes Enforcement Network (FinCEN).
            </p>
          </div>

          {/* Column 2: Contact Info */}
          <div>
            <h3 className="text-white mb-4">Contact Info:</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-gray-300">Email Address:</span>{' '}
                  <a href="mailto:bulk@nylta.com" className="text-gray-300 hover:text-yellow-400">
                    bulk@nylta.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-gray-300">Principal Office:</span>{' '}
                  <span className="text-gray-300">86 W Flagler St, STE 900-11220, Miami, FL 33130</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-gray-300">Mailing Address:</span>{' '}
                  <span className="text-gray-300">1060 Broadway #1192, Albany, NY 12204</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Useful Information */}
          <div>
            <h3 className="text-white mb-4">Useful Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <a href="#" className="text-gray-300 hover:text-yellow-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-yellow-400" />
                Home
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-yellow-400" />
                About
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-yellow-400" />
                FAQ's
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-yellow-400" />
                Contact
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-yellow-400" />
                TOS
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-yellow-400" />
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        {/* Full-width disclaimer */}
        <div className="border-t border-gray-600 pt-6 mb-6">
          <p className="text-gray-300 text-sm text-center leading-relaxed">
            NYLTA.com™ is a compliance technology platform. We are not affiliated with the U.S. Government, the New York Department of State, or the federal 
            Corporate Transparency Act (CTA) / Financial Crimes Enforcement Network (FinCEN). We do not provide legal, financial, or tax advice. Information on 
            this website is for general informational purposes only. Use of this website is subject to our{' '}
            <a href="#" className="text-yellow-400 hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-yellow-400 hover:underline">Privacy Policy</a>.
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-600 pt-6">
          <p className="text-gray-400 text-sm text-center">
            © 2025 NYLTA.com™ - All Rights Reserved. NYLTA.com™ is a trademark of{' '}
            <a href="#" className="text-yellow-400 hover:underline">New Way Enterprise LLC</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}