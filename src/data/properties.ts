import type { Area, Property } from "@/lib/types";

export const SEED_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    address: "4 Carroll Gardens, #3B",
    neighborhood: "Carroll Gardens, Brooklyn",
    priceUsd: 1_395_000,
    sqft: 1240,
    hoaUsd: 540 * 12,
    taxesUsd: 14_000,
    insuranceUsd: 1_800,
    photoUrl:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1400&q=60",
    addedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    dayAdded: 9,
    listingDescription:
      "Corner 2-bed with south + east exposure. Open kitchen remodel 2023. Stroller-friendly elevator building, part-time doorman. 6 min walk to F/G Carroll.",
    openHouse: { datetime: "Sunday, 2:00–3:30 pm" },
    url: "https://example.com/listing/4-carroll",
  },
  {
    id: "prop-2",
    address: "211 Garfield Place, #2F",
    neighborhood: "Park Slope, Brooklyn",
    priceUsd: 1_525_000,
    sqft: 1185,
    hoaUsd: 780 * 12,
    taxesUsd: 10_400,
    insuranceUsd: 1_900,
    photoUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=60",
    addedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    dayAdded: 7,
    listingDescription:
      "Parlor floor of a classic brownstone co-op. 10' ceilings, decorative fireplace, large rear bedroom facing a quiet garden.",
    openHouse: { datetime: "Saturday, 1:00–2:30 pm" },
  },
  {
    id: "prop-3",
    address: "88 Windsor Terrace, Apt 4",
    neighborhood: "Windsor Terrace, Brooklyn",
    priceUsd: 1_080_000,
    sqft: 980,
    hoaUsd: 420 * 12,
    taxesUsd: 7_800,
    insuranceUsd: 1_500,
    photoUrl:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1400&q=60",
    addedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    dayAdded: 11,
    listingDescription:
      "Quiet 2-bed three blocks from Prospect Park. No laundry in-unit; basement shared laundry. Strong co-op reserves.",
    openHouse: null,
  },
  {
    id: "prop-4",
    address: "30-05 29th Street",
    neighborhood: "Astoria, Queens",
    priceUsd: 860_000,
    sqft: 1020,
    hoaUsd: 310 * 12,
    taxesUsd: 6_200,
    insuranceUsd: 1_400,
    photoUrl:
      "https://images.unsplash.com/photo-1599423300746-b62533397364?w=1400&q=60",
    addedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    dayAdded: 10,
    listingDescription:
      "Floor-through 2-bed in a 6-unit pre-war. South light. 8-min walk to Broadway N/W. Renovated bath.",
    openHouse: { datetime: "Sunday, 11:00 am–12:30 pm" },
  },
  {
    id: "prop-5",
    address: "118 Grand Street, #4R",
    neighborhood: "Hoboken, NJ",
    priceUsd: 955_000,
    sqft: 1060,
    hoaUsd: 610 * 12,
    taxesUsd: 9_200,
    insuranceUsd: 1_500,
    photoUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=60",
    addedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    dayAdded: 6,
    listingDescription:
      "Doorman building with gym. 12 min to Manhattan via PATH. Renovated kitchen, in-unit laundry.",
    openHouse: { datetime: "Saturday, 3:00–4:30 pm" },
  },
  {
    id: "prop-6",
    address: "2 Orchard Street",
    neighborhood: "Montclair, NJ",
    priceUsd: 1_150_000,
    sqft: 2080,
    hoaUsd: 0,
    taxesUsd: 22_000,
    insuranceUsd: 2_400,
    photoUrl:
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=1400&q=60",
    addedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    dayAdded: 4,
    listingDescription:
      "Three-bedroom single-family with fenced yard. 45-min commute to Penn via Midtown Direct.",
    openHouse: null,
  },
];

