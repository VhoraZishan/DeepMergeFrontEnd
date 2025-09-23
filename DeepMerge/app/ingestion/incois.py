from typing import Any
import anyio
import httpx
from pydantic import BaseModel, Field
from datetime import datetime, timedelta


class IncoisRecord(BaseModel):
	lat: float
	lon: float
	timestamp: str
	parameter: str = Field(description="e.g., sst, chlorophyll")
	value: float | None = None


class IncoisClient:
	def __init__(self, erddap_url: str = "https://erddap.incois.gov.in/erddap") -> None:
		self.erddap_url = erddap_url.rstrip("/")

	async def fetch_sst_daily(self, region: str = "kerala") -> list[IncoisRecord]:
		"""Fetch SST data from INCOIS ERDDAP server"""
		# ERDDAP query for daily SST data
		# Format: https://erddap.incois.gov.in/erddap/griddap/sst_daily.nc?sst[time][lat][lon]
		url = f"{self.erddap_url}/griddap/sst_daily.nc"
		
		# Get recent data (last 7 days)
		end_date = datetime.now()
		start_date = end_date - timedelta(days=7)
		
		params = {
			"sst": f"sst[{start_date.strftime('%Y-%m-%dT%H:%M:%SZ')}:1:{end_date.strftime('%Y-%m-%dT%H:%M:%SZ')}][(8):(23)][(68):(90)]"
		}
		
		async with httpx.AsyncClient(timeout=30) as client:
			for attempt in range(3):
				try:
					res = await client.get(url, params=params)
					res.raise_for_status()
					
					# ERDDAP returns NetCDF, but we'll mock the conversion for now
					# In production, use xarray or netCDF4 to parse the response
					return self._mock_sst_data(region)
				except Exception:
					if attempt == 2:
						raise
					await anyio.sleep(1.5 * (attempt + 1))
		return []

	def _mock_sst_data(self, region: str) -> list[IncoisRecord]:
		"""Mock SST data based on typical Kerala coastal values"""
		import random
		base_temp = 27.5 if region.lower() == "kerala" else 28.0
		
		records = []
		for i in range(5):
			lat = 10.0 + (i * 0.1)
			lon = 75.0 + (i * 0.1)
			temp = base_temp + random.uniform(-1.0, 1.0)
			timestamp = (datetime.now() - timedelta(hours=i*6)).isoformat() + "Z"
			
			records.append(IncoisRecord(
				lat=lat,
				lon=lon,
				timestamp=timestamp,
				parameter="sst",
				value=round(temp, 1)
			))
		return records

	async def fetch_tide_data(self, station: str = "kochi") -> list[IncoisRecord]:
		"""Fetch tide gauge data from INCOIS"""
		# Real implementation would query INCOIS tide gauge API
		# For now, return mock data
		import random
		records = []
		for i in range(24):  # 24 hours of hourly data
			records.append(IncoisRecord(
				lat=9.9667,  # Kochi coordinates
				lon=76.2833,
				timestamp=(datetime.now() - timedelta(hours=23-i)).isoformat() + "Z",
				parameter="tide_height",
				value=round(random.uniform(0.5, 2.5), 2)
			))
		return records
