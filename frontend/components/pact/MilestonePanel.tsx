"use client";

import {
    formatUnits,
} from "viem";

import {
    milestoneStatusClass,
    milestoneStatusLabel,
} from "@/lib/pact-utils";

import AIReviewPanel from "@/components/pact/AIReviewPanel";

import type {
    AIReview,
} from "@/hooks/useAIReview";

type Milestone = readonly [
    string,
    string,
    bigint,
    string,
    number
];

type Props = {
    milestoneCount?: bigint;
    milestone?: Milestone;

    selectedMilestone: number;
    onSelectedMilestoneChange: (value: number) => void;

    isClient: boolean;
    isFreelancer: boolean;
    funded: boolean;

    isBusy: boolean;

    submissionURI: string;
    onSubmissionURIChange: (value: string) => void;
    onSubmitWork: () => void;

    onRequestRevision: () => void;
    onApproveMilestone: () => void;

    aiReview: AIReview | null;
    aiLoading: boolean;
    aiError: string;
    onRunAIReview: () => void;
};

export default function MilestonePanel({
    milestoneCount,
    milestone,

    selectedMilestone,
    onSelectedMilestoneChange,

    isClient,
    isFreelancer,
    funded,

    isBusy,

    submissionURI,
    onSubmissionURIChange,
    onSubmitWork,

    onRequestRevision,
    onApproveMilestone,

    aiReview,
    aiLoading,
    aiError,
    onRunAIReview,
}: Props) {
    const count =
        milestoneCount ??
        BigInt(0);

    return (
        <section className="mt-8 rounded-xl border border-[#24282d] bg-[#111418] p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium text-white">
                        Milestones
                    </h2>

                    <p className="mt-1 text-sm text-[#636b74]">
                        {count.toString()} total milestones
                    </p>
                </div>

                {count > BigInt(0) && (
                    <select
                        value={selectedMilestone}
                        onChange={(e) =>
                            onSelectedMilestoneChange(
                                Number(e.target.value)
                            )
                        }
                        className="rounded-lg border border-[#2a2f35] bg-[#0b0d0f] px-3 py-2 text-sm text-white outline-none"
                    >
                        {Array.from({
                            length: Number(count),
                        }).map((_, index) => (
                            <option
                                key={index}
                                value={index}
                            >
                                Milestone {index + 1}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {count === BigInt(0) ? (
                <div className="mt-6 rounded-lg border border-dashed border-[#2a2f35] px-5 py-10 text-center">
                    <p className="text-sm text-[#636b74]">
                        No milestones added yet.
                    </p>
                </div>
            ) : milestone ? (
                <div className="mt-6 rounded-xl border border-[#24282d] bg-[#0b0d0f] p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="font-medium text-white">
                                {milestone[0]}
                            </p>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8e969f]">
                                {milestone[1]}
                            </p>
                        </div>

                        <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${milestoneStatusClass(
                                Number(milestone[4])
                            )}`}
                        >
                            {milestoneStatusLabel(
                                Number(milestone[4])
                            )}
                        </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-[#24282d] pt-4">
                        <p className="text-sm text-[#636b74]">
                            Milestone payment
                        </p>

                        <p className="font-medium text-white">
                            {formatUnits(
                                milestone[2],
                                6
                            )}{" "}
                            mUSDC
                        </p>
                    </div>

                    {milestone[3] && (
                        <div className="mt-5 rounded-lg border border-[#24282d] bg-[#111418] p-4">
                            <p className="text-xs uppercase tracking-[0.1em] text-[#636b74]">
                                Submission
                            </p>

                            <p className="mt-2 break-all font-mono text-xs leading-5 text-[#8e969f]">
                                {milestone[3]}
                            </p>
                        </div>
                    )}

                    {isFreelancer &&
                        funded &&
                        (Number(milestone[4]) === 0 ||
                            Number(milestone[4]) === 2) && (
                            <div className="mt-6">
                                <p className="mb-2 text-sm text-[#8e969f]">
                                    Deliverable
                                </p>

                                <div className="flex gap-3">
                                    <input
                                        value={submissionURI}
                                        onChange={(e) =>
                                            onSubmissionURIChange(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Describe the work, paste an IPFS URI, or delivery URL"
                                        disabled={isBusy}
                                        className="flex-1 rounded-lg border border-[#2a2f35] bg-[#111418] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#4d555e] focus:border-[#c7ff1a]/50 disabled:opacity-50"
                                    />

                                    <button
                                        onClick={onSubmitWork}
                                        disabled={isBusy}
                                        className="rounded-lg bg-[#c7ff1a] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d2ff47] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isBusy
                                            ? "Submitting..."
                                            : "Submit Work"}
                                    </button>
                                </div>
                            </div>
                        )}

                    {isClient &&
                        Number(milestone[4]) === 1 && (
                            <div className="mt-6 border-t border-[#24282d] pt-5">
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        Work submitted
                                    </p>

                                    <p className="mt-1 text-xs text-[#636b74]">
                                        Review the deliverable before releasing payment.
                                    </p>
                                </div>

                                <AIReviewPanel
                                    review={aiReview}
                                    loading={aiLoading}
                                    error={aiError}
                                    onReview={onRunAIReview}
                                />

                                <div className="mt-5 flex items-center justify-end gap-3">
                                    <button
                                        onClick={onRequestRevision}
                                        disabled={isBusy}
                                        className="rounded-lg border border-[#2a2f35] bg-[#161a1f] px-4 py-2.5 text-sm text-white transition hover:bg-[#1c2127] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isBusy
                                            ? "Requesting..."
                                            : "Request Revision"}
                                    </button>

                                    <button
                                        onClick={onApproveMilestone}
                                        disabled={isBusy}
                                        className="rounded-lg bg-[#c7ff1a] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d2ff47] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isBusy
                                            ? "Releasing..."
                                            : "Approve & Release"}
                                    </button>
                                </div>
                            </div>
                        )}
                </div>
            ) : (
                <p className="mt-6 text-sm text-[#636b74]">
                    Loading milestone...
                </p>
            )}
        </section>
    );
}