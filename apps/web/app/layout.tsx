import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";

export const metadata: Metadata = {
  title: "MusikPro - Plateforme OMR & Synthèse Audio",
  description: "Reconnaissance de partitions musicales, séparation des voix, synthèse audio et lecture assistée pour non-lecteurs de solfège.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-background text-gray-100 min-h-screen flex antialiased bg-noise">
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col pl-64 min-w-0">
          <Navbar />
          <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
