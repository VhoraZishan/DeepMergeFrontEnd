from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
import json
import asyncio
from datetime import datetime
from app.ingestion.incois import IncoisClient
from app.ingestion.cmfri import CmfriClient
from app.ingestion.ibp import IBPClient
from app.ingestion.ncbi import NCBIClient

router = APIRouter(prefix="/ws", tags=["websocket"])

class ConnectionManager:
	def __init__(self):
		self.active_connections: List[WebSocket] = []
		self.incois = IncoisClient()
		self.cmfri = CmfriClient()
		self.ibp = IBPClient()
		self.ncbi = NCBIClient()

	async def connect(self, websocket: WebSocket):
		await websocket.accept()
		self.active_connections.append(websocket)

	def disconnect(self, websocket: WebSocket):
		self.active_connections.remove(websocket)

	async def send_personal_message(self, message: str, websocket: WebSocket):
		await websocket.send_text(message)

	async def broadcast(self, message: str):
		for connection in self.active_connections:
			try:
				await connection.send_text(message)
			except:
				# Remove dead connections
				self.active_connections.remove(connection)

manager = ConnectionManager()


@router.websocket("/live")
async def websocket_endpoint(websocket: WebSocket):
	await manager.connect(websocket)
	try:
		while True:
			# Wait for client message
			data = await websocket.receive_text()
			message = json.loads(data)
			
			if message.get("type") == "subscribe":
				# Start live data stream
				await handle_subscription(websocket, message)
			elif message.get("type") == "query":
				# Handle real-time query
				await handle_realtime_query(websocket, message)
			else:
				await manager.send_personal_message(
					json.dumps({"error": "Unknown message type"}), 
					websocket
				)
	except WebSocketDisconnect:
		manager.disconnect(websocket)


async def handle_subscription(websocket: WebSocket, message: Dict[str, Any]):
	"""Handle live data subscription"""
	data_type = message.get("data_type", "oceanography")
	region = message.get("region", "kerala")
	interval = message.get("interval", 30)  # seconds
	
	await manager.send_personal_message(
		json.dumps({
			"type": "subscription_started",
			"data_type": data_type,
			"region": region,
			"interval": interval
		}), 
		websocket
	)
	
	# Start streaming data
	while True:
		try:
			data = await fetch_live_data(data_type, region)
			await manager.send_personal_message(
				json.dumps({
					"type": "data_update",
					"data_type": data_type,
					"region": region,
					"data": data,
					"timestamp": datetime.now().isoformat()
				}), 
				websocket
			)
			await asyncio.sleep(interval)
		except Exception as e:
			await manager.send_personal_message(
				json.dumps({
					"type": "error",
					"message": str(e)
				}), 
				websocket
			)
			break


async def handle_realtime_query(websocket: WebSocket, message: Dict[str, Any]):
	"""Handle real-time query processing"""
	query = message.get("query", "")
	
	if not query:
		await manager.send_personal_message(
			json.dumps({"error": "Query cannot be empty"}), 
			websocket
		)
		return
	
	try:
		# Process query and return results
		results = await process_realtime_query(query)
		await manager.send_personal_message(
			json.dumps({
				"type": "query_result",
				"query": query,
				"results": results,
				"timestamp": datetime.now().isoformat()
			}), 
			websocket
		)
	except Exception as e:
		await manager.send_personal_message(
			json.dumps({
				"type": "error",
				"message": f"Query processing failed: {str(e)}"
			}), 
			websocket
		)


async def fetch_live_data(data_type: str, region: str) -> Dict[str, Any]:
	"""Fetch live data based on type and region"""
	if data_type == "oceanography":
		try:
			sst_data = await manager.incois.fetch_sst_daily(region)
			tide_data = await manager.incois.fetch_tide_data("kochi")
			return {
				"sst": [r.model_dump() for r in sst_data],
				"tide": [r.model_dump() for r in tide_data]
			}
		except:
			return {"error": "Oceanography data unavailable"}
	
	elif data_type == "fisheries":
		try:
			landings = await manager.cmfri.fetch_landings(region.title())
			return [r.model_dump() for r in landings]
		except:
			return {"error": "Fisheries data unavailable"}
	
	elif data_type == "biodiversity":
		try:
			observations = await manager.ibp.get_marine_observations(region)
			return [r.model_dump() for r in observations]
		except:
			return {"error": "Biodiversity data unavailable"}
	
	elif data_type == "molecular":
		try:
			edna = await manager.ncbi.search_marine_edna("India", 5)
			return [r.model_dump() for r in edna]
		except:
			return {"error": "Molecular data unavailable"}
	
	return {"error": "Unknown data type"}


async def process_realtime_query(query: str) -> Dict[str, Any]:
	"""Process real-time queries (simplified version)"""
	# This would integrate with the QueryProcessor for full AI capabilities
	# For now, return a simple response
	return {
		"query": query,
		"status": "processed",
		"message": "Real-time query processing would integrate with AI service here"
	}


@router.get("/status")
async def websocket_status():
	"""Get WebSocket connection status"""
	return {
		"active_connections": len(manager.active_connections),
		"supported_data_types": ["oceanography", "fisheries", "biodiversity", "molecular"],
		"supported_regions": ["kerala", "tamil_nadu", "karnataka", "goa", "india"]
	}

