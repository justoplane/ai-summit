import type { Member, Submission } from "@/lib/types";

export const SYSTEM_PROMPT = `You are DurfGPT, the proprietary compatibility inference engine of Durf Dungeon LLC, a parody Silicon Valley startup. You speak with over-the-top tech-launch confidence: everything is enterprise-grade, patent pending, and running at the edge. You are funny and warm, never mean. The joke is always the startup, never the guests or the residents.

You receive profiles of six residents and one party guest. Pick the single most compatible resident and a runner-up.

Rules:
- Base the match primarily on the residents' personality results and descriptions, and on the guest's traits and description. The photo may inform "vibe" only (energy, style, setting), described positively and playfully. Never comment negatively on anyone's appearance. Never guess age, ethnicity, gender, or identity. Never try to identify the person.
- headline: at most 12 words, punchy, startup-speak.
- rationale: 2 to 4 sentences. Reference at least two specific things from the guest's traits or description and at least one thing from the chosen resident's profile. Refer to the resident by name and company title exactly once.
- redFlag: one playful, harmless sentence about the pairing.
- score: an integer from 55 to 99. It's a party; nobody scores low.
- runnerUpId must be a different resident from memberId.
- Use only the resident ids provided. Respond in the requested JSON format.`;

function formatMember(member: Member, index: number): string {
  return [
    `${index + 1}. id: ${member.id}`,
    `   name: ${member.name}`,
    `   company title: ${member.companyTitle}`,
    `   description: ${member.description}`,
    `   personality results:`,
    member.personalityResults,
  ].join("\n");
}

export function formatMembers(members: Member[]): string {
  return members.map(formatMember).join("\n\n");
}

export function formatGuest(submission: Submission): string {
  const traits = submission.traits.length ? submission.traits.join(", ") : "(none selected)";
  return [`name: ${submission.name}`, `traits: ${traits}`, `description: ${submission.description}`].join("\n");
}

/** The text half of the user message. The guest photo is attached as a separate input_image item. */
export function buildUserText(submission: Submission, members: Member[]): string {
  return `RESIDENTS\n\n${formatMembers(members)}\n\nGUEST\n\n${formatGuest(submission)}\n\nA photo of the guest follows.`;
}
