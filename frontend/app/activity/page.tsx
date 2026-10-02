"use client";

import Link from "next/link";
import { useMemo } from "react";

import {
    formatUnits,
} from "viem";

import {
    useAccount,
    useReadContract,
} from "wagmi";

import {
    PACT_FACTORY_ADDRESS,
    pactFactoryAbi,
    pactEscrowAbi,
} from "@/lib/contracts";

import {
    shortAddress,
} from "@/lib/pact-utils";

type Address = `0x${string}`;

export default function ActivityPage() {
    const {
        address: connectedAddress,
        isConnected,
    } = useAccount();

    const {
        data: clientPacts,
        isLoading: loadingClientPacts,
    } = useReadContract({
        address: PACT_FACTORY_ADDRESS,
        abi: pactFactoryAbi,
        functionName: "getClientPacts",

        args: connectedAddress
            ? [connectedAddress]
            : undefined,

        query: {
            enabled: !!connectedAddress,
        },
    });

    const {
        data: freelancerPacts,
        isLoading: loadingFreelancerPacts,
    } = useReadContract({
        address: PACT_FACTORY_ADDRESS,
        abi: pactFactoryAbi,
        functionName: "getFreelancerPacts",

        args: connectedAddress
            ? [connectedAddress]
            : undefined,

        query: {
            enabled: !!connectedAddress,
        },
    });

    const allPacts =
        useMemo(() => {
            const client =
                (clientPacts ??
                    []) as readonly Address[];

            const freelancer =
                (freelancerPacts ??
                    []) as readonly Address[];

            const combined = [
                ...client,
                ...freelancer,
            ];

            return Array.from(
                new Set(
                    combined.map(
                        (address) =>
                            address.toLowerCase()
                    )
                )
            ).map(
                (address) =>
                    address as Address
            );
        }, [
            clientPacts,
            freelancerPacts,
        ]);

    const isLoading =
        loadingClientPacts ||
        loadingFreelancerPacts;

    return (
        <main className="px-8 py-10">
            <div className="mx-auto max-w-[1180px]">
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-[#8e969f] transition hover:text-white"
                >
                    <span>←</span>
                    Back to Dashboard
                </Link>

                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#636b74]">
                        Onchain activity
                    </p>

                    <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-white">
                        Activity
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8e969f]">
                        Track the current lifecycle state of Pacts linked to your connected
                        wallet.
                    </p>
                </div>

                {!isConnected ? (
                    <section className="mt-8 rounded-xl border border-[#24282d] bg-[#111418] px-6 py-16 text-center">
                        <p className="text-base font-medium text-white">
                            Connect your wallet
                        </p>

                        <p className="mt-2 text-sm text-[#636b74]">
                            Pact activity linked to your wallet will appear here.
                        </p>
                    </section>
                ) : isLoading ? (
                    <section className="mt-8 rounded-xl border border-[#24282d] bg-[#111418] px-6 py-16 text-center">
                        <p className="text-sm text-[#636b74]">
                            Loading activity...
                        </p>
                    </section>
                ) : allPacts.length === 0 ? (
                    <section className="mt-8 rounded-xl border border-[#24282d] bg-[#111418] px-6 py-16 text-center">
                        <p className="text-base font-medium text-white">
                            No activity yet
                        </p>

                        <p className="mt-2 text-sm text-[#636b74]">
                            Create or join a Pact to start seeing activity.
                        </p>

                        <Link
                            href="/create"
                            className="mt-5 inline-flex rounded-lg bg-[#c7ff1a] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d2ff47]"
                        >
                            Create Pact
                        </Link>
                    </section>
                ) : (
                    <>
                        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                            <SummaryCard
                                label="Tracked Pacts"
                                value={allPacts.length.toString()}
                            />

                            <SummaryCard
                                label="Network"
                                value="Arbitrum Sepolia"
                            />

                            <SummaryCard
                                label="Activity Source"
                                value="Onchain State"
                            />
                        </section>

                        <section className="mt-8">
                            <div className="mb-4 flex items-end justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-medium text-white">
                                        Pact activity
                                    </h2>

                                    <p className="mt-1 text-sm text-[#636b74]">
                                        Latest state-derived activity for your agreements.
                                    </p>
                                </div>

                                <p className="text-xs text-[#636b74]">
                                    {allPacts.length} Pacts
                                </p>
                            </div>

                            <div className="space-y-4">
                                {allPacts.map(
                                    (pactAddress) => (
                                        <PactActivity
                                            key={pactAddress}
                                            pactAddress={pactAddress}
                                            connectedAddress={connectedAddress}
                                        />
                                    )
                                )}
                            </div>
                        </section>

                        <div className="mt-6 rounded-xl border border-[#24282d] bg-[#111418] px-5 py-4">
                            <p className="text-xs leading-5 text-[#636b74]">
                                Activity is currently derived from live contract state. A future
                                production version can index contract events to provide exact
                                timestamps and complete historical logs.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

function PactActivity({
    pactAddress,
    connectedAddress,
}: {
    pactAddress: Address;
    connectedAddress?: Address;
}) {
    const {
        data: projectTitle,
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
        data: releasedAmount,
    } = useReadContract({
        address: pactAddress,
        abi: pactEscrowAbi,
        functionName: "releasedAmount",
    });

    const {
        data: funded,
    } = useReadContract({
        address: pactAddress,
        abi: pactEscrowAbi,
        functionName: "funded",
    });

    const {
        data: pactStatus,
    } = useReadContract({
        address: pactAddress,
        abi: pactEscrowAbi,
        functionName: "pactStatus",
    });

    const {
        data: milestoneCount,
    } = useReadContract({
        address: pactAddress,
        abi: pactEscrowAbi,
        functionName: "getMilestoneCount",
    });

    const isClient =
        !!connectedAddress &&
        !!client &&
        connectedAddress.toLowerCase() ===
        client.toLowerCase();

    const role =
        isClient
            ? "Client"
            : "Freelancer";

    const counterparty =
        isClient
            ? freelancer
            : client;

    const total =
        totalAmount !== undefined
            ? formatUnits(
                totalAmount,
                6
            )
            : "0";

    const released =
        releasedAmount !== undefined
            ? formatUnits(
                releasedAmount,
                6
            )
            : "0";

    const status =
        pactStatus !== undefined
            ? Number(
                pactStatus
            )
            : undefined;

    return (
        <article className="overflow-hidden rounded-xl border border-[#24282d] bg-[#111418]">
            <div className="flex flex-col gap-4 border-b border-[#24282d] px-5 py-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h3 className="font-medium text-white">
                            {projectTitle ||
                                "Untitled Pact"}
                        </h3>

                        <span className="rounded-full border border-[#2a2f35] bg-[#161a1f] px-2.5 py-1 text-[11px] text-[#8e969f]">
                            {role}
                        </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="font-mono text-xs text-[#636b74]">
                            {shortAddress(
                                pactAddress
                            )}
                        </span>

                        <span className="text-xs text-[#636b74]">
                            Counterparty{" "}
                            {shortAddress(
                                counterparty
                            )}
                        </span>
                    </div>
                </div>

                <Link
                    href={`/pact/${pactAddress}`}
                    className="text-sm text-[#c7ff1a] transition hover:underline"
                >
                    View Pact →
                </Link>
            </div>

            <div className="divide-y divide-[#24282d]">
                <ActivityRow
                    icon="＋"
                    title="Pact created"
                    description={`${milestoneCount?.toString() ?? "0"} milestone${Number(
                        milestoneCount ?? BigInt(0)
                    ) === 1
                            ? ""
                            : "s"
                        } configured`}
                    status="Created"
                />

                {funded && (
                    <ActivityRow
                        icon="◆"
                        title="Escrow funded"
                        description={`${total} mUSDC locked in the Pact`}
                        status="Funded"
                    />
                )}

                {releasedAmount !== undefined &&
                    releasedAmount >
                    BigInt(0) && (
                        <ActivityRow
                            icon="↗"
                            title="Payment released"
                            description={`${released} mUSDC released to freelancer`}
                            status="Released"
                        />
                    )}

                {status === 1 && (
                    <ActivityRow
                        icon="✓"
                        title="Pact completed"
                        description="All configured milestone payments have been released."
                        status="Completed"
                    />
                )}

                {status === 2 && (
                    <ActivityRow
                        icon="×"
                        title="Pact cancelled"
                        description="This Pact is no longer active."
                        status="Cancelled"
                    />
                )}
            </div>
        </article>
    );
}

function ActivityRow({
    icon,
    title,
    description,
    status,
}: {
    icon: string;
    title: string;
    description: string;
    status: string;
}) {
    return (
        <div className="flex items-center gap-4 px-5 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#2a2f35] bg-[#0b0d0f] text-sm text-[#c7ff1a]">
                {icon}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">
                    {title}
                </p>

                <p className="mt-1 text-xs leading-5 text-[#636b74]">
                    {description}
                </p>
            </div>

            <span className="shrink-0 rounded-full border border-[#2a2f35] bg-[#161a1f] px-2.5 py-1 text-[11px] text-[#8e969f]">
                {status}
            </span>
        </div>
    );
}

function SummaryCard({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-[#24282d] bg-[#111418] p-5">
            <p className="text-sm text-[#8e969f]">
                {label}
            </p>

            <p className="mt-4 text-xl font-semibold tracking-[-0.02em] text-white">
                {value}
            </p>
        </div>
    );
}