#!/bin/bash

set -e

echo "${0}: running migrations."
python manage.py migrate --noinput

#echo "${0}: compile messages."
#python manage.py compilemessages

echo "${0}: collecting statics."

python manage.py collectstatic --noinput
#cp -rv staticfiles/* /django_app/staticfiles
#cp -rv custom_static/* /django_app/static


gunicorn django_app.wsgi:application \
    --env DJANGO_SETTINGS_MODULE=django_app.settings \
    --name air \
    --bind 0.0.0.0:8000 \
    --timeout 600 \
    --workers 1 \
    --log-level=info \
    --reload
