import { useStore } from "@/store/store";
import { AreaPill, SmileSlider, Pill, Button } from "./ui";
import type { Variable } from "@/lib/types";
import { SmileGlyph, FrownGlyph } from "./Glyph";
import { maxPairwiseDelta } from "@/lib/consensus";
import { Trash2, GitFork } from "lucide-react";

export function VariableRow({
  v,
  mode = "self",
  onRemove,
}: {
  v: Variable;
  mode?: "self" | "all";
  onRemove?: () => void;
}) {
  const state = useStore((s) => s.variableStates[v.id]);
  const members = useStore((s) => s.rubric.members);
  const currentUserId = useStore((s) => s.currentUserId);
  const setWeight = useStore((s) => s.setWeight);
  if (!state) return null;

  const delta = maxPairwiseDelta(state, members);
  const isForked = state.status === "forked";
  const hasOpenDisagreement = state.status === "open" && delta.delta > 0;
  const isFrowned = members.every((m) => (state.weights[m.userId] ?? 0) < 0);

  return (
    <div
      className={`border rounded-md p-5 transition-colors ${
        hasOpenDisagreement
          ? "bg-frown-50/50 border-frown-300/40"
          : isForked
            ? "bg-bg-inset border-border"
            : "bg-bg-elevated border-border-subtle"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <AreaPill area={v.area} />
          <span className="text-heading-m text-ink-primary font-semibold">
            {v.name}
          </span>
          {isForked && (
            <Pill tone="neutral" className="gap-1">
              <GitFork className="w-3 h-3" />
              forked
            </Pill>
          )}
          {isFrowned && <FrownGlyph className="w-4 h-4" />}
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-ink-tertiary hover:text-frown-500"
            aria-label="Remove variable"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      {v.definition && (
        <p className="text-body-s text-ink-tertiary mb-4">{v.definition}</p>
      )}

      {mode === "self" ? (
        <PartnerSliderRow
          memberId={currentUserId}
          members={members}
          weight={state.weights[currentUserId] ?? 0}
          onChange={(w) => setWeight(v.id, currentUserId, w)}
          showYou
        />
      ) : (
        <div className="space-y-3">
          {members.map((m) => (
            <PartnerSliderRow
              key={m.userId}
              memberId={m.userId}
              members={members}
              weight={state.weights[m.userId] ?? 0}
              onChange={(w) => setWeight(v.id, m.userId, w)}
              showYou={m.userId === currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PartnerSliderRow({
  memberId,
  members,
  weight,
  onChange,
  showYou,
}: {
  memberId: string;
  members: { userId: string; displayName: string; color: string }[];
  weight: number;
  onChange: (w: number) => void;
  showYou?: boolean;
}) {
  const m = members.find((x) => x.userId === memberId);
  if (!m) return null;
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: m.color }}
        />
        <span className="text-body-s text-ink-secondary">
          {m.displayName}
          {showYou && <span className="text-ink-tertiary"> (you)</span>}
        </span>
      </div>
      <div className="flex-1">
        <SmileSlider value={weight} onChange={onChange} />
      </div>
      <div className="w-16 text-right numeric text-body font-medium flex items-center justify-end gap-1">
        {weight > 0 ? (
          <SmileGlyph className="w-3.5 h-3.5" />
        ) : weight < 0 ? (
          <FrownGlyph className="w-3.5 h-3.5" />
        ) : null}
        <span className={weight > 0 ? "text-smile-700" : weight < 0 ? "text-frown-700" : "text-ink-tertiary"}>
          {weight > 0 ? "+" : ""}
          {weight}
        </span>
      </div>
    </div>
  );
}

export function SlotBetweenConfirm({
  candidate,
  below,
  above,
  onConfirm,
  onRetry,
}: {
  candidate: { name: string; weight: number };
  below: { name: string; weight: number } | null;
  above: { name: string; weight: number } | null;
  onConfirm: () => void;
  onRetry: () => void;
}) {
  const w = candidate.weight;
  const sentence =
    below && above
      ? `${w > 0 ? "+" + w + " smiles" : w + " smiles"} would put this between ${below.name} (${below.weight > 0 ? "+" + below.weight : below.weight}) and ${above.name} (${above.weight > 0 ? "+" + above.weight : above.weight}).`
      : below
        ? `${w > 0 ? "+" + w + " smiles" : w + " smiles"} would put this just above ${below.name} (${below.weight > 0 ? "+" + below.weight : below.weight}).`
        : above
          ? `${w > 0 ? "+" + w + " smiles" : w + " smiles"} would put this just below ${above.name} (${above.weight > 0 ? "+" + above.weight : above.weight}).`
          : `${w > 0 ? "+" + w + " smiles" : w + " smiles"} — this is your first variable.`;

  return (
    <div className="card p-6">
      <p className="serif text-heading-l text-ink-primary">{sentence}</p>
      <p className="text-body-l text-ink-tertiary mt-2">Sounds right?</p>
      <div className="mt-6 flex gap-3">
        <Button variant="smile" onClick={onConfirm}>
          Yes, that's right
        </Button>
        <Button variant="ghost" onClick={onRetry}>
          Try a different weight
        </Button>
      </div>
    </div>
  );
}
