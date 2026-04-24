import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppState,
  Area,
  BuyRent,
  ConsensusStatus,
  Property,
  PropertyScore,
  ScorerKind,
  Tier,
  User,
  Variable,
  VariableState,
  SearchProfile,
  SavedAddress,
} from "@/lib/types";
import { uid, clamp } from "@/lib/id";
import { SEED_PROPERTIES } from "@/data/properties";
import { autoStatus } from "@/lib/consensus";

const initialFinancial = {
  interestRate: 0.065,
  downPaymentPct: 0.2,
  horizonYears: 30,
  investmentReturn: 0.07,
  homeApprecation: 0.03,
};

const MEMBER_COLORS = ["#D89B1F", "#3A4A8C", "#4A7C5B", "#B55A3E", "#805ad5"];

function defaultState(): AppState {
  const u1: User = {
    id: "u_jack",
    email: "jack@example.com",
    displayName: "Jack",
    tier: "free",
    createdAt: new Date().toISOString(),
  };
  const u2: User = {
    id: "u_jill",
    email: "jill@example.com",
    displayName: "Jill",
    tier: "free",
    createdAt: new Date().toISOString(),
  };
  return {
    currentUserId: u1.id,
    users: [u1, u2],
    rubric: {
      id: "rubric_main",
      name: "Our rubric",
      members: [
        { userId: u1.id, displayName: u1.displayName, color: MEMBER_COLORS[0]! },
        { userId: u2.id, displayName: u2.displayName, color: MEMBER_COLORS[1]! },
      ],
    },
    searchProfile: {
      buyOrRent: "buy",
      ceilingUsd: null,
      areas: [],
      timeline: "",
      currentRent: null,
      savings: null,
      income: null,
    },
    addresses: [],
    variables: [],
    variableStates: {},
    properties: [],
    scores: [],
    searchDayStart: null,
    kittenExplainerSeen: false,
    financial: initialFinancial,
    viewMode: "simple",
    progress: {
      categoriesDone: false,
      calibrationDone: false,
      weightsDone: false,
    },
  };
}

interface Actions {
  reset: () => void;
  setUser: (uid: string) => void;
  setTier: (t: Tier) => void;
  addMember: (displayName: string) => void;
  removeMember: (userId: string) => void;

  setSearchProfile: (p: Partial<SearchProfile>) => void;
  setKittenSeen: () => void;
  setViewMode: (m: "simple" | "power") => void;

  addAddress: (a: Omit<SavedAddress, "id">) => void;
  removeAddress: (id: string) => void;

  addVariable: (
    input: Omit<Variable, "id" | "createdAt">,
    initialWeights?: Record<string, number>,
  ) => string;
  updateVariable: (id: string, patch: Partial<Variable>) => void;
  removeVariable: (id: string) => void;
  setWeight: (variableId: string, userId: string, weight: number) => void;
  setConsensusStatus: (variableId: string, status: ConsensusStatus) => void;
  compromise: (variableId: string) => void;

  addProperty: (p: Omit<Property, "id" | "addedAt">) => string;
  removeProperty: (id: string) => void;
  setScore: (score: Omit<PropertyScore, "scoredBy"> & { scoredBy?: PropertyScore["scoredBy"] }) => void;

  startSearchDayClock: () => void;
  setFinancial: (patch: Partial<AppState["financial"]>) => void;
  markProgress: (key: keyof AppState["progress"], value?: boolean) => void;
}

