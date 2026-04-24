# Smile Analysis — Front-End Design Spec

**Audience for this doc:** the designer/design-AI building the UI.
**Companion doc:** `SMILE_APP_SPEC.md` (product spec, data flow, user stories, screens list, build stages).
**Primary platform:** Desktop web. Mobile = simplified views only.

---

## Design direction

**The tension to hold:** this app is about *feelings* (is this home happy-making? do we agree?) but it's also doing *real math* on the biggest financial decision of someone's life. If it looks too playful, users won't trust it with $500K. If it looks like a bank, the "smile" concept dies. And it must reassure couples who are stressed, not performance-coach them toward harmony.

**The target:** confident + warm + honest. Think *financial dashboard that actually likes you and doesn't mind when you disagree with your partner.* Closer to Monarch Money or Linear than to Zillow or Redfin.

**Three words:** **Warm. Precise. Honest.**

**The one thing someone remembers:** the Cost-per-Smile number rendered as editorial typography in a serif display face — treated like a poster moment rather than a stat.

---

## Typography

### Primary pairing (recommended)

| Role | Font | Why |
| --- | --- | --- |
| **Display / headlines / hero numbers** | **Gambarino** (Fontshare, free) | A quirky modern serif with rounded terminals — carries warmth and personality without feeling retro. Perfect for the "Cost per Smile" hero number and property addresses. Reads as editorial / human. |
| **UI / body / data** | **Satoshi** (Fontshare, free) | Geometric sans with subtle humanist touches. Feels tech-forward and innovative (Stripe/Linear-adjacent) without being as overused as Inter. Excellent at small sizes for data tables. |
| **Numeric / tabular** | **Satoshi** with `font-variant-numeric: tabular-nums` | Rubric weights, dollar amounts, smile counts — all numeric columns must use tabular lining figures so they align. |

**Why not Inter:** Inter is fine but it's the default choice for every SaaS; the app loses its distinct identity. Satoshi gets you the clarity without the sameness.

**Why a serif for display:** "Home" is emotional. A well-chosen serif carries more warmth than any sans in 2 lines of copy. Gambarino specifically has enough quirk (open counters, gentle curves) to match the "smile" concept without tipping into whimsy.

### Alternate pairing (if the above feels too characterful)

- **Display:** Instrument Serif (Google Fonts, free) — more restrained editorial serif
- **Body:** Geist (Vercel, free) — very clean modern sans

### Type scale

```
Display XL   — 72px / 0.95 / -0.04em  Gambarino  (the Cost-per-Smile hero)
Display L    — 56px / 1.00 / -0.03em  Gambarino  (page titles)
Display M    — 40px / 1.05 / -0.02em  Gambarino  (property name)
Heading L    — 28px / 1.15 / -0.01em  Satoshi 600
Heading M    — 20px / 1.25 / -0.01em  Satoshi 600
Heading S    — 16px / 1.30 /  0.00em  Satoshi 600 (uppercase, letter-spacing 0.08em for section eyebrows)
Body L       — 18px / 1.50            Satoshi 400
Body         — 15px / 1.55            Satoshi 400
Body S       — 13px / 1.50            Satoshi 400
Caption      — 12px / 1.40            Satoshi 500 (uppercase, letter-spacing 0.06em)
Numeric XL   — 64px / 1.00 tabular    Satoshi 500 (dollar amounts in detail views)
```

---

## Color system

Warm off-white base, deep ink, a single confident warm accent for "smile" moments, and a muted clay for "frown." Avoid pure black, pure white, and avoid the generic purple gradient.