export const CATEGORY_SUGGESTIONS: {
  name: string;
  area: Area;
  suggestedWeight: number;
  definition: string;
  group: string;
}[] = [
  // FOOD & DRINK
  { name: "Good coffee shop", area: "Around", suggestedWeight: 5, definition: "A real sit-down cafe within a 5-min walk.", group: "Food & drink" },
  { name: "Bakery", area: "Around", suggestedWeight: 3, definition: "A proper bakery within a 10-min walk.", group: "Food & drink" },
  { name: "Full-size grocery", area: "Around", suggestedWeight: 8, definition: "Whole Foods, Trader Joe's, or equivalent within a 10-min walk.", group: "Food & drink" },
  { name: "Bodega / corner store", area: "Around", suggestedWeight: 4, definition: "A good bodega within a 2-min walk.", group: "Food & drink" },
  { name: "Farmers market", area: "Around", suggestedWeight: 3, definition: "A weekend farmers market within a 15-min walk.", group: "Food & drink" },
  { name: "Good restaurants", area: "Around", suggestedWeight: 6, definition: "At least 3 well-reviewed restaurants within a 15-min walk.", group: "Food & drink" },
  { name: "Good pizza", area: "Around", suggestedWeight: 4, definition: "A real slice or a real pie within a 10-min walk.", group: "Food & drink" },
  { name: "Bar we'd actually go to", area: "Around", suggestedWeight: 3, definition: "A neighborhood bar, not a hotel lobby.", group: "Food & drink" },
  { name: "Wine / liquor store", area: "Around", suggestedWeight: 2, definition: "Within a 10-min walk.", group: "Food & drink" },
  { name: "Ice cream spot", area: "Around", suggestedWeight: 2, definition: "Within a 10-min walk. Yes this matters.", group: "Food & drink" },

  // TRANSIT & COMMUTE
  { name: "Under 45-min commute", area: "Commute", suggestedWeight: 10, definition: "Under 45 minutes door-to-door to primary work address.", group: "Transit & commute" },
  { name: "Under 30-min commute", area: "Commute", suggestedWeight: 14, definition: "Under 30 minutes door-to-door. Rare and valuable.", group: "Transit & commute" },
  { name: "Close to multiple trains", area: "Commute", suggestedWeight: 8, definition: "Two or more train lines within a 10-min walk.", group: "Transit & commute" },
  { name: "Express train nearby", area: "Commute", suggestedWeight: 6, definition: "An express stop within a 10-min walk.", group: "Transit & commute" },
  { name: "Bus route on the block", area: "Commute", suggestedWeight: 2, definition: "A bus stop within 2 minutes. Backup transit.", group: "Transit & commute" },
  { name: "Bike-friendly streets", area: "Around", suggestedWeight: 4, definition: "Protected bike lanes or a greenway within 5 minutes.", group: "Transit & commute" },
  { name: "Citi Bike dock nearby", area: "Commute", suggestedWeight: 3, definition: "A Citi Bike dock within 5 minutes.", group: "Transit & commute" },
  { name: "Easy airport access", area: "Commute", suggestedWeight: 2, definition: "Under 60 min to LGA, JFK, or EWR.", group: "Transit & commute" },
  { name: "Near a highway ramp", area: "Commute", suggestedWeight: 2, definition: "For road-trip life.", group: "Transit & commute" },

  // FITNESS & OUTDOORS
  { name: "Gym nearby", area: "Around", suggestedWeight: 4, definition: "A gym we'd actually use within a 10-min walk.", group: "Fitness & outdoors" },
  { name: "Yoga / pilates studio", area: "Around", suggestedWeight: 3, definition: "Within a 10-min walk.", group: "Fitness & outdoors" },
  { name: "Climbing gym", area: "Around", suggestedWeight: 5, definition: "A bouldering or top-rope gym within a 15-min walk / 1 train.", group: "Fitness & outdoors" },
  { name: "Running routes", area: "Around", suggestedWeight: 5, definition: "A loop or greenway to run on without dodging cars.", group: "Fitness & outdoors" },
  { name: "Real park nearby", area: "Around", suggestedWeight: 9, definition: "A full-size park — not a pocket garden — within a 10-min walk.", group: "Fitness & outdoors" },
  { name: "On the waterfront", area: "Around", suggestedWeight: 4, definition: "Walkable to the water.", group: "Fitness & outdoors" },
  { name: "Dog park or dog-friendly", area: "Around", suggestedWeight: 3, definition: "Somewhere a dog can actually run.", group: "Fitness & outdoors" },
  { name: "Community pool", area: "Around", suggestedWeight: 2, definition: "Public or semi-private pool nearby.", group: "Fitness & outdoors" },

  // CULTURE & GOING OUT
  { name: "Independent bookstore", area: "Around", suggestedWeight: 3, definition: "Within a 15-min walk.", group: "Culture & going out" },
  { name: "Public library", area: "Around", suggestedWeight: 3, definition: "A branch library within a 15-min walk.", group: "Culture & going out" },
  { name: "Movie theater", area: "Around", suggestedWeight: 2, definition: "A real theater within a 15-min walk.", group: "Culture & going out" },
  { name: "Live music venue", area: "Around", suggestedWeight: 2, definition: "Within a 15-min walk.", group: "Culture & going out" },
  { name: "Museum / gallery", area: "Around", suggestedWeight: 2, definition: "Something worth visiting nearby.", group: "Culture & going out" },

  // FAMILY & SCHOOLS
  { name: "Good public school", area: "Around", suggestedWeight: 12, definition: "Zoned for a strong public elementary.", group: "Family & schools" },
  { name: "Daycare nearby", area: "Around", suggestedWeight: 8, definition: "A good daycare within a 10-min walk / drive.", group: "Family & schools" },
  { name: "Playground", area: "Around", suggestedWeight: 6, definition: "A playground within a 5-min walk.", group: "Family & schools" },
  { name: "Pediatrician nearby", area: "Around", suggestedWeight: 3, definition: "A good pediatrician within a 15-min drive.", group: "Family & schools" },
  { name: "Stroller-friendly streets", area: "Around", suggestedWeight: 5, definition: "Wide sidewalks, curb cuts, not too many stoop-heavy blocks.", group: "Family & schools" },

  // DAILY NEEDS
  { name: "Pharmacy nearby", area: "Around", suggestedWeight: 4, definition: "A real pharmacy within a 10-min walk.", group: "Daily needs" },
  { name: "Hardware store", area: "Around", suggestedWeight: 2, definition: "Somewhere to buy a lightbulb at 7pm.", group: "Daily needs" },
  { name: "Laundromat", area: "Around", suggestedWeight: 2, definition: "Within a 10-min walk if we don't have in-unit.", group: "Daily needs" },
  { name: "Dry cleaner", area: "Around", suggestedWeight: 2, definition: "Within a 10-min walk.", group: "Daily needs" },
  { name: "UPS / FedEx drop-off", area: "Around", suggestedWeight: 2, definition: "So returns don't steal a Saturday.", group: "Daily needs" },

  // FEEL
  { name: "Tree-lined streets", area: "Around", suggestedWeight: 6, definition: "A real canopy, not one scrappy sapling per block.", group: "Feel & vibe" },
  { name: "Walkable downtown", area: "Around", suggestedWeight: 7, definition: "A commercial strip worth strolling.", group: "Feel & vibe" },
  { name: "Quiet at night", area: "Around", suggestedWeight: 7, definition: "Not a bar strip. Not a thru-street.", group: "Feel & vibe" },
  { name: "Feels safe walking home", area: "Around", suggestedWeight: 9, definition: "Well-lit, active streets at night.", group: "Feel & vibe" },
  { name: "Diverse, mixed-use", area: "Around", suggestedWeight: 4, definition: "Not all one thing. Apartments over shops.", group: "Feel & vibe" },
  { name: "Near friends / family", area: "Around", suggestedWeight: 6, definition: "People we love inside a 30-min door-to-door.", group: "Feel & vibe" },

  // BUILDING
  { name: "Doorman", area: "Building", suggestedWeight: 3, definition: "Full or part-time.", group: "Building" },
  { name: "Elevator", area: "Building", suggestedWeight: 4, definition: "No walkups past floor 3.", group: "Building" },
  { name: "In-building laundry", area: "Building", suggestedWeight: 5, definition: "Anywhere in the building counts.", group: "Building" },
  { name: "In-building gym", area: "Building", suggestedWeight: 3, definition: "A real one — not a treadmill in a closet.", group: "Building" },
  { name: "Bike storage", area: "Building", suggestedWeight: 3, definition: "Indoor, secure.", group: "Building" },
  { name: "Package room", area: "Building", suggestedWeight: 3, definition: "Somewhere packages actually go.", group: "Building" },
  { name: "Roof deck", area: "Building", suggestedWeight: 2, definition: "Shared roof access for summer evenings.", group: "Building" },
  { name: "Quiet neighbors", area: "Building", suggestedWeight: 6, definition: "Building known to be quiet, not a party stack.", group: "Building" },

  // INSIDE THE UNIT
  { name: "In-unit laundry", area: "In", suggestedWeight: 8, definition: "Washer and dryer in the apartment.", group: "Inside the unit" },
  { name: "Dishwasher", area: "In", suggestedWeight: 5, definition: "In the apartment.", group: "Inside the unit" },
  { name: "Open kitchen", area: "In", suggestedWeight: 6, definition: "Kitchen opens to the living or dining area.", group: "Inside the unit" },
  { name: "Lots of natural light", area: "In", suggestedWeight: 10, definition: "Multi-exposure or big windows on a sunny side.", group: "Inside the unit" },
  { name: "Outdoor space", area: "In", suggestedWeight: 8, definition: "Balcony, terrace, or private yard.", group: "Inside the unit" },
  { name: "Home office room", area: "In", suggestedWeight: 7, definition: "A real door-close room to work from.", group: "Inside the unit" },
  { name: "Second bathroom", area: "In", suggestedWeight: 6, definition: "A full second bath.", group: "Inside the unit" },
  { name: "Separate dining area", area: "In", suggestedWeight: 3, definition: "Room for a real table.", group: "Inside the unit" },
  { name: "Storage / closets", area: "In", suggestedWeight: 5, definition: "Real closets, maybe a basement bin.", group: "Inside the unit" },
  { name: "High ceilings", area: "In", suggestedWeight: 3, definition: "9' or better.", group: "Inside the unit" },
  { name: "Hardwood floors", area: "In", suggestedWeight: 2, definition: "Real wood, not laminate.", group: "Inside the unit" },
  { name: "A/C or central air", area: "In", suggestedWeight: 4, definition: "Central, mini-split, or at least pre-wired for window units.", group: "Inside the unit" },
  { name: "Parking (if car)", area: "In", suggestedWeight: 6, definition: "Spot, driveway, or a reliable street situation.", group: "Inside the unit" },
  { name: "Pet-friendly", area: "Building", suggestedWeight: 5, definition: "Dogs allowed, reasonable size limit.", group: "Inside the unit" },
];
