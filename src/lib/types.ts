export type Area = "In" | "Building" | "Around" | "Commute";

export type Tier = "free" | "paid1" | "paid2";

export type BuyRent = "buy" | "rent" | "both" | "undecided";

export type ScorerKind = "api" | "listing" | "web" | "user" | "helper";

export type ScoreMatch = "yes" | "no" | "unknown";

export type ConsensusStatus = "agreed" | "open" | "forked";

export interface User {
  id: string;
  email: string;
  displayName: string;
  tier: Tier;
  createdAt: string;
}

export interface RubricMember {
  userId: string;
  displayName: string;
  color: string;
}

export interface SearchProfile {
  buyOrRent: BuyRent;
  ceilingUsd: number | null;
  areas: string[];
  timeline: string;
  currentRent: number | null;
  savings: number | null;
  income: number | null;
}

export interface SavedAddress {
  id: string;
  label: string;
  address: string;
  ownerId: string | null; // null = shared
  importance: "high" | "med" | "low";
}

export interface Variable {
  id: string;
  name: string;
  area: Area;
  definition: string;
  scorer: ScorerKind;
  needsHuman: boolean;
  createdBy: string;
  createdAt: string;
}

export type WeightMap = Record<string /* userId */, number>;

export interface VariableState {
  weights: WeightMap;
  status: ConsensusStatus;
}

export interface Property {
  id: string;
  address: string;
  neighborhood: string;
  priceUsd: number;
  sqft: number | null;
  hoaUsd: number;
  taxesUsd: number;
  insuranceUsd: number;
  url?: string;
  photoUrl?: string;
  notes?: string;
  addedAt: string;
  dayAdded: number;
  listingDescription?: string;
  openHouse?: {
    datetime: string;
  } | null;
}

export interface PropertyScore {
  propertyId: string;
  variableId: string;
  match: ScoreMatch;
  confidence: "high" | "med" | "low";
  scoredBy: "claude" | "helper" | "user";
  note?: string;
}

export interface SoldHome {
  id: string;
  address: string;
  neighborhood: string;
  soldPriceUsd: number;
  soldDate: string;
  sqft: number;
  beds: number;
  baths: number;
  photoUrl: string;
  blurb: string;
  /** Likely-liked features the calibration flow can suggest as draft variables. */
  features: { text: string; area: Area; suggestedWeight: number }[];
}

export interface FinancialAssumptions {
  interestRate: number; // e.g. 0.065
  downPaymentPct: number; // 0.2
  horizonYears: number; // 30
  investmentReturn: number; // 0.07 for rent-vs-buy
  homeApprecation: number; // 0.03
}

export interface AppState {
  currentUserId: string;
  users: User[];
  rubric: {
    id: string;
    name: string;
    members: RubricMember[];
  };
  searchProfile: SearchProfile;
  addresses: SavedAddress[];
  variables: Variable[];
  variableStates: Record<string /* variableId */, VariableState>;
  properties: Property[];
  scores: PropertyScore[];
  searchDayStart: string | null;
  kittenExplainerSeen: boolean;
  financial: FinancialAssumptions;
  viewMode: "simple" | "power";
  progress: {
    categoriesDone: boolean;
    calibrationDone: boolean;
    weightsDone: boolean;
  };
}
