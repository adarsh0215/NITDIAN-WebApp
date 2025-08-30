// components/home/Events.tsx
const events = [
  { date: "Sep 14", title: "Delhi Chapter Mixer", meta: "Noida • 6:30 PM" },
  { date: "Oct 05", title: "Mentor Hours – Product", meta: "Online • 7:00 PM" },
  { date: "Oct 26", title: "Bengaluru Coffee Chat", meta: "Indiranagar • 5:00 PM" },
];

export default function Events() {
  return (
    <section className="relative border-t">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Events & meetups
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Meet in person or online. Learn, hire, and collaborate.
          </p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <li key={e.title} className="rounded-2xl border bg-card p-5 flex items-center justify-between gap-4 hover:shadow-sm transition">
              <div>
                <div className="text-sm text-muted-foreground">{e.date}</div>
                <h3 className="font-semibold mt-1">{e.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{e.meta}</p>
              </div>
              <a
                href="/auth/signup"
                className="inline-flex items-center rounded-lg border px-3 py-2 text-sm hover:bg-muted"
              >
                RSVP
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
