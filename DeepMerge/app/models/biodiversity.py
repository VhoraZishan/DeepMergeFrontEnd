from sqlalchemy import Column, Float, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.session import Base
import uuid


class BiodiversityRecord(Base):
	__tablename__ = "biodiversity_records"
	
	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	species_name = Column(String(200), nullable=False)
	common_name = Column(String(200), nullable=True)
	latitude = Column(Float, nullable=True)
	longitude = Column(Float, nullable=True)
	observation_date = Column(DateTime(timezone=True), nullable=True)
	habitat = Column(String(100), nullable=True)
	conservation_status = Column(String(50), nullable=True)
	region = Column(String(100), nullable=True)
	source = Column(String(100), nullable=False, default="IBP")
	created_at = Column(DateTime(timezone=True), server_default=func.now())

