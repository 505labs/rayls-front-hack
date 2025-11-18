"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { NFTCard } from "@/components/nft-card";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VerificationOverlay } from "@/components/verification-overlay";
import { NFT_CONTRACT_ADDRESS, NFT_ABI } from "@/lib/contracts";
import { useState, useEffect } from "react";
import { parseEther } from "viem";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useReclaim } from "@/hooks/useReclaim";


interface VerificationCollection {
  id: string;
  name: string;
  issuer: string;
  verificationMethod: "coinbase" | "binance" | "x" | "twitter" | "example";
  description: string;
}

const VERIFICATION_COLLECTIONS: VerificationCollection[] = [
  {
    id: "coinbase-kyc",
    name: "Coinbase KYC Verified",
    issuer: "Coinbase",
    verificationMethod: "coinbase",
    description: "Verify your identity using Coinbase KYC credentials",
  },
  {
    id: "binance-kyc",
    name: "Binance KYC Verified",
    issuer: "Binance",
    verificationMethod: "binance",
    description: "Verify your identity using Binance KYC credentials",
  },
  {
    id: "x-username",
    name: "X Username Verified",
    issuer: "X (Twitter)",
    verificationMethod: "x",
    description: "Verify your X (Twitter) username",
  },
  {
    id: "example-verification",
    name: "Example Verification",
    issuer: "Example",
    verificationMethod: "example",
    description: "Example verification provider for testing purposes",
  },
];

export default function DashboardPage() {
  const { primaryWallet, user } = useDynamicContext();
  const walletConnected = (primaryWallet !== null || user)
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [userNFTs, setUserNFTs] = useState<Map<string, string>>(new Map());
  const [verifying, setVerifying] = useState<string | null>(null);
  const { 
    proofs, 
    isLoading: reclaimLoading, 
    isWaitingForMobile,
    isVerified,
    error: reclaimError, 
    startVerification,
    cancelVerification
  } = useReclaim();

  // Check NFT ownership for each collection
  const { data: coinbaseBalance } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  useEffect(() => {
    // Fetch user's NFTs
    // This is a simplified version - you'd need to query all token IDs
    if (address && coinbaseBalance && Number(coinbaseBalance) > 0) {
      // In a real implementation, you'd fetch all token IDs
      setUserNFTs((prev) => {
        const newMap = new Map(prev);
        newMap.set("coinbase-kyc", "1"); // Mock token ID
        return newMap;
      });
    }
  }, [address, coinbaseBalance]);

  // Handle proofs when they're received
  useEffect(() => {
    if (proofs && address && verifying) {
      // Convert proofs to a format suitable for the contract
      // The exact format depends on your contract's requirements
      const proofString = JSON.stringify(proofs);
      
      // Mint NFT with proof
      writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: "mint",
        args: [address, proofString],
      });

      // Find the collection being verified and mark it as verified
      const collection = VERIFICATION_COLLECTIONS.find(c => c.id === verifying);
      if (collection) {
        setUserNFTs((prev) => {
          const newMap = new Map(prev);
          // Generate a token ID (in production, you'd get this from the mint transaction)
          newMap.set(collection.id, Date.now().toString());
          return newMap;
        });
      }

      setVerifying(null);
    }
  }, [proofs, address, verifying, writeContract]);

  // Handle errors
  useEffect(() => {
    if (reclaimError) {
      console.error("Verification error:", reclaimError);
      setVerifying(null);
    }
  }, [reclaimError]);

  const handleVerify = async (collection: VerificationCollection) => {
    if (!address) return;

    setVerifying(collection.id);
    await startVerification(collection.verificationMethod);
  };

  const handleCancelVerification = () => {
    cancelVerification();
    setVerifying(null);
  };

  if (!walletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Please Connect Your Wallet</CardTitle>
              <CardDescription>
                Connect your wallet to view and verify KYC NFTs
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      {(isWaitingForMobile || isVerified) && (
        <VerificationOverlay 
          onCancel={handleCancelVerification} 
          isVerified={isVerified}
        />
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">KYC Verification Dashboard</h1>
          <p className="text-gray-600">
            Verify your identity and receive NFT credentials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VERIFICATION_COLLECTIONS.filter((collection) => !userNFTs.has(collection.id)).map((collection) => {
            const isVerifying = verifying === collection.id && reclaimLoading;

            return (
              <NFTCard
                key={collection.id}
                name={collection.name}
                issuer={collection.issuer}
                verified={false}
                verificationMethod={collection.verificationMethod}
                onVerify={() => handleVerify(collection)}
                disabled={isVerifying}
              />
            );
          })}
        </div>

        {reclaimError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            Error: {reclaimError}
          </div>
        )}

        {userNFTs.size > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Your Verified NFTs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from(userNFTs.entries()).map(([collectionId, tokenId]) => {
                const collection = VERIFICATION_COLLECTIONS.find(
                  (c) => c.id === collectionId
                );
                if (!collection) return null;

                return (
                  <NFTCard
                    key={collectionId}
                    name={collection.name}
                    issuer={collection.issuer}
                    verified={true}
                    verificationMethod={collection.verificationMethod}
                    tokenId={tokenId}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

