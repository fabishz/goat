from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict
from app.models.expert import ExpertRole

class ExpertBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

# Expert
class ExpertDomainBase(ExpertBase):
    category_id: UUID
    expertise_level: float = 1.0

class ExpertDomainCreate(ExpertDomainBase):
    pass

class ExpertDomain(ExpertDomainBase):
    id: UUID

class ExpertCreate(ExpertBase):
    name: str
    bio: Optional[str] = None
    credentials: Optional[str] = None
    role: ExpertRole = ExpertRole.EXPERT
    domains: List[ExpertDomainCreate]

class ExpertUpdate(ExpertBase):
    name: Optional[str] = None
    bio: Optional[str] = None
    verification_status: Optional[bool] = None
    reputation_score: Optional[float] = None
    is_active: Optional[bool] = None

class Expert(ExpertBase):
    id: UUID
    name: str
    bio: Optional[str] = None
    verification_status: bool
    reputation_score: float
    role: ExpertRole
    is_active: bool
    domains: List[ExpertDomain]

# Voting
class ExpertVoteCreate(ExpertBase):
    entity_id: UUID
    scoring_model_id: UUID
    score: float = Field(..., ge=0.0, le=10.0)
    confidence: float = Field(1.0, ge=0.0, le=1.0)
    justification: Optional[str] = None

class ExpertVote(ExpertBase):
    id: UUID
    expert_id: UUID
    entity_id: UUID
    scoring_model_id: UUID
    score: float
    confidence: float
    justification: Optional[str] = None
    created_at: datetime

# Disclosure
class ConflictDisclosureCreate(ExpertBase):
    entity_id: Optional[UUID] = None
    description: str

class ConflictDisclosure(ExpertBase):
    id: UUID
    expert_id: UUID
    entity_id: Optional[UUID]
    description: str
    is_active: bool
