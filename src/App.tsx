import { ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import type { Client, FirmProfile } from "./types";
import { 
  createFirmContact, 
  createBulkClientContacts,
  sendOrderConfirmation,
  convertWizardClientToContactData,
  type ClientContactData
} from "./utils/highlevelContacts";
import { projectId, publicAnonKey } from './utils/supabase/info';
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";
import React from "react";

// Component imports
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import MemberProfile from "./components/MemberProfile";
import BulkFilingDemo from "./components/BulkFilingDemo";
import CreateAdminAccount from "./components/CreateAdminAccount";
import CreateRyanAdmin from "./components/CreateRyanAdmin";
import FirmProfile from "./components/FirmProfile";
import FirstTimeUserWizard from "./components/FirstTimeUserWizard";
import ProfileCompletionGate from "./components/ProfileCompletionGate";
import SurveyCompletionGate from "./components/SurveyCompletionGate";
import WhatHappensNext from "./components/WhatHappensNext";
import DocumentationDownloadPage from "./components/DocumentationDownloadPage";
import TermsOfService from "./components/TermsOfService";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Step2ClientUpload from "./components/Step2ClientUpload";
import FilingIntentDecision from "./components/FilingIntentDecision";
import Step3FirmCompanyApplicant from "./components/Step3FirmCompanyApplicant";
import Step3BeneficialOwners from "./components/Step3BeneficialOwners";
import Step3ExemptionCategory from "./components/Step3ExemptionCategory";
import Step4ReviewSummary from "./components/Step4ReviewSummary";
import Step5Payment from "./components/Step5Payment";
import Step6Confirmation from "./components/Step6Confirmation";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";
import { Card, CardContent } from "./components/ui/card";

// Type definitions
interface FirmInfo {
  firmName: string;
  email: string;
  ein: string;
  contactPerson: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface PaymentSelection {
  clientIds: string[];
  totalAmount: number;
}

function App() {
  const [currentView, setCurrentView] = React.useState<"landing" | "dashboard" | "admin" | "profile" | "bulk-filing-demo" | "create-admin" | "create-ryan-admin" | "firm-profile" | "profile-success" | "what-happens-next" | "docs" | "terms" | "privacy">("landing");

  const [showLanding, setShowLanding] = React.useState(true);
  const [showDashboard, setShowDashboard] = React.useState(false);
  const [showMemberProfile, setShowMemberProfile] = React.useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = React.useState(false);
  const [showBulkFilingDemo, setShowBulkFilingDemo] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [maxStepReached, setMaxStepReached] = React.useState(0);
  const [firmInfo, setFirmInfo] = React.useState<FirmInfo | null>(null);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [paymentSelection, setPaymentSelection] = React.useState<PaymentSelection>({ clientIds: [], totalAmount: 0 });
  const [confirmationData, setConfirmationData] = React.useState<any>(null);
  const [dashboardKey, setDashboardKey] = React.useState(0);
  
  // First-time user state
  const [showFirstTimeWizard, setShowFirstTimeWizard] = React.useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = React.useState(false);
  
  // Filing path state (disclosure vs exemption)
  const [filingPath, setFilingPath] = React.useState<'disclosure' | 'exemption' | null>(null);
  const [filingIntent, setFilingIntent] = React.useState<'disclosure' | 'exemption' | null>(null);
  const [exemptionCategoryData, setExemptionCategoryData] = React.useState<any>(null);
  const [attestationData, setAttestationData] = React.useState<any>(null);
  
  // Profile completion gate state
  const [firmProfileComplete, setFirmProfileComplete] = React.useState<boolean>(false);
  const [isLoadingProfile, setIsLoadingProfile] = React.useState<boolean>(true);
  const [firmProfileData, setFirmProfileData] = React.useState<any>(null);
  
  // Survey completion gate state
  const [surveyComplete, setSurveyComplete] = React.useState<boolean>(false);
  const [isLoadingSurvey, setIsLoadingSurvey] = React.useState<boolean>(true);
  
  // Get account data from Auth context
  const { account, session, loading: authLoading } = useAuth();

  // Suppress MetaMask console errors (app doesn't use Web3)
  React.useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;
    const originalInfo = console.info;
    
    const shouldSuppress = (args: any[]) => {
      const message = args.join(' ').toLowerCase();
      return (
        message.includes('metamask') || 
        message.includes('ethereum') ||
        message.includes('failed to connect to metamask') ||
        message.includes('web3') ||
        message.includes('wallet')
      );
    };
    
    console.error = (...args) => {
      if (shouldSuppress(args)) return;
      originalError(...args);
    };
    
    console.warn = (...args) => {
      if (shouldSuppress(args)) return;
      originalWarn(...args);
    };
    
    console.log = (...args) => {
      if (shouldSuppress(args)) return;
      originalLog(...args);
    };
    
    console.info = (...args) => {
      if (shouldSuppress(args)) return;
      originalInfo(...args);
    };
    
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
      console.info = originalInfo;
    };
  }, []);

  // Load saved data from sessionStorage on mount
  React.useEffect(() => {
    const savedStep = sessionStorage.getItem('nylta_currentStep');
    const savedMaxStep = sessionStorage.getItem('nylta_maxStepReached');
    const savedFirmInfo = sessionStorage.getItem('nylta_firmInfo');
    const savedClients = sessionStorage.getItem('nylta_clients');
    const savedPaymentSelection = sessionStorage.getItem('nylta_paymentSelection');
    const firstTimeFlag = sessionStorage.getItem('nylta_firstTimeUser');

    if (savedStep) setCurrentStep(parseInt(savedStep));
    if (savedMaxStep) setMaxStepReached(parseInt(savedMaxStep));
    if (savedFirmInfo) setFirmInfo(JSON.parse(savedFirmInfo));
    if (savedClients) setClients(JSON.parse(savedClients));
    if (savedPaymentSelection) setPaymentSelection(JSON.parse(savedPaymentSelection));
    
    // Check if user is logging in for first time and profile is incomplete
    if (firstTimeFlag === 'true') {
      setIsFirstTimeUser(true);
      setShowFirstTimeWizard(true);
    }
  }, []);

  // Save data to sessionStorage whenever it changes
  React.useEffect(() => {
    sessionStorage.setItem('nylta_currentStep', currentStep.toString());
    // Update max step reached
    if (currentStep > maxStepReached) {
      setMaxStepReached(currentStep);
      sessionStorage.setItem('nylta_maxStepReached', currentStep.toString());
    }
  }, [currentStep, maxStepReached]);

  React.useEffect(() => {
    if (firmInfo) {
      sessionStorage.setItem('nylta_firmInfo', JSON.stringify(firmInfo));
    }
  }, [firmInfo]);

  React.useEffect(() => {
    if (clients.length > 0) {
      sessionStorage.setItem('nylta_clients', JSON.stringify(clients));
    }
  }, [clients]);

  React.useEffect(() => {
    if (paymentSelection.clientIds.length > 0) {
      sessionStorage.setItem('nylta_paymentSelection', JSON.stringify(paymentSelection));
    }
  }, [paymentSelection]);

  // Check firm profile completion when user is authenticated
  React.useEffect(() => {
    const checkFirmProfile = async () => {
      if (!account || !session?.access_token) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        setIsLoadingProfile(true);
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-2c01e603/firm-profile`,
          {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFirmProfileComplete(data.profile?.isComplete || false);
          setFirmProfileData(data.profile);
        } else {
          setFirmProfileComplete(false);
        }
      } catch (error) {
        // Silently handle fetch errors - this can happen when backend is unavailable
        // Only log if it's not a typical "Failed to fetch" network error
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          // Expected when backend is not available - don't spam console
        } else {
          console.error("Error checking firm profile:", error);
        }
        setFirmProfileComplete(false);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    checkFirmProfile();
  }, [account, session]);
  
  // Check survey completion when user is authenticated
  React.useEffect(() => {
    const checkSurvey = async () => {
      if (!account || !session?.access_token) {
        setIsLoadingSurvey(false);
        return;
      }

      try {
        setIsLoadingSurvey(true);
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-2c01e603/survey`,
          {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSurveyComplete(data.isComplete || false);
        } else {
          setSurveyComplete(false);
        }
      } catch (error) {
        // Silently handle fetch errors - this can happen when backend is unavailable
        // Only log if it's not a typical "Failed to fetch" network error
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          // Expected when backend is not available - don't spam console
        } else {
          console.error("Error checking survey:", error);
        }
        setSurveyComplete(false);
      } finally {
        setIsLoadingSurvey(false);
      }
    };

    checkSurvey();
  }, [account, session]);

  const totalSteps = 8; // Survey removed, now 8 steps total
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const stepTitles = [
    "Upload Client List",       // Step 0 (CSV includes filing_type per client)
    "Filing Intent",            // Step 1 (review/edit per-client filing intent)
    "Company Applicant",        // Step 2 (ONLY disclosure clients)
    "Beneficial Owners",        // Step 3 (ONLY disclosure clients)
    "Exemption Category",       // Step 4 (ONLY exemption clients - filtered)
    "Review Summary",           // Step 5
    "Payment & Authorization",  // Step 6
    "Confirmation"              // Step 7
  ];

  // Step handlers - LINEAR FLOW (all clients go through same steps, filtered by filingType)
  const handleStep0Complete = (clientList: Client[]) => {  // Step 0: Upload Client List (auto-detects entityType from countryOfFormation)
    // Entity type is now AUTO-DETECTED in Step2ClientUpload based on countryOfFormation:
    // - countryOfFormation === "United States" → entityType = "domestic"
    // - countryOfFormation !== "United States" → entityType = "foreign"
    
    console.log(`Processed ${clientList.length} clients with auto-detected entity types`);
    const domesticCount = clientList.filter(c => c.entityType === "domestic").length;
    const foreignCount = clientList.filter(c => c.entityType === "foreign").length;
    console.log(`- ${domesticCount} domestic entities (formed in USA)`);
    console.log(`- ${foreignCount} foreign entities (formed outside USA)`);
    
    setClients(clientList);
    setCurrentStep(1);  // Go to Filing Intent (review/edit per-client filing intent)
  };

  const handleStep1Complete = (updatedClients: Client[]) => {  // Step 1: Filing Intent (review/edit per-client filing intent)
    setClients(updatedClients);
    
    // CONDITIONAL NAVIGATION: If ALL clients are exemption, skip Company Applicant (2) and Beneficial Owners (3)
    const allExemption = updatedClients.every(c => c.filingType === 'exemption');
    
    if (allExemption) {
      setCurrentStep(4);  // Skip to Exemption Category directly
    } else {
      setCurrentStep(2);  // Go to Company Applicant (ONLY disclosure clients)
    }
  };

  const handleStep2Complete = (updatedClients: Client[]) => {  // Step 2: Company Applicant (ONLY disclosure clients)
    // Merge updated disclosure clients back into main clients array
    setClients(prevClients => 
      prevClients.map(client => {
        const updated = updatedClients.find(uc => uc.id === client.id);
        return updated || client;
      })
    );
    setCurrentStep(3);  // Go to Beneficial Owners (filter disclosure clients)
  };

  const handleStep3Complete = (updatedClients: Client[]) => {  // Step 3: Beneficial Owners (ONLY disclosure clients)
    // Merge updated disclosure clients back into main clients array
    setClients(prevClients => 
      prevClients.map(client => {
        const updated = updatedClients.find(uc => uc.id === client.id);
        return updated || client;
      })
    );
    setCurrentStep(4);  // Go to Exemption Category (filter exemption clients)
  };

  const handleStep4Complete = (updatedClients: Client[]) => {  // Step 4: Exemption Category (ONLY exemption clients)
    // Merge updated exemption clients back into main clients array
    setClients(prevClients => 
      prevClients.map(client => {
        const updated = updatedClients.find(uc => uc.id === client.id);
        return updated || client;
      })
    );
    setCurrentStep(5);  // Go to Review Summary
  };

  const handleStep5Complete = (selection: PaymentSelection) => {  // Step 5: Review Summary
    setPaymentSelection(selection);
    setCurrentStep(6);  // Go to Payment
  };

  const handleStep6Complete = async (paymentData: any) => {  // Step 6: Payment & Authorization
    const selectedClients = clients.filter(c => paymentSelection.clientIds.includes(c.id));
    const timestamp = new Date().toISOString();
    const confirmationNumber = timestamp.substring(0, 13).replace(/[-:]/g, '');
    
    // Ensure firmInfo is populated from either state or firmProfileData
    const activeFirmInfo = firmInfo || (firmProfileData ? {
      firmName: firmProfileData.firmName || '',
      ein: firmProfileData.ein || '',
      contactPerson: firmProfileData.contactPerson || '',
      email: firmProfileData.email || '',
      phone: firmProfileData.phone || '',
      address: firmProfileData.address || '',
      city: firmProfileData.city || '',
      state: firmProfileData.state || '',
      zipCode: firmProfileData.zipCode || ''
    } : null);
    
    // Set confirmation data first
    setConfirmationData({
      ...paymentData,
      clients: selectedClients,
      firmInfo: activeFirmInfo,
      timestamp
    });
    
    // Move to confirmation page
    setCurrentStep(7);
    
    // Send contacts to GoHighLevel in background (don't block UI)
    try {
      console.log('🚀 Starting GoHighLevel contact sync...');
      
      // Step 1: Create firm contact
      const firmContactId = await createFirmContact({
        firmName: activeFirmInfo?.firmName || paymentData.agreementData?.firmName || 'Unknown Firm',
        firmEIN: activeFirmInfo?.ein || paymentData.agreementData?.ein || '',
        contactName: activeFirmInfo?.contactPerson || paymentData.agreementData?.fullLegalName || '',
        contactEmail: activeFirmInfo?.email || paymentData.agreementData?.email || account?.email || '',
        contactPhone: activeFirmInfo?.phone || '',
        firmAddress: activeFirmInfo?.address || '',
        firmCity: activeFirmInfo?.city || '',
        firmState: activeFirmInfo?.state || '',
        firmZipCode: activeFirmInfo?.zipCode || '',
        firmCountry: (activeFirmInfo as any)?.country || 'United States',
        confirmationNumber: confirmationNumber
      });
      
      console.log('✅ Firm contact created:', firmContactId);
      
      // Step 2: Create client contacts (all at once)
      const clientContactsData: ClientContactData[] = selectedClients.map(client => ({
        ...convertWizardClientToContactData(client),
        parentFirmId: firmContactId,
        parentFirmName: activeFirmInfo?.firmName || 'Unknown Firm',
        parentFirmConfirmation: confirmationNumber,
        contactEmail: activeFirmInfo?.email || '', // Use firm email as fallback
      }));
      
      const clientContactIds = await createBulkClientContacts(
        firmContactId,
        activeFirmInfo?.firmName || 'Unknown Firm',
        confirmationNumber,
        clientContactsData
      );
      
      console.log(`✅ Created ${clientContactIds.length} client contacts`);
      
      // Step 3: Send order confirmation
      await sendOrderConfirmation({
        firmContactId,
        firmName: activeFirmInfo?.firmName || 'Unknown Firm',
        confirmationNumber,
        orderNumber: paymentData.payment?.transaction_id || `ORDER-${confirmationNumber}`,
        submissionDate: timestamp,
        paymentDate: timestamp,
        batchId: confirmationNumber,
        amountPaid: paymentSelection.totalAmount,
        clientCount: selectedClients.length,
        serviceType: (() => {
          const hasMonitoring = selectedClients.some(c => c.serviceType === 'monitoring');
          const hasFiling = selectedClients.some(c => c.serviceType === 'filing');
          if (hasMonitoring && hasFiling) return 'mixed';
          if (hasMonitoring) return 'monitoring';
          return 'filing';
        })(),
        // ACH payment data (masked — only last 4 digits stored in GHL)
        achAccountType: paymentData.payment?.achAccountType || paymentData.achData?.accountType || '',
        achRoutingLast4: paymentData.payment?.routingNumber?.slice(-4) || paymentData.achData?.routingNumber?.slice(-4) || '',
        achAccountLast4: paymentData.payment?.accountNumber?.slice(-4) || paymentData.achData?.accountNumber?.slice(-4) || '',
        achBillingStreet: paymentData.achData?.billingAddress?.street || '',
        achBillingCity: paymentData.achData?.billingAddress?.city || '',
        achBillingState: paymentData.achData?.billingAddress?.state || '',
        achBillingZip: paymentData.achData?.billingAddress?.zip || '',
        achBillingCountry: 'United States',
        clients: selectedClients.map(c => ({
          llcName: c.llcName,
          serviceType: c.serviceType || 'filing',
          fee: c.serviceType === 'monitoring' ? 249 : 398,
          filingType: c.filingType
        }))
      });
      
      console.log('✅ GoHighLevel sync complete!');
      
    } catch (error) {
      console.error('❌ Error syncing to GoHighLevel:', error);
      // Don't show error to user - this is background sync
      // Just log it for debugging
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      // Check if ALL clients are exemption (skip steps 2 and 3 when going back)
      const allExemption = clients.length > 0 && clients.every(c => c.filingType === 'exemption');
      
      // If on step 4 (Exemption Category) and all exemption, skip back to step 1 (Filing Intent)
      if (currentStep === 4 && allExemption) {
        setCurrentStep(1);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const handleStepClick = (step: number) => {
    // Only allow navigation to completed steps or current step
    // A step is considered "accessible" if it's less than or equal to the furthest step reached
    const canNavigate = step <= maxStepReached || (
      // Allow going forward only if previous steps have data
      step === 0 && currentStep >= 0 ||
      step === 1 && clients.length > 0 ||
      step === 2 && clients.length > 0 ||
      step === 3 && clients.length > 0 ||
      step === 4 && clients.length > 0 ||
      step === 5 && clients.length > 0 ||
      step === 6 && paymentSelection.clientIds.length > 0
    );
    
    if (canNavigate) {
      setCurrentStep(step);
    }
  };

  const handleBackToDashboard = () => {
    setShowDashboard(true);
  };

  const handleStartProfile = () => {
    setShowFirstTimeWizard(false);
    setIsFirstTimeUser(false);
    setShowLanding(false);
    setShowDashboard(false);
    setCurrentStep(0);
    sessionStorage.setItem('nylta_firstTimeUser', 'false');
  };

  const handleCloseWizard = () => {
    setShowFirstTimeWizard(false);
  };

  // Check URL for specific routes - runs on mount and handles direct navigation
  React.useEffect(() => {
    const path = window.location.pathname;
    
    console.log('Current pathname:', path); // Debug log
    
    if (path === '/demo' || window.location.hash === '#demo') {
      setShowLanding(false);
      setShowBulkFilingDemo(true);
    } else if (path === '/create-admin' || window.location.hash === '#create-admin') {
      setCurrentView('create-admin');
      setShowLanding(false);
    } else if (path === '/what-happens-next') {
      console.log('Setting view to what-happens-next'); // Debug log
      setCurrentView('what-happens-next');
      setShowLanding(false);
      setShowDashboard(false);
      setShowMemberProfile(false);
      setShowAdminDashboard(false);
      setShowBulkFilingDemo(false);
    }
    else if (path === '/docs' || path === '/documentation') {
      console.log('Setting view to docs'); // Debug log
      setCurrentView('docs');
      setShowLanding(false);
      setShowDashboard(false);
      setShowMemberProfile(false);
      setShowAdminDashboard(false);
      setShowBulkFilingDemo(false);
    }
    else if (path === '/terms') {
      console.log('Setting view to terms'); // Debug log
      setCurrentView('terms');
      setShowLanding(false);
      setShowDashboard(false);
      setShowMemberProfile(false);
      setShowAdminDashboard(false);
      setShowBulkFilingDemo(false);
    }
    else if (path === '/privacy') {
      console.log('Setting view to privacy'); // Debug log
      setCurrentView('privacy');
      setShowLanding(false);
      setShowDashboard(false);
      setShowMemberProfile(false);
      setShowAdminDashboard(false);
      setShowBulkFilingDemo(false);
    }
  }, []);

  // Documentation Download Page
  if (currentView === 'docs') {
    return <DocumentationDownloadPage 
      onBack={() => {
        setCurrentView('landing');
        setShowAdminDashboard(true);
        setShowLanding(false);
        setShowDashboard(false);
        setShowMemberProfile(false);
        setShowBulkFilingDemo(false);
      }}
    />;
  }
  
  // Terms of Service Page
  if (currentView === 'terms') {
    return <TermsOfService 
      onBack={() => {
        setCurrentView('landing');
        setShowLanding(true);
      }}
    />;
  }
  
  // Privacy Policy Page
  if (currentView === 'privacy') {
    return <PrivacyPolicy 
      onBack={() => {
        setCurrentView('landing');
        setShowLanding(true);
      }}
    />;
  }

  // Create Ryan Admin Page
  if (currentView === 'create-ryan-admin') {
    return <CreateRyanAdmin />;
  }

  // Show What Happens Next Page - CHECK THIS FIRST
  if (currentView === 'what-happens-next') {
    console.log('Rendering WhatHappensNext component'); // Debug log
    return <WhatHappensNext 
      onBack={() => {
        setCurrentView('landing');
        setShowLanding(true);
      }}
    />;
  }

  // Show Admin Creation Page
  if (currentView === 'create-admin') {
    return <CreateAdminAccount />;
  }

  // Show Bulk Filing Demo
  if (showBulkFilingDemo) {
    return <BulkFilingDemo />;
  }

  // Show landing page for registration
  if (showLanding) {
    return (
      <LandingPage 
        onAccessGranted={() => {
          setShowLanding(false);
          setShowDashboard(true);
        }}
        onAdminAccess={() => {
          setShowLanding(false);
          setShowAdminDashboard(true);
        }}
        onWhatHappensNext={() => {
          setCurrentView('what-happens-next');
          setShowLanding(false);
        }}
      />
    );
  }

  // Show member profile
  if (showMemberProfile) {
    return <MemberProfile 
      onBack={() => {
        setShowMemberProfile(false);
        setShowDashboard(true);
      }}
      onStartNewFiling={() => {
        setShowMemberProfile(false);
        setShowDashboard(false);
        setCurrentStep(0);
      }}
    />;
  }

  // Show dashboard after login
  if (showDashboard && currentView !== 'firm-profile') {
    // REMOVED GATE 1: Show dashboard with warning banner instead of blocking
    // Old code: if (!isLoadingProfile && !firmProfileComplete) { return <ProfileCompletionGate... /> }
    
    // GATE 2: SURVEY COMPLETION GATE - Block access until survey is complete (after profile)
    if (!isLoadingProfile && !isLoadingSurvey && firmProfileComplete && !surveyComplete) {
      return <SurveyCompletionGate 
        onCompleteSurvey={() => {
          setSurveyComplete(true);
          // Force re-render to show dashboard
          setDashboardKey(prev => prev + 1);
        }}
      />;
    }

    return (
      <>
        <Dashboard 
          onStartBulkFiling={() => {
            setShowDashboard(false);
            setCurrentStep(0); // Go directly to wizard - auto-detect domestic/foreign from countryOfFormation
          }} 
          onViewSubmissions={() => {
            setShowDashboard(false);
            setShowMemberProfile(true);
          }}
          onAdminAccess={() => {
            setShowDashboard(false);
            setShowAdminDashboard(true);
          }}
          onLogout={() => {
            setShowDashboard(false);
            setShowLanding(true);
            setFirmInfo(null);
            sessionStorage.clear();
          }}
          onCompleteFirmProfile={() => {
            setCurrentView('firm-profile');
            setShowDashboard(false);
          }}
          onEditProfile={() => {
            setCurrentView('firm-profile');
            setShowDashboard(false);
          }}
          contactName={account?.contactName || firmInfo?.contactPerson}
          firmName={account?.firmName || firmInfo?.firmName}
          firmProfileComplete={firmProfileComplete}
          isLoadingProfile={isLoadingProfile}
          key={dashboardKey}
        />
        
        {/* First-time user wizard - only shown when authenticated */}
        <FirstTimeUserWizard 
          isOpen={showFirstTimeWizard}
          onClose={handleCloseWizard}
          onStartProfile={handleStartProfile}
          firmName={firmInfo?.firmName}
          contactName={firmInfo?.contactPerson}
        />
      </>
    );
  }

  // Show admin dashboard
  if (showAdminDashboard) {
    return <AdminDashboard 
      onBack={() => {
        setShowAdminDashboard(false);
        setShowDashboard(true);
      }}
      onNavigateToDocs={() => {
        setCurrentView('docs');
        setShowAdminDashboard(false);
        setShowDashboard(false);
        setShowLanding(false);
        setShowMemberProfile(false);
        setShowBulkFilingDemo(false);
      }}
    />;
  }

  // Show Firm Profile page
  if (currentView === 'firm-profile') {
    return <FirmProfile 
      isFirstTime={true}
      onComplete={() => {
        // Refresh profile check after completion
        setFirmProfileComplete(true);
        setCurrentView('profile-success');
      }}
      onBack={() => {
        setCurrentView('dashboard');
        setShowDashboard(true);
      }}
    />;
  }

  // Show Profile Success/Congratulations page
  if (currentView === 'profile-success') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b-4 border-yellow-400">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <ImageWithFallback 
                src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                alt="NYLTA.com Logo"
                className="h-8 sm:h-10 md:h-12 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-none"
              />
              <div>
                <h1 className="text-gray-900 text-3xl">Profile Complete!</h1>
                <p className="text-gray-600 mt-1">You're all set to start filing</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white border-2 border-green-500 shadow-lg p-8 md:p-12 text-center">
            {/* Success Card */}
            <Card className="border border-gray-200 shadow-sm max-w-3xl mx-auto">
              <CardContent className="pt-12 pb-10 text-center">
                {/* Checkmark Icon - More Professional */}
                <div className="flex justify-center mb-6">
                  <div className="bg-green-500 rounded-full p-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                {/* Heading */}
                <h2 className="text-2xl text-gray-900 mb-3">
                  Profile Complete!
                </h2>
                <p className="text-gray-600 mb-8">
                  Your firm profile has been successfully completed
                </p>

                {/* Success Details */}
                <div className="bg-gray-50 border border-gray-200 p-6 mb-8 text-left max-w-2xl mx-auto">
                  <h3 className="font-semibold text-[#00274E] mb-4 text-lg">What happens next:</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#00274E] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm">✓</span>
                      </div>
                      <p className="text-gray-700">
                        <strong>Your firm information is saved:</strong> You won't need to re-enter this information for future bulk filings.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-[#00274E] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm">✓</span>
                      </div>
                      <p className="text-gray-700">
                        <strong>Authorized filers are active:</strong> Your team members can now submit bulk filings on behalf of your firm.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-[#00274E] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm">✓</span>
                      </div>
                      <p className="text-gray-700">
                        <strong>Ready for bulk filing:</strong> You can now upload client lists and begin processing NYLTA filings efficiently.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    onClick={() => {
                      setCurrentView('dashboard');
                      setShowDashboard(false);
                      setCurrentStep(0);
                    }}
                    className="bg-[#00274E] hover:bg-[#003d73] text-white px-12 py-6 text-lg"
                    size="lg"
                  >
                    Start Bulk Filing Now
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentView('dashboard');
                      setShowDashboard(true);
                      setDashboardKey(prev => prev + 1); // Force dashboard to remount and re-check profile
                    }}
                    variant="outline"
                    className="border-gray-300 text-gray-700 px-8 py-6 text-lg"
                    size="lg"
                  >
                    Go to Dashboard
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-4">
                    Need to make changes to your firm profile?
                  </p>
                  <p className="text-sm text-gray-500">
                    You can update your profile information anytime from your dashboard. Changes to sensitive fields (EIN, Legal Business Name) require admin approval.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Start Tips */}
            <div className="mt-8 bg-blue-50 border border-blue-200 p-6">
              <h3 className="font-semibold text-[#00274E] mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Quick Start Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>Prepare your client list in CSV format with required fields (LLC Name, NYDOS ID, EIN, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>Upload your list and our system will validate all company information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>Review exemptions, add beneficial owners where needed, and submit for processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>Take advantage of volume discounts - the more companies you file, the lower the per-filing cost!</span>
                </li>
              </ul>
            </div>
          </div>
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



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ImageWithFallback 
                src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                alt="NYLTA.com Logo"
                className="h-8 sm:h-10 md:h-12 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-none"
              />
              <div>
                <h1 className="text-gray-900">Bulk Filing</h1>
                <p className="text-gray-600 text-sm">For CPAs, Attorneys, and Compliance Professionals</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleBackToDashboard}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">
                Step {currentStep + 1} of {totalSteps}: {stepTitles[currentStep]}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {stepTitles.map((title, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;
              const isAccessible = index <= maxStepReached;
              
              // Check if ALL clients are exemption (skip steps 2 and 3)
              const allExemption = clients.length > 0 && clients.every(c => c.filingType === 'exemption');
              const isSkippedStep = allExemption && (index === 2 || index === 3); // Steps 2 (Company Applicant) and 3 (Beneficial Owners)
              
              return (
                <button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  disabled={!isAccessible || isSkippedStep}
                  className={`flex flex-col items-center flex-1 transition-all ${
                    (isAccessible && !isSkippedStep) ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                    isSkippedStep ? 'bg-red-600 text-white' : // Red block for skipped steps
                    isCompleted ? 'bg-[#00274E] text-white' :
                    isActive ? 'bg-gray-700 text-white border-2 border-yellow-400' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {isSkippedStep ? '⛔' : isCompleted ? '✓' : index + 1}
                  </div>
                  <span className={`text-xs mt-2 text-center hidden md:block transition-all ${
                    isActive ? 'text-gray-900 font-semibold' : 'text-gray-600'
                  }`}>
                    {title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 0: Upload Client List (includes per-client filing intent) */}
        {currentStep === 0 && (
          <Step2ClientUpload 
            onComplete={handleStep0Complete} 
            onBack={handleBack} 
            initialClients={clients}
            firmWorkers={firmProfileData?.authorizedFilers}
          />
        )}
        
        {/* Step 1: Filing Intent (review/edit per-client filing intent) */}
        {currentStep === 1 && (
          <FilingIntentDecision 
            clients={clients} 
            onComplete={handleStep1Complete} 
            onBack={handleBack} 
          />
        )}
        
        {/* Step 2: Company Applicant (ONLY disclosure clients) */}
        {currentStep === 2 && (
          <Step3FirmCompanyApplicant 
            clients={clients.filter(c => c.filingType === 'disclosure')} 
            firmWorkers={firmProfileData?.authorizedFilers}
            onComplete={handleStep2Complete} 
            onBack={handleBack} 
          />
        )}
        
        {/* Step 3: Beneficial Owners (ONLY disclosure clients) */}
        {currentStep === 3 && (
          <Step3BeneficialOwners 
            clients={clients.filter(c => c.filingType === 'disclosure')} 
            onComplete={handleStep3Complete} 
            onBack={handleBack} 
          />
        )}
        
        {/* Step 4: Exemption Category (ONLY exemption clients - filtered) */}
        {currentStep === 4 && (
          <Step3ExemptionCategory 
            clients={clients.filter(c => c.filingType === 'exemption')}
            totalClients={clients.length}
            onComplete={handleStep4Complete} 
            onBack={handleBack} 
          />
        )}
        
        {/* Step 5: Review Summary */}
        {currentStep === 5 && (
          <Step4ReviewSummary 
            clients={clients} 
            onComplete={handleStep5Complete} 
            onBack={handleBack}
            onUpdateClient={(clientId, updates) => {
              setClients(prevClients =>
                prevClients.map(client =>
                  client.id === clientId ? { ...client, ...updates } : client
                )
              );
            }}
          />
        )}
        
        {/* Step 6: Payment */}
        {currentStep === 6 && (
          <Step5Payment 
            paymentSelection={paymentSelection} 
            firmInfo={firmProfileData}
            clients={clients}
            onComplete={handleStep6Complete} 
            onBack={handleBack} 
          />
        )}
        
        {/* Step 7: Confirmation */}
        {currentStep === 7 && (
          <Step6Confirmation data={confirmationData} />
        )}
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

function Root() {
  return (
    <AuthProvider>
      <App />
      <Toaster />
    </AuthProvider>
  );
}

export default Root;