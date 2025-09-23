from sqlalchemy import Column, Float, String, DateTime, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.session import Base
import uuid


class OceanographyRecord(Base):
	__tablename__ = "oceanography_records"
	
	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	parameter = Column(String(50), nullable=False)  # sst, tide_height, chlorophyll
	latitude = Column(Float, nullable=False)
	longitude = Column(Float, nullable=False)
	value = Column(Float, nullable=True)
	timestamp = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
	region = Column(String(100), nullable=True)
	source = Column(String(100), nullable=False, default="INCOIS")
	created_at = Column(DateTime(timezone=True), server_default=func.now())
	
	# TimescaleDB hypertable index
	__table_args__ = (
		Index('idx_oceanography_timestamp', 'timestamp'),
		Index('idx_oceanography_parameter', 'parameter'),
		Index('idx_oceanography_location', 'latitude', 'longitude'),
	)

