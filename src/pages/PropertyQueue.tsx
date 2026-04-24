import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Eyebrow, Pill, SectionHeader } from "@/components/ui";
import { useStore, currentUser, seedExampleProperties } from "@/store/store";
import { jointLeaderboard, leaderboardFor } from "@/lib/scoring";
import { fmtUsd, fmtNum, daysBetween } from "@/lib/id";
import { motion } from "framer-motion";
import { SmileGlyph, FrownGlyph } from "@/components/Glyph";
import { Plus, Eye } from "lucide-react";
import { AddPropertyModal } from "@/components/AddPropertyModal";

export function PropertyQueue() {
  const properties = useStore((s) => s.properties);
  const variables = useStore((s) => s.variables);
  const states = useStore((s) => s.variableStates);
  const scores = useStore((s) => s.scores);
  const members = useStore((s) => s.rubric.members);
  const fin = useStore((s) => s.financial);
  const viewMode = useStore((s) => s.viewMode);
  const searchDayStart = useStore((s) => s.searchDayStart);
  const me = currentUser();

  const [view, setView] = useState<"mine" | "joint">("joint");
  const [showAdd, setShowAdd] = useState(false);

  useMemo(() => {
    if (properties.length === 0 && variables.length > 0) {
      seedExampleProperties();
    }
  }, [properties.length, variables.length]);

  const joint = useMemo(
    () =>
      jointLeaderboard(
        members.map((m) => m.userId),
        properties,
        variables,
        states,
        scores,
        fin,
      ),
    [members, properties, variables, states, scores, fin],
  );
  const mine = useMemo(
    () => leaderboardFor(me.id, properties, variables, states, scores, fin),
    [me, properties, variables, states, scores, fin],
  );

  const rows = view === "mine" ? mine : joint.rows;
  const bestCost = rows[0]?.costPerSmile ?? null;
  const worstCost = rows[rows.length - 1]?.costPerSmile ?? null;

  const searchDay = searchDayStart ? daysBetween(searchDayStart) : 0;

  return (
    <div>
      <SectionHeader
        eyebrow="Property queue"
        title={
          properties.length === 0
            ? "Your queue is empty."
            : `${properties.length} properties, ranked.`
        }
        subtitle={
          properties.length === 0
            ? "Add the first property manually, or we'll start finding them tomorrow morning."
            : members.length > 1
              ? view === "joint" && joint.forked
                ? `Rubric is forked. Showing the ${rows.length} properties in everyone's top 10.`
                : view === "joint"
                  ? `Full consensus. Ranked by joint Cost per Smile.`
                  : `Your personal ranking. Your partner may see a different order.`
              : `Ranked by Cost per Smile.`
        }
        action={
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4" />
              Add property
            </Button>
          </div>
        }
      />

      {properties.length > 0 && members.length > 1 && (
        <div className="mb-6 inline-flex rounded bg-bg-inset p-1">
          <button
            onClick={() => setView("joint")}
            className={`px-4 py-2 rounded text-body font-medium ${view === "joint" ? "bg-bg-elevated text-ink-primary shadow-xs" : "text-ink-tertiary"}`}
          >
            Joint
          </button>
          <button
            onClick={() => setView("mine")}
            className={`px-4 py-2 rounded text-body font-medium ${view === "mine" ? "bg-bg-elevated text-ink-primary shadow-xs" : "text-ink-tertiary"}`}
          >
            {me.displayName}'s list
          </button>
        </div>
      )}

      {properties.length === 0 ? (
        <Card className="text-center py-20">
          <p className="text-heading-m font-semibold text-ink-primary mb-2">Quiet day.</p>
          <p className="text-body text-ink-tertiary mb-2">
            Zero new properties today. We'll email the moment we find one that matches your rubric.
          </p>
          <p className="eyebrow text-ink-tertiary">Search day {searchDay}</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Button onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4" />
              Add property manually
            </Button>
            <Button variant="ghost" onClick={() => seedExampleProperties()}>
              Load example properties
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {rows.map((row, idx) => {
            const isBest =
              bestCost !== null &&
              row.costPerSmile !== null &&
              worstCost !== null &&
              row.costPerSmile - bestCost <= (worstCost - bestCost) * 0.1;
            const isExpensive =
              worstCost !== null &&
              row.costPerSmile !== null &&
              row.costPerSmile - (bestCost ?? 0) >= (worstCost - (bestCost ?? 0)) * 0.75;
            return (
              <motion.div key={row.property.id} layout>
                <Link to={`/app/property/${row.property.id}`}>
                  <div className="card p-5 hover:bg-bg-muted transition-colors flex items-center gap-5">
                    <div className="text-caption text-ink-tertiary numeric w-6 text-center">
                      {idx + 1}
                    </div>
                    <img
                      src={row.property.photoUrl}
                      alt={row.property.address}
                      className="w-[88px] h-[88px] rounded-sm object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="serif text-heading-m md:text-heading-l text-ink-primary">
                          {row.property.address}
                        </h3>
                        {isBest && <Pill tone="value">Best Value</Pill>}
                        {isExpensive && <Pill tone="neutral">Expensive</Pill>}
                        {row.property.openHouse && (
                          <Pill tone="smile">Open {row.property.openHouse.datetime.split(",")[0]}</Pill>
                        )}
                      </div>
                      <p className="text-body-s text-ink-tertiary mt-0.5">
                        {row.property.neighborhood} · {fmtUsd(row.property.priceUsd)}
                      </p>
                      {viewMode === "power" && (
                        <div className="flex gap-4 mt-2 text-body-s text-ink-secondary tabular">
                          <span className="flex items-center gap-1">
                            <SmileGlyph className="w-3.5 h-3.5" /> {fmtNum(row.positive)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FrownGlyph className="w-3.5 h-3.5" /> {fmtNum(Math.abs(row.negative))}
                          </span>
                          <span>{fmtUsd(row.annualCost)}/yr</span>
                          <span>{row.knownCount}/{row.knownCount + row.unknownCount} scored</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="eyebrow">Cost / smile</p>
                      <p className="serif text-display-m text-ink-primary numeric">
                        {row.costPerSmile !== null ? fmtUsd(row.costPerSmile) : "—"}
                      </p>
                      <p className="text-body-s text-ink-tertiary numeric">
                        {fmtNum(Math.round(row.smile))} smiles
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {showAdd && <AddPropertyModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
