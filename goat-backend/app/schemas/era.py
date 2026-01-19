from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

class EraBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class EraCreate(EraBase):
    name: str
    category_id: UUID
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    context_factors: Dict[str, Any] = Field(default_factory=dict)
    description: Optional[str] = None

class EraUpdate(EraBase):
    name: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    context_factors: Optional[Dict[str, Any]] = None
    description: Optional[str] = None

class Era(EraBase):
    id: UUID
    name: str
    category_id: UUID
    start_year: Optional[int]
    end_year: Optional[int]
    context_factors: Dict[str, Any]
    description: Optional[str]

class EraFactorCreate(EraBase):
    era_id: UUID
    component_id: UUID
    mean_value: float
    std_dev: float
    multiplier: float = 1.0

class EraFactor(EraBase):
    id: UUID
    era_id: UUID
    component_id: UUID
    mean_value: float
    std_dev: float
    multiplier: float

class EraAdjustedScoreResponse(EraBase):
    entity_id: UUID
    era_id: UUID
    component_id: UUID
    raw_value: float
    adjusted_value: float
    z_score: Optional[float]
    explanation: Optional[str]
