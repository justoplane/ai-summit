import { MicroLabel } from "@/components/history/MicroLabel";

export function SettingsFootnote() {
  return (
    <footer className="border-t border-border pt-4">
      <MicroLabel className="block normal-case tracking-normal">
        Codes are distributed at the discretion of the officers. Analytics are unaudited. Scans
        count phones that opened a link; submissions count phones that finished.
      </MicroLabel>
    </footer>
  );
}
