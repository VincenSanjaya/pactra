"use client";

import {
    ARBISCAN_BASE_URL,
    pactStatusClass,
    pactStatusLabel,
    shortAddress,
} from "@/lib/pact-utils";

type Props = {
    pactAddress: string;
    projectTitle?: string;
    projectDescription?: string;
    pactStatus?: number;
    roleLabel?: string;
    onCopy: (value?: string) => void;
};

export default function PactHeader({
    pactAddress,
    projectTitle,
    projectDescription,
    pactStatus,
    roleLabel,
    onCopy,
}: Props) {
    return (
        <div className="mb-8 flex items-start justify-between gap-6">
            <div>
                <div className="flex items-center gap-3">
                    <p className="font-mono text-xs text-[#636b74]">
                        {shortAddress(pactAddress)}
                    </p>

                    <button
                        onClick={() => onCopy(pactAddress)}
                        className="text-xs text-[#8e969f] transition hover:text-white"
                    >
                        Copy
                    </button>

                    <a
                        href={`${ARBISCAN_BASE_URL}/address/${pactAddress}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#8e969f] transition hover:text-white"
                    >
                        Arbiscan ↗
                    </a>
                </div>

                <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.03em] text-white">
                    {projectTitle || "Pact"}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8e969f]">
                    {projectDescription || "No project description."}
                </p>
            </div>

            <div className="flex flex-col items-end gap-2">
                <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${pactStatusClass(
                        pactStatus
                    )}`}
                >
                    {pactStatusLabel(pactStatus)}
                </span>

                {roleLabel && (
                    <span className="text-xs text-[#636b74]">
                        {roleLabel}
                    </span>
                )}
            </div>
        </div>
    );
}