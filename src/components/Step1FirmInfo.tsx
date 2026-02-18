import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { FirmInfo, FirmWorker } from "../App";

interface Step1FirmInfoProps {
  onComplete: (data: FirmInfo) => void;
  initialData: FirmInfo | null;
}

export default function Step1FirmInfo({ onComplete, initialData }: Step1FirmInfoProps) {
  const [formData, setFormData] = useState({
    firmName: "",
    contactPerson: "",
    email: "",
    phone: "",
    ein: "",
    professionalType: "CPA",
    authorized: false,
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    agreeToTerms: true, // Auto-agree since we removed the terms section
    authorizeTexts: false,
    agreeToMarketing: false,
    authorizedUsers: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addWorker = () => {
    if ((formData.authorizedUsers?.length || 0) >= 3) {
      alert("You can register up to 3 workers");
      return;
    }
    
    const newWorker: FirmWorker = {
      id: `worker-${Date.now()}`,
      fullName: "",
      email: "",
      title: ""
    };
    
    setFormData({
      ...formData,
      authorizedUsers: [...(formData.authorizedUsers || []), newWorker]
    });
  };

  const removeWorker = (workerId: string) => {
    setFormData({
      ...formData,
      authorizedUsers: formData.authorizedUsers?.filter(w => w.id !== workerId) || []
    });
  };

  const updateWorker = (workerId: string, field: keyof FirmWorker, value: string) => {
    setFormData({
      ...formData,
      authorizedUsers: formData.authorizedUsers?.map(w => 
        w.id === workerId ? { ...w, [field]: value } : w
      ) || []
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.firmName.trim()) newErrors.firmName = "Firm name is required";
    if (!formData.contactPerson.trim()) newErrors.contactPerson = "Contact person is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.professionalType) newErrors.professionalType = "Professional type is required";
    if (!formData.address.trim()) newErrors.address = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    
    // Only require state and zipCode if country is United States
    if (formData.country === "United States") {
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    }
    
    if (!formData.country) newErrors.country = "Country is required";
    
    // Only require authorization checkbox for specific professional types
    if (["Attorney", "CPA", "Compliance"].includes(formData.professionalType) && !formData.authorized) {
      newErrors.authorized = "You must confirm authorization";
    }
    
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the Terms of Service and Privacy Policy";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onComplete(formData);
  };

  return (
    <Card className="max-w-3xl mx-auto rounded-none border-2 border-[#00274E]">
      <CardHeader className="bg-[#00274E] text-white rounded-none pb-6 border-b-4 border-yellow-400">
        <CardTitle>Step 1 – Bulk Client Account Creation</CardTitle>
        <CardDescription className="text-gray-300">
          Identify your professional firm and establish authorization to file on behalf of multiple clients.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="firmName">Firm / Office Name *</Label>
              <Input
                id="firmName"
                placeholder="Smith & Associates CPA"
                value={formData.firmName}
                onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                className={errors.firmName ? "border-red-500" : "border-2 border-yellow-400"}
              />
              <p className="text-sm text-gray-600 mt-1">
                Enter the legal name of your professional firm or office as registered with the state.
              </p>
              {errors.firmName && <p className="text-sm text-red-500 mt-1">{errors.firmName}</p>}
            </div>

            <div>
              <Label htmlFor="contactPerson">Contact Person (Authorized Filer) *</Label>
              <Input
                id="contactPerson"
                placeholder="John Smith"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className={errors.contactPerson ? "border-red-500" : "border-2 border-yellow-400"}
              />
              <p className="text-sm text-gray-600 mt-1">
                Full name of the individual authorized to submit bulk filings on behalf of the firm.
              </p>
              {errors.contactPerson && <p className="text-sm text-red-500 mt-1">{errors.contactPerson}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@smithcpa.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? "border-red-500" : "border-2 border-yellow-400"}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Primary email for filing confirmations and account notifications.
                </p>
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={errors.phone ? "border-red-500" : "border-2 border-yellow-400"}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Contact number for account verification and filing support.
                </p>
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ein">EIN (Optional)</Label>
                <Input
                  id="ein"
                  placeholder="12-3456789"
                  value={formData.ein}
                  onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Your firm's 9-digit Employer Identification Number issued by the IRS.
                </p>
              </div>

              <div>
                <Label htmlFor="professionalType">Professional Type *</Label>
                <Select
                  value={formData.professionalType}
                  onValueChange={(value) => setFormData({ ...formData, professionalType: value })}
                >
                  <SelectTrigger className={errors.professionalType ? "border-red-500" : "border-2 border-yellow-400"}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CPA">CPA (Certified Public Accountant)</SelectItem>
                    <SelectItem value="Attorney">Attorney / Law Firm</SelectItem>
                    <SelectItem value="Compliance">Compliance Professional</SelectItem>
                    <SelectItem value="Consultant">Business Consultant</SelectItem>
                    <SelectItem value="Registered Agent">Registered Agent</SelectItem>
                    <SelectItem value="Other">Other Professional Service</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600 mt-1">
                  Select the category that best describes your professional services.
                </p>
                {errors.professionalType && <p className="text-sm text-red-500 mt-1">{errors.professionalType}</p>}
              </div>
            </div>

            {/* Firm Address Section */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-gray-900 mb-4">Firm Address</h4>
              
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street, Suite 100"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={errors.address ? "border-red-500" : "border-2 border-yellow-400"}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Physical street address of your firm's main office.
                </p>
                {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={errors.city ? "border-red-500" : "border-2 border-yellow-400"}
                  />
                  {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="state">State {formData.country === "United States" && "*"}</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => setFormData({ ...formData, state: value })}
                    disabled={formData.country !== "United States"}
                  >
                    <SelectTrigger className={errors.state ? "border-red-500" : "border-2 border-yellow-400"}>
                      <SelectValue placeholder={formData.country === "United States" ? "Select state" : "N/A"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="AK">Alaska</SelectItem>
                      <SelectItem value="AZ">Arizona</SelectItem>
                      <SelectItem value="AR">Arkansas</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="CO">Colorado</SelectItem>
                      <SelectItem value="CT">Connecticut</SelectItem>
                      <SelectItem value="DE">Delaware</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="GA">Georgia</SelectItem>
                      <SelectItem value="HI">Hawaii</SelectItem>
                      <SelectItem value="ID">Idaho</SelectItem>
                      <SelectItem value="IL">Illinois</SelectItem>
                      <SelectItem value="IN">Indiana</SelectItem>
                      <SelectItem value="IA">Iowa</SelectItem>
                      <SelectItem value="KS">Kansas</SelectItem>
                      <SelectItem value="KY">Kentucky</SelectItem>
                      <SelectItem value="LA">Louisiana</SelectItem>
                      <SelectItem value="ME">Maine</SelectItem>
                      <SelectItem value="MD">Maryland</SelectItem>
                      <SelectItem value="MA">Massachusetts</SelectItem>
                      <SelectItem value="MI">Michigan</SelectItem>
                      <SelectItem value="MN">Minnesota</SelectItem>
                      <SelectItem value="MS">Mississippi</SelectItem>
                      <SelectItem value="MO">Missouri</SelectItem>
                      <SelectItem value="MT">Montana</SelectItem>
                      <SelectItem value="NE">Nebraska</SelectItem>
                      <SelectItem value="NV">Nevada</SelectItem>
                      <SelectItem value="NH">New Hampshire</SelectItem>
                      <SelectItem value="NJ">New Jersey</SelectItem>
                      <SelectItem value="NM">New Mexico</SelectItem>
                      <SelectItem value="NC">North Carolina</SelectItem>
                      <SelectItem value="ND">North Dakota</SelectItem>
                      <SelectItem value="OH">Ohio</SelectItem>
                      <SelectItem value="OK">Oklahoma</SelectItem>
                      <SelectItem value="OR">Oregon</SelectItem>
                      <SelectItem value="PA">Pennsylvania</SelectItem>
                      <SelectItem value="RI">Rhode Island</SelectItem>
                      <SelectItem value="SC">South Carolina</SelectItem>
                      <SelectItem value="SD">South Dakota</SelectItem>
                      <SelectItem value="TN">Tennessee</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="UT">Utah</SelectItem>
                      <SelectItem value="VT">Vermont</SelectItem>
                      <SelectItem value="VA">Virginia</SelectItem>
                      <SelectItem value="WA">Washington</SelectItem>
                      <SelectItem value="WV">West Virginia</SelectItem>
                      <SelectItem value="WI">Wisconsin</SelectItem>
                      <SelectItem value="WY">Wyoming</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP Code {formData.country === "United States" && "*"}</Label>
                  <Input
                    id="zipCode"
                    placeholder={formData.country === "United States" ? "10001" : "N/A"}
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    disabled={formData.country !== "United States"}
                    className={errors.zipCode ? "border-red-500" : "border-2 border-yellow-400"}
                  />
                  {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => {
                    setFormData({ ...formData, country: value, state: "", zipCode: "" });
                  }}
                >
                  <SelectTrigger className={errors.country ? "border-red-500" : "border-2 border-yellow-400"}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Mexico">Mexico</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Italy">Italy</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="Netherlands">Netherlands</SelectItem>
                    <SelectItem value="Belgium">Belgium</SelectItem>
                    <SelectItem value="Switzerland">Switzerland</SelectItem>
                    <SelectItem value="Austria">Austria</SelectItem>
                    <SelectItem value="Sweden">Sweden</SelectItem>
                    <SelectItem value="Norway">Norway</SelectItem>
                    <SelectItem value="Denmark">Denmark</SelectItem>
                    <SelectItem value="Finland">Finland</SelectItem>
                    <SelectItem value="Ireland">Ireland</SelectItem>
                    <SelectItem value="Portugal">Portugal</SelectItem>
                    <SelectItem value="Greece">Greece</SelectItem>
                    <SelectItem value="Poland">Poland</SelectItem>
                    <SelectItem value="Czech Republic">Czech Republic</SelectItem>
                    <SelectItem value="Hungary">Hungary</SelectItem>
                    <SelectItem value="Romania">Romania</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="New Zealand">New Zealand</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="China">China</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="South Korea">South Korea</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="Hong Kong">Hong Kong</SelectItem>
                    <SelectItem value="Israel">Israel</SelectItem>
                    <SelectItem value="Brazil">Brazil</SelectItem>
                    <SelectItem value="Argentina">Argentina</SelectItem>
                    <SelectItem value="Chile">Chile</SelectItem>
                    <SelectItem value="Colombia">Colombia</SelectItem>
                    <SelectItem value="South Africa">South Africa</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600 mt-1">
                  Country where your firm is located.
                </p>
                {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
              </div>
            </div>
          </div>

          {/* Authorized Users Section */}
          <div className="space-y-4">
            <div className="border-t-2 border-gray-300 pt-6">
              <h3 className="text-lg mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                Authorized Users (Optional)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Register up to 3 authorized users from your firm who can be selected as Company Applicants during bulk filing. 
                You can also enter a new person's details during filing if needed.
              </p>

              {formData.authorizedUsers && formData.authorizedUsers.length > 0 && (
                <div className="space-y-4 mb-4">
                  {formData.authorizedUsers.map((worker, index) => (
                    <Card key={worker.id} className="border-2 border-gray-300">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="text-base">Authorized User {index + 1}</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeWorker(worker.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50 rounded-none"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`worker-${worker.id}-name`}>Full Name *</Label>
                            <Input
                              id={`worker-${worker.id}-name`}
                              placeholder="John Smith"
                              value={worker.fullName}
                              onChange={(e) => updateWorker(worker.id, 'fullName', e.target.value)}
                              className="border-2 border-gray-300"
                            />
                          </div>

                          <div>
                            <Label htmlFor={`worker-${worker.id}-email`}>Email *</Label>
                            <Input
                              id={`worker-${worker.id}-email`}
                              type="email"
                              placeholder="john.smith@firm.com"
                              value={worker.email}
                              onChange={(e) => updateWorker(worker.id, 'email', e.target.value)}
                              className="border-2 border-gray-300"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <Label htmlFor={`worker-${worker.id}-title`}>Job Title *</Label>
                            <Input
                              id={`worker-${worker.id}-title`}
                              placeholder="e.g., Attorney, CPA, Compliance Officer"
                              value={worker.title}
                              onChange={(e) => updateWorker(worker.id, 'title', e.target.value)}
                              className="border-2 border-gray-300"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {(!formData.authorizedUsers || formData.authorizedUsers.length < 3) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addWorker}
                  className="border-2 border-[#00274E] rounded-none"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add User ({formData.authorizedUsers?.length || 0}/3)
                </Button>
              )}
            </div>
          </div>

          {/* Authorization checkbox - only for Attorney, CPA, or Compliance Professional */}
          {["Attorney", "CPA", "Compliance"].includes(formData.professionalType) && (
            <div className={`border rounded-lg p-4 ${errors.authorized ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"}`}>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="authorized"
                  checked={formData.authorized}
                  onCheckedChange={(checked) => setFormData({ ...formData, authorized: checked as boolean })}
                  className="mt-0.5 flex-shrink-0"
                />
                <label htmlFor="authorized" className="text-sm cursor-pointer leading-relaxed flex-1">
                  I am authorized to file NYLTA reports on behalf of my clients.
                </label>
              </div>
              {errors.authorized && <p className="text-sm text-red-500 mt-2 ml-7">{errors.authorized}</p>}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t-2 border-gray-200">
            <Button
              type="submit"
              className="bg-[#00274E] hover:bg-[#003366] text-white px-8 py-6 rounded-none"
            >
              Next: Client Upload
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}