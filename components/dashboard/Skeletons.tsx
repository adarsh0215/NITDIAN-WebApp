"use client";
export function Line({ w = "w-full" }: { w?: string }) {
  return <div className={`h-3 ${w} rounded bg-muted animate-pulse`} />;
}
export function AvatarSkeleton() {
  return <div className="h-14 w-14 rounded-full bg-muted animate-pulse" />;
}
export function CardSkeleton() {
  return (
    <div className="card p-5 sm:p-6 space-y-3">
      <Line w="w-2/5" />
      <Line />
      <Line w="w-4/5" />
      <Line w="w-3/5" />
    </div>
  );
}
