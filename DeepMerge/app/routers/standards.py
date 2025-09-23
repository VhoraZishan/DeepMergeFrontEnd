from fastapi import APIRouter, Body, HTTPException
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any
from app.services.standards import export_dwc_occurrences, cf_metadata_stub, serialize_csv, build_timeseries_netcdf


router = APIRouter(prefix="/standards", tags=["standards"])


@router.post("/dwc/export")
async def export_dwc(records: List[Dict[str, Any]] = Body(...)):
	"""Map input records to Darwin Core occurrence fields (CSV-ready rows as JSON)."""
	mapped = export_dwc_occurrences(records)
	return {"rows": mapped, "count": len(mapped)}


@router.get("/cf/metadata")
async def get_cf_metadata(dataset: str, variable: str, units: str, standard_name: str):
	"""Return CF/ERDDAP-style metadata stub for variable."""
	return cf_metadata_stub(dataset, variable, units, standard_name)


@router.post("/dwc/export.csv")
async def export_dwc_csv(records: List[Dict[str, Any]] = Body(...)):
	rows = export_dwc_occurrences(records)
	csv_bytes = serialize_csv(rows)
	return StreamingResponse(iter([csv_bytes]), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=occurrence.csv"})


@router.post("/cf/timeseries.nc")
async def export_timeseries_netcdf(
	dataset: str,
	variable: str,
	units: str,
	standard_name: str,
	times: List[str] = Body(...),
	values: List[float | None] = Body(...),
):
	try:
		blob = build_timeseries_netcdf(
			dataset_name=dataset,
			variable=variable,
			units=units,
			standard_name=standard_name,
			times_iso=times,
			values=values,
		)
		return StreamingResponse(iter([blob]), media_type="application/x-netcdf", headers={"Content-Disposition": "attachment; filename=timeseries.nc"})
	except RuntimeError as e:
		raise HTTPException(status_code=500, detail=str(e))


