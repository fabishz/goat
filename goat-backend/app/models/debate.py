from typing import Optional
import uuid
from sqlalchemy import String, Text, ForeignKey, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin, SoftDeleteMixin


class Debate(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "debates"

    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)

    category_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("categories.id", ondelete="CASCADE"), index=True, nullable=False
    )
    goat1_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("entities.id", ondelete="CASCADE"), index=True, nullable=False
    )
    goat2_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("entities.id", ondelete="CASCADE"), index=True, nullable=False
    )

    votes1: Mapped[int] = mapped_column(Integer, default=0)
    votes2: Mapped[int] = mapped_column(Integer, default=0)
    comments: Mapped[int] = mapped_column(Integer, default=0)
    trending: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    ai_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    strongest_pro: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    strongest_con: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    goat1 = relationship("Entity", foreign_keys=[goat1_id])
    goat2 = relationship("Entity", foreign_keys=[goat2_id])
    arguments = relationship(
        "DebateArgument", back_populates="debate", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Debate(title={self.title})>"
