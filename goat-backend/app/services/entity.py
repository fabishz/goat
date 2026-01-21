from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.repositories.core import entity_repo
from app.models.entity import Entity
from app.schemas.core import EntityCreate, EntityUpdate


class EntityService:
    def get_entity(self, db: Session, entity_id: UUID) -> Optional[Entity]:
        return entity_repo.get(db, entity_id)

    def get_entities(self, db: Session, skip: int = 0, limit: int = 100) -> List[Entity]:
        return entity_repo.get_multi(db, skip=skip, limit=limit)

    def create_entity(self, db: Session, entity_in: EntityCreate) -> Entity:
        return entity_repo.create(db, obj_in=entity_in.model_dump())

    def update_entity(self, db: Session, entity_id: UUID, entity_in: EntityUpdate) -> Optional[Entity]:
        db_obj = entity_repo.get(db, entity_id)
        if not db_obj:
            return None
        return entity_repo.update(db, db_obj=db_obj, obj_in=entity_in)

    def delete_entity(self, db: Session, entity_id: UUID) -> Optional[Entity]:
        db_obj = entity_repo.get(db, entity_id)
        if not db_obj:
            return None
        return entity_repo.remove(db, id=entity_id)


entity_service = EntityService()
