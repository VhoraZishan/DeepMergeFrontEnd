from __future__ import annotations

from typing import Callable, Awaitable


class KafkaIngestion:
	"""Event-driven ingestion scaffold (no external deps)."""

	def __init__(self, brokers: str = "localhost:9092") -> None:
		self.brokers = brokers

	async def subscribe(self, topic: str, handler: Callable[[bytes], Awaitable[None]]):
		"""Stub subscription; replace with aiokafka later."""
		# In production, use aiokafka to consume and pass messages to handler
		raise NotImplementedError("Kafka subscribe stub. Implement with aiokafka.")

	async def publish(self, topic: str, payload: bytes) -> None:
		"""Stub publish; replace with aiokafka later."""
		raise NotImplementedError("Kafka publish stub. Implement with aiokafka.")


