import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Download,
  Eye,
  Calendar,
  DollarSign,
  Building2,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Submission {
  id: string;
  confirmationNumber: string;
  date: string;
  clientCount: number;
  totalAmount: number;
  status: "Filed" | "Processing" | "Pending Review" | "Action Required";
  clients: SubmittedClient[];
}

interface SubmittedClient {
  id: string;
  llcName: string;
  nydosId: string;
  ein: string;
  filingStatus: "Exempt" | "Non-Exempt";
  status: "Filed" | "Processing" | "Pending";
  submittedDate: string;
}

interface MemberProfileProps {
  onBack: () => void;
  onStartNewFiling: () => void;
}

// Mock data - in production this would come from a database
const mockSubmissions: Submission[] = [
  {
    id: "sub-001",
    confirmationNumber: "20241112T1430",
    date: "2024-11-12T14:30:00",
    clientCount: 5,
    totalAmount: 3223.80,
    status: "Filed",
    clients: [
      {
        id: "c1",
        llcName: "Manhattan Professional Services LLC",
        nydosId: "6789012",
        ein: "12-3456789",
        filingStatus: "Exempt",
        status: "Filed",
        submittedDate: "2024-11-12T14:30:00"
      },
      {
        id: "c2",
        llcName: "NYC Development Corporation LLC",
        nydosId: "7890123",
        ein: "98-7654321",
        filingStatus: "Exempt",
        status: "Filed",
        submittedDate: "2024-11-12T14:30:00"
      },
      {
        id: "c3",
        llcName: "Brooklyn Tech Ventures LLC",
        nydosId: "8901234",
        ein: "45-6789012",
        filingStatus: "Non-Exempt",
        status: "Filed",
        submittedDate: "2024-11-12T14:30:00"
      },
      {
        id: "c4",
        llcName: "Empire State Holdings LLC",
        nydosId: "9012345",
        ein: "23-4567890",
        filingStatus: "Non-Exempt",
        status: "Filed",
        submittedDate: "2024-11-12T14:30:00"
      },
      {
        id: "c5",
        llcName: "Queens Commercial Properties LLC",
        nydosId: "1234098",
        ein: "34-5678901",
        filingStatus: "Non-Exempt",
        status: "Filed",
        submittedDate: "2024-11-12T14:30:00"
      }
    ]
  },
  {
    id: "sub-002",
    confirmationNumber: "20241108T0920",
    date: "2024-11-08T09:20:00",
    clientCount: 12,
    totalAmount: 7724.16,
    status: "Filed",
    clients: Array.from({ length: 12 }, (_, i) => ({
      id: `c${i + 6}`,
      llcName: `Client Company ${i + 1} LLC`,
      nydosId: `${7000000 + i}`,
      ein: `${10 + i}-${3456789 + i}`,
      filingStatus: i % 2 === 0 ? "Exempt" : "Non-Exempt",
      status: "Filed",
      submittedDate: "2024-11-08T09:20:00"
    }))
  },
  {
    id: "sub-003",
    confirmationNumber: "20241105T1615",
    date: "2024-11-05T16:15:00",
    clientCount: 3,
    totalAmount: 1934.28,
    status: "Processing",
    clients: Array.from({ length: 3 }, (_, i) => ({
      id: `c${i + 18}`,
      llcName: `Processing Company ${i + 1} LLC`,
      nydosId: `${8000000 + i}`,
      ein: `${20 + i}-${4567890 + i}`,
      filingStatus: "Non-Exempt",
      status: i === 2 ? "Processing" : "Filed",
      submittedDate: "2024-11-05T16:15:00"
    }))
  }
];

