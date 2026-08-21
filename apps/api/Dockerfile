FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    fluidsynth \
    fluid-soundfont-gm \
    ffmpeg \
    openjdk-17-jre-headless \
    && rm -rf /var/lib/apt/lists/*

COPY apps/api/requirements.txt /app/apps/api/requirements.txt
RUN pip install --no-cache-dir -r /app/apps/api/requirements.txt

COPY . /app

ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["uvicorn", "apps.api.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
