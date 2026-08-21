"use client";

import { Bell, Search, Sparkles, Activity } from "lucide-react";

export function Navbar() {
  return (
    <header className="h-16 border-b border-border-subtle bg-surface-200/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
      {/* Search / Context */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une partition, compositeur, instrument..."
            className="w-full bg-surface-100/90 border border-border-subtle rounded-xl pl-10 pr-4 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all font-sans"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Pipeline OMR & Synth Ready</span>
        </div>

        <button 
          aria-label="Notifications"
          className="w-9 h-9 rounded-xl bg-surface-100 border border-border-subtle flex items-center justify-center text-gray-400 hover:text-white hover:border-border-strong transition-colors"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
