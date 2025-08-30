// components/home/CTA.tsx
export default function CTA() {
  return (
    <section className="relative border-t">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to join the circle?
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Create your profile once. Get verified by the admin. Access the directory and start connecting.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border bg-card p-6 sm:p-8 transition hover:shadow-sm">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              Alumni-only, high-signal community. No spam, no noise.
            </p>
            <a
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium bg-primary text-primary-foreground shadow-1"
            >
              Get started
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
