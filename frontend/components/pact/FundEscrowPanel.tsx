"use client";

type Props = {
    allowance: string;
    hasEnoughAllowance: boolean;
    isBusy: boolean;

    onApprove: () => void;
    onFund: () => void;
};

export default function FundEscrowPanel({
    allowance,
    hasEnoughAllowance,
    isBusy,
    onApprove,
    onFund,
}: Props) {
    return (
        <section className="mt-6 rounded-xl border border-[#24282d] bg-[#111418] p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-medium text-white">
                        Fund escrow
                    </h2>

                    <p className="mt-1 text-sm text-[#636b74]">
                        Approve the full Pact amount, then lock funds.
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xs text-[#636b74]">
                        Current allowance
                    </p>

                    <p className="mt-1 text-sm text-white">
                        {allowance} mUSDC
                    </p>
                </div>
            </div>

            <div className="mt-5 flex gap-3">
                {!hasEnoughAllowance && (
                    <button
                        onClick={onApprove}
                        disabled={isBusy}
                        className="rounded-lg border border-[#2a2f35] bg-[#161a1f] px-4 py-2.5 text-sm text-white transition hover:bg-[#1c2127] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isBusy ? "Approving..." : "Approve mUSDC"}
                    </button>
                )}

                <button
                    onClick={onFund}
                    disabled={
                        isBusy ||
                        !hasEnoughAllowance
                    }
                    className="rounded-lg bg-[#c7ff1a] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d2ff47] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isBusy ? "Funding..." : "Fund Escrow"}
                </button>
            </div>

            {!hasEnoughAllowance && (
                <p className="mt-3 text-xs text-[#636b74]">
                    Approve mUSDC before funding the escrow.
                </p>
            )}
        </section>
    );
}