import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2, AlertCircle, Building2, User, Plus, X, Info, Trash2 } from "lucide-react";
import { Client, CompanyApplicant, FirmWorker } from "../types";
import { DatePicker } from "./DatePicker";

interface Step3FirmCompanyApplicantProps {
  clients: Client[];
  firmWorkers?: FirmWorker[];
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

// List of all countries
const COUNTRIES = [
  "United States",
  "Canada",
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
  "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cambodia", "Cameroon", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia",
  "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia",
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "North Korea", "South Korea", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali",
  "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
  "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
  "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay",
  "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const emptyApplicant = (): CompanyApplicant => ({
  id: `ca-${Date.now()}-${Math.random()}`,
  fullName: "",
  phoneNumber: "",
  email: "",
  titleOrRole: "",
  dob: "",
  address: "||||",
  idType: "SSN",
  idNumber: "",
  idExpirationDate: "",
  issuingCountry: "United States",
  issuingState: "",
  role: "",
  isSameAsBeneficialOwner: false
});

// NYLTA Company Applicant (pre-filled, always required)
const NYLTA_APPLICANT: CompanyApplicant = {
  id: "ca-nylta-official",
  fullName: "Tiffany Colon",
  dob: "01/01/1990", // Placeholder DOB
  address: "123 Filing Center Drive|Albany|New York|12207|United States|support@nylta.com",
  idType: "SSN",
  idNumber: "XXX-XX-XXXX", // Placeholder - will be replaced with actual info
  issuingCountry: "United States",
  issuingState: "New York",
  role: "NYLTA Authorized Filing Agent"
};

