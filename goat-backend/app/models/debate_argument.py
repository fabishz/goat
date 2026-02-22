from typing import Optional
import uuid
from sqlalchemy import String, Text, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin, SoftDeleteMixin


class DebateArgument(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "debate_arguments"

    debate_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("debates.id", ondelete="CASCADE"), index=True, nullable=False
    )
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True
    )
    user_name: Mapped[str] = mapped_column(String(255), nullable=False)
    user_avatar: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)

    content: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(String(8), nullable=False)  # pro | con
    upvotes: Mapped[int] = mapped_column(Integer, default=0)
    downvotes: Mapped[int] = mapped_column(Integer, default=0)

    debate = relationship("Debate", back_populates="arguments")

    def __repr__(self) -> str:
        return f"<DebateArgument(debate_id={self.debate_id}, type={self.type})>"
