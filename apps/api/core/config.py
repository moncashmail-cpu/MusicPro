import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "MusikPro API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql+asyncpg://musikpro:musikpro_secret@localhost:5432/musikpro_db"
    )
    SYNC_DATABASE_URL: str = os.getenv(
        "SYNC_DATABASE_URL",
        "postgresql://musikpro:musikpro_secret@localhost:5432/musikpro_db"
    )
    
    # Celery & Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
    
    # S3 / MinIO
    S3_ENDPOINT: Optional[str] = os.getenv("S3_ENDPOINT", "http://localhost:9000")
    S3_ACCESS_KEY: str = os.getenv("S3_ACCESS_KEY", "minioadmin")
    S3_SECRET_KEY: str = os.getenv("S3_SECRET_KEY", "minioadmin")
    S3_BUCKET_NAME: str = os.getenv("S3_BUCKET_NAME", "musikpro-media")
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super_secret_jwt_key_musikpro_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    class Config:
        case_sensitive = True


settings = Settings()
