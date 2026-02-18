import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Trash2, ArrowLeft, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface AuthorizedUser {
  id: string;
  fullName: string;
  email: string;
  title: string;
}

export interface FirmProfileData {
  firmName: string;
  contactPerson: string;
  contactEmail: string;
  phone: string;
  ein: string;
  professionalType: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  authorizedUsers: AuthorizedUser[];
  authorized: boolean;
  isComplete: boolean;
}

interface MyFirmProfileProps {
  onBack: () => void;
}

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" }
];

const COUNTRIES = [
  { value: "United States", label: "United States" },
  { value: "Canada", label: "Canada" },
  { value: "Mexico", label: "Mexico" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Other", label: "Other" }
];

const PROFESSIONAL_TYPES = [
  { value: "CPA (Certified Public Accountant)", label: "CPA (Certified Public Accountant)" },
  { value: "Attorney", label: "Attorney" },
  { value: "Compliance Professional", label: "Compliance Professional" },
  { value: "Registered Agent", label: "Registered Agent" },
  { value: "Other Professional Services", label: "Other Professional Services" }
];

export default function MyFirmProfile({ onBack }: MyFirmProfileProps) {
  const [profileData, setProfileData] = useState<FirmProfileData>({
    firmName: "",
    contactPerson: "",
    contactEmail: "",
    phone: "",
    ein: "",
    professionalType: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    authorizedUsers: [],
    authorized: false,
    isComplete: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadFirmProfile();
  }, []);

  const loadFirmProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2c01e603/firm-profile`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfileData(prev => ({
            ...prev,
            ...data.profile,
            authorizedUsers: data.profile.authorizedUsers || data.profile.authorizedFilers || []
          }));
        }
      }
    } catch (error) {
      console.error("Error loading firm profile:", error);
      toast.error("Failed to load firm profile");
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = () => {
    if (profileData.authorizedUsers.length >= 3) {
      toast.error("You can register up to 3 authorized users");
      return;
    }

    const newUser: AuthorizedUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      fullName: "",
      email: "",
      title: ""
    };

    setProfileData({
      ...profileData,
      authorizedUsers: [...profileData.authorizedUsers, newUser]
    });
  };

  const removeUser = (id: string) => {
    setProfileData({
      ...profileData,
      authorizedUsers: profileData.authorizedUsers.filter(u => u.id !== id)
    });
  };

  const updateUser = (id: string, field: keyof AuthorizedUser, value: string) => {
    setProfileData({
      ...profileData,
      authorizedUsers: profileData.authorizedUsers.map(u =>
        u.id === id ? { ...u, [field]: value } : u
      )
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!profileData.firmName.trim()) newErrors.firmName = "Legal Business Name is required";
    if (!profileData.contactPerson.trim()) newErrors.contactPerson = "Contact Person is required";
    if (!profileData.contactEmail.trim()) newErrors.contactEmail = "Email is required";
    if (!profileData.phone.trim()) newErrors.phone = "Phone is required";
    if (!profileData.ein.trim()) newErrors.ein = "EIN is required";
    if (!profileData.professionalType) newErrors.professionalType = "Professional Type is required";
    if (!profileData.address.trim()) newErrors.address = "Street Address is required";
    if (!profileData.city.trim()) newErrors.city = "City is required";
    
    // State and ZIP required only for United States
    if (profileData.country === "United States") {
      if (!profileData.state.trim()) newErrors.state = "State is required";
      if (!profileData.zipCode.trim()) newErrors.zipCode = "ZIP Code is required";
    }
    
    if (!profileData.authorized) newErrors.authorized = "You must authorize filing on behalf of clients";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please correct the errors before saving");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2c01e603/firm-profile`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...profileData,
            isComplete: true
          })
        }
      );

      if (response.ok) {
        toast.success("Firm profile updated successfully!");
        await loadFirmProfile();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to save firm profile");
      }
    } catch (error) {
      console.error("Error saving firm profile:", error);
      toast.error("Failed to save firm profile");
    } finally {
      setIsSaving(false);
    }
  };

  const isUSA = profileData.country === "United States";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
          <p className="text-gray-500 mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#00274E] text-white shadow-md border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ImageWithFallback 
                src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                alt="NYLTA.com Logo"
                className="h-10 w-auto"
              />
              <h1 className="text-xl text-white">My Firm Profile</h1>
            </div>
            <Button
              onClick={onBack}
              variant="outline"
              className="bg-white text-[#00274E] border-white hover:bg-gray-100"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Business Information */}
          <Card className="border-2 border-gray-300">
            <CardHeader className="bg-white border-b-2 border-gray-200">
              <CardTitle>Business Information</CardTitle>
              <CardDescription className="text-gray-600">
                Enter the legal name of your professional firm or office as registered with the state.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <Label htmlFor="firmName" className="text-gray-900">
                  Legal Business Name <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="firmName"
                  value={profileData.firmName}
                  onChange={(e) => setProfileData({ ...profileData, firmName: e.target.value })}
                  placeholder="Smith & Associates CPA"
                  className="border-2 border-yellow-400 focus:border-[#00274E]"
                />
                {errors.firmName && <p className="text-red-600 text-sm mt-1">{errors.firmName}</p>}
              </div>

              <div>
                <Label htmlFor="contactPerson" className="text-gray-900">
                  Contact Person (Authorized Filer) <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="contactPerson"
                  value={profileData.contactPerson}
                  onChange={(e) => setProfileData({ ...profileData, contactPerson: e.target.value })}
                  placeholder="John Smith"
                  className="border-2 border-yellow-400 focus:border-[#00274E]"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Full name of the individual authorized to submit bulk filings on behalf of the firm.
                </p>
                {errors.contactPerson && <p className="text-red-600 text-sm mt-1">{errors.contactPerson}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contactEmail" className="text-gray-900">
                    Email <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={profileData.contactEmail}
                    onChange={(e) => setProfileData({ ...profileData, contactEmail: e.target.value })}
                    placeholder="john@smithcpa.com"
                    className="border-2 border-yellow-400 focus:border-[#00274E]"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Primary email for filing confirmations and account notifications.
                  </p>
                  {errors.contactEmail && <p className="text-red-600 text-sm mt-1">{errors.contactEmail}</p>}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-900">
                    Phone <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="border-2 border-yellow-400 focus:border-[#00274E]"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Contact number for account verification and filing support.
                  </p>
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="ein" className="text-gray-900">
                    EIN <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="ein"
                    value={profileData.ein}
                    onChange={(e) => setProfileData({ ...profileData, ein: e.target.value })}
                    placeholder="12-3456789"
                    className="border-2 border-yellow-400 focus:border-[#00274E]"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Your firm's 9-digit Employer Identification Number issued by the IRS.
                  </p>
                  {errors.ein && <p className="text-red-600 text-sm mt-1">{errors.ein}</p>}
                </div>

                <div>
                  <Label htmlFor="professionalType" className="text-gray-900">
                    Professional Type <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    value={profileData.professionalType}
                    onValueChange={(value) => setProfileData({ ...profileData, professionalType: value })}
                  >
                    <SelectTrigger className="border-2 border-yellow-400 focus:border-[#00274E]">
                      <SelectValue placeholder="Select professional type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFESSIONAL_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-1">
                    Select the category that best describes your professional services.
                  </p>
                  {errors.professionalType && <p className="text-red-600 text-sm mt-1">{errors.professionalType}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Firm Address */}
          <Card className="border-2 border-gray-300">
            <CardHeader className="bg-white border-b-2 border-gray-200">
              <CardTitle>Firm Address</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <Label htmlFor="address" className="text-gray-900">
                  Street Address <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  placeholder="123 Main Street, Suite 100"
                  className="border-2 border-yellow-400 focus:border-[#00274E]"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Physical street address of your firm's main office.
                </p>
                {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="city" className="text-gray-900">
                    City <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    placeholder="New York"
                    className="border-2 border-yellow-400 focus:border-[#00274E]"
                  />
                  {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="state" className="text-gray-900">
                    State {isUSA && <span className="text-red-600">*</span>}
                  </Label>
                  <Select
                    value={profileData.state}
                    onValueChange={(value) => setProfileData({ ...profileData, state: value })}
                    disabled={!isUSA}
                  >
                    <SelectTrigger className={`border-2 ${isUSA ? 'border-yellow-400' : 'border-gray-300'} focus:border-[#00274E]`}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map(state => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
                </div>

                <div>
                  <Label htmlFor="zipCode" className="text-gray-900">
                    ZIP Code {isUSA && <span className="text-red-600">*</span>}
                  </Label>
                  <Input
                    id="zipCode"
                    value={profileData.zipCode}
                    onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                    placeholder="10001"
                    disabled={!isUSA}
                    className={`border-2 ${isUSA ? 'border-yellow-400' : 'border-gray-300'} focus:border-[#00274E]`}
                  />
                  {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="country" className="text-gray-900">
                  Country <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={profileData.country}
                  onValueChange={(value) => {
                    setProfileData({ 
                      ...profileData, 
                      country: value,
                      // Clear state and zip when switching from USA
                      state: value !== "United States" ? "" : profileData.state,
                      zipCode: value !== "United States" ? "" : profileData.zipCode
                    });
                  }}
                >
                  <SelectTrigger className="border-2 border-yellow-400 focus:border-[#00274E]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(country => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600 mt-1">
                  Country where your firm is located.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Authorized Users */}
          <Card className="border-2 border-gray-300">
            <CardHeader className="bg-white border-b-2 border-gray-200">
              <CardTitle>Authorized Users (Optional)</CardTitle>
              <CardDescription className="text-gray-600">
                Register up to 3 authorized users from your firm who can be selected as Company Applicants during bulk filing. 
                You can also enter a new person's details during filing if needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {profileData.authorizedUsers.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 bg-gray-50">
                  <p className="text-gray-600 mb-4">No authorized users added yet</p>
                  <Button
                    onClick={addUser}
                    variant="outline"
                    className="border-[#00274E] text-[#00274E] hover:bg-[#00274E] hover:text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add User (0/3)
                  </Button>
                </div>
              ) : (
                <>
                  {profileData.authorizedUsers.map((user, index) => (
                    <Card key={user.id} className="border-2 border-yellow-400 bg-yellow-50">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">User {index + 1}</h4>
                          <Button
                            onClick={() => removeUser(user.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`user-${user.id}-name`}>Full Name</Label>
                            <Input
                              id={`user-${user.id}-name`}
                              value={user.fullName}
                              onChange={(e) => updateUser(user.id, 'fullName', e.target.value)}
                              placeholder="Jane Doe"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`user-${user.id}-email`}>Email</Label>
                            <Input
                              id={`user-${user.id}-email`}
                              type="email"
                              value={user.email}
                              onChange={(e) => updateUser(user.id, 'email', e.target.value)}
                              placeholder="jane@smithcpa.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`user-${user.id}-title`}>Title</Label>
                            <Input
                              id={`user-${user.id}-title`}
                              value={user.title}
                              onChange={(e) => updateUser(user.id, 'title', e.target.value)}
                              placeholder="Senior Associate"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {profileData.authorizedUsers.length < 3 && (
                    <Button
                      onClick={addUser}
                      variant="outline"
                      className="w-full border-[#00274E] text-[#00274E] hover:bg-[#00274E] hover:text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add User ({profileData.authorizedUsers.length}/3)
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Authorization */}
          <Card className="border-2 border-gray-300">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 bg-blue-50 border-2 border-blue-200 p-4">
                <Checkbox
                  id="authorized"
                  checked={profileData.authorized}
                  onCheckedChange={(checked) => setProfileData({ ...profileData, authorized: checked as boolean })}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="authorized" className="text-gray-900 cursor-pointer">
                    I am authorized to file NYLTA reports on behalf of my clients. <span className="text-red-600">*</span>
                  </Label>
                  {errors.authorized && <p className="text-red-600 text-sm mt-1">{errors.authorized}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sticky bottom-0 bg-white border-t-4 border-yellow-400 p-4 shadow-lg">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 border-gray-300"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-[#00274E] hover:bg-[#003d73] text-white"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          {/* Info Alert */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-gray-700">
              <strong className="text-[#00274E]">Note:</strong> Changes to your firm profile will be saved immediately. 
              For security-sensitive fields like EIN or Legal Business Name, contact support if changes are needed.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  );
}
