// components/auth/AuthShell.tsx
"use client";
import * as React from "react";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
