#!/usr/bin/env bash
set -eu

APP_DIR="${APP_DIR:-$HOME/film}"
REPO_URL="${REPO_URL:-https://github.com/ScryZ-developer/film-react-nest.git}"
BRANCH="${BRANCH:-review-2}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed. Run: sudo apt update && sudo apt install -y docker.io docker-compose-v2"
  exit 1
fi

mkdir -p "$APP_DIR"
cd "$APP_DIR"

if [ ! -d .git ]; then
  git clone --branch "$BRANCH" --depth 1 "$REPO_URL" .
else
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git pull --ff-only origin "$BRANCH"
fi

if [ ! -f .env ]; then
  cp .env.example .env
fi

docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --remove-orphans

echo "Stack status:"
docker compose -f docker-compose.prod.yml ps

echo "Seed database (if empty):"
echo "  docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.init.sql"
echo "  docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.films.sql"
echo "  docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.shedules.sql"
