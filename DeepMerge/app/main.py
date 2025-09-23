from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.settings import get_settings
from app.core.logging import configure_logging
from app.core.metrics import request_count, request_latency
from app.routers import oceanography, fisheries, biodiversity, molecular, ai, websocket, graphql, analytics, standards, visualization, auth


settings = get_settings()
configure_logging(settings.debug)


class MetricsMiddleware(BaseHTTPMiddleware):
	async def dispatch(self, request: Request, call_next):
		path = request.url.path
		method = request.method
		with request_latency.labels(method, path).time():
			response: Response = await call_next(request)
			request_count.labels(method, path, str(response.status_code)).inc()
			return response


def create_app() -> FastAPI:
	app = FastAPI(title=settings.app_name, version="0.1.0")

	app.add_middleware(
		CORSMiddleware,
		allow_origins=["*"],
		allow_credentials=True,
		allow_methods=["*"],
		allow_headers=["*"],
	)
	if settings.prometheus_enabled:
		app.add_middleware(MetricsMiddleware)

	@app.get("/healthz")
	async def health() -> dict[str, str]:
		return {"status": "ok"}

	@app.get("/metrics")
	async def metrics() -> PlainTextResponse:
		return PlainTextResponse(generate_latest(), media_type=CONTENT_TYPE_LATEST)

	app.include_router(oceanography.router, prefix=settings.api_v1_str)
	app.include_router(fisheries.router, prefix=settings.api_v1_str)
	app.include_router(biodiversity.router, prefix=settings.api_v1_str)
	app.include_router(molecular.router, prefix=settings.api_v1_str)
	app.include_router(ai.router, prefix=settings.api_v1_str)
	app.include_router(analytics.router, prefix=settings.api_v1_str)
	app.include_router(standards.router, prefix=settings.api_v1_str)
	app.include_router(visualization.router, prefix=settings.api_v1_str)
	app.include_router(auth.router, prefix=settings.api_v1_str)
	app.include_router(websocket.router)
	# GraphQL mounted at '/api/v1/graphql/' (trailing slash)
	app.include_router(graphql.router, prefix=settings.api_v1_str)
	# Also expose non-trailing path without redirect loop
	app.add_route(
		f"{settings.api_v1_str}/graphql",
		graphql.router.routes[0].app,
		methods=["GET", "POST"],
	)
	return app


app = create_app()
