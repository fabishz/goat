"""
Admin-only audit log route — Accounting pillar of AAA.
Returns paginated audit events for monitoring and compliance.
"""
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.v1 import deps
from app.core.database import get_db
from app.models.audit_log import AuditLog
from app.models.user import User
from app.schemas.audit_log import AuditLogRead

router = APIRouter()


@router.get("/", response_model=List[AuditLogRead])
def list_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser),
    action: Optional[str] = Query(None, description="Filter by action, e.g. auth.login.fail"),
    user_email: Optional[str] = Query(None, description="Filter by user email"),
    success: Optional[bool] = Query(None, description="Filter by success flag"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500),
) -> Any:
    """
    **Admin only.** List audit log entries with optional filters.

    Useful for compliance reviews, security incident investigation,
    and monitoring suspicious activity patterns.
    """
    q = db.query(AuditLog)
    if action:
        q = q.filter(AuditLog.action == action)
    if user_email:
        q = q.filter(AuditLog.user_email.ilike(f"%{user_email}%"))
    if success is not None:
        q = q.filter(AuditLog.success == success)
    return q.order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/me", response_model=List[AuditLogRead])
def list_my_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
) -> Any:
    """
    Return the current user's own audit log (recent login history, actions).
    Available to every authenticated user for self-audit.
    """
    return (
        db.query(AuditLog)
        .filter(AuditLog.user_id == current_user.id)
        .order_by(AuditLog.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
