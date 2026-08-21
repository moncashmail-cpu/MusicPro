import logging
from apps.worker.celery_app import celery_app
from packages.omr_engine.src.omr_processor import OMREngine

logger = logging.getLogger("worker.omr")


@celery_app.task(name="tasks.omr_task", bind=True)
def omr_task(self, score_id: str, input_image_path: str, output_dir: str):
    """
    Tâche asynchrone : Conversion image/PDF -> MusicXML via Audiveris / Oemer.
    """
    logger.info(f"Démarrage tâche OMR pour la partition {score_id}")
    engine = OMREngine()
    xml_path = engine.process_image_to_musicxml(input_image_path, output_dir)
    logger.info(f"Fin tâche OMR pour {score_id} : {xml_path}")
    return {"score_id": score_id, "musicxml_path": xml_path}
