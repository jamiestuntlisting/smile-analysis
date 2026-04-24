import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Panel } from "@/components/Panel";
import { Button, Input } from "@/components/ui";
import { CATEGORY_SUGGESTIONS } from "@/data/properties";
import { useStore } from "@/store/store";
import { nextOpenStep } from "@/lib/progress";
import { Check, Plus } from "lucide-react";

export function CategoriesPanel() {
  const nav = useNavigate();
  const members = useStore((s) => s.rubric.members);
  const existing = useStore((s) => s.variables);
  const addVariable = useStore((s) => s.addVariable);
  const markProgress = useStore((s) => s.markProgress);
  const searchProfile = useStore((s) => s.searchProfile);
  const addresses = useStore((s) => s.addresses);
  const progress = useStore((s) => s.progress);

  const [picks, setPicks] = useState<Set<string>>(new Set());
  const [custom, setCustom] = useState("");
  const [query, setQuery] = useState("");

  const existingNames = useMemo(
    () => new Set(existing.map((v) => v.name.toLowerCase())),
    [existing],
  );
  const pool = useMemo(
    () =>
      CATEGORY_SUGGESTIONS.filter(
        (c) =>
          !existingNames.has(c.name.toLowerCase()) &&
          (!query || c.name.toLowerCase().includes(query.toLowerCase())),
      ),
    [existingNames, query],
  );
  const grouped = useMemo(() => {
    const out: Record<string, typeof pool> = {};
    for (const c of pool) {
      out[c.group] = out[c.group] ?? [];
      out[c.group]!.push(c);
    }
    return out;
  }, [pool]);

  function toggle(name: string) {
    const n = new Set(picks);
    if (n.has(name)) n.delete(name);
    else n.add(name);
    setPicks(n);
  }
  function addCustom() {
    if (!custom.trim()) return;
    setPicks(new Set([...picks, `__custom__:${custom.trim()}`]));
    setCustom("");
  }

  function lockIn() {
    for (const p of picks) {
      if (p.startsWith("__custom__:")) {
        const name = p.slice(11);
        const weights: Record<string, number> = {};
        for (const m of members) weights[m.userId] = 5;
        addVariable(
          {
            name,
            area: "Around",
            definition: "Something you want near home.",
            scorer: "api",
            needsHuman: false,
            createdBy: members[0]!.userId,
          },
          weights,
        );
      } else {
        const cat = CATEGORY_SUGGESTIONS.find((c) => c.name === p);
        if (!cat) continue;
        const weights: Record<string, number> = {};
        for (const m of members) weights[m.userId] = cat.suggestedWeight;
        addVariable(
          {
            name: cat.name,
            area: cat.area,
            definition: cat.definition,
            scorer: "api",
            needsHuman: false,
            createdBy: members[0]!.userId,
          },
          weights,
        );
      }
    }
    markProgress("categoriesDone", true);
    const next = nextOpenStep({
      searchProfile,
      addresses,
      variables: [...existing], // will be stale but progress flag carries us
      progress: { ...progress, categoriesDone: true },
    });
    nav(next ? next.path : "/app/queue");
  }

  const total = picks.size + existing.length;

  return (
    <Panel
      step="Step 04"
      title="What do you want near home?"
      subtitle="Pick anything that would make a place better. More is better — strong rubrics have 40+ variables. You'll weight them in a later step."
      action={
        <Input
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="!w-56"
        />
      }
      width="wide"
      footer={
        <>
          <span className="text-body-s text-ink-tertiary">
            {picks.size} picked · {total} total on your rubric
          </span>
          <Button onClick={lockIn} disabled={picks.size === 0}>
            Add {picks.size} and continue →
          </Button>
        </>
      }
    >
      {Object.keys(grouped).length === 0 && (
        <div className="rounded-md border border-dashed border-border-subtle p-6 text-center text-body-s text-ink-tertiary">
          No matches. Add your own below.
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group}>
            <div className="flex items-baseline gap-3 mb-3">
              <h3 className="text-heading-m font-semibold text-ink-primary">{group}</h3>
              <span className="text-body-s text-ink-tertiary">{items.length}</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {items.map((c) => {
                const active = picks.has(c.name);
                return (
                  <button
                    key={c.name}
                    onClick={() => toggle(c.name)}
                    className={`text-left rounded border p-3 transition-colors flex items-start justify-between gap-3 ${
                      active
                        ? "border-ink-primary bg-bg-elevated"
                        : "border-border-subtle bg-bg-elevated hover:border-border"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-ink-primary leading-snug">{c.name}</p>
                      <p className="text-body-s text-ink-tertiary mt-0.5 leading-snug">{c.definition}</p>
                    </div>
                    <span
                      className={`shrink-0 w-5 h-5 rounded-sm flex items-center justify-center border ${
                        active ? "bg-ink-primary text-white border-ink-primary" : "border-border"
                      }`}
                    >
                      {active ? <Check className="w-3 h-3" strokeWidth={3} /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-md border border-border-subtle bg-bg-elevated p-4">
        <label className="block eyebrow mb-2">Custom variable</label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. climbing gym, a specific friend's block, good Thai"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
          />
          <Button variant="ghost" onClick={addCustom} disabled={!custom.trim()}>
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
        {[...picks].filter((p) => p.startsWith("__custom__:")).length > 0 && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {[...picks]
              .filter((p) => p.startsWith("__custom__:"))
              .map((p) => (
                <button
                  key={p}
                  onClick={() => toggle(p)}
                  className="pill bg-smile-100 text-smile-900 text-body-s"
                >
                  {p.slice(11)} ✕
                </button>
              ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
