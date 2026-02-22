from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.debate import Debate
from app.services.debate import debate_service

router = APIRouter()


@router.get("/", response_model=List[Debate])
def read_debates(
    db: Session = Depends(get_db),
    category_id: Optional[UUID] = Query(default=None, alias="categoryId"),
    trending: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
):
    return debate_service.get_debates(
        db,
        category_id=category_id,
        trending=trending,
        skip=skip,
        limit=limit,
    )


@router.get("/{debate_id}", response_model=Debate)
def read_debate(debate_id: UUID, db: Session = Depends(get_db)):
    debate = debate_service.get_debate(db, debate_id=debate_id)
    if not debate:
        raise HTTPException(status_code=404, detail="Debate not found")
    return debate
