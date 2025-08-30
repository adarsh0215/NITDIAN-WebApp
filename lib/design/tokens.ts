// lib/design/tokens.ts
/* eslint-disable @typescript-eslint/consistent-type-definitions */

export type DesignTokens = {
  color: {
    bg: string;
    surface: string;
    muted: string;
    border: string;
    overlay: string;

    fg: string;
    fgMuted: string;

    brand: string;
    brandFg: string;

    positive: string;
    warning: string;
    negative: string;

    // shadcn-style mirrors
    primary: string;
    primaryFg: string;
    secondary: string;
    secondaryFg: string;
    destructive: string;
    destructiveFg: string;

    ring: string;
    input: string;
  };
  radius: {
    base: string;
    sm: string;
    lg: string;
  };
  shadow: {
    1: string;
    2: string;
  };
  font: {
    sans: string;
    mono: string;
  };
};

/* --------------------------
 *  SSR defaults (match globals.css)
 * -------------------------- */

export const DEFAULT_LIGHT: DesignTokens = {
  color: {
    bg:        "#FBFAF4",
    surface:   "#FFFFFF",
    muted:     "#EAEEEE",
    border:    "#D8DEDF",
    overlay:   "oklch(0.20 0.02 95)",

    fg:        "#091717",
    fgMuted:   "#4B5B5E",

    brand:     "#20808D",
    brandFg:   "#ECF6F7",

    positive:  "oklch(0.72 0.16 145)",
    warning:   "oklch(0.80 0.16 85)",
    negative:  "#E5484D",

    primary:   "#20808D",
    primaryFg: "#ECF6F7",
    secondary: "#EAEEEE",
    secondaryFg:"#091717",
    destructive: "#E5484D",
    destructiveFg:"#ECF6F7",

    ring:      "#7FB9C1",
    input:     "#D8DEDF",
  },
  radius: { base: "12px", sm: "8px", lg: "16px" },
  shadow: { 1: "0 1px 2px rgb(0 0 0 / 0.06)", 2: "0 4px 10px rgb(0 0 0 / 0.08)" },
  font: {
    sans: 'var(--font-geist-sans, ui-sans-serif, system-ui, sans-serif)',
    mono: 'var(--font-geist-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
  },
};

export const DEFAULT_DARK: DesignTokens = {
  color: {
    bg:        "#091717",
    surface:   "#0F1A1B",
    muted:     "#0F2A2E",
    border:    "#FFFFFF1F",
    overlay:   "oklch(0.88 0.015 95)",

    fg:        "#F2FBFC",
    fgMuted:   "#88A7AC",

    brand:     "#4FD7E6",
    brandFg:   "#031B1E",

    positive:  "oklch(0.80 0.14 145)",
    warning:   "oklch(0.82 0.14 85)",
    negative:  "#FF6369",

    primary:   "#4FD7E6",
    primaryFg: "#031B1E",
    secondary: "#0F2A2E",
    secondaryFg:"#D9F2F4",
    destructive: "#FF6369",
    destructiveFg:"#1B0A0B",

    ring:      "#63CFDA",
    input:     "#FFFFFF26",
  },
  radius: { base: "12px", sm: "8px", lg: "16px" },
  shadow: { 1: "0 1px 2px rgb(255 255 255 / 0.12)", 2: "0 8px 16px rgb(255 255 255 / 0.08)" },
  font: {
    sans: 'var(--font-geist-sans, ui-sans-serif, system-ui, sans-serif)',
    mono: 'var(--font-geist-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
  },
};

/* --------------------------
 *  Runtime readers
 * -------------------------- */

const VARS = {
  // keep keys in sync with globals.css
  bg: "--bg",
  surface: "--surface",
  muted: "--muted",
  border: "--border",
  overlay: "--overlay",

  fg: "--fg",
  fgMuted: "--fg-muted",

  brand: "--brand",
  brandFg: "--brand-foreground",

  positive: "--positive",
  warning: "--warning",
  negative: "--negative",

  ring: "--ring",
  input: "--input",

  // shadcn mirrors (derived from above but also present on :root)
  primary: "--primary",
  primaryFg: "--primary-foreground",
  secondary: "--secondary",
  secondaryFg: "--secondary-foreground",
  destructive: "--destructive",
  destructiveFg: "--destructive-foreground",

  radius: "--radius",
  radiusSm: "--radius-sm",
  radiusLg: "--radius-lg",

  shadow1: "--shadow-1",
  shadow2: "--shadow-2",

  fontSans: "--font-sans",
  fontMono: "--font-mono",

  chart1: "--chart-1",
  chart2: "--chart-2",
  chart3: "--chart-3",
  chart4: "--chart-4",
  chart5: "--chart-5",
} as const;

function getCssVar(name: string): string | null {
  if (typeof window === "undefined" || !document?.documentElement) return null;
  const s = getComputedStyle(document.documentElement).getPropertyValue(name);
  return s ? s.trim() : null;
}

