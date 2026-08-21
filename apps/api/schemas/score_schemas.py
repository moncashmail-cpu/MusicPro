from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID
from datetime import datetime


class NoteDTO(BaseModel):
    id: Optional[UUID] = None
    measure_number: int
    pitch: str
    duration_beats: float
    start_time_seconds: float
    end_time_seconds: float
    is_rest: bool = False
    solfege_name_fr: Optional[str] = None


class PartDTO(BaseModel):
    id: Optional[UUID] = None
    name: str
    instrument: Optional[str] = None
    midi_program: Optional[int] = 1
    order_index: int = 0
    notes: List[NoteDTO] = []


class AudioRenderDTO(BaseModel):
    id: Optional[UUID] = None
    part_id: Optional[UUID] = None
    file_url: str
    format: str = "mp3"
    duration_seconds: float = 0.0
    created_at: Optional[datetime] = None


class ScoreDetailDTO(BaseModel):
    id: UUID
    title: str
    composer: Optional[str] = None
    key_signature: Optional[str] = None
    time_signature: Optional[str] = None
    tempo: Optional[int] = 120
    status: str
    original_file_url: Optional[str] = None
    musicxml_url: Optional[str] = None
    created_at: datetime
    parts: List[PartDTO] = []
    audio_renders: List[AudioRenderDTO] = []


class ScoreListItemDTO(BaseModel):
    id: UUID
    title: str
    composer: Optional[str] = None
    key_signature: Optional[str] = None
    time_signature: Optional[str] = None
    tempo: Optional[int] = 120
    status: str
    created_at: datetime
    parts_count: int = 0
    renders_count: int = 0
