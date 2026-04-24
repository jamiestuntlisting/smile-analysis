import { useMemo, useState } from "react";
import { Panel, PanelSection } from "@/components/Panel";
import { Input, Pill } from "@/components/ui";
import { rentVsBuyProjection } from "@/lib/finance";
import { useStore } from "@/store/store";
import { fmtUsd } from "@/lib/id";

/**
 * The always-available Analysis tool. Used during setup (via Rent-or-buy) and
 * remains accessible as a tab afterwards for revisiting assumptions.
 */
export function AnalysisPanel() {
  const fin = useStore((s) => s.financial);
  const setFinancial = useStore((s) => s.setFinancial);
  const searchProfile = useStore((s) => s.searchProfile);

  const [price, setPrice] = useState(searchProfile.ceilingUsd?.toString() ?? "1200000");
  const [rent, setRent] = useState(searchProfile.currentRent?.toString() ?? "4200");
  const [rateStr, setRateStr] = useState((fin.interestRate * 100).toFixed(2));

  const projection = useMemo(
    () =>
      rentVsBuyProjection({
        priceUsd: Number(price) || 0,
        monthlyRent: Number(rent) || 0,
        fin: { ...fin, interestRate: Number(rateStr) / 100 },
      }),
    [price, rent, rateStr, fin],
  );

  const maxY = Math.max(...projection.buyNetWorth, ...projection.rentNetWorth);
  const chartWidth = 720;
  const chartHeight = 280;
  const padX = 24;
  const padY = 20;
  const plotW = chartWidth - padX * 2;
  const plotH = chartHeight - padY * 2;

  function path(data: number[]) {
    return data
      .map((v, i) => {
        const x = padX + (i / (data.length - 1)) * plotW;
        const y = padY + plotH - (v / maxY) * plotH;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }

  return (
    <Panel
      title="Rent-vs-buy analysis"
      subtitle="30-year net-worth projection under both scenarios. If renting wins on your inputs, we'll say so."
      width="wide"
    >
      <div className="grid lg:grid-cols-[320px_1fr] gap-8 items-start">
        <div className="rounded-md border border-border-subtle bg-bg-elevated p-5 space-y-4">
          <Field label="Home price">
            <Input
              value={price ? Number(price).toLocaleString() : ""}
              onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
              inputMode="numeric"
            />
          </Field>
          <Field label="Current monthly rent">
            <Input
              value={rent ? Number(rent).toLocaleString() : ""}
              onChange={(e) => setRent(e.target.value.replace(/[^\d]/g, ""))}
              inputMode="numeric"
            />
          </Field>
          <Field label="Interest rate (%)">
            <Input
              value={rateStr}
              onChange={(e) => setRateStr(e.target.value)}
              inputMode="decimal"
            />
          </Field>
          <Field label={`Down payment ${(fin.downPaymentPct * 100).toFixed(0)}%`}>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={fin.downPaymentPct * 100}
              onChange={(e) => setFinancial({ downPaymentPct: Number(e.target.value) / 100 })}
              className="w-full"
            />
          </Field>
          <Field label={`Horizon ${fin.horizonYears} yr`}>
            <input
              type="range"
              min={5}
              max={30}
              step={5}
              value={fin.horizonYears}
              onChange={(e) => setFinancial({ horizonYears: Number(e.target.value) })}
              className="w-full"
            />
          </Field>
        </div>

        <div>
          <div className="rounded-md border border-border-subtle bg-bg-elevated p-6">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="eyebrow text-ink-tertiary">Verdict · {fin.horizonYears} years</div>
                <p className="text-heading-l text-ink-primary mt-1 font-semibold">
                  {projection.verdict === "buy" && <>Buying wins.</>}
                  {projection.verdict === "rent" && <>Renting + investing wins.</>}
                  {projection.verdict === "close" && <>Within 5% — it's a tossup.</>}
                </p>
                <p className="text-body text-ink-secondary mt-1">
                  Buy ends at{" "}
                  <span className="numeric font-medium text-ink-primary">
                    {fmtUsd(projection.buyNetWorth.at(-1) ?? 0)}
                  </span>
                  ; rent+invest ends at{" "}
                  <span className="numeric font-medium text-ink-primary">
                    {fmtUsd(projection.rentNetWorth.at(-1) ?? 0)}
                  </span>
                  {projection.crossoverYear &&
                    `. Lines cross around year ${projection.crossoverYear}.`}
                </p>
              </div>
              <Pill
                tone={
                  projection.verdict === "rent"
                    ? "frown"
                    : projection.verdict === "buy"
                      ? "value"
                      : "neutral"
                }
              >
                {projection.verdict}
              </Pill>
            </div>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto mt-4">
              {Array.from({ length: 5 }).map((_, i) => {
                const y = padY + (i / 4) * plotH;
                return (
                  <line
                    key={i}
                    x1={padX}
                    x2={chartWidth - padX}
                    y1={y}
                    y2={y}
                    stroke="#E4DCCB"
                    strokeWidth={1}
                  />
                );
              })}
              <path
                d={path(projection.buyNetWorth)}
                fill="none"
                stroke="#D89B1F"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              <path
                d={path(projection.rentNetWorth)}
                fill="none"
                stroke="#3A4A8C"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray="6 4"
              />
            </svg>
            <div className="mt-3 flex items-center gap-5 text-body-s">
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-0.5 bg-smile-500" /> Buy net worth
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 border-t-2 border-dashed border-action-500" />
                Rent + invest
              </span>
            </div>
          </div>
        </div>
      </div>

      <PanelSection
        title="Pricing"
        subtitle="Paste 3–5 recent sold comps on a specific property's page to check if it's priced right."
      >
        <p className="text-body text-ink-secondary">
          Open any property from the{" "}
          <a className="btn-link" href="/app/queue">Queue</a> and click "Pricing analysis."
        </p>
      </PanelSection>
    </Panel>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow text-ink-tertiary mb-2">{label}</div>
      {children}
    </div>
  );
}
