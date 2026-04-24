import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore, currentUser } from "@/store/store";
import { leaderboardFor } from "@/lib/scoring";
import { Card, Eyebrow, Pill, SectionHeader } from "@/components/ui";
import { fmtUsd } from "@/lib/id";
import { Calendar } from "lucide-react";

export function OpenHouses() {
  const properties = useStore((s) => s.properties);
  const variables = useStore((s) => s.variables);
  const states = useStore((s) => s.variableStates);
  const scores = useStore((s) => s.scores);
  const fin = useStore((s) => s.financial);
  const me = currentUser();

  const leaderboard = useMemo(
    () => leaderboardFor(me.id, properties, variables, states, scores, fin),
    [me, properties, variables, states, scores, fin],
  );

  const top10 = leaderboard.slice(0, 10);
  const topWithOH = top10.filter((r) => r.property.openHouse);
  const otherOH = leaderboard
    .slice(10)
    .filter((r) => r.property.openHouse);

  return (
    <div>
      <SectionHeader
        eyebrow="Open houses"
        title={
          topWithOH.length === 0
            ? "No top-10 open houses this week."
            : `${topWithOH.length} of your top 10 have open houses.`
        }
        subtitle="We surface open houses on properties that crack your top 10 first. Then everything else."
      />

      {topWithOH.length > 0 && (
        <>
          <Eyebrow className="mb-3">In your top 10</Eyebrow>
          <div className="space-y-3 mb-10">
            {topWithOH.map((row, i) => (
              <Link key={row.property.id} to={`/app/property/${row.property.id}`}>
                <Card className="flex items-center gap-5 hover:bg-bg-muted transition-colors">
                  <img
                    src={row.property.photoUrl}
                    alt={row.property.address}
                    className="w-20 h-20 object-cover rounded-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="serif text-heading-m text-ink-primary">
                        {row.property.address}
                      </span>
                      <Pill tone="smile">#{leaderboard.indexOf(row) + 1}</Pill>
                    </div>
                    <p className="text-body-s text-ink-tertiary">{row.property.neighborhood}</p>
                    <p className="text-body text-ink-primary mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-action-500" />
                      {row.property.openHouse!.datetime}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="eyebrow">Cost / smile</p>
                    <p className="serif text-heading-l text-ink-primary">
                      {row.costPerSmile !== null ? fmtUsd(row.costPerSmile) : "—"}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}

      {otherOH.length > 0 && (
        <>
          <Eyebrow className="mb-3">Other open houses</Eyebrow>
          <div className="space-y-3">
            {otherOH.map((row) => (
              <Link key={row.property.id} to={`/app/property/${row.property.id}`}>
                <Card className="!bg-bg-inset !border-0 flex items-center gap-5 hover:bg-bg-muted transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink-primary">{row.property.address}</p>
                    <p className="text-body-s text-ink-tertiary">
                      {row.property.openHouse!.datetime}
                    </p>
                  </div>
                  <p className="text-body-s text-ink-tertiary">
                    #{leaderboard.indexOf(row) + 1}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}

      {topWithOH.length === 0 && otherOH.length === 0 && (
        <Card className="text-center py-16">
          <p className="text-heading-m font-semibold text-ink-primary mb-2">Quiet weekend.</p>
          <p className="text-body text-ink-tertiary">
            We'll email when a property in your top 10 schedules one.
          </p>
        </Card>
      )}
    </div>
  );
}
