from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class TimestampSchema(BaseSchema):
    created_at: datetime
    updated_at: datetime


# Category
class CategoryBase(BaseSchema):
    name: str
    domain: str
    description: Optional[str] = None
    slug: str


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseSchema):
    name: Optional[str] = None
    domain: Optional[str] = None
    description: Optional[str] = None
    slug: Optional[str] = None


class Category(CategoryBase, TimestampSchema):
    id: UUID


# SubCategory
class SubCategoryBase(BaseSchema):
    name: str
    description: Optional[str] = None
    slug: str
    category_id: UUID


class SubCategoryCreate(SubCategoryBase):
    pass


class SubCategoryUpdate(BaseSchema):
    name: Optional[str] = None
    description: Optional[str] = None
    slug: Optional[str] = None
    category_id: Optional[UUID] = None


class SubCategory(SubCategoryBase, TimestampSchema):
    id: UUID


# Achievement
class AchievementBase(BaseSchema):
    title: str
    description: Optional[str] = None
    date_achieved: Optional[datetime] = None
    entity_id: UUID


class AchievementCreate(AchievementBase):
    pass


class Achievement(AchievementBase, TimestampSchema):
    id: UUID


# Award
class AwardBase(BaseSchema):
    name: str
    year: Optional[int] = None
    organization: Optional[str] = None
    entity_id: UUID


class AwardCreate(AwardBase):
    pass


class Award(AwardBase, TimestampSchema):
    id: UUID


# Entity
class EntityBase(BaseSchema):
    name: str
    description: Optional[str] = None
    slug: str
    image_url: str
    category_id: UUID
    subcategory_id: UUID


class EntityCreate(EntityBase):
    pass


class EntityUpdate(BaseSchema):
    name: Optional[str] = None
    description: Optional[str] = None
    slug: Optional[str] = None
    image_url: Optional[str] = None
    category_id: Optional[UUID] = None
    subcategory_id: Optional[UUID] = None


class Entity(EntityBase, TimestampSchema):
    id: UUID
    achievements: List[Achievement] = []
    awards: List[Award] = []
