from fastapi import APIRouter, Query
from app.ingestion.incois import IncoisClient, IncoisRecord

router = APIRouter(prefix="/oceanography", tags=["oceanography"])


@router.get("/records")
async def list_records(
	parameter: str | None = Query("sst", description="e.g., sst, tide_height, chlorophyll"),
	region: str | None = Query("kerala"),
	start: str | None = None,
	end: str | None = None,
):
	client = IncoisClient()
	try:
		if parameter.lower() == "sst":
			records = await client.fetch_sst_daily(region or "kerala")
		elif parameter.lower() == "tide_height":
			records = await client.fetch_tide_data("kochi")
		else:
			records = await client.fetch_sst_daily(region or "kerala")
		
		return {
			"items": [r.model_dump() for r in records], 
			"parameter": parameter, 
			"region": region, 
			"start": start, 
			"end": end,
			"source": "INCOIS ERDDAP"
		}
	except Exception as e:
		# Fallback to mock data
		mock = [
			IncoisRecord(lat=10.0, lon=75.0, timestamp="2024-01-01T00:00:00Z", parameter=parameter, value=27.3),
			IncoisRecord(lat=10.2, lon=75.2, timestamp="2024-01-01T03:00:00Z", parameter=parameter, value=27.1),
		]
		return {
			"items": [m.model_dump() for m in mock], 
			"parameter": parameter, 
			"region": region, 
			"start": start, 
			"end": end, 
			"note": f"Mock data - API error: {str(e)}"
		}


@router.get("/tide")
async def get_tide_data(station: str = Query("kochi")):
	"""Get tide gauge data from INCOIS"""
	client = IncoisClient()
	try:
		records = await client.fetch_tide_data(station)
		return {"items": [r.model_dump() for r in records], "station": station, "source": "INCOIS"}
	except Exception as e:
		return {"items": [], "station": station, "error": str(e)}


@router.get("/download")
async def download_data():
	return {"url": "s3://cmlre-raw/example"}
