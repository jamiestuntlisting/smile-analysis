import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#FAF7F2",
          elevated: "#FFFFFF",
          inset: "#F1ECE3",
          muted: "#E8E1D3",
        },
        ink: {
          primary: "#1C1A16",
          secondary: "#4A4538",
          tertiary: "#807868",
          disabled: "#B8AF9C",
        },
        smile: {
          50: "#FDF6E3",
          100: "#F9E8B8",
          300: "#EFC65A",
          500: "#D89B1F",
          700: "#9C6D10",
          900: "#5C3F05",
        },
        frown: {
          50: "#FBEEE8",
          300: "#D48874",
          500: "#B55A3E",
          700: "#7E3A24",
        },
        action: {
          50: "#EEF0F7",
          300: "#7985B8",
          500: "#3A4A8C",
          700: "#23305F",
        },
        value: {
          100: "#DDEBE0",
          500: "#4A7C5B",
        },
        border: {
          subtle: "#E4DCCB",
          DEFAULT: "#D1C7B2",
          strong: "#1C1A16",
        },
      },
      fontFamily: {
        display: [
          '"Gambarino"',
          '"Instrument Serif"',
          "Georgia",
          "serif",
        ],
        sans: ['"Satoshi"', '"Geist"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "72px",
          { lineHeight: "0.95", letterSpacing: "-0.04em" },
        ],
        "display-l": [
          "56px",
          { lineHeight: "1.0", letterSpacing: "-0.03em" },
        ],
        "display-m": [
          "40px",
          { lineHeight: "1.05", letterSpacing: "-0.02em" },
        ],
        "heading-l": [
          "28px",
          { lineHeight: "1.15", letterSpacing: "-0.01em" },
        ],
        "heading-m": [
          "20px",
          { lineHeight: "1.25", letterSpacing: "-0.01em" },
        ],
        "heading-s": ["16px", { lineHeight: "1.30" }],
        "body-l": ["18px", { lineHeight: "1.50" }],
        body: ["15px", { lineHeight: "1.55" }],
        "body-s": ["13px", { lineHeight: "1.50" }],
        caption: ["12px", { lineHeight: "1.40", letterSpacing: "0.06em" }],
        "numeric-xl": ["64px", { lineHeight: "1.00" }],
      },
      boxShadow: {
        xs: "0 1px 2px rgba(28, 26, 22, 0.04)",
        sm: "0 2px 6px rgba(28, 26, 22, 0.06)",
        md: "0 8px 24px rgba(28, 26, 22, 0.08)",
        lg: "0 24px 48px rgba(28, 26, 22, 0.12)",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
