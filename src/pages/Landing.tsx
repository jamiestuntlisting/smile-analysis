import { Link } from "react-router-dom";
import { Button, Card, Eyebrow, Pill } from "@/components/ui";
import { SmileGlyph, FrownGlyph } from "@/components/Glyph";
import { NEIGHBORHOOD_VIGNETTES } from "@/data/neighborhoods";
import { useState } from "react";
import { CostPerSmileCard } from "@/components/CostPerSmileCard";

export function Landing() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  return (
    <div>
      {/* Hero */}
      <section className="relative max-w-[1240px] mx-auto px-6 pt-16 pb-24 grain overflow-hidden">
        <div className="relative z-10 max-w-[820px]">
          <Eyebrow className="mb-6">NYC home search · honestly</Eyebrow>
          <h1 className="serif text-display-l md:text-[80px] leading-[0.98] tracking-[-0.035em] text-ink-primary">
            NYC has 300 neighborhoods.
            <br />
            All of them are right for someone.
            <br />
            <span className="text-smile-700">Find happiness</span> with a Smile Analysis.
          </h1>
          <div className="mt-10 flex items-center gap-5">
            <Link to="/signup" className="btn-primary !px-6 !py-3 !text-body-l">
              Start your rubric
            </Link>
            <Link to="/kittens" className="btn-link">
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* Kitten demo placeholder strip */}
      <section className="bg-bg-inset border-y border-border-subtle">
        <div className="max-w-[1240px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="serif text-display-m mt-3 text-ink-primary leading-[1.08]">
              We explain Smile Analysis with kittens.
            </h2>
            <p className="text-body-l text-ink-secondary mt-5 max-w-lg">
              A one-time interactive moment, before you start thinking about homes.
              It's about three minutes. It's skippable. You never see it again.
            </p>
            <Link to="/kittens" className="btn-smile mt-8 inline-flex">
              Try the kitten demo
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <KittenPreview
              emoji="🐈"
              price="$10,000"
              label="Very expensive kitten"
            />
            <KittenPreview
              emoji="🐈‍⬛"
              price="$1"
              label="Very cheap kitten"
            />
          </div>
        </div>
      </section>

      {/* Three cards */}
      <section className="max-w-[1240px] mx-auto px-6 py-24">
        <Eyebrow>Why Smile Analysis</Eyebrow>
        <h2 className="serif text-display-m text-ink-primary mt-3 max-w-2xl leading-[1.08]">
          Built for the biggest decision of your life. Without pretending you agree on all of it.
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: "Honesty, not harmony.",
              body: "Couples disagree on where to live. We don't make you pretend otherwise. Disagreements get their own page, sorted by size, celebrated when they're real.",
            },
            {
              title: "Happiness per dollar.",
              body: "The biggest financial decision of your life is also the biggest happiness decision. We measure both — as one number.",
            },
            {
              title: "Built for NYC's sprawl.",
              body: "Queens, Jersey City, Ossining, Astoria, Park Slope, Montclair. Different commutes, different prices, different lives. Our rubric speaks all of them.",
            },
          ].map((c) => (
            <Card key={c.title}>
              <h3 className="serif text-heading-l text-ink-primary mb-3">{c.title}</h3>
              <p className="text-body text-ink-secondary">{c.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Rubric screenshot */}
      <section className="bg-bg-inset border-y border-border-subtle">
        <div className="max-w-[1240px] mx-auto px-6 py-24 grid lg:grid-cols-5 gap-16 items-center">
          <div className="lg:col-span-2">
            <Eyebrow>The rubric, shown</Eyebrow>
            <h2 className="serif text-display-m mt-3 text-ink-primary leading-[1.08]">
              This is what you build. In about two evenings.
            </h2>
            <p className="text-body-l text-ink-secondary mt-5">
              Weights from −25 to +25. Smiles cross zero into frowns. A few dozen variables. Properties auto-ranked.
            </p>
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 gap-4 items-start">
              <CostPerSmileCard
                cost={67}
                smile={422}
                annual={43615}
                rank={1}
                outOf={36}
                badge="best"
              />
              <div className="card p-5 space-y-3">
                <MiniVariable name="Open kitchen" weight={8} area="In" match />
                <MiniVariable name="Near the F/G train" weight={10} area="Around" match />
                <MiniVariable name="Doorman" weight={3} area="Building" match={false} />
                <MiniVariable name="Walkup (6 floors)" weight={-6} area="Building" match={false} />
                <MiniVariable name="Private outdoor" weight={14} area="In" match />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Neighborhood strip */}
      <section className="max-w-[1240px] mx-auto px-6 py-24">
        <Eyebrow>Built for NYC</Eyebrow>
        <h2 className="serif text-display-m text-ink-primary mt-3 max-w-2xl leading-[1.08]">
          Four neighborhoods. Four different good lives.
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {NEIGHBORHOOD_VIGNETTES.map((n) => (
            <div
              key={n.name}
              className="card p-6 hover:bg-bg-muted transition-colors"
            >
              <h3 className="serif text-heading-l text-ink-primary mb-2">
                {n.name}
              </h3>
              <p className="text-body text-ink-secondary mb-5 min-h-[4.5rem]">
                {n.blurb}
              </p>
              <div className="flex gap-2 flex-wrap">
                <Pill tone="neutral">{n.commuteMidtown} to Midtown</Pill>
                <Pill tone="neutral">{n.price2br} for 2BR</Pill>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section className="bg-bg-inset border-y border-border-subtle">
        <div className="max-w-[1240px] mx-auto px-6 py-24">
          <Eyebrow>Tiers</Eyebrow>
          <h2 className="serif text-display-m text-ink-primary mt-3 max-w-2xl">
            Start free. Upgrade when you're ready to search live properties.
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <TierCard
              tier="Free"
              price="$0"
              lede="Help me figure out what I actually want."
              bullets={[
                "Intake + Places Q&A",
                "Rubric-building via sold-home calibration",
                "Printable rubric worksheet",
              ]}
              cta={<Link to="/signup" className="btn-primary">Start free</Link>}
            />
            <TierCard
              tier="Paid 1"
              price="$19/mo"
              lede="Actively searching."
              highlight
              bullets={[
                "Live property queue + daily email",
                "Claude auto-scoring, Compare, Cost-per-Smile",
                "Consensus page, pricing analysis, rent-vs-buy",
                "Top-10 open-house nudges",
              ]}
              cta={<Link to="/signup" className="btn-smile">Start searching</Link>}
            />
            <TierCard
              tier="Paid 2"
              price="$79/mo"
              lede="Help me know the things Claude can't."
              bullets={[
                "Everything in Paid 1",
                "Human helper rates site-visit variables",
                "Neighbor-feel, sun exposure, smell, mood",
              ]}
              cta={<Link to="/signup" className="btn-ghost">Talk to us</Link>}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[1240px] mx-auto px-6 py-24">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="serif text-display-m text-ink-primary mt-3">Questions, answered.</h2>
        <div className="divide-y divide-border-subtle border-y border-border-subtle mt-10">
          {[
            {
              q: "Will this replace my real estate agent?",
              a: "No. Your agent closes the deal. We help you know which deal to chase.",
            },
            {
              q: "What if my partner and I disagree?",
              a: "That's the feature, not the bug. Disagreements get their own page. We suggest a compromise when you're close and let you fork when you're not.",
            },
            {
              q: "What about renting?",
              a: "Coming soon. For now we help you decide whether to buy at all — including when renting wins on 30-year net worth.",
            },
            {
              q: "Do you sell my data?",
              a: "No.",
            },
          ].map((f, i) => (
            <button
              key={f.q}
              className="block w-full text-left py-5"
              onClick={() => setFaqOpen(faqOpen === i ? null : i)}
              aria-expanded={faqOpen === i}
            >
              <div className="flex items-center justify-between">
                <span className="text-heading-m font-semibold text-ink-primary">{f.q}</span>
                <span className="text-ink-tertiary">{faqOpen === i ? "−" : "+"}</span>
              </div>
              {faqOpen === i && (
                <p className="text-body-l text-ink-secondary mt-3 max-w-2xl">{f.a}</p>
              )}
            </button>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link to="/signup" className="btn-primary !px-6 !py-3 !text-body-l">
            Start your rubric
          </Link>
        </div>
      </section>
    </div>
  );
}

function KittenPreview({ emoji, price, label }: { emoji: string; price: string; label: string }) {
  return (
    <div className="card p-6 text-center">
      <div className="text-[80px] leading-none select-none">{emoji}</div>
      <div className="serif text-display-m text-ink-primary mt-4">{price}</div>
      <p className="text-body-s text-ink-tertiary mt-1">{label}</p>
    </div>
  );
}

function MiniVariable({
  name,
  weight,
  area,
  match,
}: {
  name: string;
  weight: number;
  area: "In" | "Around" | "Building" | "Commute";
  match: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-border-subtle last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        {match ? (
          <SmileGlyph className="w-4 h-4 shrink-0" />
        ) : (
          <FrownGlyph className="w-4 h-4 shrink-0" stroke="#807868" />
        )}
        <span className="text-body text-ink-primary truncate">{name}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-body-s text-ink-tertiary">{area.toLowerCase()}</span>
        <span
          className={`text-body numeric font-medium ${weight > 0 ? "text-smile-700" : weight < 0 ? "text-frown-700" : "text-ink-tertiary"}`}
        >
          {weight > 0 ? "+" : ""}
          {weight}
        </span>
      </div>
    </div>
  );
}

function TierCard({
  tier,
  price,
  lede,
  bullets,
  cta,
  highlight,
}: {
  tier: string;
  price: string;
  lede: string;
  bullets: string[];
  cta: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`card p-7 flex flex-col ${
        highlight ? "border-ink-primary" : ""
      }`}
    >
      <Eyebrow>{tier}</Eyebrow>
      <div className="serif text-display-m text-ink-primary mt-2">{price}</div>
      <p className="text-body text-ink-secondary mt-2">{lede}</p>
      <ul className="mt-5 space-y-2 flex-1">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-body text-ink-primary">
            <SmileGlyph className="w-4 h-4 mt-1 shrink-0" />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-7">{cta}</div>
    </div>
  );
}

// make Pill available under default import chain (type shadow, unused)
export type _PillCheck = typeof Pill;
