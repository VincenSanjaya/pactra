"use client";

type Props = {
    title: string;
    requirement: string;
    amount: string;

    isBusy: boolean;

    onTitleChange: (value: string) => void;
    onRequirementChange: (value: string) => void;
    onAmountChange: (value: string) => void;

    onSubmit: () => void;
};

export default function AddMilestoneForm({
    title,
    requirement,
    amount,
    isBusy,
    onTitleChange,
    onRequirementChange,
    onAmountChange,
    onSubmit,
}: Props) {
    return (
        <section className="mt-8 rounded-xl border border-[#24282d] bg-[#111418] p-6">
            <div>
                <h2 className="text-lg font-medium text-white">
                    Add milestone
                </h2>

                <p className="mt-1 text-sm text-[#636b74]">
                    Define work and payment before funding the escrow.
                </p>
            </div>

            <div className="mt-5 grid gap-4">
                <input
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="Milestone title"
                    disabled={isBusy}
                    className="rounded-lg border border-[#2a2f35] bg-[#0b0d0f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#4d555e] focus:border-[#c7ff1a]/50 disabled:opacity-50"
                />

                <textarea
                    value={requirement}
                    onChange={(e) => onRequirementChange(e.target.value)}
                    placeholder="Milestone requirement"
                    rows={4}
                    disabled={isBusy}
                    className="resize-none rounded-lg border border-[#2a2f35] bg-[#0b0d0f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#4d555e] focus:border-[#c7ff1a]/50 disabled:opacity-50"
                />

                <input
                    value={amount}
                    onChange={(e) => onAmountChange(e.target.value)}
                    placeholder="Amount in mUSDC"
                    inputMode="decimal"
                    disabled={isBusy}
                    className="rounded-lg border border-[#2a2f35] bg-[#0b0d0f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#4d555e] focus:border-[#c7ff1a]/50 disabled:opacity-50"
                />

                <button
                    onClick={onSubmit}
                    disabled={isBusy}
                    className="w-fit rounded-lg bg-[#c7ff1a] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d2ff47] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isBusy ? "Adding..." : "Add Milestone"}
                </button>
            </div>
        </section>
    );
}