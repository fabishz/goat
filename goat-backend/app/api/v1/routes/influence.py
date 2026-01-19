from typing import List, Dict
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.influence import (
    InfluenceSource, InfluenceSourceCreate,
    InfluenceModel, InfluenceModelCreate,
    InfluenceEvent, InfluenceEventCreate,
    InfluenceScore
)
from app.services.influence import influence_service
from app.models.influence import (
    InfluenceSource as InfluenceSourceDB,
    InfluenceModel as InfluenceModelDB,
    InfluenceEvent as InfluenceEventDB
)

router = APIRouter()

# --- Sources ---
@router.post("/sources", response_model=InfluenceSource)
def create_source(
    *,
    db: Session = Depends(get_db),
    source_in: InfluenceSourceCreate
):
    db_obj = InfluenceSourceDB(**source_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/sources", response_model=List[InfluenceSource])
def read_sources(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    from sqlalchemy import select
    return db.execute(select(InfluenceSourceDB).offset(skip).limit(limit)).scalars().all()

# --- Models ---
@router.post("/models", response_model=InfluenceModel)
def create_model(
    *,
    db: Session = Depends(get_db),
    model_in: InfluenceModelCreate
):
    db_obj = InfluenceModelDB(**model_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# --- Events ---
@router.post("/events", response_model=InfluenceEvent)
def create_event(
    *,
    db: Session = Depends(get_db),
    event_in: InfluenceEventCreate
):
    db_obj = InfluenceEventDB(**event_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# --- Scoring ---
@router.post("/calculate/{entity_id}/{model_id}", response_model=InfluenceScore)
def calculate_influence(
    entity_id: UUID,
    model_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        return influence_service.calculate_influence_score(db, entity_id, model_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
