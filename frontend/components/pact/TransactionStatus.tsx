"use client";

import {
    ARBISCAN_BASE_URL,
} from "@/lib/pact-utils";

type Props = {
    successMessage: string;
    writeError: Error | null;
    writeHash?: `0x${string}`;
};

export default function TransactionStatus({
    successMessage,
    writeError,
    writeHash,
}: Props) {
    return (
        <>
            {successMessage && (
                <div className="mb-6 rounded-xl border border-[#43d17b]/20 bg-[#43d17b]/10 px-4 py-3 text-sm text-[#43d17b]">
                    {successMessage}
                </div>
            )}

            {writeError && (
                <div className="mb-6 rounded-xl border border-[#ff5c5c]/20 bg-[#ff5c5c]/10 px-4 py-3 text-sm text-[#ff8585]">
                    Transaction failed or was rejected.
                </div>
            )}

            {writeHash && (
                <section className="mt-6 rounded-xl border border-[#24282d] bg-[#111418] p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm text-white">
                                Transaction submitted
                            </p>

                            <p className="mt-1 break-all font-mono text-xs text-[#636b74]">
                                {writeHash}
                            </p>
                        </div>

                        <a
                            href={`${ARBISCAN_BASE_URL}/tx/${writeHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="shrink-0 text-xs text-[#c7ff1a] transition hover:underline"
                        >
                            View transaction ↗
                        </a>
                    </div>
                </section>
            )}
        </>
    );
}