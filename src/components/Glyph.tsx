/**
 * Brand smile / frown glyphs — simple SVG arcs, no emoji.
 * Amber for smile, terracotta for frown. Size via className (w-/h-).
 */
export function SmileGlyph({ className = "w-4 h-4", stroke = "#D89B1F" }: { className?: string; stroke?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 10 Q12 19 19 10"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FrownGlyph({ className = "w-4 h-4", stroke = "#B55A3E" }: { className?: string; stroke?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 15 Q12 6 19 15"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LogoMark({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="#FAF7F2" stroke="#1C1A16" strokeWidth="1" />
      <path
        d="M9 15 Q16 23 23 15"
        stroke="#D89B1F"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoMark className="w-7 h-7" />
      <span className="serif text-[22px] leading-none text-ink-primary">Smile Analysis</span>
    </div>
  );
}
