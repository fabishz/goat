from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.fan_voting import FanVote, FanVoteCreate, FanVoteAggregate
from app.services.fan_voting import fan_voting_service
from app.services.entity import entity_service
from app.models.fan_voting import FanVote as FanVoteDB, FanVoteAggregate as FanVoteAggregateDB

router = APIRouter()


from app.api import deps
from app.models.user import User

@router.post("/", response_model=FanVote)
def submit_fan_vote(
    vote_in: FanVoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # Validate that the GOAT belongs to the category
    goat = entity_service.get_entity(db, entity_id=vote_in.entity_id)
    if not goat or goat.category_id != vote_in.category_id:
        raise HTTPException(status_code=400, detail="GOAT does not belong to this category")
        
    return fan_voting_service.submit_vote(db, user_id=current_user.id, vote_in=vote_in)


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
