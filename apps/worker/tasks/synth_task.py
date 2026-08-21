import os
import logging
from pathlib import Path
from apps.worker.celery_app import celery_app
from packages.music_parser.src.xml_parser import MusicScoreParser
from packages.audio_synth.src.synth_renderer import AudioSynthesizer

logger = logging.getLogger("worker.synth")


@celery_app.task(name="tasks.synth_task", bind=True)
def synth_task(self, score_id: str, musicxml_path: str, output_audio_dir: str):
    """
    Tâche asynchrone :
    1. Parse le MusicXML
    2. Exporte le MIDI global + MIDI par voix séparée
    3. Effectue le rendu audio FluidSynth (WAV -> MP3)
    """
    logger.info(f"Démarrage tâche de synthèse audio pour la partition {score_id}")
    out_dir = Path(output_audio_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    parser = MusicScoreParser(musicxml_path)
    synth = AudioSynthesizer()

    # 1. Rendu global (toutes les voix réunies)
    full_midi_path = str(out_dir / f"{score_id}_full.mid")
    full_wav_path = str(out_dir / f"{score_id}_full.wav")
    full_mp3_path = str(out_dir / f"{score_id}_full.mp3")

    parser.export_full_score_to_midi(full_midi_path)
    synth.render_midi_to_wav(full_midi_path, full_wav_path)
    synth.convert_wav_to_mp3(full_wav_path, full_mp3_path)

    # 2. Rendu par voix / instrument isolé
    parts_data = parser.extract_parts_and_notes()
    renders = [{"part_id": None, "type": "global", "file_url": full_mp3_path}]

    for idx, part in enumerate(parts_data):
        part_midi = str(out_dir / f"{score_id}_part_{idx}.mid")
        part_wav = str(out_dir / f"{score_id}_part_{idx}.wav")
        part_mp3 = str(out_dir / f"{score_id}_part_{idx}.mp3")

        parser.export_part_to_midi(idx, part_midi)
        synth.render_midi_to_wav(part_midi, part_wav)
        synth.convert_wav_to_mp3(part_wav, part_mp3)

        renders.append({
            "part_index": idx,
            "part_name": part["name"],
            "type": "isolated",
            "file_url": part_mp3
        })

    logger.info(f"Synthèse terminée pour {score_id}, {len(renders)} fichiers audio générés.")
    return {"score_id": score_id, "renders": renders}
