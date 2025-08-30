// components/home/Stats.tsx
const stats = [
  { k: "1,200+", v: "Members" },
  { k: "80+", v: "Cities" },
  { k: "20+", v: "Industries" },
  { k: "6", v: "Chapters" },
];

export default function Stats() {
  return (
    <section className="relative border-t">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            By the numbers
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Early momentum from a high-trust alumni foundation.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.v} className="rounded-2xl border bg-card p-6 text-center hover:shadow-sm transition">
              <div className="text-2xl font-semibold">{s.k}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
