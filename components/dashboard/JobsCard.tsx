"use client";
import * as React from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

type Job = { id: string; title: string; company: string | null; location: string | null; url: string | null; created_at: string };

export default function JobsCard() {
  const [items, setItems] = React.useState<Job[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const sb = supabaseBrowser();
        const { data, error } = await sb
          .from("jobs")
          .select("id,title,company,location,url,created_at")
          .order("created_at", { ascending: false })
          .limit(3);
        if (error) throw error;
        if (!alive) return;
        setItems(data ?? []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load jobs");
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="card px-5 py-6 sm:px-6">
      <h3 className="mb-3 text-base font-semibold">Opportunities</h3>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!items ? (
        <div className="space-y-2">
          <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
          <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No opportunities yet. <a href="/jobs/new" className="underline">Post a role</a>.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((j) => (
            <li key={j.id} className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{j.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {[j.company, j.location].filter(Boolean).join(" • ")}
                  </div>
                </div>
                {j.url ? (
                  <a href={j.url} target="_blank" rel="noreferrer" className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted">
                    View
                  </a>
                ) : (
                  <a href={`/jobs/${j.id}`} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted">
                    Details
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