/** Reads the current tokens from CSS variables on :root */
export function readTokens(): DesignTokens {
  // choose SSR defaults based on current data-theme when available
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";

  const base = isDark ? DEFAULT_DARK : DEFAULT_LIGHT;

  const color = {
    bg:        getCssVar(VARS.bg)        ?? base.color.bg,
    surface:   getCssVar(VARS.surface)   ?? base.color.surface,
    muted:     getCssVar(VARS.muted)     ?? base.color.muted,
    border:    getCssVar(VARS.border)    ?? base.color.border,
    overlay:   getCssVar(VARS.overlay)   ?? base.color.overlay,

    fg:        getCssVar(VARS.fg)        ?? base.color.fg,
    fgMuted:   getCssVar(VARS.fgMuted)   ?? base.color.fgMuted,

    brand:     getCssVar(VARS.brand)     ?? base.color.brand,
    brandFg:   getCssVar(VARS.brandFg)   ?? base.color.brandFg,

    positive:  getCssVar(VARS.positive)  ?? base.color.positive,
    warning:   getCssVar(VARS.warning)   ?? base.color.warning,
    negative:  getCssVar(VARS.negative)  ?? base.color.negative,

    ring:      getCssVar(VARS.ring)      ?? base.color.ring,
    input:     getCssVar(VARS.input)     ?? base.color.input,

    primary:   getCssVar(VARS.primary)   ?? base.color.primary,
    primaryFg: getCssVar(VARS.primaryFg) ?? base.color.primaryFg,
    secondary: getCssVar(VARS.secondary) ?? base.color.secondary,
    secondaryFg:getCssVar(VARS.secondaryFg) ?? base.color.secondaryFg,
    destructive:getCssVar(VARS.destructive) ?? base.color.destructive,
    destructiveFg:getCssVar(VARS.destructiveFg) ?? base.color.destructiveFg,
  };

  const radius = {
    base: getCssVar(VARS.radius)   ?? base.radius.base,
    sm:   getCssVar(VARS.radiusSm) ?? base.radius.sm,
    lg:   getCssVar(VARS.radiusLg) ?? base.radius.lg,
  };

  const shadow = {
    1: getCssVar(VARS.shadow1) ?? base.shadow[1],
    2: getCssVar(VARS.shadow2) ?? base.shadow[2],
  } as DesignTokens["shadow"];

  const font = {
    sans: getCssVar(VARS.fontSans) ?? base.font.sans,
    mono: getCssVar(VARS.fontMono) ?? base.font.mono,
  };

  return { color, radius, shadow, font };
}

/** React hook that tracks tokens and updates when data-theme changes */
export function useDesignTokens(): DesignTokens {
  const [tokens, setTokens] = useSafeState<DesignTokens>(() => readTokens());

  ReactEffect(() => {
    if (typeof window === "undefined") return;

    // Update on theme attribute change
    const el = document.documentElement;
    const mo = new MutationObserver(() => setTokens(readTokens()));
    mo.observe(el, { attributes: true, attributeFilter: ["data-theme"] });

    // Also update on resize (fonts can change with dynamic vars) — cheap enough
    const onResize = () => setTokens(readTokens());
    window.addEventListener("resize", onResize);

    return () => {
      mo.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return tokens;
}

/* --------------------------
 *  Helpers
 * -------------------------- */

export const cssVar = (name: keyof typeof VARS) => `var(${VARS[name]})`;

/** Returns a 5-color chart palette from CSS vars or falls back to brand tints */
export function chartPalette(): string[] {
  const v = (k: keyof typeof VARS) => getCssVar(VARS[k]);
  const fromCss = [v("chart1"), v("chart2"), v("chart3"), v("chart4"), v("chart5")].filter(Boolean) as string[];
  if (fromCss.length) return fromCss;

  // derive simple palette from brand if chart vars aren't defined
  const b = getCssVar(VARS.brand) ?? DEFAULT_LIGHT.color.brand;
  return [
    b,
    withAlpha(b, 0.85),
    withAlpha(b, 0.7),
    withAlpha(b, 0.55),
    withAlpha(b, 0.4),
  ];
}

/** Apply alpha to any CSS color string (works for hex/oklch/rgb) */
function withAlpha(color: string, a: number) {
  // If already functional syntax, wrap with / alpha where possible
  if (color.trim().startsWith("oklch(")) return color.replace(/\)$/, ` / ${a})`);
  if (color.trim().startsWith("rgb(")) return color.replace(/\)$/, ` / ${a})`).replace("rgb(", "rgb(");
  // Basic hex -> rgba
  const hex = color.replace("#", "");
  const bigint = parseInt(hex.length === 3 ? hex.split("").map(c => c + c).join("") : hex, 16);
  const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/* Small SSR-safe React shims to avoid importing react at top level in non-Next contexts */
type Effect = (effect: () => void | (() => void), deps: unknown[]) => void;
let ReactEffect: Effect;
let useSafeState: <T>(init: () => T) => [T, (v: T) => void];

try {
  // Lazy import react only when available (Next/edge-safe)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require("react") as typeof import("react");
  ReactEffect = React.useEffect;
  useSafeState = function <T>(init: () => T) {
    const [v, setV] = React.useState<T>(init);
    return [v, setV];
  };
} catch {
  // No react (pure SSR build) — no-ops
  ReactEffect = () => {};
  useSafeState = <T>(init: () => T) => [init(), () => {}];
}
