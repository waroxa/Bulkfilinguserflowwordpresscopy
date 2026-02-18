import { useState, useEffect } from "react";
import { DollarSign, Users, FileText, Clock, TrendingUp, BarChart3, CheckCircle2, XCircle, AlertCircle, Download, Mail, User, Shield, Zap, Building2, MapPin, Home, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import MemberProfile from "./MemberProfile";
import AdminDashboard from "./AdminDashboard";
import MyFirmProfile from "./MyFirmProfile";
import MySubmissions from "./MySubmissions";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Alert, AlertDescription } from "./ui/alert";
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Define props interface
interface DashboardProps {
  onStartBulkFiling?: () => void;
  onViewSubmissions?: () => void;
  onAdminAccess?: () => void;
  onLogout?: () => void;
  onCompleteFirmProfile?: () => void;
  contactName?: string;
  firmName?: string;
  onEditProfile?: () => void;
  firmProfileComplete?: boolean;
  isLoadingProfile?: boolean;
}

// Pricing tier interface
interface PricingTier {
  name: string;
  label: string;
  popular: boolean;
  bestValue: boolean;
  min: number;
  max: number;
  price: number;
  originalPrice: number;
  features: string[];
}

// Define the base URL for the WordPress REST API
const WP_API_BASE = '/wp-json/nylta/v1';

