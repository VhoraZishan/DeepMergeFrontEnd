# CMLRE Marine Data Platform (Backend)

## Quick Start

1. Create `.env` from example and set secrets.
2. Build and run services:

```bash
docker compose up -d --build
```

API will be at `http://localhost:8000`, docs at `/docs` and `/redoc`.

## Development

- Python 3.12+
- Install with Poetry:

```bash
pip install poetry
poetry install
uvicorn app.main:app --reload
```

## Key Endpoints

- Health: `GET /healthz`
- REST base: `/api/v1`
- Oceanography: `GET /api/v1/oceanography/records`, `GET /api/v1/oceanography/tide`
- Fisheries: `GET /api/v1/fisheries/records`
- Biodiversity: `GET /api/v1/biodiversity/*`
- Molecular: `GET /api/v1/molecular/edna`, `POST /api/v1/molecular/blast`
- Analytics: `GET /api/v1/analytics/correlate`
- AI: `POST /api/v1/ai/query`, `GET /api/v1/ai/sql`, `POST /api/v1/ai/viz/suggest`
- GraphQL: `POST /api/v1/graphql` (body: `{ query, variables }`)
- WebSocket: `ws://localhost:8000/ws/live`
- Standards/Exports:
  - DwC JSON: `POST /api/v1/standards/dwc/export` (body: JSON array of records)
  - DwC CSV: `POST /api/v1/standards/dwc/export.csv`
  - CF NetCDF: `POST /api/v1/standards/cf/timeseries.nc` (time-series)
- Visualization helper: `GET /api/v1/viz/map`

## Auth (JWT - demo)

- Get a demo token: `GET /api/v1/auth/token/example?role=admin`
- Use in `Authorization: Bearer <token>` for secured routes (e.g., `/api/v1/auth/admin/ping`).

## Documentation

- [Developer Guide](DEVELOPER_GUIDE.md) - Comprehensive guide for new developers
- API Documentation: Available at `/docs` (Swagger) and `/redoc` (ReDoc) when running

## Environment

See `.env.example` for keys like `DATABASE_URL`, `GEMINI_API_KEY`, and MinIO settings.
