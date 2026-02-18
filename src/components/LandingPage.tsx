import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CheckCircle, Building2, Mail, MapPin, CheckCircle2, Shield, FileText, Zap, DollarSign, Briefcase, Scale, ClipboardCheck, TrendingUp, ChevronDown, Eye, EyeOff } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import SocialProofPopup from "./SocialProofPopup";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner@2.0.3";
import { supabase } from "../utils/supabase/client";

interface RegistrationData {
  firstName: string;
  lastName: string;
  firmName: string;
  email: string;
  phone: string;
  county: string;
  professionalType: string;
  otherProfession: string;
  agreeTerms: boolean;
  agreeServiceAgreement: boolean;
  agreeTexts: boolean;
  agreeEmailMarketing: boolean;
  authorizedFiler: boolean;
  agreeRegistration: boolean;
}

interface LandingPageProps {
  onAccessGranted: () => void;
  onAdminAccess?: () => void;
  onWhatHappensNext?: () => void;
}

export default function LandingPage({ onAccessGranted, onAdminAccess, onWhatHappensNext }: LandingPageProps) {
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupPasswordConfirm, setShowSignupPasswordConfirm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const { signUp, signIn, account } = useAuth();
  
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    firmName: "",
    email: "",
    phone: "",
    county: "",
    professionalType: "",
    otherProfession: "",
    agreeTerms: false,
    agreeServiceAgreement: false,
    agreeTexts: false,
    agreeEmailMarketing: false,
    authorizedFiler: false,
    agreeRegistration: false,
  });

  const counties = [
    "Albany", "Allegany", "Bronx", "Broome", "Cattaraugus", "Cayuga", "Chautauqua",
    "Chemung", "Chenango", "Clinton", "Columbia", "Cortland", "Delaware", "Dutchess",
    "Erie", "Essex", "Franklin", "Fulton", "Genesee", "Greene", "Hamilton", "Herkimer",
    "Jefferson", "Kings (Brooklyn)", "Lewis", "Livingston", "Madison", "Monroe",
    "Montgomery", "Nassau", "New York (Manhattan)", "Niagara", "Oneida", "Onondaga",
    "Ontario", "Orange", "Orleans", "Oswego", "Otsego", "Putnam", "Queens", "Rensselaer",
    "Richmond (Staten Island)", "Rockland", "Saratoga", "Schenectady", "Schoharie",
    "Schuyler", "Seneca", "St. Lawrence", "Steuben", "Suffolk", "Sullivan", "Tioga",
    "Tompkins", "Ulster", "Warren", "Washington", "Wayne", "Westchester", "Wyoming", "Yates"
  ];

  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "Afghanistan", "Albania", 
    "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", 
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", 
    "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", 
    "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", 
    "Cambodia", "Cameroon", "Central African Republic", "Chad", "Chile", "China", 
    "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", 
    "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", 
    "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", 
    "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", 
    "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", 
    "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", 
    "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", 
    "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", 
    "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", 
    "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", 
    "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", 
    "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", 
    "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", 
    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", 
    "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", 
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", 
    "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", 
    "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
    "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", 
    "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", 
    "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", 
    "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", 
    "United Arab Emirates", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", 
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  const professionalTypes = [
    "CPA (Certified Public Accountant)",
    "Accountant",
    "Attorney / Lawyer",
    "Law Firm Representative",
    "Compliance Professional",
    "Business Consultant",
    "Registered Agent",
    "Other"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.firstName && formData.lastName && formData.email && formData.professionalType && formData.agreeTerms && formData.agreeServiceAgreement) {
      if (formData.professionalType === "Other" && !formData.otherProfession) {
        return;
      }
      setShowModal(false);
      setShowSuccess(true);
    }
  };

  // Handle real signup with backend
  const handleRealSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupPassword !== signupPasswordConfirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (signupPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setLoading(true);
    
    // Map professional type to role
    let role = 'compliance';
    if (formData.professionalType.includes('CPA')) role = 'cpa';
    else if (formData.professionalType.includes('Attorney') || formData.professionalType.includes('Law')) role = 'attorney';
    else if (formData.professionalType.includes('Compliance')) role = 'compliance';
    
    const result = await signUp(
      formData.email,
      signupPassword,
      formData.firmName,
      formData.firstName,
      formData.lastName,
      formData.phone,
      role,
      formData.county, // country field
      formData.professionalType, // full professional type text
      formData.agreeTexts, // SMS consent
      formData.agreeEmailMarketing // Email marketing consent
    );
    
    setLoading(false);
    
    if (result.success) {
      toast.success("Account created successfully! Awaiting admin approval.");
      setShowModal(false);
      setShowSuccess(true);
    } else {
      // Show more specific error messages
      const errorMsg = result.error || 'Unknown error occurred';
      
      if (errorMsg.includes('Network error') || errorMsg.includes('Unable to connect')) {
        toast.error('Unable to connect to server. Please check your internet connection and try again.');
      } else if (errorMsg.includes('status 401')) {
        toast.error('Server authentication error. Please contact support or try again later.');
      } else if (errorMsg.includes('already registered') || errorMsg.includes('already exists')) {
        toast.error('This email is already registered. Please try logging in instead.');
      } else {
        toast.error(errorMsg);
      }
    }
  };

  // Handle real login with backend  
  const handleRealLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    
    const result = await signIn(loginEmail, loginPassword);
    
    setLoginLoading(false);
    
    if (result.success) {
      // Check account status
      if (account?.status === 'pending') {
        toast.error("Your account is pending approval. Please wait for admin verification.");
        return;
      } else if (account?.status === 'rejected') {
        toast.error("Your account has been rejected. Please contact support.");
        return;
      }
      
      toast.success("Login successful!");
      setShowModal(false);
      
      // Check if first time user
      if (account?.isFirstLogin) {
        sessionStorage.setItem('nylta_firstTimeUser', 'true');
      }
      
      onAccessGranted();
    } else {
      setLoginError(result.error || "Login failed");
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetSuccess(false);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin,
      });
      
      if (error) {
        setResetError(error.message);
        toast.error(error.message);
      } else {
        setResetSuccess(true);
        toast.success('Password reset email sent! Check your inbox.');
      }
    } catch (err) {
      setResetError('Failed to send reset email');
      toast.error('Failed to send reset email');
    }
    
    setResetLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Matching NYLTA.com - Fixed */}
      <header className="bg-white border-b-4 border-yellow-400 fixed top-0 left-0 right-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <ImageWithFallback 
                src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                alt="NYLTA.com Logo"
                className="h-8 sm:h-10 md:h-12 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-none"
              />
            </div>

            <Button 
              onClick={() => setShowModal(true)}
              className="bg-[#00274E] hover:bg-[#003366] text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-none uppercase text-sm"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              LOG IN / CREATE ACCOUNT
            </Button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[84px]"></div>

      {/* Hero Section - Matching NYLTA.com style */}
      <section className="relative text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1514565131-fce0801e5785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwY2l0eSUyMHNreWxpbmV8ZW58MXx8fHwxNzYyMzQ3MTE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="New York City"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 z-10" style={{ backgroundColor: 'rgba(0, 39, 78, 0.90)' }}></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          <div className="mb-4">
            <p className="text-2xl md:text-3xl tracking-wide" style={{ fontFamily: 'Libre Baskerville, serif' }}>NYLTA.com™</p>
          </div>
          
          <h1 className="text-4xl md:text-5xl mb-3" style={{ fontFamily: 'Libre Baskerville, serif' }}>
            Monitoring & Bulk Filing
          </h1>
          
          <h2 className="text-2xl md:text-3xl mb-6 text-gray-100" style={{ fontFamily: 'Libre Baskerville, serif' }}>
            Professional NYLTA Compliance Services
          </h2>
          
          <p className="text-lg md:text-xl text-gray-200 mb-3 leading-relaxed max-w-4xl mx-auto">
            Two professional service tiers designed for firms managing multiple New York LLCs.
          </p>
          
          <p className="text-base text-gray-300 mb-3 leading-relaxed max-w-3xl mx-auto">
            Compliance Monitoring helps firms confirm client filing status and prepare for future NYDOS guidance. Full NYLTA Filing enables secure bulk submission when filing is required.
          </p>

          <p className="text-sm text-gray-400 mb-8 leading-relaxed max-w-3xl mx-auto italic">
            Monitoring is strongly recommended due to evolving New York Department of State implementation guidance.
          </p>

          <div className="flex justify-center">
            <Button 
              onClick={() => setShowModal(true)}
              size="lg"
              className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#00274E] px-8 py-6 rounded-none uppercase shadow-lg"
              style={{ fontSize: '14px', fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              APPLY FOR PROFESSIONAL ACCESS
            </Button>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Professional access is intended for CPAs, attorneys, and compliance firms.
          </p>

          <div className="mt-6 text-sm text-gray-300">
            <p>For single LLC filings, visit <a href="https://nylta.com/" target="_blank" rel="noopener noreferrer" className="text-[#fbbf24] hover:text-[#f59e0b] underline"><strong>NYLTA.com</strong></a></p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Secure & Encrypted Submission
              </span>
              <span>|</span>
              <span>Takes Less Than 2 Minutes</span>
            </div>
          </div>

          <p className="mt-6 text-xs text-gray-400">
            NYLTA.com™ — Trusted by business owners and professionals across New York.
          </p>
        </div>
      </section>

      {/* SERVICE TIERS SECTION - SHOWS BOTH MONITORING AND FILING */}
      <section id="services-section" className="py-20 bg-white border-t-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl text-[#00274E] mb-4" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              Choose Your Service Tier
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Two professional solutions designed for CPAs, attorneys, and compliance teams managing multiple clients
            </p>
          </div>

          {/* Two Service Cards Side by Side */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* MONITORING SERVICE */}
            <div className="bg-white rounded-none shadow-2xl border-t-4 border-blue-500 hover:shadow-3xl transition-all transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-b-2 border-blue-200 p-8 pt-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full mb-4">
                  <Eye className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl text-[#00274E] mb-4 min-h-[5rem] flex items-center justify-center" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  Compliance Monitoring
                </h3>
                <div className="mt-4 inline-block bg-blue-100 border border-blue-300 rounded px-4 py-2">
                  <p className="text-xs text-blue-800 font-semibold">PERFECT FOR DOMESTIC NY LLCs</p>
                </div>
              </div>
              
              <div className="p-8">
                <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong>For entities not yet required to file.</strong> Store all data securely, monitor for law changes, and upgrade to filing later without re-entering data or paying twice.
                  </p>
                </div>

                <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">What's Included:</h4>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Secure storage of all entity & beneficial ownership data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Monthly compliance status reports and alerts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Automatic law change notifications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Filing-ready status tracking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">CSV/Excel bulk upload support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-semibold">Upgrade to full filing service anytime</span>
                  </li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <strong>Pricing Note:</strong> Compliance monitoring is provided at a flat annual rate per entity. Monitoring involves ongoing review of guidance, status tracking, and change alerts, and is priced consistently regardless of volume to ensure review quality and continuity.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-none p-4 mb-6">
                  <p className="text-xs text-green-800 leading-relaxed">
                    ℹ️ <strong>Domestic NY LLCs are not currently required to file.</strong> This service lets you prepare now and file later if the law changes — without losing your payment or re-entering data.
                  </p>
                </div>

                <Button 
                  onClick={() => setShowModal(true)}
                  className="w-full bg-[#00274E] hover:bg-[#003366] text-white py-6 rounded-none uppercase text-sm"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                >
                  See Pricing & Get Started
                </Button>
              </div>
            </div>

            {/* FULL FILING SERVICE */}
            <div className="bg-white rounded-none shadow-2xl border-t-4 border-[#fbbf24] hover:shadow-3xl transition-all transform hover:-translate-y-1 relative">
              {/* "Most Popular" Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-[#fbbf24] text-[#00274E] px-6 py-2 rounded-full shadow-lg">
                  <p className="text-xs font-bold uppercase tracking-wide">Most Popular</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-b-2 border-yellow-200 p-8 text-center pt-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#fbbf24] rounded-full mb-4">
                  <FileText className="h-10 w-10 text-[#00274E]" />
                </div>
                <h3 className="text-3xl text-[#00274E] mb-4 leading-tight min-h-[5rem] flex items-center justify-center" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  Bulk<br/>Filing
                </h3>
                <div className="mt-4 inline-block bg-yellow-100 border border-yellow-400 rounded px-4 py-2">
                  <p className="text-xs text-[#00274E] font-semibold">REQUIRED FOR FOREIGN LLCs</p>
                </div>
              </div>
              
              <div className="p-8">
                <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong>Complete filing service with NYDOS submission.</strong> Includes everything in Monitoring plus official filing, confirmation, and compliance certificates.
                  </p>
                </div>

                <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Everything in Monitoring, Plus:</h4>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-semibold">Official submission to NYDOS</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">NYDOS confirmation number & receipt</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Downloadable compliance certificate</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Status tracking & confirmation emails</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Ongoing compliance monitoring</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Professional filing documentation</span>
                  </li>
                </ul>

                <div className="bg-red-50 border border-red-200 rounded-none p-4 mb-6">
                  <p className="text-xs text-red-800 leading-relaxed">
                    ⚠️ <strong>Foreign LLCs must file immediately.</strong> Domestic NY LLCs may choose Monitoring service and upgrade later if filing becomes required.
                  </p>
                </div>

                <Button 
                  onClick={() => setShowModal(true)}
                  className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#00274E] py-6 rounded-none uppercase text-sm shadow-lg"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                >
                  See Pricing & Get Started
                </Button>
              </div>
            </div>
          </div>

          {/* Upgrade Guarantee Box */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-yellow-50 border-2 border-[#00274E] rounded-none p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-[#00274E] rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="h-8 w-8 text-[#fbbf24]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl text-[#00274E] mb-3 font-semibold" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                    Our Upgrade Guarantee: Never Pay Twice
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Start with Compliance Monitoring to prepare your clients' data. If filing becomes required later, upgrade to Full Filing without re-entering any information. You'll never be charged twice for the same entity.
                  </p>
                  <div className="text-center mt-6">
                    <Button 
                      onClick={() => setShowModal(true)}
                      className="bg-[#00274E] hover:bg-[#003366] text-white px-8 py-4 rounded-none uppercase text-sm"
                      style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                    >
                      Create Account to See Pricing
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Bulk Filing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="bg-[#00274E] border-b-4 border-yellow-400 mb-12 py-8 px-8">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-white mb-3" style={{ fontFamily: 'Libre Baskerville, serif', fontSize: '32px' }}>What is Bulk Filing?</h2>
              <p className="text-gray-300 text-lg">
                A specialized service designed for professional filers managing multiple NYLTA submissions
              </p>
            </div>
          </div>

          {/* Description Box with Enhanced Styling */}
          <div className="bg-white rounded-none border-l-4 border-yellow-400 shadow-lg p-10 mb-16">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                <FileText className="h-8 w-8 text-[#00274E]" />
              </div>
              <div>
                <h3 className="text-xl text-[#00274E] mb-3" style={{ fontFamily: 'Libre Baskerville, serif' }}>Streamlined Filing for Professional Firms</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Instead of filing each LLC individually through separate forms, our bulk filing portal allows you to upload client data via CSV or Excel spreadsheets, process dozens or hundreds of filings at once, and manage everything through a centralized dashboard with comprehensive tracking and validation tools. This system is built specifically for firms managing large client portfolios with strict compliance deadlines.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Cards with Enhanced Professional Design */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-none shadow-lg border-t-4 border-yellow-400 hover:shadow-xl transition-shadow">
              <div className="bg-gray-100 border-b-2 border-gray-200 p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#00274E] rounded flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>Efficient Processing</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 leading-relaxed text-center">
                  Process up to 150 NYLTA filings simultaneously through our advanced bulk submission system. Automated data validation and compliance checking eliminates manual review time while ensuring accuracy and regulatory compliance.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-none shadow-lg border-t-4 border-yellow-400 hover:shadow-xl transition-shadow">
              <div className="bg-gray-100 border-b-2 border-gray-200 p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#00274E] rounded flex items-center justify-center mb-4">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>Volume-Based Pricing</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 leading-relaxed text-center">
                  Professional pricing tiers reward high-volume filers with substantial discounts. Starting at 10% savings for small batches, scaling to custom enterprise pricing for firms filing 150+ entities per submission.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-none shadow-lg border-t-4 border-yellow-400 hover:shadow-xl transition-shadow">
              <div className="bg-gray-100 border-b-2 border-gray-200 p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#00274E] rounded flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>Secure & Compliant</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 leading-relaxed text-center">
                  Bank-grade 256-bit encryption, secure ACH payment processing, and full compliance with New York State data protection requirements. All submissions validated against current NYLTA regulatory standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Use Bulk Filing */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#00274E] border-b-4 border-yellow-400 mb-12 py-6 px-8">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-white mb-2">Who Can Use Bulk Filing?</h2>
              <p className="text-gray-300">
                Professional services designed for certified filers and compliance teams
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-6 w-6 text-[#00274E]" />
                  </div>
                  <h3 className="text-lg text-gray-900">CPAs & Accountants</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed">
                  File for all your LLC clients in one session with built-in validation and compliance checks.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <Scale className="h-6 w-6 text-[#00274E]" />
                  </div>
                  <h3 className="text-lg text-gray-900">Law Firms</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed">
                  Streamline NYLTA reporting for multiple corporate clients with one authorized submission.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <ClipboardCheck className="h-6 w-6 text-[#00274E]" />
                  </div>
                  <h3 className="text-lg text-gray-900">Compliance Professionals</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed">
                  Manage high-volume NYLTA requirements efficiently with our professional-grade bulk portal.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-[#00274E]" />
                  </div>
                  <h3 className="text-lg text-gray-900">Registered Agents</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed">
                  Offer NYLTA filing as an additional service to your LLC formation and compliance clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#00274E] border-b-4 border-yellow-400 mb-12 py-6 px-8">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-white mb-2">How Bulk Filing Works</h2>
              <p className="text-gray-300">
                A streamlined 6-step process designed for professional compliance teams
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {[
              {
                step: 1,
                title: "Firm Registration & Authorization",
                description: "Register your firm and provide professional credentials. Confirm authorization to file on behalf of clients."
              },
              {
                step: 2,
                title: "Upload Client List",
                description: "Upload client data via CSV/Excel template or enter manually. System validates EINs, formation dates, and required fields."
              },
              {
                step: 3,
                title: "Beneficial Owner Data Collection",
                description: "For non-exempt entities, provide beneficial owner details. Use 'same applicant for all' features to streamline data entry."
              },
              {
                step: 4,
                title: "Review Summary",
                description: "Review comprehensive summaries of all filings. Select which clients to process and verify accuracy before submission."
              },
              {
                step: 5,
                title: "Secure Payment Authorization",
                description: "All transactions are encrypted and secure."
              },
              {
                step: 6,
                title: "Confirmation & Receipts",
                description: "Receive instant confirmation and downloadable receipts. Track filing status for all submitted clients."
              }
            ].map(({ step, title, description }) => (
              <div key={step} className="flex gap-6 items-start bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="w-12 h-12 bg-[#00274E] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xl border-4 border-yellow-400" style={{ fontFamily: 'Libre Baskerville, serif', fontWeight: 700 }}>
                  {step}
                </div>
                <div>
                  <h3 className="text-xl mb-2 text-gray-900" style={{ fontFamily: 'Libre Baskerville, serif' }}>{title}</h3>
                  <p className="text-gray-600">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#00274E] border-b-4 border-yellow-400 mb-12 py-6 px-8">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-white mb-2">Eligibility & Requirements</h2>
              <p className="text-gray-300">
                Who can use bulk filing and what information you'll need
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3 className="text-2xl mb-6 text-gray-900" style={{ fontFamily: 'Libre Baskerville, serif' }}>Who Can Use Bulk Filing?</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Certified Public Accountants (CPAs)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Licensed Attorneys and Law Firms</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Compliance Professionals</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Registered Agents</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Business Consultants with Client Authorization</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3 className="text-2xl mb-6 text-gray-900" style={{ fontFamily: 'Libre Baskerville, serif' }}>What You'll Need</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Valid professional credentials</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Firm EIN</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Basic client details</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Beneficial owner information</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Exempt attestation information</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 text-white overflow-hidden">
        {/* Background Image - Same as Hero */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1514565131-fce0801e5785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwY2l0eSUyMHNreWxpbmV8ZW58MXx8fHwxNzYyMzQ3MTE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="New York City"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Overlay - Same as Hero */}
        <div className="absolute inset-0 z-10" style={{ backgroundColor: 'rgba(0, 39, 78, 0.90)' }}></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          <h2 className="text-4xl mb-6" style={{ fontFamily: 'Libre Baskerville, serif' }}>
            Get Started with Bulk Filing
          </h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            The bulk filing portal is now available. Register now to get your firm verified and start filing. Our team will review your application within 48 hours and provide login access.
          </p>
          <p className="text-lg text-gray-300 mb-8">
            Registration is completely free. Payment is only required when submitting actual filings.
          </p>
          <Button 
            onClick={() => setShowModal(true)}
            size="lg"
            className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#00274E] px-12 py-8 rounded-none uppercase shadow-lg"
            style={{ fontSize: '16px', fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
          >
            START BULK FILING
          </Button>
        </div>
      </section>

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
                <button 
                  onClick={onWhatHappensNext}
                  className="text-gray-300 hover:text-yellow-400 text-sm flex items-center gap-2 text-left"
                >
                  <CheckCircle2 className="h-3 w-3 text-yellow-400" />
                  What Happens Next?
                </button>
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
              {onAdminAccess && (
                <button 
                  onClick={onAdminAccess}
                  className="ml-2 text-gray-600 hover:text-gray-400 transition-colors text-xs opacity-30 hover:opacity-60"
                  style={{ fontFamily: 'monospace' }}
                >
                  •
                </button>
              )}
            </p>
          </div>
        </div>
      </footer>

      {/* Login / Create Account Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {/* White Header with Yellow Border */}
          <div className="bg-white border-b-4 border-yellow-400 px-6 py-4 relative">
            <div className="flex items-center gap-4 justify-center">
              <ImageWithFallback 
                src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                alt="NYLTA.com Logo"
                className="h-8 sm:h-10 md:h-12 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-none"
              />
              <div className="border-l-2 border-gray-300 pl-4">
                <h2 className="text-[#00274E] text-xl" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  NYLTA.com Bulk Filing Portal
                </h2>
                <p className="text-gray-600 text-xs mt-0.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Professional Compliance System
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                <TabsTrigger 
                  value="create" 
                  className="data-[state=active]:bg-white data-[state=active]:text-[#00274E] rounded-none"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                >
                  Create Account
                </TabsTrigger>
                <TabsTrigger 
                  value="login"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#00274E] rounded-none"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                >
                  Login
                </TabsTrigger>
              </TabsList>

            <TabsContent value="create">
              <DialogTitle className="text-2xl text-[#00274E] text-center mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                Account Creation
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-center mb-6">
                Create your account to access the bulk filing portal. Our team will contact you within 48 hours to verify your credentials and provide login access.
              </DialogDescription>

              <form onSubmit={handleRealSignup} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name*</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                      className="mt-1"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name*</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                      className="mt-1"
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="firmName">Legal Business Name*</Label>
                  <Input
                    id="firmName"
                    value={formData.firmName}
                    onChange={(e) => setFormData({...formData, firmName: e.target.value})}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number*</Label>
                  <div className="flex gap-2 mt-1">
                    <Select defaultValue="US">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">🇺🇸 +1</SelectItem>
                        <SelectItem value="CA">🇨🇦 +1</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                      required
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signupPassword">Password*</Label>
                  <div className="relative">
                    <Input
                      id="signupPassword"
                      type={showSignupPassword ? "text" : "password"}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      className="mt-1 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSignupPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="signupPasswordConfirm">Confirm Password*</Label>
                  <div className="relative">
                    <Input
                      id="signupPasswordConfirm"
                      type={showSignupPasswordConfirm ? "text" : "password"}
                      value={signupPasswordConfirm}
                      onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                      placeholder="Re-enter your password"
                      required
                      className="mt-1 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPasswordConfirm(!showSignupPasswordConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSignupPasswordConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="county">Country (Optional)</Label>
                  <Select value={formData.county} onValueChange={(value) => setFormData({...formData, county: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="professionalType">Professional Type*</Label>
                  <Select 
                    value={formData.professionalType} 
                    onValueChange={(value) => setFormData({...formData, professionalType: value, otherProfession: value !== 'Other' ? '' : formData.otherProfession})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your professional type" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionalTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.professionalType === "Other" && (
                  <div>
                    <Label htmlFor="otherProfession">Please specify your profession*</Label>
                    <Input
                      id="otherProfession"
                      value={formData.otherProfession}
                      onChange={(e) => setFormData({...formData, otherProfession: e.target.value})}
                      placeholder="Enter your profession"
                      required
                      className="mt-1"
                    />
                  </div>
                )}

                {formData.professionalType && (
                  <div className="bg-white border border-gray-300 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Bulk Filing Access:</strong> As a professional filer, you'll receive access to our bulk filing portal with CSV/Excel upload capabilities, comprehensive validation tools, and secure ACH payment processing. Our team will contact you within 48 hours to verify your credentials and provide login access.
                    </p>
                  </div>
                )}

                <div className="border-t pt-4 mt-6">
                  {/* Authorization checkbox - only for Attorney, CPA, or Compliance Professional */}
                  {["Attorney", "CPA", "Compliance"].includes(formData.professionalType) && (
                    <div className="flex items-start space-x-3 mb-4">
                      <Checkbox 
                        id="authorizedFiler" 
                        checked={formData.authorizedFiler}
                        onCheckedChange={(checked) => setFormData({...formData, authorizedFiler: checked as boolean})}
                        required
                        className="mt-0.5"
                      />
                      <Label htmlFor="authorizedFiler" className="text-sm cursor-pointer leading-relaxed text-gray-700">
                        I am authorized to file NYLTA reports on behalf of my clients.
                      </Label>
                    </div>
                  )}

                  <div className="flex items-start space-x-3 mb-4">
                    <Checkbox 
                      id="agreeTexts" 
                      checked={formData.agreeTexts}
                      onCheckedChange={(checked) => setFormData({...formData, agreeTexts: checked as boolean})}
                      required
                      className="mt-0.5"
                    />
                    <Label htmlFor="agreeTexts" className="text-sm cursor-pointer leading-relaxed text-gray-700">
                      I authorize NYLTA.com to send text messages related to my filing status and compliance notifications. Message and data rates may apply.
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 mb-6">
                    <Checkbox 
                      id="agreeEmailMarketing" 
                      checked={formData.agreeEmailMarketing}
                      onCheckedChange={(checked) => setFormData({...formData, agreeEmailMarketing: checked as boolean})}
                      className="mt-0.5"
                    />
                    <Label htmlFor="agreeEmailMarketing" className="text-sm cursor-pointer leading-relaxed text-gray-700">
                      I agree to receive marketing emails from NYLTA.com. I can unsubscribe at any time.
                    </Label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#00274E] py-6 rounded-none uppercase"
                  style={{ fontSize: '16px', fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                  disabled={loading || !formData.firstName || !formData.lastName || !formData.email || !formData.professionalType || !formData.agreeTexts}
                >
                  {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="login">
              <DialogTitle className="text-2xl text-[#00274E] text-center mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                Login to Your Account
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-center mb-6">
                Access your bulk filing portal with your credentials
              </DialogDescription>

              <form onSubmit={handleRealLogin} className="space-y-5">
                <div>
                  <Label htmlFor="loginEmail">Email Address*</Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="mt-1"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="loginPassword">Password*</Label>
                  <div className="relative">
                    <Input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="mt-1 pr-10"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="rememberMe" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
                    <Label htmlFor="rememberMe" className="cursor-pointer">Remember me</Label>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setShowForgotPassword(true);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {loginError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {loginError}
                  </div>
                )}

                <div className="bg-white border border-gray-300 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> If you haven't received your login credentials yet, please check your email. Our team sends login access within 48 hours of account creation verification.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#00274E] py-6 rounded-none uppercase"
                  style={{ fontSize: '16px', fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                  disabled={loginLoading || !loginEmail || !loginPassword}
                >
                  {loginLoading ? 'LOGGING IN...' : 'LOGIN'}
                </Button>

                <div className="text-center text-sm text-gray-600 pt-4 border-t">
                  Don't have an account? Click the "Create Account" tab above to register.
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md text-center">
          <DialogTitle className="text-2xl text-[#003366] text-center" style={{ fontFamily: 'Georgia, serif' }}>
            Registration Submitted
          </DialogTitle>
          <DialogDescription className="text-gray-700 text-center" style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '1rem' }}>
            Thank you <strong>{formData.fullName}</strong>!
          </DialogDescription>
          
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-left w-full border border-blue-200">
              <h3 className="text-lg text-[#003366] mb-3">What Happens Next?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Our team will review and approve your registration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>You'll receive email confirmation at <strong>{formData.email}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Within 48 hours</strong>, someone will contact you with login credentials</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>You'll have priority access when the portal opens January 1, 2026</span>
                </li>
              </ul>
            </div>
            <Button 
              onClick={() => setShowSuccess(false)}
              className="bg-[#003366] hover:bg-[#00264d] text-white mt-4 px-8"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Social Proof Popup */}
      <SocialProofPopup onViewFlow={() => setShowModal(true)} />

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="max-w-md">
          <DialogTitle className="text-2xl text-[#00274E] text-center mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </DialogDescription>

          {resetSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg mb-2 text-gray-900">Email Sent!</h3>
              <p className="text-gray-600 mb-6">
                Check your inbox at <strong>{resetEmail}</strong> for password reset instructions.
              </p>
              <Button 
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetSuccess(false);
                  setResetEmail('');
                  setShowModal(true);
                }}
                className="bg-[#00274E] hover:bg-[#003366] text-white rounded-none uppercase"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-5">
              <div>
                <Label htmlFor="resetEmail">Email Address*</Label>
                <Input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="your@email.com"
                />
              </div>

              {resetError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {resetError}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#00274E] py-6 rounded-none uppercase"
                style={{ fontSize: '16px', fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                disabled={resetLoading || !resetEmail}
              >
                {resetLoading ? 'SENDING...' : 'SEND RESET LINK'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                    setResetError('');
                    setShowModal(true);
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}