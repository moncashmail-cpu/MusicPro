import uuid
import logging
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from apps.api.models.score_models import Score, Part, Note, AudioRender, ProcessingJob
from apps.api.schemas.score_schemas import ScoreDetailDTO, ScoreListItemDTO, PartDTO, NoteDTO, AudioRenderDTO

logger = logging.getLogger("score-service")


class ScoreService:
    @staticmethod
    async def get_all_scores(db: AsyncSession) -> List[ScoreListItemDTO]:
        stmt = select(Score).options(
            selectinload(Score.parts),
            selectinload(Score.audio_renders)
        ).order_by(Score.created_at.desc())
        
        result = await db.execute(stmt)
        scores = result.scalars().all()

        return [
            ScoreListItemDTO(
                id=s.id,
                title=s.title,
                composer=s.composer,
                key_signature=s.key_signature,
                time_signature=s.time_signature,
                tempo=s.tempo,
                status=s.status,
                created_at=s.created_at,
                parts_count=len(s.parts) if s.parts else 0,
                renders_count=len(s.audio_renders) if s.audio_renders else 0
            )
            for s in scores
        ]

    @staticmethod
    async def get_score_by_id(score_id: uuid.UUID, db: AsyncSession) -> Optional[ScoreDetailDTO]:
        stmt = select(Score).where(Score.id == score_id).options(
            selectinload(Score.parts).selectinload(Part.notes),
            selectinload(Score.audio_renders)
        )
        result = await db.execute(stmt)
        score = result.scalars().first()

        if not score:
            return None

        parts_dtos = []
        for p in (score.parts or []):
            notes_dtos = [
                NoteDTO(
                    id=n.id,
                    measure_number=n.measure_number,
                    pitch=n.pitch,
                    duration_beats=n.duration_beats,
                    start_time_seconds=n.start_time_seconds,
                    end_time_seconds=n.end_time_seconds,
                    is_rest=n.is_rest,
                    solfege_name_fr=n.solfege_name_fr
                )
                for n in (p.notes or [])
            ]
            parts_dtos.append(
                PartDTO(
                    id=p.id,
                    name=p.name,
                    instrument=p.instrument,
                    midi_program=p.midi_program,
                    order_index=p.order_index,
                    notes=notes_dtos
                )
            )

        render_dtos = [
            AudioRenderDTO(
                id=r.id,
                part_id=r.part_id,
                file_url=r.file_url,
                format=r.format,
                duration_seconds=r.duration_seconds,
                created_at=r.created_at
            )
            for r in (score.audio_renders or [])
        ]

        return ScoreDetailDTO(
            id=score.id,
            title=score.title,
            composer=score.composer,
            key_signature=score.key_signature,
            time_signature=score.time_signature,
            tempo=score.tempo,
            status=score.status,
            original_file_url=score.original_file_url,
            musicxml_url=score.musicxml_url,
            created_at=score.created_at,
            parts=parts_dtos,
            audio_renders=render_dtos
        )
