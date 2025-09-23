from typing import Dict, Any, List
from app.services.llm.gemini import GeminiService
from app.ingestion.incois import IncoisClient
from app.ingestion.cmfri import CmfriClient
from app.ingestion.ibp import IBPClient
from app.ingestion.ncbi import NCBIClient
import json


class QueryProcessor:
	def __init__(self, gemini_api_key: str | None = None):
		self.gemini = GeminiService(gemini_api_key)
		self.incois = IncoisClient()
		self.cmfri = CmfriClient()
		self.ibp = IBPClient()
		self.ncbi = NCBIClient()

	async def process_natural_language_query(self, query: str) -> Dict[str, Any]:
		"""Process natural language queries about marine data"""
		
		# First, let Gemini analyze the query to extract intent and parameters
		analysis_prompt = f"""
		Analyze this marine data query and extract structured information:
		Query: "{query}"
		
		Return a JSON response with:
		{{
			"intent": "oceanography|fisheries|biodiversity|molecular|correlation",
			"parameters": {{
				"region": "kerala|tamil_nadu|karnataka|goa|india",
				"species": "species name if mentioned",
				"parameter": "sst|tide_height|chlorophyll",
				"time_range": "2020-2025|last_month|recent",
				"data_type": "abundance|distribution|observations"
			}},
			"question_type": "trend|distribution|correlation|summary"
		}}
		"""
		
		try:
			analysis = await self.gemini.query(analysis_prompt)
			# Parse JSON response (in production, add proper error handling)
			analysis_data = json.loads(analysis)
		except:
			# Fallback analysis
			analysis_data = {
				"intent": "oceanography",
				"parameters": {"region": "kerala"},
				"question_type": "summary"
			}
		
		# Fetch relevant data based on analysis
		data = await self._fetch_data_by_intent(analysis_data)
		
		# Generate natural language response
		response_prompt = f"""
		Based on this marine data query and results, provide a clear, scientific summary:
		
		Original Query: "{query}"
		Data Retrieved: {json.dumps(data, indent=2)}
		
		Provide:
		1. A brief summary of the findings
		2. Key insights or patterns
		3. Any notable trends or anomalies
		4. Recommendations for further analysis
		
		Keep it scientific but accessible, around 200-300 words.
		"""
		
		try:
			summary = await self.gemini.query(response_prompt)
		except:
			summary = "Unable to generate summary. Please check the data results above."
		
		return {
			"query": query,
			"analysis": analysis_data,
			"data": data,
			"summary": summary,
			"timestamp": "2024-01-15T10:30:00Z"
		}

	async def _fetch_data_by_intent(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
		"""Fetch data based on the analyzed intent"""
		intent = analysis.get("intent", "oceanography")
		params = analysis.get("parameters", {})
		region = params.get("region", "kerala")
		
		data = {}
		
		if intent == "oceanography":
			try:
				sst_data = await self.incois.fetch_sst_daily(region)
				tide_data = await self.incois.fetch_tide_data("kochi")
				data["oceanography"] = {
					"sst": [r.model_dump() for r in sst_data],
					"tide": [r.model_dump() for r in tide_data]
				}
			except Exception as e:
				data["oceanography"] = {"error": str(e)}
		
		elif intent == "fisheries":
			try:
				landings = await self.cmfri.fetch_landings(region.title())
				data["fisheries"] = [r.model_dump() for r in landings]
			except Exception as e:
				data["fisheries"] = {"error": str(e)}
		
		elif intent == "biodiversity":
			try:
				species = await self.ibp.search_species("marine fish", 10)
				observations = await self.ibp.get_marine_observations(region)
				data["biodiversity"] = {
					"species": [r.model_dump() for r in species],
					"observations": [r.model_dump() for r in observations]
				}
			except Exception as e:
				data["biodiversity"] = {"error": str(e)}
		
		elif intent == "molecular":
			try:
				edna = await self.ncbi.search_marine_edna("India", 10)
				data["molecular"] = [r.model_dump() for r in edna]
			except Exception as e:
				data["molecular"] = {"error": str(e)}
		
		elif intent == "correlation":
			# Fetch multiple data types for correlation analysis
			try:
				sst_data = await self.incois.fetch_sst_daily(region)
				landings = await self.cmfri.fetch_landings(region.title())
				data["correlation"] = {
					"oceanography": [r.model_dump() for r in sst_data],
					"fisheries": [r.model_dump() for r in landings]
				}
			except Exception as e:
				data["correlation"] = {"error": str(e)}
		
		return data

	async def get_data_summary(self, data_type: str, region: str = "kerala") -> str:
		"""Get AI-generated summary of data for a specific type and region"""
		prompt = f"""
		Provide a scientific summary of {data_type} data for {region} region.
		Include key trends, patterns, and insights that would be valuable for marine research.
		Keep it concise (100-150 words) and focus on actionable insights.
		"""
		
		try:
			return await self.gemini.query(prompt)
		except:
			return f"Summary unavailable for {data_type} data in {region} region."

	async def detect_anomalies(self, data: List[Dict[str, Any]], data_type: str) -> str:
		"""Detect anomalies in marine data using AI"""
		prompt = f"""
		Analyze this {data_type} data for anomalies or unusual patterns:
		{json.dumps(data[:10], indent=2)}  # Limit to first 10 records
		
		Identify:
		1. Unusual values or trends
		2. Potential data quality issues
		3. Interesting patterns that warrant investigation
		4. Recommendations for further analysis
		
		Provide a structured analysis in 150-200 words.
		"""
		
		try:
			return await self.gemini.query(prompt)
		except:
			return f"Anomaly detection unavailable for {data_type} data."

	async def suggest_sql_query(self, question: str) -> str:
		"""LLM-assisted SQL generation stub for TimescaleDB."""
		prompt = f"Generate a SQL query for TimescaleDB to answer: {question}"
		try:
			return await self.gemini.query(prompt)
		except:
			return "SELECT 1;"

	async def suggest_visualization(self, question: str, fields: List[str]) -> Dict[str, Any]:
		"""Return a suggested chart spec (type + axes) for the question and fields."""
		prompt = (
			"Suggest a visualization type and axes given the question and fields. "
			f"Question: {question}. Fields: {fields}."
		)
		try:
			spec = await self.gemini.query(prompt)
			return {"spec": spec}
		except:
			return {"spec": {"type": "line", "x": fields[:1], "y": fields[1:2]}}

