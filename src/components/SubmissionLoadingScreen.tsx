import { Loader2, CheckCircle, Send, Database, Cloud } from "lucide-react";
import { Progress } from "./ui/progress";

interface SubmissionLoadingScreenProps {
  isVisible: boolean;
  progress: number;
  statusMessage: string;
  clientCount?: number;
  currentStep?: string;
}

export default function SubmissionLoadingScreen({ 
  isVisible, 
  progress, 
  statusMessage,
  clientCount,
  currentStep 
}: SubmissionLoadingScreenProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full mx-4">
        <div className="text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            {progress < 100 ? (
              <div className="relative">
                <div className="absolute inset-0 bg-[#00274E]/10 rounded-full animate-ping" />
                <div className="relative bg-[#00274E] rounded-full p-4">
                  <Loader2 className="h-16 w-16 text-white animate-spin" />
                </div>
              </div>
            ) : (
              <div className="bg-green-100 rounded-full p-4 animate-bounce">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {progress < 100 ? 'Submitting to HighLevel...' : 'Submission Complete!'}
          </h2>

          {/* Status Message */}
          <p className="text-gray-600 mb-6">
            {statusMessage}
          </p>

          {/* Client Count */}
          {clientCount !== undefined && clientCount > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-1">
                {clientCount}
              </div>
              <div className="text-sm text-gray-600">
                Clients Being {progress < 100 ? 'Submitted' : 'Submitted'}
              </div>
            </div>
          )}

          {/* Current Step */}
          {currentStep && progress < 100 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 text-left">
              <p className="text-sm font-medium text-yellow-800">
                {currentStep}
              </p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-2">
            <Progress value={progress} className="h-4" />
          </div>
          <p className="text-sm text-gray-500 mb-6">
            {progress}% Complete
          </p>

          {/* Submission Steps */}
          <div className="text-left">
            <div className="space-y-3 text-sm">
              <div className={`flex items-center gap-3 p-2 rounded ${progress >= 20 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                <div className="flex-shrink-0">
                  {progress >= 20 ? <CheckCircle className="h-5 w-5" /> : <div className="h-5 w-5 rounded-full border-2 border-gray-300" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium">Preparing submission data</div>
                  <div className="text-xs opacity-75">Validating client information</div>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-2 rounded ${progress >= 40 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                <div className="flex-shrink-0">
                  {progress >= 40 ? <CheckCircle className="h-5 w-5" /> : <Database className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium">Creating payment records</div>
                  <div className="text-xs opacity-75">Recording transaction details</div>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-2 rounded ${progress >= 60 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                <div className="flex-shrink-0">
                  {progress >= 60 ? <CheckCircle className="h-5 w-5" /> : <Cloud className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium">Syncing to HighLevel CRM</div>
                  <div className="text-xs opacity-75">Updating contact records</div>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-2 rounded ${progress >= 80 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                <div className="flex-shrink-0">
                  {progress >= 80 ? <CheckCircle className="h-5 w-5" /> : <Send className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium">Finalizing submission</div>
                  <div className="text-xs opacity-75">Generating confirmation</div>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-2 rounded ${progress >= 100 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                <div className="flex-shrink-0">
                  {progress >= 100 ? <CheckCircle className="h-5 w-5" /> : <div className="h-5 w-5 rounded-full border-2 border-gray-300" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium">Submission complete</div>
                  <div className="text-xs opacity-75">Ready to view confirmation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Warning for large submissions */}
          {clientCount && clientCount > 100 && progress < 100 && (
            <div className="mt-6 bg-blue-50 border border-blue-300 rounded p-3">
              <p className="text-xs text-blue-800">
                ⏱️ Processing {clientCount} clients may take 1-2 minutes. Please don't close this window.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
