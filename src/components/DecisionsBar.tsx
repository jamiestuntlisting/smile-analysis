import { Link, useLocation } from "react-router-dom";
import { useStore } from "@/store/store";
import { fmtUsd } from "@/lib/id";
import { isStepDone } from "@/lib/progress";
import { Pencil } from "lucide-react";

/**
 * Thin strip under the tab bar that shows every decision the user has already
 * locked in: buy-vs-rent, budget, places, category count, calibration, weights.
 * Each chip links back to edit the decision. Hidden if nothing is decided yet
 * or when the user is already on a setup step (reduces noise).
 */
export function DecisionsBar() {
  const loc = useLocation();
  const searchProfile = useStore((s) => s.searchProfile);
  const addresses = useStore((s) => s.addresses);
  const variables = useStore((s) => s.variables);
  const progress = useStore((s) => s.progress);
  const properties = useStore((s) => s.properties);

  const derived = { searchProfile, addresses, variables, progress };

  const chips: { label: string; value: string; href: string; key: string }[] = [];

  if (isStepDone(derived, "rent-or-buy")) {
    const map: Record<string, string> = {
      buy: "Buying",
      rent: "Renting",
      both: "Buying & renting",
      undecided: "—",
    };
    chips.push({
      key: "rent-or-buy",
      label: "Mode",
      value: map[searchProfile.buyOrRent] ?? searchProfile.buyOrRent,
      href: "/app/rent-or-buy",
    });
  }
  if (isStepDone(derived, "budget")) {
    chips.push({
      key: "budget",
      label: "Budget ceiling",
      value: fmtUsd(searchProfile.ceilingUsd ?? 0, { compact: true }),
      href: "/app/budget",
    });
  }
  if (isStepDone(derived, "places")) {
    chips.push({
      key: "places",
      label: "Places",
      value: `${addresses.length} saved`,
      href: "/app/places",
    });
  }
  if (isStepDone(derived, "categories")) {
    chips.push({
      key: "categories",
      label: "Categories",
      value: `${variables.length} variables`,
      href: "/app/categories",
    });
  }
  if (isStepDone(derived, "calibration")) {
    chips.push({
      key: "calibration",
      label: "Calibration",
      value: `${variables.length} on rubric`,
      href: "/app/calibration",
    });
  }
  if (isStepDone(derived, "weights")) {
    chips.push({
      key: "weights",
      label: "Weights",
      value: "set",
      href: "/app/weights",
    });
  }
  if (properties.length > 0) {
    chips.push({
      key: "properties",
      label: "Properties",
      value: String(properties.length),
      href: "/app/queue",
    });
  }

  // Don't show on an active setup step (you're already editing something)
  const onSetupPage = /^\/app\/(rent-or-buy|budget|places|categories|calibration|weights)/.test(
    loc.pathname,
  );

  if (chips.length === 0 || onSetupPage) {
    return null;
  }

  return (
    <div className="border-b border-border-subtle bg-bg-inset/60">
      <div className="max-w-[1280px] mx-auto px-6 py-2 flex items-center gap-4 overflow-x-auto">
        <span className="eyebrow text-ink-tertiary shrink-0">Decisions</span>
        <div className="flex items-center gap-2 flex-wrap">
          {chips.map((c) => (
            <Link
              key={c.key}
              to={c.href}
              className="group flex items-center gap-2 px-2.5 py-1 rounded bg-bg-elevated border border-border-subtle text-body-s hover:border-ink-primary transition-colors"
            >
              <span className="text-ink-tertiary">{c.label}:</span>
              <span className="font-medium text-ink-primary numeric">{c.value}</span>
              <Pencil className="w-3 h-3 text-ink-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
