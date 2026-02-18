import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Building2, 
  Users, 
  DollarSign,
  FileText,
  Calendar
} from "lucide-react";

interface SubmissionReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: {
    id: string;
    firmName: string;
    firmEIN: string;
    confirmationNumber: string;
    submittedDate: string;
    clientCount: number;
    totalAmount: number;
    status: string;
    paymentMethod: string;
    clients?: Array<{
      llcName: string;
      ein: string;
      exemptStatus: "exempt" | "non-exempt";
      beneficialOwners?: number;
    }>;
  };
  onApprove: (submissionId: string) => void;
  onReject: (submissionId: string, reason: string, notes: string) => void;
}

export default function SubmissionReviewDialog({
  open,
  onOpenChange,
  submission,
  onApprove,
  onReject
}: SubmissionReviewDialogProps) {
  const [reviewAction, setReviewAction] = useState<"none" | "approve" | "reject">("none");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleApproveClick = () => {
    setReviewAction("approve");
    setShowConfirmation(true);
  };

  const handleRejectClick = () => {
    setReviewAction("reject");
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (reviewAction === "approve") {
      onApprove(submission.id);
    } else if (reviewAction === "reject") {
      onReject(submission.id, rejectionReason, rejectionNotes);
    }
    setShowConfirmation(false);
    setReviewAction("none");
    setRejectionReason("");
    setRejectionNotes("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setReviewAction("none");
  };

  // Mock client data if not provided
  const clients = submission.clients || [
    { llcName: "ABC Trading LLC", ein: "12-3456789", exemptStatus: "non-exempt" as const, beneficialOwners: 2 },
    { llcName: "XYZ Services Corp", ein: "98-7654321", exemptStatus: "exempt" as const },
    { llcName: "Delta Holdings LLC", ein: "45-6789012", exemptStatus: "non-exempt" as const, beneficialOwners: 3 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        {!showConfirmation ? (
          <>
            <DialogTitle className="text-2xl">Review Submission</DialogTitle>
            <DialogDescription>
              Review all submission details and client information before approving or rejecting
            </DialogDescription>

            <div className="space-y-6 mt-6">
              {/* Submission Overview */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                <h3 className="text-xl mb-4" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  Submission Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Firm Name</span>
                    </div>
                    <p className="text-base">{submission.firmName}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Firm EIN</span>
                    </div>
                    <p className="text-base font-mono">{submission.firmEIN}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Submitted Date</span>
                    </div>
                    <p className="text-base">{new Date(submission.submittedDate).toLocaleString()}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Number of Clients</span>
                    </div>
                    <p className="text-base">{submission.clientCount} filings</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Total Amount</span>
                    </div>
                    <p className="text-base">${submission.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Confirmation Number</span>
                    </div>
                    <p className="text-base font-mono">{submission.confirmationNumber}</p>
                  </div>
                </div>
              </div>

              {/* Client List */}
              <div>
                <h3 className="text-xl mb-4" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  Client Details ({clients.length} Clients)
                </h3>
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-base">LLC Name</TableHead>
                        <TableHead className="text-base">EIN</TableHead>
                        <TableHead className="text-base">Status</TableHead>
                        <TableHead className="text-base">Beneficial Owners</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-base">{client.llcName}</TableCell>
                          <TableCell className="font-mono">{client.ein}</TableCell>
                          <TableCell>
                            {client.exemptStatus === "exempt" ? (
                              <Badge className="bg-[#00274E] text-white border-[#00274E]">
                                Exempt
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-600 text-white border-gray-600">
                                Non-Exempt
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-base">
                            {client.exemptStatus === "non-exempt" 
                              ? `${client.beneficialOwners || 0} owner${client.beneficialOwners !== 1 ? 's' : ''}`
                              : "N/A (Exempt)"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Data Validation Summary */}
              <Alert className="border-2 border-gray-300 bg-white">
                <AlertTriangle className="h-5 w-5 text-gray-700" />
                <AlertDescription className="text-base">
                  <strong>Review Checklist:</strong>
                  <ul className="mt-2 space-y-1 ml-4 list-disc">
                    <li>Verify all EINs are in correct format (XX-XXXXXXX)</li>
                    <li>Confirm exempt status declarations are appropriate</li>
                    <li>Check that non-exempt filings have beneficial owner information</li>
                    <li>Verify payment amount matches the number of clients</li>
                    <li>Ensure firm authorization information is complete</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Review Actions */}
              <div className="border-t-2 border-gray-200 pt-6 space-y-4">
                <h3 className="text-xl" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  Review Decision
                </h3>
                
                {reviewAction === "reject" && (
                  <div className="space-y-4 bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
                    <div>
                      <Label htmlFor="rejection-reason" className="text-base">
                        Rejection Reason <span className="text-red-600">*</span>
                      </Label>
                      <Select value={rejectionReason} onValueChange={setRejectionReason}>
                        <SelectTrigger id="rejection-reason" className="mt-2">
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="invalid-ein">Invalid EIN Format</SelectItem>
                          <SelectItem value="missing-data">Missing Required Information</SelectItem>
                          <SelectItem value="incorrect-exemption">Incorrect Exemption Status</SelectItem>
                          <SelectItem value="payment-mismatch">Payment Amount Mismatch</SelectItem>
                          <SelectItem value="incomplete-beneficial-owners">Incomplete Beneficial Owner Data</SelectItem>
                          <SelectItem value="duplicate-submission">Duplicate Submission</SelectItem>
                          <SelectItem value="fraud-concern">Fraud/Security Concern</SelectItem>
                          <SelectItem value="other">Other (Specify in Notes)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="rejection-notes" className="text-base">
                        Additional Notes <span className="text-red-600">*</span>
                      </Label>
                      <Textarea
                        id="rejection-notes"
                        value={rejectionNotes}
                        onChange={(e) => setRejectionNotes(e.target.value)}
                        placeholder="Provide detailed explanation for rejection. This will be included in the notification to the submitter."
                        rows={4}
                        className="mt-2"
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        Be specific about what needs to be corrected for resubmission.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="flex-1"
                  >
                    Cancel Review
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRejectClick}
                    className="flex-1 border-gray-600 text-gray-800 hover:bg-gray-100"
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    Reject Submission
                  </Button>
                  <Button
                    onClick={handleApproveClick}
                    className="flex-1 bg-[#00274E] hover:bg-[#003d73]"
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Approve Submission
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogTitle className="text-2xl">
              Confirm {reviewAction === "approve" ? "Approval" : "Rejection"}
            </DialogTitle>
            
            <div className="space-y-6 mt-6">
              {reviewAction === "approve" ? (
                <Alert className="border-2 border-[#00274E] bg-gray-50">
                  <CheckCircle2 className="h-5 w-5 text-[#00274E]" />
                  <AlertDescription className="text-base">
                    <strong>You are about to approve this submission.</strong>
                    <div className="mt-3 space-y-2">
                      <p>• Firm: {submission.firmName}</p>
                      <p>• Clients: {submission.clientCount} filings</p>
                      <p>• Amount: ${submission.totalAmount.toLocaleString()}</p>
                      <p className="mt-3">
                        Once approved, this submission will be processed and the firm will receive confirmation.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-2 border-gray-600 bg-gray-50">
                  <XCircle className="h-5 w-5 text-gray-800" />
                  <AlertDescription className="text-base">
                    <strong>You are about to reject this submission.</strong>
                    <div className="mt-3 space-y-2">
                      <p>• Firm: {submission.firmName}</p>
                      <p>• Reason: {rejectionReason.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                      <p>• Notes: {rejectionNotes}</p>
                      <p className="mt-3 text-gray-700">
                        The firm will be notified of the rejection and provided with the reason and notes you specified.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Go Back
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={reviewAction === "reject" && (!rejectionReason || !rejectionNotes)}
                  className={`flex-1 ${
                    reviewAction === "approve" 
                      ? "bg-[#00274E] hover:bg-[#003d73]" 
                      : "bg-gray-700 hover:bg-gray-800"
                  }`}
                >
                  {reviewAction === "approve" ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Confirm Approval
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-5 w-5" />
                      Confirm Rejection
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
