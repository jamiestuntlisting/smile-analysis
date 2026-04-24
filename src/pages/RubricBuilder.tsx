import { Link } from "react-router-dom";
import { Button, Card, Eyebrow, Pill, SectionHeader } from "@/components/ui";
import { useStore } from "@/store/store";
import { VariableRow } from "@/components/VariableRow";
import { Plus, Sliders } from "lucide-react";
import type { Area, Variable } from "@/lib/types";
import { useMemo, useState } from "react";
import { countConsensus } from "@/lib/consensus";

const AREAS: Area[] = ["In", "Building", "Around", "Commute"];

export function RubricBuilder() {
  const variables = useStore((s) => s.variables);
  const states = useStore((s) => s.variableStates);
  const members = useStore((s) => s.rubric.members);
  const removeVariable = useStore((s) => s.removeVariable);
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);

  const [showingArea, setShowingArea] = useState<Area | "All">("All");
  const [partnerMode, setPartnerMode] = useState<"self" | "all">("self");

  const filtered = variables.filter(
    (v) => showingArea === "All" || v.area === showingArea,
  );

  const grouped = useMemo(() => {
    const out: Record<Area, Variable[]> = {
      In: [],
      Building: [],
      Around: [],
      Commute: [],
    };
    for (const v of filtered) out[v.area].push(v);
    for (const k of AREAS)
      out[k].sort(
        (a, b) =>
          Math.abs(states[b.id]?.weights[members[0]!.userId] ?? 0) -
          Math.abs(states[a.id]?.weights[members[0]!.userId] ?? 0),
      );
    return out;
  }, [filtered, states, members]);

  const counts = countConsensus(states, members);

  return (
    <div>
      <SectionHeader
        title={
          variables.length === 0
            ? "Rubric"
            : `Rubric · ${variables.length} variables`
        }
        subtitle={
          variables.length === 0
            ? "Every variable that makes a property better or worse. The rubric is how every property gets scored."
            : `${counts.agreed} agreed · ${counts.open} open · ${counts.forked} forked`
        }
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === "simple" ? "power" : "simple")}
              className="btn-ghost !py-2"
              title="Toggle view mode"
            >
              <Sliders className="w-4 h-4" />
              {viewMode === "simple" ? "Power view" : "Simple view"}
            </button>
            <Link to="/app/rubric/add" className="btn-primary">
              <Plus className="w-4 h-4" />
              Add variable
            </Link>
          </div>
        }
      />

      {variables.length === 0 ? (
        <div className="rounded-md border border-dashed border-border-subtle p-10 text-center">
          <p className="text-heading-m font-semibold text-ink-primary">Empty rubric.</p>
          <p className="text-body text-ink-tertiary mt-2">
            Add a variable or run the calibration flow against sold homes.
          </p>
          <div className="mt-5 flex gap-3 justify-center">
            <Link to="/app/calibration" className="btn-ghost">Open calibration</Link>
            <Link to="/app/rubric/add" className="btn-primary">Add variable</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <button
              onClick={() => setShowingArea("All")}
              className={`pill ${showingArea === "All" ? "bg-ink-primary text-white" : "bg-bg-inset"}`}
            >
              All
            </button>
            {AREAS.map((a) => (
              <button
                key={a}
                onClick={() => setShowingArea(a)}
                className={`pill ${showingArea === a ? "bg-ink-primary text-white" : "bg-bg-inset"}`}
              >
                {a}
              </button>
            ))}
            <div className="flex-1" />
            {members.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="eyebrow">Showing sliders:</span>
                <div className="inline-flex rounded bg-bg-inset p-1">
                  <button
                    onClick={() => setPartnerMode("self")}
                    className={`px-3 py-1.5 rounded text-body-s font-medium ${partnerMode === "self" ? "bg-bg-elevated text-ink-primary shadow-xs" : "text-ink-tertiary"}`}
                  >
                    Just me
                  </button>
                  <button
                    onClick={() => setPartnerMode("all")}
                    className={`px-3 py-1.5 rounded text-body-s font-medium ${partnerMode === "all" ? "bg-bg-elevated text-ink-primary shadow-xs" : "text-ink-tertiary"}`}
                  >
                    All partners
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-10">
            {AREAS.filter(
              (a) => showingArea === "All" || showingArea === a,
            ).map((area) => (
              grouped[area].length > 0 && (
                <div key={area}>
                  <Eyebrow className="mb-3">
                    {area === "In"
                      ? "In the unit"
                      : area === "Building"
                        ? "Building"
                        : area === "Around"
                          ? "Around it"
                          : "Commute"} · {grouped[area].length}
                  </Eyebrow>
                  <div className="space-y-3">
                    {grouped[area].map((v) => (
                      <VariableRow
                        key={v.id}
                        v={v}
                        mode={partnerMode}
                        onRemove={() => removeVariable(v.id)}
                      />
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </>
      )}

      {counts.open > 0 && (
        <Card className="mt-10 !bg-bg-inset !border-0">
          <div className="flex items-center justify-between gap-5">
            <div>
              <Eyebrow>Consensus</Eyebrow>
              <p className="text-body-l text-ink-primary mt-1">
                You disagree on {counts.open} of {counts.total} variables.
              </p>
              <p className="text-body text-ink-tertiary">
                That's healthy — 90% of couples disagree on something.
              </p>
            </div>
            <Link to="/app/consensus" className="btn-primary">
              Open Consensus
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
