-- ==============================================================================
-- MUSIKPRO - SCHÉMA DE BASE DE DONNÉES SUPABASE (PostgreSQL)
-- Architecture : OMR, Séparation des voix, Synthèse audio & Lecture assistée
-- ==============================================================================

-- Activer l'extension UUID si non présente
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLE : users (Profils & Rôles)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'debutant' CHECK (role IN ('musicien', 'debutant', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLE : scores (Partitions uploadées et métadonnées globales)
CREATE TABLE IF NOT EXISTS public.scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    original_file_url TEXT,
    musicxml_url TEXT,
    status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'omr_done', 'synth_done', 'ready', 'failed')),
    composer TEXT,
    key_signature TEXT,
    time_signature TEXT,
    tempo INT DEFAULT 120,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour recherches rapides de partitions
CREATE INDEX IF NOT EXISTS idx_scores_user_id ON public.scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_status ON public.scores(status);

-- 3. TABLE : parts (Voix / instruments extraits)
CREATE TABLE IF NOT EXISTS public.parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    score_id UUID NOT NULL REFERENCES public.scores(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- Ex: "Violon I", "Basse", "Voix Soprano"
    instrument TEXT,
    midi_program INT DEFAULT 1,
    order_index INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_parts_score_id ON public.parts(score_id);

-- 4. TABLE : notes (Pour surlignage temps réel et pédagogie pour non-lecteurs)
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_id UUID NOT NULL REFERENCES public.parts(id) ON DELETE CASCADE,
    measure_number INT NOT NULL,
    pitch TEXT NOT NULL, -- Ex: "C4", "F#5"
    solfege_name_fr TEXT, -- Ex: "Do4", "Fa#5"
    duration_beats FLOAT NOT NULL,
    start_time_seconds FLOAT NOT NULL, -- Timestamp précis dans l'audio
    end_time_seconds FLOAT NOT NULL,
    is_rest BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_notes_part_id ON public.notes(part_id);
CREATE INDEX IF NOT EXISTS idx_notes_timing ON public.notes(start_time_seconds, end_time_seconds);

-- 5. TABLE : audio_renders (Fichiers audio générés global et par voix)
CREATE TABLE IF NOT EXISTS public.audio_renders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    score_id UUID NOT NULL REFERENCES public.scores(id) ON DELETE CASCADE,
    part_id UUID REFERENCES public.parts(id) ON DELETE CASCADE, -- NULL = Rendu global harmonie
    file_url TEXT NOT NULL,
    format TEXT DEFAULT 'mp3' CHECK (format IN ('mp3', 'wav')),
    duration_seconds FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audio_renders_score_id ON public.audio_renders(score_id);

-- 6. TABLE : processing_jobs (Traçabilité pipeline OMR & Synthèse)
CREATE TABLE IF NOT EXISTS public.processing_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    score_id UUID NOT NULL REFERENCES public.scores(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('omr', 'synthesis', 'sync')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    finished_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_jobs_score_id ON public.processing_jobs(score_id);

-- ==============================================================================
-- BUCKETS DE STOCKAGE SUPABASE (Storage)
-- ==============================================================================

-- Insertion des buckets publics dans storage.buckets si non existants
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('scores-source', 'scores-source', true),
    ('scores-musicxml', 'scores-musicxml', true),
    ('scores-audio', 'scores-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques de lecture publique pour les médias générés
CREATE POLICY "Public Read Access Scores Source" ON storage.objects FOR SELECT USING (bucket_id = 'scores-source');
CREATE POLICY "Public Read Access MusicXML" ON storage.objects FOR SELECT USING (bucket_id = 'scores-musicxml');
CREATE POLICY "Public Read Access Audio Renders" ON storage.objects FOR SELECT USING (bucket_id = 'scores-audio');
CREATE POLICY "Allow Authenticated Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('scores-source', 'scores-musicxml', 'scores-audio'));

-- ==============================================================================
-- RLS (Row Level Security) POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_renders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour la démo / utilisateurs autorisés
CREATE POLICY "Allow public read on scores" ON public.scores FOR SELECT USING (true);
CREATE POLICY "Allow public insert on scores" ON public.scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on scores" ON public.scores FOR UPDATE USING (true);

CREATE POLICY "Allow public read on parts" ON public.parts FOR SELECT USING (true);
CREATE POLICY "Allow public insert on parts" ON public.parts FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on notes" ON public.notes FOR SELECT USING (true);
CREATE POLICY "Allow public insert on notes" ON public.notes FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on audio_renders" ON public.audio_renders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on audio_renders" ON public.audio_renders FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on processing_jobs" ON public.processing_jobs FOR SELECT USING (true);
CREATE POLICY "Allow public insert on processing_jobs" ON public.processing_jobs FOR INSERT WITH CHECK (true);
