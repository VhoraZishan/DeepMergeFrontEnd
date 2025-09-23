import os
import httpx


class GeminiService:
	def __init__(self, api_key: str | None = None, model: str | None = None) -> None:
		self.api_key = api_key or os.getenv("GEMINI_API_KEY")
		# Use a widely available model; allow override via env GEMINI_MODEL
		self.model = model or os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
		self.base_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"

	async def query(self, prompt: str) -> str:
		if not self.api_key:
			return "[LLM disabled] Gemini API key not configured."
		payload = {"contents": [{"parts": [{"text": prompt}]}]}
		params = {"key": self.api_key}
		try:
			async with httpx.AsyncClient(timeout=60) as client:
				res = await client.post(self.base_url, params=params, json=payload)
				res.raise_for_status()
				data = res.json()
				# Robust extraction across variants
				candidates = data.get("candidates") or []
				if not candidates:
					return "[LLM response parse error] No candidates returned."
				parts = candidates[0].get("content", {}).get("parts") or []
				if parts and isinstance(parts, list):
					text = parts[0].get("text")
					if text:
						return text
				return "[LLM response parse error] No text found in candidates."
		except httpx.HTTPStatusError as e:
			try:
				err = e.response.json()
				msg = err.get("error", {}).get("message", str(e))
			except Exception:
				msg = str(e)
			return f"[LLM HTTP error] {msg}"
		except Exception as e:
			return f"[LLM client error] {str(e)}"
