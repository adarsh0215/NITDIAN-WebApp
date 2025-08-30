// components/home/BrandsStrip.tsx
export default function BrandsStrip() {
  const brands = [
    { name: "Google" },
    { name: "Microsoft" },
    { name: "Amazon" },
    { name: "NVIDIA" },
    { name: "Flipkart" },
    { name: "Swiggy" },
  ];

  return (
    <section className="relative border-t">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 items-center gap-4 md:gap-6 opacity-75">
          {brands.map((b) => (
            <div
              key={b.name}
              className="text-center text-sm text-muted-foreground rounded-xl border border-dashed bg-card py-3"
            >
              {b.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
