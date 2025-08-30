"use client";
import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/design/theme";
import { cn } from "@/lib/utils";


export function ThemeSwitcher({ className }: { className?: string }) {
const { theme, setTheme } = useTheme();
const toggle = () => setTheme(theme === "light" ? "dark" : "light");


return (
<button
type="button"
onClick={toggle}
className={cn(
"inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-sm transition hover:bg-muted",
className
)}
>
{theme === "dark" ? (
<Sun className="h-4 w-4" />
) : (
<Moon className="h-4 w-4" />
)}
<span>{theme === "dark" ? "Light" : "Dark"} mode</span>
</button>
);
}