```css
:root {
  /* Surfaces */
  --bg-base:        #FAF7F2;  /* warm off-white, slightly creamy */
  --bg-elevated:    #FFFFFF;  /* cards, modals */
  --bg-inset:       #F1ECE3;  /* table stripes, code, quoted variables */
  --bg-muted:       #E8E1D3;  /* hover fills */

  /* Ink */
  --ink-primary:    #1C1A16;  /* deep warm black — never pure #000 */
  --ink-secondary:  #4A4538;
  --ink-tertiary:   #807868;
  --ink-disabled:   #B8AF9C;

  /* Smile = positive. A warm amber/gold. Confident, not cartoonish. */
  --smile-50:   #FDF6E3;
  --smile-100:  #F9E8B8;
  --smile-300:  #EFC65A;
  --smile-500:  #D89B1F;   /* primary */
  --smile-700:  #9C6D10;
  --smile-900:  #5C3F05;

  /* Frown = negative. Muted terracotta — serious, not alarming. */
  --frown-50:   #FBEEE8;
  --frown-300:  #D48874;
  --frown-500:  #B55A3E;   /* primary */
  --frown-700:  #7E3A24;

  /* Ink-blue accent for interactive / links / "action" moments */
  --action-50:  #EEF0F7;
  --action-300: #7985B8;
  --action-500: #3A4A8C;   /* primary */
  --action-700: #23305F;

  /* Success / pass / "great value" green — used sparingly, only for best-in-class cost-per-smile */
  --value-500: #4A7C5B;
  --value-100: #DDEBE0;

  /* Borders */
  --border-subtle:  #E4DCCB;
  --border-default: #D1C7B2;
  --border-strong:  #1C1A16;  /* when we want a brutal hairline */
}
```

**Usage rules:**
- **Smile amber is the brand color.** Use it sparingly — only on smile-point badges, the hero Cost-per-Smile number when it's a winner, and the primary CTA.
- **Ink-blue is the action color** — buttons, links, focus rings.
- **Green only appears** when a property lands in the top 10% of cost-per-smile (the "Best Value" badge). Never use it broadly as a "success" state — that waters down the win.
- **Never gradients.** Flat surfaces throughout. Depth comes from hairline borders and soft drop shadows, not gradient washes.

---

## Shape, spacing, shadow

