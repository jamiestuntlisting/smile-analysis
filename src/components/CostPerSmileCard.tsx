import { useEffect, useState } from "react";
import { Pill, Eyebrow } from "./ui";
import { fmtUsd, fmtNum } from "@/lib/id";

export function CostPerSmileCard({
  cost,
  smile,
  annual,
  rank,
  outOf,
  badge,
}: {
  cost: number | null;
  smile: number;
  annual: number;
  rank?: number;
  outOf?: number;
  badge?: "best" | "expensive" | null;
}) {
  const target = cost ?? 0;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setDisplay(0);
      return;
    }
    let start: number | null = null;
    const duration = 600;
    const from = display;
    const delta = target - from;
    let raf: number | null = null;
    function step(ts: number) {
      if (start === null) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(from + delta * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return (
    <div className="card p-8 relative">
      <div className="flex items-start justify-between">
        <Eyebrow>Cost per Smile</Eyebrow>
        {badge === "best" && <Pill tone="value">Best Value</Pill>}
        {badge === "expensive" && <Pill tone="neutral">Expensive</Pill>}
      </div>
      <div className="mt-6 numeric">
        {cost === null ? (
          <div className="serif text-display-l text-ink-tertiary">—</div>
        ) : (
          <div className="serif text-display-xl text-ink-primary">
            ${Math.round(display).toLocaleString("en-US")}
          </div>
        )}
        <p className="text-body-s text-ink-tertiary mt-1">per smile per year</p>
      </div>
      <div className="hairline mt-6 pt-4">
        <p className="eyebrow text-ink-tertiary">
          {fmtNum(Math.round(smile))} smiles · {fmtUsd(annual)}/yr
          {rank && outOf ? ` · rank #${rank} of ${outOf}` : ""}
        </p>
      </div>
    </div>
  );
}
