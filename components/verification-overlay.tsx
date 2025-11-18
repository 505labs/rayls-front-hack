"use client";

import { Button } from "@/components/ui/button";
import { X, CheckCircle2 } from "lucide-react";

interface VerificationOverlayProps {
  onCancel: () => void;
  isVerified?: boolean;
}

export function VerificationOverlay({ onCancel, isVerified = false }: VerificationOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dimmed background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative bg-white rounded-lg shadow-2xl p-8 max-w-md mx-4 text-center">
        <div className="mb-6">
          {isVerified ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Successful!
              </h2>
              <p className="text-gray-600">
                Your proof has been verified successfully
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verification in Progress
              </h2>
              <p className="text-gray-600">
                Please finish verification on your mobile device
              </p>
            </>
          )}
        </div>
        
        {isVerified ? (
          <Button
            onClick={onCancel}
            variant="default"
            className="w-full"
          >
            Close
          </Button>
        ) : (
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel Verification
          </Button>
        )}
      </div>
    </div>
  );
}

