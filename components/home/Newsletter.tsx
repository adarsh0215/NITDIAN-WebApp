// components/home/Newsletter.tsx
export default function Newsletter() {
  return (
    <section className="relative border-t">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Stay in the loop
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Monthly highlights, events, and opportunities — right to your inbox.
          </p>
        </div>

        <form
          className="mx-auto mt-10 max-w-3xl rounded-2xl border bg-card p-6 sm:p-8 transition hover:shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: connect to your provider (Resend, Mailchimp, etc.)
            alert("Subscribed!");
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus-visible:ring-2 ring-ring"
              autoComplete="email"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl px-4 py-2 font-medium bg-primary text-primary-foreground shadow-1"
            >
              Subscribe
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            We’ll only send relevant updates. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </section>
  );
}
