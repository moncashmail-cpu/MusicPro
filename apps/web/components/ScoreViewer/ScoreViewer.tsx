"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Eye, Sparkles, LayoutList, Columns } from "lucide-react";

export interface NoteItem {
  id?: string;
  part_id?: string;
  measure_number: number;
  pitch: string;
  duration_beats: number;
  start_time_seconds: number;
  end_time_seconds: number;
  solfege_name_fr?: string;
  lyric?: string; // Syllabe de chant (ex: "En-", "fants", "du", "Bé-", "nin")
  is_rest: boolean;
  stem?: 'up' | 'down';
}

interface ScoreViewerProps {
  musicXmlUrl?: string;
  currentTime: number;
  allNotes?: NoteItem[];
  assistedMode: boolean;
  solfegeNotation: 'latin' | 'anglosaxon';
  tempo: number;
  activePartId: string | null;
  scoreTitle?: string;
  composer?: string;
}

export function ScoreViewer({
  musicXmlUrl,
  currentTime,
  allNotes = [],
  assistedMode,
  solfegeNotation,
  tempo,
  activePartId,
  scoreTitle = "L'AUBE NOUVELLE (Hymne national du Bénin)",
  composer = "Abbé Gilbert DAGNON • Harm. G. J. L. SOWADAN"
}: ScoreViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [viewMode, setViewMode] = useState<'grand_staff' | 'decomposed'>('grand_staff');

  const safeNotes = allNotes || [];

  const sopranoNotes = safeNotes.filter(n => n.part_id === "part-soprano");
  const altoNotes = safeNotes.filter(n => n.part_id === "part-alto");
  const tenorNotes = safeNotes.filter(n => n.part_id === "part-tenor");
  const bassNotes = safeNotes.filter(n => n.part_id === "part-bass");

  // Current active note for HUD
  const currentSoprano = sopranoNotes.find(n => !n.is_rest && currentTime >= n.start_time_seconds && currentTime <= n.end_time_seconds);

  return (
    <div className="bg-surface-100 rounded-2xl border border-border-subtle overflow-hidden shadow-card flex flex-col">
      {/* Header Toolbar */}
      <div className="px-6 py-4 border-b border-border-subtle bg-surface-200/60 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">{scoreTitle}</h2>
            <p className="text-[11px] text-gray-400 font-mono">
              Sol Majeur (1♯) • 4/4 • ♩ = {tempo} (Avec entrain)
            </p>
          </div>
        </div>

        {/* View Mode Toggle: Système Choral (Grand Stave S+A / T+B) vs 4 Voix Dépliées */}
        <div className="flex items-center gap-1.5 bg-surface-50 border border-border-subtle p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grand_staff')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'grand_staff'
                ? "bg-accent text-white font-bold shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Système Choral (Original)</span>
          </button>

          <button
            onClick={() => setViewMode('decomposed')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'decomposed'
                ? "bg-accent text-white font-bold shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>4 Voix Dépliées</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
            className="p-2 rounded-lg bg-surface-50 border border-border-subtle text-gray-400 hover:text-white transition-colors"
            title="Zoom arrière"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-gray-400 w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
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

      {/* Sheet Music Canvas */}
      <div className="p-6 md:p-8 bg-slate-900/40 flex justify-center min-h-[580px] overflow-auto">
        <div 
          ref={containerRef}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          className="w-full max-w-4xl transition-transform duration-200 ease-out"
        >
          <div className="bg-white rounded-2xl p-8 md:p-10 text-black shadow-2xl space-y-6">
            {/* Sheet Title & Metadata (as in original CamScanner PDF) */}
            <div className="text-center border-b border-gray-300 pb-4 space-y-1">
              <h3 className="text-2xl font-serif font-extrabold tracking-wide uppercase text-gray-900">
                L'AUBE NOUVELLE
              </h3>
              <p className="text-sm font-serif italic text-gray-700">
                (Hymne national du Bénin)
              </p>
              <div className="flex justify-between items-center text-[11px] text-gray-600 font-serif pt-2">
                <span className="font-bold italic">Avec entrain (♩ = 140)</span>
                <div className="text-right">
                  <p>Texte et Musique : <strong>Abbé Gilbert DAGNON</strong></p>
                  <p>Harmonisation : <strong>Grégoire Jean Louis SOWADAN</strong></p>
                </div>
              </div>
            </div>

            {/* Mode 1: Grand Staff Choral (2 Accoupled Staves as on PDF) */}
            {viewMode === 'grand_staff' ? (
              <div className="space-y-8 py-2">
                <div className="flex items-center gap-2 font-serif text-sm font-bold text-gray-800">
                  <span>Refrain</span>
                  <span className="text-lg font-mono font-bold text-gray-700">%</span>
                </div>

                {/* Stave 1: Soprano (↑) & Alto (↓) in Treble Clef */}
                <div className="relative border-l-4 border-gray-900 pl-4 space-y-4">
                  <div className="flex justify-between items-center text-[11px] font-mono text-gray-500 font-bold">
                    <span className="text-indigo-600">𝄞 SOPRANO (Hampes ↑) & ALTO (Hampes ↓)</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">Clé de Sol • 1♯ (Fa#) • 4/4</span>
                  </div>

                  <div className="relative border-y-4 border-double border-gray-800 py-4 px-3 bg-amber-50/15 rounded-lg flex items-center gap-2">
                    <div className="flex items-center gap-1 text-2xl font-serif font-bold text-gray-800 shrink-0 mr-2">
                      <span>𝄞</span>
                      <span className="text-sm font-mono font-bold">♯</span>
                      <span className="text-xs font-mono font-bold ml-1">4/4</span>
                    </div>

                    <div className="flex-1 grid grid-cols-8 gap-2">
                      {sopranoNotes.slice(0, 8).map((sn, idx) => {
                        const an = altoNotes[idx];
                        const isSopranoActive = !sn.is_rest && currentTime >= sn.start_time_seconds && currentTime <= sn.end_time_seconds;
                        const isAltoActive = an && !an.is_rest && currentTime >= an.start_time_seconds && currentTime <= an.end_time_seconds;

                        return (
                          <div
                            key={idx}
                            className={`flex flex-col items-center justify-between p-2 rounded-lg border text-center transition-all duration-100 ${
                              isSopranoActive || isAltoActive
                                ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-500/40"
                                : "bg-white/90 border-gray-200"
                            }`}
                          >
                            {/* Soprano Note (Up) */}
                            <div className="flex items-center gap-1">
                              <span className={`text-xs font-mono font-bold ${isSopranoActive ? "text-indigo-700 bg-indigo-100 px-1 rounded" : "text-gray-900"}`}>
                                {solfegeNotation === 'latin' ? (sn.solfege_name_fr || sn.pitch) : sn.pitch}
                              </span>
                              <span className="text-[10px] text-gray-500">↑</span>
                            </div>

                            {/* Alto Note (Down) */}
                            {an && (
                              <div className="flex items-center gap-1 pt-1 border-t border-gray-200 w-full justify-center">
                                <span className={`text-[11px] font-mono font-medium ${isAltoActive ? "text-cyan-700 bg-cyan-100 px-1 rounded font-bold" : "text-gray-600"}`}>
                                  {solfegeNotation === 'latin' ? (an.solfege_name_fr || an.pitch) : an.pitch}
                                </span>
                                <span className="text-[9px] text-gray-400">↓</span>
                              </div>
                            )}

                            {/* Lyric Syllable */}
                            {sn.lyric && (
                              <span className="text-xs font-serif font-bold text-gray-900 mt-2 italic bg-amber-100/60 px-1.5 py-0.5 rounded border border-amber-200">
                                {sn.lyric}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Stave 2: Ténor (↑) & Basse (↓) in Bass Clef */}
                <div className="relative border-l-4 border-gray-900 pl-4 space-y-4">
                  <div className="flex justify-between items-center text-[11px] font-mono text-gray-500 font-bold">
                    <span className="text-amber-700">𝄢 TÉNOR (Hampes ↑) & BASSE (Hampes ↓)</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">Clé de Fa • 1♯ (Fa#) • 4/4</span>
                  </div>

                  <div className="relative border-y-4 border-double border-gray-800 py-4 px-3 bg-amber-50/15 rounded-lg flex items-center gap-2">
                    <div className="flex items-center gap-1 text-2xl font-serif font-bold text-gray-800 shrink-0 mr-2">
                      <span>𝄢</span>
                      <span className="text-sm font-mono font-bold">♯</span>
                      <span className="text-xs font-mono font-bold ml-1">4/4</span>
                    </div>

                    <div className="flex-1 grid grid-cols-8 gap-2">
                      {tenorNotes.slice(0, 8).map((tn, idx) => {
                        const bn = bassNotes[idx];
                        const isTenorActive = !tn.is_rest && currentTime >= tn.start_time_seconds && currentTime <= tn.end_time_seconds;
                        const isBassActive = bn && !bn.is_rest && currentTime >= bn.start_time_seconds && currentTime <= bn.end_time_seconds;

                        return (
                          <div
                            key={idx}
                            className={`flex flex-col items-center justify-between p-2 rounded-lg border text-center transition-all duration-100 ${
                              isTenorActive || isBassActive
                                ? "bg-amber-50 border-amber-600 shadow-md ring-2 ring-amber-500/40"
                                : "bg-white/90 border-gray-200"
                            }`}
                          >
                            {/* Tenor Note (Up) */}
                            <div className="flex items-center gap-1">
                              <span className={`text-xs font-mono font-bold ${isTenorActive ? "text-emerald-700 bg-emerald-100 px-1 rounded" : "text-gray-900"}`}>
                                {solfegeNotation === 'latin' ? (tn.solfege_name_fr || tn.pitch) : tn.pitch}
                              </span>
                              <span className="text-[10px] text-gray-500">↑</span>
                            </div>

                            {/* Bass Note (Down) */}
                            {bn && (
                              <div className="flex items-center gap-1 pt-1 border-t border-gray-200 w-full justify-center">
                                <span className={`text-[11px] font-mono font-medium ${isBassActive ? "text-amber-800 bg-amber-100 px-1 rounded font-bold" : "text-gray-600"}`}>
                                  {solfegeNotation === 'latin' ? (bn.solfege_name_fr || bn.pitch) : bn.pitch}
                                </span>
                                <span className="text-[9px] text-gray-400">↓</span>
                              </div>
                            )}

                            {/* Lyric Syllable */}
                            {tn.lyric && (
                              <span className="text-xs font-serif font-bold text-gray-900 mt-2 italic bg-amber-100/60 px-1.5 py-0.5 rounded border border-amber-200">
                                {tn.lyric}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Mode 2: 4 Decomposed Staves (S, A, T, B) */
              <div className="space-y-4">
                {[
                  { label: "Soprano", tag: "S", notes: sopranoNotes, clef: "𝄞", color: "border-indigo-500 text-indigo-700" },
                  { label: "Alto", tag: "A", notes: altoNotes, clef: "𝄞", color: "border-cyan-500 text-cyan-700" },
                  { label: "Ténor", tag: "T", notes: tenorNotes, clef: "𝄠", color: "border-emerald-500 text-emerald-700" },
                  { label: "Basse", tag: "B", notes: bassNotes, clef: "𝄢", color: "border-amber-500 text-amber-700" },
                ].map((voice) => (
                  <div key={voice.label} className="space-y-1">
                    <div className="text-xs font-mono font-bold text-gray-700 flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.2 rounded border ${voice.color}`}>{voice.tag}</span>
                      <span>{voice.label}</span>
                    </div>

                    <div className="relative border-y-2 border-gray-800 py-2.5 px-3 bg-amber-50/10 rounded flex items-center gap-2">
                      <span className="text-xl font-serif font-bold mr-2">{voice.clef}</span>
                      <div className="flex-1 grid grid-cols-8 gap-2">
                        {voice.notes.map((n, idx) => {
                          const isCurrent = !n.is_rest && currentTime >= n.start_time_seconds && currentTime <= n.end_time_seconds;
                          return (
                            <div
                              key={idx}
                              className={`p-1.5 rounded border text-center transition-all ${
                                isCurrent
                                  ? "bg-accent text-white border-accent shadow-md scale-105"
                                  : "bg-white text-gray-800 border-gray-200"
                              }`}
                            >
                              <span className="text-xs font-mono font-bold block">
                                {solfegeNotation === 'latin' ? (n.solfege_name_fr || n.pitch) : n.pitch}
                              </span>
                              {n.lyric && (
                                <span className={`text-[10px] font-serif italic block mt-0.5 ${isCurrent ? "text-indigo-100" : "text-gray-600"}`}>
                                  {n.lyric}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
