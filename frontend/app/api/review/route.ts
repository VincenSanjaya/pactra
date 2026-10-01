import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MODELS = ["gemini-2.5-flash", "gemini-3.5-flash-lite"];

type ReviewResponse = {
  summary: string;
  requirementMatch: number;
  matchedItems: string[];
  missingItems: string[];
  recommendation: "approve" | "revision" | "manual_review";
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY is not configured.",
        },
        {
          status: 500,
        },
      );
    }

    let body: {
      requirement?: unknown;
      submission?: unknown;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request JSON.",
        },
        {
          status: 400,
        },
      );
    }

    const requirement = typeof body.requirement === "string" ? body.requirement.trim() : "";

    const submission = typeof body.submission === "string" ? body.submission.trim() : "";

    if (!requirement) {
      return NextResponse.json(
        {
          error: "Requirement is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!submission) {
      return NextResponse.json(
        {
          error: "Submission is required.",
        },
        {
          status: 400,
        },
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const prompt = `
You are the AI review assistant for Pactra.

Pactra is a milestone-based freelance escrow platform.

Your role is advisory only.

You do NOT control funds.
You do NOT release funds.
You do NOT make the client's final payment decision.

Evaluate the freelancer submission only using the evidence provided.

MILESTONE REQUIREMENT:
${requirement}

FREELANCER SUBMISSION:
${submission}

Return a JSON response using exactly this structure:

{
  "summary": "Short review summary",
  "requirementMatch": 0,
  "matchedItems": [],
  "missingItems": [],
  "recommendation": "manual_review"
}

Rules:

- requirementMatch must be an integer from 0 to 100.
- recommendation must be exactly one of:
  "approve"
  "revision"
  "manual_review"

- Do not assume that unproven work is complete.
- If the freelancer only claims the work is finished but provides no meaningful evidence, use "manual_review".
`;

    let lastError: unknown = null;

    for (const model of MODELS) {
      try {
        console.log(`Pactra AI: trying ${model}`);

        const response = await ai.models.generateContent({
          model,

          contents: prompt,

          config: {
            responseMimeType: "application/json",

            responseSchema: {
              type: "object",

              properties: {
                summary: {
                  type: "string",
                },

                requirementMatch: {
                  type: "integer",
                },

                matchedItems: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },

                missingItems: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },

                recommendation: {
                  type: "string",
                  enum: ["approve", "revision", "manual_review"],
                },
              },

              required: ["summary", "requirementMatch", "matchedItems", "missingItems", "recommendation"],
            },
          },
        });

        const raw = response.text?.trim();

        if (!raw) {
          throw new Error(`${model} returned an empty response.`);
        }

        console.log(`Pactra AI: ${model} succeeded`);

        console.log("Pactra AI raw response:", raw);

        let parsed: ReviewResponse;

        try {
          parsed = JSON.parse(raw) as ReviewResponse;
        } catch {
          throw new Error(`${model} returned invalid JSON.`);
        }

        const validRecommendations = ["approve", "revision", "manual_review"];

        const result: ReviewResponse = {
          summary: typeof parsed.summary === "string" ? parsed.summary : "No summary provided.",

          requirementMatch: typeof parsed.requirementMatch === "number" ? Math.max(0, Math.min(100, Math.round(parsed.requirementMatch))) : 0,

          matchedItems: Array.isArray(parsed.matchedItems) ? parsed.matchedItems.filter((item) => typeof item === "string") : [],

          missingItems: Array.isArray(parsed.missingItems) ? parsed.missingItems.filter((item) => typeof item === "string") : [],

          recommendation: typeof parsed.recommendation === "string" && validRecommendations.includes(parsed.recommendation) ? parsed.recommendation : "manual_review",
        };

        return NextResponse.json({
          ...result,
          modelUsed: model,
        });
      } catch (error) {
        lastError = error;

        console.error(`Pactra AI: ${model} failed`, error);

        const message = error instanceof Error ? error.message : String(error);

        const isRetryable = message.includes("503") || message.includes("UNAVAILABLE") || message.includes("high demand") || message.includes("429");

        if (!isRetryable) {
          break;
        }
      }
    }

    const details = lastError instanceof Error ? lastError.message : String(lastError);

    return NextResponse.json(
      {
        error: "All AI review models failed.",
        details,
      },
      {
        status: 503,
      },
    );
  } catch (error) {
    console.error("Pactra AI fatal error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate AI review.",

        details: error instanceof Error ? error.message : "Unknown server error.",
      },
      {
        status: 500,
      },
    );
  }
}
