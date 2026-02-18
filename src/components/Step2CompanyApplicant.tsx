import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2, AlertTriangle, Search, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { Client, CompanyApplicant, FirmWorker } from "../App";
// DatePicker removed - using native date input instead

interface Step2CompanyApplicantProps {
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

export default function Step2CompanyApplicant({ clients, firmWorkers = [], onComplete, onBack }: Step2CompanyApplicantProps) {
  const [currentClientIndex, setCurrentClientIndex] = useState(0);
  const [updatedClients, setUpdatedClients] = useState<Client[]>(clients);
  const [searchTerm, setSearchTerm] = useState("");
  const [useManualEntry, setUseManualEntry] = useState<boolean>(firmWorkers.length === 0);

  const currentClient = updatedClients[currentClientIndex];

  // Safety check - if no clients, show message
  if (!clients || clients.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 ml-2">
            No clients found. Please go back and upload client data.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={onBack}>Back</Button>
        </div>
      </div>
    );
  }

  // Safety check - if currentClient is undefined
  if (!currentClient) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 ml-2">
            Client data not found. Please go back and try again.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={onBack}>Back</Button>
        </div>
      </div>
    );
  }

  // Initialize company applicant if doesn't exist
  if (!currentClient.companyApplicants || currentClient.companyApplicants.length === 0) {
    const updated = [...updatedClients];
    updated[currentClientIndex] = {
      ...updated[currentClientIndex],
      companyApplicants: [{
        id: `ca-${Date.now()}`,
        fullName: "",
        dob: "",
        address: "||||||",
        idType: "SSN",
        idNumber: "",
        issuingCountry: "United States",
        issuingState: "",
        role: ""
      }]
    };
    setUpdatedClients(updated);
  }

  const currentApplicant = currentClient.companyApplicants?.[0];

  // Handle firm worker selection
  const handleWorkerSelect = (workerId: string) => {
    if (workerId === "manual") {
      setUseManualEntry(true);
      return;
    }

    const worker = firmWorkers.find(w => w.id === workerId);
    if (worker) {
      const updated = [...updatedClients];
      updated[currentClientIndex] = {
        ...updated[currentClientIndex],
        companyApplicants: [{
          id: `ca-${Date.now()}`,
          fullName: worker.fullName,
          dob: "",
          address: `||||||${worker.email}`,
          idType: "SSN",
          idNumber: "",
          issuingCountry: "United States",
          issuingState: "",
          role: worker.title
        }]
      };
      setUpdatedClients(updated);
      setUseManualEntry(false);
    }
  };

  // Handle applicant field updates
  const handleApplicantUpdate = (field: keyof CompanyApplicant, value: string) => {
    const updated = [...updatedClients];
    const applicants = updated[currentClientIndex].companyApplicants || [];
    
    if (applicants.length > 0) {
      applicants[0] = {
        ...applicants[0],
        [field]: value
      };
      updated[currentClientIndex] = {
        ...updated[currentClientIndex],
        companyApplicants: applicants
      };
      setUpdatedClients(updated);
    }
  };

  // Handle address field updates
  const handleAddressUpdate = (index: number, value: string) => {
    const updated = [...updatedClients];
    const applicants = updated[currentClientIndex].companyApplicants || [];
    
    if (applicants.length > 0) {
      const parts = (applicants[0].address || "||||||").split('|');
      parts[index] = value;
      applicants[0] = {
        ...applicants[0],
        address: parts.join('|')
      };
      updated[currentClientIndex] = {
        ...updated[currentClientIndex],
        companyApplicants: applicants
      };
      setUpdatedClients(updated);
    }
  };

  const handleNext = () => {
    if (currentClientIndex < updatedClients.length - 1) {
      setCurrentClientIndex(currentClientIndex + 1);
      setUseManualEntry(firmWorkers.length === 0);
    }
  };

  const handlePrevious = () => {
    if (currentClientIndex > 0) {
      setCurrentClientIndex(currentClientIndex - 1);
      setUseManualEntry(firmWorkers.length === 0);
    }
  };

  const handleClientSelect = (index: string) => {
    setCurrentClientIndex(parseInt(index));
    setUseManualEntry(firmWorkers.length === 0);
  };

  const handleComplete = () => {
    // Validate all clients have company applicant
    const incomplete = updatedClients.filter(c => {
      const applicants = c.companyApplicants || [];
      if (applicants.length === 0) return true;
      const applicant = applicants[0];
      return !applicant.fullName || !applicant.dob || !applicant.role;
    });

    if (incomplete.length > 0) {
      alert(`Please complete company applicant information for all clients. ${incomplete.length} client(s) remaining.`);
      return;
    }

    onComplete(updatedClients);
  };

  // Count completed clients
  const completedCount = updatedClients.filter(c => {
    const applicants = c.companyApplicants || [];
    if (applicants.length === 0) return false;
    const applicant = applicants[0];
    return applicant.fullName && applicant.dob && applicant.role;
  }).length;

  const isCurrentClientComplete = currentApplicant && 
    currentApplicant.fullName && 
    currentApplicant.dob && 
    currentApplicant.role;

  const addressParts = (currentApplicant?.address || "||||||").split('|');

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="border-2 border-[#00274E] rounded-none">
        <CardHeader className="bg-[#00274E] text-white rounded-none pb-6 border-b-4 border-yellow-400">
          <CardTitle>Company Applicant Assignment</CardTitle>
          <CardDescription className="text-gray-300">
            Assign a company applicant to each client. The company applicant must be someone from your law firm.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#00274E]" />
              <span className="text-sm">
                Progress: <strong>{completedCount} of {updatedClients.length}</strong> clients completed
              </span>
            </div>
          </div>

          {/* Search and Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by LLC name or NYDOS ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-none"
              />
            </div>

            {/* Client Dropdown */}
            <Select value={currentClientIndex.toString()} onValueChange={handleClientSelect}>
              <SelectTrigger className="rounded-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {updatedClients.map((client, index) => {
                  const applicants = client.companyApplicants || [];
                  const isComplete = applicants.length > 0 && applicants[0].fullName && applicants[0].dob && applicants[0].role;
                  return (
                    <SelectItem key={index} value={index.toString()}>
                      <div className="flex items-center gap-2">
                        {isComplete ? (
                          <CheckCircle2 className="h-4 w-4 text-[#00274E]" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        )}
                        <span>{client.llcName} ({client.nydosId})</span>
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
                {isCurrentClientComplete && <CheckCircle2 className="h-5 w-5 text-[#00274E]" />}
                {currentClient.llcName}
              </CardTitle>
              <CardDescription>
                NYDOS ID: {currentClient.nydosId} • EIN: {currentClient.ein}
              </CardDescription>
            </div>
            <div className="text-sm text-gray-600">
              Client {currentClientIndex + 1} of {updatedClients.length}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Info Alert */}
          <Alert className="border-blue-200 bg-blue-50 rounded-none">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <p className="mb-2"><strong>Who is a Company Applicant?</strong></p>
              <p className="text-sm">
                A company applicant is the person who files the LLC's formation documents or submits this NYLTA filing on behalf of the company. This must be someone from your law firm - not the client.
              </p>
            </AlertDescription>
          </Alert>

          {/* Firm Worker Selection or Manual Entry */}
          {firmWorkers.length > 0 && (
            <div>
              <Label>Select Company Applicant from Registered Firm Workers</Label>
              <Select 
                value={useManualEntry ? "manual" : ""} 
                onValueChange={handleWorkerSelect}
              >
                <SelectTrigger className="rounded-none border-2 border-yellow-400">
                  <SelectValue placeholder="Select a firm worker or enter manually..." />
                </SelectTrigger>
                <SelectContent>
                  {firmWorkers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id}>
                      {worker.fullName} - {worker.title}
                    </SelectItem>
                  ))}
                  <SelectItem value="manual">Enter New Person Manually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Manual Entry Form */}
          <div className="space-y-4">
            <h3 className="text-lg">Company Applicant Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Legal Name *</Label>
                <Input
                  placeholder="Full Legal Name"
                  value={currentApplicant?.fullName || ""}
                  onChange={(e) => handleApplicantUpdate("fullName", e.target.value)}
                  disabled={!useManualEntry && firmWorkers.length > 0}
                  className="rounded-none"
                />
              </div>

              <div>
                <Label>Date of Birth *</Label>
                <Input
                  type="date"
                  value={currentApplicant?.dob || ""}
                  onChange={(e) => handleApplicantUpdate("dob", e.target.value)}
                  className="rounded-none"
                />
              </div>

              <div>
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={addressParts[6] || ""}
                  onChange={(e) => handleAddressUpdate(6, e.target.value)}
                  disabled={!useManualEntry && firmWorkers.length > 0}
                  className="rounded-none"
                />
              </div>

              <div>
                <Label>Phone Number *</Label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 555-5555"
                  value={addressParts[5] || ""}
                  onChange={(e) => handleAddressUpdate(5, e.target.value)}
                  className="rounded-none"
                />
              </div>

              <div className="md:col-span-2">
                <Label>Title or Role *</Label>
                <Input
                  placeholder='e.g., "Attorney", "Filing Agent", "Organizer"'
                  value={currentApplicant?.role || ""}
                  onChange={(e) => handleApplicantUpdate("role", e.target.value)}
                  disabled={!useManualEntry && firmWorkers.length > 0}
                  className="rounded-none"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="pt-4 border-t">
              <Alert className="mb-4 border-red-200 bg-red-50 rounded-none">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <p className="mb-1"><strong>Use personal address — not the LLC's address.</strong></p>
                  <p className="text-sm">
                    Enter the company applicant's personal work or home address, not the LLC's business address.
                  </p>
                </AlertDescription>
              </Alert>

              <h4 className="text-lg mb-3">Current Address</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Street Address *</Label>
                  <Input
                    placeholder="Street Address"
                    value={addressParts[0] || ""}
                    onChange={(e) => handleAddressUpdate(0, e.target.value)}
                    className="rounded-none"
                  />
                </div>

                <div>
                  <Label>City *</Label>
                  <Input
                    placeholder="City"
                    value={addressParts[1] || ""}
                    onChange={(e) => handleAddressUpdate(1, e.target.value)}
                    className="rounded-none"
                  />
                </div>

                <div>
                  <Label>State *</Label>
                  <Select 
                    value={addressParts[2] || ""} 
                    onValueChange={(value) => handleAddressUpdate(2, value)}
                  >
                    <SelectTrigger className="rounded-none">
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

                <div>
                  <Label>ZIP Code *</Label>
                  <Input
                    placeholder="ZIP Code"
                    value={addressParts[3] || ""}
                    onChange={(e) => handleAddressUpdate(3, e.target.value)}
                    className="rounded-none"
                  />
                </div>

                <div>
                  <Label>Country *</Label>
                  <Input
                    placeholder="Country"
                    value={addressParts[4] || "United States"}
                    onChange={(e) => handleAddressUpdate(4, e.target.value)}
                    className="rounded-none"
                  />
                </div>
              </div>
            </div>

            {/* ID Verification Section */}
            <div className="pt-4 border-t">
              <h4 className="text-lg mb-3">Identity Verification</h4>
              <p className="text-sm text-gray-600 mb-4">Identity verification for the Company Applicant.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>ID Type *</Label>
                  <Select
                    value={currentApplicant?.idType || "SSN"}
                    onValueChange={(value) => handleApplicantUpdate("idType", value)}
                  >
                    <SelectTrigger className="rounded-none border-2 border-yellow-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SSN">Social Security Number (SSN)</SelectItem>
                      <SelectItem value="State Issued Drivers License">State Issued Driver's License</SelectItem>
                      <SelectItem value="State/local/tribal-issued ID">State/Local/Tribal-issued ID</SelectItem>
                      <SelectItem value="U.S. Passport">U.S. Passport</SelectItem>
                      <SelectItem value="Foreign Passport">Foreign Passport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label>ID Number *</Label>
                  <Input
                    placeholder="Enter ID Number"
                    value={currentApplicant?.idNumber || ""}
                    onChange={(e) => handleApplicantUpdate("idNumber", e.target.value)}
                    className="rounded-none"
                  />
                </div>

                {(currentApplicant?.idType === "State Issued Drivers License" || 
                  currentApplicant?.idType === "State/local/tribal-issued ID") && (
                  <div>
                    <Label>Issuing State *</Label>
                    <Select 
                      value={currentApplicant?.issuingState || ""} 
                      onValueChange={(value) => handleApplicantUpdate("issuingState", value)}
                    >
                      <SelectTrigger className="rounded-none">
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
                )}

                {(currentApplicant?.idType === "Foreign Passport" || currentApplicant?.idType === "U.S. Passport") && (
                  <div>
                    <Label>Issuing Country *</Label>
                    <Input
                      placeholder="Issuing Country"
                      value={currentApplicant?.issuingCountry || "United States"}
                      onChange={(e) => handleApplicantUpdate("issuingCountry", e.target.value)}
                      className="rounded-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentClientIndex === 0}
              className="rounded-none"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous Client
            </Button>

            {currentClientIndex < updatedClients.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!isCurrentClientComplete}
                className="rounded-none"
              >
                Next Client
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={completedCount !== updatedClients.length}
                className="bg-[#00274E] hover:bg-[#00274E]/90 rounded-none"
              >
                Continue to Exemption Check
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Client Upload
        </Button>
        <Button
          onClick={handleComplete}
          disabled={completedCount !== updatedClients.length}
          className="bg-[#00274E] hover:bg-[#00274E]/90"
        >
          Continue to Exemption Check ({completedCount}/{updatedClients.length} Complete)
        </Button>
      </div>
    </div>
  );
}