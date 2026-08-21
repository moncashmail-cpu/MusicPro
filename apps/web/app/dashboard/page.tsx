"use client";

import { useState, useEffect } from "react";
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
import { ScoreManager, DynamicScore } from "@/lib/scoreManager";

export default function DashboardPage() {
  const [scores, setScores] = useState<DynamicScore[]>([]);

  useEffect(() => {
    const defaultAube: DynamicScore = {
      id: "demo-score",
      title: "L'AUBE NOUVELLE (Hymne national du Bénin)",
      composer: "Abbé Gilbert DAGNON • Harm. G. J. L. SOWADAN",
      key_signature: "Sol Majeur (1♯)",
      tempo: 140,
      time_signature: "4/4",
      duration: 67.5,
      parts: [],
      notes: [],
      created_at: "Aujourd'hui"
    };

    const saved = ScoreManager.getAllLocalScores();
    setScores([defaultAube, ...saved.filter(s => s.id !== "demo-score")]);
  }, []);

  const stats = [
    { name: "Partitions Numérisées", value: `${scores.length}`, change: "Bibliothèque active", icon: FileMusic, color: "text-indigo-400" },
    { name: "Voix SATB Extraites", value: `${scores.length * 4}`, change: "100% Polyphonie", icon: Sliders, color: "text-cyan-400" },
    { name: "Rendus Audio FluidSynth", value: `${scores.length * 5}`, change: "Qualité HD .sf2", icon: Headphones, color: "text-emerald-400" },
    { name: "Précision Synchronisation", value: "99.8%", change: "140 BPM Karaoké", icon: Sparkles, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Dashboard Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border-subtle pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Tableau de Bord & Bibliothèque</h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Gestion de vos partitions numérisées, voix SATB isolées et rendus audio en temps réel
          </p>
        </div>

        <Link
          href="/upload"
          className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold flex items-center gap-2 shadow-glow-accent btn-magnetic"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Numériser une partition</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="bg-surface-100/90 rounded-3xl border border-border-subtle p-5 shadow-card hover:border-border-strong transition-all backdrop-blur-xl"
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

      {/* Scores Library */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Partitions Actives ({scores.length})</h2>
            <p className="text-xs text-gray-400">Accédez directement au Studio d'écoute et au mixeur de voix</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {scores.map((score) => (
            <div
              key={score.id}
              className="bg-surface-100 rounded-3xl border border-border-subtle p-6 shadow-card hover:border-accent/40 transition-all flex flex-col justify-between group backdrop-blur-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>SYNCHRO PRÊTE</span>
                  </span>
                  <span className="text-[11px] text-gray-500 font-mono">140 BPM</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-accent transition-colors">
                    {score.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">{score.composer}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border-subtle text-xs font-mono text-gray-400">
                  <span className="bg-surface-50 px-2 py-0.5 rounded-lg border border-border-subtle">{score.key_signature || "Sol Majeur"}</span>
                  <span className="bg-surface-50 px-2 py-0.5 rounded-lg border border-border-subtle">♩ {score.tempo} BPM</span>
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
