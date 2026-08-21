"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Sparkles, 
  Layers, 
  Music, 
  FileCode, 
  CheckCircle2,
  Headphones
} from "lucide-react";
import Link from "next/link";
import { ScoreViewer } from "@/components/ScoreViewer/ScoreViewer";
import { AudioPlayer } from "@/components/AudioPlayer/AudioPlayer";
import { PartSelector } from "@/components/PartSelector/PartSelector";

export default function ScoreStudioPage() {
  const params = useParams();
  const scoreId = params?.id || "demo-score";

  // Score Mock / Live Data
  const scoreData = {
    id: scoreId,
    title: "Hymne à la Joie (Ode to Joy)",
    composer: "Ludwig van Beethoven",
    tempo: 120,
    key_signature: "D Major",
    time_signature: "4/4",
    duration: 12.0, // seconds
    parts: [
      { id: "part-1", name: "Voix I (Mélodie Soprano)", instrument: "Violon / Chant", midi_program: 41, order_index: 0 },
      { id: "part-2", name: "Voix II (Harmonie Alto/Basse)", instrument: "Violoncelle", midi_program: 43, order_index: 1 },
    ],
    notes: [
      { measure_number: 1, pitch: "E4", solfege_name_fr: "Mi4", duration_beats: 1, start_time_seconds: 0.0, end_time_seconds: 0.5, is_rest: false },
      { measure_number: 1, pitch: "E4", solfege_name_fr: "Mi4", duration_beats: 1, start_time_seconds: 0.5, end_time_seconds: 1.0, is_rest: false },
      { measure_number: 1, pitch: "F#4", solfege_name_fr: "Fa#4", duration_beats: 1, start_time_seconds: 1.0, end_time_seconds: 1.5, is_rest: false },
      { measure_number: 1, pitch: "G4", solfege_name_fr: "Sol4", duration_beats: 1, start_time_seconds: 1.5, end_time_seconds: 2.0, is_rest: false },
      { measure_number: 2, pitch: "G4", solfege_name_fr: "Sol4", duration_beats: 1, start_time_seconds: 2.0, end_time_seconds: 2.5, is_rest: false },
      { measure_number: 2, pitch: "F#4", solfege_name_fr: "Fa#4", duration_beats: 1, start_time_seconds: 2.5, end_time_seconds: 3.0, is_rest: false },
      { measure_number: 2, pitch: "E4", solfege_name_fr: "Mi4", duration_beats: 1, start_time_seconds: 3.0, end_time_seconds: 3.5, is_rest: false },
      { measure_number: 2, pitch: "D4", solfege_name_fr: "Ré4", duration_beats: 1, start_time_seconds: 3.5, end_time_seconds: 4.0, is_rest: false },
      { measure_number: 3, pitch: "C4", solfege_name_fr: "Do4", duration_beats: 1, start_time_seconds: 4.0, end_time_seconds: 4.5, is_rest: false },
      { measure_number: 3, pitch: "C4", solfege_name_fr: "Do4", duration_beats: 1, start_time_seconds: 4.5, end_time_seconds: 5.0, is_rest: false },
      { measure_number: 3, pitch: "D4", solfege_name_fr: "Ré4", duration_beats: 1, start_time_seconds: 5.0, end_time_seconds: 5.5, is_rest: false },
      { measure_number: 3, pitch: "E4", solfege_name_fr: "Mi4", duration_beats: 1, start_time_seconds: 5.5, end_time_seconds: 6.0, is_rest: false },
      { measure_number: 4, pitch: "E4", solfege_name_fr: "Mi4", duration_beats: 1.5, start_time_seconds: 6.0, end_time_seconds: 6.75, is_rest: false },
      { measure_number: 4, pitch: "D4", solfege_name_fr: "Ré4", duration_beats: 0.5, start_time_seconds: 6.75, end_time_seconds: 7.0, is_rest: false },
      { measure_number: 4, pitch: "D4", solfege_name_fr: "Ré4", duration_beats: 2, start_time_seconds: 7.0, end_time_seconds: 8.0, is_rest: false },
    ]
  };

  // Playback States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [tempoMultiplier, setTempoMultiplier] = useState<number>(1.0);
  const [activePartId, setActivePartId] = useState<string | null>(null);
  const [solfegeNotation, setSolfegeNotation] = useState<'latin' | 'anglosaxon'>('latin');
  const [assistedMode, setAssistedMode] = useState<boolean>(true);

  // Real-time animation clock for synchronised note karaoke
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      const loop = (now: number) => {
        if (lastTimeRef.current !== undefined) {
          const delta = (now - lastTimeRef.current) / 1000;
          setCurrentTime((prev) => {
            const next = prev + delta * tempoMultiplier;
            if (next >= scoreData.duration) {
              setIsPlaying(false);
              return 0;
            }
            return next;
          });
        }
        lastTimeRef.current = now;
        requestRef.current = requestAnimationFrame(loop);
      };
      requestRef.current = requestAnimationFrame(loop);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, tempoMultiplier, scoreData.duration]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Studio Top Navigation Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border-subtle pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2.5 rounded-xl bg-surface-100 border border-border-subtle text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">{scoreData.title}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                SYNCHRO ACTIVE
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              {scoreData.composer} • {scoreData.key_signature} • {scoreData.time_signature} • ♩ {scoreData.tempo} BPM
            </p>
          </div>
        </div>

        {/* Action buttons: Downloads */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert("Export MusicXML téléchargé")}
            className="px-3.5 py-2 rounded-xl bg-surface-100 border border-border-subtle text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-2 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-accent" />
            <span>MusicXML</span>
          </button>
          <button 
            onClick={() => alert("Pistes audio séparées (ZIP) en cours de téléchargement")}
            className="px-3.5 py-2 rounded-xl bg-surface-100 border border-border-subtle text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-neon" />
            <span>Pistes Audio (.mp3)</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Score Viewer on Left / Multi-track Console on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Interactive Score Viewer (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <ScoreViewer
            currentTime={currentTime}
            activeNotes={scoreData.notes}
            assistedMode={assistedMode}
            solfegeNotation={solfegeNotation}
            tempo={Math.round(scoreData.tempo * tempoMultiplier)}
          />

          {/* Master Audio Controller */}
          <AudioPlayer
            duration={scoreData.duration}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onPlayToggle={() => setIsPlaying(!isPlaying)}
            onSeek={(t) => setCurrentTime(t)}
            onReset={() => {
              setIsPlaying(false);
              setCurrentTime(0);
            }}
            tempoMultiplier={tempoMultiplier}
            onTempoChange={(m) => setTempoMultiplier(m)}
            solfegeNotation={solfegeNotation}
            onSolfegeToggle={() => setSolfegeNotation(solfegeNotation === 'latin' ? 'anglosaxon' : 'latin')}
            assistedMode={assistedMode}
            onAssistedModeToggle={() => setAssistedMode(!assistedMode)}
          />
        </div>

        {/* Right Side: Part Isolation / Multi-track Mixer */}
        <div className="space-y-6">
          <PartSelector
            parts={scoreData.parts}
            activePartId={activePartId}
            onSelectPart={(id) => setActivePartId(id)}
          />

          {/* Info Card: Pedagogical Tips */}
          <div className="bg-surface-100 rounded-2xl border border-border-subtle p-6 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-cyan-neon text-xs font-bold font-mono">
              <Sparkles className="w-4 h-4" />
              <span>GUIDE D'APPRENTISSAGE</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Le mode non-lecteur surligne la position exacte de la note jouée sur la portée tout en affichant son nom en solfège (<strong className="text-white">Do, Ré, Mi</strong>).
            </p>
            <div className="pt-2 border-t border-border-subtle flex justify-between items-center text-[11px] font-mono text-gray-500">
              <span>Moteur FluidSynth v2.3</span>
              <span>SoundFont HD .sf2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
