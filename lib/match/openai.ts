import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { env } from "@/lib/env";
import type { MatchVerdict, Member, Submission } from "@/lib/types";
import { SYSTEM_PROMPT, buildUserText } from "./prompt";
import { VerdictSchema, normalizeVerdict } from "./schema";

// Stays under the submit route's 60s maxDuration. SDK retries are disabled because
// a retried timeout would outlive the function and leave the token stuck in "processing";
// the route hands the token back to the phone to retry instead.
const REQUEST_TIMEOUT_MS = 45_000;

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) client = new OpenAI({ apiKey: env.openaiApiKey });
  return client;
}

function findRefusal(response: OpenAI.Responses.Response): string | null {
  for (const item of response.output) {
    if (item.type !== "message") continue;
    for (const part of item.content) {
      if (part.type === "refusal") return part.refusal;
    }
  }
  return null;
}

function describeFailure(response: OpenAI.Responses.Response): string {
  const refusal = findRefusal(response);
  if (refusal) return `model refused: ${refusal}`;
  const reason = response.incomplete_details?.reason ?? response.error?.message;
  return `no parsed output (status: ${response.status ?? "unknown"}${reason ? `, ${reason}` : ""})`;
}

/** Ask OpenAI for a structured verdict. Throws on API error, refusal, or unparseable output. */
export async function openaiMatch(submission: Submission, members: Member[]): Promise<MatchVerdict> {
  const response = await getClient().responses.parse(
    {
      model: env.openaiModel,
      instructions: SYSTEM_PROMPT,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: buildUserText(submission, members) },
            { type: "input_image", image_url: submission.photoDataUrl, detail: "low" },
          ],
        },
      ],
      text: { format: zodTextFormat(VerdictSchema, "match_verdict") },
    },
    { timeout: REQUEST_TIMEOUT_MS, maxRetries: 0 },
  );

  if (!response.output_parsed) {
    throw new Error(`OpenAI match failed: ${describeFailure(response)}`);
  }
  return normalizeVerdict(response.output_parsed, members);
}
