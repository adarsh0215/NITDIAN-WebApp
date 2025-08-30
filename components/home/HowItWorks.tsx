// components/home/HowItWorks.tsx
import { UserCheck2, ShieldCheck, Users } from "lucide-react";

const steps = [
  {
    n: 1,
    title: "Create profile",
    desc: "Add your academic and professional details. Upload a clean avatar.",
    icon: UserCheck2,
  },
  {
    n: 2,
    title: "Get verified",
    desc: "Admins verify alumni status. Quality network over noisy network.",
    icon: ShieldCheck,
  },
  {
    n: 3,
    title: "Connect & grow",
    desc: "Use directory, intros, and mentorship to help and get help.",
    icon: Users,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative border-t">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            A simple, thoughtful flow that keeps the directory high-signal.
          </p>
        </div>

        <ol className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ n, title, desc, icon: Icon }) => (
            <li key={title} className="group rounded-2xl border bg-card p-5 transition hover:shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg border bg-background px-2 text-xs font-semibold">
                  {n}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
                  <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-base font-semibold">{title}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
