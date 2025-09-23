from fastapi import APIRouter, Query
from app.analytics.engine import CorrelationEngine


router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/correlate")
async def correlate(
	parameter: str = Query("sst", description="ocean parameter: sst | tide_height | chlorophyll"),
	species: str = Query("Sardinella longiceps"),
	region: str | None = Query("kerala"),
):
	engine = CorrelationEngine()
	try:
		result = await engine.correlate_parameter_with_species(parameter=parameter, region=region, species=species)
		return {
			"parameter": result.parameter,
			"species": result.species,
			"region": result.region,
			"pearson_r": result.pearson_r,
			"n": result.n,
			"paired_dates": result.paired_dates,
			"message": result.message,
		}
	except Exception as e:
		# Be resilient in demos: return a friendly message rather than 500
		return {
			"parameter": parameter,
			"species": species,
			"region": region,
			"pearson_r": None,
			"n": 0,
			"paired_dates": [],
			"message": f"Correlation unavailable: {str(e)}",
		}


