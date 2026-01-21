import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy import String, Text, ForeignKey, Float, JSON, Integer, Boolean, DateTime, func, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin, SoftDeleteMixin

class UserTrustScore(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "user_trust_scores"

    user_id: Mapped[uuid.UUID] = mapped_column(nullable=False, index=True) # Assuming external user system
    trust_score: Mapped[float] = mapped_column(Float, default=1.0)
    account_age_days: Mapped[int] = mapped_column(Integer, default=0)
    engagement_level: Mapped[int] = mapped_column(Integer, default=0)
    is_flagged: Mapped[bool] = mapped_column(Boolean, default=False)
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=True)

class FanVote(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "fan_votes"

    user_id: Mapped[uuid.UUID] = mapped_column(nullable=False, index=True)
    entity_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("entities.id", ondelete="CASCADE"), nullable=False)
    category_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    rating: Mapped[float] = mapped_column(Float, nullable=False) # 1-10
    weight: Mapped[float] = mapped_column(Float, default=1.0)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    entity: Mapped["Entity"] = relationship("Entity")
    category: Mapped["Category"] = relationship("Category")
    versions: Mapped[List["FanVoteVersion"]] = relationship("FanVoteVersion", back_populates="fan_vote", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint('user_id', 'entity_id', 'category_id', name='_user_entity_category_uc'),
    )

class FanVoteVersion(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "fan_vote_versions"

    fan_vote_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("fan_votes.id", ondelete="CASCADE"), nullable=False)
    rating: Mapped[float] = mapped_column(Float, nullable=False)
    weight: Mapped[float] = mapped_column(Float, nullable=False)
    reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    fan_vote: Mapped["FanVote"] = relationship("FanVote", back_populates="versions")

class FanVoteAggregate(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "fan_vote_aggregates"

    entity_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("entities.id", ondelete="CASCADE"), nullable=False)
    category_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    aggregate_score: Mapped[float] = mapped_column(Float, nullable=False) # Normalized 0-100
    vote_count: Mapped[int] = mapped_column(Integer, default=0)
    last_updated: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint('entity_id', 'category_id', name='_entity_category_aggregate_uc'),
    )

class VoteAnomaly(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "vote_anomalies"

    entity_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("entities.id", ondelete="CASCADE"), nullable=False)
    anomaly_type: Mapped[str] = mapped_column(String(50), nullable=False) # surge, clustering, bot
    severity: Mapped[float] = mapped_column(Float, default=1.0)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    is_resolved: Mapped[bool] = mapped_column(Boolean, default=False)
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=True)
