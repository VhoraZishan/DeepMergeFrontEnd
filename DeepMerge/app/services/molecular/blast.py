from __future__ import annotations

from typing import List, Dict


def kmerize(seq: str, k: int = 7) -> set[str]:
	seq = (seq or "").upper().replace("\n", "")
	return {seq[i:i+k] for i in range(0, max(0, len(seq) - k + 1))}


def simple_kmer_similarity(query: str, targets: List[Dict[str, str]], k: int = 7, top_k: int = 5) -> List[Dict[str, object]]:
	"""Very lightweight BLAST-like similarity via k-mer Jaccard index."""
	q = kmerize(query, k)
	results: List[Dict[str, object]] = []
	for t in targets:
		seq = t.get("sequence", "")
		name = t.get("name") or t.get("id") or "target"
		tk = kmerize(seq, k)
		if not q or not tk:
			score = 0.0
		else:
			inter = len(q & tk)
			union = len(q | tk)
			score = inter / union if union else 0.0
		results.append({"target": name, "score": round(score, 4)})
	results.sort(key=lambda r: r["score"], reverse=True)
	return results[:top_k]


