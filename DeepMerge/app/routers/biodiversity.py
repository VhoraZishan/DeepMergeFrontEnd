from fastapi import APIRouter, Query
from app.ingestion.ibp import IBPClient, IBPRecord

router = APIRouter(prefix="/biodiversity", tags=["biodiversity"])


@router.get("/species")
async def search_species(
	query: str = Query("marine fish", description="Search term for species"),
	limit: int = Query(10, description="Number of results to return")
):
	"""Search for marine species in India Biodiversity Portal"""
	client = IBPClient()
	try:
		records = await client.search_species(query, limit)
		return {
			"items": [r.model_dump() for r in records], 
			"query": query,
			"source": "India Biodiversity Portal"
		}
	except Exception as e:
		return {
			"items": [], 
			"query": query, 
			"error": str(e),
			"note": "IBP API may be temporarily unavailable"
		}


@router.get("/observations")
async def get_marine_observations(region: str = Query("kerala")):
	"""Get marine species observations from IBP"""
	client = IBPClient()
	try:
		records = await client.get_marine_observations(region)
		return {
			"items": [r.model_dump() for r in records], 
			"region": region,
			"source": "India Biodiversity Portal"
		}
	except Exception as e:
		return {
			"items": [], 
			"region": region, 
			"error": str(e)
		}

