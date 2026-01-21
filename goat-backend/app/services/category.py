from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.repositories.core import category_repo, subcategory_repo, entity_repo
from app.models.category import Category
from app.models.entity import Entity
from app.schemas.core import CategoryCreate, CategoryUpdate


class CategoryService:
    def get_category(self, db: Session, category_id: UUID) -> Optional[Category]:
        return category_repo.get(db, category_id)

    def get_categories(self, db: Session, skip: int = 0, limit: int = 100) -> List[Category]:
        return category_repo.get_multi(db, skip=skip, limit=limit)

    def get_goats(self, db: Session, category_id: UUID, skip: int = 0, limit: int = 100) -> List[Entity]:
        return entity_repo.get_by_category(db, category_id=category_id, skip=skip, limit=limit)

    def create_category(self, db: Session, category_in: CategoryCreate) -> Category:
        return category_repo.create(db, obj_in=category_in.model_dump())

    def update_category(self, db: Session, category_id: UUID, category_in: CategoryUpdate) -> Optional[Category]:
        db_obj = category_repo.get(db, category_id)
        if not db_obj:
            return None
        return category_repo.update(db, db_obj=db_obj, obj_in=category_in)

    def delete_category(self, db: Session, category_id: UUID) -> Optional[Category]:
        db_obj = category_repo.get(db, category_id)
        if not db_obj:
            return None
        return category_repo.remove(db, id=category_id)


category_service = CategoryService()
