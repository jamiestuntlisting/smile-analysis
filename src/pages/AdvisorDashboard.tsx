import { useMemo, useState } from "react";
import { useStore, currentUser } from "@/store/store";
import { leaderboardFor } from "@/lib/scoring";
import { countConsensus } from "@/lib/consensus";
import { Card, Eyebrow, Pill, SectionHeader, Textarea } from "@/components/ui";
import { fmtUsd } from "@/lib/id";
import { Link } from "react-router-dom";

export function AdvisorDashboard() {
  const me = currentUser();
  const rubric = useStore((s) => s.rubric);
  const variables = useStore((s) => s.variables);
  const states = useStore((s) => s.variableStates);
  const scores = useStore((s) => s.scores);
  const properties = useStore((s) => s.properties);
  const fin = useStore((s) => s.financial);
  const profile = useStore((s) => s.searchProfile);

  const top = useMemo(
    () => leaderboardFor(me.id, properties, variables, states, scores, fin).slice(0, 5),
    [me, properties, variables, states, scores, fin],
  );
  const disagreements = countConsensus(states, rubric.members);

  const [notes, setNotes] = useState(
    () => localStorage.getItem("advisor-notes-" + rubric.id) ?? "",
  );

  return (
    <div>
      <SectionHeader
        eyebrow="Advisor dashboard · on-request"
        title="Ready for a working session."
        subtitle="Everything an advisor needs to run a 45-minute session: rubric summary, open disagreements, top picks."
      />

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <Eyebrow>Rubric summary</Eyebrow>
            <div className="mt-3 grid grid-cols-4 gap-4 tabular">
              <Stat label="Variables" value={variables.length} />
              <Stat label="Agreed" value={disagreements.agreed} />
              <Stat label="Open" value={disagreements.open} tone="frown" />
              <Stat label="Forked" value={disagreements.forked} tone="action" />
            </div>
          </Card>

          <Card>
            <Eyebrow className="mb-3">Top 5 picks for {me.displayName}</Eyebrow>
            <div className="space-y-2">
              {top.map((row, i) => (
                <Link
                  key={row.property.id}
                  to={`/app/property/${row.property.id}`}
                  className="flex items-center gap-3 p-3 border border-border-subtle rounded hover:bg-bg-muted"
                >
                  <span className="eyebrow numeric w-6 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink-primary">{row.property.address}</p>
                    <p className="text-body-s text-ink-tertiary">{row.property.neighborhood}</p>
                  </div>
                  <span className="serif text-heading-m text-ink-primary numeric">
                    {row.costPerSmile !== null ? fmtUsd(row.costPerSmile) : "—"}
                  </span>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <Eyebrow className="mb-3">Open disagreements</Eyebrow>
            {disagreements.open === 0 ? (
              <p className="text-body text-ink-tertiary">None open.</p>
            ) : (
              <p className="text-body text-ink-secondary">
                <Link to="/app/consensus" className="btn-link">Open the Consensus page →</Link>
              </p>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <Eyebrow className="mb-3">Client at a glance</Eyebrow>
            <dl className="text-body space-y-2 text-ink-primary">
              <Line label="Members" value={rubric.members.map((m) => m.displayName).join(" & ")} />
              <Line label="Search mode" value={profile.buyOrRent} />
              <Line label="Budget ceiling" value={profile.ceilingUsd ? fmtUsd(profile.ceilingUsd) : "—"} />
              <Line label="Timeline" value={profile.timeline || "—"} />
              <Line label="Tier" value={me.tier} />
            </dl>
          </Card>

          <Card>
            <Eyebrow className="mb-3">Running notes</Eyebrow>
            <Textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                localStorage.setItem("advisor-notes-" + rubric.id, e.target.value);
              }}
              placeholder="Things you discussed. Things to follow up on."
              className="min-h-[220px]"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "frown" | "action" }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p
        className={`text-heading-l font-semibold numeric ${tone === "frown" ? "text-frown-700" : tone === "action" ? "text-action-500" : "text-ink-primary"}`}
      >
        {value}
      </p>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-tertiary text-body-s">{label}</dt>
      <dd className="font-medium capitalize">{value}</dd>
    </div>
  );
}
