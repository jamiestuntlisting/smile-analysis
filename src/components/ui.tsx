import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type HTMLAttributes } from "react";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "smile" | "ghost" | "link";
    size?: "sm" | "md" | "lg";
  }
>(function Button(
  { variant = "primary", size = "md", className = "", children, ...rest },
  ref,
) {
  const base =
    variant === "primary"
      ? "btn-primary"
      : variant === "smile"
        ? "btn-smile"
        : variant === "ghost"
          ? "btn-ghost"
          : "btn-link";
  const sz = size === "sm" ? "!px-3 !py-1.5 !text-body-s" : size === "lg" ? "!px-6 !py-3 !text-body-l" : "";
  return (
    <button ref={ref} className={`${base} ${sz} ${className}`} {...rest}>
      {children}
    </button>
  );
});

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input {...rest} className={`input-text ${className}`} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const { className = "", ...rest } = props;
  return <textarea {...rest} className={`input-text min-h-[96px] ${className}`} />;
}

export function Card({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card p-6 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`eyebrow ${className}`}>{children}</div>;
}

export function Pill({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "smile" | "frown" | "action" | "value" | "in" | "around" | "building" | "commute";
  className?: string;
}) {
  const map: Record<string, string> = {
    neutral: "bg-bg-inset text-ink-secondary",
    smile: "bg-smile-100 text-smile-900",
    frown: "bg-frown-50 text-frown-700",
    action: "bg-action-50 text-action-700",
    value: "bg-value-100 text-value-500",
    in: "bg-smile-100 text-smile-900",
    around: "bg-action-50 text-action-700",
    building: "bg-value-100 text-value-500",
    commute: "bg-bg-muted text-ink-secondary",
  };
  return (
    <span className={`pill ${map[tone]} ${className}`}>{children}</span>
  );
}

export function AreaPill({ area }: { area: "In" | "Building" | "Around" | "Commute" }) {
  const tone = area === "In" ? "in" : area === "Around" ? "around" : area === "Building" ? "building" : "commute";
  return <Pill tone={tone}>{area.toLowerCase()}</Pill>;
}

export function Hairline({ className = "" }: { className?: string }) {
  return <div className={`hairline ${className}`} />;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between pb-6 mb-6 border-b border-border-subtle gap-6 flex-wrap">
      <div>
        {eyebrow && <Eyebrow className="mb-2">{eyebrow}</Eyebrow>}
        <h1 className="text-heading-l font-semibold text-ink-primary tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-body text-ink-secondary mt-2 max-w-2xl">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-20 rounded-md border border-dashed border-border-subtle">
      <p className="text-heading-m font-semibold text-ink-primary mb-2">{title}</p>
      {description && (
        <p className="text-body text-ink-tertiary max-w-md mx-auto mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}

/** Keyboard-operable smile slider, -25..+25 with arrow keys. */
export function SmileSlider({
  value,
  onChange,
  id,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  id?: string;
  disabled?: boolean;
}) {
  return (
    <input
      id={id}
      type="range"
      min={-25}
      max={25}
      step={1}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      onKeyDown={(e) => {
        if (e.key === "Home") {
          e.preventDefault();
          onChange(-25);
        } else if (e.key === "End") {
          e.preventDefault();
          onChange(25);
        } else if (e.shiftKey && e.key === "ArrowLeft") {
          e.preventDefault();
          onChange(Math.max(-25, value - 5));
        } else if (e.shiftKey && e.key === "ArrowRight") {
          e.preventDefault();
          onChange(Math.min(25, value + 5));
        }
      }}
      aria-valuemin={-25}
      aria-valuemax={25}
      aria-valuenow={value}
      className="smile-slider"
    />
  );
}
