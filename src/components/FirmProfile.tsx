import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Trash2, Lock, Edit2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useAuth } from '../contexts/AuthContext';

export interface FirmWorker {
  id: string;
  fullName: string;
  email: string;
  title: string;
  role: "Admin" | "Authorized Filer";
  status: "Active" | "Deactivated";
}

export interface FirmProfileData {
  firmName: string;
  ein: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  contactEmail: string;
  phone: string;
  authorizedFilers: FirmWorker[];
  isComplete: boolean;
  isLocked: boolean; // True after first submission/approval
}

interface FirmProfileProps {
  onComplete?: () => void;
  onBack?: () => void;
  isFirstTime?: boolean;
}

export default function FirmProfile({ onComplete, onBack, isFirstTime = false }: FirmProfileProps) {
  const { session, account } = useAuth();
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  const [profileData, setProfileData] = useState<FirmProfileData>({
    firmName: "",
    ein: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    contactEmail: "",
    phone: "",
    authorizedFilers: [],
    isComplete: false,
    isLocked: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
  const [changeRequestField, setChangeRequestField] = useState<"firmName" | "ein" | "">("");
  const [changeRequestReason, setChangeRequestReason] = useState("");

  useEffect(() => {
    loadFirmProfile();
  }, [account, isFirstTime]); // Added dependencies to reload when account data is available

  // Load RewardLion survey script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://link.nylta.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const loadFirmProfile = async () => {
    try {
      setIsLoading(true);
      
      // First, ALWAYS try to load from database if user is authenticated
      if (session?.access_token) {
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
          if (data.profile && data.profile.isComplete) {
            // Profile exists in database and is complete - use it
            console.log('✅ Loaded existing firm profile from database:', data.profile.firmName);
            setProfileData(data.profile);
            setIsLoading(false);
            return;
          }
        }
      }
      
      // If no saved profile exists AND first time, pre-populate from account
      if (isFirstTime && account) {
        console.log('🆕 First time user - pre-populating from account data');
        // Auto-create authorized filer from signup information
        const autoCreatedFiler: FirmWorker = {
          id: `filer-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          fullName: `${account.firstName || ''} ${account.lastName || ''}`.trim(),
          email: account.email || '',
          title: account.professionalType || account.role || '',
          role: "Authorized Filer",
          status: "Active"
        };

        setProfileData({
          firmName: account.firmName || "",
          ein: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "United States",
          contactEmail: account.email || "",
          phone: account.phone || "",
          authorizedFilers: [autoCreatedFiler], // Auto-add authorized filer from signup info
          isComplete: false,
          isLocked: false  // CRITICAL: Keep unlocked for first-time users
        });
        setIsLoading(false);
        return;
      }
      
    } catch (error) {
      console.error("Error loading firm profile:", error);
      toast.error("Failed to load firm profile");
    } finally {
      setIsLoading(false);
    }
  };

  const addFiler = () => {
    if (profileData.authorizedFilers.length >= 5) {
      toast.error("You can register up to 5 authorized filers");
      return;
    }

    const newFiler: FirmWorker = {
      id: `filer-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      fullName: "",
      email: "",
      title: "",
      role: "Authorized Filer",
      status: "Active"
    };

    setProfileData({
      ...profileData,
      authorizedFilers: [...profileData.authorizedFilers, newFiler]
    });
  };

  const removeFiler = (id: string) => {
    setProfileData({
      ...profileData,
      authorizedFilers: profileData.authorizedFilers.filter(f => f.id !== id)
    });
  };

  const updateFiler = (id: string, field: keyof FirmWorker, value: string) => {
    setProfileData({
      ...profileData,
      authorizedFilers: profileData.authorizedFilers.map(f =>
        f.id === id ? { ...f, [field]: value } : f
      )
    });
  };

  const toggleFilerStatus = (id: string) => {
    setProfileData({
      ...profileData,
      authorizedFilers: profileData.authorizedFilers.map(f =>
        f.id === id ? { ...f, status: f.status === "Active" ? "Deactivated" : "Active" } : f
      )
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!profileData.firmName.trim()) newErrors.firmName = "Legal Business Name is required";
    if (!profileData.ein.trim()) newErrors.ein = "EIN is required";
    if (!profileData.address.trim()) newErrors.address = "Street Address is required";
    if (!profileData.city.trim()) newErrors.city = "City is required";
    if (!profileData.state.trim()) newErrors.state = "State is required";
    if (!profileData.zipCode.trim()) newErrors.zipCode = "ZIP Code is required";
    if (!profileData.contactEmail.trim()) newErrors.contactEmail = "Contact Email is required";
    if (!profileData.phone.trim()) newErrors.phone = "Phone Number is required";

    // Validate at least one active filer
    const activeFilers = profileData.authorizedFilers.filter(f => f.status === "Active");
    if (activeFilers.length === 0) {
      newErrors.authorizedFilers = "At least one active authorized filer is required";
    }

    // Validate each filer has required fields
    profileData.authorizedFilers.forEach((filer, index) => {
      if (!filer.fullName.trim()) newErrors[`filer-${index}-name`] = "Full name is required";
      if (!filer.email.trim()) newErrors[`filer-${index}-email`] = "Email is required";
      if (!filer.title.trim()) newErrors[`filer-${index}-title`] = "Title is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Firm Information
        if (!profileData.firmName.trim()) newErrors.firmName = "Legal Business Name is required";
        if (!profileData.ein.trim()) newErrors.ein = "EIN is required";
        break;
      case 2: // Survey
        // Survey validation happens externally
        break;
      case 3: // Business Address
        if (!profileData.address.trim()) newErrors.address = "Street Address is required";
        if (!profileData.city.trim()) newErrors.city = "City is required";
        if (!profileData.state.trim()) newErrors.state = "State is required";
        if (!profileData.zipCode.trim()) newErrors.zipCode = "ZIP Code is required";
        break;
      case 4: // Contact Information
        if (!profileData.contactEmail.trim()) newErrors.contactEmail = "Contact Email is required";
        if (!profileData.phone.trim()) newErrors.phone = "Phone Number is required";
        break;
      case 5: // Authorized Filers
        const activeFilers = profileData.authorizedFilers.filter(f => f.status === "Active");
        if (activeFilers.length === 0) {
          newErrors.authorizedFilers = "At least one active authorized filer is required";
        }
        profileData.authorizedFilers.forEach((filer, index) => {
          if (!filer.fullName.trim()) newErrors[`filer-${index}-name`] = "Full name is required";
          if (!filer.email.trim()) newErrors[`filer-${index}-email`] = "Email is required";
          if (!filer.title.trim()) newErrors[`filer-${index}-title`] = "Title is required";
        });
        break;
      case 6: // Review
        // Final validation before submit
        return validateForm();
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    } else {
      toast.error("Please fill in all required fields before continuing");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Firm Information";
      case 2: return "Pre-Filing Survey";
      case 3: return "Business Address";
      case 4: return "Contact Information";
      case 5: return "Authorized Filers";
      case 6: return "Review & Submit";
      default: return "";
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please correct the errors before saving");
      return;
    }

    if (!session?.access_token) {
      console.error("❌ No session access token available");
      toast.error("Session expired. Please log in again.");
      return;
    }

    try {
      setIsSaving(true);
      
      console.log("💾 Saving firm profile data:", {
        firmName: profileData.firmName,
        ein: profileData.ein,
        isComplete: true,
        userId: session.user?.id
      });

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2c01e603/firm-profile`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...profileData,
            isComplete: true
          })
        }
      );

      const responseData = await response.json();
      console.log("📥 Server response:", responseData);

      if (response.ok) {
        console.log("✅ Firm profile saved successfully to database!");
        toast.success("Firm profile saved successfully!");
        if (onComplete) {
          setTimeout(() => onComplete(), 1000);
        }
      } else {
        console.error("❌ Server error:", responseData);
        toast.error(responseData.error || "Failed to save firm profile");
      }
    } catch (error) {
      console.error("❌ Error saving firm profile:", error);
      toast.error("Failed to save firm profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeRequest = async () => {
    if (!changeRequestReason.trim()) {
      toast.error("Please provide a reason for this change request");
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2c01e603/firm-profile/change-request`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            field: changeRequestField,
            currentValue: profileData[changeRequestField],
            reason: changeRequestReason
          })
        }
      );

      if (response.ok) {
        toast.success("Change request submitted successfully. An administrator will review your request.");
        setShowChangeRequestModal(false);
        setChangeRequestReason("");
        setChangeRequestField("");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to submit change request");
      }
    } catch (error) {
      console.error("Error submitting change request:", error);
      toast.error("Failed to submit change request");
    }
  };

  const openChangeRequestModal = (field: "firmName" | "ein") => {
    setChangeRequestField(field);
    setShowChangeRequestModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 w-1/3"></div>
            <div className="h-4 bg-gray-200 w-2/3"></div>
            <div className="h-64 bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-yellow-400">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 text-3xl">Firm Profile</h1>
              <p className="text-gray-600 mt-1">Complete your firm information to enable bulk filing</p>
            </div>
            {onBack && (
              <Button 
                variant="outline" 
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 h-2">
            <div 
              className="bg-[#00274E] h-2 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-center">
            <h2 className="text-xl text-gray-900">{getStepTitle(currentStep)}</h2>
          </div>
        </div>

        {/* First-time banner */}
        {isFirstTime && currentStep === 1 && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <strong>Welcome to NYLTA Bulk Filing!</strong> Please complete your firm profile to get started. 
              We've pre-filled some information from your account registration.
            </AlertDescription>
          </Alert>
        )}

        {/* Locked fields notice */}
        {profileData.isLocked && (
          <Alert className="mb-6 border-yellow-400 bg-yellow-50">
            <Lock className="h-5 w-5 text-yellow-600" />
            <AlertDescription className="text-yellow-900">
              Some fields are locked for security and compliance. To modify them, submit a change request for administrator approval.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Firm Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader className="bg-white border-b border-gray-200">
                <CardTitle>Firm Information</CardTitle>
                <CardDescription>
                  Basic information about your firm or practice
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Firm Name - Locked after approval */}
                  <div className="md:col-span-2">
                    <Label htmlFor="firmName">
                      Legal Business Name* 
                      {profileData.isLocked && <Lock className="inline ml-2 h-4 w-4 text-gray-400" />}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="firmName"
                        value={profileData.firmName}
                        onChange={(e) => setProfileData({ ...profileData, firmName: e.target.value })}
                        disabled={profileData.isLocked}
                        className={profileData.isLocked ? "bg-gray-100" : ""}
                      />
                      {profileData.isLocked && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => openChangeRequestModal("firmName")}
                          className="whitespace-nowrap border-gray-300"
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Request Change
                        </Button>
                      )}
                    </div>
                    {errors.firmName && <p className="text-red-600 text-sm mt-1">{errors.firmName}</p>}
                    {profileData.isLocked && (
                      <p className="text-sm text-gray-500 mt-1">
                        This field is locked. Click "Request Change" to submit a change request for admin review.
                      </p>
                    )}
                  </div>

                  {/* EIN - Never editable after submission */}
                  <div className="md:col-span-2">
                    <Label htmlFor="ein">
                      Employer Identification Number (EIN)* 
                      {profileData.isLocked && <Lock className="inline ml-2 h-4 w-4 text-gray-400" />}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="ein"
                        value={profileData.ein}
                        onChange={(e) => setProfileData({ ...profileData, ein: e.target.value })}
                        placeholder="XX-XXXXXXX"
                        disabled={profileData.isLocked}
                        className={profileData.isLocked ? "bg-gray-100" : ""}
                      />
                      {profileData.isLocked && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => openChangeRequestModal("ein")}
                          className="whitespace-nowrap border-gray-300"
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Request Change
                        </Button>
                      )}
                    </div>
                    {errors.ein && <p className="text-red-600 text-sm mt-1">{errors.ein}</p>}
                    {profileData.isLocked && (
                      <p className="text-sm text-gray-500 mt-1">
                        This field is locked. Click "Request Change" to submit a change request for admin review.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pre-Filing Survey - Step 2 */}
          {currentStep === 2 && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-white border-b border-gray-200">
                <CardTitle className="text-xl text-gray-900">Pre-Filing Survey</CardTitle>
                <CardDescription className="text-sm">
                  Complete this brief survey to help us improve our service. <strong>This is required before completing your profile.</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* RewardLion Survey Embed */}
                <iframe 
                  src="https://link.nylta.com/widget/survey/YW3SOVmEUX9I9r6P0QZB" 
                  style={{ border: 'none', width: '100%', minHeight: '600px' }} 
                  scrolling="no" 
                  id="YW3SOVmEUX9I9r6P0QZB" 
                  title="survey"
                />
              </CardContent>
            </Card>
          )}

          {/* Business Address */}
          {currentStep === 3 && (
            <Card>
              <CardHeader className="bg-white border-b border-gray-200">
                <CardTitle>Primary Business Address</CardTitle>
                <CardDescription>
                  Your firm's main office address
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Street Address*</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    />
                    {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <Label htmlFor="city">City*</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    />
                    {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <Label htmlFor="state">State*</Label>
                    <Select
                      value={profileData.state}
                      onValueChange={(value) => setProfileData({ ...profileData, state: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="NJ">New Jersey</SelectItem>
                        <SelectItem value="CT">Connecticut</SelectItem>
                        <SelectItem value="PA">Pennsylvania</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <Label htmlFor="zipCode">ZIP Code*</Label>
                    <Input
                      id="zipCode"
                      value={profileData.zipCode}
                      onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                    />
                    {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>}
                  </div>

                  <div>
                    <Label htmlFor="country">Country*</Label>
                    <Select
                      value={profileData.country}
                      onValueChange={(value) => setProfileData({ ...profileData, country: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          {currentStep === 4 && (
            <Card>
              <CardHeader className="bg-white border-b border-gray-200">
                <CardTitle>Primary Contact Information</CardTitle>
                <CardDescription>
                  Main contact details for your firm
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contactEmail">Primary Contact Email*</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={profileData.contactEmail}
                      onChange={(e) => setProfileData({ ...profileData, contactEmail: e.target.value })}
                    />
                    {errors.contactEmail && <p className="text-red-600 text-sm mt-1">{errors.contactEmail}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number*</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Authorized Filers */}
          {currentStep === 5 && (
            <Card>
              <CardHeader className="bg-white border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Authorized Filers</CardTitle>
                    <CardDescription>
                      Manage team members who can submit bulk filings (up to 5 filers)
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    onClick={addFiler}
                    variant="outline"
                    className="border-[#00274E] text-[#00274E] hover:bg-[#00274E] hover:text-white"
                    disabled={profileData.authorizedFilers.length >= 5}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Filer
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {errors.authorizedFilers && (
                  <Alert className="mb-4 bg-red-50 border-red-300">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <AlertDescription className="text-red-900">
                      {errors.authorizedFilers}
                    </AlertDescription>
                  </Alert>
                )}

                {profileData.authorizedFilers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300">
                    <p className="mb-2">No authorized filers added yet</p>
                    <p className="text-sm">Click "Add Filer" to add your first team member</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profileData.authorizedFilers.map((filer, index) => (
                      <div key={filer.id} className="border border-gray-300 p-4 bg-white">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium text-gray-900">Filer #{index + 1}</h4>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => toggleFilerStatus(filer.id)}
                              className={filer.status === "Active" 
                                ? "border-green-600 text-green-600 hover:bg-green-50" 
                                : "border-gray-400 text-gray-600 hover:bg-gray-50"
                              }
                            >
                              {filer.status === "Active" ? "Active" : "Deactivated"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeFiler(filer.id)}
                              className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`filer-${filer.id}-name`}>Full Name*</Label>
                            <Input
                              id={`filer-${filer.id}-name`}
                              value={filer.fullName}
                              onChange={(e) => updateFiler(filer.id, "fullName", e.target.value)}
                              disabled={filer.status === "Deactivated"}
                            />
                            {errors[`filer_${index}_name`] && (
                              <p className="text-red-600 text-sm mt-1">{errors[`filer_${index}_name`]}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor={`filer-${filer.id}-email`}>Email*</Label>
                            <Input
                              id={`filer-${filer.id}-email`}
                              type="email"
                              value={filer.email}
                              onChange={(e) => updateFiler(filer.id, "email", e.target.value)}
                              disabled={filer.status === "Deactivated"}
                            />
                            {errors[`filer_${index}_email`] && (
                              <p className="text-red-600 text-sm mt-1">{errors[`filer_${index}_email`]}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor={`filer-${filer.id}-title`}>Title/Position*</Label>
                            <Input
                              id={`filer-${filer.id}-title`}
                              value={filer.title}
                              onChange={(e) => updateFiler(filer.id, "title", e.target.value)}
                              disabled={filer.status === "Deactivated"}
                            />
                            {errors[`filer_${index}_title`] && (
                              <p className="text-red-600 text-sm mt-1">{errors[`filer_${index}_title`]}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor={`filer-${filer.id}-role`}>Role*</Label>
                            <Select
                              value={filer.role}
                              onValueChange={(value) => updateFiler(filer.id, "role", value)}
                              disabled={filer.status === "Deactivated"}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Authorized Filer">Authorized Filer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 border-t-2 border-gray-200">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={handlePrevious}
                  variant="outline"
                  className="border-gray-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              {currentStep === 1 && onBack && (
                <Button
                  type="button"
                  onClick={onBack}
                  variant="outline"
                  className="border-gray-300"
                >
                  Cancel
                </Button>
              )}
            </div>
            
            <div>
              {currentStep < totalSteps && (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#00274E] hover:bg-[#003d73] text-white px-8"
                >
                  Continue
                </Button>
              )}
              {currentStep === totalSteps && (
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#00274E] hover:bg-[#003d73] text-white px-8"
                >
                  {isSaving ? "Saving..." : isFirstTime ? "Complete Profile & Start Filing" : "Save Changes"}
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Change Request Modal */}
        <Dialog open={showChangeRequestModal} onOpenChange={setShowChangeRequestModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Request Field Change</DialogTitle>
              <DialogDescription>
                Changes to {changeRequestField === "firmName" ? "Legal Business Name" : "EIN"} require admin review and approval.
                Please explain why this change is needed.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label>Current Value</Label>
                <Input
                  value={changeRequestField === "firmName" ? profileData.firmName : profileData.ein}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="changeReason">Reason for Change*</Label>
                <Textarea
                  id="changeReason"
                  value={changeRequestReason}
                  onChange={(e) => setChangeRequestReason(e.target.value)}
                  placeholder="Please provide a detailed explanation for this change request..."
                  rows={4}
                />
              </div>

              <Alert className="bg-yellow-50 border-yellow-300">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <AlertDescription className="text-yellow-900 text-sm">
                  <strong>Important:</strong> Changes may take up to 48 hours to review. You'll receive an email notification 
                  when your request is approved or denied.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowChangeRequestModal(false);
                  setChangeRequestField("");
                  setChangeRequestReason("");
                }}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangeRequest}
                className="bg-[#00274E] hover:bg-[#003d73] text-white"
              >
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}