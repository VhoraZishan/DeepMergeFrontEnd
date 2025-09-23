from sqlalchemy import Column, String, DateTime, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.session import Base
import uuid


class MolecularRecord(Base):
	__tablename__ = "molecular_records"
	
	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
	accession = Column(String(100), nullable=False, unique=True)
	title = Column(Text, nullable=False)
	organism = Column(String(200), nullable=False)
	location = Column(String(200), nullable=True)
	collection_date = Column(DateTime(timezone=True), nullable=True)
	sequencing_platform = Column(String(100), nullable=True)
	read_count = Column(Integer, nullable=True)
	source = Column(String(100), nullable=False, default="NCBI")
	created_at = Column(DateTime(timezone=True), server_default=func.now())

