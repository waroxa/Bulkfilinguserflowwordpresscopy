import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Users, 
  UserPlus, 
  FileText, 
  ArrowLeft, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  Eye,
  UserCheck,
  Mail,
  Phone,
  Building2
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";
import { SERVER_URL } from "../utils/supabase/client";
import { toast } from "sonner";

interface ManagerDashboardProps {
  onBack: () => void;
}

interface Employee {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  accountType: 'employee';
  status: 'active';
  createdBy: string;
  createdAt: string;
  assignedSubmissions: number;
  completedSubmissions: number;
}

interface Submission {
  id: string;
  firmName: string;
  confirmationNumber: string;
  clientCount: number;
  totalAmount: number;
  submittedDate: string;
  status: string;
  assignedTo?: string;
  assignedToName?: string;
}

export default function ManagerDashboard({ onBack }: ManagerDashboardProps) {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "employees" | "assignments">("overview");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateEmployee, setShowCreateEmployee] = useState(false);

  // Create employee form state
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!session?.access_token) return;

      try {
        const response = await fetch(`${SERVER_URL}/manager/employees`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEmployees(data.employees || []);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, [session]);

  // Fetch submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!session?.access_token) return;

      try {
        const response = await fetch(`${SERVER_URL}/manager/submissions`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSubmissions(data.submissions || []);
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [session]);

  // Create employee
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.access_token) {
      toast.error('No session found');
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/manager/create-employee`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Employee ${newEmployee.firstName} ${newEmployee.lastName} created!`);
        setEmployees([...employees, data.employee]);
        setNewEmployee({ firstName: "", lastName: "", email: "", phone: "", password: "" });
        setShowCreateEmployee(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create employee');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error('Error creating employee');
    }
  };

  // Assign submission to employee
  const handleAssignSubmission = async (submissionId: string, employeeId: string) => {
    if (!session?.access_token) return;

    try {
      const response = await fetch(`${SERVER_URL}/manager/assign-submission`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionId, employeeId }),
      });

      if (response.ok) {
        toast.success('Submission assigned successfully!');
        // Refresh submissions
        const submissionsResponse = await fetch(`${SERVER_URL}/manager/submissions`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        });
        if (submissionsResponse.ok) {
          const data = await submissionsResponse.json();
          setSubmissions(data.submissions || []);
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to assign submission');
      }
    } catch (error) {
      console.error('Error assigning submission:', error);
      toast.error('Error assigning submission');
    }
  };

  const unassignedSubmissions = submissions.filter(s => !s.assignedTo);
  const assignedSubmissions = submissions.filter(s => s.assignedTo);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-yellow-400 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ImageWithFallback 
                src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp"
                alt="NYLTA.com Logo"
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  Manager Dashboard
                </h1>
                <p className="text-sm text-gray-600">Team & Assignment Management</p>
              </div>
            </div>
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Team Members</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{employees.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Active processors</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{unassignedSubmissions.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Awaiting assignment</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <FileText className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{assignedSubmissions.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Assigned to team</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage processor and filer accounts</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowCreateEmployee(true)}
                    className="bg-[#00274E] hover:bg-[#003366]"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Team Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.userId}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                              <p className="text-xs text-gray-500">{employee.role}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {employee.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {employee.phone || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>{employee.assignedSubmissions || 0}</TableCell>
                        <TableCell>{employee.completedSubmissions || 0}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-600">Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {employees.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No team members yet. Click "Add Team Member" to create an account.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Unassigned Submissions</CardTitle>
                <CardDescription>Assign submissions to team members</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Firm</TableHead>
                      <TableHead>Confirmation #</TableHead>
                      <TableHead>Clients</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Assign To</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unassignedSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            {submission.firmName}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{submission.confirmationNumber}</TableCell>
                        <TableCell>{submission.clientCount}</TableCell>
                        <TableCell>{new Date(submission.submittedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select onValueChange={(value) => handleAssignSubmission(submission.id, value)}>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select team member" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees.map((employee) => (
                                <SelectItem key={employee.userId} value={employee.userId}>
                                  {employee.firstName} {employee.lastName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                    {unassignedSubmissions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          All submissions have been assigned.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assigned Submissions</CardTitle>
                <CardDescription>Currently being processed by team</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Firm</TableHead>
                      <TableHead>Confirmation #</TableHead>
                      <TableHead>Clients</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>{submission.firmName}</TableCell>
                        <TableCell className="font-mono text-sm">{submission.confirmationNumber}</TableCell>
                        <TableCell>{submission.clientCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-blue-500" />
                            {submission.assignedToName || 'Unknown'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{submission.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {assignedSubmissions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No submissions have been assigned yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Employee Modal */}
      {showCreateEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Add New Team Member</CardTitle>
              <CardDescription>Create a processor/filer account for your team</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateEmployee} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={newEmployee.firstName}
                      onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newEmployee.lastName}
                      onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Temporary Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                    required
                    placeholder="Min 8 characters"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateEmployee(false);
                      setNewEmployee({ firstName: "", lastName: "", email: "", phone: "", password: "" });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#00274E] hover:bg-[#003366]">
                    Create Account
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
