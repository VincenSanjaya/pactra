"use client";

import Link from "next/link";
import { formatUnits } from "viem";
import {
  useAccount,
  useReadContract,
} from "wagmi";

import {
  PACT_FACTORY_ADDRESS,
  pactFactoryAbi,
  pactEscrowAbi,
} from "@/lib/contracts";

type Address = `0x${string}`;

type PactRole = "Client" | "Freelancer";

function shortenAddress(address?: string) {
  if (!address) return "—";

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getStatusLabel(status?: number) {
  switch (status) {
    case 0:
      return "Active";
    case 1:
      return "Completed";
    case 2:
      return "Cancelled";
    default:
      return "Unknown";
  }
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    Active:
      "border-[#c7ff1a]/20 bg-[#c7ff1a]/10 text-[#c7ff1a]",
    Completed:
      "border-[#43d17b]/20 bg-[#43d17b]/10 text-[#43d17b]",
    Cancelled:
      "border-[#ff5c5c]/20 bg-[#ff5c5c]/10 text-[#ff7c7c]",
    Unknown:
      "border-[#636b74]/20 bg-[#636b74]/10 text-[#8e969f]",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status] ?? styles.Unknown
        }`}
    >
      {status}
    </span>
  );
}

function PactRow({
  pactAddress,
  connectedAddress,
}: {
  pactAddress: Address;
  connectedAddress?: Address;
}) {
  const {
    data: projectTitle,
    isLoading: titleLoading,
  } = useReadContract({
    address: pactAddress,
    abi: pactEscrowAbi,
    functionName: "projectTitle",
  });

  const {
    data: client,
  } = useReadContract({
    address: pactAddress,
    abi: pactEscrowAbi,
    functionName: "client",
  });

  const {
    data: freelancer,
  } = useReadContract({
    address: pactAddress,
    abi: pactEscrowAbi,
    functionName: "freelancer",
  });

  const {
    data: totalAmount,
  } = useReadContract({
    address: pactAddress,
    abi: pactEscrowAbi,
    functionName: "totalAmount",
  });

  const {
    data: pactStatus,
  } = useReadContract({
    address: pactAddress,
    abi: pactEscrowAbi,
    functionName: "pactStatus",
  });

  const role: PactRole =
    connectedAddress &&
      client?.toLowerCase() === connectedAddress.toLowerCase()
      ? "Client"
      : "Freelancer";

  const counterparty =
    role === "Client"
      ? freelancer
      : client;

  const status = getStatusLabel(
    pactStatus !== undefined
      ? Number(pactStatus)
      : undefined
  );

  const formattedAmount =
    totalAmount !== undefined
      ? Number(formatUnits(totalAmount, 6)).toLocaleString()
      : "0";

  return (
    <Link
      href={`/pact/${pactAddress}`}
      className="grid grid-cols-[2fr_0.8fr_1fr_0.8fr_0.8fr] items-center px-5 py-4 transition hover:bg-[#161a1f]"
    >
      <div>
        <p className="text-sm font-medium text-white">
          {titleLoading
            ? "Loading..."
            : projectTitle || "Untitled Pact"}
        </p>

        <p className="mt-1 font-mono text-[11px] text-[#636b74]">
          {shortenAddress(pactAddress)}
        </p>
      </div>

      <span className="text-sm text-[#8e969f]">
        {role}
      </span>

      <span className="font-mono text-xs text-[#8e969f]">
        {shortenAddress(counterparty)}
      </span>

      <span className="text-sm text-white">
        {formattedAmount}

        <span className="ml-1 text-xs text-[#636b74]">
          mUSDC
        </span>
      </span>

      <div>
        <StatusBadge status={status} />
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const {
    address,
    isConnected,
  } = useAccount();

  const {
    data: pactCount,
    isLoading: isPactCountLoading,
  } = useReadContract({
    address: PACT_FACTORY_ADDRESS,
    abi: pactFactoryAbi,
    functionName: "getPactCount",
  });

  const {
    data: clientPacts,
    isLoading: clientPactsLoading,
  } = useReadContract({
    address: PACT_FACTORY_ADDRESS,
    abi: pactFactoryAbi,
    functionName: "getClientPacts",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const {
    data: freelancerPacts,
    isLoading: freelancerPactsLoading,
  } = useReadContract({
    address: PACT_FACTORY_ADDRESS,
    abi: pactFactoryAbi,
    functionName: "getFreelancerPacts",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const combinedPacts = [
    ...(clientPacts ?? []),
    ...(freelancerPacts ?? []),
  ];

  const uniquePacts = Array.from(
    new Set(
      combinedPacts.map((pact) =>
        pact.toLowerCase()
      )
    )
  ).map((lowercaseAddress) => {
    return combinedPacts.find(
      (pact) =>
        pact.toLowerCase() === lowercaseAddress
    ) as Address;
  });

  const realStats = [
    {
      label: "Total Pacts",
      value: isPactCountLoading
        ? "..."
        : pactCount?.toString() ?? "0",
      detail: "Created through PactFactory",
    },
    {
      label: "As Client",
      value: clientPactsLoading
        ? "..."
        : clientPacts?.length.toString() ?? "0",
      detail: isConnected
        ? "Pacts created by this wallet"
        : "Connect wallet to view",
    },
    {
      label: "As Freelancer",
      value: freelancerPactsLoading
        ? "..."
        : freelancerPacts?.length.toString() ?? "0",
      detail: isConnected
        ? "Pacts assigned to this wallet"
        : "Connect wallet to view",
    },
  ];

  return (
    <main className="px-8 py-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.03em] text-white">
              Overview
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#8e969f]">
              Manage milestone-based agreements,
              escrow balances, submissions, and payment
              releases.
            </p>
          </div>

          <Link
            href="/create"
            className="rounded-lg bg-[#c7ff1a] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d2ff47]"
          >
            Create Pact
          </Link>
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {realStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[#24282d] bg-[#111418] p-5"
            >
              <p className="text-sm text-[#8e969f]">
                {stat.label}
              </p>

              <div className="mt-5">
                <p className="text-[30px] font-semibold tracking-[-0.03em] text-white">
                  {stat.value}
                </p>
              </div>

              <p className="mt-2 text-xs text-[#636b74]">
                {stat.detail}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-white">
                Recent Pacts
              </h2>

              <p className="mt-1 text-sm text-[#636b74]">
                Agreements linked to your connected wallet.
              </p>
            </div>

            <span className="text-sm text-[#636b74]">
              {uniquePacts.length} agreements
            </span>
          </div>

          {!isConnected ? (
            <div className="rounded-xl border border-[#24282d] bg-[#111418] px-6 py-12 text-center">
              <p className="text-sm font-medium text-white">
                Connect your wallet
              </p>

              <p className="mt-2 text-sm text-[#636b74]">
                Your client and freelancer agreements will
                appear here.
              </p>
            </div>
          ) : clientPactsLoading ||
            freelancerPactsLoading ? (
            <div className="rounded-xl border border-[#24282d] bg-[#111418] px-6 py-12 text-center">
              <p className="text-sm text-[#8e969f]">
                Loading agreements...
              </p>
            </div>
          ) : uniquePacts.length === 0 ? (
            <div className="rounded-xl border border-[#24282d] bg-[#111418] px-6 py-12 text-center">
              <p className="text-sm font-medium text-white">
                No Pacts yet
              </p>

              <p className="mt-2 text-sm text-[#636b74]">
                Create your first agreement to get started.
              </p>

              <Link
                href="/create"
                className="mt-5 inline-flex rounded-lg bg-[#c7ff1a] px-4 py-2.5 text-sm font-semibold text-black"
              >
                Create Pact
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#24282d] bg-[#111418]">
              <div className="grid grid-cols-[2fr_0.8fr_1fr_0.8fr_0.8fr] border-b border-[#24282d] px-5 py-3 text-xs text-[#636b74]">
                <span>Project</span>
                <span>Role</span>
                <span>Counterparty</span>
                <span>Amount</span>
                <span>Status</span>
              </div>

              <div className="divide-y divide-[#24282d]">
                {uniquePacts.map((pactAddress) => (
                  <PactRow
                    key={pactAddress}
                    pactAddress={pactAddress}
                    connectedAddress={address}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[#24282d] bg-[#111418] p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-[#636b74]">
              How Pactra works
            </p>

            <h3 className="mt-4 max-w-sm text-lg font-medium leading-7 text-white">
              Funds stay locked until approved work is
              ready for payment.
            </h3>

            <p className="mt-3 max-w-lg text-sm leading-6 text-[#8e969f]">
              AI assists with milestone review. The client
              keeps final control over approval and payment
              release.
            </p>
          </div>

          <div className="rounded-xl border border-[#24282d] bg-[#111418] p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-[#636b74]">
              Network
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-white">
                  Arbitrum Sepolia
                </p>

                <p className="mt-1 text-sm text-[#636b74]">
                  Chain ID 421614
                </p>
              </div>

              <div className="rounded-full border border-[#43d17b]/20 bg-[#43d17b]/10 px-3 py-1.5 text-xs text-[#43d17b]">
                Live
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}