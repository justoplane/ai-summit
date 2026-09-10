import { requireAuth } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { GlowText } from "@/components/ui/GlowText";

export const dynamic = "force-dynamic";

/** Host display. TODO(agent C): replace with the QR panel + latest match reveal. */
export default async function HostPage() {
  await requireAuth();
  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <Card className="max-w-xl text-center">
        <h1 className="font-display text-4xl font-bold">
          <GlowText>Durf Dungeon LLC</GlowText>
        </h1>
        <p className="mt-3 text-muted">Host page placeholder. Agent C builds this.</p>
      </Card>
    </main>
  );
}
