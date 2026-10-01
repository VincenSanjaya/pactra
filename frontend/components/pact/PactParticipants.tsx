"use client";

type Props = {
    client?: string;
    freelancer?: string;
    onCopy: (value?: string) => void;
};

export default function PactParticipants({
    client,
    freelancer,
    onCopy,
}: Props) {
    return (
        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <AddressCard
                label="Client"
                address={client}
                onCopy={onCopy}
            />

            <AddressCard
                label="Freelancer"
                address={freelancer}
                onCopy={onCopy}
            />
        </section>
    );
}

function AddressCard({
    label,
    address,
    onCopy,
}: {
    label: string;
    address?: string;
    onCopy: (value?: string) => void;
}) {
    return (
        <div className="rounded-xl border border-[#24282d] bg-[#111418] p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-[#636b74]">
                {label}
            </p>

            <div className="mt-3 flex items-center justify-between gap-4">
                <p className="truncate font-mono text-sm text-white">
                    {address || "—"}
                </p>

                <button
                    onClick={() => onCopy(address)}
                    className="shrink-0 text-xs text-[#8e969f] transition hover:text-white"
                >
                    Copy
                </button>
            </div>
        </div>
    );
}