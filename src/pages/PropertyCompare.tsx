import { useMemo, useState } from "react";
import { useStore, currentUser } from "@/store/store";
import { annualCost, costPerSmile, smileScoreFor } from "@/lib/scoring";
import { Card, Eyebrow, SectionHeader, Pill } from "@/components/ui";
import { fmtUsd, fmtNum } from "@/lib/id";
import type { Area, Property } from "@/lib/types";
import { SmileGlyph, FrownGlyph } from "@/components/Glyph";
import { Check, X, HelpCircle } from "lucide-react";

const AREAS: Area[] = ["In", "Building", "Around", "Commute"];

export function PropertyCompare() {
  const properties = useStore((s) => s.properties);
  const variables = useStore((s) => s.variables);
  const states = useStore((s) => s.variableStates);
  const scores = useStore((s) => s.scores);
  const fin = useStore((s) => s.financial);
  const me = currentUser();

  const [selected, setSelected] = useState<string[]>(
    properties.slice(0, Math.min(3, properties.length)).map((p) => p.id),
  );

  const compared = selected
    .map((id) => properties.find((p) => p.id === id))
    .filter((p): p is Property => Boolean(p));

  const computed = useMemo(() => {
    return compared.map((p) => {
      const s = smileScoreFor(me.id, p, variables, states, scores);
      const ac = annualCost(p, fin);
      return {
        property: p,
        smile: s,
        annual: ac,
        cps: costPerSmile(ac, s.total),
      };
    });
  }, [compared, me, variables, states, scores, fin]);

  function toggle(id: string) {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else if (selected.length < 4) {
      setSelected([...selected, id]);
    }
  }

  const bestCps = Math.min(
    ...computed.map((c) => c.cps ?? Infinity),
  );

  return (
    <div>
      <SectionHeader
        eyebrow="Compare"
        title={`${compared.length} ${compared.length === 1 ? "property" : "properties"} side-by-side.`}
        subtitle="Pick 2–4. We'll diff them on every variable where they score differently."
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {properties.map((p) => (
          <button
            key={p.id}
            onClick={() => toggle(p.id)}
            className={`pill ${selected.includes(p.id) ? "bg-ink-primary text-white" : "bg-bg-inset"}`}
          >
            {p.address.split(",")[0]}
          </button>
        ))}
      </div>

      {compared.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-heading-m font-semibold text-ink-primary">Pick some properties.</p>
        </Card>
      ) : (
        <>
          <div
            className="grid gap-4 mb-10"
            style={{ gridTemplateColumns: `200px repeat(${compared.length}, minmax(0, 1fr))` }}
          >
            <div />
            {computed.map((c) => (
              <Card key={c.property.id} className="!p-5">
                <img
                  src={c.property.photoUrl}
                  alt={c.property.address}
                  className="w-full h-24 object-cover rounded-sm mb-3"
                />
                <h3 className="serif text-heading-m text-ink-primary">{c.property.address}</h3>
                <p className="text-body-s text-ink-tertiary">{c.property.neighborhood}</p>
                <div className="mt-4">
                  <Eyebrow>Cost / smile</Eyebrow>
                  <p className={`serif text-display-m numeric ${c.cps === bestCps ? "text-value-500" : "text-ink-primary"}`}>
                    {c.cps !== null ? fmtUsd(c.cps) : "—"}
                  </p>
                  <p className="text-body-s text-ink-tertiary">
                    {fmtNum(c.smile.total)} smiles · {fmtUsd(c.annual)}/yr
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {AREAS.map((area) => {
            const inArea = variables.filter((v) => v.area === area);
            if (inArea.length === 0) return null;
            return (
              <div key={area} className="mb-10">
                <Eyebrow className="mb-3">
                  {area === "In"
                    ? "In the unit"
                    : area === "Around"
                      ? "Around it"
                      : area === "Building"
                        ? "Building"
                        : "Commute"}
                </Eyebrow>
                <div className="rounded-md border border-border-subtle bg-bg-elevated overflow-hidden">
                  <div
                    className="grid gap-0 divide-x divide-border-subtle"
                    style={{ gridTemplateColumns: `200px repeat(${compared.length}, minmax(0, 1fr))` }}
                  >
                    {inArea.map((v, vi) => {
                      const weight = states[v.id]?.weights[me.id] ?? 0;
                      return (
                        <div key={v.id} className="contents">
                          <div
                            className={`p-4 ${vi > 0 ? "border-t border-border-subtle" : ""} flex items-center justify-between gap-3`}
                          >
                            <span className="font-medium text-ink-primary">{v.name}</span>
                            <span className={`text-body-s numeric shrink-0 ${weight > 0 ? "text-smile-700" : weight < 0 ? "text-frown-700" : "text-ink-tertiary"}`}>
                              {weight > 0 ? "+" : ""}{weight}
                            </span>
                          </div>
                          {compared.map((p) => {
                            const sc = scores.find(
                              (s) => s.propertyId === p.id && s.variableId === v.id,
                            );
                            return (
                              <div
                                key={`${v.id}-${p.id}`}
                                className={`p-4 ${vi > 0 ? "border-t border-border-subtle" : ""} flex items-center justify-center`}
                              >
                                {sc?.match === "yes" ? (
                                  <span className="inline-flex items-center gap-1 text-smile-700">
                                    <Check className="w-4 h-4" />
                                    {weight > 0 ? `+${weight}` : weight}
                                  </span>
                                ) : sc?.match === "no" ? (
                                  <span className="inline-flex items-center gap-1 text-ink-tertiary">
                                    <X className="w-4 h-4" />
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-ink-tertiary">
                                    <HelpCircle className="w-4 h-4" />
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
