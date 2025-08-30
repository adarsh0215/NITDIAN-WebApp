"use client";
import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      theme="system"
      closeButton
      richColors
      toastOptions={{
        className:
          "border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] rounded-[var(--radius)]",
      }}
    />
  );
}