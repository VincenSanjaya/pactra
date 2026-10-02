"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
    pactStatusClass,
    pactStatusLabel,
    shortAddress,
} from "@/lib/pact-utils";

type Address = `0x${string}`;

type Filter =
    | "all"
    | "client"
    | "freelancer";

export default function MyPactsPage() {
    const {
        address: connectedAddress,
        isConnected,
    } = useAccount();

    const [
        filter,
        setFilter,
    ] =
        useState<Filter>("all");

    const {
        data: clientPacts,
        isLoading: loadingClientPacts,
    } = useReadContract({
        address:
            PACT_FACTORY_ADDRESS,

        abi:
            pactFactoryAbi,

        functionName:
            "getClientPacts",

        args:
            connectedAddress
                ? [connectedAddress]
                : undefined,

        query: {
            enabled:
                !!connectedAddress,
        },
    });

    const {
        data: freelancerPacts,
        isLoading: loadingFreelancerPacts,
    } = useReadContract({
        address:
            PACT_FACTORY_ADDRESS,

        abi:
            pactFactoryAbi,

        functionName:
            "getFreelancerPacts",

        args:
            connectedAddress
                ? [connectedAddress]
                : undefined,

        query: {
            enabled:
                !!connectedAddress,
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

    const clientSet =
        useMemo(() => {
            return new Set(
                (
                    (clientPacts ??
                        []) as readonly Address[]
                ).map(
                    (address) =>
                        address.toLowerCase()
                )
            );
        }, [
            clientPacts,
        ]);

    const freelancerSet =
        useMemo(() => {
            return new Set(
                (
                    (freelancerPacts ??
                        []) as readonly Address[]
                ).map(
                    (address) =>
                        address.toLowerCase()
                )
            );
        }, [
            freelancerPacts,
        ]);

    const filteredPacts =
        useMemo(() => {
            if (
                filter ===
                "client"
            ) {
                return allPacts.filter(
                    (address) =>
                        clientSet.has(
                            address.toLowerCase()
                        )
                );
            }

            if (
                filter ===
                "freelancer"
            ) {
                return allPacts.filter(
                    (address) =>
                        freelancerSet.has(
                            address.toLowerCase()
                        )
                );
            }

            return allPacts;
        }, [
            filter,
            allPacts,
            clientSet,
            freelancerSet,
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
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#636b74]">
                            Agreements
                        </p>

                        <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-white">
                            My Pacts
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8e969f]">
                            View agreements where your connected wallet is the client or freelancer.
                        </p>
                    </div>

                    <Link
                        href="/create"
                        className="rounded-lg bg-[#c7ff1a] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d2ff47]"
                    >
                        Create Pact
                    </Link>
                </div>

                {!isConnected ? (
                    <div className="mt-8 rounded-xl border border-[#24282d] bg-[#111418] px-6 py-16 text-center">
                        <p className="text-base font-medium text-white">
                            Connect your wallet
                        </p>

                        <p className="mt-2 text-sm text-[#636b74]">
                            Your client and freelancer agreements will appear here.
                        </p>
                    </div>
                ) : (
                    <>
                        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                            <StatCard
                                label="All Pacts"
                                value={
                                    allPacts.length
                                }
                            />

                            <StatCard
                                label="As Client"
                                value={
                                    clientSet.size
                                }
                            />

                            <StatCard
                                label="As Freelancer"
                                value={
                                    freelancerSet.size
                                }
                            />
                        </section>

                        <div className="mt-8 flex items-center justify-between gap-4">
                            <div className="flex rounded-lg border border-[#24282d] bg-[#111418] p-1">
                                <FilterButton
                                    active={
                                        filter ===
                                        "all"
                                    }
                                    onClick={() =>
                                        setFilter(
                                            "all"
                                        )
                                    }
                                >
                                    All
                                </FilterButton>

                                <FilterButton
                                    active={
                                        filter ===
                                        "client"
                                    }
                                    onClick={() =>
                                        setFilter(
                                            "client"
                                        )
                                    }
                                >
                                    As Client
                                </FilterButton>

                                <FilterButton
                                    active={
                                        filter ===
                                        "freelancer"
                                    }
                                    onClick={() =>
                                        setFilter(
                                            "freelancer"
                                        )
                                    }
                                >
                                    As Freelancer
                                </FilterButton>
                            </div>

                            <p className="text-xs text-[#636b74]">
                                {
                                    filteredPacts.length
                                }{" "}
                                agreements
                            </p>
                        </div>

                        <section className="mt-4 overflow-hidden rounded-xl border border-[#24282d] bg-[#111418]">
                            {isLoading ? (
                                <div className="px-6 py-16 text-center">
                                    <p className="text-sm text-[#636b74]">
                                        Loading your Pacts...
                                    </p>
                                </div>
                            ) : filteredPacts.length ===
                                0 ? (
                                <div className="px-6 py-16 text-center">
                                    <p className="text-base font-medium text-white">
                                        No Pacts found
                                    </p>

                                    <p className="mt-2 text-sm text-[#636b74]">
                                        No agreements match the selected filter.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-[2fr_1fr_1.4fr_1fr_1fr_40px] gap-4 border-b border-[#24282d] px-5 py-3 text-xs text-[#636b74]">
                                        <span>
                                            Project
                                        </span>

                                        <span>
                                            Role
                                        </span>

                                        <span>
                                            Counterparty
                                        </span>

                                        <span>
                                            Amount
                                        </span>

                                        <span>
                                            Status
                                        </span>

                                        <span />
                                    </div>

                                    {filteredPacts.map(
                                        (
                                            pactAddress
                                        ) => (
                                            <PactRow
                                                key={
                                                    pactAddress
                                                }
                                                pactAddress={
                                                    pactAddress
                                                }
                                                connectedAddress={
                                                    connectedAddress
                                                }
                                            />
                                        )
                                    )}
                                </>
                            )}
                        </section>
                    </>
                )}
            </div>
        </main>
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
    } = useReadContract({
        address:
            pactAddress,

        abi:
            pactEscrowAbi,

        functionName:
            "projectTitle",
    });

    const {
        data: client,
    } = useReadContract({
        address:
            pactAddress,

        abi:
            pactEscrowAbi,

        functionName:
            "client",
    });

    const {
        data: freelancer,
    } = useReadContract({
        address:
            pactAddress,

        abi:
            pactEscrowAbi,

        functionName:
            "freelancer",
    });

    const {
        data: totalAmount,
    } = useReadContract({
        address:
            pactAddress,

        abi:
            pactEscrowAbi,

        functionName:
            "totalAmount",
    });

    const {
        data: pactStatus,
    } = useReadContract({
        address:
            pactAddress,

        abi:
            pactEscrowAbi,

        functionName:
            "pactStatus",
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

    const amount =
        totalAmount !== undefined
            ? formatUnits(
                totalAmount,
                6
            )
            : "0";

    const statusNumber =
        pactStatus !==
            undefined
            ? Number(
                pactStatus
            )
            : undefined;

    return (
        <Link
            href={`/pact/${pactAddress}`}
            className="grid grid-cols-[2fr_1fr_1.4fr_1fr_1fr_40px] items-center gap-4 border-b border-[#24282d] px-5 py-5 transition last:border-b-0 hover:bg-[#161a1f]"
        >
            <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                    {projectTitle ||
                        "Untitled Pact"}
                </p>

                <p className="mt-1 font-mono text-xs text-[#636b74]">
                    {shortAddress(
                        pactAddress
                    )}
                </p>
            </div>

            <div>
                <span className="text-sm text-[#8e969f]">
                    {role}
                </span>
            </div>

            <div className="min-w-0">
                <p className="truncate font-mono text-xs text-[#8e969f]">
                    {shortAddress(
                        counterparty
                    )}
                </p>
            </div>

            <div>
                <span className="text-sm font-medium text-white">
                    {amount}
                </span>

                <span className="ml-1 text-xs text-[#636b74]">
                    mUSDC
                </span>
            </div>

            <div>
                <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${pactStatusClass(
                        statusNumber
                    )}`}
                >
                    {pactStatusLabel(
                        statusNumber
                    )}
                </span>
            </div>

            <div className="text-right text-[#636b74]">
                →
            </div>
        </Link>
    );
}

function StatCard({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-xl border border-[#24282d] bg-[#111418] p-5">
            <p className="text-sm text-[#8e969f]">
                {label}
            </p>

            <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">
                {value}
            </p>
        </div>
    );
}

function FilterButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={
                onClick
            }
            className={`rounded-md px-4 py-2 text-sm transition ${active
                ? "bg-[#24282d] text-white"
                : "text-[#8e969f] hover:text-white"
                }`}
        >
            {children}
        </button>
    );
}