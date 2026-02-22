"""
AuditLog model — the Accounting (AA) pillar of AAA.

Every significant action in the system is recorded here:
  - Authentication events (login success/failure, logout, OAuth)
  - Authorization events (role changes, permission denials)
  - Data mutations (votes, expert approvals, etc.)
"""
import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, DateTime, func, Uuid, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import UUIDMixin


class AuditLog(Base, UUIDMixin):
    """
    Immutable audit trail for every important system event.
    Records are NEVER updated or soft-deleted — only inserted.
    """
    __tablename__ = "audit_logs"

    # --- WHO ---
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    user_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)  # snapshot at event time

    # --- WHAT ---
    action: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
        # e.g. "auth.login.success", "auth.login.fail", "auth.logout",
        #       "auth.google_oauth.success", "authz.role_changed",
        #       "authz.access_denied", "vote.cast", "expert.approved"
    )
    resource_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)   # e.g. "user", "expert", "vote"
    resource_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)     # id of the affected resource
    detail: Mapped[Optional[str]] = mapped_column(Text, nullable=True)                 # free-form JSON or message

    # --- OUTCOME ---
    success: Mapped[bool] = mapped_column(default=True)
    http_status: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # --- CONTEXT ---
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)   # supports IPv6
    user_agent: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)

    # --- WHEN ---
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    # Relationship (optional, use with care to avoid large joins)
    user = relationship("User", backref="audit_logs", foreign_keys=[user_id])
