import Link from 'next/link';

export default function Home() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-semibold">NITDIAN Alumni Network</h1>
      <p className="text-neutral-600">Simple, reliable baseline. Let’s get auth working first.</p>
      <div className="flex gap-3">
        <Link href="/auth/signup" className="rounded-md border px-4 py-2">Sign up</Link>
        <Link href="/auth/login" className="rounded-md border px-4 py-2">Log in</Link>
      </div>
    </main>
  );
}
