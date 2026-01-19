from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

class FanVoteBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class FanVoteCreate(FanVoteBase):
    entity_id: UUID
    category_id: UUID
    rating: float = Field(..., ge=1.0, le=10.0)
    reason: Optional[str] = None

class FanVoteUpdate(FanVoteBase):
    rating: float = Field(..., ge=1.0, le=10.0)
    reason: Optional[str] = None

class FanVote(FanVoteBase):
    id: UUID
    user_id: UUID
    entity_id: UUID
    category_id: UUID
    rating: float
    weight: float
    created_at: datetime
    updated_at: datetime

class FanVoteAggregate(FanVoteBase):
    entity_id: UUID
    category_id: UUID
    aggregate_score: float
    vote_count: int
    last_updated: datetime

class UserTrustScore(FanVoteBase):
    user_id: UUID
    trust_score: float
    account_age_days: int
    engagement_level: int
    is_flagged: bool
