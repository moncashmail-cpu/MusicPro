import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "MusikPro - Plateforme OMR & Synthèse Audio SATB",
  description: "Reconnaissance de partitions musicales, séparation des voix Soprano, Alto, Ténor, Basse, synthèse audio et lecture assistée pour non-lecteurs de solfège.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-background text-gray-100 min-h-screen antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
