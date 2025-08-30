// components/home/Testimonials.tsx
const quotes = [
  {
    body: "Got three warm intros in a week—one became a hire. The directory is pure signal.",
    name: "Ananya S.",
    role: "SWE, Google",
  },
  {
    body: "Found a mentor for product transitions. The vibe is generous and professional.",
    name: "Rohit K.",
    role: "PM, Microsoft",
  },
  {
    body: "We filled two roles from the network. Alumni trust saves weeks of sourcing.",
    name: "Priya M.",
    role: "Founder, SaaS",
  },
];

export default function Testimonials() {
  return (
    <section className="relative border-t">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            What alumni say
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            High-trust, high-signal stories that compound into big outcomes.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q.name} className="rounded-2xl border bg-card p-5 transition hover:shadow-sm">
              <blockquote className="leading-relaxed">“{q.body}”</blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{q.name}</span> — {q.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
