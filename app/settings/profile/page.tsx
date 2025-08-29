// app/settings/profile/page.tsx
import { redirect } from "next/navigation";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata = {
  title: "Edit Profile • NITDIAN Alumni",
  description: "Update your alumni profile.",
};

export const dynamic = "force-dynamic";

export default async function ProfileSettingsPage() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/settings/profile");

  // optional: ensure the row exists (create a blank one so form can upsert)
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name: null,
    });
  }

  return (
    <main className="mx-auto max-w-2xl py-10 px-4">
      <h1 className="mb-6 text-2xl font-semibold">Edit your profile</h1>
      <OnboardingForm submitLabel="Save changes"/>
    </main>
  );
}
