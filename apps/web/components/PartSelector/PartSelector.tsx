"use client";

import { useState } from "react";
import { Sliders, Volume2, VolumeX, Sparkles, Music } from "lucide-react";

export interface PartItem {
  id: string;
  name: string;
  type?: 'soprano' | 'alto' | 'tenor' | 'bass';
  instrument?: string;
  midi_program?: number;
  order_index: number;
}

interface PartSelectorProps {
  parts: PartItem[];
  activePartId: string | null;
  onSelectPart: (partId: string | null) => void;
}

const SATB_METADATA: Record<string, { tag: string; label: string; desc: string; badge: string; borderActive: string }> = {
  "part-soprano": { 
    tag: "S", 
    label: "Soprano", 
    desc: "Voix aiguë (Mélodie principale)", 
    badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    borderActive: "border-indigo-500 bg-indigo-950/30"
  },
  "part-alto": { 
    tag: "A", 
    label: "Alto", 
    desc: "Voix moyenne aiguë (Contre-chant)", 
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    borderActive: "border-cyan-500 bg-cyan-950/30"
  },
  "part-tenor": { 
    tag: "T", 
    label: "Ténor", 
    desc: "Voix moyenne grave (Harmonie)", 
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    borderActive: "border-emerald-500 bg-emerald-950/30"
  },
  "part-bass": { 
    tag: "B", 
    label: "Basse", 
    desc: "Voix grave (Fondation harmonique)", 
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    borderActive: "border-amber-500 bg-amber-950/30"
  },
};

export function PartSelector({ parts, activePartId, onSelectPart }: PartSelectorProps) {
  const [mutedParts, setMutedParts] = useState<Record<string, boolean>>({});
  const [soloPart, setSoloPart] = useState<string | null>(null);

  const toggleMute = (partId: string) => {
    setMutedParts(prev => ({
      ...prev,
      [partId]: !prev[partId]
    }));
  };

  const toggleSolo = (partId: string) => {
    const nextSolo = soloPart === partId ? null : partId;
    setSoloPart(nextSolo);
    onSelectPart(nextSolo);
  };

  return (
    <div className="bg-surface-100 rounded-2xl border border-border-subtle p-6 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-bold text-white tracking-tight">Mixeur SATB (4 Voix)</h3>
        </div>
        <button
          onClick={() => {
            setSoloPart(null);
            setMutedParts({});
            onSelectPart(null);
          }}
          className="text-[11px] font-mono text-gray-400 hover:text-white underline transition-colors"
        >
          Tous (Chœur complet)
        </button>
      </div>

      {/* 4 SATB Voice Cards */}
      <div className="space-y-2.5">
        {parts.map((part) => {
          const isSolo = soloPart === part.id;
          const isMuted = mutedParts[part.id] || false;
          const isSelected = activePartId === part.id || activePartId === null;
          const meta = SATB_METADATA[part.id] || {
            tag: `${part.order_index + 1}`,
            label: part.name,
            desc: "Piste vocale",
            badge: "bg-surface-50 text-gray-400 border-border-subtle",
            borderActive: "border-accent bg-accent/15"
          };

          return (
            <div
              key={part.id}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                isSolo
                  ? meta.borderActive
                  : isMuted
                  ? "bg-surface-200/50 border-border-subtle opacity-40"
                  : "bg-surface-50 border-border-subtle hover:border-border-strong"
              }`}
            >
              {/* Voice Tag & Details */}
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs border ${meta.badge}`}>
                  {meta.tag}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{meta.label}</span>
                  </h4>
                  <p className="text-[10px] text-gray-400 font-mono">
                    {meta.desc}
                  </p>
                </div>
              </div>

              {/* Solo & Mute Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSolo(part.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    isSolo
                      ? "bg-accent text-white shadow-glow-accent ring-1 ring-white/40"
                      : "bg-surface-100 text-gray-400 border border-border-subtle hover:text-white"
                  }`}
                  title={`Isoler la voix ${meta.label}`}
                >
                  SOLO
                </button>

                <button
                  onClick={() => toggleMute(part.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    isMuted
                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : "bg-surface-100 text-gray-400 border border-border-subtle hover:text-white"
                  }`}
                  title={`Couper la voix ${meta.label}`}
                >
                  MUTE
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
