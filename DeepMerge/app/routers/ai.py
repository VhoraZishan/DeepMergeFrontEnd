from fastapi import APIRouter, Query, HTTPException, Body
from app.services.llm.query_processor import QueryProcessor
from app.core.settings import get_settings

router = APIRouter(prefix="/ai", tags=["ai"])

settings = get_settings()
query_processor = QueryProcessor(settings.gemini_api_key)


@router.post("/query")
async def natural_language_query(query: str):
	"""Process natural language queries about marine data"""
	if not query.strip():
		raise HTTPException(status_code=400, detail="Query cannot be empty")
	
	try:
		result = await query_processor.process_natural_language_query(query)
		return result
	except Exception as e:
		raise HTTPException(status_code=500, detail=f"Query processing failed: {str(e)}")


@router.get("/summary")
async def get_data_summary(
	data_type: str = Query(..., description="oceanography|fisheries|biodiversity|molecular"),
	region: str = Query("kerala", description="Geographic region")
):
	"""Get AI-generated summary of marine data"""
	valid_types = ["oceanography", "fisheries", "biodiversity", "molecular"]
	if data_type not in valid_types:
		raise HTTPException(status_code=400, detail=f"Invalid data_type. Must be one of: {valid_types}")
	
	try:
		summary = await query_processor.get_data_summary(data_type, region)
		return {
			"data_type": data_type,
			"region": region,
			"summary": summary,
			"timestamp": "2024-01-15T10:30:00Z"
		}
	except Exception as e:
		raise HTTPException(status_code=500, detail=f"Summary generation failed: {str(e)}")


@router.post("/anomalies")
async def detect_anomalies(data: list, data_type: str):
	"""Detect anomalies in marine data using AI"""
	if not data:
		raise HTTPException(status_code=400, detail="Data cannot be empty")
	
	try:
		analysis = await query_processor.detect_anomalies(data, data_type)
		return {
			"data_type": data_type,
			"anomaly_analysis": analysis,
			"record_count": len(data),
			"timestamp": "2024-01-15T10:30:00Z"
		}
	except Exception as e:
		raise HTTPException(status_code=500, detail=f"Anomaly detection failed: {str(e)}")


@router.get("/examples")
async def get_query_examples():
	"""Get examples of natural language queries"""
	return {
		"examples": [
			"Show fish abundance trend near Kerala coast 2020-2025",
			"What is the current sea surface temperature in Tamil Nadu?",
			"Find marine species observations in Karnataka waters",
			"Show correlation between SST and fish landings in Goa",
			"Detect anomalies in tide height data for Kochi",
			"Summarize biodiversity data for Arabian Sea region",
			"What eDNA studies are available for Indian marine waters?",
			"Show recent fisheries landing data for mackerel species"
		],
		"supported_data_types": ["oceanography", "fisheries", "biodiversity", "molecular"],
		"supported_regions": ["kerala", "tamil_nadu", "karnataka", "goa", "india"]
	}


@router.get("/sql")
async def suggest_sql(question: str = Query(...)):
	"""Generate SQL for TimescaleDB from a natural question (LLM-assisted)."""
	try:
		sql = await query_processor.suggest_sql_query(question)
		if not sql or "LLM disabled" in sql:
			# Provide a safe fallback SQL example
			sql = "SELECT time_bucket('1 day', timestamp) AS day, avg(value) AS mean_sst FROM oceanography_records WHERE parameter='sst' GROUP BY day ORDER BY day;"
		return {"sql": sql}
	except Exception as e:
		raise HTTPException(status_code=500, detail=f"SQL suggestion failed: {str(e)}")


@router.post("/viz/suggest")
async def suggest_viz(question: str = Query(...), fields: list[str] = Body(...)):
	"""Suggest visualization spec based on question and available fields."""
	try:
		spec = await query_processor.suggest_visualization(question, fields)
		# Ensure a minimal spec if LLM not configured
		if not spec or "spec" not in spec:
			spec = {"spec": {"type": "line", "x": fields[:1], "y": fields[1:2]}}
		return spec
	except Exception as e:
		raise HTTPException(status_code=500, detail=f"Viz suggestion failed: {str(e)}")
