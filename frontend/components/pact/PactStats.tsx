"use client";

type Props = {
    status: string;
    total: string;
    released: string;
    escrowBalance: string;
    funded: boolean;
};

export default function PactStats({
    status,
    total,
    released,
    escrowBalance,
    funded,
}: Props) {
    return (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <InfoCard
                label="Status"
                value={status}
            />

            <InfoCard
                label="Total"
                value={`${total} mUSDC`}
            />

            <InfoCard
                label="Released"
                value={`${released} mUSDC`}
            />

            <InfoCard
                label="Escrow Balance"
                value={`${escrowBalance} mUSDC`}
            />

            <InfoCard
                label="Funded"
                value={funded ? "Yes" : "No"}
            />
        </section>
    );
}

function InfoCard({
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