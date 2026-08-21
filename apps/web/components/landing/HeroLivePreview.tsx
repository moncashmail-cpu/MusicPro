"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Sparkles, Volume2, Sliders, CheckCircle2 } from "lucide-react";
import { scoreAudioPlayer } from "@/lib/audioEngine";

export function HeroLivePreview() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeVoice, setActiveVoice] = useState<string>("all");
  const [currentStep, setCurrentStep] = useState(0);

  // L'Aube Nouvelle Refrain Intro Notes (SATB Sol Majeur à 140 BPM - 0.21s par croche)
  const demoNotes = [
    { lyric: "En-", dur: 0.21, soprano: "D4", alto: "B3", tenor: "G3", bass: "G2", fr: "Ré4" },
    { lyric: "fants", dur: 0.21, soprano: "D4", alto: "B3", tenor: "G3", bass: "G2", fr: "Ré4" },
    { lyric: "du", dur: 0.43, soprano: "G4", alto: "D4", tenor: "B3", bass: "G2", fr: "Sol4" },
    { lyric: "Bé-", dur: 0.43, soprano: "B4", alto: "G4", tenor: "D4", bass: "G2", fr: "Si4" },
    { lyric: "nin", dur: 0.43, soprano: "G4", alto: "D4", tenor: "B3", bass: "B2", fr: "Sol4" },
    { lyric: "de-", dur: 0.32, soprano: "A4", alto: "F#4", tenor: "D4", bass: "D3", fr: "La4" },
    { lyric: "bout", dur: 0.21, soprano: "B4", alto: "G4", tenor: "D4", bass: "D3", fr: "Si4" },
    { lyric: "la", dur: 0.43, soprano: "C5", alto: "E4", tenor: "C4", bass: "C3", fr: "Do5" },
    { lyric: "li-ber-té !", dur: 0.86, soprano: "G4", alto: "D4", tenor: "B3", bass: "G2", fr: "Sol4" },
  ];

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      scoreAudioPlayer.init();
      let step = 0;
      const playStep = () => {
        const item = demoNotes[step];
        if (item) {
          if (activeVoice === "all") {
            scoreAudioPlayer.playNote(item.soprano, item.dur, "soprano");
            scoreAudioPlayer.playNote(item.alto, item.dur, "alto");
            scoreAudioPlayer.playNote(item.tenor, item.dur, "tenor");
            scoreAudioPlayer.playNote(item.bass, item.dur, "bass");
          } else if (activeVoice === "soprano") {
            scoreAudioPlayer.playNote(item.soprano, item.dur, "soprano");
          } else if (activeVoice === "alto") {
            scoreAudioPlayer.playNote(item.alto, item.dur, "alto");
          } else if (activeVoice === "tenor") {
            scoreAudioPlayer.playNote(item.tenor, item.dur, "tenor");
          } else if (activeVoice === "bass") {
            scoreAudioPlayer.playNote(item.bass, item.dur, "bass");
          }
          setCurrentStep(step);
          step = (step + 1) % demoNotes.length;
          timerRef.current = setTimeout(playStep, item.dur * 1000);
        }
      };
      playStep();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, activeVoice]);

  return (
    <div className="relative rounded-3xl bg-surface-100/95 border border-border-strong p-6 md:p-8 shadow-card backdrop-blur-xl space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent to-cyan-neon flex items-center justify-center text-white shadow-glow-accent">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">L'AUBE NOUVELLE (Hymne du Bénin)</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20">
                140 BPM • SATB
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono">Abbé G. DAGNON • Harm. G. J. L. SOWADAN • Sol Majeur</p>
          </div>
        </div>

        {/* Play / Stop Button */}
        <button
          onClick={() => {
            scoreAudioPlayer.init();
            setIsPlaying(!isPlaying);
          }}
          className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold flex items-center gap-2 shadow-glow-accent btn-magnetic"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
          <span>{isPlaying ? "Arrêter" : "Écouter l'Extrait (140 BPM)"}</span>
        </button>
      </div>

      {/* Interactive Staves Preview with Real Lyrics */}
      <div className="bg-surface-200/80 rounded-2xl p-4 border border-border-subtle space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
          <span>Paroles & Solfège synchronisés</span>
          <span className="text-cyan-neon font-bold">
            Note active : {demoNotes[currentStep]?.fr} ({demoNotes[currentStep]?.lyric})
          </span>
        </div>

        {/* Note Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {demoNotes.map((n, idx) => {
            const isCurrent = isPlaying && currentStep === idx;
            return (
              <div
                key={idx}
                className={`py-2 px-1 rounded-xl border text-center transition-all duration-150 flex flex-col items-center justify-between ${
                  isCurrent
                    ? "bg-accent text-white border-accent shadow-glow-accent scale-105"
                    : "bg-surface-50 text-gray-300 border-border-subtle"
                }`}
              >
                <span className="text-sm font-serif font-bold">♩</span>
                <span className={`text-xs font-mono font-bold mt-0.5 ${isCurrent ? "text-white" : "text-gray-200"}`}>
                  {n.fr}
                </span>
                <span className={`text-[10px] font-serif font-bold italic mt-1 px-1 rounded ${isCurrent ? "bg-white text-accent font-bold" : "text-amber-300"}`}>
                  {n.lyric}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Voice Selector Pills */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3 h-3 text-accent" />
          <span>Isoler une voix en direct (Grand Stave Choral) :</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { id: "all", label: "Chœur Complet", color: "border-accent text-white bg-accent/20" },
            { id: "soprano", label: "Soprano (Hampes ↑)", color: "border-indigo-500 text-indigo-300 bg-indigo-950/40" },
            { id: "alto", label: "Alto (Hampes ↓)", color: "border-cyan-500 text-cyan-300 bg-cyan-950/40" },
            { id: "tenor", label: "Ténor (Hampes ↑)", color: "border-emerald-500 text-emerald-300 bg-emerald-950/40" },
            { id: "bass", label: "Basse (Hampes ↓)", color: "border-amber-500 text-amber-300 bg-amber-950/40" },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => {
                setActiveVoice(v.id);
                scoreAudioPlayer.init();
              }}
              className={`py-2 px-1 rounded-xl text-[11px] font-mono font-bold border transition-all text-center ${
                activeVoice === v.id
                  ? `${v.color} shadow-sm ring-1 ring-white/30`
                  : "bg-surface-50 border-border-subtle text-gray-400 hover:text-white"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
