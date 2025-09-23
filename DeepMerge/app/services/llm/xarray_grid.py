from __future__ import annotations

"""CF-compliant gridded NetCDF stub using xarray (placeholder).

Real implementation would build sst/chloro grids with lat/lon/time dims.
"""

try:
	import xarray as xr  # type: ignore
except Exception:
	xr = None


def grid_to_netcdf_stub() -> bytes:
	if xr is None:
		raise RuntimeError("xarray not installed")
	# Placeholder: create a tiny 1x1x2 dataset
	da = xr.DataArray([[[27.1, 27.3]]], dims=["lat", "lon", "time"], coords={"lat": [10.0], "lon": [75.0], "time": ["2024-01-01T00:00:00","2024-01-01T06:00:00"]})
	da.name = "sea_surface_temperature"
	da.attrs = {"units": "degree_C", "standard_name": "sea_surface_temperature"}
	ds = da.to_dataset()
	return ds.to_netcdf()


