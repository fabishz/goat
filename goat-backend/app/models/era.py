import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy import String, Text, ForeignKey, Float, JSON, Integer, Boolean, DateTime, func, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin, SoftDeleteMixin

class Era(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "eras"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    category_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    start_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    end_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    context_factors: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    category: Mapped["Category"] = relationship("Category")
    factors: Mapped[List["EraFactor"]] = relationship("EraFactor", back_populates="era", cascade="all, delete-orphan")

class EraModel(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "era_models"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    version: Mapped[str] = mapped_column(String(20), nullable=False)
    category_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    config: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict) # Algorithm weights etc.

    category: Mapped["Category"] = relationship("Category")

class EraFactor(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "era_factors"

    era_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("eras.id", ondelete="CASCADE"), nullable=False)
    component_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("scoring_components.id", ondelete="CASCADE"), nullable=False)
    mean_value: Mapped[float] = mapped_column(Float, nullable=False)
    std_dev: Mapped[float] = mapped_column(Float, nullable=False)
    multiplier: Mapped[float] = mapped_column(Float, default=1.0)

    era: Mapped["Era"] = relationship("Era", back_populates="factors")
    component: Mapped["ScoringComponent"] = relationship("ScoringComponent")

    __table_args__ = (
        UniqueConstraint('era_id', 'component_id', name='_era_component_uc'),
    )

class EraAdjustedScore(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "era_adjusted_scores"

    entity_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("entities.id", ondelete="CASCADE"), nullable=False)
    era_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("eras.id", ondelete="CASCADE"), nullable=False)
    component_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("scoring_components.id", ondelete="CASCADE"), nullable=False)
    raw_value: Mapped[float] = mapped_column(Float, nullable=False)
    adjusted_value: Mapped[float] = mapped_column(Float, nullable=False)
    z_score: Mapped[float] = mapped_column(Float, nullable=True)
    explanation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

class EraAuditLog(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "era_audit_logs"

    era_model_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("era_models.id", ondelete="SET NULL"), nullable=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    details: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=True)
    performed_by: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
