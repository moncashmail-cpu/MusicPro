import uuid
import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from apps.api.core.database import get_db
from apps.api.services.score_service import ScoreService
from apps.api.services.storage_service import storage_service
from apps.api.schemas.score_schemas import ScoreDetailDTO, ScoreListItemDTO
from apps.api.models.score_models import Score, Part, Note, AudioRender, ProcessingJob

# Import packages
from packages.omr_engine.src.omr_processor import OMREngine
from packages.music_parser.src.xml_parser import MusicScoreParser

router = APIRouter(prefix="/scores", tags=["Scores"])


@router.get("/", response_model=List[ScoreListItemDTO])
async def list_scores(db: AsyncSession = Depends(get_db)):
    """Récupère la liste de toutes les partitions enregistrées."""
    return await ScoreService.get_all_scores(db)


@router.get("/{score_id}", response_model=ScoreDetailDTO)
async def get_score(score_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Récupère les détails complets d'une partition, ses voix et notes synchronisées."""
    score = await ScoreService.get_score_by_id(score_id, db)
    if not score:
        raise HTTPException(status_code=404, detail="Partition introuvable")
    return score


@router.post("/upload", response_model=ScoreDetailDTO)
async def upload_score(
    title: str = Form(...),
    composer: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Étape 1 : Upload de partition (Image ou PDF)
    Enregistre le fichier source et initialise le pipeline de traitement.
    """
    file_bytes = await file.read()
    filename = f"{uuid.uuid4()}_{file.filename}"
    saved_url = await storage_service.save_uploaded_file(filename, file_bytes)

    # Création du score en BDD
    score = Score(
        title=title,
        composer=composer or "Compositeur",
        original_file_url=saved_url,
        status="uploaded"
    )
    db.add(score)
    await db.flush()

    # Pipeline OMR + Parsing
    try:
        score_abs_path = storage_service.get_absolute_path(saved_url)
        xml_dir = storage_service.local_storage_dir / "musicxml"
        
        omr = OMREngine()
        xml_path = omr.process_image_to_musicxml(str(score_abs_path), str(xml_dir))
        score.musicxml_url = f"/storage/musicxml/{os.path.basename(xml_path)}"
        score.status = "omr_done"

        # Parsing musical avec music21
        parser = MusicScoreParser(xml_path)
        meta = parser.get_metadata()
        score.key_signature = meta.get("key_signature")
        score.time_signature = meta.get("time_signature")
        score.tempo = meta.get("tempo", 120)

        parts_data = parser.extract_parts_and_notes()
        for p_data in parts_data:
            part = Part(
                score_id=score.id,
                name=p_data["name"],
                instrument=p_data["instrument"],
                midi_program=p_data["midi_program"],
                order_index=p_data["order_index"]
            )
            db.add(part)
            await db.flush()

            for n_data in p_data["notes"]:
                note = Note(
                    part_id=part.id,
                    measure_number=n_data["measure_number"],
                    pitch=n_data["pitch"],
                    duration_beats=n_data["duration_beats"],
                    start_time_seconds=n_data["start_time_seconds"],
                    end_time_seconds=n_data["end_time_seconds"],
                    is_rest=n_data["is_rest"],
                    solfege_name_fr=n_data["solfege_name_fr"]
                )
                db.add(note)

        score.status = "ready"
        await db.commit()
    except Exception as e:
        await db.rollback()
        score.status = "failed"
        db.add(score)
        await db.commit()
        raise HTTPException(status_code=500, detail=f"Erreur de traitement OMR/MusicXML : {str(e)}")

    return await ScoreService.get_score_by_id(score.id, db)
