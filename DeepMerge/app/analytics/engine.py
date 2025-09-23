from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime
from statistics import mean
from typing import Dict, List, Tuple

from app.ingestion.incois import IncoisClient, IncoisRecord
from app.ingestion.cmfri import CmfriClient, CmfriLandingRecord


@dataclass
class CorrelationResult:
	parameter: str
	species: str
	region: str | None
	pearson_r: float | None
	n: int
	paired_dates: List[str]
	message: str | None = None


def _parse_iso_date(value: str) -> str:
	"""Return date component (YYYY-MM-DD) from ISO timestamp or date string."""
	try:
		# Handles 'YYYY-MM-DDTHH:MM:SSZ' and similar
		return datetime.fromisoformat(value.replace("Z", "")).date().isoformat()
	except Exception:
		# If already a date
		return value[:10]


def _pearson(x: List[float], y: List[float]) -> float | None:
	"""Compute Pearson correlation without external deps. Returns None if degenerate."""
	if len(x) < 2 or len(y) < 2:
		return None
	x_mean = mean(x)
	y_mean = mean(y)
	num = 0.0
	den_x = 0.0
	den_y = 0.0
	for xv, yv in zip(x, y):
		dx = xv - x_mean
		dy = yv - y_mean
		num += dx * dy
		den_x += dx * dx
		den_y += dy * dy
	if den_x <= 0 or den_y <= 0:
		return None
	return num / (den_x ** 0.5 * den_y ** 0.5)


class CorrelationEngine:
	"""Links oceanography time series with fisheries landings via daily correlation."""

	def __init__(self) -> None:
		self.incois = IncoisClient()
		self.cmfri = CmfriClient()

	async def correlate_parameter_with_species(
		self,
		parameter: str = "sst",
		region: str | None = "kerala",
		species: str = "Sardinella longiceps",
	) -> CorrelationResult:
		# Fetch datasets (mock-backed for now)
		o_records = await self._fetch_oceanography(parameter, region)
		f_records = await self.cmfri.fetch_species_distribution(species)

		# Aggregate oceanography by day (mean)
		o_daily: Dict[str, List[float]] = defaultdict(list)
		for r in o_records:
			if r.value is None:
				continue
			day = _parse_iso_date(r.timestamp)
			o_daily[day].append(float(r.value))
		o_mean: Dict[str, float] = {d: mean(vals) for d, vals in o_daily.items() if vals}

		# Aggregate fisheries by day (sum tonnes)
		f_daily: Dict[str, float] = defaultdict(float)
		for fr in f_records:
			day = _parse_iso_date(fr.date)
			f_daily[day] += float(fr.quantity_tonnes or 0.0)

		# Align on intersection of dates
		common_days = sorted(set(o_mean.keys()) & set(f_daily.keys()))
		if not common_days:
			return CorrelationResult(
				parameter=parameter,
				species=species,
				region=region,
				pearson_r=None,
				n=0,
				paired_dates=[],
				message="No overlapping dates between datasets",
			)

		x = [o_mean[d] for d in common_days]
		y = [f_daily[d] for d in common_days]
		r = _pearson(x, y)

		return CorrelationResult(
			parameter=parameter,
			species=species,
			region=region,
			pearson_r=r,
			n=len(common_days),
			paired_dates=common_days,
		)

	async def _fetch_oceanography(self, parameter: str, region: str | None) -> List[IncoisRecord]:
		if parameter.lower() == "sst":
			return await self.incois.fetch_sst_daily(region or "kerala")
		elif parameter.lower() == "tide_height":
			return await self.incois.fetch_tide_data("kochi")
		# default fallback
		return await self.incois.fetch_sst_daily(region or "kerala")


