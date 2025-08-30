"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { CardSkeleton } from "./Skeletons";
import VerificationBanner from "./VerificationBanner";
import ProfileCard from "./ProfileCard";
import QuickActions from "./QuickActions";

const EventsCard = dynamic(() => import("./EventsCard"), { ssr: false, loading: () => <CardSkeleton /> });
const JobsCard   = dynamic(() => import("./JobsCard"),   { ssr: false, loading: () => <CardSkeleton /> });
const PeopleSuggestions = dynamic(() => import("./PeopleSuggestions"), { ssr: false, loading: () => <CardSkeleton /> });
const ChapterCard = dynamic(() => import("./ChapterCard"), { ssr: false, loading: () => <CardSkeleton /> });

export default function DashboardShell() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <VerificationBanner />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          <ProfileCard />
          <Suspense fallback={<CardSkeleton />}>
            <EventsCard />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <JobsCard />
          </Suspense>
        </section>

        <aside className="space-y-6">
          <QuickActions />
          <Suspense fallback={<CardSkeleton />}>
            <PeopleSuggestions />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <ChapterCard />
          </Suspense>
        </aside>
      </div>
    </main>
  );
}
