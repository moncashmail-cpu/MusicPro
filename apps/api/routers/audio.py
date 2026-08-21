import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from apps.api.core.database import get_db
from apps.api.services.storage_service import storage_service
from apps.api.models.score_models import AudioRender, Score

router = APIRouter(prefix="/audio", tags=["Audio"])


@router.get("/render/{score_id}")
async def get_audio_render(
    score_id: uuid.UUID,
    part_id: Optional[uuid.UUID] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Retourne le flux audio du morceau (global ou par voix isolée).
    """
    # Placeholder / Streaming endpoint
    return {"message": "Audio stream ready", "score_id": str(score_id), "part_id": str(part_id) if part_id else None}
