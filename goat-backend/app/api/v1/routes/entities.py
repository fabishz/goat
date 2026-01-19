from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.core import Entity, EntityCreate, EntityUpdate
from app.services.entity import entity_service

router = APIRouter()


@router.get("/", response_model=List[Entity])
def read_entities(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    return entity_service.get_entities(db, skip=skip, limit=limit)


@router.post("/", response_model=Entity)
def create_entity(
    *,
    db: Session = Depends(get_db),
    entity_in: EntityCreate
):
    return entity_service.create_entity(db, entity_in=entity_in)


@router.get("/{entity_id}", response_model=Entity)
def read_entity(
    entity_id: UUID,
    db: Session = Depends(get_db)
):
    entity = entity_service.get_entity(db, entity_id=entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return entity


@router.put("/{entity_id}", response_model=Entity)
def update_entity(
    *,
    db: Session = Depends(get_db),
    entity_id: UUID,
    entity_in: EntityUpdate
):
    entity = entity_service.update_entity(
        db, entity_id=entity_id, entity_in=entity_in
    )
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return entity


@router.delete("/{entity_id}", response_model=Entity)
def delete_entity(
    entity_id: UUID,
    db: Session = Depends(get_db)
):
    entity = entity_service.delete_entity(db, entity_id=entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return entity
