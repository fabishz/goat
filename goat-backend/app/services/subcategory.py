from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.repositories.core import subcategory_repo
from app.models.subcategory import SubCategory
from app.schemas.core import SubCategoryCreate, SubCategoryUpdate


class SubCategoryService:
    def get_subcategory(self, db: Session, subcategory_id: UUID) -> Optional[SubCategory]:
        return subcategory_repo.get(db, subcategory_id)

    def get_subcategories(self, db: Session, skip: int = 0, limit: int = 100) -> List[SubCategory]:
        return subcategory_repo.get_multi(db, skip=skip, limit=limit)

    def create_subcategory(self, db: Session, subcategory_in: SubCategoryCreate) -> SubCategory:
        return subcategory_repo.create(db, obj_in=subcategory_in.model_dump())

    def update_subcategory(self, db: Session, subcategory_id: UUID, subcategory_in: SubCategoryUpdate) -> Optional[SubCategory]:
        db_obj = subcategory_repo.get(db, subcategory_id)
        if not db_obj:
            return None
        return subcategory_repo.update(db, db_obj=db_obj, obj_in=subcategory_in)

    def delete_subcategory(self, db: Session, subcategory_id: UUID) -> Optional[SubCategory]:
        db_obj = subcategory_repo.get(db, subcategory_id)
        if not db_obj:
            return None
        return subcategory_repo.remove(db, id=subcategory_id)


subcategory_service = SubCategoryService()
