import { useState, useCallback, useRef } from 'react';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';

export function useReclaim() {
  const [proofs, setProofs] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForMobile, setIsWaitingForMobile] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reclaimProofRequestRef = useRef<ReclaimProofRequest | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Verify proof structure and validity
  const verifyProof = useCallback((proof: any): boolean => {
    try {
      // Check if proof exists and has required structure
      if (!proof) return false;

      // Reclaim proofs typically have this structure
      // Adjust based on actual proof format from Reclaim SDK
      if (Array.isArray(proof)) {
        // If proof is an array, check if it has valid entries
        return proof.length > 0 && proof.every((p: any) => 
          p && (p.signatures || p.proof || p.claimData)
        );
      } else if (typeof proof === 'object') {
        // If proof is an object, check for required fields
        return !!(proof.signatures || proof.proof || proof.claimData || proof.extractedParameterValues);
      }

      return false;
    } catch (err) {
      console.error('Proof verification error:', err);
      return false;
    }
  }, []);

  const startVerification = useCallback(async (provider: 'binance' | 'coinbase' | 'x' | 'twitter' | 'example') => {
    try {
      setIsLoading(true);
      setError(null);
      setProofs(null); // Reset proofs when starting new verification
      setIsWaitingForMobile(false);
      setIsVerified(false);

      // Fetch config from backend
      const response = await fetch(`/api/request-verification/${provider}`);
      const data = await response.json();

      if (!data.success || !data.proofRequest) {
        throw new Error(data.error || 'Failed to fetch verification config');
      }

      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(
        data.proofRequest
      );
      
      reclaimProofRequestRef.current = reclaimProofRequest;

      // Trigger the flow - this shows the QR code
      await reclaimProofRequest.triggerReclaimFlow();

      // Wait a bit for the QR code modal to potentially close
      // Then show our overlay for mobile verification
      timeoutRef.current = setTimeout(() => {
        setIsWaitingForMobile(true);
        setIsLoading(false);
        timeoutRef.current = null;
      }, 1000);

      await reclaimProofRequest.startSession({
        onSuccess: async (proofs) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          // Verify the proof
          console.log(proofs);
          const verified = verifyProof(proofs);
          console.log(verified);
          setIsVerified(verified);
          setProofs(proofs);
          setIsLoading(false);
          
          // Keep overlay visible for 2 seconds to show the checkmark, then hide it
          setTimeout(() => {
            setIsWaitingForMobile(false);
          }, 2000);
          
          reclaimProofRequestRef.current = null;
        },
        onError: (err) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setError(err.message || 'Verification failed');
          setIsLoading(false);
          setIsWaitingForMobile(false);
          reclaimProofRequestRef.current = null;
        }
      });
    } catch (err: any) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setError(err.message || 'An error occurred during verification');
      setIsLoading(false);
      setIsWaitingForMobile(false);
      reclaimProofRequestRef.current = null;
    }
  }, [verifyProof]);

  const cancelVerification = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsLoading(false);
    setIsWaitingForMobile(false);
    setIsVerified(false);
    setError(null);
    setProofs(null);
    reclaimProofRequestRef.current = null;
  }, []);

  return { 
    proofs, 
    isLoading, 
    isWaitingForMobile,
    isVerified,
    error, 
    startVerification,
    cancelVerification
  };
}

