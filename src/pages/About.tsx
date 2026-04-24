import { Link } from "react-router-dom";
import { Button } from "@/components/ui";

/**
 * Educational page about the method. The kitten explainer lives one click
 * deeper from here — it isn't in the main flow, but anyone curious can open
 * it. Tonally a doc, not a pitch.
 */
export function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="eyebrow mb-3">What is Smile Analysis</p>
      <h1 className="text-heading-l font-semibold text-ink-primary tracking-tight">
        A rubric for the biggest decision of your life.
      </h1>

      <div className="mt-10 space-y-6 text-body-l text-ink-secondary leading-[1.55]">
        <p>
          Most home-search tools sort by price or square footage. That's useful for filtering,
          but useless for deciding. The thing that actually matters is <em>happiness per dollar</em> —
          how much a given place makes you smile, weighed against what it costs to live there.
        </p>
        <p>
          We turn that into a number. You build a rubric of everything that would make a home
          better or worse — open kitchen, near the F train, loud neighbors, third bedroom,
          whatever. Each variable gets a weight from −25 to +25. Properties get scored against
          the rubric. The headline is <strong className="text-ink-primary">cost per smile</strong>:
          dollars per year divided by net smile score.
        </p>
        <p>
          Couples build one rubric together. You weight variables separately — your partner
          doesn't see your weights until you both commit — and the tool surfaces any
          disagreements on a dedicated page, sorted by size. We accept disagreements; we
          don't push you toward compromise. Honesty over harmony.
        </p>
      </div>

      <div className="mt-12 rounded-md border border-border-subtle bg-bg-elevated p-6">
        <h2 className="text-heading-m font-semibold text-ink-primary">The kitten demo</h2>
        <p className="text-body text-ink-secondary mt-2 mb-5">
          A 3-minute interactive that teaches the method using kittens instead of houses.
          Worth the time if it's your first time through.
        </p>
        <Link to="/kittens" className="btn-ghost">Open the kitten demo</Link>
      </div>

      <div className="mt-10 flex gap-3">
        <Link to="/signup" className="btn-primary">Start your rubric</Link>
        <Link to="/" className="btn-link">← Back to home</Link>
      </div>
    </div>
  );
}
