// components/home/FAQ.tsx
const faqs = [
  {
    q: "Who can join?",
    a: "Verified NIT Durgapur alumni and current students (clearly marked) are welcome.",
  },
  {
    q: "Is the directory public?",
    a: "Only verified members can access the directory. You control what’s visible.",
  },
  {
    q: "How do verifications work?",
    a: "Admins review profile details and may request proof. Once approved, you get directory access.",
  },
  {
    q: "Is there a fee?",
    a: "Core features are free. We may add optional, premium tools later.",
  },
];

export default function FAQ() {
  return (
    <section className="relative border-t">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            FAQ
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Short and clear. Ping us if you need more details.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="rounded-2xl border bg-card p-5 open:shadow-sm transition"
            >
              <summary className="cursor-pointer list-none font-medium">
                <span className="inline-flex items-center gap-2">
                  <span>{f.q}</span>
                  <span className="text-xs text-muted-foreground ml-1">(+)</span>
                </span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
