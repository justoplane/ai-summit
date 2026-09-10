import { z } from "zod";
import { MEMBERS, SHLAYTE_MEMBER_ID } from "@/content/members";
import { MAX_TRAITS } from "@/content/traits";
import { matchSubmission } from "@/lib/match";
import { getStore } from "@/lib/store";
import { newId } from "@/lib/tokens";
import type { MatchResult } from "@/lib/types";

export const dynamic = "force-dynamic";
// The LLM call can take a while. Vercel Fluid compute allows up to 300s on Hobby.
export const maxDuration = 60;

const SubmissionSchema = z.object({
  visitId: z.string().min(1),
  name: z.string().trim().min(1).max(40),
  traits: z.array(z.string().max(40)).max(MAX_TRAITS),
  description: z.string().trim().min(1).max(600),
  // ~1.1MB of base64 is roughly an 800KB JPEG. Client should compress well below this.
  photoDataUrl: z.string().startsWith("data:image/").max(1_500_000),
});

/**
 * Phone posts a Submission. Validates the visit, runs the match, stores the result
 * attributed to the visit's intake code. Response: { resultId } or { error }.
 */
export async function POST(request: Request) {
  const parsed = SubmissionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid submission", issues: parsed.error.issues }, { status: 400 });
  }
  const submission = parsed.data;
  const store = getStore();

  const visit = await store.getVisit(submission.visitId);
  if (!visit) return Response.json({ error: "This link has expired" }, { status: 409 });
  if (visit.status !== "opened") return Response.json({ error: "This application was already submitted" }, { status: 409 });

  await store.setVisitStatus(visit.id, "processing");
  try {
    const id = newId();
    const forceMemberId = (await store.getSetting("shlayte_maxxing")) === "1" ? SHLAYTE_MEMBER_ID : undefined;
    const [{ verdict, model }, photoUrl] = await Promise.all([
      matchSubmission({ submission, members: MEMBERS, forceMemberId }),
      store.savePhoto(id, submission.photoDataUrl),
    ]);
    const result: MatchResult = {
      id,
      createdAt: new Date().toISOString(),
      model,
      codeId: visit.codeId,
      visitId: visit.id,
      submitter: {
        name: submission.name,
        traits: submission.traits,
        description: submission.description,
        photoUrl,
      },
      verdict,
    };
    await store.saveResult(result);
    await store.setVisitStatus(visit.id, "done");
    return Response.json({ resultId: id });
  } catch (err) {
    console.error("[submit] failed", err);
    // Let the same phone retry.
    await store.setVisitStatus(visit.id, "opened");
    return Response.json({ error: "The committee could not reach a decision. Try again." }, { status: 500 });
  }
}
