"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { LandingNavbar } from "@/components/landing/LandingNavbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return (
      <div className="min-h-screen flex flex-col w-full bg-background text-gray-100 bg-noise">
        {/* Full-width Public Landing Navbar */}
        <LandingNavbar />
        {/* Full-width Public Landing Page Body */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
          {children}
        </main>
      </div>
    );
  }

  // Dashboard / App Studio Layout with Sidebar
  return (
    <div className="min-h-screen flex w-full bg-background text-gray-100 bg-noise">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        <Navbar />
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
