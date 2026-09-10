import type { Member, MemberId } from "@/lib/types";

/**
 * The six residents of the Durf Dungeon.
 *
 * Fill in every TODO. `achievement` is one line: a notable, ideally absurd accomplishment.
 * Keep the ids exactly as they are; they're used in
 * image filenames, database rows, and the LLM's structured response.
 *
 * Photos: drop your image at public/members/<id>.jpg and change the `photo`
 * path below from .svg to .jpg.
 */
export const MEMBERS: Member[] = [
  {
    id: "resident-1",
    name: "Elijah Whitman",
    companyTitle: "Chief of Product Development",
    achievement: "Elijah once received 80 likes on a Letterboxd review",
    photo: "/members/resident-1.jpeg",
    description: `Elijah is a non-chalant, mellow tempered, charismatic goat. Elijah enjoys playing basketball, fishing, watching pretentious films, agonizing over the Los Angeles Clippers, larping on LinkedIn and collecting graphic novels. Elijah is also commonly mistaken for Michael B. Jordan. Before you ask, he is 6’8”. `,
    personalityResults: `INFP-T`,
  },
  {
    id: "resident-2",
    name: "Clayton Beard",
    companyTitle: "Chief Fashion Officer, Chief Phent Officer, Dungeon Groundskeeper",
    achievement: "Beat Clash Royale, 100+ #1 Victory Royales, Award-Winning Surf Documentary Filmmaker",
    photo: "/members/resident-2.jpeg",
    description: `Clayton, nicknamed Schlayte, is a white boy with a little bit of motion. Women would describe him as handsome, charismatic, and funny. Special interests include Fortnite, banana bread, and Rupert.`,
    personalityResults: `Personality type: ENFJ-T (Protagonist) Traits: Extraverted – 78%, Intuitive – 59%, Feeling – 58%, Judging – 58%, Turbulent – 63% Role: Diplomat Strategy: Social Engagement`,
  },
  {
    id: "resident-3",
    name: "Carter Brazell",
    companyTitle: "Chief Arcteryx Officer, Chief Mogging Officer",
    achievement: "Owns 4k+ worth of Arcteryx gear, all acquired at 60-80% below retail.",
    photo: "/members/resident-3.jpeg",
    description: `Carter loves bouldering, fishing, snowboarding, and pickleball. He loves the movie Talladega nights and the movie zoolander. He is a finance and accounting student planning on going to law school. Enjoys a deep conversation. He likes laughing at dumb jokes. The dumber the joke the better. He hopes to emulate Ryan gosling one day`,
    personalityResults: `ENTJ-A`,
  },
  {
    id: "resident-4",
    name: "Mitch Gardner",
    companyTitle: "Chief Acquisitions Officer, Chief Durf Officer, Chief Culinary Officer, Chief Special Needs Liason",
    achievement: "All-time Group leader",
    photo: "/members/resident-4.jpeg",
    description: `Mitch synergistically combines ingredients, increasing production power and creating a better finished product. By creating high impact meals Mitch increases total function attendance by a multiple of 5. If you matched with Mitch you love synergy and market efficiency. You align incentives with with key performance indicators to deliver perpetual motion and immaculate vibe creation.`,
    personalityResults: `ENTJ-A`,
  },
  {
    id: "resident-5",
    name: "Andrew Hobbes",
    companyTitle: "TODO e.g. Principal Couch Engineer",
    achievement: "TODO — one notable achievement, e.g. Once ate 14 tacos at a standing desk.",
    photo: "/members/resident-5.jpeg",
    description: `TODO — one paragraph about this person.`,
    personalityResults: `TODO — paste the full personality test output here, any format.`,
  },
  {
    id: "resident-6",
    name: "Jamison Louviere",
    companyTitle: "Chief Networking Officer",
    achievement: "Nose itch cancel - Jamison once used his razor fast reflexes to cancel a nose itch in the middle of a COD match to snipe a player from across the map.",
    photo: "/members/resident-6.jpeg",
    description: `Jamison is a shy white boy that doesn’t get out much. If you get along with Jamison you prefer nesting in a warm room to flying out in the wind and seeing Logan Utah from another light. Jamison takes a lot of other people’s food tastes and blends them together to be simultaneously a fan of jello, vegetables, and some cookies here and there XD don’t judge yourself if you’re compatible with Jamison, it just means you are in a spot in life where you have a lot to learn. Tell him I say wassup!`,
    personalityResults: `ENFP-A`,
  },
];

/** ShlayteMaxxing mode forces every match to this resident. */
export const SHLAYTE_MEMBER_ID: MemberId = "resident-2";

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
