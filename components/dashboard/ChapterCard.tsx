"use client";
import * as React from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useMe } from "@/lib/hooks/useMe";

type Chapter = { id: string; city: string; name: string; description: string | null };

export default function ChapterCard() {
  const { me } = useMe();
  const [chapter, setChapter] = React.useState<Chapter | null>(null);

  React.useEffect(() => {
    if (!me?.city) return;
    let alive = true;
    (async () => {
      const sb = supabaseBrowser();
      const { data } = await sb.from("chapters").select("*").eq("city", me.city).maybeSingle<Chapter>();
      if (!alive) return;
      setChapter(data ?? null);
    })();
    return () => { alive = false; };
  }, [me?.city]);

  return (
    <div className="card px-5 py-6 sm:px-6">
      <h3 className="mb-3 text-base font-semibold">Your chapter</h3>
      {!me?.city ? (
        <p className="text-sm text-muted-foreground">
          Set your city in{" "}
          <a href="/settings/profile" className="underline">profile settings</a>{" "}
          to see local chapter activity.
        </p>
      ) : !chapter ? (
        <p className="text-sm text-muted-foreground">
          No chapter found for <b>{me.city}</b>.{" "}
          <a href="/chapters" className="underline">Browse chapters</a>.
        </p>
      ) : (
        <div className="rounded-xl border border-border p-3">
          <div className="font-medium">{chapter.name}</div>
          <p className="text-sm text-muted-foreground">{chapter.description ?? "Local alumni community"}</p>
          <a href={`/chapters/${chapter.id}`} className="mt-2 inline-block rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted">
            View chapter
          </a>
        </div>
      )}
    </div>
  );
}