export default function MemberProfile({ onBack, onStartNewFiling }: MemberProfileProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const totalSubmissions = mockSubmissions.length;
  const totalClients = mockSubmissions.reduce((acc, sub) => acc + sub.clientCount, 0);
  const totalAmountPaid = mockSubmissions.reduce((acc, sub) => acc + sub.totalAmount, 0);
  const filedCount = mockSubmissions.filter(s => s.status === "Filed").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Filed":
        return <Badge className="bg-green-100 text-green-800 border-green-300">✓ Filed</Badge>;
      case "Processing":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">⏳ Processing</Badge>;
      case "Pending Review":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">⚠ Pending Review</Badge>;
      case "Action Required":
        return <Badge className="bg-red-100 text-red-800 border-red-300">! Action Required</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (selectedSubmission) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="outline" 
            onClick={() => setSelectedSubmission(null)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Submissions
          </Button>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">Submission Details</CardTitle>
                  <CardDescription className="mt-2">
                    Confirmation #{selectedSubmission.confirmationNumber}
                  </CardDescription>
                </div>
                {getStatusBadge(selectedSubmission.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Submitted Date</p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {new Date(selectedSubmission.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Number of Clients</p>
                  <p className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    {selectedSubmission.clientCount} filings
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                  <p className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    ${selectedSubmission.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Indicator */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filing Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                {[
                  { label: "Submitted", icon: CheckCircle2, complete: true },
                  { label: "Under Review", icon: Clock, complete: true },
                  { label: "Processing", icon: Clock, complete: selectedSubmission.status === "Filed" },
                  { label: "Filed", icon: CheckCircle2, complete: selectedSubmission.status === "Filed" }
                ].map((step, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step.complete ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                    }`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs text-center">{step.label}</p>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ 
                    width: selectedSubmission.status === "Filed" ? "100%" : 
                           selectedSubmission.status === "Processing" ? "75%" : 
                           selectedSubmission.status === "Pending Review" ? "50%" : "25%" 
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Clients Filed */}
          <Card>
            <CardHeader>
              <CardTitle>Clients Filed ({selectedSubmission.clients.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>LLC Name</TableHead>
                    <TableHead>NYDOS ID</TableHead>
                    <TableHead>EIN</TableHead>
                    <TableHead>Filing Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSubmission.clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.llcName}</TableCell>
                      <TableCell>{client.nydosId}</TableCell>
                      <TableCell>{client.ein}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {client.filingStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#00274E] border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <ImageWithFallback 
                src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                alt="NYLTA.com Logo"
                className="h-10 sm:h-12 md:h-14 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-none"
              />
              <div className="border-l-2 border-white/30 pl-6">
                <h1 className="text-white text-3xl mb-2">Member Profile</h1>
                <p className="text-gray-300">Track and manage all your bulk filing submissions</p>
              </div>
            </div>
            <Button onClick={onBack} variant="outline" className="bg-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Submissions</CardDescription>
              <CardTitle className="text-3xl">{totalSubmissions}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle2 className="mr-1 h-4 w-4" />
                {filedCount} completed
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Clients Filed</CardDescription>
              <CardTitle className="text-3xl">{totalClients}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-600">
                <Building2 className="mr-1 h-4 w-4" />
                Across all submissions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Amount Paid</CardDescription>
              <CardTitle className="text-3xl">${totalAmountPaid.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="mr-1 h-4 w-4" />
                All-time total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Average Per Submission</CardDescription>
              <CardTitle className="text-3xl">
                {Math.round(totalClients / totalSubmissions)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="mr-1 h-4 w-4" />
                Clients per filing
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Submission History</CardTitle>
                <CardDescription className="mt-1">
                  View and manage all your bulk filing submissions
                </CardDescription>
              </div>
              <Button onClick={onStartNewFiling}>
                Start New Bulk Filing
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Submissions</TabsTrigger>
                <TabsTrigger value="filed">Filed</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="space-y-4">
                  {mockSubmissions.map((submission) => (
                    <Card key={submission.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg">
                                Submission #{submission.confirmationNumber}
                              </h3>
                              {getStatusBadge(submission.status)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(submission.date).toLocaleDateString()} at{" "}
                                {new Date(submission.date).toLocaleTimeString()}
                              </div>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                {submission.clientCount} clients filed
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                ${submission.totalAmount.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            View Details
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="filed">
                <div className="space-y-4">
                  {mockSubmissions
                    .filter((s) => s.status === "Filed")
                    .map((submission) => (
                      <Card key={submission.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg">
                                  Submission #{submission.confirmationNumber}
                                </h3>
                                {getStatusBadge(submission.status)}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(submission.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4" />
                                  {submission.clientCount} clients filed
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4" />
                                  ${submission.totalAmount.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => setSelectedSubmission(submission)}
                            >
                              View Details
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="processing">
                <div className="space-y-4">
                  {mockSubmissions
                    .filter((s) => s.status === "Processing")
                    .map((submission) => (
                      <Card key={submission.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg">
                                  Submission #{submission.confirmationNumber}
                                </h3>
                                {getStatusBadge(submission.status)}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(submission.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4" />
                                  {submission.clientCount} clients filed
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4" />
                                  ${submission.totalAmount.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => setSelectedSubmission(submission)}
                            >
                              View Details
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}