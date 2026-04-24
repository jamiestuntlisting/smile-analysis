import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Panel, Conclusion } from "@/components/Panel";
import { Button } from "@/components/ui";
import { useStore } from "@/store/store";
import { affordabilityCeiling } from "@/lib/finance";
import { fmtUsd } from "@/lib/id";
import { nextOpenStep } from "@/lib/progress";

export function BudgetPanel() {
  const nav = useNavigate();
  const searchProfile = useStore((s) => s.searchProfile);
  const setProfile = useStore((s) => s.setSearchProfile);
  const addresses = useStore((s) => s.addresses);
  const variables = useStore((s) => s.variables);
  const progress = useStore((s) => s.progress);

  const [mode, setMode] = useState<"know" | "estimate">(
    searchProfile.ceilingUsd ? "know" : "estimate",
  );
  const [ceiling, setCeiling] = useState(searchProfile.ceilingUsd?.toString() ?? "");
  const [savings, setSavings] = useState(searchProfile.savings?.toString() ?? "");
  const [income, setIncome] = useState(searchProfile.income?.toString() ?? "");
  const [rent, setRent] = useState(searchProfile.currentRent?.toString() ?? "");

  const computed = useMemo(() => {
    if (mode !== "estimate") return null;
    if (!savings || !income || !rent) return null;
    return affordabilityCeiling({
      savings: Number(savings),
      income: Number(income),
      currentRent: Number(rent),
    });
  }, [mode, savings, income, rent]);

  const canContinue = mode === "know" ? Boolean(ceiling) : Boolean(computed);

  function lockIn() {
    const value = mode === "know" ? Number(ceiling) : computed;
    if (!value) return;
    setProfile({
      ceilingUsd: value,
      savings: savings ? Number(savings) : searchProfile.savings,
      income: income ? Number(income) : searchProfile.income,
      currentRent: rent ? Number(rent) : searchProfile.currentRent,
    });
    const next = nextOpenStep({
      searchProfile: { ...searchProfile, ceilingUsd: value },
      addresses,
      variables,
      progress,
    });
    nav(next ? next.path : "/app/queue");
  }

  return (
    <Panel
      step="Step 02"
      title="What can you afford?"
      subtitle="A rough ceiling, not a commitment. Refine it later. Lenders will give you a different number; this is the one you use to decide what's in scope for the search."
      width="wide"
    >
      <div className="inline-flex rounded bg-bg-inset p-1 mb-6">
        <button
          onClick={() => setMode("know")}
          className={`px-4 py-1.5 rounded text-body font-medium ${mode === "know" ? "bg-bg-elevated text-ink-primary shadow-xs" : "text-ink-tertiary"}`}
        >
          I know my number
        </button>
        <button
          onClick={() => setMode("estimate")}
          className={`px-4 py-1.5 rounded text-body font-medium ${mode === "estimate" ? "bg-bg-elevated text-ink-primary shadow-xs" : "text-ink-tertiary"}`}
        >
          Estimate it for me
        </button>
      </div>

      {mode === "know" ? (
        <div className="max-w-lg">
          <label className="block eyebrow mb-2">Ceiling</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary text-body">$</span>
            <input
              value={ceiling ? Number(ceiling).toLocaleString() : ""}
              onChange={(e) => setCeiling(e.target.value.replace(/[^\d]/g, ""))}
              inputMode="numeric"
              placeholder="1,250,000"
              className="input-text !text-heading-m !pl-8 !py-3"
            />
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
          <LabeledMoney label="Savings" value={savings} onChange={setSavings} placeholder="120,000" />
          <LabeledMoney label="Annual household income" value={income} onChange={setIncome} placeholder="220,000" />
          <LabeledMoney label="Current rent (per month)" value={rent} onChange={setRent} placeholder="3,800" />
        </div>
      )}

      {computed !== null && computed > 0 && (
        <Conclusion label="Conservative estimate" tone="action">
          <div className="flex items-end gap-3 flex-wrap">
            <span className="serif text-display-m text-ink-primary tracking-tight">
              {fmtUsd(computed)}
            </span>
            <span className="text-body text-ink-secondary">
              Assumes 20% down, 6.5% rate, housing ≤ 31% of gross income. Talk to a lender to refine.
            </span>
          </div>
        </Conclusion>
      )}

      <div className="mt-10 pt-6 border-t border-border-subtle flex items-center justify-end">
        <Button onClick={lockIn} disabled={!canContinue}>
          Lock in{" "}
          {mode === "know" && ceiling
            ? fmtUsd(Number(ceiling), { compact: true })
            : computed
              ? fmtUsd(computed, { compact: true })
              : "ceiling"}{" "}
          →
        </Button>
      </div>
    </Panel>
  );
}

function LabeledMoney({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block eyebrow mb-2">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary text-body">$</span>
        <input
          placeholder={placeholder}
          value={value ? Number(value).toLocaleString() : ""}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
          inputMode="numeric"
          className="input-text !pl-8"
        />
      </div>
    </div>
  );
}
