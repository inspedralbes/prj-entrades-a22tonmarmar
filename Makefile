# Default to dev
dev:
    docker compose up --build

# Production (combines base + prod config)
prod:
    docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

down:
    docker compose down

logs:
    docker compose logs -f