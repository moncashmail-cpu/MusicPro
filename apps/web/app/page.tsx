"use client";

import Link from "next/link";
import { 
  UploadCloud, 
  Music, 
  Layers, 
  Sparkles, 
  Play, 
  ArrowRight, 
  Clock, 
  CheckCircle2,
  FileMusic,
  Headphones,
  Sliders
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { name: "Partitions Numérisées", value: "24", change: "+12% ce mois", icon: FileMusic, color: "text-indigo-400" },
    { name: "Voix Isolées Extraites", value: "68", change: "100% MusicXML", icon: Sliders, color: "text-cyan-400" },
    { name: "Rendus Audio FluidSynth", value: "92", change: "Qualité HD .sf2", icon: Headphones, color: "text-emerald-400" },
    { name: "Précision Synchronisation", value: "99.4%", change: "Karaoké note/note", icon: Sparkles, color: "text-amber-400" },
  ];

  const recentScores = [
    {
      id: "demo-score",
      title: "Hymne à la Joie (Ode to Joy)",
      composer: "Ludwig van Beethoven",
      key: "D Major",
      tempo: 120,
      parts: 2,
      status: "ready",
      date: "Il y a 10 min",
    },
    {
      id: "demo-bach",
      title: "Prélude en Do Majeur (BWV 846)",
      composer: "J.S. Bach",
      key: "C Major",
      tempo: 96,
      parts: 3,
      status: "ready",
      date: "Hier à 18:30",
    },
    {
      id: "demo-mozart",
      title: "Sonate Facile (K. 545)",
      composer: "W.A. Mozart",
      key: "C Major",
      tempo: 132,
      parts: 2,
      status: "ready",
      date: "19 Août 2026",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner / Cockpit Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-surface-100 via-surface-200 to-indigo-950/40 border border-border-subtle p-8 md:p-10 shadow-card">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architecture OMR & Synthèse Audio v1.0</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Transformez vos partitions en <span className="bg-gradient-to-r from-accent via-indigo-300 to-cyan-neon bg-clip-text text-transparent">audio interactif</span>.
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            Reconnaissance optique (OMR), séparation automatique des voix polyphoniques, synthèse multi-piste et lecture synchronisée pour les non-lecteurs de solfège.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/upload"
              className="px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold flex items-center gap-2 shadow-glow-accent btn-magnetic"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Numériser une partition</span>
            </Link>
            <Link
              href="/scores/demo-score"
              className="px-6 py-3 rounded-xl bg-surface-50 border border-border-subtle hover:border-border-strong text-white text-sm font-semibold flex items-center gap-2 transition-all hover:bg-surface-100"
            >
              <Play className="w-4 h-4 text-cyan-neon fill-cyan-neon" />
              <span>Ouvrir le lecteur de démo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cockpit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="bg-surface-100/90 rounded-2xl border border-border-subtle p-5 shadow-card hover:border-border-strong transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400">{item.name}</span>
                <div className={`p-2 rounded-xl bg-surface-50 border border-border-subtle ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold font-mono text-white tracking-tight">{item.value}</span>
                <span className="block text-[11px] text-gray-500 font-mono mt-1">{item.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Scores Section */}
      <div id="library" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Partitions Récemment Traitées</h2>
            <p className="text-xs text-gray-400">Bibliothèque synchronisée MusicXML & rendus audio</p>
          </div>
          <Link
            href="/upload"
            className="text-xs font-semibold text-accent hover:text-accent-light flex items-center gap-1 font-mono transition-colors"
          >
            <span>+ Ajouter un morceau</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recentScores.map((score) => (
            <div
              key={score.id}
              className="bg-surface-100 rounded-2xl border border-border-subtle p-6 shadow-card hover:border-accent/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>SYNCHRO PRÊTE</span>
                  </span>
                  <span className="text-[11px] text-gray-500 font-mono">{score.date}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-accent transition-colors">
                    {score.title}
                  </h3>
                  <p className="text-xs text-gray-400">{score.composer}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border-subtle text-xs font-mono text-gray-400">
                  <span className="bg-surface-50 px-2 py-0.5 rounded border border-border-subtle">{score.key}</span>
                  <span className="bg-surface-50 px-2 py-0.5 rounded border border-border-subtle">♩ {score.tempo} BPM</span>
                  <span className="bg-surface-50 px-2 py-0.5 rounded border border-border-subtle">{score.parts} voix</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle">
                <Link
                  href={`/scores/${score.id}`}
                  className="w-full py-2.5 rounded-xl bg-surface-50 hover:bg-accent text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all group-hover:shadow-glow-accent"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Ouvrir dans le Studio</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
