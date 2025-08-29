"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabaseBrowser } from "@/lib/supabase/client";
import {
  OnboardingSchema,
  type OnboardingValues,
  DEGREES,
  BRANCHES,
  EMPLOYMENT_TYPES,
  INTERESTS,
} from "@/lib/validation/onboarding";

const CURRENT_YEAR = new Date().getFullYear();

/* ---------- Helpers ---------- */
function yearsFrom1965To(limit: number) {
  const arr: number[] = [];
  for (let y = 1965; y <= limit; y++) arr.push(y);
  return arr.reverse();
}

type Props = {
  /** Button text (defaults to "Save & continue") */
  submitLabel?: string;
  /** Where to navigate after a successful save. Set to null to stay put. */
  redirectTo?: string | null;
};


function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Unknown error";
  }
}

/* ---------- Component ---------- */
export default function OnboardingForm({
  submitLabel = "Save & continue",
  redirectTo = "/dashboard",
}: Props) {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      full_name: "",
      phone_e164: "",
      city: "",
      country: "",
      avatar_url: null,
      graduation_year: Math.min(CURRENT_YEAR, CURRENT_YEAR + 4),
      degree: "B.Tech",
      branch: "CSE",
      employment_type: "Student",
      company: "",
      designation: "",
      interests: [],
      is_public: true,
      can_contact: true,
      has_consented_terms: false,
      has_consented_privacy: false,
    },
    mode: "onSubmit",
  });

  const isSubmitting = form.formState.isSubmitting;
  const [email, setEmail] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  // Prefill from auth + existing profile
  React.useEffect(() => {
    let alive = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/auth/login");
        return;
      }
      if (!alive) return;
      setEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!alive || !profile) return;

      form.reset({
        full_name: profile.full_name ?? "",
        phone_e164: profile.phone_e164 ?? "",
        city: profile.city ?? "",
        country: profile.country ?? "",
        avatar_url: profile.avatar_url ?? null,
        graduation_year:
          profile.graduation_year ?? Math.min(CURRENT_YEAR, CURRENT_YEAR + 4),
        degree: (profile.degree as OnboardingValues["degree"]) ?? "B.Tech",
        branch: (profile.branch as OnboardingValues["branch"]) ?? "CSE",
        employment_type:
          (profile.employment_type as OnboardingValues["employment_type"]) ??
          "Student",
        company: profile.company ?? "",
        designation: profile.designation ?? "",
        interests: (profile.interests as OnboardingValues["interests"]) ?? [],
        is_public: profile.is_public ?? true,
        can_contact: profile.can_contact ?? true,
        has_consented_terms: profile.has_consented_terms ?? false,
        has_consented_privacy: profile.has_consented_privacy ?? false,
      });
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");

      const ext = file.name.split(".").pop() || "jpg";
      const path = `avatars/${user.id}/${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: true,
        });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      form.setValue("avatar_url", pub.publicUrl, { shouldDirty: true });
      toast.success("Avatar uploaded");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: OnboardingValues) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Not signed in");
        router.replace("/auth/login");
        return;
      }

      // DB payload type: same as form but with explicit nullables for optional text
      type UpsertPayload = {
        id: string;
        email: string;
        full_name: string;
        graduation_year: number;
        degree: OnboardingValues["degree"];
        branch: OnboardingValues["branch"];
        employment_type: OnboardingValues["employment_type"];
        phone_e164: string | null;
        city: string | null;
        country: string | null;
        avatar_url: string | null;
        company: string | null;
        designation: string | null;
        interests: OnboardingValues["interests"];
        is_public: boolean;
        can_contact: boolean;
        has_consented_terms: boolean;
        has_consented_privacy: boolean;
        onboarded: boolean;
      };

      const payload: UpsertPayload = {
        id: user.id,
        email: user.email!, // auth email
        full_name: values.full_name.trim(),
        graduation_year: values.graduation_year,
        degree: values.degree,
        branch: values.branch,
        employment_type: values.employment_type,
        phone_e164: values.phone_e164?.trim() || null,
        city: values.city?.trim() || null,
        country: values.country?.trim() || null,
        avatar_url: values.avatar_url || null,
        company: values.company?.trim() || null,
        designation: values.designation?.trim() || null,
        interests: values.interests,
        is_public: values.is_public,
        can_contact: values.can_contact,
        has_consented_terms: values.has_consented_terms,
        has_consented_privacy: values.has_consented_privacy,
        onboarded: true,
      };

      const { error } = await supabase.from("profiles").upsert(payload);
      if (error) {
        toast.error(error.message || "Could not save profile");
        return;
      }

      toast.success("Profile saved");
      router.replace("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || "Something went wrong");
    }
  }

  const years = yearsFrom1965To(CURRENT_YEAR + 4);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    setValue,
  } = form;

  const interestsCurrent = watch("interests") ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Basic</h2>

        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex flex-col items-start gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getValues("avatar_url") || "/avatar-placeholder.png"}
              alt="Avatar preview"
              className="h-16 w-16 rounded-full border object-cover"
            />
            <label className="inline-block">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploading || isSubmitting}
              />
              <span className="cursor-pointer rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50 aria-disabled:opacity-50"
                aria-disabled={uploading || isSubmitting}
              >
                {uploading ? "Uploading…" : "Change"}
              </span>
            </label>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm">Full name</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                {...register("full_name")}
                aria-invalid={!!errors.full_name}
                disabled={isSubmitting}
                placeholder="Your name"
              />
              {errors.full_name && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm">Email</label>
              <input
                className="mt-1 w-full rounded-md border bg-neutral-100 px-3 py-2"
                value={email}
                readOnly
              />
            </div>

            <div>
              <label className="text-sm">Phone</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="+91…"
                inputMode="tel"
                maxLength={20}
                {...register("phone_e164")}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-sm">City</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                {...register("city")}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-sm">Country</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                {...register("country")}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Academics */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Academics</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm">Graduation year</label>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2"
              {...register("graduation_year")}
              disabled={isSubmitting}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            {errors.graduation_year && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.graduation_year.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm">Degree</label>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2"
              {...register("degree")}
              disabled={isSubmitting}
            >
              {DEGREES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.degree && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.degree.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm">Branch</label>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2"
              {...register("branch")}
              disabled={isSubmitting}
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            {errors.branch && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.branch.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Work */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Work</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm">Type of work</label>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2"
              {...register("employment_type")}
              disabled={isSubmitting}
            >
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.employment_type && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.employment_type.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm">Company</label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              {...register("company")}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="text-sm">Job role</label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              {...register("designation")}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </section>

      {/* Interests */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Areas of interest</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {INTERESTS.map((opt) => {
            const checked = interestsCurrent.includes(opt);
            return (
              <label
                key={opt}
                className="flex items-center gap-2 rounded-md border px-3 py-2"
              >
                <input
                  type="checkbox"
                  value={opt}
                  checked={checked}
                  onChange={(e) => {
                    const curr = new Set<OnboardingValues["interests"][number]>(
                      getValues("interests") ?? []
                    );
                    if (e.target.checked) curr.add(opt);
                    else curr.delete(opt);
                    setValue(
                      "interests",
                      Array.from(curr) as OnboardingValues["interests"],
                      { shouldDirty: true }
                    );
                  }}
                  disabled={isSubmitting}
                />
                <span className="text-sm">{opt}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Directory & Consent */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Directory & consent</h2>

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("is_public")} disabled={isSubmitting} />
          <span className="text-sm">Show my profile in the public directory</span>
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("can_contact")} disabled={isSubmitting} />
          <span className="text-sm">Allow organizers to contact me (email/phone not public)</span>
        </label>

        <div className="space-y-2" aria-live="polite">
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("has_consented_terms")} disabled={isSubmitting} />
            <span className="text-sm">
              I agree to the <a href="/terms" className="underline">Terms</a>
            </span>
          </label>
          {errors.has_consented_terms && (
            <p className="text-xs text-red-600" role="alert">
              {errors.has_consented_terms.message}
            </p>
          )}

          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("has_consented_privacy")} disabled={isSubmitting} />
            <span className="text-sm">
              I agree to the <a href="/privacy" className="underline">Privacy Policy</a>
            </span>
          </label>
          {errors.has_consented_privacy && (
            <p className="text-xs text-red-600" role="alert">
              {errors.has_consented_privacy.message}
            </p>
          )}
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          className="rounded-md border px-4 py-2 hover:bg-neutral-50 disabled:opacity-60"
          disabled={isSubmitting || uploading}
        >
          {isSubmitting ? "Saving…" : "Save & continue"}
        </button>
      </div>
    </form>
  );
}
