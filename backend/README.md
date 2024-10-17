# Backend for RippleFarm

## Overview

This folder contains the backend for RippleFarm, a Django-based application that serves as the core of the system. This backend handles data management, business logic, and API services for the RippleFarm mobile application.

## Folder Structure

- **django_app**: Contains the main Django application, which is the heart of the system.
- **docker**: Contains files required for Docker build purposes, a shortcut for the hackathon.
- **nginx**: Contains configuration files for Nginx, which is used as a load balancer.
- **docker-compose-initiate.yaml**: Docker Compose file for initializing the application and generating SSL certificates.
- **docker-compose-prod.yml**: Docker Compose file for running the application in production mode.
- **docker-compose.yml**: Docker Compose file for running the application in development mode.
- **README.md**: Documentation for the backend.

## Environment Variables

Create a `.env` file in the root directory by copying the `.env.example` file. Ensure all variables are correctly set. Below are the environment variables required:

```plaintext
DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost
CSRF_TRUSTED_ORIGINS=http://localhost
SECRET_KEY='secret'

# POSTGRES
POSTGRES_NAME=air-quality
POSTGRES_USER=air-quality
POSTGRES_PASSWORD=psql-password
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# OPENAI
OPENAI_API_KEY=openai_api_key
OPENAI_MODEL=gpt-3.5-turbo-1106
QDRANT_API_KEY=qdrant_api_key
QDRANT_HOST=qdrant_host_url

# EMAIL
EMAIL=sebastianburzynski@bluerider.software
DOMAIN=zerohunger.bluerider.software

# AWS
USE_S3=True
AWS_STORAGE_BUCKET_NAME=example-bucket
AWS_ACCESS_KEY_ID=access-key-id
AWS_SECRET_ACCESS_KEY=secret-access-key
```

## Description of Environment Variables
```plaintext
DEBUG: Enables debug mode.
DJANGO_ALLOWED_HOSTS: Specifies the allowed hosts for the Django application.
CSRF_TRUSTED_ORIGINS: Specifies trusted origins for CSRF protection.
SECRET_KEY: Secret key for the Django application.
POSTGRES_*: Configuration for the PostgreSQL database.
OPENAI_*: Configuration for OpenAI API integration.
EMAIL: Email address for SSL certificate generation.
DOMAIN: Domain for the application.
AWS_*: Configuration for AWS S3 storage.
QDRANT_*: Configuration for Qdrant API integration.
```

## Prerequisites
Ensure Docker and docker compose is installed on your system.

## Running the Application

### Running Locally
To run the application locally, use the following command:
```bash
docker-compose up
```

This command will start the application in development mode.

### Running in Production
To run the application in production, follow these steps:

1. Database Setup: Use any PostgreSQL provider (AWS RDS, Azure, etc.) or set up a local PostgreSQL database on your server. The demo was prepared using AWS RDS (PostgreSQL). Create an RDS PostgreSQL database and enable the 5432 port from your VPS IP address.
2. Environment Configuration: Ensure the EMAIL and DOMAIN environment variables are set correctly. These are required to generate an SSL certificate using Certbot.
3. DNS Configuration: Set up a DNS A record pointing to your VPS. Certbot uses this to verify domain ownership.
4. Generate SSL Certificates: Run the following command to generate SSL certificates:
   ```bash
    docker-compose -f docker-compose-initiate.yaml up
   ```
5. Start the Application: Run the following command to start the application in production mode:
   ```bash
    docker-compose -f docker-compose-prod.yml up
   ``` 

## Accessing the Application
Once the application is running, you can access it through the URL you created.
In order to create superuser in admin panel you need to log in to your server and inside the backend container create superuser using CLI.
In order to access the admin url you need to add `/admin` to the end of the url.

```bash
docker exec -it backend_web_1 bash
python manage.py createsuperuser
```

