from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional
from uuid import UUID


class FisheriesRecordBase(BaseModel):
	species: str = Field(..., min_length=1)
	landing_center: str = Field(..., min_length=1)
	state: str = Field(..., min_length=1)
	quantity_tonnes: Optional[float] = Field(None, ge=0)
	gear_type: Optional[str] = None
	landing_date: date
	source: str = "CMFRI"


class FisheriesRecordCreate(FisheriesRecordBase):
	pass


class FisheriesRecord(FisheriesRecordBase):
	id: UUID
	created_at: datetime
	
	class Config:
		from_attributes = True


class FisheriesQuery(BaseModel):
	species: Optional[str] = None
	state: Optional[str] = None
	gear_type: Optional[str] = None
	start_date: Optional[date] = None
	end_date: Optional[date] = None
	limit: int = Field(100, ge=1, le=1000)

