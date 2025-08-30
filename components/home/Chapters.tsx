// components/home/Chapters.tsx
const chapters = [
  { city: "Delhi NCR", members: "350+", pct: 72 },
  { city: "Bengaluru", members: "290+", pct: 60 },
  { city: "Hyderabad", members: "140+", pct: 45 },
  { city: "Pune", members: "120+", pct: 42 },
  { city: "Kolkata", members: "110+", pct: 38 },
  { city: "Mumbai", members: "180+", pct: 58 },
];

export default function Chapters() {
  return (
    <section className="relative border-t">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Chapters
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Active alumni chapters. Join local meetups, mentorship circles, and hiring pipelines.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((c) => (
            <div key={c.city} className="rounded-2xl border bg-card p-5 hover:shadow-sm transition">
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold">{c.city}</h3>
                <span className="text-sm text-muted-foreground">{c.members}</span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${c.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
