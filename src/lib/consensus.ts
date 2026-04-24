import type { RubricMember, VariableState } from "./types";

export interface DeltaInfo {
  variableId: string;
  delta: number;
  minUserId: string;
  maxUserId: string;
  min: number;
  max: number;
  avg: number;
  canCompromise: boolean; // delta <= 2
  status: VariableState["status"];
}

export function maxPairwiseDelta(
  state: VariableState,
  members: RubricMember[],
): DeltaInfo {
  let min = Infinity;
  let max = -Infinity;
  let minUserId = members[0]!.userId;
  let maxUserId = members[0]!.userId;
  let sum = 0;
  let count = 0;
  for (const m of members) {
    const w = state.weights[m.userId];
    if (typeof w !== "number") continue;
    if (w < min) {
      min = w;
      minUserId = m.userId;
    }
    if (w > max) {
      max = w;
      maxUserId = m.userId;
    }
    sum += w;
    count++;
  }
  const delta = max - min;
  const avg = count > 0 ? Math.round(sum / count) : 0;
  return {
    variableId: "",
    delta,
    minUserId,
    maxUserId,
    min,
    max,
    avg,
    canCompromise: delta > 0 && delta <= 2,
    status: state.status,
  };
}

export function countConsensus(
  states: Record<string, VariableState>,
  members: RubricMember[],
): { total: number; agreed: number; open: number; forked: number } {
  let agreed = 0;
  let open = 0;
  let forked = 0;
  let total = 0;
  for (const [, s] of Object.entries(states)) {
    total++;
    if (s.status === "forked") {
      forked++;
      continue;
    }
    const d = maxPairwiseDelta(s, members);
    if (d.delta === 0) agreed++;
    else open++;
  }
  return { total, agreed, open, forked };
}

export function autoStatus(
  state: VariableState,
  members: RubricMember[],
): VariableState["status"] {
  if (state.status === "forked") return "forked";
  const d = maxPairwiseDelta(state, members);
  return d.delta === 0 ? "agreed" : "open";
}
