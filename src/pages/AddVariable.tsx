import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Eyebrow, Input, SmileSlider, Textarea, AreaPill } from "@/components/ui";
import { useStore, currentUser } from "@/store/store";
import type { Area, ScorerKind } from "@/lib/types";
import { SlotBetweenConfirm } from "@/components/VariableRow";

export function AddVariable() {
  const nav = useNavigate();
  const variables = useStore((s) => s.variables);
  const states = useStore((s) => s.variableStates);
  const members = useStore((s) => s.rubric.members);
  const addVariable = useStore((s) => s.addVariable);
  const me = currentUser();

  const [step, setStep] = useState<"input" | "confirm">("input");
  const [name, setName] = useState("");
  const [area, setArea] = useState<Area>("In");
  const [definition, setDefinition] = useState("");
  const [weight, setWeight] = useState(5);
  const [scorer, setScorer] = useState<ScorerKind>("listing");
  const [partnerStart, setPartnerStart] = useState<"match" | "zero">("zero");

  // slot-between neighbors — sort by user's weight
  const neighbors = useMemo(() => {
    const sorted = [...variables]
      .map((v) => ({ v, w: states[v.id]?.weights[me.id] ?? 0 }))
      .sort((a, b) => a.w - b.w);
    const below = [...sorted].reverse().find((s) => s.w <= weight && s.v.name !== name);
    const above = sorted.find((s) => s.w >= weight && s.v.name !== name);
    return {
      below: below ? { name: below.v.name, weight: below.w } : null,
      above: above ? { name: above.v.name, weight: above.w } : null,
    };
  }, [variables, states, me.id, weight, name]);

  function commit() {
    const weights: Record<string, number> = {};
    for (const m of members) {
      weights[m.userId] = m.userId === me.id ? weight : partnerStart === "match" ? weight : 0;
    }
    addVariable(
      {
        name,
        area,
        definition,
        scorer,
        needsHuman: scorer === "helper",
        createdBy: me.id,
      },
      weights,
    );
    nav("/app/rubric");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Eyebrow className="mb-3">Add variable</Eyebrow>
      <h1 className="serif text-display-l text-ink-primary leading-[1.02] mb-8">
        What else matters?
      </h1>

      {step === "input" ? (
        <Card>
          <div className="space-y-5">
            <div>
              <label className="block eyebrow mb-2">Variable name</label>
              <Input
                placeholder="e.g. Open kitchen, Near a bodega, Under 40-min commute"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block eyebrow mb-2">Area</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value as Area)}
                  className="input-text"
                >
                  <option value="In">In the unit</option>
                  <option value="Building">Building</option>
                  <option value="Around">Around it</option>
                  <option value="Commute">Commute</option>
                </select>
              </div>
              <div>
                <label className="block eyebrow mb-2">Who scores this?</label>
                <select
                  value={scorer}
                  onChange={(e) => setScorer(e.target.value as ScorerKind)}
                  className="input-text"
                >
                  <option value="listing">Visible in listing (Claude)</option>
                  <option value="api">Measurable via API (commute, walk)</option>
                  <option value="web">Web-researchable (Claude)</option>
                  <option value="user">Subjective — me</option>
                  <option value="helper">Needs a site visit (paid helper)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block eyebrow mb-2">Definition (optional)</label>
              <Textarea
                placeholder="How strictly do you define a match? e.g. 'a separate, enclosed second bedroom with a window'."
                value={definition}
                onChange={(e) => setDefinition(e.target.value)}
              />
            </div>
            <div>
              <label className="block eyebrow mb-2">
                Your weight: <span className="numeric text-ink-primary">{weight > 0 ? "+" : ""}{weight}</span>
              </label>
              <div className="mt-2">
                <SmileSlider value={weight} onChange={setWeight} />
              </div>
              <div className="flex justify-between text-body-s text-ink-tertiary mt-2 tabular">
                <span>frown −25</span>
                <span>zero</span>
                <span>smile +25</span>
              </div>
            </div>

            {members.length > 1 && (
              <div>
                <label className="block eyebrow mb-2">Partner starting weight</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPartnerStart("zero")}
                    className={`pill ${partnerStart === "zero" ? "bg-ink-primary text-white" : "bg-bg-inset"}`}
                  >
                    Start at 0 — let them choose
                  </button>
                  <button
                    onClick={() => setPartnerStart("match")}
                    className={`pill ${partnerStart === "match" ? "bg-ink-primary text-white" : "bg-bg-inset"}`}
                  >
                    Match my weight
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Link to="/app/rubric" className="btn-link">Cancel</Link>
            <Button
              disabled={!name}
              onClick={() => setStep("confirm")}
            >
              Next → slot it in
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="mb-3">
            <AreaPill area={area} /> <span className="ml-2 font-semibold text-ink-primary">{name}</span>
          </div>
          <SlotBetweenConfirm
            candidate={{ name, weight }}
            below={neighbors.below}
            above={neighbors.above}
            onConfirm={commit}
            onRetry={() => setStep("input")}
          />
        </>
      )}
    </div>
  );
}
