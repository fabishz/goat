from typing import List
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.category import Category
from app.models.subcategory import SubCategory
from app.models.entity import Entity
from app.models.achievement import Achievement
from app.models.award import Award


class CategoryRepository(BaseRepository[Category]):
    def __init__(self):
        super().__init__(Category)


class SubCategoryRepository(BaseRepository[SubCategory]):
    def __init__(self):
        super().__init__(SubCategory)


class EntityRepository(BaseRepository[Entity]):
    def __init__(self):
        super().__init__(Entity)

    def get_by_category(self, db: Session, category_id: UUID, skip: int = 0, limit: int = 100) -> List[Entity]:
        query = select(self.model).where(self.model.category_id == category_id).offset(skip).limit(limit)
        return db.execute(query).scalars().all()


class AchievementRepository(BaseRepository[Achievement]):
    def __init__(self):
        super().__init__(Achievement)


class AwardRepository(BaseRepository[Award]):
    def __init__(self):
        super().__init__(Award)


category_repo = CategoryRepository()
subcategory_repo = SubCategoryRepository()
entity_repo = EntityRepository()
achievement_repo = AchievementRepository()
award_repo = AwardRepository()
