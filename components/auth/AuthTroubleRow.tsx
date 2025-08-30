// components/auth/AuthTroubleRow.tsx
"use client";
import * as React from "react";

type Props = {
  currentEmail: string;
  onMagicLink: (email: string) => Promise<void>;
  onResetPassword: (email: string) => Promise<void>;
  loading?: boolean;
};

export default function AuthTroubleRow({
  currentEmail,
  onMagicLink,
  onResetPassword,
  loading = false,
}: Props) {
  const disabled = !currentEmail || loading;

  return (
    <div className="mt-2 flex flex-col items-center gap-2 text-xs text-muted-foreground sm:flex-row sm:justify-center">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onMagicLink(currentEmail)}
        className="underline underline-offset-2 hover:opacity-90 disabled:opacity-50"
      >
        Send me a magic link
      </button>
      <span className="hidden sm:inline">•</span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onResetPassword(currentEmail)}
        className="underline underline-offset-2 hover:opacity-90 disabled:opacity-50"
      >
        Forgot password?
      </button>
    </div>
  );
}
