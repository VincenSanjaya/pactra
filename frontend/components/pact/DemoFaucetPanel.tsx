"use client";

type Props = {
    balance: string;
    isConnected: boolean;
    isBusy: boolean;
    onMint: () => void;
};

export default function DemoFaucetPanel({
    balance,
    isConnected,
    isBusy,
    onMint,
}: Props) {
    return (
        <section className="mt-6 rounded-xl border border-[#24282d] bg-[#111418] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-medium text-white">
                            Demo mUSDC
                        </h2>

                        <span className="rounded-full border border-[#c7ff1a]/20 bg-[#c7ff1a]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#c7ff1a]">
                            Testnet
                        </span>
                    </div>

                    <p className="mt-2 text-sm text-[#8e969f]">
                        Wallet balance:{" "}
                        <span className="font-medium text-white">
                            {balance} mUSDC
                        </span>
                    </p>

                    <p className="mt-1 text-xs text-[#636b74]">
                        Free demo tokens for testing Pactra on Arbitrum Sepolia.
                    </p>
                </div>

                <button
                    onClick={onMint}
                    disabled={!isConnected || isBusy}
                    className="shrink-0 rounded-lg border border-[#c7ff1a]/30 bg-[#c7ff1a]/10 px-4 py-2.5 text-sm font-medium text-[#c7ff1a] transition hover:bg-[#c7ff1a]/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {isBusy
                        ? "Minting..."
                        : "Get 1,000 mUSDC"}
                </button>
            </div>

            {!isConnected && (
                <p className="mt-3 text-xs text-[#ffb547]">
                    Connect your wallet to receive demo mUSDC.
                </p>
            )}
        </section>
    );
}