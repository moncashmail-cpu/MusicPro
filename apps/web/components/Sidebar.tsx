"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Music, 
  UploadCloud, 
  Layers, 
  Settings, 
  Headphones, 
  Sparkles,
  BookOpen,
  Volume2
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: "Tableau de bord", href: "/", icon: Layers },
    { name: "Importer une partition", href: "/upload", icon: UploadCloud },
    { name: "Bibliothèque", href: "/#library", icon: Music },
    { name: "Studio d'écoute", href: "/scores/demo-score", icon: Headphones },
  ];

  return (
    <aside className="w-64 h-screen bg-surface-200 border-r border-border-subtle flex flex-col fixed left-0 top-0 z-40">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border-subtle gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-cyan-neon flex items-center justify-center shadow-glow-accent">
          <Music className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Musik<span className="text-accent">Pro</span>
          </span>
          <span className="block text-[10px] uppercase font-mono tracking-widest text-gray-500 font-semibold">
            OMR & Synth Audio
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider font-mono">
          Menu Principal
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-accent/15 text-accent border border-accent/20 font-semibold shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-surface-50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-gray-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider font-mono">
          Outils & Assistance
        </div>
        <div className="px-3.5 py-3 rounded-xl bg-surface-100/60 border border-border-subtle text-xs text-gray-400 space-y-2">
          <div className="flex items-center gap-2 text-white font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-neon" />
            <span>Mode Non-Lecteur</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Surlignage instantané des notes avec affichage des noms de notes en français.
          </p>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border-subtle bg-surface-300/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-50 border border-border-strong flex items-center justify-center text-xs font-mono text-accent font-bold">
            MP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Studio Pro</p>
            <p className="text-[10px] text-gray-500 font-mono truncate">v1.0 • OMR Engine</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