type Store = AppState & Actions;

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...defaultState(),

      reset: () => set({ ...defaultState() }),
      setUser: (id) => set({ currentUserId: id }),
      setTier: (t) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === s.currentUserId ? { ...u, tier: t } : u)),
        })),

      addMember: (displayName) =>
        set((s) => {
          const id = uid("u");
          const user: User = {
            id,
            email: `${displayName.toLowerCase()}@example.com`,
            displayName,
            tier: s.users[0]?.tier ?? "free",
            createdAt: new Date().toISOString(),
          };
          const color = MEMBER_COLORS[s.rubric.members.length % MEMBER_COLORS.length]!;
          // migrate existing weights to include new member with weight 0
          const newStates: Record<string, VariableState> = {};
          for (const [vid, st] of Object.entries(s.variableStates)) {
            newStates[vid] = {
              ...st,
              weights: { ...st.weights, [id]: 0 },
            };
          }
          return {
            users: [...s.users, user],
            rubric: {
              ...s.rubric,
              members: [...s.rubric.members, { userId: id, displayName, color }],
            },
            variableStates: newStates,
          };
        }),

      removeMember: (userId) =>
        set((s) => {
          const newStates: Record<string, VariableState> = {};
          for (const [vid, st] of Object.entries(s.variableStates)) {
            const { [userId]: _, ...rest } = st.weights;
            newStates[vid] = { ...st, weights: rest };
          }
          return {
            users: s.users.filter((u) => u.id !== userId),
            rubric: {
              ...s.rubric,
              members: s.rubric.members.filter((m) => m.userId !== userId),
            },
            variableStates: newStates,
          };
        }),

      setSearchProfile: (p) =>
        set((s) => ({ searchProfile: { ...s.searchProfile, ...p } })),

      setKittenSeen: () => set({ kittenExplainerSeen: true }),
      setViewMode: (m) => set({ viewMode: m }),

      addAddress: (a) =>
        set((s) => ({ addresses: [...s.addresses, { ...a, id: uid("addr") }] })),
      removeAddress: (id) =>
        set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),

      addVariable: (input, initialWeights = {}) => {
        const id = uid("var");
        const created: Variable = {
          ...input,
          id,
          createdAt: new Date().toISOString(),
        };
        const members = get().rubric.members;
        const weights: Record<string, number> = {};
        for (const m of members) {
          weights[m.userId] = initialWeights[m.userId] ?? 0;
        }
        const state: VariableState = { weights, status: "open" };
        set((s) => ({
          variables: [...s.variables, created],
          variableStates: {
            ...s.variableStates,
            [id]: { ...state, status: autoStatus(state, members) },
          },
        }));
        return id;
      },

      updateVariable: (id, patch) =>
        set((s) => ({
          variables: s.variables.map((v) => (v.id === id ? { ...v, ...patch } : v)),
        })),

      removeVariable: (id) =>
        set((s) => {
          const { [id]: _, ...rest } = s.variableStates;
          return {
            variables: s.variables.filter((v) => v.id !== id),
            variableStates: rest,
            scores: s.scores.filter((sc) => sc.variableId !== id),
          };
        }),

      setWeight: (variableId, userId, weight) =>
        set((s) => {
          const current = s.variableStates[variableId];
          if (!current) return s;
          const next: VariableState = {
            ...current,
            weights: { ...current.weights, [userId]: clamp(weight, -25, 25) },
          };
          const newStatus =
            current.status === "forked" ? "forked" : autoStatus(next, s.rubric.members);
          return {
            variableStates: {
              ...s.variableStates,
              [variableId]: { ...next, status: newStatus },
            },
          };
        }),

      setConsensusStatus: (variableId, status) =>
        set((s) => {
          const current = s.variableStates[variableId];
          if (!current) return s;
          return {
            variableStates: {
              ...s.variableStates,
              [variableId]: { ...current, status },
            },
          };
        }),

      compromise: (variableId) =>
        set((s) => {
          const current = s.variableStates[variableId];
          if (!current) return s;
          const members = s.rubric.members;
          const vals = members
            .map((m) => current.weights[m.userId])
            .filter((v): v is number => typeof v === "number");
          if (vals.length === 0) return s;
          const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
          const newWeights = { ...current.weights };
          for (const m of members) newWeights[m.userId] = avg;
          return {
            variableStates: {
              ...s.variableStates,
              [variableId]: {
                ...current,
                weights: newWeights,
                status: "agreed",
              },
            },
          };
        }),

      addProperty: (p) => {
        const id = uid("prop");
        const prop: Property = { ...p, id, addedAt: new Date().toISOString() };
        set((s) => ({ properties: [...s.properties, prop] }));
        return id;
      },
      removeProperty: (id) =>
        set((s) => ({
          properties: s.properties.filter((p) => p.id !== id),
          scores: s.scores.filter((sc) => sc.propertyId !== id),
        })),

      setScore: (score) =>
        set((s) => {
          const existing = s.scores.findIndex(
            (sc) =>
              sc.propertyId === score.propertyId &&
              sc.variableId === score.variableId,
          );
          const full: PropertyScore = {
            propertyId: score.propertyId,
            variableId: score.variableId,
            match: score.match,
            confidence: score.confidence ?? "med",
            scoredBy: score.scoredBy ?? "user",
            note: score.note,
          };
          if (existing >= 0) {
            const clone = [...s.scores];
            clone[existing] = full;
            return { scores: clone };
          }
          return { scores: [...s.scores, full] };
        }),

      startSearchDayClock: () =>
        set((s) => ({
          searchDayStart: s.searchDayStart ?? new Date().toISOString(),
        })),

      setFinancial: (patch) =>
        set((s) => ({ financial: { ...s.financial, ...patch } })),

      markProgress: (key, value = true) =>
        set((s) => ({ progress: { ...s.progress, [key]: value } })),
    }),
    {
      name: "smile-analysis-v1",
      version: 1,
    },
  ),
);

/** Seed six example properties and auto-score them against all variables. */
export function seedExampleProperties() {
  const { properties, addProperty, variables, setScore, rubric } = useStore.getState();
  if (properties.length > 0) return;
  for (const p of SEED_PROPERTIES) {
    const id = addProperty({
      address: p.address,
      neighborhood: p.neighborhood,
      priceUsd: p.priceUsd,
      sqft: p.sqft,
      hoaUsd: p.hoaUsd,
      taxesUsd: p.taxesUsd,
      insuranceUsd: p.insuranceUsd,
      photoUrl: p.photoUrl,
      listingDescription: p.listingDescription,
      url: p.url,
      dayAdded: p.dayAdded,
      openHouse: p.openHouse ?? null,
    });
    // simple mock "auto-score": yes/no/unknown based on listing+neighborhood heuristics
    for (const v of variables) {
      const match = pseudoAutoScore(v, p);
      setScore({
        propertyId: id,
        variableId: v.id,
        match,
        confidence: match === "unknown" ? "low" : "med",
        scoredBy: "claude",
      });
    }
  }
  void rubric; // keep reference
}

function pseudoAutoScore(v: Variable, p: (typeof SEED_PROPERTIES)[number]) {
  const hay = `${p.address} ${p.neighborhood} ${p.listingDescription ?? ""}`.toLowerCase();
  const needle = v.name.toLowerCase();
  // naive token overlap
  const tokens = needle.split(/\s+/).filter((t) => t.length > 3);
  if (tokens.length === 0) return "unknown" as const;
  const hits = tokens.filter((t) => hay.includes(t)).length;
  if (hits >= Math.ceil(tokens.length / 2)) return "yes" as const;
  if (v.scorer === "user" || v.scorer === "helper") return "unknown" as const;
  return "no" as const;
}

export function currentUser() {
  const s = useStore.getState();
  return s.users.find((u) => u.id === s.currentUserId) ?? s.users[0]!;
}

export function otherMembers() {
  const s = useStore.getState();
  return s.rubric.members.filter((m) => m.userId !== s.currentUserId);
}

// re-export a typed unused-ref so consumers can import ScorerKind alias
export type { ScorerKind, BuyRent, Area };
