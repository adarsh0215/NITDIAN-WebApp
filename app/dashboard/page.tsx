// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard • NITDIAN Alumni" };

export default async function DashboardPage() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/auth/login?next=/dashboard");
  return <DashboardShell />;
}
