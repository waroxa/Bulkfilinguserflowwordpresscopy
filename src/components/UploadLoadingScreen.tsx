import { Loader2, CheckCircle, Upload } from "lucide-react";
import { Progress } from "./ui/progress";

interface UploadLoadingScreenProps {
  isVisible: boolean;
  progress: number;
  statusMessage: string;
  clientCount?: number;
}

export default function UploadLoadingScreen({ 
  isVisible, 
  progress, 
  statusMessage,
  clientCount 
}: UploadLoadingScreenProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            {progress < 100 ? (
              <div className="relative">
                <Loader2 className="h-16 w-16 text-[#00274E] animate-spin" />
                <Upload className="h-8 w-8 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            ) : (
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {progress < 100 ? 'Uploading Clients...' : 'Upload Complete!'}
          </h2>

          {/* Status Message */}
          <p className="text-gray-600 mb-6">
            {statusMessage}
          </p>

          {/* Client Count */}
          {clientCount !== undefined && clientCount > 0 && (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {clientCount}
              </div>
              <div className="text-sm text-gray-600">
                Clients {progress < 100 ? 'Processing' : 'Imported'}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-2">
            <Progress value={progress} className="h-3" />
          </div>
          <p className="text-sm text-gray-500">
            {progress}%
          </p>

          {/* Loading Steps */}
          <div className="mt-6 text-left">
            <div className="space-y-2 text-sm">
              <div className={`flex items-center gap-2 ${progress >= 20 ? 'text-green-600' : 'text-gray-400'}`}>
                {progress >= 20 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-gray-300" />}
                <span>Reading file</span>
              </div>
              <div className={`flex items-center gap-2 ${progress >= 40 ? 'text-green-600' : 'text-gray-400'}`}>
                {progress >= 40 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-gray-300" />}
                <span>Parsing client data</span>
              </div>
              <div className={`flex items-center gap-2 ${progress >= 60 ? 'text-green-600' : 'text-gray-400'}`}>
                {progress >= 60 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-gray-300" />}
                <span>Processing beneficial owners</span>
              </div>
              <div className={`flex items-center gap-2 ${progress >= 80 ? 'text-green-600' : 'text-gray-400'}`}>
                {progress >= 80 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-gray-300" />}
                <span>Validating data</span>
              </div>
              <div className={`flex items-center gap-2 ${progress >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
                {progress >= 100 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-gray-300" />}
                <span>Import complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
