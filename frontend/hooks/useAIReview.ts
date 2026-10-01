"use client";

import { useState } from "react";

export type AIRecommendation = "approve" | "revision" | "manual_review";

export type AIReview = {
  summary: string;

  requirementMatch: number;

  matchedItems: string[];

  missingItems: string[];

  recommendation: AIRecommendation;
};

export function useAIReview() {
  const [aiReview, setAiReview] = useState<AIReview | null>(null);

  const [aiLoading, setAiLoading] = useState(false);

  const [aiError, setAiError] = useState("");

  async function runAIReview(requirement: string, submission: string) {
    if (!requirement) {
      setAiError("Milestone requirement is missing.");

      return;
    }

    if (!submission) {
      setAiError("No submission available for review.");

      return;
    }

    setAiLoading(true);
    setAiError("");
    setAiReview(null);

    try {
      const response = await fetch("/api/review", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          requirement,
          submission,
        }),
      });

      const responseText = await response.text();

      if (!responseText) {
        throw new Error(`API returned an empty response. Status: ${response.status}`);
      }

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error("Invalid API response:", responseText);

        throw new Error("API returned invalid JSON.");
      }

      if (!response.ok) {
        const message = data.details ? `${data.error} ${data.details}` : data.error || "AI review failed.";

        throw new Error(message);
      }

      if (typeof data.summary !== "string" || typeof data.requirementMatch !== "number" || !Array.isArray(data.matchedItems) || !Array.isArray(data.missingItems)) {
        throw new Error("AI returned an invalid response structure.");
      }

      if (!["approve", "revision", "manual_review"].includes(data.recommendation)) {
        throw new Error("AI returned an invalid recommendation.");
      }

      setAiReview({
        summary: data.summary,

        requirementMatch: data.requirementMatch,

        matchedItems: data.matchedItems,

        missingItems: data.missingItems,

        recommendation: data.recommendation,
      });
    } catch (error) {
      console.error("AI review frontend error:", error);

      setAiError(error instanceof Error ? error.message : "AI review failed.");
    } finally {
      setAiLoading(false);
    }
  }

  function resetAIReview() {
    setAiReview(null);
    setAiError("");
  }

  return {
    aiReview,
    aiLoading,
    aiError,

    runAIReview,
    resetAIReview,
  };
}
