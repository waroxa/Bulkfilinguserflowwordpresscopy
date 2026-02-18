import { useState, useEffect } from "react";
import { User, X, AlertTriangle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PopupData {
  id: string;
  city: string;
  filingCount: number;
  professionalType: string;
  submissionType: 'monitoring' | 'filing'; // Add submission type
}

const NY_CITIES = [
  "Brooklyn",
  "Buffalo", 
  "Rochester",
  "Syracuse",
  "Albany",
  "Yonkers",
  "Newburgh",
  "White Plains",
  "Long Island",
  "Staten Island",
  "Queens",
  "Manhattan"
];

const PROFESSIONAL_TYPES = [
  "CPA",
  "Accountant",
  "Attorney",
  "Law Firm Representative",
  "Compliance Professional",
  "Business Consultant",
  "Registered Agent",
  "Someone" // Represents "Other"
];

// Generate random filing count (10+ minimum, often 25-175, occasionally up to 250+)
const getRandomFilingCount = () => {
  const rand = Math.random();
  if (rand < 0.05) {
    // 5% chance: very high (200-250+)
    return Math.floor(Math.random() * 51) + 200;
  } else if (rand < 0.15) {
    // 10% chance: high (150-199)
    return Math.floor(Math.random() * 50) + 150;
  } else if (rand < 0.7) {
    // 55% chance: typical bulk (25-149)
    return Math.floor(Math.random() * 125) + 25;
  } else {
    // 30% chance: minimum bulk (10-24)
    return Math.floor(Math.random() * 15) + 10;
  }
};

const generatePopupData = (): PopupData => {
  const city = NY_CITIES[Math.floor(Math.random() * NY_CITIES.length)];
  const professionalType = PROFESSIONAL_TYPES[Math.floor(Math.random() * PROFESSIONAL_TYPES.length)];
  const filingCount = getRandomFilingCount();
  // 75% monitoring (domestic NY LLCs), 25% filing (foreign LLCs)
  const submissionType = Math.random() < 0.75 ? 'monitoring' : 'filing';
  return {
    id: `popup-${Date.now()}-${Math.random()}`,
    city,
    filingCount,
    professionalType,
    submissionType
  };
};

interface SocialProofPopupProps {
  onViewFlow?: () => void;
  hideCTA?: boolean;
}

export default function SocialProofPopup({ onViewFlow, hideCTA }: SocialProofPopupProps) {
  const [currentPopup, setCurrentPopup] = useState<PopupData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show first popup after 5 seconds
    const initialDelay = setTimeout(() => {
      showNewPopup();
    }, 5000);

    return () => clearTimeout(initialDelay);
  }, []);

  const showNewPopup = () => {
    const popup = generatePopupData();
    setCurrentPopup(popup);
    setIsVisible(true);

    // Auto-hide after 6 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 6000);

    // Show next popup every 25 seconds (6s visible + 19s hidden)
    setTimeout(() => {
      showNewPopup();
    }, 25000); // Fixed 25 second interval
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleViewFlow = () => {
    if (onViewFlow) {
      onViewFlow();
    } else {
      // Default behavior: scroll to registration or navigate to bulk filing
      const registrationSection = document.getElementById('registration');
      if (registrationSection) {
        registrationSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    handleClose();
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
      <AnimatePresence>
        {isVisible && currentPopup && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="pointer-events-auto"
          >
            <div 
              className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
              style={{ width: "320px" }}
            >
              {/* Header with close button */}
              <div className="flex items-start justify-between p-4 pb-3">
                <div className="flex items-start gap-3 flex-1">
                  {/* User Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#00274E] flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 leading-tight mb-1">
                      <span className="font-semibold">{currentPopup.professionalType} in {currentPopup.city}</span>
                    </p>
                    <p className="text-xs text-gray-600 leading-tight">
                      {currentPopup.submissionType === 'monitoring' 
                        ? <>just set up <span className="font-semibold text-[#00274E]">{currentPopup.filingCount} client monitoring</span></>
                        : <>just filed <span className="font-semibold text-[#00274E]">{currentPopup.filingCount} client filings</span></>
                      }
                    </p>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Compliance Urgency Banner */}
              {!hideCTA && (
                <div className="px-4 pb-3">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-red-500 p-2 rounded">
                    <div className="flex items-center justify-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                      <p className="text-xs font-semibold text-red-600">
                        Stay compliant
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA */}
              {!hideCTA && (
                <div className="px-4 pb-4">
                  <button
                    onClick={handleViewFlow}
                    className="w-full text-center text-sm font-medium text-[#00274E] hover:text-[#003366] bg-[#fbbf24] hover:bg-[#f59e0b] py-2 px-4 rounded transition-colors"
                  >
                    Start Your Bulk Filing
                  </button>
                </div>
              )}

              {/* Bottom accent line */}
              <div className="h-1 bg-gradient-to-r from-[#00274E] via-[#fbbf24] to-[#00274E]"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}