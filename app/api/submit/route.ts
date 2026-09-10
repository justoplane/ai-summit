import { z } from "zod";
import { MEMBERS } from "@/content/members";
import { MAX_TRAITS } from "@/content/traits";
import { matchSubmission } from "@/lib/match";
import { getStore } from "@/lib/store";
import { newId } from "@/lib/tokens";
import type { MatchResult } from "@/lib/types";

export const dynamic = "force-dynamic";
// The LLM call can take a while. Vercel Fluid compute allows up to 300s on Hobby.
export const maxDuration = 60;

const SubmissionSchema = z.object({
  token: z.string().min(1),
  name: z.string().trim().min(1).max(40),
  traits: z.array(z.string().max(40)).max(MAX_TRAITS),
  description: z.string().trim().min(1).max(600),
  // ~1.1MB of base64 is roughly an 800KB JPEG. Client should compress well below this.
  photoDataUrl: z.string().startsWith("data:image/").max(1_500_000),
});

/**
 * Phone posts a Submission. Validates, runs the match, stores the result.
 * Response: { resultId } or { error }.
 */
export async function POST(request: Request) {
  const parsed = SubmissionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid submission", issues: parsed.error.issues }, { status: 400 });
  }
  const submission = parsed.data;
  const store = getStore();

  const status = await store.getTokenStatus(submission.token);
  if (status !== "claimed") {
    const error = status ? "This link was already used" : "Invalid or expired link";
    return Response.json({ error }, { status: 409 });
  }

  await store.setTokenStatus(submission.token, "processing");
  try {
    const id = newId();
    const [{ verdict, model }, photoUrl] = await Promise.all([
      matchSubmission({ submission, members: MEMBERS }),
      store.savePhoto(id, submission.photoDataUrl),
    ]);
    const result: MatchResult = {
      id,
      token: submission.token,
      createdAt: new Date().toISOString(),
      model,
      submitter: {
        name: submission.name,
        traits: submission.traits,
        description: submission.description,
        photoUrl,
      },
      verdict,
    };
    await store.saveResult(result);
    await store.setTokenStatus(submission.token, "done");
    return Response.json({ resultId: id });
  } catch (err) {
    console.error("[submit] failed", err);
    // Let the same phone retry.
    await store.setTokenStatus(submission.token, "claimed");
    return Response.json({ error: "Compatibility inference failed. Try again." }, { status: 500 });
  }
}
