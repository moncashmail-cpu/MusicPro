/**
 * MusikPro - Shared TypeScript Types
 * Synchronized with Database Schema & API Contracts
 */

export type UserRole = 'musicien' | 'debutant' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export type ScoreStatus = 'uploaded' | 'processing' | 'omr_done' | 'synth_done' | 'ready' | 'failed';

export interface Score {
  id: string;
  user_id?: string;
  title: string;
  original_file_url?: string;
  musicxml_url?: string;
  status: ScoreStatus;
  composer?: string;
  key_signature?: string;
  time_signature?: string;
  tempo?: number;
  created_at: string;
  parts?: Part[];
  audio_renders?: AudioRender[];
}

export interface Part {
  id: string;
  score_id: string;
  name: string; // "Violon I", "Basse", "Voix", "Soprano"
  instrument?: string;
  midi_program?: number;
  order_index: number;
  notes?: Note[];
}

export interface Note {
  id: string;
  part_id: string;
  measure_number: number;
  pitch: string; // "C4", "F#5", "A3"
  duration_beats: number;
  start_time_seconds: number;
  end_time_seconds: number;
  is_rest: boolean;
  tie_type?: 'start' | 'stop' | 'continue';
  solfege_name_fr?: string; // "Do4", "Fa#5", "La3"
}

export type AudioFormat = 'mp3' | 'wav';

export interface AudioRender {
  id: string;
  score_id: string;
  part_id?: string | null; // NULL = Full ensemble render
  file_url: string;
  format: AudioFormat;
  duration_seconds: number;
  created_at: string;
}

export type ProcessingJobType = 'omr' | 'synthesis' | 'sync';
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ProcessingJob {
  id: string;
  score_id: string;
  type: ProcessingJobType;
  status: JobStatus;
  error_message?: string;
  started_at?: string;
  finished_at?: string;
}

export interface ScoreUploadResponse {
  score_id: string;
  title: string;
  status: ScoreStatus;
  message: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  tempoMultiplier: number;
  activePartId: string | null; // null = all parts
  isSolo: boolean;
  isMuted: boolean;
  volume: number;
  solfegeNotation: 'latin' | 'anglosaxon'; // 'latin' (Do Ré Mi) or 'anglosaxon' (C D E)
  assistedMode: boolean; // Note highlight & pedagogy mode
}
