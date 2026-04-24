import type {
  FinancialAssumptions,
  Property,
  PropertyScore,
  Variable,
  VariableState,
} from "./types";

export function annualCost(
  p: Property,
  fin: FinancialAssumptions,
): number {
  const principal = p.priceUsd * (1 - fin.downPaymentPct);
  const monthlyRate = fin.interestRate / 12;
  const n = fin.horizonYears * 12;
  const monthlyPayment =
    monthlyRate === 0
      ? principal / n
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
  return monthlyPayment * 12 + p.hoaUsd + p.taxesUsd + p.insuranceUsd;
}

/**
 * Smile score for a user against a property. For each variable the user has
 * a non-zero weight on, sum weight × matched (1 for match, 0 for no, 0 for
 * unknown). Negative weights against a match still subtract — that's how a
 * "frown" variable hurts when the property has the frown-producing feature.
 */
export function smileScoreFor(
  userId: string,
  property: Property,
  variables: Variable[],
  states: Record<string, VariableState>,
  scores: PropertyScore[],
): { total: number; positive: number; negative: number; matchedCount: number; knownCount: number; unknownCount: number } {
  let total = 0;
  let positive = 0;
  let negative = 0;
  let matchedCount = 0;
  let knownCount = 0;
  let unknownCount = 0;

  for (const v of variables) {
    const state = states[v.id];
    if (!state) continue;
    const weight = state.weights[userId] ?? 0;
    if (weight === 0) continue;

    const score = scores.find(
      (s) => s.propertyId === property.id && s.variableId === v.id,
    );
    if (!score || score.match === "unknown") {
      unknownCount++;
      continue;
    }
    knownCount++;
    if (score.match === "yes") {
      matchedCount++;
      total += weight;
      if (weight > 0) positive += weight;
      else negative += weight;
    }
    // if match === 'no', contribute 0
  }
  return { total, positive, negative, matchedCount, knownCount, unknownCount };
}

export function costPerSmile(
  annual: number,
  smile: number,
): number | null {
  if (smile <= 0) return null;
  return annual / smile;
}

export interface LeaderboardRow {
  property: Property;
  smile: number;
  positive: number;
  negative: number;
  annualCost: number;
  costPerSmile: number | null;
  matchedCount: number;
  knownCount: number;
  unknownCount: number;
}

export function leaderboardFor(
  userId: string,
  properties: Property[],
  variables: Variable[],
  states: Record<string, VariableState>,
  scores: PropertyScore[],
  fin: FinancialAssumptions,
): LeaderboardRow[] {
  return properties
    .map((p) => {
      const s = smileScoreFor(userId, p, variables, states, scores);
      const ac = annualCost(p, fin);
      return {
        property: p,
        smile: s.total,
        positive: s.positive,
        negative: s.negative,
        annualCost: ac,
        costPerSmile: costPerSmile(ac, s.total),
        matchedCount: s.matchedCount,
        knownCount: s.knownCount,
        unknownCount: s.unknownCount,
      };
    })
    .sort((a, b) => {
      if (a.costPerSmile === null && b.costPerSmile === null) return b.smile - a.smile;
      if (a.costPerSmile === null) return 1;
      if (b.costPerSmile === null) return -1;
      return a.costPerSmile - b.costPerSmile;
    });
}

/**
 * Joint leaderboard: if rubric is fully consensus, use average weights and
 * rank normally. If any variable is forked, only show properties that appear
 * in the top-N of every member's personal ranking.
 */
export function jointLeaderboard(
  memberIds: string[],
  properties: Property[],
  variables: Variable[],
  states: Record<string, VariableState>,
  scores: PropertyScore[],
  fin: FinancialAssumptions,
  topN = 10,
): { rows: LeaderboardRow[]; forked: boolean } {
  const anyForked = Object.values(states).some((s) => s.status === "forked");

  if (!anyForked) {
    // average weights across all members for each variable
    const avgStates: Record<string, VariableState> = {};
    for (const [vid, s] of Object.entries(states)) {
      const vals = memberIds
        .map((m) => s.weights[m])
        .filter((v): v is number => typeof v === "number");
      if (vals.length === 0) continue;
      const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
      avgStates[vid] = {
        ...s,
        weights: { __avg__: avg },
      };
    }
    return {
      rows: leaderboardFor(
        "__avg__",
        properties,
        variables,
        avgStates,
        scores,
        fin,
      ),
      forked: false,
    };
  }

  // forked: every member has a ranking. Joint shows top-N intersection.
  const rankings = memberIds.map((m) => {
    const rows = leaderboardFor(m, properties, variables, states, scores, fin);
    return rows.slice(0, topN).map((r) => r.property.id);
  });
  const intersectionIds = rankings[0]?.filter((id) =>
    rankings.every((r) => r.includes(id)),
  ) ?? [];

  const baseUser = memberIds[0]!;
  const rows = leaderboardFor(
    baseUser,
    properties.filter((p) => intersectionIds.includes(p.id)),
    variables,
    states,
    scores,
    fin,
  );
  return { rows, forked: true };
}
