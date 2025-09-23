from fastapi import APIRouter, Query, Body
from app.ingestion.ncbi import NCBIClient, NCBIRecord
from app.services.molecular.blast import simple_kmer_similarity

router = APIRouter(prefix="/molecular", tags=["molecular"])


@router.get("/edna")
async def search_marine_edna(
	location: str = Query("India", description="Geographic location for eDNA search"),
	limit: int = Query(10, description="Number of results to return")
):
	"""Search for marine eDNA data in NCBI SRA"""
	client = NCBIClient()
	try:
		records = await client.search_marine_edna(location, limit)
		return {
			"items": [r.model_dump() for r in records], 
			"location": location,
			"source": "NCBI SRA"
		}
	except Exception as e:
		return {
			"items": [], 
			"location": location, 
			"error": str(e),
			"note": "NCBI E-utilities may be rate-limited"
		}


@router.post("/blast")
async def blast_like_search(
	query_sequence: str = Body(..., embed=True),
	reference_sequences: list[dict[str, str]] = Body(
		..., embed=True, description="List of {name, sequence} objects"
	),
	k: int = Query(7, ge=3, le=15),
	top_k: int = Query(5, ge=1, le=50),
):
	"""Lightweight BLAST-like search using k-mer Jaccard similarity (for prototyping)."""
	results = simple_kmer_similarity(query_sequence, reference_sequences, k=k, top_k=top_k)
	return {"results": results, "k": k, "top_k": top_k}

