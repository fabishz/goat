from typing import List
import logging
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.v1 import deps
from app.api.v1.middleware.security import limiter
from app.models.user import User
from app.schemas.debate_argument import DebateArgument, DebateArgumentCreate, DebateArgumentVote
from app.services.debate_arguments import debate_argument_service
from app.services.audit import AuditService

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/{debate_id}/arguments", response_model=List[DebateArgument])
@limiter.limit("120/minute")
def read_debate_arguments(
    debate_id: UUID,
    db: Session = Depends(get_db),
):
    logger.info("event=debates.arguments.list debate_id=%s", debate_id)
    return debate_argument_service.get_arguments(db, debate_id=debate_id)


@router.post("/{debate_id}/arguments", response_model=DebateArgument)
@limiter.limit("10/minute")
def create_debate_argument(
    debate_id: UUID,
    argument_in: DebateArgumentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    try:
        logger.info(
            "event=debates.arguments.create debate_id=%s user_id=%s type=%s",
            debate_id,
            current_user.id,
            argument_in.type,
        )
        return debate_argument_service.create_argument(
            db, debate_id=debate_id, argument_in=argument_in, user=current_user
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.post("/{debate_id}/arguments/{argument_id}/vote", response_model=DebateArgument)
@limiter.limit("20/minute")
def vote_debate_argument(
    debate_id: UUID,
    argument_id: UUID,
    vote_in: DebateArgumentVote,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
    request: Request,
):
    try:
        logger.info(
            "event=debates.arguments.vote debate_id=%s argument_id=%s user_id=%s direction=%s",
            debate_id,
            argument_id,
            current_user.id,
            vote_in.direction,
        )
        argument = debate_argument_service.vote_argument(
            db, debate_id=debate_id, argument_id=argument_id, direction=vote_in.direction
        )
        AuditService.log_from_request(
            db,
            "debate.argument.vote",
            request,
            user=current_user,
            resource_type="debate_argument",
            resource_id=argument_id,
            detail={"debate_id": str(debate_id), "direction": vote_in.direction},
            success=True,
            http_status=200,
        )
        db.commit()
        return argument
    except ValueError as exc:
        AuditService.log_from_request(
            db,
            "debate.argument.vote",
            request,
            user=current_user,
            resource_type="debate_argument",
            resource_id=argument_id,
            detail={"debate_id": str(debate_id), "direction": vote_in.direction},
            success=False,
            http_status=404,
        )
        db.commit()
        raise HTTPException(status_code=404, detail=str(exc))
