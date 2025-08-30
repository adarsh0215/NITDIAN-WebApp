// components/layout/ClientFrame.tsx
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";

export default function ClientFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide chrome on these routes
  const HIDE_ON = ["/auth", "/onboarding"]; // remove "/onboarding" if you want it visible there
  const hideChrome = HIDE_ON.some((p) => pathname?.startsWith(p));

  return (
    <>
      {!hideChrome && <Navbar />}
      {children}
      {!hideChrome && <Footer />}
    </>
  );
}
