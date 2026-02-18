import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { CheckCircle2, Loader2, Send, AlertTriangle, Download } from "lucide-react";

interface EmailSendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedContacts: {
    id: string;
    firmName: string;
    email: string;
  }[];
  subject: string;
  body: string;
  onEmailSent: (campaignData: {
    id: string;
    subject: string;
    recipientCount: number;
    sentDate: string;
    status: "Success" | "Failed";
    recipients: string[];
  }) => void;
}

export default function EmailSendDialog({
  open,
  onOpenChange,
  selectedContacts,
  subject,
  body,
  onEmailSent
}: EmailSendDialogProps) {
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sent, setSent] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState("");

  const handleSend = async () => {
    setSending(true);
    setProgress(0);
    setSent(false);

    // Simulate sending emails
    for (let i = 0; i < selectedContacts.length; i++) {
      setCurrentRecipient(selectedContacts[i].firmName);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProgress(((i + 1) / selectedContacts.length) * 100);
    }

    // Create campaign record
    const campaignData = {
      id: `campaign-${Date.now()}`,
      subject,
      recipientCount: selectedContacts.length,
      sentDate: new Date().toISOString(),
      status: "Success" as const,
      recipients: selectedContacts.map(c => c.email)
    };

    setSending(false);
    setSent(true);
    
    // Call parent callback
    onEmailSent(campaignData);

    // Auto-close after 3 seconds
    setTimeout(() => {
      onOpenChange(false);
      setSent(false);
      setProgress(0);
    }, 3000);
  };

  const handleClose = () => {
    if (!sending) {
      onOpenChange(false);
      setSent(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogTitle>
          {!sent && !sending && "Confirm Email Campaign"}
          {sending && "Sending Emails..."}
          {sent && "✓ Campaign Sent Successfully!"}
        </DialogTitle>
        <DialogDescription>
          {!sent && !sending && "Review campaign details before sending"}
          {sending && "Please wait while we send your emails"}
          {sent && "Your email campaign has been delivered"}
        </DialogDescription>

        {!sent && !sending && (
          <div className="space-y-4 pt-4">
            <Alert>
              <Send className="h-4 w-4" />
              <AlertDescription>
                You are about to send an email campaign to <strong>{selectedContacts.length}</strong> recipient{selectedContacts.length !== 1 ? "s" : ""}.
              </AlertDescription>
            </Alert>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Subject Line:</p>
                  <p className="font-medium">{subject}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Recipients ({selectedContacts.length}):</p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {selectedContacts.map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded text-sm">
                        <span>{contact.firmName}</span>
                        <span className="text-gray-500 font-mono text-xs">{contact.email}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Message Preview:</p>
                  <div className="max-h-32 overflow-y-auto bg-gray-50 p-3 rounded text-sm">
                    {body.split('\n').slice(0, 5).map((line, i) => (
                      <p key={i} className="text-gray-600">{line || <br />}</p>
                    ))}
                    {body.split('\n').length > 5 && (
                      <p className="text-gray-400 italic">...and more</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-yellow-50 border-yellow-300">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-900">
                <strong>Important:</strong> This action cannot be undone. Make sure all information is correct before sending.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSend} className="bg-green-600 hover:bg-green-700">
                <Send className="mr-2 h-4 w-4" />
                Send Campaign Now
              </Button>
            </div>
          </div>
        )}

        {sending && (
          <div className="space-y-6 pt-6 pb-4">
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-4" />
              <p className="text-lg mb-2">Sending emails...</p>
              <p className="text-sm text-gray-500">
                Sending to: <span className="font-medium">{currentRecipient}</span>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 text-center">
                {Math.round((progress / 100) * selectedContacts.length)} of {selectedContacts.length} sent
              </p>
            </div>
          </div>
        )}

        {sent && (
          <div className="space-y-6 pt-6 pb-4">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-green-100 p-4 mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
              <h3 className="text-xl mb-2">Campaign Sent!</h3>
              <p className="text-gray-600 text-center">
                Successfully sent <strong>{selectedContacts.length}</strong> emails
              </p>
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">All emails delivered successfully</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Campaign recorded in history</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Delivery reports available</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-gray-500 text-center">
              This dialog will close automatically...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
