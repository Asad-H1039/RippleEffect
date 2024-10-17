FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /django_app

COPY pyproject.toml poetry.lock ./

RUN pip install --no-cache-dir poetry
RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction --no-ansi


RUN apt update && apt install -y ncat htop gettext binutils libproj-dev gdal-bin && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir poetry
RUN poetry config virtualenvs.create false
RUN poetry install

RUN pip install drf-yasg

RUN mkdir -p /django_app/static
RUN mkdir -p /django_app/custom_static

COPY ./ ./
