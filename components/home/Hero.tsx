// components/home/Hero.tsx
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* subtle background (dark-safe) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10
                   bg-[radial-gradient(80rem_40rem_at_top,theme(colors.teal.500/10),transparent_60%)]
                   dark:bg-[radial-gradient(80rem_40rem_at_top,theme(colors.teal.400/12),transparent_60%)]"
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 md:pt-20 md:pb-24 lg:px-8">
        <div className="mx-auto grid max-w-5xl items-center gap-8 text-center md:gap-10">
          {/* Brand lockup */}
          <div className="mx-auto flex items-center gap-3">
            <Image
              src="/images/logo.png"
              width={48}
              height={48}
              alt="NIT Durgapur"
              className="h-12 w-12 rounded-md object-contain"
              priority
              sizes="(max-width: 640px) 48px, 48px"
            />
            <div className="text-left">
              <p className="text-sm font-medium text-muted-foreground">NIT Durgapur</p>
              <p className="text-xs text-muted-foreground/70">International Alumni Network</p>
            </div>
          </div>

          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Reconnect. Mentor.{" "}
            <span className="text-teal-600 dark:text-teal-400">Grow together.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            A modern alumni network for students and graduates to discover people, events, and opportunities.
            Built with privacy, speed, and a delightful experience.
          </p>

          <div className="mx-auto flex flex-wrap items-center justify-center gap-3">
            <Link href="/auth/signup">
              <Button className="h-11 rounded-lg px-5 text-[15px]">Get Started</Button>
            </Link>
            <Link href="/directory">
              <Button variant="outline" className="h-11 rounded-lg px-5 text-[15px]">
                Explore Directory
              </Button>
            </Link>
          </div>

          {/* Decorative stats preview */}
          <div className="mx-auto mt-6 w-full max-w-4xl rounded-2xl border bg-card/60 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/5">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Alumni", value: "23,400+" },
                { label: "Companies", value: "1,250+" },
                { label: "Open roles", value: "320+" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border bg-background px-4 py-5 text-center"
                >
                  <div className="text-2xl font-semibold">{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
