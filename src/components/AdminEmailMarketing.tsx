import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import {
  Mail,
  Send,
  Filter,
  Search,
  Download,
  Eye,
  Plus,
  Edit,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import EmailSendDialog from "./EmailSendDialog";

interface Contact {
  id: string;
  firmName: string;
  email: string;
  phone: string;
  professionalType: string;
  emailConsent: boolean;
  submissionStatus: "Paid" | "Abandoned" | "None";
  filingType: "Bulk" | "Single" | "None";
  daysInactive?: number;
  lastActivity: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: "Abandoned Cart - Bulk" | "Abandoned Cart - Single" | "Promotional" | "Update" | "Custom";
  body: string;
  createdDate: string;
}

interface EmailCampaign {
  id: string;
  subject: string;
  recipientCount: number;
  sentDate: string;
  status: "Success" | "Failed";
  recipients: string[];
}

// Mock contacts data
const mockContacts: Contact[] = [
  {
    id: "c1",
    firmName: "Manhattan Compliance Professionals",
    email: "contact@manhattancompliance.com",
    phone: "(212) 555-0101",
    professionalType: "CPA",
    emailConsent: true,
    submissionStatus: "Abandoned",
    filingType: "Bulk",
    daysInactive: 37,
    lastActivity: "2024-10-05T10:30:00"
  },
  {
    id: "c2",
    firmName: "Queens Business Services",
    email: "info@queensbiz.com",
    phone: "(718) 555-0202",
    professionalType: "Accountant",
    emailConsent: true,
    submissionStatus: "Abandoned",
    filingType: "Bulk",
    daysInactive: 41,
    lastActivity: "2024-10-01T08:45:00"
  },
  {
    id: "c3",
    firmName: "Smith & Associates CPA",
    email: "admin@smithcpa.com",
    phone: "(646) 555-0303",
    professionalType: "CPA",
    emailConsent: true,
    submissionStatus: "Paid",
    filingType: "Bulk",
    lastActivity: "2024-11-12T14:35:00"
  },
  {
    id: "c4",
    firmName: "Johnson Legal Group",
    email: "legal@johnsonlaw.com",
    phone: "(212) 555-0404",
    professionalType: "Attorney",
    emailConsent: true,
    submissionStatus: "Paid",
    filingType: "Bulk",
    lastActivity: "2024-11-11T09:45:00"
  },
  {
    id: "c5",
    firmName: "Bronx Tax Solutions",
    email: "contact@bronxtax.com",
    phone: "(718) 555-0505",
    professionalType: "Compliance Professional",
    emailConsent: false,
    submissionStatus: "None",
    filingType: "None",
    lastActivity: "2024-11-10T15:00:00"
  },
  {
    id: "c6",
    firmName: "Brooklyn Legal Services",
    email: "info@brooklynlegal.com",
    phone: "(347) 555-0606",
    professionalType: "Attorney",
    emailConsent: true,
    submissionStatus: "Abandoned",
    filingType: "Single",
    daysInactive: 33,
    lastActivity: "2024-10-09T12:00:00"
  }
];

const defaultTemplates: EmailTemplate[] = [
  {
    id: "t1",
    name: "Abandoned Bulk Filing - Reminder",
    subject: "Complete Your NYLTA Bulk Filing Submission",
    type: "Abandoned Cart - Bulk",
    body: `Dear [FIRM_NAME],

We noticed you started a bulk filing submission for [CLIENT_COUNT] clients but didn't complete the process.

Your partial submission includes valuable data that we'd hate to see go to waste. Complete your filing today and take advantage of:

• Volume-based pricing with up to 15% discount
• Streamlined CSV upload and validation
• Instant confirmation and PDF receipts

Your session data is saved and ready to continue. Simply log in to pick up where you left off.

[CONTINUE FILING BUTTON]

Questions? Our compliance team is here to help at support@nylta.com or (555) 123-4567.

Best regards,
The NYLTA.com Team`,
    createdDate: "2024-11-01T10:00:00"
  },
  {
    id: "t2",
    name: "Abandoned Single Filing - Follow Up",
    subject: "Don't Forget to Complete Your NYLTA Filing",
    type: "Abandoned Cart - Single",
    body: `Hello [FIRM_NAME],

You started an NYLTA filing for [LLC_NAME] but haven't completed the submission yet.

The New York LLC Transparency Act deadline is approaching, and we want to help you stay compliant. Finish your filing today in just a few minutes.

[COMPLETE FILING BUTTON]

Need assistance? Contact our support team at support@nylta.com.

Thank you,
NYLTA.com Support Team`,
    createdDate: "2024-11-01T10:00:00"
  },
  {
    id: "t3",
    name: "Special Offer - Existing Clients",
    subject: "Exclusive 15% Discount on Your Next Bulk Filing",
    type: "Promotional",
    body: `Dear Valued Partner,

Thank you for trusting NYLTA.com with your bulk filing needs!

As a token of appreciation for your continued business, we're offering you an exclusive 15% discount on your next bulk filing submission (valid for submissions of 10+ clients).

Use promo code: LOYAL15 at checkout

This offer expires [EXPIRATION_DATE].

[START NEW FILING BUTTON]

We appreciate your partnership and look forward to serving you again.

Best regards,
The NYLTA.com Team`,
    createdDate: "2024-11-05T14:00:00"
  },
  {
    id: "t4",
    name: "Important NYLTA Update",
    subject: "Important Update: New NYLTA Filing Requirements",
    type: "Update",
    body: `Dear [FIRM_NAME],

We wanted to inform you of important updates to the New York LLC Transparency Act filing requirements that may affect your clients.

Key Changes:
• New exemption categories have been added
• Updated beneficial ownership threshold criteria
• Enhanced verification requirements for certain entity types

Our bulk filing portal has been updated to reflect these changes. No action is needed on your part - all validations are automatically applied.

[LEARN MORE BUTTON]

If you have questions about how these changes affect your existing or upcoming filings, please don't hesitate to contact us.

Best regards,
NYLTA.com Compliance Team`,
    createdDate: "2024-11-08T09:00:00"
  }
];

export default function AdminEmailMarketing() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterConsent, setFilterConsent] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [customSubject, setCustomSubject] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates);
  const [emailHistory, setEmailHistory] = useState<EmailCampaign[]>([]);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewingTemplate, setPreviewingTemplate] = useState<EmailTemplate | null>(null);

  // Filter contacts
  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch = 
      contact.firmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || contact.submissionStatus === filterStatus;
    const matchesConsent = 
      filterConsent === "all" || 
      (filterConsent === "consented" && contact.emailConsent) ||
      (filterConsent === "not-consented" && !contact.emailConsent);
    
    return matchesSearch && matchesStatus && matchesConsent;
  });

  // Calculate stats
  const totalContacts = mockContacts.length;
  const consentedContacts = mockContacts.filter(c => c.emailConsent).length;
  const abandonedBulk = mockContacts.filter(c => c.submissionStatus === "Abandoned" && c.filingType === "Bulk" && c.emailConsent && c.daysInactive && c.daysInactive > 31).length;
  const abandonedSingle = mockContacts.filter(c => c.submissionStatus === "Abandoned" && c.filingType === "Single" && c.emailConsent).length;
  const paidClients = mockContacts.filter(c => c.submissionStatus === "Paid" && c.emailConsent).length;

  const handleSelectAll = () => {
    const validContacts = filteredContacts.filter(c => c.emailConsent);
    if (selectedContacts.length === validContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(validContacts.map(c => c.id));
    }
  };

  const handleSelectContact = (id: string) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(cid => cid !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  const handleQuickFilter = (type: string) => {
    setSelectedContacts([]);
    switch (type) {
      case "abandoned-bulk-31":
        setFilterStatus("Abandoned");
        setFilterConsent("consented");
        // Auto-select these contacts
        const bulkContacts = mockContacts.filter(c => 
          c.submissionStatus === "Abandoned" && 
          c.filingType === "Bulk" && 
          c.emailConsent && 
          c.daysInactive && 
          c.daysInactive > 31
        ).map(c => c.id);
        setSelectedContacts(bulkContacts);
        break;
      case "abandoned-single":
        setFilterStatus("Abandoned");
        setFilterConsent("consented");
        const singleContacts = mockContacts.filter(c => 
          c.submissionStatus === "Abandoned" && 
          c.filingType === "Single" && 
          c.emailConsent
        ).map(c => c.id);
        setSelectedContacts(singleContacts);
        break;
      case "paid-clients":
        setFilterStatus("Paid");
        setFilterConsent("consented");
        break;
      default:
        setFilterStatus("all");
        setFilterConsent("all");
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template.id);
      setCustomSubject(template.subject);
      setCustomBody(template.body);
    }
  };

  const handleCreateTemplate = () => {
    setEditingTemplate({
      id: `t${templates.length + 1}`,
      name: "",
      subject: "",
      type: "Custom",
      body: "",
      createdDate: new Date().toISOString()
    });
    setShowTemplateEditor(true);
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      if (templates.find(t => t.id === editingTemplate.id)) {
        setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
      } else {
        setTemplates([...templates, editingTemplate]);
      }
    }
    setShowTemplateEditor(false);
    setEditingTemplate(null);
  };

  const getCurrentEmailContent = () => {
    return {
      subject: customSubject,
      body: customBody
    };
  };

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card className="border-2 border-[#00274E] bg-white">
        <CardContent className="py-6">
          <div className="mb-6">
            <h2 className="text-3xl text-[#00274E] mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              Email Marketing Campaign
            </h2>
            <p className="text-base text-gray-600">
              Send professional emails to your contacts in 3 simple steps
            </p>
          </div>

          {/* Step Progress Indicator */}
          <div className="flex items-center justify-between max-w-3xl">
            <div className={`flex items-center gap-3 ${currentStep >= 1 ? 'text-[#00274E]' : 'text-gray-400'}`}>
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl ${currentStep >= 1 ? 'bg-[#00274E] text-white border-[#00274E]' : 'border-gray-300'}`} style={{ fontFamily: 'Libre Baskerville, serif' }}>
                {currentStep > 1 ? '✓' : '1'}
              </div>
              <div>
                <p className="text-base">Step 1</p>
                <p className="text-sm text-gray-600">Select Recipients</p>
              </div>
            </div>

            <ChevronRight className="text-gray-400 h-6 w-6" />

            <div className={`flex items-center gap-3 ${currentStep >= 2 ? 'text-[#00274E]' : 'text-gray-400'}`}>
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl ${currentStep >= 2 ? 'bg-[#00274E] text-white border-[#00274E]' : 'border-gray-300'}`} style={{ fontFamily: 'Libre Baskerville, serif' }}>
                {currentStep > 2 ? '✓' : '2'}
              </div>
              <div>
                <p className="text-base">Step 2</p>
                <p className="text-sm text-gray-600">Choose Template</p>
              </div>
            </div>

            <ChevronRight className="text-gray-400 h-6 w-6" />

            <div className={`flex items-center gap-3 ${currentStep >= 3 ? 'text-[#00274E]' : 'text-gray-400'}`}>
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl ${currentStep >= 3 ? 'bg-[#00274E] text-white border-[#00274E]' : 'border-gray-300'}`} style={{ fontFamily: 'Libre Baskerville, serif' }}>
                3
              </div>
              <div>
                <p className="text-base">Step 3</p>
                <p className="text-sm text-gray-600">Review & Send</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-gray-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm">Total Contacts</CardDescription>
            <CardTitle className="text-3xl mt-1" style={{ fontFamily: 'Libre Baskerville, serif' }}>{totalContacts}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-700">{consentedContacts} with email consent</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-gray-300" onClick={() => { handleQuickFilter("abandoned-bulk-31"); setCurrentStep(1); }}>
          <CardHeader className="pb-3 bg-gray-50">
            <CardDescription className="text-sm">Abandoned Bulk (31+ days)</CardDescription>
            <CardTitle className="text-3xl mt-1 text-gray-800" style={{ fontFamily: 'Libre Baskerville, serif' }}>{abandonedBulk}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-700">Click to select these</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-gray-300" onClick={() => { handleQuickFilter("abandoned-single"); setCurrentStep(1); }}>
          <CardHeader className="pb-3 bg-gray-50">
            <CardDescription className="text-sm">Abandoned Single</CardDescription>
            <CardTitle className="text-3xl mt-1 text-gray-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>{abandonedSingle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-700">Click to select these</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-[#00274E]" onClick={() => { handleQuickFilter("paid-clients"); setCurrentStep(1); }}>
          <CardHeader className="pb-3 bg-gray-50">
            <CardDescription className="text-sm">Paid Clients</CardDescription>
            <CardTitle className="text-3xl mt-1 text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>{paidClients}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-700">Current customers</div>
          </CardContent>
        </Card>
      </div>

      {/* STEP 1: Select Recipients */}
      {currentStep === 1 && (
        <Card className="border-2 border-[#00274E]">
          <CardHeader className="bg-gray-50 border-b-2 border-gray-200">
            <CardTitle className="text-2xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              Step 1: Select Recipients
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Choose which contacts should receive this email. Only contacts who have consented to email marketing can be selected.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Quick Filters */}
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
              <p className="text-base mb-3">
                <strong>Quick Select Groups:</strong> Click a button below to automatically filter and select a specific group
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button 
                  variant="outline" 
                  className="border-2 border-gray-700 rounded-full px-6" 
                  onClick={() => handleQuickFilter("abandoned-bulk-31")}
                >
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Abandoned Bulk (31+ days)
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-gray-700 rounded-full px-6"
                  onClick={() => handleQuickFilter("abandoned-single")}
                >
                  <Clock className="mr-2 h-5 w-5" />
                  Abandoned Single Filings
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-[#00274E] rounded-full px-6"
                  onClick={() => handleQuickFilter("paid-clients")}
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Paid Clients Only
                </Button>
              </div>
            </div>

            {/* Manual Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search" className="text-base mb-2 block">Search by Name or Email</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search firm name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status" className="text-base mb-2 block">Filter by Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Paid">Paid Submissions</SelectItem>
                    <SelectItem value="Abandoned">Abandoned Submissions</SelectItem>
                    <SelectItem value="None">No Submission Yet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="consent" className="text-base mb-2 block">Filter by Consent</Label>
                <Select value={filterConsent} onValueChange={setFilterConsent}>
                  <SelectTrigger id="consent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contacts</SelectItem>
                    <SelectItem value="consented">✓ Has Email Consent</SelectItem>
                    <SelectItem value="not-consented">✗ No Email Consent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contacts Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg">
                    <strong>{filteredContacts.length}</strong> contacts shown | <strong className="text-[#00274E]">{selectedContacts.length}</strong> selected for email
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export List
                </Button>
              </div>

              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedContacts.length === filteredContacts.filter(c => c.emailConsent).length && filteredContacts.filter(c => c.emailConsent).length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="text-base">Firm Name</TableHead>
                      <TableHead className="text-base">Email Address</TableHead>
                      <TableHead className="text-base">Type</TableHead>
                      <TableHead className="text-base">Status</TableHead>
                      <TableHead className="text-base">Email Consent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow 
                        key={contact.id}
                        className={
                          !contact.emailConsent ? "bg-gray-100 opacity-60" :
                          contact.submissionStatus === "Abandoned" && contact.daysInactive && contact.daysInactive > 31 
                            ? "bg-red-50" 
                            : ""
                        }
                      >
                        <TableCell>
                          <Checkbox 
                            checked={selectedContacts.includes(contact.id)}
                            onCheckedChange={() => handleSelectContact(contact.id)}
                            disabled={!contact.emailConsent}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-base">{contact.firmName}</p>
                            <p className="text-xs text-gray-500">{contact.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{contact.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-sm">{contact.professionalType}</Badge>
                        </TableCell>
                        <TableCell>
                          {contact.submissionStatus === "Paid" && <Badge className="bg-[#00274E] text-white border-[#00274E]">✓ Paid</Badge>}
                          {contact.submissionStatus === "Abandoned" && (
                            <div>
                              <Badge className="bg-gray-700 text-white border-gray-700">Abandoned</Badge>
                              {contact.daysInactive && contact.daysInactive > 31 && (
                                <p className="text-xs text-gray-700 mt-1">{contact.daysInactive} days inactive</p>
                              )}
                            </div>
                          )}
                          {contact.submissionStatus === "None" && <Badge variant="outline">No Submission</Badge>}
                        </TableCell>
                        <TableCell>
                          {contact.emailConsent ? (
                            <Badge className="bg-[#00274E] text-white border-[#00274E]">✓ Yes</Badge>
                          ) : (
                            <Badge className="bg-gray-500 text-white border-gray-500">No</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t-2 border-gray-200">
              <p className="text-base text-gray-600">
                {selectedContacts.length === 0 ? "Please select at least one contact to continue" : `${selectedContacts.length} contact${selectedContacts.length !== 1 ? 's' : ''} ready to receive email`}
              </p>
              <Button 
                size="lg"
                className="bg-[#00274E] hover:bg-[#003d73] px-8 py-6"
                disabled={selectedContacts.length === 0}
                onClick={() => setCurrentStep(2)}
              >
                Continue to Step 2
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: Choose Template */}
      {currentStep === 2 && (
        <Card className="border-2 border-[#00274E]">
          <CardHeader className="bg-gray-50 border-b-2 border-gray-200">
            <CardTitle className="text-2xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              Step 2: Choose Email Template
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Select a pre-made template or create a custom email. You can edit the template in the next step.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
              <p className="text-base">
                <strong>You have {selectedContacts.length} recipient{selectedContacts.length !== 1 ? 's' : ''} selected.</strong> Choose an email template below, or create a new one.
              </p>
            </div>

            {/* Create New Template Button */}
            <div>
              <Button onClick={handleCreateTemplate} variant="outline" className="border-2 border-[#00274E] w-full py-6">
                <Plus className="mr-2 h-5 w-5" />
                <span className="text-base">Create New Custom Template</span>
              </Button>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`border-2 cursor-pointer transition-all ${selectedTemplate === template.id ? 'border-[#00274E] bg-blue-50' : 'border-gray-300 hover:border-gray-500'}`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{template.name}</CardTitle>
                        <Badge variant="outline" className="text-sm">{template.type}</Badge>
                      </div>
                      {selectedTemplate === template.id && (
                        <CheckCircle2 className="h-6 w-6 text-[#00274E]" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Subject Line:</p>
                      <p className="text-sm">{template.subject}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Email Preview:</p>
                      <p className="text-sm text-gray-600 line-clamp-3">{template.body.substring(0, 120)}...</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewingTemplate(template);
                        }}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTemplate(template);
                          setShowTemplateEditor(true);
                        }}
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => {
                        handleTemplateSelect(template.id);
                      }}
                    >
                      Select This Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t-2 border-gray-200">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => setCurrentStep(1)}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Recipients
              </Button>
              <Button 
                size="lg"
                className="bg-[#00274E] hover:bg-[#003d73] px-8 py-6"
                disabled={!selectedTemplate}
                onClick={() => setCurrentStep(3)}
              >
                Continue to Review
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: Review & Send */}
      {currentStep === 3 && (
        <Card className="border-2 border-[#00274E]">
          <CardHeader className="bg-gray-50 border-b-2 border-gray-200">
            <CardTitle className="text-2xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              Step 3: Review & Send Email
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Review your email content and make any final edits before sending to {selectedContacts.length} recipient{selectedContacts.length !== 1 ? 's' : ''}.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Edit Subject */}
            <div>
              <Label htmlFor="subject" className="text-base mb-2 block">Email Subject Line</Label>
              <Input
                id="subject"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Enter email subject"
                className="text-base"
              />
            </div>

            {/* Edit Body */}
            <div>
              <Label htmlFor="body" className="text-base mb-2 block">Email Body</Label>
              <Textarea
                id="body"
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                placeholder="Enter email content..."
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-600 mt-2">
                <strong>Available variables:</strong> [FIRM_NAME], [CLIENT_COUNT], [LLC_NAME], [EXPIRATION_DATE] - These will be automatically replaced with actual data.
              </p>
            </div>

            {/* Preview Toggle */}
            <div>
              <Button 
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full border-2"
              >
                <Eye className="mr-2 h-4 w-4" />
                {showPreview ? "Hide Preview" : "Show Email Preview"}
              </Button>
            </div>

            {/* Email Preview */}
            {showPreview && (
              <Card className="border-2 border-yellow-400 bg-white">
                <CardHeader className="bg-white border-b-2 border-gray-200">
                  <div className="flex items-center gap-4">
                    <ImageWithFallback 
                      src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                      alt="NYLTA.com Logo"
                      className="h-8 sm:h-10 w-auto max-w-[100px] sm:max-w-[120px]"
                    />
                    <div>
                      <p className="text-sm text-gray-600">From: noreply@nylta.com</p>
                      <p className="text-base">Subject: {customSubject}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3 text-base">
                    {customBody.split('\n').map((line, i) => (
                      <p key={i}>{line || '\u00A0'}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recipient Summary */}
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
              <p className="text-base mb-2">
                <strong>Ready to Send:</strong> This email will be sent to <strong>{selectedContacts.length}</strong> recipient{selectedContacts.length !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-gray-600">
                Selected contacts: {mockContacts.filter(c => selectedContacts.includes(c.id)).map(c => c.firmName).join(', ')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t-2 border-gray-200">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => setCurrentStep(2)}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Templates
              </Button>
              <Button 
                size="lg"
                className="bg-[#00274E] hover:bg-[#003d73] px-8 py-6"
                disabled={!customSubject || !customBody}
                onClick={() => setShowSendDialog(true)}
              >
                <Send className="mr-2 h-5 w-5" />
                Send Email Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Editor Dialog */}
      <Dialog open={showTemplateEditor} onOpenChange={setShowTemplateEditor}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-2xl">
            {editingTemplate?.id && templates.find(t => t.id === editingTemplate.id) ? "Edit Template" : "Create New Template"}
          </DialogTitle>
          <DialogDescription>
            Create professional email templates for different campaign types
          </DialogDescription>

          {editingTemplate && (
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="template-name" className="text-base">Template Name</Label>
                <Input
                  id="template-name"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                  placeholder="e.g., Abandoned Bulk Filing Reminder"
                />
              </div>

              <div>
                <Label htmlFor="template-type" className="text-base">Template Type</Label>
                <Select 
                  value={editingTemplate.type} 
                  onValueChange={(v: any) => setEditingTemplate({...editingTemplate, type: v})}
                >
                  <SelectTrigger id="template-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Abandoned Cart - Bulk">Abandoned Cart - Bulk Filing</SelectItem>
                    <SelectItem value="Abandoned Cart - Single">Abandoned Cart - Single Filing</SelectItem>
                    <SelectItem value="Promotional">Promotional Offer</SelectItem>
                    <SelectItem value="Update">Service Update</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="template-subject" className="text-base">Subject Line</Label>
                <Input
                  id="template-subject"
                  value={editingTemplate.subject}
                  onChange={(e) => setEditingTemplate({...editingTemplate, subject: e.target.value})}
                  placeholder="Email subject line"
                />
              </div>

              <div>
                <Label htmlFor="template-body" className="text-base">Email Body</Label>
                <Textarea
                  id="template-body"
                  value={editingTemplate.body}
                  onChange={(e) => setEditingTemplate({...editingTemplate, body: e.target.value})}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setShowTemplateEditor(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate} disabled={!editingTemplate.name || !editingTemplate.subject || !editingTemplate.body}>
                  Save Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Send Dialog */}
      <EmailSendDialog
        open={showSendDialog}
        onOpenChange={setShowSendDialog}
        selectedContacts={mockContacts
          .filter(c => selectedContacts.includes(c.id))
          .map(c => ({ id: c.id, firmName: c.firmName, email: c.email }))}
        subject={customSubject}
        body={customBody}
        onEmailSent={(campaign) => {
          setEmailHistory([...emailHistory, campaign]);
          setSelectedContacts([]);
          setSelectedTemplate("");
          setCustomSubject("");
          setCustomBody("");
          setCurrentStep(1);
        }}
      />

      {/* Template Preview Dialog */}
      <Dialog open={previewingTemplate !== null} onOpenChange={() => setPreviewingTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-2xl" style={{ fontFamily: 'Libre Baskerville, serif' }}>
            Email Template Preview
          </DialogTitle>
          <DialogDescription>
            Preview how this email will appear to recipients
          </DialogDescription>

          {previewingTemplate && (
            <div className="pt-4">
              {/* Email Container */}
              <Card className="border-2 border-gray-300 bg-white shadow-lg">
                {/* Email Header */}
                <CardHeader className="bg-gradient-to-r from-[#00274E] to-[#003d73] border-b-4 border-yellow-400">
                  <div className="flex items-center gap-4">
                    <ImageWithFallback 
                      src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                      alt="NYLTA.com Logo"
                      className="h-8 sm:h-10 md:h-12 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-none"
                    />
                  </div>
                </CardHeader>

                {/* Email Metadata */}
                <div className="bg-gray-50 px-6 py-4 border-b-2 border-gray-200">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <strong>From:</strong> NYLTA.com &lt;noreply@nylta.com&gt;
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Subject:</strong> {previewingTemplate.subject}
                    </p>
                    <Badge variant="outline" className="text-xs mt-2">{previewingTemplate.type}</Badge>
                  </div>
                </div>

                {/* Email Body */}
                <CardContent className="px-8 py-8">
                  <div className="space-y-4 text-base">
                    {previewingTemplate.body.split('\n').map((line, i) => {
                      // Check if line is a button placeholder
                      if (line.includes('[') && line.includes('BUTTON]')) {
                        return (
                          <div key={i} className="my-6">
                            <Button className="bg-[#00274E] hover:bg-[#003d73] text-white px-8 py-6 text-lg">
                              {line.replace('[', '').replace(']', '').replace(' BUTTON', '')}
                            </Button>
                          </div>
                        );
                      }
                      // Check if line starts with bullet
                      if (line.trim().startsWith('•')) {
                        return (
                          <p key={i} className="ml-4">{line}</p>
                        );
                      }
                      return (
                        <p key={i} className={line.trim() === '' ? 'h-2' : ''}>{line || '\u00A0'}</p>
                      );
                    })}
                  </div>
                </CardContent>

                {/* Email Footer / Signature */}
                <div className="bg-gray-50 border-t-2 border-gray-200 px-8 py-6">
                  <div className="flex items-start gap-6">
                    <ImageWithFallback 
                      src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                      alt="NYLTA.com"
                      className="h-16 w-auto"
                    />
                    <div className="flex-1">
                      <p className="text-lg mb-1" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                        <strong>NYLTA.com</strong>
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        New York LLC Transparency Act Filing Services
                      </p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>📧 Email: support@nylta.com</p>
                        <p>📞 Phone: (555) 123-4567</p>
                        <p>🌐 Website: www.nylta.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-300">
                    <p className="text-xs text-gray-500 text-center">
                      © {new Date().getFullYear()} NYLTA.com - All Rights Reserved<br />
                      You received this email because you opted in to receive updates from NYLTA.com
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex gap-3 justify-end mt-6">
                <Button variant="outline" onClick={() => setPreviewingTemplate(null)}>
                  Close Preview
                </Button>
                <Button 
                  className="bg-[#00274E] hover:bg-[#003d73]"
                  onClick={() => {
                    handleTemplateSelect(previewingTemplate.id);
                    setPreviewingTemplate(null);
                  }}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Use This Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}