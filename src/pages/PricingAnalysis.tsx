import { Link, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { Button, Card, Eyebrow, Input } from "@/components/ui";
import { useStore } from "@/store/store";
import { pricingAnalysis } from "@/lib/finance";
import { fmtUsd } from "@/lib/id";
import { ArrowLeft, Plus, X } from "lucide-react";

export function PricingAnalysis() {
  const { id } = useParams();
  const property = useStore((s) => s.properties.find((p) => p.id === id));
  const [comps, setComps] = useState([
    { price: "", sqft: "" },
    { price: "", sqft: "" },
    { price: "", sqft: "" },
  ]);

  const result = useMemo(() => {
    const parsed = comps
      .map((c) => ({ price: Number(c.price), sqft: Number(c.sqft) }))
      .filter((c) => c.price > 0 && c.sqft > 0);
    if (!property || parsed.length === 0) return null;
    return pricingAnalysis({
      subjectPrice: property.priceUsd,
      subjectSqft: property.sqft ?? 0,
      comps: parsed,
    });
  }, [comps, property]);

  if (!property) {
    return (
      <div>
        <Link to="/app/queue" className="btn-link mb-6 inline-flex">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <p className="text-heading-m font-semibold text-ink-primary">Property not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link to={`/app/property/${property.id}`} className="btn-link inline-flex mb-6">
        <ArrowLeft className="w-4 h-4" /> {property.address}
      </Link>
      <Eyebrow>Pricing analysis · v1 (pasted comps)</Eyebrow>
      <h1 className="serif text-display-l text-ink-primary leading-[1.02] mt-1">
        Is this place priced right?
      </h1>
      <p className="text-body-l text-ink-tertiary mt-4 max-w-xl">
        Paste 3–5 recently-sold comparable sales from StreetEasy or the MLS.
        We'll back out price-per-sqft and tell you where this listing sits.
      </p>

      <Card className="mt-10">
        <div className="grid grid-cols-2 gap-3 eyebrow text-ink-tertiary mb-3">
          <span>Sold price</span>
          <span>Square feet</span>
        </div>
        <div className="space-y-3">
          {comps.map((c, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3">
              <Input
                placeholder="1,420,000"
                value={c.price ? Number(c.price).toLocaleString() : ""}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^\d]/g, "");
                  setComps(comps.map((x, j) => (j === i ? { ...x, price: v } : x)));
                }}
                inputMode="numeric"
              />
              <Input
                placeholder="1,200"
                value={c.sqft}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^\d]/g, "");
                  setComps(comps.map((x, j) => (j === i ? { ...x, sqft: v } : x)));
                }}
                inputMode="numeric"
              />
              {comps.length > 1 && (
                <button
                  onClick={() => setComps(comps.filter((_, j) => j !== i))}
                  className="text-ink-tertiary hover:text-frown-500"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {comps.length < 5 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-4"
            onClick={() => setComps([...comps, { price: "", sqft: "" }])}
          >
            <Plus className="w-4 h-4" /> Another comp
          </Button>
        )}
      </Card>

      {result && (
        <Card className="mt-6 !p-8">
          <Eyebrow>Verdict</Eyebrow>
          <p className="serif text-display-m text-ink-primary mt-2 leading-[1.1]">
            {property.address.split(",")[0]} is priced{" "}
            <span
              className={
                result.verdict === "over"
                  ? "text-frown-700"
                  : result.verdict === "under"
                    ? "text-value-500"
                    : "text-smile-700"
              }
            >
              {fmtUsd(Math.abs(result.deltaPpsf))}/sqft{" "}
              {result.verdict === "over"
                ? "above"
                : result.verdict === "under"
                  ? "below"
                  : "in line with"}
            </span>{" "}
            recent comparable sales — roughly {Math.round(Math.abs(result.pct) * 100)}%{" "}
            {result.verdict === "over" ? "over" : result.verdict === "under" ? "under" : "at"} market.
          </p>
          <div className="hairline mt-6 pt-5 grid grid-cols-3 gap-5 numeric">
            <div>
              <p className="eyebrow">This listing</p>
              <p className="text-heading-l text-ink-primary">{fmtUsd(result.subjectPpsf)}/sqft</p>
            </div>
            <div>
              <p className="eyebrow">Comp average</p>
              <p className="text-heading-l text-ink-primary">{fmtUsd(result.avgCompPpsf)}/sqft</p>
            </div>
            <div>
              <p className="eyebrow">Suggested ceiling</p>
              <p className="text-heading-l text-ink-primary">{fmtUsd(result.fairValue)}</p>
            </div>
          </div>
          <p className="text-body-s text-ink-tertiary mt-6">
            A warning light, not a recommendation. Comps don't account for condition, views, floor, or how much you like it.
          </p>
        </Card>
      )}
    </div>
  );
}
