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
