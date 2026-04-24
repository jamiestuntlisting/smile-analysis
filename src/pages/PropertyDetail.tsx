import { Link, useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useStore, currentUser } from "@/store/store";
import { leaderboardFor, smileScoreFor, annualCost, costPerSmile } from "@/lib/scoring";
import { CostPerSmileCard } from "@/components/CostPerSmileCard";
import { NetSmilesCard } from "@/components/NetSmilesCard";
import { Button, Card, Eyebrow, Pill, AreaPill } from "@/components/ui";
import { fmtUsd } from "@/lib/id";
import { SmileGlyph, FrownGlyph } from "@/components/Glyph";
import type { Area, ScoreMatch } from "@/lib/types";
import { HelpCircle, Check, X, AlertTriangle, Trash2, ArrowLeft, ChevronDown } from "lucide-react";

export function PropertyDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const properties = useStore((s) => s.properties);
  const variables = useStore((s) => s.variables);
  const states = useStore((s) => s.variableStates);
  const scores = useStore((s) => s.scores);
  const setScore = useStore((s) => s.setScore);
  const removeProperty = useStore((s) => s.removeProperty);
  const fin = useStore((s) => s.financial);
  const me = currentUser();

  const [showDetails, setShowDetails] = useState(false);
  const [showListing, setShowListing] = useState(false);

  const property = properties.find((p) => p.id === id);
  const leader = useMemo(
    () => leaderboardFor(me.id, properties, variables, states, scores, fin),
    [me, properties, variables, states, scores, fin],
  );

  if (!property) {
    return (
      <div>
        <Link to="/app/queue" className="btn-link mb-6 inline-flex">
          <ArrowLeft className="w-4 h-4" /> Back to queue
        </Link>
        <p className="text-heading-m font-semibold text-ink-primary">Property not found.</p>
      </div>
    );
  }

  const s = smileScoreFor(me.id, property, variables, states, scores);
  const ac = annualCost(property, fin);
  const cps = costPerSmile(ac, s.total);
  const rank = leader.findIndex((r) => r.property.id === id) + 1;
  const totalRanked = leader.length;

  const bestCps = leader.find((r) => r.costPerSmile !== null)?.costPerSmile ?? null;
  const worstCps =
    [...leader].reverse().find((r) => r.costPerSmile !== null)?.costPerSmile ?? null;
  const badge: "best" | "expensive" | null =
    cps !== null && bestCps !== null && worstCps !== null
      ? cps - bestCps <= (worstCps - bestCps) * 0.1
        ? "best"
        : cps - bestCps >= (worstCps - bestCps) * 0.75
          ? "expensive"
          : null
      : null;

  return (
    <div>
      <Link to="/app/queue" className="btn-link inline-flex mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to queue
      </Link>

      {/* 1. Focus on the property: photo + address + price */}
      {property.photoUrl && (
        <img
          src={property.photoUrl}
          alt={property.address}
          className="w-full h-[360px] md:h-[440px] object-cover rounded-md mb-8"
        />
      )}

      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <Eyebrow>{property.neighborhood}</Eyebrow>
          <h1 className="text-heading-l font-semibold text-ink-primary mt-1 tracking-tight">
            {property.address}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-body text-ink-secondary numeric">
            <span className="font-medium">{fmtUsd(property.priceUsd)}</span>
            {property.sqft && <span>· {property.sqft.toLocaleString()} sqft</span>}
          </div>
        </div>
        {property.openHouse && (
          <Pill tone="smile" className="!text-body">Open: {property.openHouse.datetime}</Pill>
        )}
      </div>

      {/* 2. The evaluation: net smiles + cost per smile, side by side */}
      <div className="grid md:grid-cols-2 gap-5 mb-14">
        <NetSmilesCard
          net={s.total}
          smiles={s.positive}
          frowns={Math.abs(s.negative)}
          matched={s.matchedCount}
          known={s.knownCount}
        />
        <CostPerSmileCard
          cost={cps}
          smile={s.total}
          annual={ac}
          rank={rank > 0 ? rank : undefined}
          outOf={totalRanked}
          badge={badge}
        />
      </div>

      {/* 3. Variable breakdown — the detailed view of HOW this score was built */}
      <div className="mb-14">
        <div className="flex items-end justify-between mb-5">
          <div>
            <Eyebrow>Variable breakdown</Eyebrow>
            <h2 className="text-heading-m font-semibold text-ink-primary mt-1">
              How this score was built.
            </h2>
          </div>
        </div>
        <VariableBreakdown
          propertyId={property.id}
          onSetMatch={(vid, m) =>
            setScore({
              propertyId: property.id,
              variableId: vid,
              match: m,
              confidence: "high",
              scoredBy: "user",
            })
          }
        />
      </div>

      {/* 4. Everything else lives under collapsed details */}
      <div className="space-y-3">
        <Collapsible
          label="Listing description"
          open={showListing}
          onToggle={() => setShowListing(!showListing)}
        >
          <p className="text-body text-ink-primary leading-[1.55]">
            {property.listingDescription || "No description saved."}
          </p>
        </Collapsible>

        <Collapsible
          label="Price & carrying cost details"
          open={showDetails}
          onToggle={() => setShowDetails(!showDetails)}
        >
          <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-body text-ink-primary max-w-md">
            <dt className="text-ink-tertiary">List price</dt>
            <dd className="numeric text-right">{fmtUsd(property.priceUsd)}</dd>
            <dt className="text-ink-tertiary">HOA / month</dt>
            <dd className="numeric text-right">{fmtUsd(property.hoaUsd / 12)}</dd>
            <dt className="text-ink-tertiary">Taxes / year</dt>
            <dd className="numeric text-right">{fmtUsd(property.taxesUsd)}</dd>
            <dt className="text-ink-tertiary">Insurance / year</dt>
            <dd className="numeric text-right">{fmtUsd(property.insuranceUsd)}</dd>
            <dt className="text-ink-tertiary border-t border-border-subtle pt-2 mt-2">
              Annual cost (all-in)
            </dt>
            <dd className="numeric text-right border-t border-border-subtle pt-2 mt-2 font-semibold">
              {fmtUsd(ac)}
            </dd>
          </dl>
        </Collapsible>
      </div>

      {/* 5. Actions pushed to the very bottom */}
      <div className="mt-12 pt-6 border-t border-border-subtle flex gap-3 flex-wrap">
        <Link to={`/app/property/${property.id}/pricing`} className="btn-ghost">
          Pricing analysis
        </Link>
        <Link to="/app/finance" className="btn-ghost">
          Rent-vs-buy vs this place
        </Link>
        <button
          onClick={() => {
            if (confirm("Remove this property?")) {
              removeProperty(property.id);
              nav("/app/queue");
            }
          }}
          className="btn-ghost !text-frown-700 ml-auto"
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </button>
      </div>
    </div>
  );
}

