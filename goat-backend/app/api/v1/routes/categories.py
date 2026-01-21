from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.core import Category, CategoryCreate, CategoryUpdate, Entity
from app.schemas.fan_voting import FanVote, FanVoteCreate
from app.services.category import category_service
from app.services.entity import entity_service
from app.services.fan_voting import fan_voting_service
from app.api import deps
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[Category])
def read_categories(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    return category_service.get_categories(db, skip=skip, limit=limit)


@router.post("/", response_model=Category)
def create_category(
    *,
    db: Session = Depends(get_db),
    category_in: CategoryCreate
):
    return category_service.create_category(db, category_in=category_in)


@router.get("/{category_id}", response_model=Category)
def read_category(
    category_id: UUID,
    db: Session = Depends(get_db)
):
    category = category_service.get_category(db, category_id=category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.put("/{category_id}", response_model=Category)
def update_category(
    *,
    db: Session = Depends(get_db),
    category_id: UUID,
    category_in: CategoryUpdate
):
    category = category_service.update_category(
        db, category_id=category_id, category_in=category_in
    )
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.delete("/{category_id}", response_model=Category)
def delete_category(
    category_id: UUID,
    db: Session = Depends(get_db)
):
    category = category_service.delete_category(db, category_id=category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.get("/{category_id}/goats", response_model=List[Entity])
def read_category_goats(
    category_id: UUID,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    return category_service.get_goats(db, category_id=category_id, skip=skip, limit=limit)


@router.get("/{category_id}/goats/{goat_id}", response_model=Entity)
def read_category_goat(
    category_id: UUID,
    goat_id: UUID,
    db: Session = Depends(get_db)
):
    goat = entity_service.get_entity(db, entity_id=goat_id)
    if not goat or goat.category_id != category_id:
        raise HTTPException(status_code=404, detail="GOAT not found in this category")
    return goat


@router.post("/{category_id}/votes", response_model=FanVote)
def submit_category_vote(
    category_id: UUID,
    vote_in: FanVoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    if vote_in.category_id != category_id:
        raise HTTPException(status_code=400, detail="Category ID mismatch")
    
    goat = entity_service.get_entity(db, entity_id=vote_in.entity_id)
    if not goat or goat.category_id != category_id:
        raise HTTPException(status_code=400, detail="GOAT does not belong to this category")
        
    return fan_voting_service.submit_vote(db, user_id=current_user.id, vote_in=vote_in)


@router.post("/{category_id}/debates")
def create_category_debate(
    category_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # Placeholder for debates as the model is not yet implemented
    # but the endpoint is required by the prompt.
    raise HTTPException(status_code=501, detail="Debates feature not yet implemented in backend")
