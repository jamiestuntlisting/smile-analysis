import type { AppState } from "./types";

/**
 * Which workflow steps are still open. A step is locked (not in this list)
 * as soon as its output exists in the store. Open steps appear as tabs; locked
 * steps disappear from the tab bar and their outcome is shown as a decision
 * chip.
 */
export type StepId =
  | "rent-or-buy"
  | "budget"
  | "places"
  | "categories"
  | "calibration"
  | "weights";

export interface StepDef {
  id: StepId;
  label: string;
  path: string;
  hint: string;
}

export const STEPS: StepDef[] = [
  {
    id: "rent-or-buy",
    label: "Rent or buy",
    path: "/app/rent-or-buy",
    hint: "Decide whether you're buying or renting before you search.",
  },
  {
    id: "budget",
    label: "Budget",
    path: "/app/budget",
    hint: "Set an honest ceiling. Can be refined later.",
  },
  {
    id: "places",
    label: "Places",
    path: "/app/places",
    hint: "Addresses we'll measure commute against.",
  },
  {
    id: "categories",
    label: "Categories",
    path: "/app/categories",
    hint: "What you want near home.",
  },
  {
    id: "calibration",
    label: "Calibration",
    path: "/app/calibration",
    hint: "React to real sold homes to surface what matters.",
  },
  {
    id: "weights",
    label: "Weights",
    path: "/app/weights",
    hint: "Say how much each variable matters.",
  },
];

/**
 * A step is "done" when its output exists. We derive this from the store so
 * progress is honest — if someone blanks out their budget, the step comes back.
 */
export function isStepDone(state: Pick<AppState, "searchProfile" | "addresses" | "variables" | "progress">, id: StepId): boolean {
  switch (id) {
    case "rent-or-buy":
      return (
        state.searchProfile.buyOrRent === "buy" ||
        state.searchProfile.buyOrRent === "rent" ||
        state.searchProfile.buyOrRent === "both"
      );
    case "budget":
      return typeof state.searchProfile.ceilingUsd === "number" && state.searchProfile.ceilingUsd > 0;
    case "places":
      return state.addresses.length > 0;
    case "categories":
      return Boolean(state.progress?.categoriesDone) || state.variables.length >= 5;
    case "calibration":
      return Boolean(state.progress?.calibrationDone);
    case "weights":
      return Boolean(state.progress?.weightsDone);
  }
}

export function openSteps(state: Pick<AppState, "searchProfile" | "addresses" | "variables" | "progress">): StepDef[] {
  return STEPS.filter((s) => !isStepDone(state, s.id));
}

export function nextOpenStep(state: Pick<AppState, "searchProfile" | "addresses" | "variables" | "progress">): StepDef | null {
  return openSteps(state)[0] ?? null;
}

export function allSetupDone(state: Pick<AppState, "searchProfile" | "addresses" | "variables" | "progress">): boolean {
  return openSteps(state).length === 0;
}
