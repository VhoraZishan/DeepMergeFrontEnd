from fastapi import APIRouter, Query
from fastapi.responses import HTMLResponse


router = APIRouter(prefix="/viz", tags=["visualization"])


@router.get("/layers")
async def list_layers():
	"""List available geospatial/data layers (stub)."""
	return {
		"layers": [
			{"id": "sst_recent", "type": "raster", "title": "SST (recent)"},
			{"id": "landings_points", "type": "points", "title": "Fisheries Landings"},
		],
	}


@router.get("/dashboard")
async def get_dashboard_config(name: str = Query("default")):
	"""Return dashboard layout/config (for Grafana/Plotly clients)."""
	return {
		"name": name,
		"widgets": [
			{"type": "timeseries", "title": "SST vs Landings", "query": "correlate(sst, sardine)"},
		]
	}


@router.get("/map", response_class=HTMLResponse)
async def leaflet_map():
	"""Serve a minimal Leaflet map page."""
	return """
	<!doctype html>
	<html>
	<head>
		<meta charset=\"utf-8\" />
		<title>Marine Data Map</title>
		<link rel=\"stylesheet\" href=\"https://unpkg.com/leaflet@1.9.4/dist/leaflet.css\" />
		<style>html,body,#map{height:100%;margin:0}</style>
	</head>
	<body>
		<div id=\"map\"></div>
		<script src=\"https://unpkg.com/leaflet@1.9.4/dist/leaflet.js\"></script>
		<script>
		const map = L.map('map').setView([10.0, 75.0], 5);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);
		</script>
	</body>
	</html>
	"""


