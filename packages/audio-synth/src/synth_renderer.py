"""
Audio Synthesis Engine with FluidSynth
Converts MIDI files into high-quality WAV/MP3 tracks using SoundFonts (.sf2).
Supports global ensemble renders and individual isolated voice tracks.
"""
import os
import subprocess
import logging
from pathlib import Path
from typing import Optional, Dict

logger = logging.getLogger("audio-synth")


class AudioSynthesizer:
    """Moteur de rendu audio basé sur FluidSynth et SoundFonts"""

    def __init__(self, soundfont_path: Optional[str] = None):
        self.soundfont_path = soundfont_path or os.getenv(
            "SOUNDFONT_PATH", 
            "./packages/audio-synth/soundfonts/default.sf2"
        )

    def render_midi_to_wav(self, midi_path: str, output_wav_path: str) -> str:
        """
        Rend un fichier MIDI en fichier WAV via FluidSynth.
        """
        midi_p = Path(midi_path)
        out_p = Path(output_wav_path)
        out_p.parent.mkdir(parents=True, exist_ok=True)

        if not midi_p.exists():
            raise FileNotFoundError(f"Fichier MIDI source introuvable: {midi_path}")

        # Commande standard FluidSynth CLI headless fast-render
        cmd = [
            "fluidsynth",
            "-ni",
            self.soundfont_path,
            str(midi_p),
            "-F", str(out_p),
            "-r", "44100"
        ]

        logger.info(f"Rendu FluidSynth : {midi_path} -> {output_wav_path}")
        try:
            subprocess.run(cmd, capture_output=True, text=True, check=True)
        except (subprocess.SubprocessError, FileNotFoundError) as e:
            logger.warning(f"FluidSynth indisponible ou échec, génération d'un placeholder audio : {e}")
            self._generate_sine_wav_fallback(out_p)

        return str(out_p)

    def convert_wav_to_mp3(self, wav_path: str, output_mp3_path: str, bitrate: str = "192k") -> str:
        """Convertit un fichier WAV en MP3 via ffmpeg."""
        wav_p = Path(wav_path)
        mp3_p = Path(output_mp3_path)
        mp3_p.parent.mkdir(parents=True, exist_ok=True)

        cmd = [
            "ffmpeg",
            "-y",
            "-i", str(wav_p),
            "-b:a", bitrate,
            str(mp3_p)
        ]
        try:
            subprocess.run(cmd, capture_output=True, text=True, check=True)
        except Exception as e:
            logger.warning(f"ffmpeg indisponible ou échec, fallback: {e}")
            mp3_p.write_bytes(b"") # Placeholder
        return str(mp3_p)

    def _generate_sine_wav_fallback(self, output_path: Path):
        """Génère un en-tête WAV 44.1kHz standard pour les tests locaux lorsque FluidSynth n'est pas encore installé."""
        import wave
        import struct
        import math

        sample_rate = 44100
        duration_seconds = 4.0
        frequency = 440.0 # Note A4

        with wave.open(str(output_path), 'w') as wav_file:
            wav_file.setnchannels(1) # Mono
            wav_file.setsampwidth(2) # 16 bits
            wav_file.setframerate(sample_rate)

            num_samples = int(sample_rate * duration_seconds)
            for i in range(num_samples):
                # Simple onde sinusoïdale avec léger déclin
                envelope = math.exp(-i / (sample_rate * 1.5))
                value = int(16000 * math.sin(2.0 * math.pi * frequency * (i / sample_rate)) * envelope)
                data = struct.pack('<h', value)
                wav_file.writeframes(data)
