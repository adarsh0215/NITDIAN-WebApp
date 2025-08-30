import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/lib/design/theme";
import Navbar from "@/components/nav/Navbar";
import { Toaster } from "sonner";

// app/layout.tsx (alternative)
import { Inter, JetBrains_Mono } from "next/font/google";
// import { AppToaster } from "@/components/ui/toaster";

const geistSans = Inter({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const geistMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });


export const metadata: Metadata = {
  title: "Geist-ish Design System",
  description: "Neutral, premium design tokens with Tailwind v4 + shadcn vars.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar />
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster richColors position="top-right" /> 
         {/* <AppToaster /> */}
      </body>
    </html>
  );
}
