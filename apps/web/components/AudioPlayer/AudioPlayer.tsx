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
  SlidersHorizontal 
} from "lucide-react";

interface AudioPlayerProps {
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
}

export function AudioPlayer({
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
  onAssistedModeToggle
}: AudioPlayerProps) {
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}.${ms}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-surface-100 rounded-2xl border border-border-subtle p-6 shadow-card space-y-5">
      {/* Progress Timeline Scrubber */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-mono text-gray-400">
          <span className="text-accent font-semibold">{formatTime(currentTime)}</span>
          <span className="text-gray-500">{formatTime(duration)}</span>
        </div>
        <div 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            onSeek(clickPos * duration);
          }}
          className="h-2.5 bg-surface-50 rounded-full cursor-pointer relative overflow-hidden group border border-border-subtle"
        >
          {/* Active progress */}
          <div 
            style={{ width: `${progressPercent}%` }} 
            className="h-full bg-gradient-to-r from-accent to-cyan-neon rounded-full relative transition-all duration-75"
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-glow-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>

      {/* Main Playback Bar Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
        {/* Left: Playback Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="p-2.5 rounded-xl bg-surface-50 border border-border-subtle text-gray-400 hover:text-white transition-colors"
            title="Revenir au début"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={onPlayToggle}
            className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold flex items-center gap-2 shadow-glow-accent btn-magnetic"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Lecture</span>
              </>
            )}
          </button>
        </div>

        {/* Center: Pedagogy & Notation Modifiers */}
        <div className="flex items-center gap-3">
          {/* Mode Assisté (Non-Lecteur) */}
          <button
            onClick={onAssistedModeToggle}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              assistedMode 
                ? "bg-cyan-neon/15 text-cyan-neon border border-cyan-neon/30 shadow-glow-cyan" 
                : "bg-surface-50 text-gray-400 border border-border-subtle hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mode Non-Lecteur</span>
          </button>

          {/* Notation Toggle: Do-Ré-Mi vs C-D-E */}
          <button
            onClick={onSolfegeToggle}
            className="px-3.5 py-2 rounded-xl bg-surface-50 border border-border-subtle text-xs font-mono font-medium text-gray-300 hover:text-white flex items-center gap-2"
          >
            <Languages className="w-3.5 h-3.5 text-accent" />
            <span>{solfegeNotation === 'latin' ? "Solfège (Do-Ré-Mi)" : "Anglo-Saxon (C-D-E)"}</span>
          </button>
        </div>

        {/* Right: Tempo Multiplier & Volume */}
        <div className="flex items-center gap-4">
          {/* Speed / Tempo */}
          <div className="flex items-center gap-1.5 bg-surface-50 border border-border-subtle rounded-xl p-1">
            <Gauge className="w-3.5 h-3.5 text-gray-400 ml-2" />
            {[0.75, 1.0, 1.25].map((speed) => (
              <button
                key={speed}
                onClick={() => onTempoChange(speed)}
                className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                  tempoMultiplier === speed
                    ? "bg-accent text-white font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
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
              className="w-20 accent-accent cursor-pointer h-1.5 bg-surface-50 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
