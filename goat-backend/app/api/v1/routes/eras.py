from typing import List, Dict
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.era import Era, EraCreate, EraUpdate, EraFactor, EraFactorCreate
from app.services.era import era_service
from app.models.era import Era as EraDB, EraFactor as EraFactorDB

router = APIRouter()


@router.post("/", response_model=Era)
def create_era(
    *,
    db: Session = Depends(get_db),
    era_in: EraCreate
):
    db_obj = EraDB(**era_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


@router.get("/", response_model=List[Era])
def read_eras(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    from sqlalchemy import select
    return db.execute(select(EraDB).offset(skip).limit(limit)).scalars().all()


@router.post("/factors", response_model=EraFactor)
def create_era_factor(
    *,
    db: Session = Depends(get_db),
    factor_in: EraFactorCreate
):
    db_obj = EraFactorDB(**factor_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


@router.post("/{era_id}/recalculate", response_model=Dict[str, str])
def recalculate_era_factors(
    era_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        era_service.calculate_era_factors(db, era_id)
        return {"status": "success", "message": "Era factors recalculated"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
