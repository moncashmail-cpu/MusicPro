import logging
from apps.worker.celery_app import celery_app
from packages.music_parser.src.xml_parser import MusicScoreParser

logger = logging.getLogger("worker.sync")


@celery_app.task(name="tasks.sync_task", bind=True)
def sync_task(self, score_id: str, musicxml_path: str):
    """
    Tâche asynchrone : Calcule les alignements temporels précis des notes (start_time_seconds, end_time_seconds).
    """
    logger.info(f"Synchronisation temporelle des notes pour {score_id}")
    parser = MusicScoreParser(musicxml_path)
    parts_with_notes = parser.extract_parts_and_notes()
    logger.info(f"Alignement terminé pour {score_id} ({len(parts_with_notes)} voix)")
    return {"score_id": score_id, "parts": parts_with_notes}
