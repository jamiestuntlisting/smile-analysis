import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useStore, currentUser } from "@/store/store";
import { LogoMark } from "@/components/Glyph";
import { useMemo } from "react";
import { daysBetween, fmtUsd } from "@/lib/id";
import { countConsensus } from "@/lib/consensus";
import { isStepDone, STEPS } from "@/lib/progress";
import { DecisionsBar } from "./DecisionsBar";

/**
 * The tool's shell. A quiet top bar with section tabs, a decisions summary
 * strip that shows what's been locked in, and the page content below. Setup
 * tabs disappear as their outputs become concrete; ongoing tools stay.
 */

interface TabDef {
  path: string;
  label: string;
  badge?: string | null;
}

export function AppShell() {
  const user = currentUser();
  const loc = useLocation();
  const searchDayStart = useStore((s) => s.searchDayStart);

  const searchProfile = useStore((s) => s.searchProfile);
  const addresses = useStore((s) => s.addresses);
  const variables = useStore((s) => s.variables);
  const properties = useStore((s) => s.properties);
  const members = useStore((s) => s.rubric.members);
  const states = useStore((s) => s.variableStates);
  const progress = useStore((s) => s.progress);

  const derivedState = { searchProfile, addresses, variables, progress };

  const setupTabs: TabDef[] = useMemo(
    () =>
      STEPS.filter((s) => !isStepDone(derivedState, s.id)).map((s) => ({
        path: s.path,
        label: s.label,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchProfile, addresses, variables, progress],
  );

  const consensus = useMemo(
    () => countConsensus(states, members),
    [states, members],
  );

  const hasRubric = variables.length > 0;
  const hasProperties = properties.length > 0;

  const ongoingTabs: TabDef[] = useMemo(() => {
    const t: TabDef[] = [];
    if (hasRubric || properties.length > 0) {
      t.push({ path: "/app/queue", label: "Queue", badge: properties.length ? String(properties.length) : null });
    }
    if (hasRubric) t.push({ path: "/app/rubric", label: "Rubric", badge: String(variables.length) });
    if (hasRubric && members.length > 1) {
      t.push({
        path: "/app/consensus",
        label: "Consensus",
        badge: consensus.open + consensus.forked > 0 ? String(consensus.open + consensus.forked) : null,
      });
    }
    if (hasProperties) t.push({ path: "/app/compare", label: "Compare" });
    t.push({ path: "/app/analysis", label: "Analysis" });
    t.push({ path: "/app/settings", label: "Settings" });
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRubric, hasProperties, variables.length, properties.length, consensus.open, consensus.forked, members.length]);

  const searchDay = searchDayStart ? daysBetween(searchDayStart) : 0;

  // A couple of routes bypass the chrome (the property detail is focused)
  const isFocused = /\/app\/property\//.test(loc.pathname);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 bg-bg-base/95 backdrop-blur border-b border-border-subtle">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center gap-6 h-12">
          <NavLink to="/app" className="flex items-center gap-2 shrink-0">
            <LogoMark className="w-5 h-5" />
            <span className="text-body font-semibold text-ink-primary tracking-tight">
              Smile Analysis
            </span>
          </NavLink>
          <div className="flex-1 min-w-0" />
          <div className="flex items-center gap-4 text-body-s text-ink-tertiary">
            {searchDayStart && (
              <span className="tabular">Day {searchDay}</span>
            )}
            <span className="numeric">
              {searchProfile.ceilingUsd ? fmtUsd(searchProfile.ceilingUsd, { compact: true }) : "—"}
              <span className="text-ink-tertiary/80"> ceiling</span>
            </span>
            <div className="w-7 h-7 rounded-full bg-smile-100 flex items-center justify-center text-body-s font-medium text-smile-900">
              {user.displayName.slice(0, 1)}
            </div>
          </div>
        </div>
        {/* Tab row */}
        <div className="max-w-[1280px] mx-auto px-6 flex items-center gap-6 overflow-x-auto -mb-px">
          {setupTabs.length > 0 && (
            <>
              {setupTabs.map((t, i) => (
                <Tab key={t.path} {...t} numbered={i + 1} />
              ))}
              <span className="h-5 w-px bg-border-subtle shrink-0" />
            </>
          )}
          {ongoingTabs.map((t) => (
            <Tab key={t.path} {...t} />
          ))}
        </div>
      </header>

      <DecisionsBar />

      <main
        className={
          isFocused
            ? "max-w-[1240px] mx-auto px-6 py-8"
            : "max-w-[1280px] mx-auto px-6 py-8"
        }
      >
        <Outlet />
      </main>

      <footer className="max-w-[1280px] mx-auto px-6 py-6 mt-16 border-t border-border-subtle text-body-s text-ink-tertiary">
        Decision support. Not licensed real estate, legal, or tax advice.
      </footer>
    </div>
  );
}

function Tab({
  path,
  label,
  badge,
  numbered,
}: TabDef & { numbered?: number }) {
  return (
    <NavLink
      to={path}
      end={false}
      className={({ isActive }) =>
        `relative flex items-center gap-1.5 h-10 px-0.5 text-body border-b-2 transition-colors whitespace-nowrap ${
          isActive
            ? "border-ink-primary text-ink-primary font-semibold"
            : "border-transparent text-ink-tertiary hover:text-ink-primary"
        }`
      }
    >
      {numbered !== undefined && (
        <span className="eyebrow text-ink-tertiary tabular">
          {numbered.toString().padStart(2, "0")}
        </span>
      )}
      <span>{label}</span>
      {badge && (
        <span className="inline-flex items-center justify-center rounded-sm bg-bg-inset text-body-s px-1.5 h-5 tabular text-ink-secondary font-medium">
          {badge}
        </span>
      )}
    </NavLink>
  );
}
