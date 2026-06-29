# BSM Website

Website for Basket Saint Macaire (BSM): a Vue 3 frontend, a Node/Express + Prisma API, Postgres, and MinIO for media storage, run as Docker containers.

## Project layout

```
frontend/   Vue 3 + Vite SPA (served by nginx in production)
backend/    Express + Prisma API
scripts/    repo-level one-off ops scripts (MinIO seed)
docker-compose.yml
```

Services: `db` (Postgres), `backend`, `frontend` (nginx), `minio` (media storage), plus `minio-init` — a one-shot helper that creates the bucket and exits, not a long-running service.

## Local development (without Docker)

Run Postgres any way you like (e.g. `docker run -p 5432:5432 -e POSTGRES_USER=bsm -e POSTGRES_PASSWORD=devpass -e POSTGRES_DB=bsm postgres:16-alpine`), then:

```sh
cd backend
cp .env.example .env   # fill in DATABASE_URL / JWT_SECRET / ADMIN_* / SMTP_*
npm install
npx prisma migrate dev
npx prisma db seed     # one-time: loads the club's existing content
npm run dev            # http://localhost:3000
```

```sh
cd frontend
npm install
npm run dev             # http://localhost:5173, proxies /api to localhost:3000
```

To generate `ADMIN_PASSWORD_HASH`:

```sh
node -e "console.log(require('bcryptjs').hashSync('yourpassword', 10))"
```

## Local development (with Docker)

```sh
cp .env.example .env    # fill in the same values as above
docker compose up --build
docker compose exec backend npx prisma db seed   # first run only
./scripts/seed-minio.sh                          # first run only (see Media storage below)
```

The site is served at `http://localhost:8080` (nginx, proxying `/api/*` to the backend container internally). Postgres data persists in the `pgdata` named volume and media in the `miniodata` named volume, both across `docker compose down && up`.

**Note:** any `$` in `ADMIN_PASSWORD_HASH` or `MINIO_ROOT_PASSWORD` must be doubled as `$$` in `.env`, or Docker Compose's variable substitution will corrupt the value (this is why the bcrypt example below has no `$` issue today, but if you ever hand-pick a password containing one, double it).

## Media storage (MinIO)

Gallery photos and the registration PDFs are no longer bundled into the frontend image — they live in a MinIO bucket (`bsm-media`, public-read), and nginx proxies `/gallery/*` and `/files/*` straight to it (`frontend/nginx.conf`), so every image path already stored in Postgres (e.g. `team.image`, `product.imageFolder`) keeps working unchanged. The gallery listing that `ImageCarousel.vue` and the shop use is served by the backend at `GET /api/gallery-images` (replaces the old build-time `gallery-images.json` scanner).

- **Adding/updating images today:** upload directly into the bucket under the matching prefix (`gallery/<category>/<season>/<file>.webp` or `files/<file>.pdf`), e.g. via the MinIO Console (`mc admin` / expose port `9001` if you want a UI) or the `mc` CLI. No redeploy needed — the gallery listing and image URLs are resolved at request time.
- **`scripts/seed-minio.sh`**: one-time migration helper using `mc mirror`, safe to re-run. Defaults to this repo's (now-removed) `frontend/public/{gallery,files}` paths; pass explicit paths for other sources: `./scripts/seed-minio.sh /path/to/gallery /path/to/files`.

## Weekly planning updates

Match data lives in Postgres now instead of a JSON file. To import a new weekly CSV export:

```sh
docker compose cp ./planning.csv backend:/app/planning.csv
docker compose exec backend npx ts-node scripts/import-planning-csv.ts /app/planning.csv
```

(or run `npm run import-planning -- ./planning.csv` from `backend/` against a local `DATABASE_URL`). It upserts matches by `(date, team)`, same as the old script.

## Testing

| Layer | Where | Command |
| --- | --- | --- |
| Backend unit + integration (80% coverage gate) | `backend/tests/` (Vitest + Supertest) | `npm run test:coverage` (from `backend/`) |
| Frontend unit | `frontend/src/**/*.test.ts` (Vitest + Vue Test Utils) | `npm run test:unit` (from `frontend/`) |
| E2E (real user flows) | `frontend/e2e/` (Playwright) | `npm run test:e2e` (from `frontend/`) |

Backend tests need a real Postgres reachable via `DATABASE_URL` (migrated, any data — tests truncate between runs) plus the usual required env vars; mailer/MinIO calls are mocked in integration tests, so no SMTP/MinIO server is needed for that command alone.

E2E tests need an already-running, already-seeded backend (`DATABASE_URL` migrated + `npx prisma db seed`, server started, e.g. `npm run dev` or `npm run build && node dist/index.js`) reachable at `E2E_API_TARGET` (defaults to `http://localhost:3000`) — Playwright itself only starts the frontend dev server. The contact-form e2e test expects a real SMTP target (e.g. a local MailDev container) so the submission actually succeeds.

CI (`.github/workflows/cd.yml`) runs all three against Postgres/MinIO/MailDev service containers in a `test` job that gates `build-and-push` and `deploy` — a failing test or a coverage drop below 80% blocks deployment.

## Content management

All content (news, teams, planning, products, etc.) is managed through authenticated CRUD endpoints on the API (`POST/PUT/DELETE /api/<resource>`), guarded by a JWT obtained from `POST /api/auth/login`. There is no admin UI yet — use `curl`/Postman/Insomnia with the admin credentials configured in the backend's `.env`.

## Deployment

`.github/workflows/cd.yml` builds and pushes both Docker images to GHCR on every push to `main`, then SSHes into the production server to pull and restart the stack.

Required GitHub secrets:

| Secret | Purpose |
| --- | --- |
| `SSH_HOST` | Server hostname/IP |
| `SSH_USERNAME` | SSH login user |
| `SSH_PRIVATE_KEY` | Private key for that user |
| `SSH_PORT` | Optional, defaults to 22 |

One-time server setup (not handled by CI): install Docker + Docker Compose, create `/opt/bsm/`, place a real `.env` there (never committed — same keys as `.env.example`), and run `docker compose up -d` once manually so the stack and volumes exist before the first automated deploy. The server is expected to already have TLS/domain handling in front of it (existing reverse proxy or Cloudflare); the frontend container itself only serves plain HTTP.

**Important — first deploy only:** the server's `/opt/bsm/` only gets `docker-compose.yml` (CI scp's just that file), so it has no local copy of the gallery photos/PDFs to seed MinIO from. Before going live, copy `gallery/` and `files/` from a machine that still has them (e.g. `git show <commit-before-media-removal>:frontend/public/gallery` or your local backup) to the server, then run `./scripts/seed-minio.sh <path>/gallery <path>/files` there once, and delete the copies afterward. Skipping this means every image on the live site 404s.
