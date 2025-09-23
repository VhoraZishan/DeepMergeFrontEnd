from __future__ import annotations

"""eDNA pipeline stubs (QIIME2/DADA2) and FASTQ QC.

These are placeholders to be run via Celery tasks; integrate real tools later.
"""

from typing import List, Dict


def fastq_qc_report(fastq_paths: List[str]) -> Dict[str, object]:
	"""Return a simple QC summary (stub)."""
	return {"files": fastq_paths, "summary": {"reads_total": 0, "warnings": []}}


def run_qiime2_pipeline(fastq_paths: List[str], metadata: Dict[str, str]) -> Dict[str, str]:
	"""Stub for QIIME2 workflow (denoise, taxonomy)."""
	return {"status": "queued", "steps": ["import", "denoise", "taxonomy"], "outputs": {}}


def run_dada2_pipeline(fastq_paths: List[str], metadata: Dict[str, str]) -> Dict[str, str]:
	"""Stub for DADA2 workflow."""
	return {"status": "queued", "steps": ["filter", "learn", "merge"], "outputs": {}}


