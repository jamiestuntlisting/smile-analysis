import { useEffect, useState } from "react";
import { Eyebrow } from "./ui";
import { SmileGlyph, FrownGlyph } from "./Glyph";

/** Companion hero to CostPerSmileCard: shows net smiles (positive − |negative|)
 *  as the headline, with the smile/frown split underneath. */
export function NetSmilesCard({
  net,
  smiles,
  frowns,
  matched,
  known,
}: {
  net: number;
  smiles: number;
  frowns: number; // absolute value (|negative|)
  matched: number;
  known: number;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const from = display;
    const delta = net - from;
    const duration = 600;
    let start: number | null = null;
    let raf: number | null = null;
    function step(ts: number) {
      if (start === null) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(from + delta * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [net]);

  const sign = net >= 0 ? "+" : "−";

  return (
    <div className="card p-8">
      <Eyebrow>Net smiles</Eyebrow>
      <div className="mt-6 numeric">
        <div
          className={`serif text-display-xl leading-[0.95] tracking-[-0.04em] ${net >= 0 ? "text-smile-700" : "text-frown-700"}`}
        >
          {sign}
          {Math.round(Math.abs(display)).toLocaleString()}
        </div>
        <p className="text-body-s text-ink-tertiary mt-1">
          smiles minus frowns
        </p>
      </div>
      <div className="hairline mt-6 pt-4 flex items-center gap-5 text-body tabular">
        <span className="flex items-center gap-1.5 text-smile-700">
          <SmileGlyph className="w-4 h-4" />
          <span className="font-semibold">{Math.round(smiles).toLocaleString()}</span>
          <span className="text-ink-tertiary">smiles</span>
        </span>
        <span className="flex items-center gap-1.5 text-frown-700">
          <FrownGlyph className="w-4 h-4" />
          <span className="font-semibold">{Math.round(frowns).toLocaleString()}</span>
          <span className="text-ink-tertiary">frowns</span>
        </span>
        <span className="ml-auto eyebrow text-ink-tertiary">
          {matched}/{known} matched
        </span>
      </div>
    </div>
  );
}
