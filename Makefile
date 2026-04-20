.PHONY: dev prod down logs
SHELL := /bin/bash
DEV_COMPOSE = docker-compose.yml
PROD_COMPOSE = docker-compose.prod.yml

# Default to dev
dev:
    docker compose -f $(DEV_COMPOSE) up --build

# Production (combines base + prod config)
prod:
    docker compose -f $(PROD_COMPOSE) up --build -d

down:
    docker compose down

logs:
    docker compose logs -f