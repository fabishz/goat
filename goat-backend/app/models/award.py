from sqlalchemy import String, Text, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin, SoftDeleteMixin
import uuid
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.entity import Entity


class Award(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "awards"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=True)
    organization: Mapped[str] = mapped_column(String(255), nullable=True)
    
    entity_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("entities.id", ondelete="CASCADE"), nullable=False
    )

    entity: Mapped["Entity"] = relationship("Entity", back_populates="awards")

    def __repr__(self) -> str:
        return f"<Award(name={self.name})>"
