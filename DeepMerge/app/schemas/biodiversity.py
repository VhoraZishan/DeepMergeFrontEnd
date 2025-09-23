from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID


class BiodiversityRecordBase(BaseModel):
	species_name: str = Field(..., min_length=1)
	common_name: Optional[str] = None
	latitude: Optional[float] = Field(None, ge=-90, le=90)
	longitude: Optional[float] = Field(None, ge=-180, le=180)
	observation_date: Optional[datetime] = None
	habitat: Optional[str] = None
	conservation_status: Optional[str] = None
	region: Optional[str] = None
	source: str = "IBP"


class BiodiversityRecordCreate(BiodiversityRecordBase):
	pass


class BiodiversityRecord(BiodiversityRecordBase):
	id: UUID
	created_at: datetime
	
	class Config:
		from_attributes = True


class BiodiversityQuery(BaseModel):
	species_name: Optional[str] = None
	habitat: Optional[str] = None
	region: Optional[str] = None
	conservation_status: Optional[str] = None
	limit: int = Field(100, ge=1, le=1000)

