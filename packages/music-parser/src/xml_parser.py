"""
MusicXML Parser & Extractor using music21
Extracts metadata, voices/parts, notes with precise onset/offset seconds and French solfège notation.
"""
import logging
from typing import Dict, List, Any, Optional
from pathlib import Path
import music21 as m21

logger = logging.getLogger("music-parser")

SOLFEGE_MAP = {
    "C": "Do",
    "D": "Ré",
    "E": "Mi",
    "F": "Fa",
    "G": "Sol",
    "A": "La",
    "B": "Si"
}

ACCIDENTAL_MAP = {
    "sharp": "#",
    "flat": "b",
    "double-sharp": "##",
    "double-flat": "bb",
    "natural": "",
    None: ""
}


def pitch_to_solfege_fr(pitch_obj: m21.pitch.Pitch) -> str:
    """Convertit un Pitch music21 (ex: F#4) en solfège français (Fa#4)."""
    step = SOLFEGE_MAP.get(pitch_obj.step, pitch_obj.step)
    acc = ""
    if pitch_obj.accidental:
        acc = ACCIDENTAL_MAP.get(pitch_obj.accidental.name, pitch_obj.accidental.modifier)
    return f"{step}{acc}{pitch_obj.octave or ''}"


class MusicScoreParser:
    """Analyse un fichier MusicXML et extrait sa structure fine pour la base de données et le player."""

    def __init__(self, xml_path: str):
        self.xml_path = Path(xml_path)
        if not self.xml_path.exists():
            raise FileNotFoundError(f"Fichier MusicXML introuvable: {xml_path}")
        self.score: m21.stream.Score = m21.converter.parse(str(self.xml_path))

    def get_metadata(self) -> Dict[str, Any]:
        """Extrait les métadonnées globales de la partition."""
        title = "Sans Titre"
        composer = "Inconnu"
        
        if self.score.metadata:
            title = self.score.metadata.title or self.score.metadata.movementName or title
            composer = self.score.metadata.composer or composer

        # Détection du tempo (BPM)
        tempo = 120
        metronome_marks = self.score.flatten().getElementsByClass(m21.tempo.MetronomeMark)
        if metronome_marks:
            tempo = int(metronome_marks[0].number or 120)

        # Tonalité (Key Signature)
        key_str = "C Major"
        keys = self.score.flatten().getElementsByClass(m21.key.KeySignature)
        if keys:
            key_str = keys[0].asKey().name if hasattr(keys[0], "asKey") else str(keys[0])

        # Chiffrage (Time Signature)
        time_str = "4/4"
        time_sigs = self.score.flatten().getElementsByClass(m21.meter.TimeSignature)
        if time_sigs:
            time_str = time_sigs[0].ratioString

        return {
            "title": title,
            "composer": composer,
            "tempo": tempo,
            "key_signature": key_str,
            "time_signature": time_str,
            "duration_quarters": float(self.score.highestTime),
            "estimated_duration_seconds": (float(self.score.highestTime) / tempo) * 60.0
        }

    def extract_parts_and_notes(self) -> List[Dict[str, Any]]:
        """
        Extrait toutes les portées/parties ainsi que chaque note avec :
        - Hauteur (pitch anglo-saxon ex: C4, et français ex: Do4)
        - Numéro de mesure
        - Durée en temps (quarterLength)
        - Timestamp de début et de fin en secondes (start_time_seconds, end_time_seconds)
        - Gestion des silences (is_rest)
        """
        meta = self.get_metadata()
        tempo = meta["tempo"]
        seconds_per_quarter = 60.0 / tempo

        parts_data = []

        for idx, part in enumerate(self.score.parts):
            part_name = part.partName or f"Voix {idx + 1}"
            
            # Détection d'instrument / MIDI program
            midi_prog = 1 # Grand Piano par défaut
            inst = part.getInstrument()
            if inst and inst.midiProgram is not None:
                midi_prog = inst.midiProgram

            notes_list = []
            flat_part = part.flatten()

            for el in flat_part.notesAndRests:
                measure_num = el.measureNumber or (el.getContextByClass('Measure').number if el.getContextByClass('Measure') else 1)
                quarter_offset = float(el.offset)
                quarter_duration = float(el.quarterLength)
                
                start_sec = round(quarter_offset * seconds_per_quarter, 3)
                end_sec = round((quarter_offset + quarter_duration) * seconds_per_quarter, 3)

                if el.isRest:
                    notes_list.append({
                        "measure_number": measure_num,
                        "pitch": "Rest",
                        "solfege_name_fr": "Silence",
                        "duration_beats": quarter_duration,
                        "start_time_seconds": start_sec,
                        "end_time_seconds": end_sec,
                        "is_rest": True
                    })
                elif el.isChord:
                    # En cas d'accord, on peut sérialiser la note principale ou décomposer
                    for pitch_in_chord in el.pitches:
                        notes_list.append({
                            "measure_number": measure_num,
                            "pitch": pitch_in_chord.nameWithOctave,
                            "solfege_name_fr": pitch_to_solfege_fr(pitch_in_chord),
                            "duration_beats": quarter_duration,
                            "start_time_seconds": start_sec,
                            "end_time_seconds": end_sec,
                            "is_rest": False
                        })
                else:
                    # Note individuelle
                    notes_list.append({
                        "measure_number": measure_num,
                        "pitch": el.pitch.nameWithOctave,
                        "solfege_name_fr": pitch_to_solfege_fr(el.pitch),
                        "duration_beats": quarter_duration,
                        "start_time_seconds": start_sec,
                        "end_time_seconds": end_sec,
                        "is_rest": False
                    })

            parts_data.append({
                "name": part_name,
                "instrument": inst.instrumentName if inst else "Piano",
                "midi_program": midi_prog,
                "order_index": idx,
                "notes": notes_list
            })

        return parts_data

    def export_part_to_midi(self, part_index: int, output_midi_path: str) -> str:
        """Exporte une voix isolée spécifique au format MIDI."""
        if part_index >= len(self.score.parts):
            raise IndexError(f"Index de partie {part_index} invalide")
        part = self.score.parts[part_index]
        part.write('midi', fp=output_midi_path)
        return output_midi_path

    def export_full_score_to_midi(self, output_midi_path: str) -> str:
        """Exporte l'ensemble de la partition au format MIDI."""
        self.score.write('midi', fp=output_midi_path)
        return output_midi_path