export default function Dashboard({ onStartBulkFiling, onViewSubmissions, onAdminAccess, onLogout, onCompleteFirmProfile, contactName = "John Anderson", firmName = "Anderson & Associates CPA", onEditProfile, firmProfileComplete, isLoadingProfile }: DashboardProps) {
  const [currentView, setCurrentView] = useState<'landing' | 'bulk-filing' | 'submissions' | 'my-submissions' | 'profile' | 'firm-profile' | 'admin'>('landing');
  const { signOut, session } = useAuth();
  
  // Test function to create sample monitoring payment
  const createTestMonitoringPayment = async () => {
    if (!session?.access_token) {
      toast.error('No session found. Please log in.');
      return;
    }

    try {
      toast.info('Creating test monitoring payment...');
      
      const testPayment = {
        firmName: firmName || 'Test Firm LLC',
        firmEIN: '12-3456789',
        submissionNumber: `TEST-MONITORING-${Date.now()}`,
        serviceType: 'monitoring',
        clientCount: 3,
        amountPaid: 747, // 3 clients × $249
        paymentStatus: 'paid',
        paymentMethod: 'ach',
        clients: [
          {
            id: 'test-client-1',
            llcName: 'Test LLC 1',
            nydosId: '1234567',
            ein: '12-3456789',
            filingType: 'disclosure'
          },
          {
            id: 'test-client-2',
            llcName: 'Test LLC 2',
            nydosId: '2345678',
            ein: '23-4567890',
            filingType: 'exemption',
            exemptionCategory: 'Publicly Traded'
          },
          {
            id: 'test-client-3',
            llcName: 'Test LLC 3',
            nydosId: '3456789',
            ein: '34-5678901',
            filingType: 'disclosure'
          }
        ],
        metadata: {
          ipAddress: '127.0.0.1'
        }
      };

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2c01e603/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testPayment)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Test payment created:', data);
        toast.success('Test monitoring payment created! Check "My Submissions"');
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to create test payment:', errorText);
        toast.error('Failed to create test payment: ' + errorText);
      }
    } catch (error) {
      console.error('❌ Error creating test payment:', error);
      toast.error('Error: ' + String(error));
    }
  };
  
  const [pricingTiers, setPricingTiers] = useState<Record<string, PricingTier>>(  {
    tier1: {
      name: 'Professional Batch Filing',
      label: 'Tier 1',
      popular: true,
      bestValue: false,
      min: 1,
      max: 25,
      price: 398.00,
      originalPrice: 398.00,
      features: ['1–25 entities per batch', 'Automated validation', 'Individual entity receipts', 'Standard email support']
    },
    tier2: {
      name: 'Managed Batch Filing',
      label: 'Tier 2',
      popular: false,
      bestValue: false,
      min: 26,
      max: 75,
      price: 378.10,
      originalPrice: 398.00,
      features: ['26–75 entities per batch', 'Batch export & reporting', 'Priority email support']
    },
    tier3: {
      name: 'Portfolio Filing',
      label: 'Tier 3',
      popular: false,
      bestValue: false,
      min: 76,
      max: 150,
      price: 358.20,
      originalPrice: 398.00,
      features: ['76–150 entities per batch', 'Advanced reporting', 'Dedicated phone support', 'Designed for firms managing NYLTA at scale']
    },
    tier4: {
      name: 'Enterprise & Custom',
      label: 'Custom',
      popular: false,
      bestValue: false,
      min: 151,
      max: 999999,
      price: 0,
      originalPrice: 0,
      features: ['150+ entity filings', 'Custom rates', 'White-glove service', 'Dedicated account manager']
    }
  });

  // REMOVED: Duplicate firm profile check - now handled by App.tsx
  // The firmProfileComplete and isLoadingProfile props are passed from App.tsx

  // Fetch pricing data from WordPress API
  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        // Fetch pricing tiers
        const pricingResponse = await fetch(`${WP_API_BASE}/pricing`);
        if (pricingResponse.ok && pricingResponse.headers.get('content-type')?.includes('application/json')) {
          const tiers = await pricingResponse.json();
          setPricingTiers(tiers);
        }
      } catch (error) {
        // Silently fall back to default values if API fails - this is expected in development
        // Default values are already set in the initial state
      }
    };

    fetchPricingData();
  }, []);

  const getPricingForVolume = (count: number) => {
    if (count <= 25) return { base: 398, discounted: 358.20, discount: "10% off" };
    if (count <= 75) return { base: 398, discounted: 389, discount: "2.3% off" };
    if (count <= 150) return { base: 398, discounted: 375, discount: "5.8% off" };
    return { base: 398, discounted: 0, discount: "Custom" };
  };

  // Render different views based on currentView state
  if (currentView === 'firm-profile') {
    return <MyFirmProfile onBack={() => setCurrentView('landing')} />;
  }
  
  if (currentView === 'profile') {
    return <MemberProfile onBack={() => setCurrentView('landing')} onStartNewFiling={() => {
      setCurrentView('landing');
      if (onStartBulkFiling) onStartBulkFiling();
    }} />;
  }

  if (currentView === 'admin') {
    return <AdminDashboard onBack={() => setCurrentView('landing')} />;
  }

  if (currentView === 'my-submissions') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b-4 border-yellow-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageWithFallback 
                  src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                  alt="NYLTA.com Logo"
                  className="h-10 sm:h-12 w-auto"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl text-gray-900">My Submissions</h1>
                  <p className="text-gray-600 text-sm">View and manage your filing history</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setCurrentView('landing')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MySubmissions />
        </div>
      </div>
    );
  }

  // Landing page view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <ImageWithFallback 
                src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                alt="NYLTA.com Logo"
                className="h-10 sm:h-12 w-auto"
              />
              <div>
                <h1 className="text-xl sm:text-2xl text-gray-900">Bulk Filing Dashboard</h1>
                <p className="text-gray-600 text-sm">Welcome back, {contactName}</p>
              </div>
            </div>
            
            {/* Status Badge - Show when profile is incomplete */}
            {!isLoadingProfile && !firmProfileComplete && (
              <div className="sm:flex-1 sm:flex sm:justify-center">
                <div className="bg-yellow-400 text-[#00274E] px-4 py-2 inline-flex items-center gap-2 font-semibold text-sm">
                  <AlertCircle className="h-5 w-5" />
                  Action Required: Complete Firm Profile
                </div>
              </div>
            )}
            
            {/* Navigation Buttons - Responsive */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Yellow Start Bulk Filing Button */}
              <Button
                onClick={() => {
                  if (firmProfileComplete) {
                    if (onStartBulkFiling) onStartBulkFiling();
                  } else {
                    toast.error("Please complete your firm profile before starting bulk filing");
                    setCurrentView('firm-profile');
                  }
                }}
                className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#00274E] border-0"
                size="sm"
              >
                <Zap className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Start Bulk Filing</span>
              </Button>
              
              <Button
                onClick={() => {
                  if (onEditProfile) onEditProfile();
                }}
                variant="outline"
                className="bg-white text-[#00274E] border-white hover:bg-gray-100"
                size="sm"
              >
                <User className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Firm Profile</span>
              </Button>
              <Button
                onClick={() => {
                  setCurrentView('my-submissions');
                }}
                variant="outline"
                className="bg-white text-[#00274E] border-white hover:bg-gray-100"
                size="sm"
              >
                <FileText className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">My Submissions</span>
              </Button>
              <Button
                onClick={() => {
                  if (onAdminAccess) onAdminAccess();
                }}
                variant="outline"
                className="bg-white text-[#00274E] border-white hover:bg-gray-100"
                size="sm"
              >
                <Shield className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Admin Dashboard</span>
              </Button>
              <Button
                onClick={() => {
                  signOut();
                  if (onLogout) onLogout();
                }}
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white hover:text-[#00274E]"
                size="sm"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Log Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* YELLOW WARNING BANNER - Profile Incomplete */}
        {!isLoadingProfile && !firmProfileComplete && (
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg text-yellow-900 mb-2">
                  <strong>Action Required: Complete Your Firm Profile</strong>
                </h3>
                <p className="text-yellow-800 leading-relaxed mb-4">
                  Before you can start bulk filing, you need to complete your firm profile. This is a one-time setup that includes 
                  your firm's legal business name, EIN, address, and authorized filers. It takes approximately 5-10 minutes.
                </p>
                <Button
                  onClick={() => {
                    if (onEditProfile) {
                      onEditProfile();
                    }
                  }}
                  className="bg-[#00274E] hover:bg-[#003d73] text-white"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Complete Firm Profile Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {isLoadingProfile ? (
          // Loading state
          <div className="max-w-3xl mx-auto text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
            <p className="text-gray-500 mt-4">Loading your profile...</p>
          </div>
        ) : (
          // Normal dashboard content
          <>
            {/* Welcome Section */}
            <div className="mt-6 mb-16 bg-white border-l-4 border-[#00274E] p-8 shadow-sm">
              <div className="max-w-4xl">
                {contactName ? (
                  <>
                    <h2 className="text-gray-900 text-3xl mb-4">
                      Welcome, {contactName}
                    </h2>
                    {firmName && (
                      <p className="text-gray-700 mb-4 text-xl">
                        {firmName}
                      </p>
                    )}
                  </>
                ) : (
                  <h2 className="text-gray-900 mb-4">Professional Bulk Filing Services</h2>
                )}
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  The NYLTA.com Bulk Filing Portal is designed exclusively for certified public accountants, licensed attorneys, 
                  and compliance professionals who file New York LLC Transparency Act reports on behalf of multiple clients.
                </p>
                <p className="text-gray-600">
                  Our secure, government-compliant system streamlines the submission process with automated validation, 
                  batch processing capabilities, and volume-based pricing structures designed for professional service providers.
                </p>
              </div>
            </div>



            {/* Why Bulk File With Us */}
            <section className="mb-16">
              <div className="bg-[#00274E] border-b-4 border-yellow-400 mb-8 py-6 px-8">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-white mb-2">Who This Is For</h3>
                  <p className="text-gray-300">
                    Professional services firms authorized to file on behalf of New York LLCs
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border border-gray-300 shadow-sm">
                  <CardHeader className="bg-white border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-[#00274E]" />
                      </div>
                      <CardTitle className="text-base">CPAs & Accountants</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600">
                      File for all your LLC clients in one session with built-in validation and compliance checks.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-300 shadow-sm">
                  <CardHeader className="bg-white border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-[#00274E]" />
                      </div>
                      <CardTitle className="text-base">Law Firms</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600">
                      Streamline NYLTA reporting for multiple corporate clients with one authorized submission.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-300 shadow-sm">
                  <CardHeader className="bg-white border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-[#00274E]" />
                      </div>
                      <CardTitle className="text-base">Compliance Professionals</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600">
                      Manage high-volume NYLTA requirements efficiently with our professional-grade bulk portal.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-300 shadow-sm">
                  <CardHeader className="bg-white border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-[#00274E]" />
                      </div>
                      <CardTitle className="text-base">Registered Agents</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600">
                      Offer NYLTA filing as an additional service to your LLC formation and compliance clients.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* How Bulk Filing Works */}
            <section className="mb-16">
              <div className="bg-[#00274E] border-b-4 border-yellow-400 mb-8 py-6 px-8">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-white mb-2">Filing Process Overview</h3>
                  <p className="text-gray-300">
                    Comprehensive 6-step workflow from registration to confirmation
                  </p>
                </div>
              </div>
              <Card className="shadow-sm border border-gray-300">
                <CardContent className="pt-8">
                  <div className="space-y-8">
                    <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#00274E] text-white rounded flex items-center justify-center text-lg border-4 border-yellow-400">
                        1
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-2">Firm Registration & Authorization</h4>
                        <p className="text-gray-600 leading-relaxed">
                          Register your professional firm credentials including EIN, professional license type, 
                          and authorized signatory information. Confirm your authority to file on behalf of client entities.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#00274E] text-white rounded flex items-center justify-center text-lg border-4 border-yellow-400">
                        2
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-2">Client Data Upload</h4>
                        <p className="text-gray-600 leading-relaxed">
                          Upload client entity information via standardized Excel template or CSV import. 
                          System supports up to 150 companies per batch with automated field validation and duplicate detection.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#00274E] text-white rounded flex items-center justify-center text-lg border-4 border-yellow-400">
                        3
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-2">Beneficial Ownership & Applicant Information</h4>
                        <p className="text-gray-600 leading-relaxed">
                          For non-exempt entities, provide beneficial owner details including ownership percentages and 
                          up to two company applicants with designated roles. Exempt entities require exemption type and 
                          detailed attestation documentation.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#00274E] text-white rounded flex items-center justify-center text-lg border-4 border-yellow-400">
                        4
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-2">Review & Selective Filing</h4>
                        <p className="text-gray-600 leading-relaxed">
                          Comprehensive review interface displaying all submitted data with validation status. 
                          Select specific entities for filing and exclude incomplete or pending submissions as needed.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#00274E] text-white rounded flex items-center justify-center text-lg border-4 border-yellow-400">
                        5
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-2">Secure Payment Authorization</h4>
                        <p className="text-gray-600 leading-relaxed">
                          Authorize payment via encrypted ACH bank transfer. Volume discounts automatically calculated 
                          based on number of entities filed. All payment processing is PCI-DSS compliant.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#00274E] text-white rounded flex items-center justify-center text-lg border-4 border-yellow-400">
                        6
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-2">Confirmation & Documentation</h4>
                        <p className="text-gray-600 leading-relaxed">
                          Receive immediate confirmation with individual PDF filing receipts for each submitted entity. 
                          Receipts include submission timestamp, filing reference number, and complete data summary for client records.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Service Tiers - Monitoring vs Filing */}
            <section className="mb-16">
              <div className="bg-[#00274E] border-b-4 border-yellow-400 mb-8 py-6 px-8">
                <div className="max-w-7xl mx-auto text-center">
                  <h3 className="text-white mb-2">Choose Your Service Level</h3>
                  <p className="text-gray-300">
                    Select the service tier that matches your firm's compliance needs
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
                {/* Compliance Monitoring Service */}
                <Card className="group border-2 border-gray-400 shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-[#00274E]">
                  <CardHeader className="bg-gray-100 border-b-2 border-gray-400 group-hover:bg-[#00274E] group-hover:border-b-4 group-hover:border-yellow-400 transition-all duration-300 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl text-gray-900 group-hover:text-white transition-all duration-300">
                        Compliance Monitoring
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-600 group-hover:text-gray-200 transition-all duration-300">
                      Data Storage & Readiness Service
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 bg-white">
                    <div className="mb-6">
                      <p className="text-gray-900 mb-1">
                        <span className="text-4xl font-bold">$249</span>
                      </p>
                      <p className="text-sm text-gray-600">per client entity</p>
                    </div>
                    
                    <div className="mb-6 bg-blue-50 border-l-4 border-[#00274E] p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Securely store client data and maintain compliance readiness without immediate NYDOS submission.
                      </p>
                    </div>

                    <Alert className="mb-6 bg-gray-50 border-gray-300">
                      <AlertCircle className="h-4 w-4 text-gray-600" />
                      <AlertDescription className="text-sm text-gray-700">
                        Monitoring is a flat annual rate of $249 per entity. No volume discounts apply.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3 text-sm text-gray-700 mb-6">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#00274E] mt-0.5 flex-shrink-0" />
                        <span>Secure data storage in compliance-ready format</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#00274E] mt-0.5 flex-shrink-0" />
                        <span>Real-time data validation and error checking</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#00274E] mt-0.5 flex-shrink-0" />
                        <span>Beneficial owner & exemption data management</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#00274E] mt-0.5 flex-shrink-0" />
                        <span>Upgrade to filing anytime (pay only $149 difference)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#00274E] mt-0.5 flex-shrink-0" />
                        <span>Email support for data management</span>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-400 rounded p-3 mb-4">
                      <p className="text-xs text-gray-700 font-semibold">
                        💡 Perfect for firms preparing client data in advance
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Bulk Filing Service */}
                <Card className="group border-2 border-[#00274E] shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-105 relative">
                  {/* Most Popular Badge */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-yellow-400 text-[#00274E] px-4 py-1 rounded-full shadow-lg">
                      <p className="text-xs font-bold uppercase">Most Popular</p>
                    </div>
                  </div>

                  <CardHeader className="bg-[#00274E] border-b-4 border-yellow-400 transition-all duration-300 pb-6 pt-8">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl text-white transition-all duration-300">
                        Bulk Filing
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-300 transition-all duration-300">
                      Complete NYDOS Filing Service
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 bg-white">
                    <div className="mb-6">
                      <p className="text-gray-900 mb-1">
                        <span className="text-4xl font-bold">$398</span>
                      </p>
                      <p className="text-sm text-gray-600">per client entity</p>
                      <p className="text-xs text-gray-500 mt-1">(Volume discounts available - see below)</p>
                    </div>
                    
                    <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <strong>Full-service filing</strong> including official NYDOS submission, confirmation, and compliance certificates.
                      </p>
                    </div>

                    <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                      Everything in Monitoring, Plus:
                    </h4>

                    <div className="space-y-3 text-sm text-gray-700 mb-6">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="font-semibold">Official submission to NY Department of State</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="font-semibold">Government filing confirmation & tracking</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="font-semibold">Official compliance certificates (PDF)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="font-semibold">Priority phone & email support</span>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-400 rounded p-3 mb-4">
                      <p className="text-xs text-gray-700 font-semibold">
                        ✅ REQUIRED FOR ALL FOREIGN LLCs
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center bg-blue-50 border border-blue-200 rounded p-6 max-w-4xl mx-auto">
                <h4 className="text-lg font-semibold text-[#00274E] mb-2">Seamless Upgrade Path</h4>
                <p className="text-gray-700 leading-relaxed">
                  Start with Compliance Monitoring ($249) and upgrade to Bulk Filing anytime by paying only the <strong>$149 difference</strong>. 
                  Zero double-charging guaranteed.
                </p>
              </div>
            </section>

            {/* Pricing Tiers */}
            <section className="mb-16">
              <div className="bg-[#00274E] border-b-4 border-yellow-400 mb-8 py-6 px-8">
                <div className="max-w-7xl mx-auto text-center">
                  <h2 className="text-white mb-2 text-3xl font-bold">Bulk Filing Volume Discounts</h2>
                  <p className="text-gray-300">
                    Save more when you file in larger batches. Volume discounts automatically apply at checkout based on your submission size.
                  </p>
                  <p className="text-gray-400 text-sm mt-2 italic">
                    Discount applied at checkout—not shown as a calculated per-unit price.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {pricingTiers && Object.values(pricingTiers).map(tier => (
                  <Card 
                    key={tier.label} 
                    className={`group border-2 ${tier.popular ? 'border-[#00274E]' : 'border-gray-400'} shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-[#00274E] cursor-pointer`}
                  >
                    <CardHeader className={`transition-all duration-300 pb-6 ${
                      tier.popular 
                        ? 'bg-[#00274E] border-b-4 border-yellow-400' 
                        : 'bg-gray-100 border-b-2 border-gray-400 group-hover:bg-[#00274E] group-hover:border-b-4 group-hover:border-yellow-400'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className={`text-xl transition-all duration-300 ${
                          tier.popular 
                            ? 'text-white' 
                            : 'text-gray-900 group-hover:text-white'
                        }`}>{tier.label}</CardTitle>
                        {tier.popular && <span className="bg-yellow-400 text-[#00274E] px-3 py-1 text-xs font-semibold">POPULAR</span>}
                      </div>
                      <CardDescription className={`transition-all duration-300 ${
                        tier.popular 
                          ? 'text-gray-300' 
                          : 'text-gray-600 group-hover:text-gray-200'
                      }`}>{tier.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 bg-white">
                      <div className="mb-6">
                        {tier.label !== 'Custom' ? (
                          <>
                            <p className="text-gray-900 mb-2 text-center">
                              <span className="text-4xl font-bold">${tier.price.toFixed(2)}</span>
                            </p>
                            <p className="text-sm text-gray-600 text-center mb-4">per entity</p>
                            <p className="text-xs text-gray-600 text-center px-2 leading-relaxed">
                              {tier.label === 'Tier 1' && 'Standard filing rate'}
                              {tier.label === 'Tier 2' && 'Reduced per-entity rate for managed volume'}
                              {tier.label === 'Tier 3' && 'Preferred portfolio rate'}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-gray-900 mb-2 text-center">
                              <span className="text-2xl font-semibold">Schedule a Compliance Intake Call</span>
                            </p>
                            <p className="text-sm text-gray-600 text-center">Custom enterprise pricing for 150+ entities</p>
                          </>
                        )}
                      </div>
                      <div className="space-y-3 text-sm text-gray-700 mb-6">
                        {tier.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#00274E] mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      {tier.label === 'Custom' && (
                        <Button
                          onClick={() => window.open('https://link.nylta.com/widget/bookings/tiffany-colon-gmail-personal-calendar-2ozjacoji', '_blank')}
                          className="w-full bg-[#00274E] hover:bg-[#003d73] text-white rounded-none"
                        >
                          Schedule Call
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  All pricing tiers automatically calculated at checkout. Volume discounts applied based on your foreign entity filing batch size.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Volume discounts apply only to foreign entity filing services (not monitoring or domestic filings) and are applied at checkout.
                </p>
              </div>
            </section>

            {/* Professional Advantages */}
            <section className="mb-16">
              <div className="bg-[#00274E] border-b-4 border-yellow-400 mb-8 py-6 px-8">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-white mb-2">Professional Advantages</h3>
                  <p className="text-gray-300">
                    Advanced capabilities designed specifically for high-volume professional filers
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-gray-300 shadow-sm">
                  <CardHeader className="bg-white border-b border-gray-200 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <Zap className="h-6 w-6 text-[#00274E]" />
                      </div>
                      <CardTitle className="text-lg">Efficient Processing</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-600 leading-relaxed">
                      Process up to 150 NYLTA filings simultaneously through our advanced bulk submission system. 
                      Automated data validation and compliance checking eliminates manual review time while ensuring 
                      accuracy and regulatory compliance.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-300 shadow-sm">
                  <CardHeader className="bg-white border-b border-gray-200 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <DollarSign className="h-6 w-6 text-[#00274E]" />
                      </div>
                      <CardTitle className="text-lg">Volume-Based Pricing</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-600 leading-relaxed">
                      Professional pricing tiers reward high-volume filers with substantial discounts. 
                      Starting at 10% savings for small batches, scaling to custom enterprise pricing for 
                      firms filing 150+ entities per submission.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-300 shadow-sm">
                  <CardHeader className="bg-white border-b border-gray-200 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <Shield className="h-6 w-6 text-[#00274E]" />
                      </div>
                      <CardTitle className="text-lg">Secure & Compliant</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-600 leading-relaxed">
                      Bank-grade 256-bit encryption, secure ACH payment processing, and full compliance with 
                      New York State data protection requirements. All submissions validated against current 
                      NYLTA regulatory standards.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-16">
              <div className="bg-[#00274E] border-b-4 border-yellow-400 mb-8 py-6 px-8">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-white mb-2">Frequently Asked Questions</h3>
                  <p className="text-gray-300">
                    Common questions about the NYLTA bulk filing process
                  </p>
                </div>
              </div>
              <Card className="border border-gray-300 shadow-sm">
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>What is NYLTA and who needs to file?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600">
                          The New York LLC Transparency Act (NYLTA) requires most New York LLCs to report beneficial ownership information to the State. This includes identifying individuals who own 25% or more of the LLC or exercise substantial control. Some entities may qualify for exemptions based on their business type or structure.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>How does the bulk filing process work?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600 mb-3">
                          Our 6-step process guides you through:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-gray-600">
                          <li>Firm registration and authorization confirmation</li>
                          <li>Upload client list via Excel/CSV or manual entry</li>
                          <li>Add beneficial owner and company applicant data for each entity</li>
                          <li>Review summary and select which companies to file</li>
                          <li>Secure ACH payment authorization with automatic volume discounts</li>
                          <li>Download individual PDF receipts for each filing</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>What information do I need for each company?</AccordionTrigger>
                      <AccordionContent>
                        <div className="text-gray-600 space-y-3">
                          <p><strong>Required for all companies:</strong></p>
                          <ul className="list-disc list-inside ml-4">
                            <li>LLC legal name</li>
                            <li>Formation date</li>
                            <li>Country and state of formation</li>
                            <li>Filing status (Exempt or Non-Exempt)</li>
                            <li>Up to 2 company applicants with their role</li>
                          </ul>
                          <p><strong>For Exempt entities:</strong></p>
                          <ul className="list-disc list-inside ml-4">
                            <li>Exemption type and detailed explanation</li>
                          </ul>
                          <p><strong>For Non-Exempt entities:</strong></p>
                          <ul className="list-disc list-inside ml-4">
                            <li>At least one beneficial owner's full details</li>
                            <li>Ownership percentage for each beneficial owner</li>
                            <li>Address, date of birth, and last 4 digits of ID</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger>What are the pricing tiers?</AccordionTrigger>
                      <AccordionContent>
                        <div className="text-gray-600 space-y-2">
                          <p><strong>1-25 companies:</strong> $358.20 per filing (10% off standard rate)</p>
                          <p><strong>26-75 companies:</strong> $389 per filing (2.3% off)</p>
                          <p><strong>76-150 companies:</strong> $375 per filing (5.8% off)</p>
                          <p class="mt-3">Volume discounts are automatically applied based on the number of companies you select for filing in step 4.</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger>Can I save my progress and come back later?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600">
                          Yes! Your progress is automatically saved as you move through each step. You can close the browser and return later to continue where you left off. All uploaded client data and beneficial owner information will be retained in your session.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                      <AccordionTrigger>Is my client data secure?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600">
                          Absolutely. We use bank-level 256-bit encryption for all data transmission and storage. ACH payment processing is handled through secure, PCI-compliant payment gateways. We never store complete ID numbers—only the last 4 digits as required by NY state regulations.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-7">
                      <AccordionTrigger>What happens after I submit?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600">
                          After payment authorization, you'll receive instant confirmation with individual PDF receipts for each filing. These receipts include all submitted information and serve as proof of filing. Your clients will also receive email confirmations at the addresses you provided. Processing typically completes within 1-2 business days.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-8">
                      <AccordionTrigger>Do you offer support during the filing process?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600">
                          Yes! Our compliance support team is available via email and phone during business hours (9 AM - 6 PM ET, Monday-Friday). We can help with data formatting questions, exemption classifications, and technical issues. Enterprise tier clients (76+ filings) receive dedicated support with faster response times.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </section>

            {/* CTA Section */}
            <div className="mt-12 bg-[#00274E] text-white rounded-lg p-8 text-center">
              <h3 className="text-white mb-4">Ready to Streamline Your NYLTA Filings?</h3>
              <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
                Join hundreds of CPAs, attorneys, and compliance professionals who trust NYLTA.com for bulk filing solutions.
              </p>
              <Button 
                onClick={onStartBulkFiling || (() => setCurrentView('bulk-filing'))}
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-[#00274E] rounded-none"
              >
                Start Your Bulk Filing Now
              </Button>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
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
    </div>
  );
}