import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Panel } from "@/components/Panel";
import { Button, SmileSlider, AreaPill } from "@/components/ui";
import { useStore, currentUser, seedExampleProperties } from "@/store/store";
import { SmileGlyph, FrownGlyph } from "@/components/Glyph";
import type { Variable } from "@/lib/types";

/**
 * Last setup step. Every variable the user created so far gets a real weight.
 * Grouped by sign (the like/dislike split preserved from earlier steps) so the
 * user can work top-down. Heavy items bubble up within each group.
 */
export function WeightsPanel() {
  const nav = useNavigate();
  const me = currentUser();
  const variables = useStore((s) => s.variables);
  const states = useStore((s) => s.variableStates);
  const setWeight = useStore((s) => s.setWeight);
  const markProgress = useStore((s) => s.markProgress);

  const { likes, dislikes } = useMemo(() => {
    const likes: Variable[] = [];
    const dislikes: Variable[] = [];
    for (const v of variables) {
      const w = states[v.id]?.weights[me.id] ?? 0;
      if (w < 0) dislikes.push(v);
      else likes.push(v);
    }
    const by = (a: Variable, b: Variable) =>
      Math.abs(states[b.id]?.weights[me.id] ?? 0) -
      Math.abs(states[a.id]?.weights[me.id] ?? 0);
    likes.sort(by);
    dislikes.sort(by);
    return { likes, dislikes };
  }, [variables, states, me.id]);

  const hasWorkToDo = variables.length > 0;
  const allZero = variables.every((v) => (states[v.id]?.weights[me.id] ?? 0) === 0);

  function lockIn() {
    markProgress("weightsDone", true);
    seedExampleProperties();
    nav("/app/queue");
  }

  if (!hasWorkToDo) {
    return (
      <Panel
        step="Step 06"
        title="No variables yet."
        subtitle="Go back to Categories or Calibration and build a list before setting weights."
        width="narrow"
      >
        <Button onClick={() => nav("/app/categories")}>Open Categories</Button>
      </Panel>
    );
  }

  return (
    <Panel
      step="Step 06"
      title="How much does each one matter?"
      subtitle="0 = doesn't really matter. +25 = would change our life. −25 on a dislike is a dealbreaker. Use Shift+arrow for bigger steps."
      width="wide"
      footer={
        <>
          <span className="text-body-s text-ink-tertiary">
            {likes.length} likes · {dislikes.length} dislikes
          </span>
          <Button onClick={lockIn} disabled={allZero}>
            Rubric is ready — see properties →
          </Button>
        </>
      }
    >
      {likes.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <SmileGlyph className="w-5 h-5" />
            <h2 className="text-heading-m font-semibold text-ink-primary">
              Things I like
            </h2>
            <span className="text-body-s text-ink-tertiary">({likes.length})</span>
          </div>
          <div className="rounded-md border border-border-subtle bg-bg-elevated divide-y divide-border-subtle overflow-hidden">
            {likes.map((v) => (
              <WeightRow
                key={v.id}
                v={v}
                value={states[v.id]?.weights[me.id] ?? 0}
                onChange={(w) => setWeight(v.id, me.id, w)}
              />
            ))}
          </div>
        </section>
      )}

      {dislikes.length > 0 && (
        <section className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <FrownGlyph className="w-5 h-5" />
            <h2 className="text-heading-m font-semibold text-ink-primary">
              Things I don't like
            </h2>
            <span className="text-body-s text-ink-tertiary">({dislikes.length})</span>
          </div>
          <div className="rounded-md border border-border-subtle bg-bg-elevated divide-y divide-border-subtle overflow-hidden">
            {dislikes.map((v) => (
              <WeightRow
                key={v.id}
                v={v}
                value={states[v.id]?.weights[me.id] ?? 0}
                onChange={(w) => setWeight(v.id, me.id, w)}
              />
            ))}
          </div>
        </section>
      )}
    </Panel>
  );
}

function WeightRow({
  v,
  value,
  onChange,
}: {
  v: Variable;
  value: number;
  onChange: (w: number) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(240px,1fr)_minmax(240px,320px)_56px] items-center gap-4 px-4 py-3 hover:bg-bg-muted/40 transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        <AreaPill area={v.area} />
        <span className="font-medium text-ink-primary truncate">{v.name}</span>
      </div>
      <SmileSlider value={value} onChange={onChange} />
      <div className="text-right numeric text-body font-semibold flex items-center justify-end gap-1">
        {value > 0 ? (
          <SmileGlyph className="w-3.5 h-3.5" />
        ) : value < 0 ? (
          <FrownGlyph className="w-3.5 h-3.5" />
        ) : null}
        <span
          className={
            value > 0 ? "text-smile-700" : value < 0 ? "text-frown-700" : "text-ink-tertiary"
          }
        >
          {value > 0 ? "+" : ""}
          {value}
        </span>
      </div>
    </div>
  );
}