### Corner radius
- Buttons, inputs: `8px`
- Cards: `12px`
- Modals / sheets: `16px`
- Tags / pills: `999px` (fully rounded)
- Images: `4px` (subtle — we're not Pinterest)

### Spacing scale (4px base)
`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96, 128`

### Shadows
```css
--shadow-xs:  0 1px 2px rgba(28, 26, 22, 0.04);
--shadow-sm:  0 2px 6px rgba(28, 26, 22, 0.06);
--shadow-md:  0 8px 24px rgba(28, 26, 22, 0.08);
--shadow-lg:  0 24px 48px rgba(28, 26, 22, 0.12);
```

### Borders
Prefer `1px solid var(--border-subtle)` hairlines over shadows for most card edges. Reserve shadow for floating elements (modals, dropdowns).

---

## Iconography

- **Library:** Lucide (already in Jamie's stack)
- **Stroke width:** 1.5px (slightly finer than default for refinement)
- **Avoid emoji 😃 / ☹️** in the UI except as deliberate display moments. Instead use a custom "smile" glyph (simple upward arc) and "frown" glyph (downward arc) as SVG, tied to brand color. The sheet used emoji as shorthand; the app should elevate it.

---

## Simple view vs. Power view

The app ships with **Simple view on by default**. Users can flip to Power view from settings.

**Simple view principles:**
- One thing on screen at a time
- Lots of whitespace
- Never more than one table per page
- Complex numbers hidden under "Show details"
- Decisions presented as yes/no or tap-a-card, never multi-field forms
- Max 5 variables visible at a time — rest collapse under "see all"

**Power view:**
- Dense tables allowed
- Multi-column compare views
- All variables visible at once
- Advanced filters exposed

Every screen is designed twice. The spec below flags which mode each refers to.

---

## Key component specs

### The Cost-per-Smile card (the money shot)

The single most important visual element. Appears on every property detail page and at the top of the leaderboard.

```
┌────────────────────────────────────────────┐
│  COST PER SMILE                     [badge]│   ← caption eyebrow
│                                             │
│  $67                                        │   ← Display XL, Gambarino
│  per smile per year                         │   ← Body S, tertiary
│                                             │
│  ─────────                                  │   ← hairline separator
│  422 smiles · $43,615/yr · rank #1 of 36    │   ← caption row
└────────────────────────────────────────────┘
```

- Badge in top-right: if cost-per-smile is in top 10%, green **"Best Value"** pill. If bottom 25%, neutral "Expensive" pill. Otherwise no badge.
- The $ number itself animates on mount: count up from 0 in 600ms, easeOutQuart. One tasteful animation, not many.

### The rubric variable row

```
┌────────────────────────────────────────────────────────────┐
│  [area pill]  Variable name            [slider -25..+25]   │
│  definition text in tertiary ink                           │
└────────────────────────────────────────────────────────────┘
```

- Area pill uses tinted background: `In` = amber-100, `Around` = blue-100 equivalent, `Building` = green-100 equivalent, `Commute` = ink-blue-100. Lowercase label.
- **Slider is continuous from -25 to +25, crossing zero.** Thumb turns amber above zero, terracotta below. The track has a visible zero-line so users understand the crossing point.
- When partner mode is on, the row shows **two (or N) sliders stacked**, one per person, with a connecting bar showing delta. If delta > 2, the row gets a subtle frown-tinted background and a "Resolve" action.

### The slot-between-neighbors confirmation

After a user sets a weight for a new variable:

> *"7 smiles would put this between **Doorman** (3) and **Pool** (10). Sounds right?"*

Modal with the two anchor variables shown visually in their slots, the new one dropping in animated between. One-tap confirm / adjust slider to try again.

### Leaderboard row (Simple view)

- Left: thumbnail 72×72, 4px radius
- Center: Address (Heading M, Gambarino), neighborhood (Body S, tertiary)
- Right: Cost per Smile (numeric large, tabular), and a tiny smile/frown split bar
- Hover: `--bg-muted` fill, cursor pointer

### Leaderboard row (Power view)

Adds columns: smile count, frown count, annual cost, search day added, auto-score confidence. Tabular, sortable.

### Property score checklist

Variables grouped by area. Each row:
- Circle checkbox: ✓ (amber fill), ✗ (ink outline), ? (dashed outline, "unknown")
- Variable name
- Weight shown in caption style to the right
- If auto-scored by Claude with low confidence, small indicator "auto, verify?"
- If human-helper-scored, small indicator with helper initials
- Tapping ✓ causes a subtle 200ms amber pulse and the running total at the top ticks up

### Consensus page

```
┌─────────────────────────────────────────────────────────────┐
│  You disagree on 7 of 42 variables.                         │  ← Heading L
│  That's healthy — 90% of couples disagree on something.     │  ← Body, tertiary
│                                                              │
│  ──────  Sorted by size of disagreement  ──────             │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ [area pill]  Near a yoga studio         [12 apart]    │  │  ← Heading M
│  │ "within a 10-minute walk"                             │  │  ← Body S
│  │                                                       │  │
│  │ Jack  ────●────────────── +4                          │  │  ← dual slider
│  │ Jill  ─────────────────●─ +16                         │  │
│  │                                                       │  │
│  │ [Suggest compromise: +10] [Discuss] [We don't agree] │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

- Deltas of 1-2 show the **Suggest compromise** button featured (amber primary).
- Deltas > 2 feature **Discuss** and **We don't agree** equally — no pressure toward compromise.
- When "We don't agree" is tapped, row animates gently: variable gets a "forked" badge, slides to a "Forked variables" section at the bottom. Toast: *"Your rubric just got more honest."*

### Kitten explainer

One-time interactive moment, 5-6 screens:

1. *"Do you prefer dogs or cats?"* — tap one.
2. *"Great. Here are two kittens."* — two photos side by side.
3. *"This one costs $10,000. This one costs $1."* — prices overlaid.
4. *"Which do you want?"* — invite the user to choose.
5. Regardless of choice: *"That's Smile Analysis. We help you find the kitten — or home — that gives you the most smiles per dollar."*
6. *"Ready?"* → continues to app.

Never shown again. A "What is Smile Analysis?" link in the help menu can replay it.

### Daily email layouts

**Properties today:**
```
Subject: 3 new places worth a look — day 12 of your search

1. 4 Carroll Gardens        $67/smile · 422 smiles
2. 211 Park Slope           $92/smile · 313 smiles
3. 88 Windsor Terrace       $101/smile · 288 smiles

[View in Smile Analysis →]
```

**Nothing today:**
```
Subject: Quiet day — day 13 of your search

Zero new properties today. We're watching. We'll email the moment
we find one that matches your rubric.
```

**Nothing for a week:**
```
Subject: Day 20 and nothing close — want to adjust?

We haven't found anything close to your rubric in 7 days.
That might mean the market is quiet, or your rubric is tight.

[Broaden areas] [Raise budget] [Loosen a variable]
```

---

## Landing page spec

**Audience:** NYC-metro home buyers (Manhattan / Brooklyn / Queens / BX / SI / JC / Hoboken / Westchester / Long Island) who are early-to-mid in the search and feel overwhelmed.

**Hero message:**

> **NYC has 300 neighborhoods.**
> **All of them are right for someone.**
> **Find happiness with a Smile Analysis.**

Display L serif, left-aligned, on `--bg-base`. Below: a single ink-blue CTA *"Start your rubric"* and a secondary *"See how it works"* text link that scrolls to the kitten explainer.

**Below the fold, in order:**

1. **The kitten demo — interactive, right there on the page.** Visitor can click through it without signing up. This *is* the "how it works." Ends with a soft CTA: *"Try it with real homes."*

2. **Why Smile Analysis?**
   Three cards, left-aligned prose, no icons:
   - **Honesty, not harmony.** *"Couples disagree on where to live. We don't make you pretend otherwise. Disagreements get their own page, sorted by size, celebrated when they're real."*
   - **Happiness per dollar.** *"The biggest financial decision of your life is also the biggest happiness decision. We measure both."*
   - **Built for NYC's sprawl.** *"Queens, Jersey City, Ossining, Astoria, Park Slope, Montclair. Different commutes, different prices, different lives. Our rubric speaks all of them."*

3. **The rubric, shown.** A static screenshot of a real rubric (anonymized). Hover = reveal the Cost-per-Smile hero for one of the properties. Subtext: *"This is what you build. In about two evenings."*

4. **NYC-specific credibility strip.** Sample neighborhoods and their quirks — a small set of 2-sentence vignettes:
   - *"Park Slope is brownstones and strollers. 50 min to Midtown. $1.3M for a 2-bed."*
   - *"Ditmars is Greek food and quiet. 35 min to Midtown. $800K for a 2-bed."*
   - *"Jersey City is 12 min to Manhattan and half the price. Different state. Different taxes."*
   - *"Ossining is a Metro-North ride and a house with a yard. Different life."*

5. **Tiers.** Free · Paid 1 · Paid 2. Keep it short. *"Start free. Upgrade when you're ready to search live properties."*

6. **FAQ, collapsed.** Including:
   - *"Will this replace my real estate agent?"* → No. Your agent closes the deal. We help you know which deal to chase.
   - *"What if my partner and I disagree?"* → That's the feature, not a bug.
   - *"What about renting?"* → Coming soon. For now we help you decide whether to buy at all.
   - *"Do you sell my data?"* → No.

7. **Footer.** Tiny.

**Landing page design notes:**

- **No video** for v1 — the kitten explainer interactive is the video. (Cheaper; better anyway.)
- **No logos of press/clients** until we have them. Empty social-proof is worse than no social-proof.
- **One photo, maybe two.** Resist the urge to flood with real-estate photography. The typography is the hero.
- **Single subtle paper-grain SVG filter overlay** on the page background (3% opacity) for warmth. The app itself doesn't use it; landing can.
- **CTAs never pulse, never change color, never use scarcity language.** This isn't a drop.

---

## Motion

**Rule:** motion exists to teach cause-and-effect. Not decoration.

High-impact moments where animation earns its place:
- Cost-per-Smile number count-up on property load (600ms, easeOutQuart)
- Variable check causes smile total to increment with a 200ms spring
- Leaderboard re-rank animates rows vertically with FLIP (Motion library's `layout` prop) over 400ms
- Consensus fork: variable gracefully slides to the "Forked" section over 500ms
- Kitten explainer: gentle staggered card reveals, nothing bouncy

Everything else: instant or ≤150ms ease.

**Do not:** use fade-in page transitions, scroll-triggered reveals, bouncy buttons, animated gradients.

---

## Responsive behavior

- **Desktop (≥1024px):** full power. All compare views, Consensus page, all dashboards.
- **Tablet (≥768px):** single-column rubric, compare limits to 2 properties, Consensus page stacks sliders vertically.
- **Mobile (<768px):**
  - Available: daily-email link destinations, property queue, property detail, quick-score flow (swipe ✓/✗/?), Consensus page view-only
  - Not available: rubric editing, compare view, pricing analysis. Mobile shows a gentle banner: *"Open on desktop to edit your rubric."*
  - The mobile simplified views are genuinely usable, not dumbed down — a mobile user can burn through 5 properties in their queue before bed, but they come to desktop to do the heavier work.

---

## Accessibility

- All text meets WCAG AA (4.5:1) against its background. Tertiary ink is borderline — restrict to decorative captions only.
- Smile/frown states never rely on color alone — always include the ✓/✗ glyph or a + / − prefix.
- Focus rings: `2px solid var(--action-500)` with `2px offset`. Never remove focus.
- Slider controls must be keyboard-operable (arrow keys step ±1, Shift+arrow steps ±5, Home = -25, End = +25).
- Consensus page must be navigable via keyboard-only — every variable row has tab-reachable action buttons.

---

## Don'ts

- No purple/indigo anywhere
- No glassmorphism, no blur backdrops
- No emoji as functional UI (decorative only on landing pages)
- No "AI sparkle" icons for auto-scoring — use a simple filled circle instead
- No center-aligned long-form text
- No default shadcn card look (flat white card, grey border) — we use warm hairlines on cream
- No Inter, no Roboto, no system-ui fallback as the primary
- No "progress toward consensus" progress bar — it would falsely imply fork = failure
- No gamification streaks. No daily-engagement scoring. The user doesn't need to win at using the app.

---

## Asset requirements

- **Logo:** monoline smile-arc glyph + "Smile Analysis" wordmark in Gambarino
- **Favicon:** the arc, amber on warm-off-white
- **Property placeholder image:** subtle line drawing of a house, amber stroke on `--bg-inset`
- **Kitten photos:** licensed, warm, both cute — intentionally not "before/after" compared. v1 can use Unsplash.
- **Neighborhood vignette photos (landing):** two, maybe three, editorial quality, warm color grade

---

## Dark mode

Yes, eventually — but v1 ships light mode only. Light mode suits the "warm, optimistic, honest" positioning better. When dark mode comes, invert to a warm near-black (`#1C1A16`) with the amber accent brightened to `#F0C247`.

---

## Inspiration references (mood only)

- **Monarch Money** — warm financial dashboard energy
- **Linear** — precision + restraint in the UI
- **Arc Browser** — confident serif display type in a tech product
- **Readwise** — serif + sans pairing in a data-heavy context
- **Cash App investing views** — editorial numbers

**Avoid pulling from:** Zillow, Redfin, Trulia, Compass, StreetEasy — generic real-estate design is exactly what we're escaping.