function Collapsible({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="card !p-0 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-bg-muted/50 transition-colors"
      >
        <span className="font-semibold text-ink-primary">{label}</span>
        <ChevronDown
          className={`w-4 h-4 text-ink-tertiary transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="px-5 pb-5 border-t border-border-subtle pt-5">{children}</div>}
    </div>
  );
}

function VariableBreakdown({
  propertyId,
  onSetMatch,
}: {
  propertyId: string;
  onSetMatch: (vid: string, m: ScoreMatch) => void;
}) {
  const variables = useStore((s) => s.variables);
  const states = useStore((s) => s.variableStates);
  const scores = useStore((s) => s.scores);
  const me = currentUser();

  const AREAS: { key: Area; label: string }[] = [
    { key: "In", label: "In the unit" },
    { key: "Building", label: "Building" },
    { key: "Around", label: "Around it" },
    { key: "Commute", label: "Commute" },
  ];

  // Sort each area by |weight| so heavy hitters surface first.
  return (
    <div className="space-y-8">
      {AREAS.map(({ key, label }) => {
        const forArea = variables
          .filter((v) => v.area === key)
          .sort(
            (a, b) =>
              Math.abs(states[b.id]?.weights[me.id] ?? 0) -
              Math.abs(states[a.id]?.weights[me.id] ?? 0),
          );
        if (forArea.length === 0) return null;
        return (
          <div key={key}>
            <Eyebrow className="mb-3">{label} · {forArea.length}</Eyebrow>
            <div className="rounded-md border border-border-subtle overflow-hidden bg-bg-elevated divide-y divide-border-subtle">
              {forArea.map((v) => {
                const score = scores.find(
                  (sc) => sc.propertyId === propertyId && sc.variableId === v.id,
                );
                const weight = states[v.id]?.weights[me.id] ?? 0;
                return (
                  <ScoreRow
                    key={v.id}
                    name={v.name}
                    weight={weight}
                    match={score?.match ?? "unknown"}
                    scoredBy={score?.scoredBy ?? "claude"}
                    confidence={score?.confidence ?? "med"}
                    onSetMatch={(m) => onSetMatch(v.id, m)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScoreRow({
  name,
  weight,
  match,
  scoredBy,
  confidence,
  onSetMatch,
}: {
  name: string;
  weight: number;
  match: ScoreMatch;
  scoredBy: string;
  confidence: string;
  onSetMatch: (m: ScoreMatch) => void;
}) {
  const isPositive = weight > 0;
  const isNegative = weight < 0;
  const matched = match === "yes";

  // Contribution to net smiles: weight × (matched ? 1 : 0)
  const contribution = matched ? weight : 0;

  return (
    <div className="flex items-center gap-3 p-4 hover:bg-bg-muted/40 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-ink-primary">{name}</p>
        <p className="text-body-s text-ink-tertiary">
          scored by {scoredBy}
          {confidence === "low" && scoredBy === "claude" && (
            <span className="inline-flex items-center gap-1 ml-2 text-frown-700">
              <AlertTriangle className="w-3 h-3" />
              verify?
            </span>
          )}
        </p>
      </div>

      {/* 3-state scorer button */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSetMatch("yes")}
          className={`w-8 h-8 flex items-center justify-center rounded-sm border transition-colors ${match === "yes" ? "bg-smile-500 text-white border-smile-500" : "border-border-subtle hover:bg-smile-50"}`}
          aria-label="Match"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={() => onSetMatch("no")}
          className={`w-8 h-8 flex items-center justify-center rounded-sm border transition-colors ${match === "no" ? "bg-frown-500 text-white border-frown-500" : "border-border-subtle hover:bg-frown-50"}`}
          aria-label="No match"
        >
          <X className="w-4 h-4" />
        </button>
        <button
          onClick={() => onSetMatch("unknown")}
          className={`w-8 h-8 flex items-center justify-center rounded-sm border transition-colors ${match === "unknown" ? "bg-bg-muted border-ink-primary" : "border-border-subtle border-dashed hover:bg-bg-muted"}`}
          aria-label="Unknown"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Contribution column — shows how much this variable is contributing right now. */}
      <div className="w-24 text-right numeric text-body flex items-center justify-end gap-1.5">
        {matched ? (
          <>
            {isPositive ? (
              <SmileGlyph className="w-3.5 h-3.5" />
            ) : isNegative ? (
              <FrownGlyph className="w-3.5 h-3.5" />
            ) : null}
            <span
              className={`font-semibold ${contribution > 0 ? "text-smile-700" : contribution < 0 ? "text-frown-700" : "text-ink-tertiary"}`}
            >
              {contribution > 0 ? "+" : ""}
              {contribution}
            </span>
          </>
        ) : (
          <span className="text-ink-tertiary text-body-s">
            (worth {weight > 0 ? "+" : ""}
            {weight})
          </span>
        )}
      </div>
    </div>
  );
}
