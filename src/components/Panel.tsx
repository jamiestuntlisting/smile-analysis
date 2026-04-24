import type { ReactNode } from "react";

/**
 * Standard tool-page header. Technical/logical tone — Satoshi, not display
 * serif. The tool's job is to reach a conclusion; each panel states what it
 * is asking and offers a quiet continue button in the footer.
 */
export function Panel({
  step,
  title,
  subtitle,
  action,
  children,
  footer,
  width = "wide",
}: {
  step?: string;
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: "narrow" | "wide" | "full";
}) {
  const maxW =
    width === "narrow" ? "max-w-2xl" : width === "full" ? "" : "max-w-5xl";
  return (
    <div className={`${maxW} mx-auto`}>
      <header className="pb-6 mb-6 border-b border-border-subtle flex items-end justify-between gap-6">
        <div>
          {step && (
            <div className="eyebrow text-ink-tertiary mb-2">{step}</div>
          )}
          <h1 className="text-heading-l font-semibold text-ink-primary tracking-tight leading-[1.2]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-body text-ink-secondary mt-2 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div>{children}</div>
      {footer && (
        <div className="mt-10 pt-6 border-t border-border-subtle flex items-center justify-between gap-4 flex-wrap">
          {footer}
        </div>
      )}
    </div>
  );
}

/** Section heading within a panel (smaller than Panel title). */
export function PanelSection({
  title,
  subtitle,
  children,
  action,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="mb-10">
      {(title || action) && (
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <div>
            {title && (
              <h2 className="text-heading-m font-semibold text-ink-primary">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-body-s text-ink-tertiary mt-1">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/** A conclusion / summary box at the bottom of a panel. */
export function Conclusion({
  label,
  children,
  tone = "default",
}: {
  label: string;
  children: ReactNode;
  tone?: "default" | "smile" | "frown" | "action";
}) {
  const toneClasses: Record<string, string> = {
    default: "bg-bg-inset border-border-subtle",
    smile: "bg-smile-50 border-smile-300/60",
    frown: "bg-frown-50 border-frown-300/60",
    action: "bg-action-50 border-action-300/60",
  };
  return (
    <div className={`mt-8 rounded-md border p-5 ${toneClasses[tone]}`}>
      <div className="eyebrow text-ink-tertiary mb-1">{label}</div>
      <div className="text-body-l text-ink-primary">{children}</div>
    </div>
  );
}
