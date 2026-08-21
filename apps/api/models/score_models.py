import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Enum, ForeignKey, Integer, Float, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from apps.api.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    role = Column(String(50), default="debutant")  # 'musicien', 'debutant', 'admin'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    scores = relationship("Score", back_populates="user", cascade="all, delete-orphan")


class Score(Base):
    __tablename__ = "scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    original_file_url = Column(Text, nullable=True)
    musicxml_url = Column(Text, nullable=True)
    status = Column(String(50), default="uploaded", nullable=False) # 'uploaded', 'processing', 'omr_done', 'ready', 'failed'
    composer = Column(String(255), nullable=True)
    key_signature = Column(String(50), nullable=True)
    time_signature = Column(String(50), nullable=True)
    tempo = Column(Integer, default=120)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="scores")
    parts = relationship("Part", back_populates="score", cascade="all, delete-orphan", order_by="Part.order_index")
    audio_renders = relationship("AudioRender", back_populates="score", cascade="all, delete-orphan")
    jobs = relationship("ProcessingJob", back_populates="score", cascade="all, delete-orphan")


class Part(Base):
    __tablename__ = "parts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    score_id = Column(UUID(as_uuid=True), ForeignKey("scores.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False) # "Violon I", "Basse", "Voix"
    instrument = Column(String(255), nullable=True)
    midi_program = Column(Integer, default=1)
    order_index = Column(Integer, default=0)

    score = relationship("Score", back_populates="parts")
    notes = relationship("Note", back_populates="part", cascade="all, delete-orphan", order_by="Note.start_time_seconds")
    audio_renders = relationship("AudioRender", back_populates="part", cascade="all, delete-orphan")


class Note(Base):
    __tablename__ = "notes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    part_id = Column(UUID(as_uuid=True), ForeignKey("parts.id", ondelete="CASCADE"), nullable=False)
    measure_number = Column(Integer, nullable=False)
    pitch = Column(String(20), nullable=False) # "C4", "F#5"
    duration_beats = Column(Float, nullable=False)
    start_time_seconds = Column(Float, nullable=False) # Position synchronisée dans l'audio
    end_time_seconds = Column(Float, nullable=False)
    is_rest = Column(Boolean, default=False)
    solfege_name_fr = Column(String(20), nullable=True) # "Do4", "Fa#5"

    part = relationship("Part", back_populates="notes")


class AudioRender(Base):
    __tablename__ = "audio_renders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    score_id = Column(UUID(as_uuid=True), ForeignKey("scores.id", ondelete="CASCADE"), nullable=False)
    part_id = Column(UUID(as_uuid=True), ForeignKey("parts.id", ondelete="CASCADE"), nullable=True) # NULL = Rendu global
    file_url = Column(Text, nullable=False)
    format = Column(String(10), default="mp3") # 'mp3' | 'wav'
    duration_seconds = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    score = relationship("Score", back_populates="audio_renders")
    part = relationship("Part", back_populates="audio_renders")


class ProcessingJob(Base):
    __tablename__ = "processing_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    score_id = Column(UUID(as_uuid=True), ForeignKey("scores.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False) # 'omr' | 'synthesis' | 'sync'
    status = Column(String(50), default="pending", nullable=False) # 'pending', 'processing', 'completed', 'failed'
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)

    score = relationship("Score", back_populates="jobs")
