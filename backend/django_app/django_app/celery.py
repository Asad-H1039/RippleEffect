import os

from celery import Celery

# from celery.schedules import crontab
from celery.utils.log import get_task_logger

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_app.settings")

app = Celery("django_app")

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object("django.conf:settings", namespace="CELERY")

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

logger = get_task_logger(__name__)

# app.conf.beat_schedule = {
#     "get-supporters-count": {
#         "task": "supporters.tasks.scrape_supporters",
#         "schedule": crontab(minute="*"),
#     },
# "download-air-pollution-data": {
#     "task": "maps.tasks.download_air_pollution_data",
#     "schedule": crontab(minute="*"),
# },
# }
