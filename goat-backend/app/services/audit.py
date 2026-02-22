"""
AuditService — centralised Accounting helper.

Usage:
    from app.services.audit import AuditService
    AuditService.log(db, action="auth.login.success", user=user, request=request)
"""
import json
from typing import Optional
from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog
from app.models.user import User


class AuditService:
    """Static helpers to record audit events into the database."""

    @staticmethod
    def log(
        db: Session,
        action: str,
        *,
        user: Optional[User] = None,
        user_id: Optional[str] = None,
        user_email: Optional[str] = None,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        detail: Optional[dict] = None,
        success: bool = True,
        http_status: Optional[int] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> AuditLog:
        """
        Record an audit event.

        Convenience: pass either a ``user`` ORM instance OR
        ``user_id`` / ``user_email`` separately.
        """
        entry = AuditLog(
            action=action,
            user_id=user.id if user else user_id,
            user_email=user.email if user else user_email,
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id else None,
            detail=json.dumps(detail) if detail else None,
            success=success,
            http_status=http_status,
            ip_address=ip_address,
            user_agent=user_agent,
        )
        db.add(entry)
        db.flush()   # flush so the ID is available; caller is responsible for commit
        return entry

    @staticmethod
    def log_from_request(
        db: Session,
        action: str,
        request,            # FastAPI Request
        *,
        user: Optional[User] = None,
        **kwargs,
    ) -> AuditLog:
        """Convenience wrapper that extracts IP + User-Agent from a FastAPI request."""
        ip = (
            request.headers.get("x-forwarded-for", request.client.host)
            if request.client
            else None
        )
        ua = request.headers.get("user-agent")
        return AuditService.log(
            db,
            action,
            user=user,
            ip_address=ip,
            user_agent=ua,
            **kwargs,
        )
