import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy import String, Text, ForeignKey, Float, JSON, Integer, Boolean, DateTime, func, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin, SoftDeleteMixin
import enum

class ExpertRole(str, enum.Enum):
    EXPERT = "expert"
    SENIOR_EXPERT = "senior_expert"
    REVIEWER = "reviewer"
    ADMIN = "admin"

class Expert(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "experts"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    bio: Mapped[str] = mapped_column(Text, nullable=True)
    credentials: Mapped[str] = mapped_column(Text, nullable=True)
    verification_status: Mapped[bool] = mapped_column(Boolean, default=False)
    reputation_score: Mapped[float] = mapped_column(Float, default=1.0)  # Baseline 1.0
    role: Mapped[ExpertRole] = mapped_column(String(20), default=ExpertRole.EXPERT)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    domains: Mapped[List["ExpertDomain"]] = relationship("ExpertDomain", back_populates="expert", cascade="all, delete-orphan")
    votes: Mapped[List["ExpertVote"]] = relationship("ExpertVote", back_populates="expert")
    reputation_events: Mapped[List["ExpertReputationEvent"]] = relationship("ExpertReputationEvent", back_populates="expert")
    conflict_disclosures: Mapped[List["ConflictDisclosure"]] = relationship("ConflictDisclosure", back_populates="expert")

    def __repr__(self) -> str:
        return f"<Expert(name={self.name}, role={self.role})>"

class ExpertDomain(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "expert_domains"

    expert_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("experts.id", ondelete="CASCADE"), nullable=False)
    category_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    expertise_level: Mapped[float] = mapped_column(Float, default=1.0)  # 1.0 = primary, 0.5 = secondary

    expert: Mapped["Expert"] = relationship("Expert", back_populates="domains")

class ExpertReputationEvent(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "expert_reputation_events"

    expert_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("experts.id", ondelete="CASCADE"), nullable=False)
    change_amount: Mapped[float] = mapped_column(Float, nullable=False)
    reason: Mapped[str] = mapped_column(String(255), nullable=False)
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=True)

    expert: Mapped["Expert"] = relationship("Expert", back_populates="reputation_events")

class ConflictDisclosure(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "conflict_disclosures"

    expert_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("experts.id", ondelete="CASCADE"), nullable=False)
    entity_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("entities.id", ondelete="SET NULL"), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    expert: Mapped["Expert"] = relationship("Expert", back_populates="conflict_disclosures")

class ExpertVote(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "expert_votes"

    expert_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("experts.id", ondelete="CASCADE"), nullable=False)
    entity_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("entities.id", ondelete="CASCADE"), nullable=False)
    scoring_model_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("scoring_models.id", ondelete="CASCADE"), nullable=False)
    
    score: Mapped[float] = mapped_column(Float, nullable=False)  # 0 to 10
    confidence: Mapped[float] = mapped_column(Float, default=1.0)  # 0 to 1
    justification: Mapped[str] = mapped_column(Text, nullable=True)
    
    expert: Mapped["Expert"] = relationship("Expert", back_populates="votes")

class ExpertScoreContribution(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "expert_score_contributions"

    final_score_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("final_scores.id", ondelete="CASCADE"), nullable=False)
    expert_vote_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("expert_votes.id", ondelete="CASCADE"), nullable=False)
    impact_weight: Mapped[float] = mapped_column(Float, nullable=False)
    contribution_value: Mapped[float] = mapped_column(Float, nullable=False)

class ExpertAuditLog(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "expert_audit_logs"

    expert_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("experts.id", ondelete="CASCADE"), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    details: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
