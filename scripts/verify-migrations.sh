#!/usr/bin/env bash
set -euo pipefail

ALLOW_SKIP=false
for arg in "$@"; do
  if [[ "$arg" == "--allow-skip" ]]; then
    ALLOW_SKIP=true
  fi
done

if [[ -z "${DATABASE_URL:-}" ]]; then
  if [[ "$ALLOW_SKIP" == true ]]; then
    echo "DATABASE_URL is not set. Skipping migration verification (--allow-skip specified)."
    exit 0
  fi
  echo "Error: DATABASE_URL is not set." >&2
  exit 1
fi

echo "Verifying database migration status..."
if npx prisma migrate status; then
  echo "Database schema is up-to-date."
  exit 0
else
  echo "Error: Database schema has pending migrations or drift detected." >&2
  exit 1
fi
