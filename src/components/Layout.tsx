import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useStore, currentUser } from "@/store/store";
import { Logo } from "@/components/Glyph";
import { useMemo } from "react";
import { daysBetween } from "@/lib/id";
import { countConsensus } from "@/lib/consensus";

const NAV = [
  { to: "/app/queue", label: "Queue" },
  { to: "/app/rubric", label: "Rubric" },
  { to: "/app/consensus", label: "Consensus" },
  { to: "/app/compare", label: "Compare" },
  { to: "/app/finance", label: "Rent-vs-Buy" },
  { to: "/app/open-houses", label: "Open houses" },
  { to: "/app/settings", label: "Settings" },
];

export function AppLayout() {
  const user = currentUser();
  const loc = useLocation();
  const searchDayStart = useStore((s) => s.searchDayStart);
  const members = useStore((s) => s.rubric.members);
  const states = useStore((s) => s.variableStates);
  const disagreements = useMemo(
    () => countConsensus(states, members),
    [states, members],
  );
  const searchDay = searchDayStart ? daysBetween(searchDayStart) : 0;

  const isKittens = loc.pathname.includes("kittens");
  const isOnboarding = /\/onboarding|\/calibration|\/places|\/categories|\/intake/.test(loc.pathname);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 bg-bg-base/85 backdrop-blur border-b border-border-subtle">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between h-16 px-6">
          <NavLink to="/app/queue">
            <Logo />
          </NavLink>
          {!isKittens && !isOnboarding && (
            <nav className="hidden md:flex items-center gap-1">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    `px-3 py-2 text-body rounded transition-colors ${
                      isActive
                        ? "text-ink-primary bg-bg-muted"
                        : "text-ink-tertiary hover:text-ink-primary hover:bg-bg-inset"
                    }`
                  }
                >
                  {n.label}
                  {n.to === "/app/consensus" && disagreements.open > 0 && (
                    <span className="ml-1.5 text-body-s text-smile-700">
                      · {disagreements.open}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          )}
          <div className="flex items-center gap-3">
            {searchDayStart && !isOnboarding && !isKittens && (
              <div className="eyebrow text-ink-tertiary hidden sm:block">
                Search day {searchDay}
              </div>
            )}
            <div className="w-8 h-8 rounded-full bg-smile-100 flex items-center justify-center text-body-s font-medium text-smile-900">
              {user.displayName.slice(0, 1)}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-[1240px] mx-auto px-6 py-10">
        <Outlet />
      </main>
      <footer className="max-w-[1240px] mx-auto px-6 py-10 mt-20 border-t border-border-subtle">
        <p className="eyebrow text-ink-tertiary">
          Smile Analysis · Decision support. We are not licensed real estate or tax professionals.
        </p>
      </footer>
    </div>
  );
}

export function PublicLayout() {
  return (
    <div className="min-h-screen">
      <header className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink to="/">
          <Logo />
        </NavLink>
        <div className="flex items-center gap-3">
          <NavLink to="/login" className="btn-link">Sign in</NavLink>
          <NavLink to="/signup" className="btn-primary">Start your rubric</NavLink>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="max-w-[1240px] mx-auto px-6 py-12 mt-24 border-t border-border-subtle">
        <div className="flex items-center justify-between">
          <Logo />
          <p className="text-body-s text-ink-tertiary">© 2026 Smile Analysis</p>
        </div>
      </footer>
    </div>
  );
}
