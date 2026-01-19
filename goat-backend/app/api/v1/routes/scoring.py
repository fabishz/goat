from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.scoring import (
    ScoringModel, ScoringModelCreate, 
    ScoringComponent, ScoringComponentCreate,
    RawScoreCreate, FinalScoreResponse,
    RankingSnapshotResponse
)
from app.services.scoring import scoring_service
from app.models.scoring import ScoringModel as ScoringModelDB, ScoringComponent as ScoringComponentDB, ScoringWeight

router = APIRouter()


@router.post("/components", response_model=ScoringComponent)
def create_component(
    *,
    db: Session = Depends(get_db),
    component_in: ScoringComponentCreate
):
    db_obj = ScoringComponentDB(**component_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


@router.post("/models", response_model=ScoringModel)
def create_scoring_model(
    *,
    db: Session = Depends(get_db),
    model_in: ScoringModelCreate
):
    # Validate weights sum to 1.0
    total_weight = sum(w.weight for w in model_in.weights)
    if not (0.99 <= total_weight <= 1.01):
        raise HTTPException(status_code=400, detail=f"Weights must sum to 1.0 (current: {total_weight})")

    # Create model
    db_model = ScoringModelDB(
        name=model_in.name,
        version=model_in.version,
        description=model_in.description,
        category_id=model_in.category_id,
        is_active=model_in.is_active
    )
    db.add(db_model)
    db.flush()

    # Create weights
    for w_in in model_in.weights:
        db_weight = ScoringWeight(
            scoring_model_id=db_model.id,
            component_id=w_in.component_id,
            weight=w_in.weight
        )
        db.add(db_weight)
    
    db.commit()
    db.refresh(db_model)
    return db_model


@router.post("/raw-scores", status_code=201)
def submit_raw_score(
    *,
    db: Session = Depends(get_db),
    score_in: RawScoreCreate
):
    from app.models.scoring import RawScore
    db_obj = RawScore(**score_in.model_dump())
    db.add(db_obj)
    db.commit()
    return {"message": "Raw score submitted successfully"}


from app.api import deps
from app.models.user import User

@router.post("/run/{category_id}", response_model=List[FinalScoreResponse])
def run_scoring(
    category_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    try:
        return scoring_service.run_scoring_for_category(db, category_id=category_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/snapshots/{category_id}", response_model=RankingSnapshotResponse)
def create_snapshot(
    category_id: UUID,
    label: str,
    db: Session = Depends(get_db)
):
    return scoring_service.create_snapshot(db, category_id=category_id, label=label)
