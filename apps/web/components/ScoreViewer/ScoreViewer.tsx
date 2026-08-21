"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Eye, Sparkles } from "lucide-react";

interface NoteItem {
  id?: string;
  measure_number: number;
  pitch: string;
  duration_beats: number;
  start_time_seconds: number;
  end_time_seconds: number;
  solfege_name_fr?: string;
  is_rest: boolean;
}

interface ScoreViewerProps {
  musicXmlUrl?: string;
  currentTime: number;
  activeNotes: NoteItem[];
  assistedMode: boolean;
  solfegeNotation: 'latin' | 'anglosaxon';
  tempo: number;
}

export function ScoreViewer({
  musicXmlUrl,
  currentTime,
  activeNotes,
  assistedMode,
  solfegeNotation,
  tempo
}: ScoreViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [osmdLoaded, setOsmdLoaded] = useState<boolean>(false);

  // Active note detection based on playback time
  const currentActiveNote = activeNotes.find(
    (n) => !n.is_rest && currentTime >= n.start_time_seconds && currentTime <= n.end_time_seconds
  );

  return (
    <div className="bg-surface-100 rounded-2xl border border-border-subtle overflow-hidden shadow-card flex flex-col">
      {/* Viewer Header / Toolbar */}
      <div className="px-6 py-4 border-b border-border-subtle bg-surface-200/60 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Rendu Partition Interactive (OSMD)</h2>
            <p className="text-[11px] text-gray-400 font-mono">
              Tempo: {tempo} BPM • Synchronisation note à note
            </p>
          </div>
        </div>

        {/* Current Active Note HUD (Karaoké solfège pour non-lecteur) */}
        {assistedMode && (
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-accent/10 border border-accent/30 animate-pulse-slow">
            <Sparkles className="w-4 h-4 text-cyan-neon" />
            <div className="text-xs">
              <span className="text-gray-400">Note active : </span>
              {currentActiveNote ? (
                <span className="font-mono font-bold text-white text-sm ml-1 px-2 py-0.5 rounded bg-accent text-white shadow-glow-accent">
                  {solfegeNotation === 'latin' 
                    ? (currentActiveNote.solfege_name_fr || currentActiveNote.pitch)
                    : currentActiveNote.pitch}
                </span>
              ) : (
                <span className="text-gray-500 font-mono italic ml-1">...</span>
              )}
            </div>
            {currentActiveNote && (
              <span className="text-[10px] font-mono text-cyan-neon ml-2">
                Mesure {currentActiveNote.measure_number}
              </span>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
            className="p-2 rounded-lg bg-surface-50 border border-border-subtle text-gray-400 hover:text-white transition-colors"
            title="Zoom arrière"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-gray-400 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
            className="p-2 rounded-lg bg-surface-50 border border-border-subtle text-gray-400 hover:text-white transition-colors"
            title="Zoom avant"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1.0)}
            className="p-2 rounded-lg bg-surface-50 border border-border-subtle text-gray-400 hover:text-white transition-colors"
            title="Réinitialiser"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Music Sheet Canvas Area */}
      <div className="p-8 bg-slate-900/40 flex justify-center min-h-[480px] overflow-auto">
        <div 
          ref={containerRef}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          className="w-full max-w-4xl transition-transform duration-200 ease-out"
        >
          {/* Partition Render SVG Container */}
          <div className="bg-white rounded-xl p-8 text-black shadow-2xl relative">
            <div className="border-b border-gray-200 pb-4 mb-6 flex justify-between items-end">
              <div>
                <h3 className="text-xl font-serif font-bold text-gray-900">Partition de démonstration (OMR)</h3>
                <p className="text-xs text-gray-600 italic">MusikPro Engine • 4/4 • C Major</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  ♩ = {tempo}
                </span>
              </div>
            </div>

            {/* Interactive Staves Visual Demonstration */}
            <div className="space-y-8 py-2">
              {/* Voice 1: Treble Clef */}
              <div>
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 font-mono">
                  Voix I (Mélodie Principale)
                </div>
                <div className="relative border-y-4 border-double border-gray-800 py-6 px-4 bg-amber-50/20 rounded-md flex items-center justify-between">
                  <div className="text-2xl font-serif font-bold text-gray-800 mr-4">𝄞</div>
                  <div className="flex-1 grid grid-cols-6 gap-3">
                    {activeNotes.slice(0, 6).map((n, idx) => {
                      const isCurrent = currentActiveNote === n;
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-150 ${
                            isCurrent
                              ? "bg-indigo-600 text-white border-indigo-700 shadow-lg scale-105"
                              : "bg-white/80 text-gray-800 border-gray-200 hover:border-indigo-300"
                          }`}
                        >
                          <span className="text-lg font-serif font-bold">♩</span>
                          <span className={`text-xs font-mono font-bold mt-1 ${isCurrent ? "text-white" : "text-gray-900"}`}>
                            {solfegeNotation === 'latin' ? (n.solfege_name_fr || n.pitch) : n.pitch}
                          </span>
                          <span className={`text-[9px] font-mono ${isCurrent ? "text-indigo-200" : "text-gray-400"}`}>
                            {n.start_time_seconds}s
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Voice 2: Bass Clef */}
              <div>
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 font-mono">
                  Voix II (Harmonie & Accompagnement)
                </div>
                <div className="relative border-y-4 border-double border-gray-800 py-6 px-4 bg-amber-50/20 rounded-md flex items-center justify-between">
                  <div className="text-2xl font-serif font-bold text-gray-800 mr-4">𝄢</div>
                  <div className="flex-1 grid grid-cols-3 gap-6">
                    {[
                      { pitch: "C3", fr: "Do3", start: 0, end: 1.2 },
                      { pitch: "E3", fr: "Mi3", start: 1.2, end: 2.4 },
                      { pitch: "G3", fr: "Sol3", start: 2.4, end: 4.8 },
                    ].map((item, idx) => {
                      const isCurrent = currentTime >= item.start && currentTime <= item.end;
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-150 ${
                            isCurrent
                              ? "bg-cyan-600 text-white border-cyan-700 shadow-lg scale-105"
                              : "bg-white/80 text-gray-800 border-gray-200"
                          }`}
                        >
                          <span className="text-xl font-serif font-bold">𝅗𝅥</span>
                          <span className={`text-xs font-mono font-bold mt-1 ${isCurrent ? "text-white" : "text-gray-900"}`}>
                            {solfegeNotation === 'latin' ? item.fr : item.pitch}
                          </span>
                          <span className={`text-[9px] font-mono ${isCurrent ? "text-cyan-100" : "text-gray-400"}`}>
                            {item.start}s - {item.end}s
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
