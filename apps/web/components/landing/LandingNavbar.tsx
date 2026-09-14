"use client";

import Link from "next/link";
import { Music, UploadCloud, Play, Sparkles, ArrowRight } from "lucide-react";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-surface-200/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent via-indigo-500 to-cyan-neon flex items-center justify-center shadow-glow-accent group-hover:scale-105 transition-transform">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              Musik<span className="text-accent">Pro</span>
            </span>
            <span className="block text-[10px] uppercase font-mono tracking-widest text-gray-400 font-semibold">
              OMR & Synthèse SATB
            </span>
          </div>
        </Link>

        {/* Public Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#how-it-works" className="hover:text-white transition-colors">
            Comment ça marche
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Fonctionnalités
          </a>
          <a href="#satb-preview" className="hover:text-white transition-colors">
            Quatuor SATB
          </a>
          <Link href="/pricing" className="text-accent hover:text-white transition-colors flex items-center gap-1 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tarifs & MoMo</span>
          </Link>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right CTAs */}
        <div className="flex items-center gap-3">
          <a
            href="#upload"
            className="px-4 py-2.5 rounded-xl bg-surface-50 border border-border-subtle hover:border-accent text-white text-xs font-semibold flex items-center gap-2 transition-all hover:bg-surface-100"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-neon" />
            <span>Numériser</span>
          </a>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold flex items-center gap-2 shadow-glow-accent btn-magnetic"
          >
            <span>Tableau de bord</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
