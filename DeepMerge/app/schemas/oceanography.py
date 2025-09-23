from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID


class OceanographyRecordBase(BaseModel):
	parameter: str = Field(..., description="e.g., sst, tide_height, chlorophyll")
	latitude: float = Field(..., ge=-90, le=90)
	longitude: float = Field(..., ge=-180, le=180)
	value: Optional[float] = None
	timestamp: datetime
	region: Optional[str] = None
	source: str = "INCOIS"


class OceanographyRecordCreate(OceanographyRecordBase):
	pass


class OceanographyRecord(OceanographyRecordBase):
	id: UUID
	created_at: datetime
	
	class Config:
		from_attributes = True


class OceanographyQuery(BaseModel):
	parameter: Optional[str] = None
	region: Optional[str] = None
	start_date: Optional[datetime] = None
	end_date: Optional[datetime] = None
	limit: int = Field(100, ge=1, le=1000)

