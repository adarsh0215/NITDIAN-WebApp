"use client";
import * as React from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useMe } from "@/lib/hooks/useMe";

type Person = { id: string; full_name: string | null; avatar_url: string | null; city: string | null; company: string | null; branch: string | null; graduation_year: number | null };

export default function PeopleSuggestions() {
  const { me } = useMe();
  const [people, setPeople] = React.useState<Person[] | null>(null);

  React.useEffect(() => {
    if (!me) return;
    let alive = true;
    (async () => {
      const sb = supabaseBrowser();
      const { data } = await sb
        .from("profiles")
        .select("id,full_name,avatar_url,city,company,branch,graduation_year")
        .neq("id", me.id)
        .limit(4);
      if (!alive) return;
      setPeople(data ?? []);
    })();
    return () => { alive = false; };
  }, [me]);

  return (
    <div className="card px-5 py-6 sm:px-6">
      <h3 className="mb-3 text-base font-semibold">People you may know</h3>
      {!people ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-3 space-y-2">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              <div className="h-3 w-24 rounded bg-muted animate-pulse" />
              <div className="h-3 w-16 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      ) : people.length === 0 ? (
        <p className="text-sm text-muted-foreground">No suggestions yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {people.map((p) => (
            <a key={p.id} href={`/profiles/${p.id}`} className="rounded-xl border border-border p-3 hover:bg-muted">
              <div className="flex items-center gap-3">
                {p.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.avatar_url} alt={p.full_name ?? "Avatar"} className="h-10 w-10 rounded-full object-cover border border-border" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-muted grid place-items-center text-xs font-semibold">
                    {String(p.full_name ?? "A").slice(0,2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{p.full_name ?? "Member"}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {[p.branch, p.graduation_year].filter(Boolean).join(" • ") || p.company || p.city || "Alumni"}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
