#!/bin/sh
# One-time migration: mirrors local gallery/files folders into the running
# compose stack's MinIO bucket. Safe to re-run (mc mirror only copies
# new/changed files).
#
# Usage: ./scripts/seed-minio.sh [gallery-dir] [files-dir]
# Defaults to this repo's frontend/public/{gallery,files} for local dev.
# For a server that no longer has those folders (they're removed from the
# frontend image after the first seed), copy them there once and pass the
# paths explicitly, e.g.:
#   ./scripts/seed-minio.sh /opt/bsm/seed-media/gallery /opt/bsm/seed-media/files
set -e
cd "$(dirname "$0")/.."

GALLERY_DIR="${1:-$(pwd)/frontend/public/gallery}"
FILES_DIR="${2:-$(pwd)/frontend/public/files}"

docker compose run --rm \
  -v "$GALLERY_DIR:/seed/gallery:ro" \
  -v "$FILES_DIR:/seed/files:ro" \
  --entrypoint /bin/sh \
  minio-init -c '
    mc alias set local http://minio:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" &&
    mc mirror --overwrite /seed/gallery "local/${MINIO_BUCKET:-bsm-media}/gallery" &&
    mc mirror --overwrite /seed/files "local/${MINIO_BUCKET:-bsm-media}/files" &&
    echo "Seed complete."
  '
