from typing import List, TYPE_CHECKING
from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin, SoftDeleteMixin
import uuid

if TYPE_CHECKING:
    from app.models.subcategory import SubCategory
    from app.models.achievement import Achievement
    from app.models.award import Award
    from app.models.category import Category


class Entity(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "entities"

    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    image_url: Mapped[str] = mapped_column(String(512), nullable=False)
    
    category_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("categories.id", ondelete="CASCADE"), index=True, nullable=False
    )
    subcategory_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("subcategories.id", ondelete="CASCADE"), nullable=False
    )

    category: Mapped["Category"] = relationship("Category")
    subcategory: Mapped["SubCategory"] = relationship("SubCategory", back_populates="entities")
    achievements: Mapped[List["Achievement"]] = relationship(
        "Achievement", back_populates="entity", cascade="all, delete-orphan"
    )
    awards: Mapped[List["Award"]] = relationship(
        "Award", back_populates="entity", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Entity(name={self.name})>"
