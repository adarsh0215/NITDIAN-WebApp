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
      graduation_year: CURRENT_YEAR,
      degree: DEGREES[0],
      branch: BRANCHES[0],
      employment_type: EMPLOYMENT_TYPES[0],
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
        phone_e164: (profile as any).phone_e164 ?? (profile as any).phone ?? "",
        city: profile.city ?? "",
        country: profile.country ?? "",
        avatar_url: profile.avatar_url ?? null,
        graduation_year: profile.graduation_year ?? CURRENT_YEAR,
        degree: (profile.degree as OnboardingValues["degree"]) ?? DEGREES[0],
        branch:
          ((profile as any).department ??
            (profile as any).branch) as OnboardingValues["branch"] ?? BRANCHES[0],
        employment_type:
          (profile.employment_type as OnboardingValues["employment_type"]) ??
          EMPLOYMENT_TYPES[0],
        company: profile.company ?? "",
        designation: (profile as any).designation ?? (profile as any).job_role ?? "",
        interests: (profile.interests as OnboardingValues["interests"]) ?? [],
        is_public: profile.is_public ?? true,
        can_contact: (profile as any).can_contact ?? true,
        has_consented_terms: (profile as any).has_consented_terms ?? false,
        has_consented_privacy: (profile as any).has_consented_privacy ?? false,
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
      // no toast spam while typing; keep it subtle
      // toast.success("Avatar uploaded");
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
        email: user.email!,
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
      if (redirectTo) router.replace(redirectTo);
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

  /* -------------------- MODERN, CLEAN UI (logic unchanged) -------------------- */
  const labelCls = "text-sm font-medium";
  const inputCls =
    "mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 ring-ring";
  const selectCls = inputCls;
  const errCls = "mt-1 text-xs text-destructive";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-4 py-8">
      {/* Centered card wrapper */}
      <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        {/* TITLE */}
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Membership Form</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill your details to help alumni connect with you.
          </p>
        </header>

        {/* 1) NAME */}
        <div className="mb-4">
          <label className={labelCls}>Full Name</label>
          <input
            className={inputCls}
            {...register("full_name")}
            aria-invalid={!!errors.full_name}
            disabled={isSubmitting}
            placeholder="Your name"
          />
          {errors.full_name && (
            <p className={errCls} role="alert">
              {errors.full_name.message}
            </p>
          )}
        </div>

        {/* 2) EMAIL */}
        <div className="mb-4">
          <label className={labelCls}>Email</label>
          <input className={`${inputCls} bg-muted/50`} value={email} readOnly />
        </div>

        {/* 3) PHONE */}
        <div className="mb-4">
          <label className={labelCls}>Phone</label>
          <input
            className={inputCls}
            placeholder="+91…"
            inputMode="tel"
            maxLength={20}
            {...register("phone_e164")}
            disabled={isSubmitting}
          />
        </div>

        {/* 4) CITY + COUNTRY */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>City</label>
            <input className={inputCls} {...register("city")} disabled={isSubmitting} />
          </div>
          <div>
            <label className={labelCls}>Country</label>
            <input className={inputCls} {...register("country")} disabled={isSubmitting} />
          </div>
        </div>

        {/* 5) BATCH + DEPARTMENT + DEGREE */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Batch (Year)</label>
            <select
              className={selectCls}
              {...register("graduation_year", { valueAsNumber: true })}
              disabled={isSubmitting}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            {errors.graduation_year && (
              <p className={errCls} role="alert">
                {errors.graduation_year.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelCls}>Department</label>
            <select className={selectCls} {...register("branch")} disabled={isSubmitting}>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            {errors.branch && (
              <p className={errCls} role="alert">
                {errors.branch.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelCls}>Degree</label>
            <select className={selectCls} {...register("degree")} disabled={isSubmitting}>
              {DEGREES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.degree && (
              <p className={errCls} role="alert">
                {errors.degree.message}
              </p>
            )}
          </div>
        </div>

        {/* 6) TYPE OF WORK + COMPANY + JOB ROLE */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Type of work</label>
            <select className={selectCls} {...register("employment_type")} disabled={isSubmitting}>
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.employment_type && (
              <p className={errCls} role="alert">
                {errors.employment_type.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelCls}>Company</label>
            <input className={inputCls} {...register("company")} disabled={isSubmitting} />
          </div>

          <div>
            <label className={labelCls}>Job role</label>
            <input className={inputCls} {...register("designation")} disabled={isSubmitting} />
          </div>
        </div>

        {/* 7) AREA OF INTEREST */}
        <div className="mb-6">
          <label className={labelCls}>Areas of interest</label>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {INTERESTS.map((opt: OnboardingValues["interests"][number]) => {
              const checked = interestsCurrent.includes(opt);
              return (
                <label
                  key={opt}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm cursor-pointer transition
                    ${checked ? "bg-muted" : "bg-background"} hover:bg-muted`}
                >
                  <span>{opt}</span>
                  <input
                    type="checkbox"
                    value={opt}
                    checked={checked}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const curr = new Set<OnboardingValues["interests"][number]>(
                        form.getValues("interests") ?? []
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
                </label>
              );
            })}
          </div>
        </div>

        {/* 8) AVATAR */}
        <div className="mb-6">
          <label className={labelCls}>Profile photo</label>
          <div className="mt-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getValues("avatar_url") || "/avatar-placeholder.png"}
              alt="Avatar preview"
              className="h-12 w-12 rounded-full border object-cover bg-background"
            />
            <label className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs hover:bg-muted cursor-pointer aria-disabled:opacity-50">
              <span>{uploading ? "Uploading…" : "Change"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploading || isSubmitting}
              />
            </label>
          </div>
        </div>

        {/* 9) CONSENTS */}
        <div className="mb-2 space-y-3">
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
              <p className={errCls} role="alert">
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
              <p className={errCls} role="alert">
                {errors.has_consented_privacy.message}
              </p>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium bg-primary text-primary-foreground shadow-1 hover:opacity-90 disabled:opacity-50"
            disabled={isSubmitting || uploading}
          >
            {isSubmitting ? "Saving…" : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
