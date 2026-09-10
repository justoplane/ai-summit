"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { archiveCode, patchSettings } from "@/components/settings/api";

type Props = { id: string; isFloor: boolean };

export function CodeActions({ id, isFloor }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(action: () => Promise<void>, fallback: string) {
    setBusy(true);
    setError(null);
    try {
      await action();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : fallback);
    } finally {
      setBusy(false);
    }
  }

  function archive() {
    if (!window.confirm("Retire this link? Its record stays in the ledger.")) return;
    run(() => archiveCode(id), "The code was not archived");
  }

  return (
    <div className="flex flex-col items-start gap-2 md:items-end">
      <div className="flex flex-wrap items-center gap-2">
        {isFloor ? (
          <Badge tone="lime" live>
            On the floor
          </Badge>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={() => run(() => patchSettings({ floorCodeId: id }), "Settings were not saved")}
          >
            Show on floor
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          disabled={busy || isFloor}
          title={isFloor ? "Pick another floor code first" : "Retire this link"}
          onClick={archive}
          className="text-muted hover:text-magenta"
        >
          Archive
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-magenta">
          {error}
        </p>
      )}
    </div>
  );
}
