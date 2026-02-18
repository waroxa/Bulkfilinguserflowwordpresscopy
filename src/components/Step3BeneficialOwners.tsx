import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2, AlertTriangle, Search, ChevronLeft, ChevronRight, Plus, Trash2, Info } from "lucide-react";
import { Client, BeneficialOwner, CompanyApplicant } from "../types";
import { DatePicker } from "./DatePicker";

interface Step3BeneficialOwnersProps {
  clients: Client[];
  onComplete: (clients: Client[]) => void;
  onBack: () => void;
}

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

// ✅ ADDRESS FIELD STANDARD - Canadian provinces/territories (see /ADDRESS_FIELD_STANDARD.md)
const CANADIAN_PROVINCES = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
  "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island",
  "Quebec", "Saskatchewan", "Yukon"
];

// ✅ ADDRESS FIELD STANDARD - System-wide countries list (see /ADDRESS_FIELD_STANDARD.md)
const COUNTRIES = [
  "United States", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus",
  "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "North Korea", "South Korea",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
  "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
  "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
  "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
  "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay",
  "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export default function Step3BeneficialOwners({ clients, onComplete, onBack }: Step3BeneficialOwnersProps) {
  // Filter to only show disclosure clients (those submitting beneficial ownership)
  const disclosureClients = clients.filter(c => c.filingType === "disclosure");
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [updatedClients, setUpdatedClients] = useState<Client[]>(clients);
  const [searchTerm, setSearchTerm] = useState("");
  const [useApplicantAsOwner, setUseApplicantAsOwner] = useState(false);

  // If no disclosure clients, skip this step
  useEffect(() => {
    if (disclosureClients.length === 0) {
      alert("No clients selected for beneficial ownership disclosure. Skipping this step.");
      onComplete(updatedClients);
    }
  }, []);

  if (disclosureClients.length === 0) {
    return null;
  }

  const currentClient = disclosureClients[currentIndex];
  const currentClientGlobalIndex = updatedClients.findIndex(c => c.id === currentClient.id);

  // Handle beneficial owner operations
  const handleAddOwner = () => {
    const updated = [...updatedClients];
    const newOwner: BeneficialOwner = {
      id: `owner-${Date.now()}`,
      fullName: "",
      dob: "",
      address: "",
      addressType: "Residential",
      idType: "SSN",
      idNumber: "",
      issuingCountry: "United States",
      issuingState: "",
      ownershipPercentage: ""
    };

    updated[currentClientGlobalIndex] = {
      ...updated[currentClientGlobalIndex],
      beneficialOwners: [...(updated[currentClientGlobalIndex].beneficialOwners || []), newOwner]
    };
    setUpdatedClients(updated);
  };

  const handleUpdateOwner = (ownerId: string, field: keyof BeneficialOwner, value: any) => {
    const updated = [...updatedClients];
    const owners = updated[currentClientGlobalIndex].beneficialOwners || [];
    updated[currentClientGlobalIndex] = {
      ...updated[currentClientGlobalIndex],
      beneficialOwners: owners.map(o => o.id === ownerId ? { ...o, [field]: value } : o)
    };
    setUpdatedClients(updated);
  };

  const handleRemoveOwner = (ownerId: string) => {
    const updated = [...updatedClients];
    updated[currentClientGlobalIndex] = {
      ...updated[currentClientGlobalIndex],
      beneficialOwners: (updated[currentClientGlobalIndex].beneficialOwners || []).filter(o => o.id !== ownerId)
    };
    setUpdatedClients(updated);
  };

  const handleUseApplicantAsOwner = (checked: boolean) => {
    setUseApplicantAsOwner(checked);
    
    if (checked) {
      const updated = [...updatedClients];
      const applicants = updated[currentClientGlobalIndex].companyApplicants || [];
      
      if (applicants.length > 0) {
        const applicant = applicants[0]; // Use first applicant
        const owners = updated[currentClientGlobalIndex].beneficialOwners || [];
        
        // Check if already exists
        const existingOwner = owners.find(o => o.fullName === applicant.fullName && o.dob === applicant.dob);
        
        if (!existingOwner) {
          const newOwner: BeneficialOwner = {
            id: `owner-${Date.now()}`,
            fullName: applicant.fullName,
            dob: applicant.dob,
            address: applicant.address,
            addressType: "Residential",
            idType: applicant.idType,
            idNumber: applicant.idNumber,
            issuingCountry: applicant.issuingCountry || "United States",
            issuingState: applicant.issuingState,
            ownershipPercentage: "100",
            isOrganizer: true
          };
          
          updated[currentClientGlobalIndex] = {
            ...updated[currentClientGlobalIndex],
            beneficialOwners: [newOwner, ...owners]
          };
          
          setUpdatedClients(updated);
        }
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < disclosureClients.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUseApplicantAsOwner(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUseApplicantAsOwner(false);
    }
  };

  const handleClientSelect = (clientId: string) => {
    const index = disclosureClients.findIndex(c => c.id === clientId);
    if (index !== -1) {
      setCurrentIndex(index);
      setUseApplicantAsOwner(false);
    }
  };

  const handleComplete = () => {
    // Validate all beneficial owners have required fields and update dataComplete status
    const finalClients = updatedClients.map(client => {
      if (client.filingType === 'disclosure') {
        const owners = client.beneficialOwners || [];
        
        // Check if all required BO fields are complete
        const allBOComplete = owners.length > 0 && owners.every(bo => {
          const [street, city, state, zip, country] = bo.address?.split('|') || [];
          return (
            bo.fullName?.trim() &&
            bo.dob &&
            street?.trim() &&
            city?.trim() &&
            state?.trim() &&
            zip?.trim() &&
            country?.trim() &&
            bo.idType &&
            bo.idNumber?.trim() &&
            bo.issuingCountry &&
            (bo.issuingCountry !== 'United States' || bo.issuingState) &&
            bo.ownershipPercentage &&
            parseFloat(bo.ownershipPercentage) > 0
          );
        });
        
        return {
          ...client,
          dataComplete: allBOComplete
        };
      }
      return client;
    });
    
    onComplete(finalClients);
  };

  // Count completed clients (those with at least one beneficial owner)
  const completedCount = disclosureClients.filter(c => {
    const client = updatedClients.find(uc => uc.id === c.id);
    const owners = client?.beneficialOwners || [];
    return owners.length > 0 && owners.every(o => o.fullName && o.dob && o.ownershipPercentage);
  }).length;

  const isCurrentClientComplete = () => {
    const owners = currentClient.beneficialOwners || [];
    return owners.length > 0 && owners.every(o => o.fullName && o.dob && o.ownershipPercentage);
  };

  const currentOwners = updatedClients[currentClientGlobalIndex]?.beneficialOwners || [];

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="border-2 border-[#00274E] rounded-none">
        <CardHeader className="bg-[#00274E] text-white rounded-none pb-6 border-b-4 border-yellow-400">
          <CardTitle>Beneficial Owner Information</CardTitle>
          <CardDescription className="text-gray-300">
            Provide beneficial owner details for clients selected for disclosure. Clients not selected for disclosure are automatically skipped.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#00274E]" />
              <span className="text-sm">
                Progress: <strong>{completedCount} of {disclosureClients.length}</strong> disclosure clients completed
              </span>
            </div>
          </div>

          {/* Search and Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search disclosure clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-none"
              />
            </div>

            {/* Client Dropdown */}
            <Select value={currentClient.id} onValueChange={handleClientSelect}>
              <SelectTrigger className="rounded-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {disclosureClients.map((client) => {
                  const clientData = updatedClients.find(c => c.id === client.id);
                  const owners = clientData?.beneficialOwners || [];
                  const isComplete = owners.length > 0 && owners.every(o => o.fullName && o.dob && o.ownershipPercentage);
                  
                  return (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center gap-2">
                        {isComplete ? (
                          <CheckCircle2 className="h-4 w-4 text-[#00274E]" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        )}
                        <span>{client.llcName} ({client.nydosId}) - {owners.length} owner(s)</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Current Client Form */}
      <Card className="border-2 border-gray-300 rounded-none">
        <CardHeader className="bg-gray-50 border-b-2 border-gray-300 rounded-none">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {isCurrentClientComplete() && <CheckCircle2 className="h-5 w-5 text-[#00274E]" />}
                {currentClient.llcName}
              </CardTitle>
              <CardDescription>
                NYDOS ID: {currentClient.nydosId} • EIN: {currentClient.ein}
              </CardDescription>
            </div>
            <div className="text-sm text-gray-600">
              Client {currentIndex + 1} of {disclosureClients.length} (Disclosure)
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Info Alert */}
          <Alert className="border-blue-200 bg-blue-50 rounded-none">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <p className="mb-2"><strong>Who is a Beneficial Owner?</strong></p>
              <p className="text-sm">
                A beneficial owner is any individual who owns or controls at least 25% of the company, or who exercises substantial control over the company. You must report at least one beneficial owner (maximum 9).
              </p>
            </AlertDescription>
          </Alert>

          {/* Beneficial Owners List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg">Beneficial Owners ({currentOwners.length}/9)</h3>
              <Button
                onClick={handleAddOwner}
                disabled={currentOwners.length >= 9}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Beneficial Owner
              </Button>
            </div>

            {currentOwners.length === 0 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  No beneficial owners added yet. Please add at least one beneficial owner to continue.
                </AlertDescription>
              </Alert>
            )}

            {currentOwners.map((owner, index) => (
              <Card key={owner.id} className="border-2 border-gray-300">
                <CardHeader className="bg-gray-50 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Beneficial Owner {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOwner(owner.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label>Full Name *</Label>
                      <Input
                        placeholder="Full Legal Name"
                        value={owner.fullName}
                        onChange={(e) => handleUpdateOwner(owner.id, "fullName", e.target.value)}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label>Date of Birth *</Label>
                      <DatePicker
                        value={owner.dob}
                        onChange={(date) => handleUpdateOwner(owner.id, "dob", date)}
                      />
                    </div>

                    {/* Important Address Notice */}
                    <div className="md:col-span-2">
                      <Alert className="border-red-300 bg-red-50">
                        <AlertDescription className="text-red-800 text-sm">
                          Use the individual's residential or business address — not the LLC's registered office or mailing address.
                        </AlertDescription>
                      </Alert>
                    </div>

                    {/* Current Address Section */}
                    <div className="md:col-span-2 mt-4">
                      <h4 className="font-semibold mb-3">Current Address</h4>
                    </div>

                    <div className="md:col-span-2">
                      <Label>Street Address *</Label>
                      <Input
                        placeholder="Street Address"
                        value={owner.address.split('|')[0] || owner.address}
                        onChange={(e) => {
                          const parts = owner.address.split('|');
                          parts[0] = e.target.value;
                          handleUpdateOwner(owner.id, "address", parts.join('|'));
                        }}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label>City *</Label>
                      <Input
                        placeholder="City"
                        value={owner.address.split('|')[1] || ''}
                        onChange={(e) => {
                          const parts = owner.address.split('|');
                          parts[1] = e.target.value;
                          handleUpdateOwner(owner.id, "address", parts.join('|'));
                        }}
                      />
                    </div>

                    {/* Country Field - Full Width */}
                    <div className="md:col-span-2">
                      <Label>Country *</Label>
                      <Select
                        value={owner.issuingCountry || "United States"}
                        onValueChange={(value) => handleUpdateOwner(owner.id, "issuingCountry", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country..." />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* State Field - Conditional based on country */}
                    {(owner.issuingCountry || "United States") === "United States" ? (
                      <div className="md:col-span-2">
                        <Label>State *</Label>
                        <Select
                          value={owner.address.split('|')[2] || ''}
                          onValueChange={(value) => {
                            const parts = owner.address.split('|');
                            parts[2] = value;
                            handleUpdateOwner(owner.id, "address", parts.join('|'));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state..." />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (owner.issuingCountry || "United States") === "Canada" ? (
                      <div className="md:col-span-2">
                        <Label>Province/Territory *</Label>
                        <Select
                          value={owner.address.split('|')[2] || ''}
                          onValueChange={(value) => {
                            const parts = owner.address.split('|');
                            parts[2] = value;
                            handleUpdateOwner(owner.id, "address", parts.join('|'));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select province/territory..." />
                          </SelectTrigger>
                          <SelectContent>
                            {CANADIAN_PROVINCES.map((province) => (
                              <SelectItem key={province} value={province}>
                                {province}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="md:col-span-2">
                        <Label>State/Province *</Label>
                        <Input
                          placeholder="State or Province"
                          value={owner.address.split('|')[2] || ''}
                          onChange={(e) => {
                            const parts = owner.address.split('|');
                            parts[2] = e.target.value;
                            handleUpdateOwner(owner.id, "address", parts.join('|'));
                          }}
                        />
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <Label>Zip Code *</Label>
                      <Input
                        placeholder="Zip Code"
                        value={owner.address.split('|')[3] || ''}
                        onChange={(e) => {
                          const parts = owner.address.split('|');
                          parts[3] = e.target.value;
                          handleUpdateOwner(owner.id, "address", parts.join('|'));
                        }}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label>Ownership Percentage *</Label>
                      <Input
                        type="number"
                        placeholder="Owns or controls at least 25%"
                        value={owner.ownershipPercentage}
                        onChange={(e) => handleUpdateOwner(owner.id, "ownershipPercentage", e.target.value)}
                        min="0"
                        max="100"
                      />
                      {(!owner.ownershipPercentage || owner.ownershipPercentage === '') && (
                        <p className="text-sm text-red-600 mt-1">Ownership Percentage is required</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label>Position / Title *</Label>
                      <Input
                        placeholder="e.g., CEO, Managing Member, Owner"
                        value={owner.position || ''}
                        onChange={(e) => handleUpdateOwner(owner.id, "position", e.target.value)}
                      />
                    </div>

                    {/* ✅ ADDRESS FIELD STANDARD - Conditional State field based on country (see /ADDRESS_FIELD_STANDARD.md) */}
                    {/* {(owner.issuingCountry || "United States") === "United States" ? (
                      <div>
                        <Label>State *</Label>
                        <Select
                          value={owner.address.split('|')[2] || ''}
                          onValueChange={(value) => {
                            const parts = owner.address.split('|');
                            parts[2] = value;
                            handleUpdateOwner(owner.id, "address", parts.join('|'));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state..." />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (owner.issuingCountry || "United States") === "Canada" ? (
                      <div>
                        <Label>Province/Territory *</Label>
                        <Select
                          value={owner.address.split('|')[2] || ''}
                          onValueChange={(value) => {
                            const parts = owner.address.split('|');
                            parts[2] = value;
                            handleUpdateOwner(owner.id, "address", parts.join('|'));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select province/territory..." />
                          </SelectTrigger>
                          <SelectContent>
                            {CANADIAN_PROVINCES.map((province) => (
                              <SelectItem key={province} value={province}>
                                {province}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div>
                        <Label>State/Province</Label>
                        <Input
                          placeholder="State or Province"
                          value={owner.address.split('|')[2] || ''}
                          onChange={(e) => {
                            const parts = owner.address.split('|');
                            parts[2] = e.target.value;
                            handleUpdateOwner(owner.id, "address", parts.join('|'));
                          }}
                        />
                      </div>
                    )} */}

                    {/* ✅ ADDRESS FIELD STANDARD - Country as dropdown (see /ADDRESS_FIELD_STANDARD.md) */}
                    {/* <div>
                      <Label>Country *</Label>
                      <Select
                        value={owner.issuingCountry || "United States"}
                        onValueChange={(value) => handleUpdateOwner(owner.id, "issuingCountry", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country..." />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div> */}

                    <div className="md:col-span-2 pt-4 border-t">
                      <h4 className="mb-3 font-semibold">Identity Verification</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        You do not need to upload a copy of your ID — only enter the document type, number, and issuing jurisdiction.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label>What type of ID are you Providing? *</Label>
                          <Select 
                            value={owner.idType} 
                            onValueChange={(value) => handleUpdateOwner(owner.id, "idType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="State Issued Drivers License">State Issued Drivers License</SelectItem>
                              <SelectItem value="State/local/tribal-issued ID">State/local/tribal-issued ID</SelectItem>
                              <SelectItem value="U.S. Passport">U.S. Passport</SelectItem>
                              <SelectItem value="Foreign Passport">Foreign Passport</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-2">
                          <Label>ID Number *</Label>
                          <Input
                            placeholder={
                              owner.idType === "U.S. Passport" 
                                ? "U.S. Passport Number" 
                                : "Enter ID Number (Max 15)"
                            }
                            value={owner.idNumber}
                            onChange={(e) => handleUpdateOwner(owner.id, "idNumber", e.target.value)}
                            maxLength={15}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label>ID Expiration Date *</Label>
                          <Input
                            type="date"
                            placeholder="MM-DD-YYYY"
                            value={owner.idExpirationDate || ""}
                            onChange={(e) => handleUpdateOwner(owner.id, "idExpirationDate", e.target.value)}
                          />
                        </div>

                        {/* Issuing Country - Show for Foreign Passport, State Issued Drivers License, and State/local/tribal-issued ID */}
                        {(owner.idType === "Foreign Passport" || 
                          owner.idType === "State Issued Drivers License" || 
                          owner.idType === "State/local/tribal-issued ID") && (
                          <div className="md:col-span-2">
                            <Label>Issuing Country *</Label>
                            <Select 
                              value={owner.issuingCountry || "United States"} 
                              onValueChange={(value) => {
                                handleUpdateOwner(owner.id, "issuingCountry", value);
                                // Reset issuing state if country changes
                                if (value !== "United States") {
                                  handleUpdateOwner(owner.id, "issuingState", "");
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                              <SelectContent>
                                {COUNTRIES.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Issuing State - Only show when Issuing Country is United States */}
                        {(owner.idType === "Foreign Passport" || 
                          owner.idType === "State Issued Drivers License" || 
                          owner.idType === "State/local/tribal-issued ID") && 
                          (owner.issuingCountry || "United States") === "United States" && (
                          <div className="md:col-span-2">
                            <Label>Issuing State *</Label>
                            <Select 
                              value={owner.issuingState || ''} 
                              onValueChange={(value) => handleUpdateOwner(owner.id, "issuingState", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a state" />
                              </SelectTrigger>
                              <SelectContent>
                                {US_STATES.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Show disabled "Select a country first" message for Issuing State when no country selected */}
                        {(owner.idType === "Foreign Passport" || 
                          owner.idType === "State Issued Drivers License" || 
                          owner.idType === "State/local/tribal-issued ID") && 
                          !(owner.issuingCountry) && (
                          <div className="md:col-span-2">
                            <Label>Issuing State *</Label>
                            <Input
                              disabled
                              placeholder="Select a country first"
                              className="bg-gray-100"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous Client
            </Button>

            {currentIndex < disclosureClients.length - 1 ? (
              <Button
                onClick={handleNext}
              >
                Next Client
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="bg-[#00274E] hover:bg-[#00274E]/90"
              >
                Continue to Review
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Company Applicant
        </Button>
        <Button
          onClick={handleComplete}
          className="bg-[#00274E] hover:bg-[#00274E]/90"
        >
          Continue to Review ({completedCount}/{disclosureClients.length} Complete)
        </Button>
      </div>
    </div>
  );
}