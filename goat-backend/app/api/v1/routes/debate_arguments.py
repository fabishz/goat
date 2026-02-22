from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.v1 import deps
from app.models.user import User
from app.schemas.debate_argument import DebateArgument, DebateArgumentCreate
from app.services.debate_arguments import debate_argument_service

router = APIRouter()


@router.get("/{debate_id}/arguments", response_model=List[DebateArgument])
def read_debate_arguments(
    debate_id: UUID,
    db: Session = Depends(get_db),
):
    return debate_argument_service.get_arguments(db, debate_id=debate_id)


@router.post("/{debate_id}/arguments", response_model=DebateArgument)
def create_debate_argument(
    debate_id: UUID,
    argument_in: DebateArgumentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    try:
        return debate_argument_service.create_argument(
            db, debate_id=debate_id, argument_in=argument_in, user=current_user
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
