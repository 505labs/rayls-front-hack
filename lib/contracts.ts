import { Address } from "viem";

// Contract addresses - update with actual deployed contracts
export const NFT_CONTRACT_ADDRESS: Address =
  "0x0000000000000000000000000000000000000000" as Address; // Update with actual NFT contract
export const VAULT_CONTRACT_ADDRESS: Address =
  "0x0000000000000000000000000000000000000000" as Address; // Update with actual vault contract

// ABI for NFT contract
export const NFT_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "verificationProof", type: "string" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// ABI for Vault contract
export const VAULT_ABI = [
  {
    inputs: [{ name: "user", type: "address" }],
    name: "hasValidKYCNFT",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

