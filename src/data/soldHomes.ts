import type { SoldHome } from "@/lib/types";

// Each calibration home leads with a photo of *one specific thing* — a kitchen,
// a window, a stoop, a hallway — that the user can react to directly. The
// "What stood out?" list surfaces features tied to what's actually visible in
// the photo and in the blurb, so the list-making feels grounded in a real
// decision.

export const SOLD_HOMES: SoldHome[] = [
  {
    id: "sold-1",
    address: "478 Carroll Street",
    neighborhood: "Park Slope, Brooklyn",
    soldPriceUsd: 1_465_000,
    soldDate: "2026-02-11",
    sqft: 1280,
    beds: 2,
    baths: 2,
    // Focus: a renovated galley kitchen open to the living room.
    photoUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=60",
    blurb:
      "The kitchen was fully remodeled in 2022 — white cabinets, quartz counters, open to a living room with original parquet floors. Parlor floor of a brownstone co-op, south-facing garden shared with the upstairs unit.",
    features: [
      { text: "Open kitchen to living room", area: "In", suggestedWeight: 8 },
      { text: "Renovated within 5 years", area: "In", suggestedWeight: 6 },
      { text: "Bright countertops", area: "In", suggestedWeight: 2 },
      { text: "Original pre-war floors", area: "In", suggestedWeight: 5 },
      { text: "Shared garden access", area: "Building", suggestedWeight: 4 },
      { text: "Tree-lined brownstone block", area: "Around", suggestedWeight: 7 },
      { text: "Near the F/G train", area: "Around", suggestedWeight: 9 },
      { text: "Co-op (not condo)", area: "Building", suggestedWeight: -2 },
    ],
  },
  {
    id: "sold-2",
    address: "30-42 Crescent Street",
    neighborhood: "Astoria, Queens",
    soldPriceUsd: 812_000,
    soldDate: "2026-01-29",
    sqft: 980,
    beds: 2,
    baths: 1,
    // Focus: a sunlit corner living room with original tin ceiling.
    photoUrl:
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1400&q=60",
    blurb:
      "Top-floor corner unit with south and west exposures — sunlight all day. Original tin ceiling, wide-plank floors. Walkup, no elevator. 6-minute walk to Broadway N/W.",
    features: [
      { text: "Natural light all day", area: "In", suggestedWeight: 12 },
      { text: "Corner unit (multi-exposure)", area: "In", suggestedWeight: 8 },
      { text: "Original tin ceiling", area: "In", suggestedWeight: 3 },
      { text: "Walkup (no elevator)", area: "Building", suggestedWeight: -7 },
      { text: "Top floor", area: "Building", suggestedWeight: 4 },
      { text: "Close to multiple trains", area: "Around", suggestedWeight: 9 },
      { text: "Under 35-min commute", area: "Commute", suggestedWeight: 10 },
    ],
  },
  {
    id: "sold-3",
    address: "118 Grand Street, #4R",
    neighborhood: "Hoboken, NJ",
    soldPriceUsd: 935_000,
    soldDate: "2026-03-04",
    sqft: 1060,
    beds: 2,
    baths: 2,
    // Focus: doorman lobby / view of the building exterior, condo energy.
    photoUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=60",
    blurb:
      "Condo with a full-time doorman, in-building gym, and a package room. Two bedrooms, two baths, in-unit washer/dryer. 12 minutes to Manhattan via PATH. The lobby is marble; the hallways smell faintly of chlorine from the gym.",
    features: [
      { text: "Doorman building", area: "Building", suggestedWeight: 4 },
      { text: "In-building gym", area: "Building", suggestedWeight: 3 },
      { text: "In-unit laundry", area: "In", suggestedWeight: 8 },
      { text: "Package room", area: "Building", suggestedWeight: 3 },
      { text: "Under 20-min commute", area: "Commute", suggestedWeight: 12 },
      { text: "Condo fee over $500/mo", area: "Building", suggestedWeight: -5 },
      { text: "Generic new-build feel", area: "In", suggestedWeight: -3 },
    ],
  },
  {
    id: "sold-4",
    address: "22 Church Street",
    neighborhood: "Montclair, NJ",
    soldPriceUsd: 1_120_000,
    soldDate: "2026-02-20",
    sqft: 2100,
    beds: 3,
    baths: 2.5,
    // Focus: a fenced backyard with a patio.
    photoUrl:
      "https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=1400&q=60",
    blurb:
      "Full single-family house with a fenced yard and a driveway. Three bedrooms plus a finished attic office. 45-min commute to Penn Station via Midtown Direct. South End shops are a 10-minute walk.",
    features: [
      { text: "Private fenced yard", area: "In", suggestedWeight: 14 },
      { text: "Driveway / garage", area: "In", suggestedWeight: 8 },
      { text: "Finished home office", area: "In", suggestedWeight: 7 },
      { text: "3+ bedrooms", area: "In", suggestedWeight: 6 },
      { text: "Walkable downtown", area: "Around", suggestedWeight: 7 },
      { text: "45+ min commute", area: "Commute", suggestedWeight: -10 },
      { text: "Single-family responsibility", area: "Building", suggestedWeight: -3 },
      { text: "Good public schools", area: "Around", suggestedWeight: 8 },
    ],
  },
  {
    id: "sold-5",
    address: "214 Windsor Place, #2",
    neighborhood: "Windsor Terrace, Brooklyn",
    soldPriceUsd: 1_060_000,
    soldDate: "2026-03-15",
    sqft: 1120,
    beds: 2,
    baths: 1,
    // Focus: a window looking out onto a leafy street / a park three blocks away.
    photoUrl:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1400&q=60",
    blurb:
      "Pre-war 2-bed with a wall of windows onto a quiet street. Prospect Park is three blocks east. Small co-op building (9 units), low fees. One bathroom. No laundry in the unit; shared basement laundry.",
    features: [
      { text: "Near a big park", area: "Around", suggestedWeight: 10 },
      { text: "Quiet residential street", area: "Around", suggestedWeight: 7 },
      { text: "Low HOA / co-op fees", area: "Building", suggestedWeight: 4 },
      { text: "Small friendly building", area: "Building", suggestedWeight: 6 },
      { text: "Pre-war character", area: "In", suggestedWeight: 3 },
      { text: "No in-unit laundry", area: "In", suggestedWeight: -6 },
      { text: "Only one bathroom", area: "In", suggestedWeight: -4 },
    ],
  },
];
