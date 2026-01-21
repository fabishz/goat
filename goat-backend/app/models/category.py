from typing import List, TYPE_CHECKING
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin, SoftDeleteMixin

if TYPE_CHECKING:
    from app.models.subcategory import SubCategory


class Category(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "categories"

    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)

    subcategories: Mapped[List["SubCategory"]] = relationship(
        "SubCategory", back_populates="category", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Category(name={self.name})>"
