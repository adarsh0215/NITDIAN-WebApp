// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/lib/design/theme";
import { getNoFlashScript } from "@/lib/design/theme-noflash";

import ClientFrame from "@/components/layout/ClientFrame"; // 👈 client wrapper

export const metadata: Metadata = {
  title: "AlumniNet",
  description: "NIT Durgapur Alumni Network",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getNoFlashScript() }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <ClientFrame>{children}</ClientFrame>
        </ThemeProvider>
      </body>
    </html>
  );
}
