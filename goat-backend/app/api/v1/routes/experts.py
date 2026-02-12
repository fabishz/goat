from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.expert import Expert, ExpertCreate, ExpertUpdate, ExpertVote, ExpertVoteCreate, ConflictDisclosure, ConflictDisclosureCreate
from app.services.expert import expert_service
from app.models.expert import Expert as ExpertDB, ConflictDisclosure as ConflictDisclosureDB

router = APIRouter()


@router.post("/", response_model=Expert)
def create_expert(
    *,
    db: Session = Depends(get_db),
    expert_in: ExpertCreate
):
    try:
        return expert_service.create_expert(db, expert_in=expert_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{expert_id}", response_model=Expert)
def read_expert(
    expert_id: UUID,
    db: Session = Depends(get_db)
):
    expert = db.get(ExpertDB, expert_id)
    if not expert:
        raise HTTPException(status_code=404, detail="Expert not found")
    return expert


@router.patch("/{expert_id}", response_model=Expert)
def update_expert(
    *,
    db: Session = Depends(get_db),
    expert_id: UUID,
    expert_in: ExpertUpdate
):
    db_obj = db.get(ExpertDB, expert_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Expert not found")
    
    update_data = expert_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


from app.api.v1 import deps
from app.models.user import User

@router.post("/{expert_id}/votes", response_model=ExpertVote)
def cast_vote(
    expert_id: UUID,
    vote_in: ExpertVoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_expert)
):
    expert = db.get(ExpertDB, expert_id)
    if not expert:
        raise HTTPException(status_code=404, detail="Expert not found")
    if not current_user.is_superuser and expert.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only vote as your linked expert profile",
        )

    try:
        return expert_service.submit_vote(db, expert_id, vote_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{expert_id}/disclosures", response_model=ConflictDisclosure)
def create_disclosure(
    *,
    db: Session = Depends(get_db),
    expert_id: UUID,
    disclosure_in: ConflictDisclosureCreate,
    current_user: User = Depends(deps.get_current_expert),
):
    expert = db.get(ExpertDB, expert_id)
    if not expert:
        raise HTTPException(status_code=404, detail="Expert not found")
    if not current_user.is_superuser and expert.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only disclose conflicts for your linked expert profile",
        )

    db_obj = ConflictDisclosureDB(
        expert_id=expert_id,
        **disclosure_in.model_dump()
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
