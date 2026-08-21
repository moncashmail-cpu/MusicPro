"use client";

import { useState } from "react";
import { Mic, Sliders, Volume2, VolumeX, Eye, Radio } from "lucide-react";

export interface PartItem {
  id: string;
  name: string;
  instrument?: string;
  midi_program?: number;
  order_index: number;
}

interface PartSelectorProps {
  parts: PartItem[];
  activePartId: string | null;
  onSelectPart: (partId: string | null) => void;
}

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
          <h3 className="text-sm font-bold text-white tracking-tight">Séparation des Voix / Pistes</h3>
        </div>
        <button
          onClick={() => {
            setSoloPart(null);
            setMutedParts({});
            onSelectPart(null);
          }}
          className="text-[11px] font-mono text-gray-400 hover:text-white underline transition-colors"
        >
          Harmonie Complète (Toutes les voix)
        </button>
      </div>

      {/* Parts List */}
      <div className="space-y-2.5">
        {parts.map((part) => {
          const isSolo = soloPart === part.id;
          const isMuted = mutedParts[part.id] || false;
          const isSelected = activePartId === part.id || activePartId === null;

          return (
            <div
              key={part.id}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                isSolo
                  ? "bg-accent/15 border-accent shadow-sm"
                  : isMuted
                  ? "bg-surface-200/50 border-border-subtle opacity-50"
                  : "bg-surface-50 border-border-subtle hover:border-border-strong"
              }`}
            >
              {/* Part Name & Info */}
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                  isSolo ? "bg-accent text-white" : "bg-surface-100 text-gray-400"
                }`}>
                  {part.order_index + 1}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">{part.name}</h4>
                  <p className="text-[10px] text-gray-500 font-mono">
                    {part.instrument || "Piano"} • Programme MIDI #{part.midi_program || 1}
                  </p>
                </div>
              </div>

              {/* Action Controls (Solo / Mute / Isolate) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSolo(part.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    isSolo
                      ? "bg-accent text-white shadow-glow-accent"
                      : "bg-surface-100 text-gray-400 border border-border-subtle hover:text-white"
                  }`}
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
