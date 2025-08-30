"use client";
import * as React from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export type Me = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  city: string | null;
  country: string | null;
  degree: string | null;
  branch: string | null;
  graduation_year: number | null;
  employment_type: string | null;
  company: string | null;
  designation: string | null;
  interests: string[] | null;
  is_public: boolean | null;
  approval?: "pending" | "approved" | "rejected" | null;
  onboarded: boolean | null;
};

export function useMe() {
  const [me, setMe] = React.useState<Me | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const sb = supabaseBrowser();
        const { data: { user } } = await sb.auth.getUser();
        if (!user) throw new Error("Not logged in");
        const { data, error } = await sb
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle<Me>();
        if (error) throw error;
        if (!alive) return;
        setMe(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { me, loading, error };
}

export function completeness(me: Me) {
  const req = [
    ["Name", me.full_name],
    ["Avatar", me.avatar_url],
    ["Degree", me.degree],
    ["Branch", me.branch],
    ["Grad year", me.graduation_year],
    ["Location", me.city || me.country],
    ["Employment", me.employment_type || me.company || me.designation],
    ["Interests", me.interests && me.interests.length],
  ];
  const total = req.length;
  const have = req.filter(([, v]) => Boolean(v)).length;
  const pct = Math.round((have / total) * 100);
  const missing = req.filter(([, v]) => !v).map(([k]) => k as string);
  return { pct, missing };
}
