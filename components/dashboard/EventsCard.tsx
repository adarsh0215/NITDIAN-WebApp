"use client";
import * as React from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

type Event = {
  id: string;
  title: string;
  city: string | null;
  venue: string | null;
  starts_at: string; // ISO
};

export default function EventsCard() {
  const [items, setItems] = React.useState<Event[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const sb = supabaseBrowser();
        const now = new Date();
        const in30 = new Date(Date.now() + 30 * 864e5);
        const { data, error } = await sb
          .from("events")
          .select("id,title,city,venue,starts_at")
          .gte("starts_at", now.toISOString())
          .lte("starts_at", in30.toISOString())
          .order("starts_at", { ascending: true })
          .limit(3);
        if (error) throw error;
        if (!alive) return;
        setItems(data ?? []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load events");
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="card px-5 py-6 sm:px-6">
      <h3 className="mb-3 text-base font-semibold">Upcoming events</h3>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!items ? (
        <div className="space-y-2">
          <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
          <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No events in the next 30 days. <a href="/events" className="underline">See all events</a>.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((e) => (
            <li key={e.id} className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{e.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(e.starts_at).toLocaleString()} • {[e.venue, e.city].filter(Boolean).join(", ")}
                  </div>
                </div>
                <a href={`/events/${e.id}`} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted">
                  Details
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
