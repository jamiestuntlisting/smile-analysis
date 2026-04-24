import { useStore, currentUser } from "@/store/store";
import { Button, Eyebrow, Card } from "@/components/ui";
import { Printer } from "lucide-react";
import { SmileGlyph, FrownGlyph, LogoMark } from "@/components/Glyph";
import type { Area } from "@/lib/types";

const AREAS: { key: Area; label: string }[] = [
  { key: "In", label: "In the unit" },
  { key: "Building", label: "Building" },
  { key: "Around", label: "Around it" },
  { key: "Commute", label: "Commute" },
];

export function Worksheet() {
  const variables = useStore((s) => s.variables);
  const states = useStore((s) => s.variableStates);
  const members = useStore((s) => s.rubric.members);
  const me = currentUser();

  return (
    <div>
      <div className="flex items-end justify-between mb-8 print:hidden">
        <div>
          <Eyebrow>Printable rubric worksheet</Eyebrow>
          <h1 className="serif text-display-l text-ink-primary mt-1">Your rubric, on paper.</h1>
          <p className="text-body-l text-ink-tertiary mt-3 max-w-xl">
            Take it to open houses. Scribble on it. Use it anywhere. This is the Free-tier graduation.
          </p>
        </div>
        <Button onClick={() => window.print()}>
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </Button>
      </div>

      <div className="worksheet bg-white p-10 rounded-md border border-border-subtle max-w-[860px] mx-auto">
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <LogoMark className="w-10 h-10" />
            <div>
              <p className="serif text-[24px] text-ink-primary leading-none">Smile Analysis</p>
              <p className="eyebrow mt-2">{me.displayName}'s rubric · {members.map((m) => m.displayName).join(" & ")}</p>
            </div>
          </div>
          <p className="eyebrow text-ink-tertiary">{new Date().toLocaleDateString()}</p>
        </div>

        {AREAS.map(({ key, label }) => {
          const vars = variables.filter((v) => v.area === key);
          if (vars.length === 0) return null;
          return (
            <div key={key} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="serif text-heading-l text-ink-primary">{label}</h2>
                <span className="flex-1 border-t border-ink-primary/20" />
                <span className="eyebrow">{vars.length}</span>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left eyebrow pb-2">Variable</th>
                    {members.map((m) => (
                      <th key={m.userId} className="text-right eyebrow pb-2 w-20">
                        {m.displayName}
                      </th>
                    ))}
                    <th className="text-right eyebrow pb-2 w-24">Match?</th>
                  </tr>
                </thead>
                <tbody>
                  {vars
                    .sort(
                      (a, b) =>
                        Math.abs(states[b.id]?.weights[me.id] ?? 0) -
                        Math.abs(states[a.id]?.weights[me.id] ?? 0),
                    )
                    .map((v) => (
                      <tr key={v.id} className="border-t border-border-subtle">
                        <td className="py-2.5">
                          <p className="font-medium text-ink-primary">{v.name}</p>
                          {v.definition && (
                            <p className="text-body-s text-ink-tertiary">{v.definition}</p>
                          )}
                        </td>
                        {members.map((m) => {
                          const w = states[v.id]?.weights[m.userId] ?? 0;
                          return (
                            <td key={m.userId} className="text-right numeric py-2.5">
                              <span className="inline-flex items-center gap-1 justify-end">
                                {w > 0 ? (
                                  <SmileGlyph className="w-3 h-3" />
                                ) : w < 0 ? (
                                  <FrownGlyph className="w-3 h-3" />
                                ) : null}
                                <span
                                  className={
                                    w > 0
                                      ? "text-smile-700"
                                      : w < 0
                                        ? "text-frown-700"
                                        : "text-ink-tertiary"
                                  }
                                >
                                  {w > 0 ? "+" : ""}
                                  {w}
                                </span>
                              </span>
                            </td>
                          );
                        })}
                        <td className="text-right py-2.5">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="inline-block w-4 h-4 border border-ink-primary rounded-sm" />
                            <span className="inline-block w-4 h-4 border border-ink-primary rounded-sm" />
                            <span className="inline-block w-4 h-4 border border-ink-primary border-dashed rounded-sm" />
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          );
        })}

        <div className="mt-10 pt-5 border-t border-border-subtle">
          <p className="eyebrow text-ink-tertiary">
            ✓ = matched · ✗ = no · ? = not sure. Tally your smiles at the bottom of each property tour.
          </p>
        </div>

        <div className="mt-10">
          <Eyebrow className="mb-3">Property scoring sheet</Eyebrow>
          <div className="border border-ink-primary rounded-md p-5">
            <p className="font-semibold text-ink-primary mb-5">Address: _________________________________________________</p>
            <p className="mb-2 text-body-s">Price: ______________ · Sqft: ______ · HOA/mo: ______ · Taxes/yr: ______</p>
            <p className="mt-6 mb-2 text-body-s">Smile total: ____________ · Annual cost: ____________ · Cost per smile: ____________</p>
            <p className="mt-6 text-body-s">Notes:</p>
            <div className="mt-2 space-y-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="border-b border-border-subtle" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: letter; margin: 0.5in; }
          header, footer, nav, .print\\:hidden { display: none !important; }
          .worksheet { border: 0; padding: 0; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
