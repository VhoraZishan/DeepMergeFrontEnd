from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID


class MolecularRecordBase(BaseModel):
	accession: str = Field(..., min_length=1)
	title: str = Field(..., min_length=1)
	organism: str = Field(..., min_length=1)
	location: Optional[str] = None
	collection_date: Optional[datetime] = None
	sequencing_platform: Optional[str] = None
	read_count: Optional[int] = Field(None, ge=0)
	source: str = "NCBI"


class MolecularRecordCreate(MolecularRecordBase):
	pass


class MolecularRecord(MolecularRecordBase):
	id: UUID
	created_at: datetime
	
	class Config:
		from_attributes = True


class MolecularQuery(BaseModel):
	organism: Optional[str] = None
	location: Optional[str] = None
	sequencing_platform: Optional[str] = None
	limit: int = Field(100, ge=1, le=1000)

