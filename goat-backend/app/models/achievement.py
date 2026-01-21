from sqlalchemy import String, Text, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin, SoftDeleteMixin
import uuid
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.entity import Entity


class Achievement(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "achievements"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    date_achieved: Mapped[Date] = mapped_column(Date, nullable=True)
    
    entity_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("entities.id", ondelete="CASCADE"), nullable=False
    )

    entity: Mapped["Entity"] = relationship("Entity", back_populates="achievements")

    def __repr__(self) -> str:
        return f"<Achievement(title={self.title})>"
