## DeepMerge Frontend + Backend Integration

### Local development

1. Start backend API (FastAPI) in `DeepMerge/`:

```bash
cd DeepMerge
docker compose up -d --build
```

API will be at `http://localhost:8000` with health at `/healthz` and API under `/api/v1`.

2. Start frontend (Vite):

```bash
pnpm i || npm i
npm run dev
```

Frontend dev server runs at `http://localhost:8080` and proxies `/api` and `/ws` to the backend.

### Configuration

- Optionally set `VITE_API_BASE_URL` to override the API base in production (defaults to same-origin).


