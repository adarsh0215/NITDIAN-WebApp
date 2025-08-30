// app/page.tsx
import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <Hero />
      <Benefits />
    </main>
  );
}
