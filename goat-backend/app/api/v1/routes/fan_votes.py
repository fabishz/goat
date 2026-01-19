from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.fan_voting import FanVote, FanVoteCreate, FanVoteAggregate
from app.services.fan_voting import fan_voting_service
from app.models.fan_voting import FanVote as FanVoteDB, FanVoteAggregate as FanVoteAggregateDB

router = APIRouter()


@router.post("/", response_model=FanVote)
def submit_fan_vote(
    *,
    db: Session = Depends(get_db),
    vote_in: FanVoteCreate,
    request: Request
):
    # In a real app, user_id would come from auth token
    # For now, we'll expect it in a header or just use a dummy for testing
    user_id_str = request.headers.get("X-User-ID")
    if not user_id_str:
        raise HTTPException(status_code=401, detail="X-User-ID header required")
    
    try:
        user_id = UUID(user_id_str)
        return fan_voting_service.submit_vote(db, user_id=user_id, vote_in=vote_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/aggregates/{entity_id}/{category_id}", response_model=FanVoteAggregate)
def get_fan_aggregate(
    entity_id: UUID,
    category_id: UUID,
    db: Session = Depends(get_db)
):
    aggregate = db.execute(
        select(FanVoteAggregateDB).where(
            and_(
                FanVoteAggregateDB.entity_id == entity_id,
                FanVoteAggregateDB.category_id == category_id
            )
        )
    ).scalar_one_or_none()
    
    if not aggregate:
        raise HTTPException(status_code=404, detail="Aggregate not found")
    return aggregate
