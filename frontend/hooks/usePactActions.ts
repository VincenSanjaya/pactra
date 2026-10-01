"use client";

import { parseUnits } from "viem";

import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { MOCK_USDC_ADDRESS, pactEscrowAbi } from "@/lib/contracts";

import type { Address } from "@/hooks/usePact";

const mockUsdcWriteAbi = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "spender",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
  },
  {
    type: "function",
    name: "mint",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [],
  },
] as const;

const escrowWriteAbi = [
  ...pactEscrowAbi,

  {
    type: "function",
    name: "addMilestone",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "_title",
        type: "string",
      },
      {
        name: "_requirement",
        type: "string",
      },
      {
        name: "_amount",
        type: "uint256",
      },
    ],
    outputs: [],
  },

  {
    type: "function",
    name: "fund",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },

  {
    type: "function",
    name: "submitMilestone",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "_milestoneId",
        type: "uint256",
      },
      {
        name: "_submissionURI",
        type: "string",
      },
    ],
    outputs: [],
  },

  {
    type: "function",
    name: "requestRevision",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "_milestoneId",
        type: "uint256",
      },
    ],
    outputs: [],
  },

  {
    type: "function",
    name: "approveMilestone",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "_milestoneId",
        type: "uint256",
      },
    ],
    outputs: [],
  },
] as const;

export type PactAction = "addMilestone" | "approveUsdc" | "fundEscrow" | "submitMilestone" | "requestRevision" | "approveMilestone" | "mintDemoUsdc" | "";

export function usePactActions(pactAddress: Address) {
  const { data: writeHash, writeContract, isPending: isWriting, error: writeError, reset: resetWrite } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash: writeHash,
  });

  const isBusy = isWriting || isConfirming;

  function addMilestone(title: string, requirement: string, amount: string) {
    writeContract({
      address: pactAddress,
      abi: escrowWriteAbi,
      functionName: "addMilestone",

      args: [title, requirement, parseUnits(amount, 6)],
    });
  }

  function approveUsdc(totalAmount: bigint) {
    writeContract({
      address: MOCK_USDC_ADDRESS,

      abi: mockUsdcWriteAbi,

      functionName: "approve",

      args: [pactAddress, totalAmount],
    });
  }

  function fundEscrow() {
    writeContract({
      address: pactAddress,
      abi: escrowWriteAbi,
      functionName: "fund",
    });
  }

  function submitMilestone(milestoneId: number, submissionURI: string) {
    writeContract({
      address: pactAddress,
      abi: escrowWriteAbi,

      functionName: "submitMilestone",

      args: [BigInt(milestoneId), submissionURI],
    });
  }

  function requestRevision(milestoneId: number) {
    writeContract({
      address: pactAddress,
      abi: escrowWriteAbi,

      functionName: "requestRevision",

      args: [BigInt(milestoneId)],
    });
  }

  function approveMilestone(milestoneId: number) {
    writeContract({
      address: pactAddress,
      abi: escrowWriteAbi,

      functionName: "approveMilestone",

      args: [BigInt(milestoneId)],
    });
  }

  function mintDemoUsdc(recipient: Address) {
    writeContract({
      address: MOCK_USDC_ADDRESS,

      abi: mockUsdcWriteAbi,

      functionName: "mint",

      args: [recipient, parseUnits("1000", 6)],
    });
  }

  return {
    writeHash,
    writeError,

    isWriting,
    isConfirming,
    isBusy,
    txSuccess,

    resetWrite,

    addMilestone,
    approveUsdc,
    fundEscrow,
    submitMilestone,
    requestRevision,
    approveMilestone,
    mintDemoUsdc,
  };
}
