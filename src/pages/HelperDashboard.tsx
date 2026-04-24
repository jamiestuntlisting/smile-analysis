import { useMemo, useState } from "react";
import { useStore } from "@/store/store";
import { Button, Card, Eyebrow, Pill, SectionHeader, Textarea } from "@/components/ui";
import type { ScoreMatch } from "@/lib/types";

export function HelperDashboard() {
  const variables = useStore((s) => s.variables);
  const properties = useStore((s) => s.properties);
  const scores = useStore((s) => s.scores);
  const setScore = useStore((s) => s.setScore);

  const tasks = useMemo(() => {
    const helperVars = variables.filter((v) => v.needsHuman || v.scorer === "helper");
    const out: {
      property: (typeof properties)[number];
      variable: (typeof variables)[number];
    }[] = [];
    for (const p of properties) {
      for (const v of helperVars) {
        const existing = scores.find(
          (s) => s.propertyId === p.id && s.variableId === v.id,
        );
        if (!existing || existing.match === "unknown") {
          out.push({ property: p, variable: v });
        }
      }
    }
    return out;
  }, [variables, properties, scores]);

  const [open, setOpen] = useState<string | null>(tasks[0] ? `${tasks[0].property.id}-${tasks[0].variable.id}` : null);
  const [note, setNote] = useState("");
  const [sitVisit, setSiteVisit] = useState(false);

  function submit(taskKey: string, match: ScoreMatch) {
    const [pid, vid] = taskKey.split("-");
    setScore({
      propertyId: pid!,
      variableId: vid!,
      match,
      confidence: sitVisit ? "high" : "med",
      scoredBy: "helper",
      note,
    });
    setNote("");
    setSiteVisit(false);
    const rem = tasks.filter((t) => `${t.property.id}-${t.variable.id}` !== taskKey);
    setOpen(rem[0] ? `${rem[0].property.id}-${rem[0].variable.id}` : null);
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Helper dashboard · paid 2 backend"
        title={`${tasks.length} variables waiting for a human.`}
        subtitle="These are the things Claude can't evaluate from a listing — site-visits, subjective judgment, deep research."
      />

      {tasks.length === 0 && (
        <Card className="text-center py-16">
          <p className="text-heading-m font-semibold text-ink-primary">Inbox zero.</p>
          <p className="text-body text-ink-tertiary mt-2">
            No helper-queued variables are unresolved. Nice.
          </p>
        </Card>
      )}

      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        {tasks.length > 0 && (
          <>
            <Card className="!p-3 max-h-[60vh] overflow-y-auto">
              {tasks.map((t) => {
                const key = `${t.property.id}-${t.variable.id}`;
                return (
                  <button
                    key={key}
                    onClick={() => setOpen(key)}
                    className={`w-full text-left p-3 rounded transition-colors ${open === key ? "bg-smile-50 border-l-2 border-smile-500" : "hover:bg-bg-muted"}`}
                  >
                    <p className="font-medium text-ink-primary">{t.variable.name}</p>
                    <p className="text-body-s text-ink-tertiary truncate">{t.property.address}</p>
                  </button>
                );
              })}
            </Card>
            {open && (() => {
              const [pid, vid] = open.split("-");
              const task = tasks.find(
                (t) => t.property.id === pid && t.variable.id === vid,
              );
              if (!task) return null;
              return (
                <Card className="!p-7">
                  <Eyebrow>Task</Eyebrow>
                  <h2 className="serif text-heading-l text-ink-primary mt-2">
                    Does <span className="italic">{task.property.address}</span> match
                    <br />
                    <span className="text-smile-700">{task.variable.name}</span>?
                  </h2>
                  {task.variable.definition && (
                    <p className="text-body text-ink-secondary mt-3">{task.variable.definition}</p>
                  )}
                  <div className="mt-5">
                    {task.property.photoUrl && (
                      <img
                        src={task.property.photoUrl}
                        alt={task.property.address}
                        className="w-full h-56 object-cover rounded-sm"
                      />
                    )}
                  </div>
                  {task.property.listingDescription && (
                    <div className="mt-4 p-4 bg-bg-inset rounded-md">
                      <Eyebrow className="mb-1">Listing description</Eyebrow>
                      <p className="text-body text-ink-secondary">{task.property.listingDescription}</p>
                    </div>
                  )}
                  <div className="mt-5">
                    <label className="block eyebrow mb-2">Your notes</label>
                    <Textarea
                      placeholder="What did you check? What did you find? Link sources if relevant."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <label className="mt-3 inline-flex items-center gap-2 text-body-s text-ink-secondary">
                      <input
                        type="checkbox"
                        checked={sitVisit}
                        onChange={(e) => setSiteVisit(e.target.checked)}
                      />
                      I actually went there (raises confidence)
                    </label>
                  </div>
                  <div className="mt-6 flex gap-3 flex-wrap">
                    <Button variant="smile" onClick={() => submit(open, "yes")}>
                      Matches
                    </Button>
                    <Button variant="ghost" onClick={() => submit(open, "no")} className="!text-frown-700">
                      Doesn't match
                    </Button>
                    <Button variant="ghost" onClick={() => submit(open, "unknown")}>
                      Can't tell
                    </Button>
                  </div>
                </Card>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
}
