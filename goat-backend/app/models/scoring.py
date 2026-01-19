import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy import String, Text, ForeignKey, Float, JSON, Integer, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin, SoftDeleteMixin


class ScoringModel(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "scoring_models"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    version: Mapped[str] = mapped_column(String(20), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    category_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("categories.id", ondelete="CASCADE"), nullable=False
    )

    weights: Mapped[List["ScoringWeight"]] = relationship(
        "ScoringWeight", back_populates="scoring_model", cascade="all, delete-orphan"
    )
    final_scores: Mapped[List["FinalScore"]] = relationship(
        "FinalScore", back_populates="scoring_model"
    )

    def __repr__(self) -> str:
        return f"<ScoringModel(name={self.name}, version={self.version})>"


class ScoringComponent(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "scoring_components"

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    normalization_type: Mapped[str] = mapped_column(String(50), default="min-max")  # min-max, z-score, log
    is_subjective: Mapped[bool] = mapped_column(Boolean, default=False)

    weights: Mapped[List["ScoringWeight"]] = relationship(
        "ScoringWeight", back_populates="component"
    )

    def __repr__(self) -> str:
        return f"<ScoringComponent(name={self.name})>"


class ScoringWeight(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "scoring_weights"

    scoring_model_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("scoring_models.id", ondelete="CASCADE"), nullable=False
    )
    component_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("scoring_components.id", ondelete="CASCADE"), nullable=False
    )
    weight: Mapped[float] = mapped_column(Float, nullable=False)  # 0.0 to 1.0

    scoring_model: Mapped["ScoringModel"] = relationship("ScoringModel", back_populates="weights")
    component: Mapped["ScoringComponent"] = relationship("ScoringComponent", back_populates="weights")


class RawScore(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "raw_scores"

    entity_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("entities.id", ondelete="CASCADE"), nullable=False
    )
    component_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("scoring_components.id", ondelete="CASCADE"), nullable=False
    )
    value: Mapped[float] = mapped_column(Float, nullable=False)
    era_id: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # For era normalization


class FinalScore(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "final_scores"

    entity_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("entities.id", ondelete="CASCADE"), nullable=False
    )
    scoring_model_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("scoring_models.id", ondelete="CASCADE"), nullable=False
    )
    score: Mapped[float] = mapped_column(Float, nullable=False)  # 0 to 100
    breakdown: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=True)

    scoring_model: Mapped["ScoringModel"] = relationship("ScoringModel", back_populates="final_scores")


class RankingSnapshot(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "ranking_snapshots"

    category_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("categories.id", ondelete="CASCADE"), nullable=False
    )
    scoring_model_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("scoring_models.id", ondelete="CASCADE"), nullable=False
    )
    snapshot_data: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False)
    label: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g. "Year End 2025"
