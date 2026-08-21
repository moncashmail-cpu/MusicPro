# 🎵 MusikPro — Plateforme OMR & Synthèse Audio

> **Reconnaissance de partitions musicales, séparation des voix polyphoniques, synthèse audio par piste et lecture assistée pour non-lecteurs de solfège.**

---

## 🏛️ Architecture du Monorepo

```
Musikpro/
├── apps/
│   ├── web/                     # Frontend Next.js (OSMD, Tone.js, Tailwind CSS)
│   ├── api/                     # Backend FastAPI (SQLAlchemy async, Pydantic)
│   └── worker/                  # Celery Workers (OMR, FluidSynth, Synchronisation)
├── packages/
│   ├── omr-engine/              # Wrapper Audiveris / Oemer (Image -> MusicXML)
│   ├── music-parser/            # Logique music21 & extraction solfège français
│   └── audio-synth/             # Wrapper FluidSynth (MIDI -> WAV/MP3 multi-pistes)
├── shared/
│   └── types/                   # Interfaces TypeScript & schémas Pydantic partagés
├── infra/
│   ├── docker-compose.yml       # Stack PostgreSQL, Redis, MinIO, API, Worker, Web
│   └── .env.example             # Variables d'environnement
├── package.json                 # Workspaces & Turborepo
└── turbo.json
```

---

## 🚀 Démarrage Rapide

### 1. Démarrer l'infrastructure complète via Docker Compose

```bash
docker-compose -f infra/docker-compose.yml up -d
```

Les services seront accessibles sur :
- **Frontend Web** : [http://localhost:3000](http://localhost:3000)
- **API FastAPI & Swagger** : [http://localhost:8000/docs](http://localhost:8000/docs)
- **MinIO Console** : [http://localhost:9001](http://localhost:9001)

---

### 2. Démarrage en Développement Local

#### Frontend Web (Next.js) :
```bash
cd apps/web
npm install
npm run dev
```

#### Backend API (FastAPI) :
```bash
cd apps/api
pip install -r requirements.txt
uvicorn apps.api.main:app --reload --port 8000
```

#### Worker Asynchrone (Celery) :
```bash
cd apps/worker
celery -A apps.worker.celery_app worker --loglevel=info
```

---

## 🎼 Fonctionnalités Clés

1. **OMR Pipeline** : Conversion automatique des images / PDF en MusicXML standard.
2. **Multi-Track Audio** : Rendu de l'harmonie globale et rendu isolé par voix/instrument.
3. **Mode Non-Lecteur** : Surlignage temps réel note par note ("karaoké de portée") avec affichage optionnel du solfège en français (*Do, Ré, Mi*).
4. **Mixeur Studio** : Contrôle de volume, solo et mute par piste.
