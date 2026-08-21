"""
MusikPro - Shared Pydantic Models & Schemas
"""
from datetime import datetime
from enum import Enum
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class UserRole(str, Enum):
    MUSICIEN = "musicien"
    DEBUTANT = "debutant"
    ADMIN = "admin"


class ScoreStatus(str, Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    OMR_DONE = "omr_done"
    SYNTH_DONE = "synth_done"
    READY = "ready"
    FAILED = "failed"


class AudioFormat(str, Enum):
    MP3 = "mp3"
    WAV = "wav"


class ProcessingJobType(str, Enum):
    OMR = "omr"
    SYNTHESIS = "synthesis"
    SYNC = "sync"


class JobStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class NoteBase(BaseModel):
    measure_number: int
    pitch: str
    duration_beats: float
    start_time_seconds: float
    end_time_seconds: float
    is_rest: bool = False
    solfege_name_fr: Optional[str] = None


class NoteCreate(NoteBase):
    part_id: UUID


class NoteResponse(NoteBase):
    id: UUID
    part_id: UUID
    model_config = ConfigDict(from_attributes=True)


class PartBase(BaseModel):
    name: str
    instrument: Optional[str] = None
    midi_program: Optional[int] = None
    order_index: int = 0


class PartCreate(PartBase):
    score_id: UUID


class PartResponse(PartBase):
    id: UUID
    score_id: UUID
    notes: List[NoteResponse] = []
    model_config = ConfigDict(from_attributes=True)


class AudioRenderResponse(BaseModel):
    id: UUID
    score_id: UUID
    part_id: Optional[UUID] = None
    file_url: str
    format: AudioFormat
    duration_seconds: float
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ScoreBase(BaseModel):
    title: str
    composer: Optional[str] = None
    key_signature: Optional[str] = None
    time_signature: Optional[str] = None
    tempo: Optional[int] = 120


class ScoreCreate(ScoreBase):
    original_file_url: str


class ScoreResponse(ScoreBase):
    id: UUID
    user_id: Optional[UUID] = None
    original_file_url: Optional[str] = None
    musicxml_url: Optional[str] = None
    status: ScoreStatus
    created_at: datetime
    parts: List[PartResponse] = []
    audio_renders: List[AudioRenderResponse] = []
    model_config = ConfigDict(from_attributes=True)


class ProcessingJobResponse(BaseModel):
    id: UUID
    score_id: UUID
    type: ProcessingJobType
    status: JobStatus
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)
