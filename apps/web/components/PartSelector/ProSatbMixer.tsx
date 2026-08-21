"use client";

import { useState } from "react";
import { Sliders, Volume2, VolumeX, Sparkles, Activity, Radio, RotateCcw } from "lucide-react";

export interface PartItem {
  id: string;
  name: string;
  type?: 'soprano' | 'alto' | 'tenor' | 'bass';
  instrument?: string;
  midi_program?: number;
  order_index: number;
}

interface ProSatbMixerProps {
  parts: PartItem[];
  activePartId: string | null;
  onSelectPart: (partId: string | null) => void;
  isPlaying: boolean;
}

const SATB_METADATA: Record<string, { tag: string; label: string; range: string; color: string; vuColor: string }> = {
  "part-soprano": { tag: "S", label: "Soprano", range: "D4 - G5", color: "text-indigo-400 border-indigo-500/40 bg-indigo-950/40", vuColor: "from-indigo-500 to-indigo-400" },
  "part-alto": { tag: "A", label: "Alto", range: "B3 - E4", color: "text-cyan-400 border-cyan-500/40 bg-cyan-950/40", vuColor: "from-cyan-500 to-cyan-400" },
  "part-tenor": { tag: "T", label: "Ténor", range: "G3 - D4", color: "text-emerald-400 border-emerald-500/40 bg-emerald-950/40", vuColor: "from-emerald-500 to-emerald-400" },
  "part-bass": { tag: "B", label: "Basse", range: "G2 - D3", color: "text-amber-400 border-amber-500/40 bg-amber-950/40", vuColor: "from-amber-500 to-amber-400" },
};

export function ProSatbMixer({ parts, activePartId, onSelectPart, isPlaying }: ProSatbMixerProps) {
  const [mutedParts, setMutedParts] = useState<Record<string, boolean>>({});
  const [soloPart, setSoloPart] = useState<string | null>(null);
  const [faders, setFaders] = useState<Record<string, number>>({
    "part-soprano": 0.85,
    "part-alto": 0.80,
    "part-tenor": 0.80,
    "part-bass": 0.85,
  });

  const toggleMute = (partId: string) => {
    setMutedParts(prev => ({ ...prev, [partId]: !prev[partId] }));
  };

  const toggleSolo = (partId: string) => {
    const nextSolo = soloPart === partId ? null : partId;
    setSoloPart(nextSolo);
    onSelectPart(nextSolo);
  };

  return (
    <div className="bg-surface-100 rounded-3xl border border-border-strong p-6 shadow-card space-y-6 backdrop-blur-xl">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-tight">Console de Mixage SATB Pro</h3>
            <p className="text-[10px] text-gray-400 font-mono">4 Canaux Indépendants • VU-Mètres Stéréo</p>
          </div>
        </div>

        <button
          onClick={() => {
            setSoloPart(null);
            setMutedParts({});
            onSelectPart(null);
          }}
          className="text-[11px] font-mono font-semibold text-gray-400 hover:text-white px-2.5 py-1 rounded-lg bg-surface-50 border border-border-subtle hover:border-border-strong transition-all"
        >
          Reset Mix
        </button>
      </div>

      {/* 4 Professional Channel Strips Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {parts.map((part) => {
          const isSolo = soloPart === part.id;
          const isMuted = mutedParts[part.id] || false;
          const meta = SATB_METADATA[part.id] || { tag: "V", label: part.name, range: "C3-C5", color: "text-white", vuColor: "from-accent to-cyan-neon" };
          const faderVal = faders[part.id] ?? 0.8;

          return (
            <div
              key={part.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-between space-y-3 ${
                isSolo
                  ? "bg-accent/15 border-accent shadow-glow-accent ring-1 ring-white/30"
                  : isMuted
                  ? "bg-surface-200/50 border-border-subtle opacity-40"
                  : "bg-surface-50/80 border-border-subtle hover:border-border-strong"
              }`}
            >
              {/* Channel Top Badge */}
              <div className="w-full text-center space-y-1">
                <div className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center font-mono font-black text-xs border ${meta.color}`}>
                  {meta.tag}
                </div>
                <h4 className="text-xs font-bold text-white tracking-tight">{meta.label}</h4>
                <span className="text-[9px] font-mono text-gray-500 block">{meta.range}</span>
              </div>

              {/* Animated VU Meter Level */}
              <div className="w-4 h-24 bg-surface-200 rounded-full p-0.5 border border-border-subtle flex flex-col justify-end overflow-hidden">
                <div
                  style={{
                    height: isMuted || (soloPart !== null && !isSolo) || !isPlaying
                      ? "4%"
                      : `${Math.random() * 45 + 45}%`
                  }}
                  className={`w-full rounded-full bg-gradient-to-t ${meta.vuColor} transition-all duration-100 shadow-sm`}
                />
              </div>

              {/* Volume Fader Slider */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : faderVal}
                onChange={(e) => {
                  setFaders({ ...faders, [part.id]: parseFloat(e.target.value) });
                }}
                className="w-16 accent-accent h-1.5 bg-surface-200 rounded-lg cursor-pointer"
              />

              {/* Solo & Mute Buttons */}
              <div className="flex items-center gap-1.5 w-full justify-center pt-1">
                <button
                  onClick={() => toggleSolo(part.id)}
                  className={`w-8 py-1 rounded-lg text-[10px] font-mono font-black transition-all ${
                    isSolo
                      ? "bg-accent text-white shadow-glow-accent"
                      : "bg-surface-100 text-gray-400 border border-border-subtle hover:text-white"
                  }`}
                  title="SOLO"
                >
                  S
                </button>

                <button
                  onClick={() => toggleMute(part.id)}
                  className={`w-8 py-1 rounded-lg text-[10px] font-mono font-black transition-all ${
                    isMuted
                      ? "bg-red-500/30 text-red-400 border border-red-500/50"
                      : "bg-surface-100 text-gray-400 border border-border-subtle hover:text-white"
                  }`}
                  title="MUTE"
                >
                  M
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DAW Mixer Footer Legend */}
      <div className="pt-2 border-t border-border-subtle flex justify-between items-center text-[10px] font-mono text-gray-500">
        <span>Faders 32-bit Float</span>
        <span>Stéréo Pan Centré</span>
      </div>
    </div>
  );
}
