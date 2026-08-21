"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Gauge, 
  Languages, 
  SlidersHorizontal,
  Radio,
  Repeat,
  Music2,
  Mic2,
  Activity
} from "lucide-react";

interface ProAudioPlayerProps {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onSeek: (time: number) => void;
  onReset: () => void;
  tempoMultiplier: number;
  onTempoChange: (multiplier: number) => void;
  solfegeNotation: 'latin' | 'anglosaxon';
  onSolfegeToggle: () => void;
  assistedMode: boolean;
  onAssistedModeToggle: () => void;
  audioMode: 'real_audio' | 'satb_synth';
  onAudioModeChange: (mode: 'real_audio' | 'satb_synth') => void;
  isLooping: boolean;
  onLoopToggle: () => void;
  metronomeActive: boolean;
  onMetronomeToggle: () => void;
}

export function ProAudioPlayer({
  duration,
  currentTime,
  isPlaying,
  onPlayToggle,
  onSeek,
  onReset,
  tempoMultiplier,
  onTempoChange,
  solfegeNotation,
  onSolfegeToggle,
  assistedMode,
  onAssistedModeToggle,
  audioMode,
  onAudioModeChange,
  isLooping,
  onLoopToggle,
  metronomeActive,
  onMetronomeToggle
}: ProAudioPlayerProps) {
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}.${ms}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Waveform bars simulation
  const waveformBars = Array.from({ length: 48 }, (_, i) => {
    const height = Math.sin((i / 48) * Math.PI * 3) * 0.4 + 0.5 + Math.cos(i * 1.5) * 0.2;
    return Math.max(0.15, Math.min(1.0, height));
  });

  return (
    <div className="bg-surface-100 rounded-3xl border border-border-strong p-6 md:p-7 shadow-card space-y-6 backdrop-blur-xl">
      {/* Top Source Mode Selector : Audio Réel Choral vs Synthèse SATB */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-2 bg-surface-200/90 p-1.5 rounded-2xl border border-border-subtle">
          <button
            onClick={() => onAudioModeChange('real_audio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              audioMode === 'real_audio'
                ? "bg-gradient-to-r from-accent to-indigo-600 text-white shadow-glow-accent"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Mic2 className="w-3.5 h-3.5" />
            <span>Enregistrement Choral Réel (Studio HD)</span>
          </button>

          <button
            onClick={() => onAudioModeChange('satb_synth')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              audioMode === 'satb_synth'
                ? "bg-gradient-to-r from-cyan-neon to-blue-600 text-white shadow-glow-cyan"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Music2 className="w-3.5 h-3.5" />
            <span>Synthèse Multi-Voix SATB (Solo/Mute)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Metronome Toggle */}
          <button
            onClick={onMetronomeToggle}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              metronomeActive
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-surface-50 text-gray-400 border border-border-subtle hover:text-white"
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${metronomeActive ? "animate-spin" : ""}`} />
            <span>Métronome (140 BPM)</span>
          </button>

          {/* Loop Mode */}
          <button
            onClick={onLoopToggle}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              isLooping
                ? "bg-accent/20 text-accent border border-accent/40 shadow-sm"
                : "bg-surface-50 text-gray-400 border border-border-subtle hover:text-white"
            }`}
            title="Boucler le morceau"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Waveform Scrubber & Timeline */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></span>
            <span className="text-white font-bold text-sm">{formatTime(currentTime)}</span>
          </div>
          <span className="text-gray-400 font-semibold">{formatTime(duration)}</span>
        </div>

        {/* Waveform Visualizer & Interactive Progress Bar */}
        <div 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            onSeek(clickPos * duration);
          }}
          className="relative h-14 bg-surface-200/90 rounded-2xl p-2.5 border border-border-subtle cursor-pointer group flex items-end justify-between gap-1 overflow-hidden"
        >
          {waveformBars.map((h, i) => {
            const barProgress = (i / waveformBars.length) * 100;
            const isPassed = progressPercent >= barProgress;
            return (
              <div
                key={i}
                style={{ height: `${h * 100}%` }}
                className={`w-full rounded-full transition-all duration-75 ${
                  isPassed
                    ? "bg-gradient-to-t from-accent to-cyan-neon opacity-90 shadow-glow-accent"
                    : "bg-surface-50 opacity-40 group-hover:opacity-60"
                }`}
              />
            );
          })}

          {/* Cursor Playhead Line */}
          <div 
            style={{ left: `${progressPercent}%` }}
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-glow-accent z-10 pointer-events-none transition-all duration-75"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white -ml-1 top-0 absolute shadow-md"></div>
          </div>
        </div>
      </div>

      {/* Transport Controls Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
        {/* Play / Reset Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="p-3 rounded-2xl bg-surface-50 border border-border-subtle text-gray-400 hover:text-white hover:border-border-strong transition-all"
            title="Revenir au début"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={onPlayToggle}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-accent via-indigo-600 to-cyan-neon hover:opacity-95 text-white font-extrabold text-sm flex items-center gap-2.5 shadow-glow-accent btn-magnetic"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>LECTURE</span>
              </>
            )}
          </button>
        </div>

        {/* Solfège Notation & Non-Reader Mode */}
        <div className="flex items-center gap-3">
          <button
            onClick={onAssistedModeToggle}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              assistedMode 
                ? "bg-cyan-neon/20 text-cyan-neon border border-cyan-neon/40 shadow-glow-cyan" 
                : "bg-surface-50 text-gray-400 border border-border-subtle hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Mode Non-Lecteur</span>
          </button>

          <button
            onClick={onSolfegeToggle}
            className="px-4 py-2.5 rounded-2xl bg-surface-50 border border-border-subtle text-xs font-mono font-semibold text-gray-300 hover:text-white flex items-center gap-2 transition-colors"
          >
            <Languages className="w-4 h-4 text-accent" />
            <span>{solfegeNotation === 'latin' ? "Solfège (Do-Ré-Mi)" : "Anglo-Saxon (C-D-E)"}</span>
          </button>
        </div>

        {/* Tempo Multiplier & Volume Fader */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-surface-50 border border-border-subtle rounded-2xl p-1">
            <Gauge className="w-3.5 h-3.5 text-accent ml-2" />
            {[1.0, 1.15, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => onTempoChange(speed)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono transition-colors ${
                  tempoMultiplier === speed
                    ? "bg-accent text-white font-bold shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {speed === 1.0 ? "140 BPM" : `${Math.round(140 * speed)} BPM`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-surface-50 border border-border-subtle px-3 py-2 rounded-2xl">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-gray-400 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-20 accent-accent cursor-pointer h-1.5 bg-surface-200 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
