# Smile Analysis — Product Spec

**Origin:** [Home Search Helper sheet](https://docs.google.com/spreadsheets/d/1-8dcBmguwBh7tJslXUgLm0JackQ1jyai4zaYdq6FmhM/edit)
**One-liner:** Help two (or more) people reach honest consensus on the biggest decision of their life, by turning "what would make us happy here?" into a weighted rubric that ranks every property they consider.
**v1 market:** NYC — because picking between Hoboken, Park Slope, Astoria, and Montclair is genuinely hard.

---

## Core concepts

| Term | Definition |
| --- | --- |
| **Smile Analysis** | The brand. The process. What you do. |
| **Rubric** | The artifact the user builds — a weighted list of everything that makes a home make them smile (or frown). |
| **Variable** | One line item on the rubric ("open kitchen", "30-min commute", "loud music from neighbors"). Each variable has a name, a weight, an area, and a definition. |
| **Weight** | A number from `-25` to `+25`. Slide left and smiles cross zero into frowns. Variables can be re-weighted any time. |
| **Area** | Where the variable lives: `In` (the unit itself) · `Building` (shared amenities) · `Around` (neighborhood) · `Commute` (distance to saved addresses). |
| **Smile Points** | Positive contribution to a property's score when the variable matches. |
| **Frown Points** | Negative contribution (same field, negative number). |
| **Smile Score** | For a given property: `Σ (weight × matched)` across all variables. Higher = happier. |
| **Cost per Smile** | `Average Cost per Year ÷ Smile Score`. The headline ranking metric. Lower = better value. |
| **Consensus** | A variable has consensus when all rubric-owners agree on its weight within a small tolerance. |
| **Fork** | When partners can't agree, a variable gets individual weights per person. The app tracks separate rankings until they reconverge. |
| **Search Day Count** | How many days a user has been actively looking. Shown in emails and in-app. Sets tone for nudges. |

---

## The bigger idea: honesty > harmony

The app is deliberately built around **disagreement as a feature, not a bug**. 90% of couples disagree on variables. They still end up happy. The app's job is to:

1. Let each person weigh variables **honestly, without social pressure** — they can sit at one device together OR work on separate devices, simultaneous or async. Both modes are supported; neither is pushed.
2. Surface disagreements on a dedicated **Consensus page**, sorted by size.
3. Offer compromise when the gap is small (1-2 points → auto-suggest the average).
4. **Accept disagreements.** When partners have strong feelings, the variable forks into separate personal weights. The app celebrates honesty, not agreement.

This is the thing that makes the product different from every existing home-search tool.

---

## Data flow

```
┌───────────────────────────────────────────────────────────────────────┐
│  INPUTS                                                                │
├───────────────────────────────────────────────────────────────────────┤
│  1. Intake (loose)                                                     │
│     • Savings, income, current rent → rough affordability ceiling      │
│     • Rent vs buy preference → sets search mode (rent / buy / both)    │
│     • Timeline                                                         │
│                                                                        │
│  2. Places Q&A flow                                                    │
│     • Key addresses (work-per-partner, kids' school, parents, gym,     │
│       anywhere else) — no cap                                          │
│     • Place categories they care about (coffee shop, yoga studio,      │
│       grocery, rock climbing gym, etc.) — become rubric variables      │
│                                                                        │
│  3. Rubric building via calibration                                    │
│     • Rate 3-5 recently-sold homes in their target areas               │
│     • "What do you like? What don't you like?" → each answer becomes   │
│       a draft variable                                                 │
│     • Each partner weights every variable independently                │
│     • Disagreements route to Consensus page                            │
│                                                                        │
│  4. Live properties                                                    │
│     • Claude searches daily (Zillow/StreetEasy/MLS when ready)         │
│     • Each property auto-scored against every variable Claude can      │
│       evaluate                                                         │
│     • Variables Claude can't evaluate → queued for human helper        │
│       (paid tier) or the user (free tier)                              │
└───────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌───────────────────────────────────────────────────────────────────────┐
│  PROCESSING                                                            │
├───────────────────────────────────────────────────────────────────────┤
│  A. Affordability engine (on-demand, not persistent)                   │
│     ceiling = f(savings, income, rent, current_rates)                  │
│     rent_vs_buy = 30-year net-worth projection under both scenarios    │
│                                                                        │
│  B. Variable auto-scoring (Claude, background)                         │
│     For each (property, variable) pair:                                │
│       commute_time → Google Maps Distance Matrix                       │
│       walkability → WalkScore API (or Places-density fallback)         │
│       "near a yoga studio" → Places API radius query                   │
│       "open kitchen" → Claude reads listing photos + description       │
│       "feels cozy" → flagged for user (subjective)                     │
│       "has a leak" → flagged for human helper (needs site visit)       │
│                                                                        │
│  C. Smile engine                                                       │
│     For each property, per-rubric:                                     │
│       smile_score = Σ (weight × matched) for matched variables         │
│       annual_cost = amortize(price, rate, 30y) + HOA + taxes + ins.    │
│       cost_per_smile = annual_cost ÷ smile_score                       │
│                                                                        │
│  D. Consensus engine                                                   │
│     For each variable, for each pair of rubric-owners:                 │
│       delta = |owner_A_weight − owner_B_weight|                        │
│       if delta = 0           → agreed                                  │
│       if delta ≤ 2           → suggest average, one-tap accept         │
│       if delta > 2 and open  → appears on Consensus page               │
│       if "we don't agree"    → forked, persists as separate weights    │
│                                                                        │
│  E. Ranking                                                            │
│     If rubric has full consensus across all variables:                 │
│        → single joint ranking                                          │
│     If rubric is forked:                                               │
│        → show only properties that rank top-N for ALL rubric-owners    │
│        → separate "Jack's list" and "Jill's list" for diverging views  │
│        → no blended ranking; honesty over false harmony                │
└───────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌───────────────────────────────────────────────────────────────────────┐
│  OUTPUTS                                                               │
├───────────────────────────────────────────────────────────────────────┤
│  • Daily email per user (always sent, even when empty)                 │
│  • In-app queue of properties prioritized by smile-potential           │
│  • Consensus page (living list of disagreements, size-sorted)          │
│  • Property detail with full variable breakdown                        │
│  • Compare view (2-4 properties side-by-side)                          │
│  • Pricing analysis (v1: comp-based ceiling; later: smile-weighted)    │
│  • Rent-vs-Buy projection                                              │
│  • Top-10 open-house email (StreetEasy data + manual refinement)       │
│  • Printable rubric worksheet (free tier graduation artifact)          │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Tiers

| Tier | Who it's for | What they get |
| --- | --- | --- |
| **Free** | Anyone curious about what makes them happy | Intake + Places Q&A + rubric-building via sold-home calibration + printable rubric worksheet. **Ends at a PDF they can use anywhere.** |
| **Paid 1** | Couples actively searching | Everything in Free, plus: live property queue, daily emails, Claude-powered auto-scoring, consensus page, compare, pricing analysis, rent-vs-buy, top-10 open-house nudges |
| **Paid 2** | Users who want help | Everything in Paid 1, plus: **a human helper** who rates variables Claude can't evaluate (site-visit variables, subjective judgments, hard-to-find data). This is what unlocks variables like "building smells weird", "sun exposure feels right", "neighbors seem friendly". |
| **On-request** | Anyone at any tier | Ability to schedule a call with an Advisor. Not automatic. Not bundled. Explicit request. |

The Free tier isn't a trial. It's a complete product — "help me figure out what I actually want" — that graduates to a worksheet. Many users won't need to go further.

---

## User roles

- **User** — an individual building a rubric.
- **User-Partner** — any additional person on the same rubric. Supports 2+ (couple, married-with-kids, polycule). N partners = N personal weight sets per variable, N possible rankings when forked.
- **Helper** (paid-2 only) — a remote researcher rating Claude-can't variables from listing data, photos, and web searching.
- **Advisor** (on-request) — a human who meets with users for guided sessions.

---

## Key flows

### F1 — First session (free tier)

1. Land on marketing page → sign up
2. **Intake:** budget ceiling (optional: "I don't know, help me" → savings/income/rent Q&A → rough ceiling)
3. **Rent vs buy?** → "Buying" / "Renting" / "Both" / "Help me decide" (latter opens rent-vs-buy projector). Sets search mode. **v1 = buying only; renting added later.**
4. **Kitten explainer** — one-time interactive explainer of Smile Analysis using kittens, not houses. Skippable. Never shown again.
5. **Places Q&A** — "Where are the places you need to be?" conversational flow. Each partner's work. School. Parents. Gym. Anywhere else. No cap.
6. **Category Q&A** — "What do you want near home?" — coffee shop, grocery, yoga, climbing, bookstore, etc. Each becomes a rubric variable with auto-suggested weight.
7. **Calibration session 1** — 3-5 recently-sold homes in their rough target area. For each: *"What do you like about this?" → "What don't you like?"* Each answer becomes a draft variable. Partner does the same, independently or together.
8. **Weight them** — slider from `-25` to `+25`. Slot-between-neighbors confirmation: *"7 smiles would put this between Doorman (3) and Pool (10). Sounds right?"*
9. End of session → user has ~15-25 variables. Option to **print worksheet** (free tier complete) or **continue to live properties** (paid upsell).

### F2 — Daily rhythm (paid)

Every day, Claude:
- Searches for new properties in saved areas within ceiling
- Auto-scores every variable it can
- Flags subjective variables to the user, site-visit variables to the helper (paid-2)
- Sends each user on the rubric their own email

The email always sends, even with nothing to show:

- **Properties found:** links + preview smile scores, "review these"
- **Nothing today:** "Zero new properties today. We'll email as soon as we find good options. Search day 12."
- **Nothing for a week:** "Nothing close to your rubric went up this week. Want to adjust your criteria?"

When the user opens the app, the **queue** is sorted by smile-potential. Properties don't expire — if they skip 5 days, they come back to 5 properties to review, ranked. Quick-review mode lets them burn through the queue.

### F3 — Rubric evolution

The rubric is never "done." Every property review is a chance to:
- Add a new variable (anything they notice they care about)
- Adjust existing weights
- Flip a smile to a frown or vice versa

New variables trigger the slot-between-neighbors flow. Partner sees it next time they open the app and weights it too.

### F4 — Consensus

The **Consensus page** is the soul of the app. It's a sorted list of disagreements, biggest delta first.

Each row:
- Variable name + definition
- Partner A's weight · slider
- Partner B's weight · slider
- Delta (e.g. "12 smiles apart")
- Actions: *"Suggest compromise"* (auto-averages, one-tap accept by each partner) · *"Discuss this"* (leaves it open) · *"We don't agree"* (forks)

Small deltas (1-2) get an auto-compromise suggestion surfaced inline. Large deltas get a "this might need a conversation" tag, but no pressure.

At the top of the page: **"You disagree on 7 of 42 variables. That's healthy — 90% of couples disagree on something."** Reframing the whole experience.

When a variable gets fork-locked via "We don't agree", it's celebrated — small animation, gentle note: *"Your rubric just got more honest."*

### F5 — Ranking with and without fork

- **Full consensus rubric:** single joint leaderboard ranked by Cost per Smile.
- **Forked rubric:** joint leaderboard shows **only** properties that rank top-N for all owners. Properties where rankings diverge wildly (Jack's #1 is Jill's #14) are hidden from joint view and live on personal lists.
- **N-partner (polycule):** N personal rankings. Joint view requires N-way top-N overlap. This is rarer and harder; expect more personal-ranking usage.

### F6 — Open house nudge

When a property cracks the top 10 of any rubric (or top 10 joint if un-forked), the user gets a dedicated email:

> "4 Carroll Gardens is now your #3. There's an open house Sunday at 2pm. [Add to calendar]"

Open house data sourced from StreetEasy initially. Quality is uneven — a v2 feature is a better open-house database we own (crowdsourced from users + helper-verified).

### F7 — Pricing analysis (v1 placeholder)

Accessed from any property detail. User pastes 3-5 recent-sold comps. App computes price-per-sqft ratio, outputs plain-English verdict:

> "4 Carroll Gardens is priced $47/sqft above recent comparable sales — roughly 8% over market."

Sets an **upper-limit** for their offer. Not a recommendation; a warning light. v2: smile-weighted comp comparison. v3: automatic comps via MLS.

### F8 — Rent vs buy

Triggered by intake or by explicit menu. Inputs: current rent, savings, income, target property price, horizon. Output: 30-year projection chart — buy scenario vs. stay-renting-and-invest-difference scenario. Based on the sheet's "What Can You Afford" model.

**Crucially:** if renting wins, the app says so honestly. "Based on your inputs, renting looks better for the next 10 years." The app does not force ownership.

Also drives **search mode** — if user lands on "rent wins," the app offers to switch their search to rentals instead. (v1 only supports buying; this becomes a "switch to renting when we add it" hook.)

---

## User stories (grouped by role)

### User / User-Partner

- As a **User**, I want to understand Smile Analysis through a simple metaphor (kittens) before I think about houses.
- As a **User**, I want to know roughly what I can afford without committing to a process.
- As a **User**, I want to decide whether to rent or buy before I start searching.
- As a **User**, I want to tell the app which addresses matter to me (work, school, parents) so it measures commute automatically.
- As a **User**, I want to tell the app which categories I care about (yoga, coffee, climbing) so they become variables.
- As a **User**, I want to build my rubric by reacting to real sold homes, not by filling out a form.
- As a **User**, I want my own slider for every variable, independent of my partner's.
- As a **User**, I want to add a new variable at any time — during calibration, while reviewing a property, whenever I notice something I care about.
- As a **User**, when I add a variable, I want the app to help me place its weight by comparing it to two existing variables.
- As a **User**, I want the ability to turn a smile into a frown (negative weight) without deleting and re-adding.
- As a **User**, I want a queue of properties prioritized by how well they match my rubric.
- As a **User**, I want a daily email — even when there's nothing — so I know the system is alive.
- As a **User**, I want to see when my search has been dry for too long, with an offer to adjust criteria.
- As a **User**, I want a detailed breakdown of a property's smile score — which variables matched, which didn't, which are unknown.
- As a **User**, I want to compare 2-4 finalists side-by-side.
- As a **User**, I want to see a property's Cost per Smile in one clear number.
- As a **User**, I want to check if a property is priced right by comparing recent comps.
- As a **User**, I want to project my 30-year net worth if I buy this place vs. if I keep renting.
- As a **User**, I want an email when a property cracks my top 10 so I can plan to see it.
- As a **Free user**, I want to print my rubric as a worksheet so I can use it outside the app.
- As a **User**, I want to request a call with an advisor if I'm stuck.

### User-Partner (the 2nd+ person)

- As a **Partner**, I want to weight variables separately and honestly.
- As a **Partner**, I want to choose whether my partner and I work on one device together or on separate devices.
- As a **Partner**, I want a single page where I see all our disagreements, sorted by size.
- As a **Partner**, I want to suggest a compromise on a variable and have my partner accept or counter.
- As a **Partner**, I want to say "we don't agree" and have the app accept that, not push us to agree.
- As a **Partner**, I want to see rankings change when we resolve a disagreement.
- As a **Partner**, I want to see which disagreements actually affect our rankings, so we focus on the ones that matter.
- As a **Partner**, I want the app to tell me when we've reached full consensus (celebration) or fully forked (also fine).

### N-Partner (polycule, ≥3)

- As a member of a **3+ person rubric**, I want the same interactions as a 2-person couple but with N sliders per variable.
- As an N-partner, I want the Consensus page to show every pairwise or group-wide disagreement.
- As an N-partner, I understand joint rankings require top-N overlap across all of us and may be empty when we're all over the place — personal rankings still work.

### Helper (Paid 2)

- As a **Helper**, I want a queue of variables assigned to me across all my clients' properties.
- As a **Helper**, I want to see the variable definition, the property, and any prior notes before rating.
- As a **Helper**, I want to mark a variable as "needs a site visit" vs. "answered from photos/web" so the client knows what I checked.

### Advisor (on-request)

- As an **Advisor**, I want to see a user's full rubric, property queue, and open disagreements before our meeting.
- As an **Advisor**, I want a running notes field per user.

### Admin

- As an **Admin**, I want to seed sold-home calibration data for each NYC neighborhood.
- As an **Admin**, I want to track tier distribution and conversion.
- As an **Admin**, I want to see which variables Claude can't evaluate and add them to a playbook for helpers.

---

## Screens inventory

1. Landing page (NYC-targeted marketing)
2. Signup / login
3. Intake — budget (optional deep path with savings/income/rent)
4. Rent-vs-Buy chooser (+ projector tool when requested)
5. Kitten explainer (one-time, skippable)
6. Places Q&A — addresses
7. Category Q&A — neighborhood wants
8. Calibration — rate a sold home
9. Rubric builder (running view of all variables)
10. Add-variable flow (slot-between-neighbors)
11. Consensus page
12. Property queue
13. Property detail
14. Property compare (2-4)
15. Pricing analysis (per property)
16. Rent-vs-Buy projector (standalone tool)
17. Top-10 / open-house view
18. Rubric worksheet printable (free-tier graduation)
19. Settings (addresses, search areas, email cadence, partners, advisor request)
20. Helper dashboard (paid-2 backend)
21. Advisor dashboard (backend)

---

## Technical notes

### Stack
- **Frontend:** React + TypeScript + Next.js + Tailwind
- **Backend:** Next.js server actions + Supabase (Postgres + Auth)
- **Auto-scoring:** Claude API (Anthropic)
- **Mapping / commute:** Google Maps Distance Matrix API
- **Places:** Google Places API
- **Walkability:** WalkScore API (or derive from Places density as fallback)
- **Property data:** manual paste + Claude extraction (v1); StreetEasy/Zillow background search (v2); MLS (final)
- **Open house data:** StreetEasy scrape + manual override (v1); owned crowdsourced db (v3)
- **Email:** Postmark or Resend
- **Payments:** Stripe
- **Scheduled jobs:** Supabase cron for daily search and email
- **PDF export:** React-PDF for the rubric worksheet

### Data model sketch

```
users(id, email, tier, created_at)
rubrics(id, name, created_at)
rubric_members(rubric_id, user_id, display_name)     -- N-way
search_profiles(rubric_id, buy_or_rent, ceiling_usd, areas[], timeline)
addresses(rubric_id, label, address, geocode, importance)
variables(id, rubric_id, name, area, definition, is_auto_scorable, needs_human, created_by)
variable_weights(variable_id, user_id, weight)       -- -25..+25, one row per (variable, user)
variable_status(variable_id, status)                 -- 'agreed' | 'open' | 'forked'
properties(id, rubric_id, address, price, sqft, hoa, taxes, url, raw_data_jsonb)
property_scores(property_id, variable_id, matched)   -- true/false/null
scoring_tasks(property_id, variable_id, assigned_to, status)  -- claude|helper|user
daily_digests(rubric_id, user_id, date, properties_shown[])
financial_assumptions(user_id, interest_rate, down_payment_pct, horizon_years)
```

`smile_score`, `annual_cost`, `cost_per_smile` are always computed — never stored — so rubric changes instantly reflow the leaderboard.

### Auto-scoring routing (the Claude loop)

For each new property, for each variable, a scorer is selected:

| Variable type | Example | Scorer |
| --- | --- | --- |
| Measurable via API | commute time, walkability, distance to yoga studio | Claude + relevant API |
| Visible in listing | open kitchen, high ceilings, big windows | Claude reading listing photos + description |
| Web-researchable | "near a good bakery", "on the Q train" | Claude web search |
| Subjective to user | "feels cozy", "Polly can cart to a street sale" | Send to user |
| Needs site visit / deep research | "smells weird", "neighbors seem friendly", "actually gets afternoon sun" | Send to helper (Paid 2 only) |

Tagged per-variable at creation; user can override routing.

---

## Build stages

The app expands slowly. Each stage ships and gets user-tested before the next starts. **MLS integration is deliberately last.**

| Stage | Scope | Graduation criterion |
| :-: | --- | --- |
| 0 | Landing page + signup + intake + rent-vs-buy chooser + kitten explainer | Real signups from FB ads |
| 1 | Places Q&A + Category Q&A + calibration with admin-seeded sold homes + rubric builder + worksheet PDF export | 10 free-tier users finish the worksheet |
| 2 | Partner mode + Consensus page + forking | 5 couples complete a shared rubric |
| 3 | Manual property paste + Claude auto-scoring + property queue + detail view + leaderboard | 3 paid users actively scoring real properties |
| 4 | Compare view + Cost-per-Smile hero presentation + pricing analysis v1 (pasted comps) + rent-vs-buy projector | Paid tier retention measured |
| 5 | Daily email + queue prioritization + "zero today" + "nothing this week" flows | Daily-email open rate baseline |
| 6 | Background Claude search (Zillow/StreetEasy) for new properties | Autonomous property discovery working |
| 7 | Open house extraction from StreetEasy + top-10 email | First user reports attending a nudged open house |
| 8 | Paid tier 2 — helper role, helper dashboard, variable routing to helpers | First helper hired |
| 9 | N-partner (polycule) support | First 3-partner rubric |
| 10 | Pricing analysis v2 (smile-weighted comps) | — |
| 11 | Rentals as a search mode | First rental user |
| 12 | Owned open-house database (crowdsourced + verified) | — |
| 13 | Advisor-requested sessions, advisor dashboard | First advisor meeting |
| 14 | **MLS integration** | Only build when stages 0-13 are battle-tested |

---

## Out of scope (v1 and beyond)

- Mortgage pre-approval / loan origination
- Offer submission
- Agent matching / referrals
- Native mobile apps (mobile web is responsive-enough until stage 10+)
- Listing Claude as fiduciary — we are not lawyers or real estate licensees; the app provides decision support, not representation
