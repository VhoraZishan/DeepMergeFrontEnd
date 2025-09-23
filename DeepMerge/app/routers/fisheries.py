from fastapi import APIRouter, Query
from app.ingestion.cmfri import CmfriClient, CmfriLandingRecord

router = APIRouter(prefix="/fisheries", tags=["fisheries"])


@router.get("/records")
async def list_records(state: str = Query("Kerala")):
	client = CmfriClient()
	try:
		records = await client.fetch_landings(state)
		return {
			"items": [r.model_dump() for r in records], 
			"state": state,
			"source": "CMFRI Database"
		}
	except Exception as e:
		return {
			"items": [], 
			"state": state, 
			"error": str(e),
			"note": "CMFRI requires registration for data access"
		}


@router.get("/species/{species_name}")
async def get_species_distribution(species_name: str):
	"""Get distribution data for a specific species"""
	client = CmfriClient()
	try:
		records = await client.fetch_species_distribution(species_name)
		return {
			"items": [r.model_dump() for r in records], 
			"species": species_name,
			"source": "CMFRI Database"
		}
	except Exception as e:
		return {
			"items": [], 
			"species": species_name, 
			"error": str(e)
		}
