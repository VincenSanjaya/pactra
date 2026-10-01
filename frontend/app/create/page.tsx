"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAddress } from "viem";
import {
    useAccount,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";

import {
    MOCK_USDC_ADDRESS,
    PACT_FACTORY_ADDRESS,
    pactFactoryAbi,
} from "@/lib/contracts";

export default function CreatePactPage() {
    const router = useRouter();

    const { isConnected } = useAccount();

    const [projectTitle, setProjectTitle] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [freelancer, setFreelancer] = useState("");

    const [formError, setFormError] = useState("");

    const {
        data: hash,
        writeContract,
        isPending,
        error,
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess,
    } = useWaitForTransactionReceipt({
        hash,
    });

    function handleCreatePact() {
        setFormError("");

        if (!isConnected) {
            setFormError("Connect your wallet first.");
            return;
        }

        if (!projectTitle.trim()) {
            setFormError("Project title is required.");
            return;
        }

        if (!projectDescription.trim()) {
            setFormError("Project description is required.");
            return;
        }

        if (!isAddress(freelancer)) {
            setFormError("Enter a valid freelancer wallet address.");
            return;
        }

        writeContract({
            address: PACT_FACTORY_ADDRESS,
            abi: pactFactoryAbi,
            functionName: "createPact",
            args: [
                freelancer,
                MOCK_USDC_ADDRESS,
                projectTitle,
                projectDescription,
            ],
        });
    }

    useEffect(() => {
        if (!isSuccess) return;

        const timer = setTimeout(() => {
            router.push("/");
        }, 1500);

        return () => clearTimeout(timer);
    }, [isSuccess, router]);

    return (
        <main className="px-8 py-10">
            <div className="mx-auto max-w-[900px]">
                <div className="mb-10">
                    <p className="text-sm text-[#636b74]">
                        New agreement
                    </p>

                    <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-white">
                        Create Pact
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#8e969f]">
                        Define the project and assign a freelancer.
                        Milestones and funding will be configured after
                        the Pact is created.
                    </p>
                </div>

                <div className="grid gap-6">
                    <section className="rounded-xl border border-[#24282d] bg-[#111418] p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-medium text-white">
                                Project details
                            </h2>

                            <span className="text-xs text-[#636b74]">
                                Required
                            </span>
                        </div>

                        <div className="mt-6 space-y-5">
                            <div>
                                <label className="mb-2 block text-sm text-[#8e969f]">
                                    Project title
                                </label>

                                <input
                                    value={projectTitle}
                                    onChange={(e) =>
                                        setProjectTitle(e.target.value)
                                    }
                                    placeholder="Build Pactra landing page"
                                    className="w-full rounded-lg border border-[#2a2f35] bg-[#0b0d0f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#4d555e] focus:border-[#c7ff1a]/50"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-[#8e969f]">
                                    Project description
                                </label>

                                <textarea
                                    value={projectDescription}
                                    onChange={(e) =>
                                        setProjectDescription(e.target.value)
                                    }
                                    placeholder="Describe the work and expected outcome."
                                    rows={5}
                                    className="w-full resize-none rounded-lg border border-[#2a2f35] bg-[#0b0d0f] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-[#4d555e] focus:border-[#c7ff1a]/50"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-[#24282d] bg-[#111418] p-6">
                        <h2 className="text-base font-medium text-white">
                            Freelancer
                        </h2>

                        <p className="mt-1 text-sm text-[#636b74]">
                            This wallet will be authorized to submit work.
                        </p>

                        <div className="mt-6">
                            <label className="mb-2 block text-sm text-[#8e969f]">
                                Wallet address
                            </label>

                            <input
                                value={freelancer}
                                onChange={(e) =>
                                    setFreelancer(e.target.value)
                                }
                                placeholder="0x..."
                                className="w-full rounded-lg border border-[#2a2f35] bg-[#0b0d0f] px-4 py-3 font-mono text-sm text-white outline-none transition placeholder:text-[#4d555e] focus:border-[#c7ff1a]/50"
                            />
                        </div>
                    </section>

                    <section className="rounded-xl border border-[#24282d] bg-[#0e1114] p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-white">
                                    Payment network
                                </p>

                                <p className="mt-1 text-xs text-[#636b74]">
                                    Arbitrum Sepolia · Mock USDC
                                </p>
                            </div>

                            <span className="rounded-full border border-[#43d17b]/20 bg-[#43d17b]/10 px-3 py-1.5 text-xs text-[#43d17b]">
                                Testnet
                            </span>
                        </div>
                    </section>

                    {(formError || error) && (
                        <div className="rounded-lg border border-[#ff5c5c]/20 bg-[#ff5c5c]/10 px-4 py-3 text-sm text-[#ff8585]">
                            {formError || error?.message}
                        </div>
                    )}

                    {hash && !isSuccess && (
                        <div className="rounded-lg border border-[#24282d] bg-[#111418] px-4 py-3">
                            <p className="text-sm text-white">
                                Transaction submitted
                            </p>

                            <p className="mt-1 break-all font-mono text-xs text-[#636b74]">
                                {hash}
                            </p>
                        </div>
                    )}

                    {isSuccess && (
                        <div className="rounded-lg border border-[#43d17b]/20 bg-[#43d17b]/10 px-4 py-3">
                            <p className="text-sm font-medium text-[#43d17b]">
                                Pact created successfully.
                            </p>

                            <p className="mt-1 text-xs text-[#8e969f]">
                                Returning to your dashboard...
                            </p>
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t border-[#24282d] pt-6">
                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="text-sm text-[#8e969f] transition hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={isPending || isConfirming}
                            onClick={handleCreatePact}
                            className="min-w-[130px] rounded-lg bg-[#c7ff1a] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#d4ff4a] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isPending
                                ? "Confirm in wallet"
                                : isConfirming
                                    ? "Creating..."
                                    : "Create Pact"}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}