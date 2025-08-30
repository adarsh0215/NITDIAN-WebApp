// app/onboarding/page.tsx
import { redirect } from "next/navigation";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata = {
  title: "Onboarding • NITDIAN Alumni",
  description: "Complete your profile to join the alumni directory.",
};

// Ensure no caching of user/session
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const supabase = await supabaseServer();

  // Require auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/onboarding");

  // If already onboarded, go to dashboard
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarded")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.onboarded) redirect("/dashboard");

  return (
    <main className="mx-auto max-w-2xl py-10 px-4">
      <OnboardingForm />
    </main>
  );
}
