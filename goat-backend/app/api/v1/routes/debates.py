from typing import List, Optional
import logging
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.debate import Debate
from app.services.debate import debate_service
from app.api.v1.middleware.security import limiter

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/", response_model=List[Debate])
@limiter.limit("120/minute")
def read_debates(
    db: Session = Depends(get_db),
    category_id: Optional[UUID] = Query(default=None, alias="categoryId"),
    trending: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
):
    logger.info(
        "event=debates.list category_id=%s trending=%s skip=%s limit=%s",
        category_id,
        trending,
        skip,
        limit,
    )
    return debate_service.get_debates(
        db,
        category_id=category_id,
        trending=trending,
        skip=skip,
        limit=limit,
    )


@router.get("/{debate_id}", response_model=Debate)
@limiter.limit("120/minute")
def read_debate(debate_id: UUID, db: Session = Depends(get_db)):
    logger.info("event=debates.get debate_id=%s", debate_id)
    debate = debate_service.get_debate(db, debate_id=debate_id)
    if not debate:
        raise HTTPException(status_code=404, detail="Debate not found")
    return debate
