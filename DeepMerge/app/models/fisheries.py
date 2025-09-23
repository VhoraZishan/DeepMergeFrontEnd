from sqlalchemy import Column, Float, String, DateTime, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.session import Base
import uuid


class FisheriesRecord(Base):
	__tablename__ = "fisheries_records"
	
	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	species = Column(String(200), nullable=False)
	landing_center = Column(String(100), nullable=False)
	state = Column(String(50), nullable=False)
	quantity_tonnes = Column(Float, nullable=True)
	gear_type = Column(String(100), nullable=True)
	landing_date = Column(Date, nullable=False)
	source = Column(String(100), nullable=False, default="CMFRI")
	created_at = Column(DateTime(timezone=True), server_default=func.now())

