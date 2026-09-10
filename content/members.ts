import type { Member, MemberId } from "@/lib/types";

/**
 * The six residents of the Durf Dungeon.
 *
 * Fill in every TODO. Keep the ids exactly as they are; they're used in
 * image filenames, database rows, and the LLM's structured response.
 *
 * Photos: drop your image at public/members/<id>.jpg and change the `photo`
 * path below from .svg to .jpg.
 */
export const MEMBERS: Member[] = [
  {
    id: "resident-1",
    name: "TODO Resident One",
    companyTitle: "TODO e.g. Chief Vibes Officer",
    photo: "/members/resident-1.svg",
    description: `TODO — one paragraph about this person.`,
    personalityResults: `TODO — paste the full personality test output here, any format.`,
  },
  {
    id: "resident-2",
    name: "TODO Resident Two",
    companyTitle: "TODO e.g. Head of Snacks",
    photo: "/members/resident-2.svg",
    description: `TODO — one paragraph about this person.`,
    personalityResults: `TODO — paste the full personality test output here, any format.`,
  },
  {
    id: "resident-3",
    name: "TODO Resident Three",
    companyTitle: "TODO e.g. VP of Late Nights",
    photo: "/members/resident-3.svg",
    description: `TODO — one paragraph about this person.`,
    personalityResults: `TODO — paste the full personality test output here, any format.`,
  },
  {
    id: "resident-4",
    name: "TODO Resident Four",
    companyTitle: "TODO e.g. Director of Chaos",
    photo: "/members/resident-4.svg",
    description: `TODO — one paragraph about this person.`,
    personalityResults: `TODO — paste the full personality test output here, any format.`,
  },
  {
    id: "resident-5",
    name: "TODO Resident Five",
    companyTitle: "TODO e.g. Principal Couch Engineer",
    photo: "/members/resident-5.svg",
    description: `TODO — one paragraph about this person.`,
    personalityResults: `TODO — paste the full personality test output here, any format.`,
  },
  {
    id: "resident-6",
    name: "TODO Resident Six",
    companyTitle: "TODO e.g. Chief of Staff (Self-Appointed)",
    photo: "/members/resident-6.svg",
    description: `TODO — one paragraph about this person.`,
    personalityResults: `TODO — paste the full personality test output here, any format.`,
  },
];

export const MEMBER_IDS = MEMBERS.map((m) => m.id) as [MemberId, ...MemberId[]];

const byId = new Map(MEMBERS.map((m) => [m.id, m]));

export function getMember(id: MemberId): Member {
  const member = byId.get(id);
  if (!member) throw new Error(`Unknown member id: ${id}`);
  return member;
}

export function isMemberId(value: string): value is MemberId {
  return byId.has(value as MemberId);
}
