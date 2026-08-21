import os
import shutil
from pathlib import Path
from typing import Optional
import aiofiles
from apps.api.core.config import settings


class StorageService:
    """Gestionnaire de stockage des fichiers média (Images sources, MusicXML, Audios)."""

    def __init__(self):
        self.local_storage_dir = Path("./storage")
        self.local_storage_dir.mkdir(parents=True, exist_ok=True)
        (self.local_storage_dir / "uploads").mkdir(exist_ok=True)
        (self.local_storage_dir / "musicxml").mkdir(exist_ok=True)
        (self.local_storage_dir / "audio").mkdir(exist_ok=True)

    async def save_uploaded_file(self, filename: str, content: bytes) -> str:
        """Sauvegarde un fichier envoyé et retourne son URL ou chemin d'accès relatif."""
        file_path = self.local_storage_dir / "uploads" / filename
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content)
        return f"/storage/uploads/{filename}"

    def get_absolute_path(self, relative_url: str) -> Path:
        """Convertit une URL relative de stockage en chemin local absolu."""
        clean_path = relative_url.replace("/storage/", "")
        return (self.local_storage_dir / clean_path).resolve()


storage_service = StorageService()
