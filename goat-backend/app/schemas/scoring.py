from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict


class ScoringBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# Component
class ScoringComponentBase(ScoringBase):
    name: str
    slug: str
    description: Optional[str] = None
    normalization_type: str = "min-max"
    is_subjective: bool = False


class ScoringComponentCreate(ScoringComponentBase):
    pass


class ScoringComponent(ScoringComponentBase):
    id: UUID


# Weight
class ScoringWeightBase(ScoringBase):
    component_id: UUID
    weight: float = Field(..., ge=0.0, le=1.0)


class ScoringWeightCreate(ScoringWeightBase):
    pass


class ScoringWeight(ScoringWeightBase):
    id: UUID


# Model
class ScoringModelBase(ScoringBase):
    name: str
    version: str
    description: Optional[str] = None
    category_id: UUID
    is_active: bool = True


class ScoringModelCreate(ScoringModelBase):
    weights: List[ScoringWeightCreate]


class ScoringModel(ScoringModelBase):
    id: UUID
    weights: List[ScoringWeight]


# Scores
class RawScoreCreate(ScoringBase):
    entity_id: UUID
    component_id: UUID
    value: float
    era_id: Optional[UUID] = None


class FinalScoreResponse(ScoringBase):
    entity_id: UUID
    scoring_model_id: UUID
    score: float
    breakdown: Dict[str, float]
    explanation: Optional[str] = None


class RankingSnapshotResponse(ScoringBase):
    id: UUID
    category_id: UUID
    label: str
    snapshot_data: List[Dict[str, Any]]
    created_at: datetime
