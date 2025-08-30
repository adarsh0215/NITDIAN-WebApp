"use client";
import * as React from "react";
import { useMe } from "@/lib/hooks/useMe";

export default function VerificationBanner() {
  const { me, loading } = useMe();
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    setDismissed(localStorage.getItem("verifBannerDismissed") === "1");
  }, []);
  function dismiss() {
    localStorage.setItem("verifBannerDismissed", "1");
    setDismissed(true);
  }

  if (loading || dismissed) return null;
  const needs = !me || me.approval === "pending" || me.approval == null;
  if (!needs) return null;

  return (
    <div className="rounded-2xl border border-dashed bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          <b>Get verified:</b> Complete your profile so admins can approve you.
        </div>
        <div className="flex items-center gap-2">
          <a href="/onboarding" className="rounded-xl bg-primary px-3 py-1.5 text-sm text-primary-foreground">Complete profile</a>
          <button onClick={dismiss} className="rounded-xl border border-border px-3 py-1.5 text-sm hover:bg-muted">Dismiss</button>
        </div>
      </div>
    </div>
  );
}
