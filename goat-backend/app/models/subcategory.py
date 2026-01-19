from typing import List, TYPE_CHECKING
from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin, SoftDeleteMixin
import uuid

if TYPE_CHECKING:
    from app.models.category import Category
    from app.models.entity import Entity


class SubCategory(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "subcategories"

    name: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    
    category_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("categories.id", ondelete="CASCADE"), nullable=False
    )

    category: Mapped["Category"] = relationship("Category", back_populates="subcategories")
    entities: Mapped[List["Entity"]] = relationship(
        "Entity", back_populates="subcategory", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<SubCategory(name={self.name})>"
