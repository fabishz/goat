import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy import String, Text, ForeignKey, Float, JSON, Integer, Boolean, DateTime, func, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin, SoftDeleteMixin

class InfluenceSource(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "influence_sources"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    source_type: Mapped[str] = mapped_column(String(50), nullable=False) # e.g., "structured", "text", "web"
    credibility_score: Mapped[float] = mapped_column(Float, default=0.5) # 0.0 to 1.0
    base_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    events: Mapped[List["InfluenceEvent"]] = relationship("InfluenceEvent", back_populates="source")

class InfluenceModel(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "influence_models"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    version: Mapped[str] = mapped_column(String(20), nullable=False)
    category_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    weights: Mapped[Dict[str, float]] = mapped_column(JSON, default=dict) # e.g., {"breadth": 0.3, "depth": 0.4}
    config: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    category: Mapped["Category"] = relationship("Category")
    scores: Mapped[List["InfluenceScore"]] = relationship("InfluenceScore", back_populates="model")

class InfluenceEvent(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "influence_events"

    entity_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("entities.id", ondelete="CASCADE"), nullable=False)
    source_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("influence_sources.id", ondelete="CASCADE"), nullable=False)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False) # e.g., "mention", "citation", "award"
    description: Mapped[str] = mapped_column(Text, nullable=False)
    event_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    weight: Mapped[float] = mapped_column(Float, default=1.0)
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict) # evidence snippet, url, etc.

    entity: Mapped["Entity"] = relationship("Entity")
    source: Mapped["InfluenceSource"] = relationship("InfluenceSource", back_populates="events")

class InfluenceScore(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "influence_scores"

    entity_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("entities.id", ondelete="CASCADE"), nullable=False)
    influence_model_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("influence_models.id", ondelete="CASCADE"), nullable=False)
    
    breadth_score: Mapped[float] = mapped_column(Float, default=0.0)
    depth_score: Mapped[float] = mapped_column(Float, default=0.0)
    longevity_score: Mapped[float] = mapped_column(Float, default=0.0)
    peer_score: Mapped[float] = mapped_column(Float, default=0.0)
    
    total_score: Mapped[float] = mapped_column(Float, nullable=False) # 0-100
    confidence_score: Mapped[float] = mapped_column(Float, default=0.0) # 0.0 to 1.0
    
    breakdown: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    explanation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    entity: Mapped["Entity"] = relationship("Entity")
    model: Mapped["InfluenceModel"] = relationship("InfluenceModel", back_populates="scores")

    __table_args__ = (
        UniqueConstraint('entity_id', 'influence_model_id', name='_entity_model_uc'),
    )
