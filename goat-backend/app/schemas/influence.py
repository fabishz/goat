from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

# --- Influence Source ---
class InfluenceSourceBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class InfluenceSourceCreate(InfluenceSourceBase):
    name: str
    source_type: str
    credibility_score: float = Field(default=0.5, ge=0.0, le=1.0)
    base_url: Optional[str] = None
    description: Optional[str] = None

class InfluenceSource(InfluenceSourceBase):
    id: UUID
    name: str
    source_type: str
    credibility_score: float
    base_url: Optional[str]
    description: Optional[str]

# --- Influence Model ---
class InfluenceModelBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class InfluenceModelCreate(InfluenceModelBase):
    name: str
    version: str
    category_id: UUID
    weights: Dict[str, float] = Field(default_factory=dict)
    config: Dict[str, Any] = Field(default_factory=dict)

class InfluenceModel(InfluenceModelBase):
    id: UUID
    name: str
    version: str
    category_id: UUID
    is_active: bool
    weights: Dict[str, float]
    config: Dict[str, Any]

# --- Influence Event ---
class InfluenceEventBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class InfluenceEventCreate(InfluenceEventBase):
    entity_id: UUID
    source_id: UUID
    event_type: str
    description: str
    event_date: Optional[datetime] = None
    weight: float = 1.0
    metadata_json: Dict[str, Any] = Field(default_factory=dict)

class InfluenceEvent(InfluenceEventBase):
    id: UUID
    entity_id: UUID
    source_id: UUID
    event_type: str
    description: str
    event_date: Optional[datetime]
    weight: float
    metadata_json: Dict[str, Any]

# --- Influence Score ---
class InfluenceScoreBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class InfluenceScore(InfluenceScoreBase):
    id: UUID
    entity_id: UUID
    influence_model_id: UUID
    breadth_score: float
    depth_score: float
    longevity_score: float
    peer_score: float
    total_score: float
    confidence_score: float
    breakdown: Dict[str, Any]
    explanation: Optional[str]
