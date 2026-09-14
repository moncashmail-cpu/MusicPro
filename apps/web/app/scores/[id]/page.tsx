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
  Headphones,
  Volume2,
  Mic2,
  Play,
  Gauge
} from "lucide-react";
import Link from "next/link";
import { ScoreViewer, NoteItem } from "@/components/ScoreViewer/ScoreViewer";
import { ProAudioPlayer } from "@/components/AudioPlayer/ProAudioPlayer";
import { ProSatbMixer, PartItem } from "@/components/PartSelector/ProSatbMixer";
import { scoreAudioPlayer } from "@/lib/audioEngine";

import { ScoreManager, DynamicScore } from "@/lib/scoreManager";

export default function ScoreStudioPage() {
  const params = useParams();
  const scoreId = (params?.id as string) || "demo-score";

  const [activeScore, setActiveScore] = useState<DynamicScore | null>(null);

  // Exact 140 BPM Timings : 1 beat = 0.4285s | 1/2 beat (croche) = 0.214s | 1/4 beat = 0.107s
  const defaultScoreData: DynamicScore = {
    id: "demo-score",
    title: "L'AUBE NOUVELLE (Hymne national du Bénin)",
    composer: "Abbé Gilbert DAGNON • Harm. G. J. L. SOWADAN (17 mai 1994)",
    tempo: 140, // ♩ = 140 Avec entrain
    key_signature: "Sol Majeur (1♯ Fa#)",
    time_signature: "4/4",
    duration: 67.5,
    parts: [
      { id: "part-soprano", name: "Soprano (Hampes ↑)", type: "soprano" as const, instrument: "Voix Aiguë", midi_program: 53, order_index: 0 },
      { id: "part-alto", name: "Alto (Hampes ↓)", type: "alto" as const, instrument: "Voix Médium", midi_program: 53, order_index: 1 },
      { id: "part-tenor", name: "Ténor (Hampes ↑)", type: "tenor" as const, instrument: "Voix Médium-Grave", midi_program: 53, order_index: 2 },
      { id: "part-bass", name: "Basse (Hampes ↓)", type: "bass" as const, instrument: "Voix Grave", midi_program: 53, order_index: 3 },
    ],
    notes: [
      // Soprano 140 BPM
      { id: "s1", part_id: "part-soprano", measure_number: 1, pitch: "D4", solfege_name_fr: "Ré4", lyric: "En-", duration_beats: 0.5, start_time_seconds: 0.0, end_time_seconds: 0.21, is_rest: false, stem: 'up' as const },
      { id: "s2", part_id: "part-soprano", measure_number: 1, pitch: "D4", solfege_name_fr: "Ré4", lyric: "fants", duration_beats: 0.5, start_time_seconds: 0.21, end_time_seconds: 0.43, is_rest: false, stem: 'up' },
      { id: "s3", part_id: "part-soprano", measure_number: 1, pitch: "G4", solfege_name_fr: "Sol4", lyric: "du", duration_beats: 1, start_time_seconds: 0.43, end_time_seconds: 0.86, is_rest: false, stem: 'up' },
      { id: "s4", part_id: "part-soprano", measure_number: 2, pitch: "B4", solfege_name_fr: "Si4", lyric: "Bé-", duration_beats: 1, start_time_seconds: 0.86, end_time_seconds: 1.28, is_rest: false, stem: 'up' },
      { id: "s5", part_id: "part-soprano", measure_number: 2, pitch: "G4", solfege_name_fr: "Sol4", lyric: "nin", duration_beats: 1, start_time_seconds: 1.28, end_time_seconds: 1.71, is_rest: false, stem: 'up' },
      { id: "s6", part_id: "part-soprano", measure_number: 2, pitch: "A4", solfege_name_fr: "La4", lyric: "de-", duration_beats: 0.75, start_time_seconds: 1.71, end_time_seconds: 2.03, is_rest: false, stem: 'up' },
      { id: "s7", part_id: "part-soprano", measure_number: 2, pitch: "B4", solfege_name_fr: "Si4", lyric: "bout", duration_beats: 0.25, start_time_seconds: 2.03, end_time_seconds: 2.14, is_rest: false, stem: 'up' },
      { id: "s8", part_id: "part-soprano", measure_number: 3, pitch: "C5", solfege_name_fr: "Do5", lyric: "la", duration_beats: 1, start_time_seconds: 2.14, end_time_seconds: 2.57, is_rest: false, stem: 'up' },
      { id: "s9", part_id: "part-soprano", measure_number: 3, pitch: "B4", solfege_name_fr: "Si4", lyric: "li-", duration_beats: 1, start_time_seconds: 2.57, end_time_seconds: 3.00, is_rest: false, stem: 'up' },
      { id: "s10", part_id: "part-soprano", measure_number: 3, pitch: "A4", solfege_name_fr: "La4", lyric: "ber-", duration_beats: 1, start_time_seconds: 3.00, end_time_seconds: 3.43, is_rest: false, stem: 'up' },
      { id: "s11", part_id: "part-soprano", measure_number: 4, pitch: "G4", solfege_name_fr: "Sol4", lyric: "té !", duration_beats: 2, start_time_seconds: 3.43, end_time_seconds: 4.50, is_rest: false, stem: 'up' },

      // Alto
      { id: "a1", part_id: "part-alto", measure_number: 1, pitch: "B3", solfege_name_fr: "Si3", lyric: "En-", duration_beats: 0.5, start_time_seconds: 0.0, end_time_seconds: 0.21, is_rest: false, stem: 'down' },
      { id: "a2", part_id: "part-alto", measure_number: 1, pitch: "B3", solfege_name_fr: "Si3", lyric: "fants", duration_beats: 0.5, start_time_seconds: 0.21, end_time_seconds: 0.43, is_rest: false, stem: 'down' },
      { id: "a3", part_id: "part-alto", measure_number: 1, pitch: "D4", solfege_name_fr: "Ré4", lyric: "du", duration_beats: 1, start_time_seconds: 0.43, end_time_seconds: 0.86, is_rest: false, stem: 'down' },
      { id: "a4", part_id: "part-alto", measure_number: 2, pitch: "G4", solfege_name_fr: "Sol4", lyric: "Bé-", duration_beats: 1, start_time_seconds: 0.86, end_time_seconds: 1.28, is_rest: false, stem: 'down' },
      { id: "a5", part_id: "part-alto", measure_number: 2, pitch: "D4", solfege_name_fr: "Ré4", lyric: "nin", duration_beats: 1, start_time_seconds: 1.28, end_time_seconds: 1.71, is_rest: false, stem: 'down' },
      { id: "a6", part_id: "part-alto", measure_number: 2, pitch: "F#4", solfege_name_fr: "Fa#4", lyric: "de-", duration_beats: 0.75, start_time_seconds: 1.71, end_time_seconds: 2.03, is_rest: false, stem: 'down' },
      { id: "a7", part_id: "part-alto", measure_number: 2, pitch: "G4", solfege_name_fr: "Sol4", lyric: "bout", duration_beats: 0.25, start_time_seconds: 2.03, end_time_seconds: 2.14, is_rest: false, stem: 'down' },
      { id: "a8", part_id: "part-alto", measure_number: 3, pitch: "E4", solfege_name_fr: "Mi4", lyric: "la", duration_beats: 1, start_time_seconds: 2.14, end_time_seconds: 2.57, is_rest: false, stem: 'down' },
      { id: "a9", part_id: "part-alto", measure_number: 3, pitch: "G4", solfege_name_fr: "Sol4", lyric: "li-", duration_beats: 1, start_time_seconds: 2.57, end_time_seconds: 3.00, is_rest: false, stem: 'down' },
      { id: "a10", part_id: "part-alto", measure_number: 3, pitch: "F#4", solfege_name_fr: "Fa#4", lyric: "ber-", duration_beats: 1, start_time_seconds: 3.00, end_time_seconds: 3.43, is_rest: false, stem: 'down' },
      { id: "a11", part_id: "part-alto", measure_number: 4, pitch: "D4", solfege_name_fr: "Ré4", lyric: "té !", duration_beats: 2, start_time_seconds: 3.43, end_time_seconds: 4.50, is_rest: false, stem: 'down' },

      // Tenor
      { id: "t1", part_id: "part-tenor", measure_number: 1, pitch: "G3", solfege_name_fr: "Sol3", lyric: "En-", duration_beats: 0.5, start_time_seconds: 0.0, end_time_seconds: 0.21, is_rest: false, stem: 'up' },
      { id: "t2", part_id: "part-tenor", measure_number: 1, pitch: "G3", solfege_name_fr: "Sol3", lyric: "fants", duration_beats: 0.5, start_time_seconds: 0.21, end_time_seconds: 0.43, is_rest: false, stem: 'up' },
      { id: "t3", part_id: "part-tenor", measure_number: 1, pitch: "B3", solfege_name_fr: "Si3", lyric: "du", duration_beats: 1, start_time_seconds: 0.43, end_time_seconds: 0.86, is_rest: false, stem: 'up' },
      { id: "t4", part_id: "part-tenor", measure_number: 2, pitch: "D4", solfege_name_fr: "Ré4", lyric: "Bé-", duration_beats: 1, start_time_seconds: 0.86, end_time_seconds: 1.28, is_rest: false, stem: 'up' },
      { id: "t5", part_id: "part-tenor", measure_number: 2, pitch: "B3", solfege_name_fr: "Si3", lyric: "nin", duration_beats: 1, start_time_seconds: 1.28, end_time_seconds: 1.71, is_rest: false, stem: 'up' },
      { id: "t6", part_id: "part-tenor", measure_number: 2, pitch: "D4", solfege_name_fr: "Ré4", lyric: "de-", duration_beats: 0.75, start_time_seconds: 1.71, end_time_seconds: 2.03, is_rest: false, stem: 'up' },
      { id: "t7", part_id: "part-tenor", measure_number: 2, pitch: "D4", solfege_name_fr: "Ré4", lyric: "bout", duration_beats: 0.25, start_time_seconds: 2.03, end_time_seconds: 2.14, is_rest: false, stem: 'up' },
      { id: "t8", part_id: "part-tenor", measure_number: 3, pitch: "C4", solfege_name_fr: "Do4", lyric: "la", duration_beats: 1, start_time_seconds: 2.14, end_time_seconds: 2.57, is_rest: false, stem: 'up' },
      { id: "t9", part_id: "part-tenor", measure_number: 3, pitch: "D4", solfege_name_fr: "Ré4", lyric: "li-", duration_beats: 1, start_time_seconds: 2.57, end_time_seconds: 3.00, is_rest: false, stem: 'up' },
      { id: "t10", part_id: "part-tenor", measure_number: 3, pitch: "C4", solfege_name_fr: "Do4", lyric: "ber-", duration_beats: 1, start_time_seconds: 3.00, end_time_seconds: 3.43, is_rest: false, stem: 'up' },
      { id: "t11", part_id: "part-tenor", measure_number: 4, pitch: "B3", solfege_name_fr: "Si3", lyric: "té !", duration_beats: 2, start_time_seconds: 3.43, end_time_seconds: 4.50, is_rest: false, stem: 'up' },

      // Bass
      { id: "b1", part_id: "part-bass", measure_number: 1, pitch: "G2", solfege_name_fr: "Sol2", lyric: "En-", duration_beats: 0.5, start_time_seconds: 0.0, end_time_seconds: 0.21, is_rest: false, stem: 'down' },
      { id: "b2", part_id: "part-bass", measure_number: 1, pitch: "G2", solfege_name_fr: "Sol2", lyric: "fants", duration_beats: 0.5, start_time_seconds: 0.21, end_time_seconds: 0.43, is_rest: false, stem: 'down' },
      { id: "b3", part_id: "part-bass", measure_number: 1, pitch: "G2", solfege_name_fr: "Sol2", lyric: "du", duration_beats: 1, start_time_seconds: 0.43, end_time_seconds: 0.86, is_rest: false, stem: 'down' },
      { id: "b4", part_id: "part-bass", measure_number: 2, pitch: "G2", solfege_name_fr: "Sol2", lyric: "Bé-", duration_beats: 1, start_time_seconds: 0.86, end_time_seconds: 1.28, is_rest: false, stem: 'down' },
      { id: "b5", part_id: "part-bass", measure_number: 2, pitch: "B2", solfege_name_fr: "Si2", lyric: "nin", duration_beats: 1, start_time_seconds: 1.28, end_time_seconds: 1.71, is_rest: false, stem: 'down' },
      { id: "b6", part_id: "part-bass", measure_number: 2, pitch: "D3", solfege_name_fr: "Ré3", lyric: "de-", duration_beats: 0.75, start_time_seconds: 1.71, end_time_seconds: 2.03, is_rest: false, stem: 'down' },
      { id: "b7", part_id: "part-bass", measure_number: 2, pitch: "D3", solfege_name_fr: "Ré3", lyric: "bout", duration_beats: 0.25, start_time_seconds: 2.03, end_time_seconds: 2.14, is_rest: false, stem: 'down' },
      { id: "b8", part_id: "part-bass", measure_number: 3, pitch: "C3", solfege_name_fr: "Do3", lyric: "la", duration_beats: 1, start_time_seconds: 2.14, end_time_seconds: 2.57, is_rest: false, stem: 'down' },
      { id: "b9", part_id: "part-bass", measure_number: 3, pitch: "G2", solfege_name_fr: "Sol2", lyric: "li-", duration_beats: 1, start_time_seconds: 2.57, end_time_seconds: 3.00, is_rest: false, stem: 'down' },
      { id: "b10", part_id: "part-bass", measure_number: 3, pitch: "D3", solfege_name_fr: "Ré3", lyric: "ber-", duration_beats: 1, start_time_seconds: 3.00, end_time_seconds: 3.43, is_rest: false, stem: 'down' },
      { id: "b11", part_id: "part-bass", measure_number: 4, pitch: "G2", solfege_name_fr: "Sol2", lyric: "té !", duration_beats: 2, start_time_seconds: 3.43, end_time_seconds: 4.50, is_rest: false, stem: 'down' },
    ]
  };

  useEffect(() => {
    if (scoreId && scoreId !== "demo-score") {
      const dynamic = ScoreManager.getScoreById(scoreId);
      if (dynamic) {
        setActiveScore(dynamic);
      }
    }
  }, [scoreId]);

  const scoreData = activeScore || defaultScoreData;

  // Playback & Audio Engine States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [tempoMultiplier, setTempoMultiplier] = useState<number>(1.0);
  const [activePartId, setActivePartId] = useState<string | null>(null);
  const [solfegeNotation, setSolfegeNotation] = useState<'latin' | 'anglosaxon'>('latin');
  const [assistedMode, setAssistedMode] = useState<boolean>(true);
  const [audioMode, setAudioMode] = useState<'real_audio' | 'satb_synth'>('real_audio');
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [metronomeActive, setMetronomeActive] = useState<boolean>(false);

  const playedNotesRef = useRef<Set<string>>(new Set());
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  // Audio Mode 1 : Real Studio Choral Audio Element
  useEffect(() => {
    const audio = new Audio("/audio/aube.mp3");
    audio.preload = "auto";
    audioElRef.current = audio;

    audio.onended = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [isLooping]);

  // Audio Playback Synchronization Loop
  useEffect(() => {
    const audio = audioElRef.current;

    if (isPlaying) {
      if (audioMode === 'real_audio' && audio) {
        audio.playbackRate = tempoMultiplier;
        audio.currentTime = currentTime;
        audio.play().catch(e => console.log("Audio play allowed on user click:", e));
      } else {
        if (audio) audio.pause();
        scoreAudioPlayer.init();
      }

      lastTimeRef.current = performance.now();

      const loop = (now: number) => {
        if (lastTimeRef.current !== undefined) {
          const delta = (now - lastTimeRef.current) / 1000;
          
          setCurrentTime((prevTime) => {
            let nextTime = prevTime + delta * tempoMultiplier;

            if (audioMode === 'real_audio' && audio && !audio.paused && audio.currentTime > 0) {
              nextTime = audio.currentTime;
            } else if (audioMode === 'satb_synth') {
              // Trigger notes in SATB synthesis engine
              scoreData.notes.forEach((note: NoteItem) => {
                if (
                  note.id &&
                  !note.is_rest &&
                  !playedNotesRef.current.has(note.id) &&
                  prevTime <= note.start_time_seconds &&
                  nextTime >= note.start_time_seconds
                ) {
                  if (activePartId === null || activePartId === note.part_id) {
                    const voiceType = (note.part_id || "").replace("part-", "");
                    const dur = (note.end_time_seconds - note.start_time_seconds) / tempoMultiplier;
                    scoreAudioPlayer.playNote(note.pitch, dur, voiceType);
                  }
                  playedNotesRef.current.add(note.id);
                }
              });
            }

            if (nextTime >= scoreData.duration) {
              if (isLooping) {
                playedNotesRef.current.clear();
                return 0;
              }
              setIsPlaying(false);
              playedNotesRef.current.clear();
              return 0;
            }
            return nextTime;
          });
        }
        lastTimeRef.current = now;
        requestRef.current = requestAnimationFrame(loop);
      };
      requestRef.current = requestAnimationFrame(loop);
    } else {
      if (audio) audio.pause();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, tempoMultiplier, activePartId, audioMode, isLooping, scoreData.duration, scoreData.notes]);

  const handlePlayToggle = () => {
    if (!isPlaying) {
      scoreAudioPlayer.init();
      if (currentTime === 0) {
        playedNotesRef.current.clear();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (audioElRef.current) {
      audioElRef.current.currentTime = time;
    }
    playedNotesRef.current = new Set(
      scoreData.notes
        .filter((n) => n.start_time_seconds < time && n.id)
        .map((n) => n.id as string)
    );
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioElRef.current) {
      audioElRef.current.currentTime = 0;
      audioElRef.current.pause();
    }
    playedNotesRef.current.clear();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Studio Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border-subtle pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-3 rounded-2xl bg-surface-100 border border-border-subtle text-gray-400 hover:text-white hover:border-border-strong transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{scoreData.title}</h1>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{audioMode === 'real_audio' ? "ENREGISTREMENT CHORAL PRO" : "SYNTHÈSE MULTI-VOIX SATB"}</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-1">
              {scoreData.composer} • 4/4 • ♩ = {scoreData.tempo} BPM (Avec entrain) • Sol Majeur (1♯)
            </p>
          </div>
        </div>

        {/* Action Downloads */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert("Téléchargement du fichier MusicXML en cours...")}
            className="px-4 py-2.5 rounded-2xl bg-surface-100 border border-border-subtle text-xs font-bold text-gray-300 hover:text-white flex items-center gap-2 transition-all hover:bg-surface-50"
          >
            <FileCode className="w-4 h-4 text-accent" />
            <span>MusicXML</span>
          </button>
          <a
            href="/audio/aube.mp3"
            download="L_Aube_Nouvelle_SATB.mp3"
            className="px-4 py-2.5 rounded-2xl bg-surface-100 border border-border-subtle text-xs font-bold text-gray-300 hover:text-white flex items-center gap-2 transition-all hover:bg-surface-50"
          >
            <Download className="w-4 h-4 text-cyan-neon" />
            <span>Audio Master HD (.mp3)</span>
          </a>
        </div>
      </div>

      {/* Main Studio Grid: Score Viewer on Left / Multi-track Console on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Interactive Score Viewer (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <ScoreViewer
            currentTime={currentTime}
            allNotes={scoreData.notes}
            assistedMode={assistedMode}
            solfegeNotation={solfegeNotation}
            tempo={Math.round(scoreData.tempo * tempoMultiplier)}
            activePartId={activePartId}
            scoreTitle={scoreData.title}
            composer={scoreData.composer}
          />

          {/* Master DAW Audio Controller */}
          <ProAudioPlayer
            duration={scoreData.duration}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onPlayToggle={handlePlayToggle}
            onSeek={handleSeek}
            onReset={handleReset}
            tempoMultiplier={tempoMultiplier}
            onTempoChange={(m) => setTempoMultiplier(m)}
            solfegeNotation={solfegeNotation}
            onSolfegeToggle={() => setSolfegeNotation(solfegeNotation === 'latin' ? 'anglosaxon' : 'latin')}
            assistedMode={assistedMode}
            onAssistedModeToggle={() => setAssistedMode(!assistedMode)}
            audioMode={audioMode}
            onAudioModeChange={(m) => {
              setAudioMode(m);
              playedNotesRef.current.clear();
            }}
            isLooping={isLooping}
            onLoopToggle={() => setIsLooping(!isLooping)}
            metronomeActive={metronomeActive}
            onMetronomeToggle={() => setMetronomeActive(!metronomeActive)}
          />
        </div>

        {/* Right Side: Professional SATB Mixer Console */}
        <div className="space-y-6">
          <ProSatbMixer
            parts={scoreData.parts}
            activePartId={activePartId}
            onSelectPart={(id) => {
              setActivePartId(id);
              playedNotesRef.current.clear();
            }}
            isPlaying={isPlaying}
          />

          {/* Info Card: CamScanner & Choral Format Specs */}
          <div className="bg-surface-100 rounded-3xl border border-border-strong p-6 shadow-card space-y-3 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-cyan-neon text-xs font-extrabold font-mono">
              <Sparkles className="w-4 h-4" />
              <span>SPÉCIFICATION STUDIO CHORAL</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              La restitution audio s'adapte à votre mode de travail :
            </p>
            <ul className="text-xs text-gray-400 space-y-2 font-mono">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                <span><strong>Enregistrement Choral Pro</strong> : écoutez l'interprétation vocale d'ensemble authentique.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-neon"></span>
                <span><strong>Synthèse Multi-Voix</strong> : isolez votre voix en SOLO pour répéter votre partition.</span>
              </li>
            </ul>
            <div className="pt-2 border-t border-border-subtle flex justify-between items-center text-[10px] font-mono text-gray-500">
              <span>Source : aube.mpeg (1.08 MB)</span>
              <span>140 BPM (Avec entrain) • Sol Majeur</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
