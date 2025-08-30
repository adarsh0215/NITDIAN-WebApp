// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/lib/design/theme";          // client provider
import { getNoFlashScript } from "@/lib/design/theme-noflash"; // ✅ server-safe

import Navbar from "@/components/layout/navbar/Navbar"; // or "./layout/navbar/Navbar" if you moved it

export const metadata: Metadata = {
  title: "AlumniNet",
  description: "NIT Durgapur Alumni Network",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme on first paint */}
        <script dangerouslySetInnerHTML={{ __html: getNoFlashScript() }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* Provider must wrap anything that calls useTheme() */}
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
