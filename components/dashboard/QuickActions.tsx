"use client";
import Link from "next/link";

export default function QuickActions() {
  return (
    <aside className="card px-5 py-6 sm:px-6">
      <h3 className="mb-3 text-base font-semibold">Quick actions</h3>
      <div className="space-y-2">
        <Action href="/settings/profile" label="Update profile details" />
        <Action href="/directory" label="Browse alumni directory" />
        <Action href="/onboarding" label="Re-run onboarding" />
      </div>
      <p className="mt-6 rounded-xl border border-dashed p-3 text-xs text-muted-foreground">
        Tip: Profiles marked <b>Public</b> appear in the directory once they’re <b>Approved</b> by admins.
      </p>
    </aside>
  );
}

function Action({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="block rounded-xl border border-border px-3 py-2 text-sm hover:bg-muted">
      {label}
    </Link>
  );
}
