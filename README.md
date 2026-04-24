# Smile Analysis

Help two (or more) people reach honest consensus on the biggest decision of their life, by turning "what would make us happy here?" into a weighted rubric that ranks every property they consider.

This repo is a v1 implementation of the product spec in [Design files/SMILE_APP_SPEC.md](Design%20files/SMILE_APP_SPEC.md) and the design spec in [Design files/SMILE_APP_DESIGN.md](Design%20files/SMILE_APP_DESIGN.md).

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS with the design-system tokens from SMILE_APP_DESIGN.md
- React Router for all 21 screens
- Zustand (persisted to localStorage) for application state
- Framer Motion for the motion moments called out in the spec
- Lucide icons (plus custom SVG `SmileGlyph` / `FrownGlyph` per the design)
- Gambarino display serif + Satoshi body sans, loaded from Fontshare

The spec calls for Next.js + Supabase + Stripe + Claude API + Google Maps + WalkScore + Postmark. This v1 runs entirely client-side with mock data and localStorage persistence so the UI, flows, and math can be validated before wiring real services.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Implemented build stages

Cross-referenced against the 14 stages in SMILE_APP_SPEC.md:

- **Stage 0** — Landing page, signup/login, intake, rent-vs-buy chooser, kitten explainer
- **Stage 1** — Places Q&A, Category Q&A, calibration against 5 seeded sold homes, rubric builder, printable worksheet
- **Stage 2** — Partner mode (N-way), Consensus page with compromise / discuss / fork
- **Stage 3** — Manual property paste, heuristic auto-scoring, property queue with per-person and joint leaderboards, property detail
- **Stage 4** — Compare view (2–4 properties), Cost-per-Smile hero card, pricing analysis v1 (pasted comps), rent-vs-buy projector
- **Stage 5** — "Zero today" and "nothing this week" empty states (email layouts noted in design doc; actual send is out of scope here)
- **Stage 6** — Stubbed: Claude auto-scoring is simulated with token-overlap heuristics
- **Stage 7** — Open houses view with top-10 surfacing
- **Stage 8** — Helper dashboard (paid-2 backend) with queue + match/no/unknown + site-visit note
- **Stage 9** — N-partner support: add/remove members, per-member weights, joint top-N intersection when forked
- **Stage 13** — Advisor dashboard with rubric summary + running notes

Stages not built: live property search (6), owned open-house DB (12), MLS (14), rentals as a search mode (11), smile-weighted comps (10).

## Core math

- `src/lib/scoring.ts` — Smile score, cost-per-smile, personal + joint leaderboards
- `src/lib/consensus.ts` — Pairwise deltas, auto-status (agreed/open/forked), compromise suggestions
- `src/lib/finance.ts` — Affordability ceiling, 30-year rent-vs-buy projection with crossover detection, comp pricing analysis
- `src/store/store.ts` — Zustand store with localStorage persistence

## Routes

| Route | Screen |
| --- | --- |
| `/` | Landing |
| `/signup`, `/login` | Auth |
| `/kittens` | Kitten explainer |
| `/onboarding/intake` | Intake / budget |
| `/onboarding/rent-or-buy` | Rent-vs-buy chooser |
| `/onboarding/places` | Places Q&A |
| `/onboarding/categories` | Category Q&A |
| `/onboarding/calibration` | Calibration against sold homes |
| `/onboarding/done` | Graduation |
| `/app/queue` | Property queue |
| `/app/property/:id` | Property detail |
| `/app/property/:id/pricing` | Pricing analysis |
| `/app/compare` | Compare view |
| `/app/rubric` | Rubric builder |
| `/app/rubric/add` | Add-variable flow (slot-between-neighbors) |
| `/app/consensus` | Consensus page |
| `/app/finance` | Rent-vs-buy projector |
| `/app/open-houses` | Top-10 open houses |
| `/app/worksheet` | Printable rubric worksheet |
| `/app/settings` | Settings (members, addresses, tier, preferences) |
| `/app/helper` | Helper dashboard (paid-2) |
| `/app/advisor` | Advisor dashboard |

## Data model

Mirrors the sketch in SMILE_APP_SPEC.md. See `src/lib/types.ts` for the full TypeScript shape. Everything is stored in Zustand/localStorage under the key `smile-analysis-v1`. Reset via `/app/settings → Danger zone`.
