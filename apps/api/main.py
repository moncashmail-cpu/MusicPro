import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from apps.api.routers import scores, audio, auth
from apps.api.core.config import settings
from apps.api.core.database import engine, Base

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API de reconnaissance OMR, synthèse audio et lecture assistée de partitions"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local storage static files for direct audio / xml access in dev
os.makedirs("./storage", exist_ok=True)
app.mount("/storage", StaticFiles(directory="./storage"), name="storage")

# Include Routers
app.include_router(scores.router, prefix=settings.API_V1_STR)
app.include_router(audio.router, prefix=settings.API_V1_STR)
app.include_router(auth.router, prefix=settings.API_V1_STR)


@app.on_event("startup")
async def on_startup():
    # Crée automatiquement les tables en base si besoin (dev mode)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/")
async def root():
    return {
        "service": "MusikPro API",
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs"
    }
