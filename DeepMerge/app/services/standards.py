from __future__ import annotations

from typing import Iterable, Dict, Any, List
import io
import csv

try:
	import numpy as np  # type: ignore
	from netCDF4 import Dataset  # type: ignore
except Exception:  # Optional at import time; validated when used
	np = None
	Dataset = None


def export_dwc_occurrences(records: Iterable[Dict[str, Any]]) -> List[Dict[str, Any]]:
	"""Map internal biodiversity records to Darwin Core occurrence fields.

	Returns a list of dicts ready for CSV export (DwC Occurrence core subset).
	"""
	mapped: List[Dict[str, Any]] = []
	for r in records:
		mapped.append({
			"scientificName": r.get("species") or r.get("scientificName"),
			"eventDate": r.get("timestamp") or r.get("eventDate"),
			"decimalLatitude": r.get("latitude") or r.get("lat"),
			"decimalLongitude": r.get("longitude") or r.get("lon"),
			"basisOfRecord": r.get("basisOfRecord") or "HumanObservation",
			"recordedBy": r.get("recordedBy") or r.get("source") or "Unknown",
			"occurrenceID": r.get("id") or r.get("occurrenceID"),
			"country": r.get("country") or "India",
			"stateProvince": r.get("state") or r.get("region"),
			"license": r.get("license") or "CC-BY-4.0",
		})
	return mapped


def cf_metadata_stub(dataset_name: str, variable: str, units: str, standard_name: str) -> Dict[str, Any]:
	"""Return a CF/ERDDAP-style metadata dict for a variable (stub, not NetCDF)."""
	return {
		"title": dataset_name,
		"Conventions": "CF-1.10, ACDD-1.3",
		"variable": {
			"name": variable,
			"units": units,
			"standard_name": standard_name,
			"long_name": variable.replace("_", " ").title(),
		},
	}


def serialize_csv(rows: List[Dict[str, Any]]) -> bytes:
	"""Serialize list of dict rows to CSV bytes (UTF-8)."""
	if not rows:
		return b""
	buf = io.StringIO()
	fieldnames = list({k for row in rows for k in row.keys()})
	writer = csv.DictWriter(buf, fieldnames=fieldnames)
	writer.writeheader()
	for row in rows:
		writer.writerow(row)
	return buf.getvalue().encode("utf-8")


def build_timeseries_netcdf(
	*,
	dataset_name: str,
	variable: str,
	units: str,
	standard_name: str,
	times_iso: List[str],
	values: List[float | None],
) -> bytes:
	"""Create a minimal CF-compliant NetCDF for a 1D time-series variable."""
	if np is None or Dataset is None:
		raise RuntimeError("netCDF4/numpy not installed")
	# Convert times to seconds since epoch
	import datetime as _dt
	secs = []
	for t in times_iso:
		try:
			dt = _dt.datetime.fromisoformat(t.replace("Z", ""))
		except Exception:
			dt = _dt.datetime.strptime(t[:19], "%Y-%m-%dT%H:%M:%S")
		secs.append(int(dt.timestamp()))
	vals = [np.nan if v is None else float(v) for v in values]

	mem = io.BytesIO()
	with Dataset("inmemory.nc", mode="w", diskless=True, persist=False, memory=mem) as ds:  # type: ignore[arg-type]
		ds.title = dataset_name
		ds.setncattr("Conventions", "CF-1.10")
		ds.createDimension("time", len(secs))
		time_var = ds.createVariable("time", "i8", ("time",))
		time_var.units = "seconds since 1970-01-01 00:00:00"
		time_var.standard_name = "time"
		time_var[:] = np.array(secs, dtype=np.int64)

		data_var = ds.createVariable(variable, "f4", ("time",), fill_value=np.nan)
		data_var.units = units
		data_var.standard_name = standard_name
		data_var[:] = np.array(vals, dtype=np.float32)

	mem.seek(0)
	return mem.read()