export default function Step3FirmCompanyApplicant({ clients, firmWorkers = [], onComplete, onBack }: Step3FirmCompanyApplicantProps) {
  // Start with NO firm applicants - user must add them (up to 2)
  const [firmApplicants, setFirmApplicants] = useState<CompanyApplicant[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<(string | null)[]>([]);

  // Handle firm worker selection for a specific applicant
  const handleWorkerSelect = (index: number, workerId: string) => {
    if (workerId === "manual") {
      const newSelectedWorkers = [...selectedWorkers];
      newSelectedWorkers[index] = null;
      setSelectedWorkers(newSelectedWorkers);
      
      const newApplicants = [...firmApplicants];
      // Create a fresh empty applicant with a new unique ID to force re-render
      newApplicants[index] = {
        id: `ca-${Date.now()}-${Math.random()}`,
        fullName: "",
        phoneNumber: "",
        email: "",
        titleOrRole: "",
        dob: "",
        address: "||||",
        idType: "SSN",
        idNumber: "",
        idExpirationDate: "",
        issuingCountry: "United States",
        issuingState: "",
        role: "",
        isSameAsBeneficialOwner: false
      };
      setFirmApplicants(newApplicants);
      return;
    }

    const worker = firmWorkers.find(w => w.id === workerId);
    if (worker) {
      const newSelectedWorkers = [...selectedWorkers];
      newSelectedWorkers[index] = workerId;
      setSelectedWorkers(newSelectedWorkers);
      
      const newApplicants = [...firmApplicants];
      newApplicants[index] = {
        id: `ca-${Date.now()}-${Math.random()}`,
        fullName: worker.fullName,
        phoneNumber: worker.phoneNumber,
        email: worker.email,
        titleOrRole: worker.title,
        dob: "",
        address: `|||||${worker.email}`,
        idType: "SSN",
        idNumber: "",
        idExpirationDate: "",
        issuingCountry: "United States",
        issuingState: "",
        role: worker.title,
        isSameAsBeneficialOwner: false
      };
      setFirmApplicants(newApplicants);
    }
  };

  // Handle applicant field updates
  const handleApplicantUpdate = (index: number, field: keyof CompanyApplicant, value: string) => {
    const newApplicants = [...firmApplicants];
    newApplicants[index] = {
      ...newApplicants[index],
      [field]: value
    };
    setFirmApplicants(newApplicants);
  };

  // Handle address field updates
  const handleAddressUpdate = (index: number, addressIndex: number, value: string) => {
    const newApplicants = [...firmApplicants];
    const parts = (newApplicants[index].address || "||||").split('|');
    parts[addressIndex] = value;
    newApplicants[index].address = parts.join('|');
    setFirmApplicants(newApplicants);
  };

  // Parse address
  const addressParts = (applicant: CompanyApplicant) => (applicant.address || "||||").split('|');
  const street = (applicant: CompanyApplicant) => addressParts(applicant)[0] || "";
  const city = (applicant: CompanyApplicant) => addressParts(applicant)[1] || "";
  const state = (applicant: CompanyApplicant) => addressParts(applicant)[2] || "";
  const zipCode = (applicant: CompanyApplicant) => addressParts(applicant)[3] || "";
  const country = (applicant: CompanyApplicant) => addressParts(applicant)[4] || "United States";

  // Add another firm applicant (max 2 firm applicants)
  const addApplicant = () => {
    if (firmApplicants.length < 2) {
      setFirmApplicants([...firmApplicants, emptyApplicant()]);
      setSelectedWorkers([...selectedWorkers, null]);
    }
  };

  // Remove a firm applicant
  const removeApplicant = (index: number) => {
    const newApplicants = firmApplicants.filter((_, i) => i !== index);
    const newSelectedWorkers = selectedWorkers.filter((_, i) => i !== index);
    setFirmApplicants(newApplicants);
    setSelectedWorkers(newSelectedWorkers);
  };

  // Validate firm applicant - ALL firm applicants are now optional (can have 0-2)
  const isFormValid = () => {
    // If no applicants added yet, that's valid (all optional now)
    if (firmApplicants.length === 0) return true;
    
    return firmApplicants.every((applicant) => {
      // Check if this applicant has ANY data entered
      const hasAnyData = 
        applicant.fullName.trim() !== "" ||
        applicant.dob !== "" ||
        street(applicant).trim() !== "" ||
        city(applicant).trim() !== "" ||
        state(applicant).trim() !== "" ||
        zipCode(applicant).trim() !== "" ||
        applicant.idNumber.trim() !== "" ||
        applicant.role.trim() !== "";
      
      // If user hasn't entered any data, it's valid (empty optional applicant)
      if (!hasAnyData) {
        return true;
      }
      
      // If user started filling it, ALL fields must be complete
      return (
        applicant.fullName.trim() !== "" &&
        applicant.dob !== "" &&
        street(applicant).trim() !== "" &&
        city(applicant).trim() !== "" &&
        state(applicant).trim() !== "" &&
        zipCode(applicant).trim() !== "" &&
        applicant.idType !== "" &&
        applicant.idNumber.trim() !== "" &&
        applicant.role.trim() !== ""
      );
    });
  };

  // Handle continue - apply NYLTA + firm applicant to ALL clients
  const handleContinue = () => {
    // Filter out optional applicants that are completely empty
    const completedApplicants = firmApplicants.filter((applicant) => {
      // Check if this applicant has ANY data entered
      const hasAnyData = 
        applicant.fullName.trim() !== "" ||
        applicant.dob !== "" ||
        street(applicant).trim() !== "" ||
        city(applicant).trim() !== "" ||
        state(applicant).trim() !== "" ||
        zipCode(applicant).trim() !== "" ||
        applicant.idNumber.trim() !== "" ||
        applicant.role.trim() !== "";
      
      // Only keep applicants that have data
      return hasAnyData;
    });

    const updatedClients = clients.map(client => ({
      ...client,
      companyApplicants: [
        // Applicant 1: NYLTA (always required)
        {
          ...NYLTA_APPLICANT,
          id: `ca-nylta-${client.id}-${Date.now()}`
        },
        // Applicant 2+: Firm representatives (only completed ones)
        ...completedApplicants.map((applicant, index) => ({
          ...applicant,
          id: `ca-firm-${client.id}-${index}-${Date.now()}`
        }))
      ]
    }));
    
    onComplete(updatedClients);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Card */}
      <Card className="border-2 border-[#00274E] rounded-none">
        <CardHeader className="bg-[#00274E] text-white rounded-none pb-6 border-b-4 border-yellow-400">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Applicant Information
          </CardTitle>
          <CardDescription className="text-gray-300">
            Tiffany Colon is automatically assigned as Company Applicant #1. 
            You may optionally add up to 2 authorized representatives from your firm (Company Applicant #2 and #3).
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 ml-2">
              <strong>Bulk Filing Notice:</strong> NYLTA.com is included as the primary Company Applicant for all bulk submissions. 
              Adding firm representatives is optional but recommended for compliance documentation.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Company Applicant #1: NYLTA (Pre-filled, Read-only) */}
      <Card className="border-2 border-gray-300 rounded-none bg-gray-50">
        <CardHeader className="bg-gray-100 rounded-none border-b border-gray-300">
          <CardTitle className="text-[#00274E] flex items-center gap-2">
            <User className="h-5 w-5" />
            Company Applicant #1: NYLTA Filing Service (Auto-assigned)
          </CardTitle>
          <CardDescription className="text-gray-700">
            NYLTA.com filing service representative - pre-configured for bulk submissions
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert className="border-green-200 bg-green-50 mb-4">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 ml-2">
              This applicant is automatically included with your bulk filing service. No action required.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Full Name:</span>
              <p className="text-gray-900">{NYLTA_APPLICANT.fullName}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Role:</span>
              <p className="text-gray-900">{NYLTA_APPLICANT.role}</p>
            </div>
            <div className="col-span-2">
              <span className="font-semibold text-gray-700">Status:</span>
              <p className="text-green-600 font-medium">✓ Pre-configured and ready</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamically render all firm applicants (Applicant #2+) */}
      {firmApplicants.map((applicant, index) => (
        <Card key={applicant.id} className="border-2 border-[#00274E] rounded-none">
          <CardHeader className="bg-white rounded-none border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-[#00274E] flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Company Applicant #{index + 2}: {index === 0 ? "Your Firm Representative" : "Additional Firm Representative"}
                </CardTitle>
                <CardDescription>
                  {index === 0 ? "Select or enter an authorized person from your firm (attorney, paralegal, or staff member)" : "Optional additional authorized person from your firm"}
                </CardDescription>
              </div>
              <Button
                onClick={() => removeApplicant(index)}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Worker Selection */}
            <div className="space-y-2">
              <Label>Select from Firm Authorized Users *</Label>
              <Select 
                value={selectedWorkers[index] || "manual"} 
                onValueChange={(val) => handleWorkerSelect(index, val)}
              >
                <SelectTrigger className="rounded-none border-gray-300">
                  <SelectValue placeholder="Select an authorized user or enter manually" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">➕ Enter Manually</SelectItem>
                  {firmWorkers.map(worker => (
                    <SelectItem key={worker.id} value={worker.id}>
                      {worker.fullName} - {worker.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Select from authorized users added in your firm profile or enter manually
              </p>
            </div>

            {/* Manual Entry Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Legal Name *</Label>
                  <Input
                    value={applicant.fullName}
                    onChange={(e) => handleApplicantUpdate(index, "fullName", e.target.value)}
                    placeholder="John Smith"
                    className="rounded-none border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    value={applicant.phoneNumber || ""}
                    onChange={(e) => handleApplicantUpdate(index, "phoneNumber", e.target.value)}
                    placeholder="+1 Phone Number"
                    className="rounded-none border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    value={applicant.email || ""}
                    onChange={(e) => handleApplicantUpdate(index, "email", e.target.value)}
                    placeholder="email@example.com"
                    className="rounded-none border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Title or Role *</Label>
                  <Input
                    value={applicant.titleOrRole || applicant.role}
                    onChange={(e) => {
                      handleApplicantUpdate(index, "titleOrRole", e.target.value);
                      handleApplicantUpdate(index, "role", e.target.value);
                    }}
                    placeholder="e.g., 'Organizer,' 'Attorney,' 'Filing Agent'"
                    className="rounded-none border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date of Birth *</Label>
                  <DatePicker
                    value={applicant.dob}
                    onChange={(date) => handleApplicantUpdate(index, "dob", date)}
                    fromYear={1920}
                    toYear={new Date().getFullYear()}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-[#00274E] mb-3">Residential Address</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label>Street Address *</Label>
                    <Input
                      value={street(applicant)}
                      onChange={(e) => handleAddressUpdate(index, 0, e.target.value)}
                      placeholder="123 Main Street, Apt 4B"
                      className="rounded-none border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>City *</Label>
                    <Input
                      value={city(applicant)}
                      onChange={(e) => handleAddressUpdate(index, 1, e.target.value)}
                      placeholder="New York"
                      className="rounded-none border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{country(applicant) === "United States" ? "State" : "State/Province"} *</Label>
                    {country(applicant) === "United States" ? (
                      <Select value={state(applicant)} onValueChange={(val) => handleAddressUpdate(index, 2, val)}>
                        <SelectTrigger className="rounded-none border-gray-300">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : country(applicant) === "Canada" ? (
                      <Select value={state(applicant)} onValueChange={(val) => handleAddressUpdate(index, 2, val)}>
                        <SelectTrigger className="rounded-none border-gray-300">
                          <SelectValue placeholder="Select Province/Territory" />
                        </SelectTrigger>
                        <SelectContent>
                          {CANADIAN_PROVINCES.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={state(applicant)}
                        onChange={(e) => handleAddressUpdate(index, 2, e.target.value)}
                        placeholder="State or Province"
                        className="rounded-none border-gray-300"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>{country(applicant) === "United States" ? "ZIP Code" : "Postal Code"} *</Label>
                    <Input
                      value={zipCode(applicant)}
                      onChange={(e) => handleAddressUpdate(index, 3, e.target.value)}
                      placeholder={country(applicant) === "United States" ? "10001" : "Postal Code"}
                      className="rounded-none border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Country *</Label>
                    <Select value={country(applicant)} onValueChange={(val) => handleAddressUpdate(index, 4, val)}>
                      <SelectTrigger className="rounded-none border-gray-300">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-[#00274E] mb-3">Identification Document</h4>
                <p className="text-sm text-gray-600 mb-4">
                  You do not need to upload a copy of your ID — only enter the document type, number, and issuing jurisdiction.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>What type of ID are you Providing? *</Label>
                    <Select value={applicant.idType} onValueChange={(val) => handleApplicantUpdate(index, "idType", val)}>
                      <SelectTrigger className="rounded-none border-gray-300">
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

                  <div className="space-y-2 col-span-2">
                    <Label>ID Number *</Label>
                    <Input
                      value={applicant.idNumber}
                      onChange={(e) => handleApplicantUpdate(index, "idNumber", e.target.value)}
                      placeholder={
                        applicant.idType === "U.S. Passport" 
                          ? "U.S. Passport Number" 
                          : "Enter ID Number (Max 15)"
                      }
                      maxLength={15}
                      className="rounded-none border-gray-300"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>ID Expiration Date *</Label>
                    <Input
                      type="date"
                      value={applicant.idExpirationDate || ""}
                      onChange={(e) => handleApplicantUpdate(index, "idExpirationDate", e.target.value)}
                      placeholder="MM-DD-YYYY"
                      className="rounded-none border-gray-300"
                    />
                  </div>

                  {/* Issuing Country - Show for Foreign Passport, State Issued Drivers License, and State/local/tribal-issued ID */}
                  {(applicant.idType === "Foreign Passport" || 
                    applicant.idType === "State Issued Drivers License" || 
                    applicant.idType === "State/local/tribal-issued ID") && (
                    <div className="space-y-2 col-span-2">
                      <Label>Issuing Country *</Label>
                      <Select 
                        value={applicant.issuingCountry} 
                        onValueChange={(val) => {
                          handleApplicantUpdate(index, "issuingCountry", val);
                          // Reset issuing state if country changes
                          if (val !== "United States") {
                            handleApplicantUpdate(index, "issuingState", "");
                          }
                        }}
                      >
                        <SelectTrigger className="rounded-none border-gray-300">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Issuing State - Only show when Issuing Country is United States */}
                  {(applicant.idType === "Foreign Passport" || 
                    applicant.idType === "State Issued Drivers License" || 
                    applicant.idType === "State/local/tribal-issued ID") && 
                    applicant.issuingCountry === "United States" && (
                    <div className="space-y-2 col-span-2">
                      <Label>Issuing State *</Label>
                      <Select 
                        value={applicant.issuingState} 
                        onValueChange={(val) => handleApplicantUpdate(index, "issuingState", val)}
                      >
                        <SelectTrigger className="rounded-none border-gray-300">
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Show disabled "Select a country first" message for Issuing State when no country selected */}
                  {(applicant.idType === "Foreign Passport" || 
                    applicant.idType === "State Issued Drivers License" || 
                    applicant.idType === "State/local/tribal-issued ID") && 
                    !applicant.issuingCountry && (
                    <div className="space-y-2 col-span-2">
                      <Label>Issuing State *</Label>
                      <Input
                        disabled
                        placeholder="Select a country first"
                        className="rounded-none border-gray-300 bg-gray-100"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add One More Company Applicant Button */}
      {firmApplicants.length < 2 && (
        <div className="flex justify-center">
          <Button
            onClick={addApplicant}
            variant="outline"
            className="border-2 border-[#00274E] text-[#00274E] hover:bg-[#00274E] hover:text-white px-8"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add One More Company Applicant (Optional)
          </Button>
        </div>
      )}

      {/* Summary Card */}
      <Card className="border-2 border-green-300 rounded-none bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm text-green-800 font-medium mb-2">
                Summary: {firmApplicants.length + 1} Company Applicants for All {clients.length} Clients
              </p>
              <ul className="text-sm text-green-800 space-y-1 ml-4">
                <li>• <strong>Applicant #1:</strong> Tiffany Colon (auto-assigned)</li>
                {firmApplicants.map((applicant, index) => (
                  <li key={applicant.id}>• <strong>Applicant #{index + 2}:</strong> {applicant.fullName || "Pending entry"}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          onClick={onBack}
          variant="outline"
        >
          Back
        </Button>
        
        <Button
          onClick={handleContinue}
          disabled={!isFormValid()}
          className="bg-[#00274E] hover:bg-[#00274E]/90 text-white"
        >
          Continue to Beneficial Owners
        </Button>
      </div>
    </div>
  );
}