"use client";

import { useCallback, useMemo } from "react";

import { formatUnits } from "viem";

import { useAccount, useReadContract } from "wagmi";

import { MOCK_USDC_ADDRESS, pactEscrowAbi } from "@/lib/contracts";

export type Address = `0x${string}`;

const mockUsdcReadAbi = [
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      {
        name: "owner",
        type: "address",
      },
      {
        name: "spender",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [
      {
        name: "account",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
  },
] as const;

const milestoneReadAbi = [
  ...pactEscrowAbi,
  {
    type: "function",
    name: "milestones",
    stateMutability: "view",
    inputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "title",
        type: "string",
      },
      {
        name: "requirement",
        type: "string",
      },
      {
        name: "amount",
        type: "uint256",
      },
      {
        name: "submissionURI",
        type: "string",
      },
      {
        name: "status",
        type: "uint8",
      },
    ],
  },
] as const;

export function usePact(pactAddress: Address, selectedMilestone: number) {
  const { address: connectedAddress, isConnected } = useAccount();

  const { data: projectTitle } = useReadContract({
    address: pactAddress,
    abi: pactEscrowAbi,
    functionName: "projectTitle",
  });

  const { data: projectDescription } = useReadContract({
    address: pactAddress,
    abi: pactEscrowAbi,
    functionName: "projectDescription",
  });

  const { data: client } = useReadContract({
    address: pactAddress,
    abi: pactEscrowAbi,
    functionName: "client",
  });

  const { data: freelancer } = useReadContract({
    address: pactAddress,
    abi: pactEscrowAbi,
    functionName: "freelancer",
  });

  const { data: totalAmount, refetch: refetchTotalAmount } = useReadContract({
    address: pactAddress,
    abi: pactEscrowAbi,
    functionName: "totalAmount",
  });

  const { data: releasedAmount, refetch: refetchReleasedAmount } = useReadContract({
    address: pactAddress,
    abi: pactEscrowAbi,
    functionName: "releasedAmount",
  });

  const { data: funded, refetch: refetchFunded } = useReadContract({
    address: pactAddress,
    abi: pactEscrowAbi,
    functionName: "funded",
  });

  const { data: pactStatus, refetch: refetchPactStatus } = useReadContract({
    address: pactAddress,
    abi: pactEscrowAbi,
    functionName: "pactStatus",
  });

  const { data: milestoneCount, refetch: refetchMilestoneCount } = useReadContract({
    address: pactAddress,
    abi: pactEscrowAbi,
    functionName: "getMilestoneCount",
  });

  const { data: milestone, refetch: refetchMilestone } = useReadContract({
    address: pactAddress,
    abi: milestoneReadAbi,
    functionName: "milestones",

    args: [BigInt(selectedMilestone)],

    query: {
      enabled: milestoneCount !== undefined && selectedMilestone < Number(milestoneCount),
    },
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: MOCK_USDC_ADDRESS,
    abi: mockUsdcReadAbi,
    functionName: "allowance",

    args: connectedAddress ? [connectedAddress, pactAddress] : undefined,

    query: {
      enabled: !!connectedAddress,
    },
  });

  const { data: escrowBalance, refetch: refetchEscrowBalance } = useReadContract({
    address: MOCK_USDC_ADDRESS,
    abi: mockUsdcReadAbi,
    functionName: "balanceOf",

    args: [pactAddress],
  });

  const { data: walletBalance, refetch: refetchWalletBalance } = useReadContract({
    address: MOCK_USDC_ADDRESS,
    abi: mockUsdcReadAbi,
    functionName: "balanceOf",

    args: connectedAddress ? [connectedAddress] : undefined,

    query: {
      enabled: !!connectedAddress,
    },
  });

  const isClient = !!connectedAddress && !!client && connectedAddress.toLowerCase() === client.toLowerCase();

  const isFreelancer = !!connectedAddress && !!freelancer && connectedAddress.toLowerCase() === freelancer.toLowerCase();

  const formattedTotal = useMemo(() => {
    if (totalAmount === undefined) {
      return "0";
    }

    return formatUnits(totalAmount, 6);
  }, [totalAmount]);

  const formattedReleased = useMemo(() => {
    if (releasedAmount === undefined) {
      return "0";
    }

    return formatUnits(releasedAmount, 6);
  }, [releasedAmount]);

  const formattedAllowance = useMemo(() => {
    if (allowance === undefined) {
      return "0";
    }

    return formatUnits(allowance, 6);
  }, [allowance]);

  const formattedEscrowBalance = useMemo(() => {
    if (escrowBalance === undefined) {
      return "0";
    }

    return formatUnits(escrowBalance, 6);
  }, [escrowBalance]);

  const formattedWalletBalance = useMemo(() => {
    if (walletBalance === undefined) {
      return "0";
    }

    return formatUnits(walletBalance, 6);
  }, [walletBalance]);

  const hasEnoughAllowance = allowance !== undefined && totalAmount !== undefined && allowance >= totalAmount;

  const refreshAll = useCallback(async () => {
    await Promise.all([refetchTotalAmount(), refetchReleasedAmount(), refetchFunded(), refetchPactStatus(), refetchMilestoneCount(), refetchMilestone(), refetchAllowance(), refetchEscrowBalance(), refetchWalletBalance()]);
  }, [refetchTotalAmount, refetchReleasedAmount, refetchFunded, refetchPactStatus, refetchMilestoneCount, refetchMilestone, refetchAllowance, refetchEscrowBalance, refetchWalletBalance]);

  return {
    connectedAddress,
    isConnected,

    projectTitle,
    projectDescription,

    client,
    freelancer,

    totalAmount,
    releasedAmount,

    funded,
    pactStatus,

    milestoneCount,
    milestone,

    allowance,
    escrowBalance,
    walletBalance,

    formattedTotal,
    formattedReleased,
    formattedAllowance,
    formattedEscrowBalance,
    formattedWalletBalance,

    hasEnoughAllowance,

    isClient,
    isFreelancer,

    refreshAll,
    refetchMilestone,
    refetchWalletBalance,
  };
}
