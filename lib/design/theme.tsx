"use client";

import * as React from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export type Mode = "light" | "dark" | "system";

type Ctx = {
  mode: Mode;                       // user selection
  resolvedTheme: "light" | "dark";  // actually applied theme
  setMode: (m: Mode) => void;
  toggle: () => void;               // convenience: flip light<->dark
};

const ThemeContext = React.createContext<Ctx | null>(null);
const STORAGE_KEY = "theme-mode";

/* ---------- system theme subscription (SSR-safe) ---------- */
function subscribeSystemTheme(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}
function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function useSystemTheme(): "light" | "dark" {
  // useSyncExternalStore ensures strict mode consistency
  // and avoids stale values around fast refresh.
  // ts-expect-error TS doesn't know subscribe signature is fine

  return React.useSyncExternalStore(subscribeSystemTheme, getSystemTheme, () => "light");
}

/* ---------- DOM apply helpers ---------- */
/* ---------- DOM apply helpers ---------- */
function apply(theme: "light" | "dark") {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.setAttribute("data-theme", theme);

  // Help native form controls / UA styling match
  (html.style as CSSStyleDeclaration).colorScheme = theme;

  // Optional: update <meta name="theme-color"> if present (uses your CSS vars)
  const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (meta) {
    const bg = getComputedStyle(html).getPropertyValue("--bg").trim() || "#000";
    meta.content = bg;
  }
}


/* ---------- storage helpers ---------- */
function readStoredMode(): Mode {
  if (typeof localStorage === "undefined") return "system";
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw === "light" || raw === "dark" || raw === "system" ? raw : "system";
}
function writeStoredMode(m: Mode) {
  try { localStorage.setItem(STORAGE_KEY, m); } catch {}
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useSystemTheme();

  // initialize once on client
  const [mode, setModeState] = React.useState<Mode>(() => readStoredMode());
  const resolvedTheme = mode === "system" ? system : mode;

  // apply on mount and whenever resolved changes
  React.useEffect(() => { apply(resolvedTheme); }, [resolvedTheme]);

  // keep in sync across tabs
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = readStoredMode();
      setModeState(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setMode = React.useCallback<Ctx["setMode"]>((m) => {
    setModeState(m);
    writeStoredMode(m);
    const next = m === "system" ? getSystemTheme() : m;
    apply(next);
  }, []);

  const toggle = React.useCallback(() => {
    const nextResolved = resolvedTheme === "light" ? "dark" : "light";
    // if user had 'system', flipping should pin explicit opposite
    setMode(nextResolved);
  }, [resolvedTheme, setMode]);

  const ctx: Ctx = { mode, resolvedTheme, setMode, toggle };

  return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

/* ----------------------- */
/*       UI Controls       */
/* ----------------------- */

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, toggle } = useTheme();
  const next = resolvedTheme === "light" ? "dark" : "light";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={`inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-border px-3 py-2 text-sm hover:bg-muted transition ${className}`}
    >
      {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span className="text-muted-foreground">Switch to {next}</span>
    </button>
  );
}

export function ThemeSwitcher({ className = "" }: { className?: string }) {
  const { mode, setMode } = useTheme();

  function Seg({
    active, onClick, label, children,
  }: { active: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
    return (
      <button
        type="button"
        aria-pressed={active}
        title={label}
        onClick={onClick}
        className={
          "inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-2.5 py-1.5 text-sm border " +
          (active
            ? "bg-muted text-foreground border-border"
            : "bg-transparent text-muted-foreground border-transparent hover:bg-muted")
        }
      >
        {children}
        <span className="hidden sm:inline">{label}</span>
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme switcher"
      className={`inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-border bg-background p-1 ${className}`}
    >
      <Seg active={mode === "light"} onClick={() => setMode("light")} label="Light">
        <Sun className="h-4 w-4" />
      </Seg>
      <Seg active={mode === "dark"} onClick={() => setMode("dark")} label="Dark">
        <Moon className="h-4 w-4" />
      </Seg>
      <Seg active={mode === "system"} onClick={() => setMode("system")} label="System">
        <Monitor className="h-4 w-4" />
      </Seg>
    </div>
  );
}

/**
 * No-Flash script — inline this in app/layout.tsx, above <ThemeProvider>.
 * Ensures the correct theme is applied before React hydrates.
 *
 * <script dangerouslySetInnerHTML={{ __html: getNoFlashScript() }} />
 * <meta name="theme-color" content="#000" />
 */
export function getNoFlashScript() {
  return `
  (function(){
    try {
      var m = localStorage.getItem('${STORAGE_KEY}');
      var pref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var theme = (m === 'light' || m === 'dark') ? m : pref;
      var html = document.documentElement;
      html.setAttribute('data-theme', theme);
      html.style.colorScheme = theme;
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        // Use the CSS var if available post-load; early paint keeps meta as-is.
        // (It will be updated again by ThemeProvider on hydration.)
      }
    } catch(e) {}
  })();
  `;
}
