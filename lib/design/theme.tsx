// lib/design/theme.tsx
"use client";

import * as React from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export type Mode = "light" | "dark" | "system";

type Ctx = {
  mode: Mode;                         // user selection
  resolvedTheme: "light" | "dark";    // actually applied to <html data-theme=…>
  setMode: (m: Mode) => void;
};

const ThemeContext = React.createContext<Ctx | null>(null);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function apply(theme: "light" | "dark") {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<Mode>("system");
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">("light");

  // Initialize from localStorage / system
  React.useEffect(() => {
    const stored = (typeof localStorage !== "undefined" && (localStorage.getItem("theme-mode") as Mode | null)) || "system";
    const initialMode: Mode = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    const initialResolved = initialMode === "system" ? getSystemTheme() : initialMode;
    setModeState(initialMode);
    setResolvedTheme(initialResolved);
    apply(initialResolved);
  }, []);

  // React to OS changes when in "system"
  React.useEffect(() => {
    if (mode !== "system" || typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next = mql.matches ? "dark" : "light";
      setResolvedTheme(next);
      apply(next);
    };
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [mode]);

  const setMode: Ctx["setMode"] = React.useCallback((m) => {
    setModeState(m);
    const next = m === "system" ? getSystemTheme() : m;
    setResolvedTheme(next);
    apply(next);
    try { localStorage.setItem("theme-mode", m); } catch {}
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

/* ----------------------- */
/*       UI Controls       */
/* ----------------------- */

/** Simple toggle: flips between light/dark (ignores system selection) */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setMode } = useTheme();
  const next = resolvedTheme === "light" ? "dark" : "light";
  return (
    <button
      type="button"
      onClick={() => setMode(next)}
      aria-label="Toggle theme"
      className={`inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-border px-3 py-2 text-sm hover:bg-muted transition ${className}`}
    >
      {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span className="text-muted-foreground">Switch to {next}</span>
    </button>
  );
}

/** Segmented switcher: Light / Dark / System */
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
 * Optional: inline this before your app renders to avoid a flash of wrong theme.
 * Place inside <body> in app/layout.tsx, above <ThemeProvider>.
 *
 * <script dangerouslySetInnerHTML={{ __html: getNoFlashScript() }} />
 */
export function getNoFlashScript() {
  return `
  (function(){
    try {
      var m = localStorage.getItem('theme-mode');
      var pref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var theme = (m === 'light' || m === 'dark') ? m : pref;
      document.documentElement.setAttribute('data-theme', theme);
    } catch(e) {}
  })();
  `;
}
