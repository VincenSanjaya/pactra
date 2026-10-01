"use client";

import type {
    AIRecommendation,
    AIReview,
} from "@/hooks/useAIReview";

type Props = {
    review: AIReview | null;
    loading: boolean;
    error: string;

    onReview: () => void;
};

export default function AIReviewPanel({
    review,
    loading,
    error,
    onReview,
}: Props) {
    return (
        <div className="mt-6 border-t border-[#24282d] pt-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-white">
                        AI Review
                    </p>

                    <p className="mt-1 text-xs text-[#636b74]">
                        AI provides review evidence. You make the final decision.
                    </p>
                </div>

                <button
                    onClick={onReview}
                    disabled={loading}
                    className="rounded-lg border border-[#2a2f35] bg-[#161a1f] px-4 py-2.5 text-sm text-white transition hover:bg-[#1c2127] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Reviewing..."
                        : review
                            ? "Run Again"
                            : "Run AI Review"}
                </button>
            </div>

            {error && (
                <div className="mt-4 rounded-lg border border-[#ff5c5c]/20 bg-[#ff5c5c]/10 px-4 py-3 text-sm text-[#ff8585]">
                    {error}
                </div>
            )}

            {review && (
                <div className="mt-5 rounded-xl border border-[#24282d] bg-[#111418] p-5">
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <p className="text-xs uppercase tracking-[0.1em] text-[#636b74]">
                                Requirement match
                            </p>

                            <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">
                                {review.requirementMatch}%
                            </p>
                        </div>

                        <AIRecommendationBadge
                            recommendation={review.recommendation}
                        />
                    </div>

                    <div className="mt-5 border-t border-[#24282d] pt-5">
                        <p className="text-sm font-medium text-white">
                            Review summary
                        </p>

                        <p className="mt-2 text-sm leading-6 text-[#8e969f]">
                            {review.summary}
                        </p>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <ReviewList
                            title="Matched requirements"
                            items={review.matchedItems}
                            type="success"
                            emptyText="No confirmed matches."
                        />

                        <ReviewList
                            title="Missing or unclear"
                            items={review.missingItems}
                            type="warning"
                            emptyText="No missing items detected."
                        />
                    </div>

                    <div className="mt-5 rounded-lg border border-[#24282d] bg-[#0b0d0f] px-4 py-3">
                        <p className="text-xs leading-5 text-[#636b74]">
                            AI review is advisory only. Pactra does not automatically release
                            funds based on AI output.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

function ReviewList({
    title,
    items,
    type,
    emptyText,
}: {
    title: string;
    items: string[];
    type: "success" | "warning";
    emptyText: string;
}) {
    const accent =
        type === "success"
            ? "text-[#43d17b]"
            : "text-[#ffb547]";

    const symbol =
        type === "success"
            ? "✓"
            : "•";

    return (
        <div className="rounded-lg border border-[#24282d] bg-[#0b0d0f] p-4">
            <p className={`text-sm font-medium ${accent}`}>
                {title}
            </p>

            {items.length === 0 ? (
                <p className="mt-3 text-sm text-[#636b74]">
                    {emptyText}
                </p>
            ) : (
                <ul className="mt-3 space-y-2">
                    {items.map((item, index) => (
                        <li
                            key={`${item}-${index}`}
                            className="text-sm leading-5 text-[#8e969f]"
                        >
                            <span className={`mr-2 ${accent}`}>
                                {symbol}
                            </span>

                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function AIRecommendationBadge({
    recommendation,
}: {
    recommendation: AIRecommendation;
}) {
    const config = {
        approve: {
            label: "Looks ready",
            style:
                "border-[#43d17b]/20 bg-[#43d17b]/10 text-[#43d17b]",
        },

        revision: {
            label: "Revision suggested",
            style:
                "border-[#ffb547]/20 bg-[#ffb547]/10 text-[#ffb547]",
        },

        manual_review: {
            label: "Manual review",
            style:
                "border-blue-400/20 bg-blue-400/10 text-blue-300",
        },
    };

    const selected = config[recommendation];

    return (
        <span
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${selected.style}`}
        >
            {selected.label}
        </span>
    );
}