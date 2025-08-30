/**
 * Design Tokens — synced with app/globals.css
 * All-in-one version: colors, motion, shadows, radii, layout, gradients, utils
 */

/* -------------------
   Color Tokens
------------------- */
const v = (name: string) => `var(${name})`;

export const Colors = {
  bg: v("--color-bg"),
  surface: v("--color-surface"),
  muted: v("--color-muted"),
  border: v("--color-border"),
  overlay: v("--color-overlay"),

  fg: v("--color-fg"),
  fgMuted: v("--color-fg-muted"),

  brand: v("--color-brand"),
  brandFg: v("--color-brand-foreground"),

  positive: v("--color-positive"),
  warning: v("--color-warning"),
  negative: v("--color-negative"),

  primary: v("--color-primary"),
  primaryFg: v("--color-primary-foreground"),
  secondary: v("--color-secondary"),
  secondaryFg: v("--color-secondary-foreground"),

  destructive: v("--color-destructive"),
  destructiveFg: v("--color-destructive-foreground"),

  card: v("--color-card"),
  cardFg: v("--color-card-foreground"),
  popover: v("--color-popover"),
  popoverFg: v("--color-popover-foreground"),

  ring: v("--color-ring"),
  input: v("--color-input"),
};

/* -------------------
   Motion Tokens
------------------- */
export const Motion = {
  duration: {
    xs: 120,
    sm: 180,
    md: 240,
    lg: 320,
    xl: 480,
  },
  ease: {
    out: [0.16, 1, 0.3, 1] as const,
    in: [0.32, 0, 0.67, 0] as const,
    inOut: [0.65, 0, 0.35, 1] as const,
  },
  spring: {
    soft: { type: "spring", stiffness: 200, damping: 26, mass: 0.7 } as const,
    medium: { type: "spring", stiffness: 320, damping: 30, mass: 0.9 } as const,
    snappy: { type: "spring", stiffness: 480, damping: 34, mass: 0.9 } as const,
  },
};

/* -------------------
   Shadows
------------------- */
const sh = (cssVar: string, fallback: string) => `var(${cssVar}, ${fallback})`;

export const Shadows = {
  elevation: {
    1: sh("--shadow-1", "0 1px 2px rgb(0 0 0 / 0.06)"),
    2: sh("--shadow-2", "0 4px 10px rgb(0 0 0 / 0.08)"),
  },
  card: sh("--shadow-1", "0 1px 2px rgb(0 0 0 / 0.06)"),
  popover: sh("--shadow-2", "0 4px 10px rgb(0 0 0 / 0.08)"),
};

/* -------------------
   Radii
------------------- */
export const Radii = {
  sm: v("--radius-sm"),
  md: v("--radius"),
  lg: v("--radius-lg"),
};

/* -------------------
   Layout / Sizing
------------------- */
export const Layout = {
  container: {
    max: 1200,
    gutter: 24,
  },
  input: {
    height: 44, // premium touch target
    radius: v("--radius"),
    paddingX: 14,
  },
  pill: {
    height: 40,
    radius: "9999px",
    gap: 8,
    paddingX: 12,
  },
  z: {
    base: 0,
    header: 10,
    popover: 20,
    modal: 30,
    toast: 40,
    max: 9999,
  },
  bp: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  } as const,
};

/* -------------------
   Gradients
------------------- */
export const Gradients = {
  brandGlow: `radial-gradient(60% 60% at 50% 0%, color-mix(in oklch, ${Colors.brand} 22%, transparent) 0%, transparent 70%)`,
  subtleGrid: `linear-gradient(var(--color-border) 1px, transparent 1px),
               linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
};

/* -------------------
   Utils
------------------- */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const focusRingStyle: React.CSSProperties = {
  outline: "2px solid var(--ring)",
  outlineOffset: "2px",
  borderRadius: "var(--radius-sm)",
};

export const surfaceStyle: React.CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius)",
  boxShadow: "var(--shadow-1)",
};

export const cardClass =
  "bg-surface border border-border rounded-[var(--radius)] shadow-[var(--shadow-1)]";
