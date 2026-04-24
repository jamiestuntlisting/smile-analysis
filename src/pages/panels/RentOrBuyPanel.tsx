import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Panel, Conclusion } from "@/components/Panel";
import { Button } from "@/components/ui";
import { useStore } from "@/store/store";
import { rentVsBuyProjection } from "@/lib/finance";
import { fmtUsd } from "@/lib/id";
import type { BuyRent } from "@/lib/types";
import { nextOpenStep } from "@/lib/progress";

export function RentOrBuyPanel() {
  const nav = useNavigate();
  const setProfile = useStore((s) => s.setSearchProfile);
  const searchProfile = useStore((s) => s.searchProfile);
  const fin = useStore((s) => s.financial);
  const startSearch = useStore((s) => s.startSearchDayClock);
  const addresses = useStore((s) => s.addresses);
  const variables = useStore((s) => s.variables);
  const progress = useStore((s) => s.progress);

  const [choice, setChoice] = useState<BuyRent | null>(
    searchProfile.buyOrRent === "undecided" ? null : searchProfile.buyOrRent,
  );
  const [helpMe, setHelpMe] = useState(false);
  const [priceInput, setPriceInput] = useState(
    searchProfile.ceilingUsd?.toString() ?? "1200000",
  );
  const [rentInput, setRentInput] = useState(
    searchProfile.currentRent?.toString() ?? "4200",
  );

  const projection = useMemo(() => {
    if (!helpMe) return null;
    return rentVsBuyProjection({
      priceUsd: Number(priceInput) || 0,
      monthlyRent: Number(rentInput) || 0,
      fin,
    });
  }, [helpMe, priceInput, rentInput, fin]);

  const options: { value: BuyRent; title: string; sub: string }[] = [
    { value: "buy", title: "Buying", sub: "I want to own. Build me a rubric and a search." },
    { value: "rent", title: "Renting", sub: "Buying-only for v1. We'll support rentals later." },
    { value: "both", title: "Both, in parallel", sub: "Show me buying and renting side-by-side when the time comes." },
  ];

  function lockIn(val: BuyRent) {
    setProfile({ buyOrRent: val });
    startSearch();
    const next = nextOpenStep({
      searchProfile: { ...searchProfile, buyOrRent: val },
      addresses,
      variables,
      progress,
    });
    nav(next ? next.path : "/app/queue");
  }

  return (
    <Panel
      step="Step 01"
      title="Are you buying, or renting, or deciding?"
      subtitle="The first decision. Everything else in this tool is built on it. You can change your mind later — this just sets the mode."
      width="wide"
    >
      <div className="grid md:grid-cols-3 gap-3">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => {
              setChoice(o.value);
              setHelpMe(false);
            }}
            className={`text-left rounded-md border p-5 transition-colors ${
              choice === o.value
                ? "border-ink-primary bg-bg-elevated"
                : "border-border-subtle bg-bg-elevated hover:border-border"
            }`}
          >
            <h3 className="text-heading-m font-semibold text-ink-primary">{o.title}</h3>
            <p className="text-body-s text-ink-tertiary mt-2">{o.sub}</p>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={() => {
            setHelpMe(!helpMe);
            setChoice(null);
          }}
          className={`text-left rounded-md border p-4 w-full transition-colors ${
            helpMe ? "border-ink-primary bg-bg-inset" : "border-dashed border-border hover:border-ink-primary"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-body font-semibold text-ink-primary">Help me decide</h3>
              <p className="text-body-s text-ink-tertiary mt-0.5">
                Run a 30-year net-worth projection. We'll say so honestly if renting wins.
              </p>
            </div>
            <span className="text-body-s text-action-500">
              {helpMe ? "Close" : "Open calculator"}
            </span>
          </div>
        </button>
      </div>

      {helpMe && (
        <div className="mt-4 rounded-md border border-border-subtle bg-bg-elevated p-5">
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <label className="block">
              <span className="eyebrow mb-2 block">Target home price</span>
              <input
                value={priceInput ? Number(priceInput).toLocaleString() : ""}
                onChange={(e) => setPriceInput(e.target.value.replace(/[^\d]/g, ""))}
                inputMode="numeric"
                className="input-text"
              />
            </label>
            <label className="block">
              <span className="eyebrow mb-2 block">Current monthly rent</span>
              <input
                value={rentInput ? Number(rentInput).toLocaleString() : ""}
                onChange={(e) => setRentInput(e.target.value.replace(/[^\d]/g, ""))}
                inputMode="numeric"
                className="input-text"
              />
            </label>
          </div>
          {projection && (
            <Conclusion
              label="30-year verdict"
              tone={projection.verdict === "rent" ? "frown" : projection.verdict === "buy" ? "smile" : "default"}
            >
              {projection.verdict === "buy" && (
                <>
                  <span className="font-semibold">Buying wins</span> — buy ends at{" "}
                  <span className="numeric">{fmtUsd(projection.buyNetWorth.at(-1) ?? 0)}</span>, rent-and-invest at{" "}
                  <span className="numeric">{fmtUsd(projection.rentNetWorth.at(-1) ?? 0)}</span>.
                </>
              )}
              {projection.verdict === "rent" && (
                <>
                  <span className="font-semibold">Renting wins</span> over 30 years —
                  rent-and-invest ends at{" "}
                  <span className="numeric">{fmtUsd(projection.rentNetWorth.at(-1) ?? 0)}</span>,
                  buy at{" "}
                  <span className="numeric">{fmtUsd(projection.buyNetWorth.at(-1) ?? 0)}</span>.
                </>
              )}
              {projection.verdict === "close" && (
                <>It's a tossup — within 5% of each other at 30 years.</>
              )}
            </Conclusion>
          )}
          <p className="text-body-s text-ink-tertiary mt-3">
            You can open the full projector under{" "}
            <a href="/app/analysis" className="btn-link">Analysis</a> any time.
          </p>
        </div>
      )}

      <div className="mt-10 pt-6 border-t border-border-subtle flex items-center justify-end gap-3">
        <Button
          onClick={() => choice && lockIn(choice)}
          disabled={!choice}
        >
          Lock in {choice ?? "a choice"} →
        </Button>
      </div>
    </Panel>
  );
}
