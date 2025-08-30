// components/home/Benefits.tsx
import { Users2, CalendarDays, Briefcase, ShieldCheck, MessageSquare, Sparkles } from "lucide-react";

const items = [
  {
    title: "Powerful Directory",
    desc: "Search alumni by name, batch, company, skills, and location with blazing-fast filters.",
    icon: Users2,
  },
  {
    title: "Events & Reunions",
    desc: "Create and discover meetups, webinars, and reunions with simple RSVP flows.",
    icon: CalendarDays,
  },
  {
    title: "Careers & Mentoring",
    desc: "Post roles, get referrals, and mentor students with structured, opt-in sessions.",
    icon: Briefcase,
  },
  {
    title: "Privacy First",
    desc: "Granular profile controls. Your data is secure and only shared the way you choose.",
    icon: ShieldCheck,
  },
  {
    title: "Meaningful Conversations",
    desc: "Contextual messaging that starts from profiles, events, and opportunities.",
    icon: MessageSquare,
  },
  {
    title: "Modern & Fast",
    desc: "Built on Next.js with instant navigation, dark mode, and a crisp, accessible UI.",
    icon: Sparkles,
  },
];

export default function Benefits() {
  return (
    <section className="relative border-t">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to keep your community thriving
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Tools that feel effortless for alumni, admins, and students — without compromising on control.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, desc, icon: Icon }) => (
            <div
              key={title}
              className="group rounded-2xl border bg-card p-5 transition hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
                  <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-base font-semibold">{title}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
