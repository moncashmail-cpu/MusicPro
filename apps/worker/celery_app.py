import os
from celery import Celery

broker_url = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
result_backend = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")

celery_app = Celery(
    "musikpro_tasks",
    broker=broker_url,
    backend=result_backend,
    include=[
        "apps.worker.tasks.omr_task",
        "apps.worker.tasks.synth_task",
        "apps.worker.tasks.sync_task"
    ]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=600, # 10 minutes max pour gros OMR
)
