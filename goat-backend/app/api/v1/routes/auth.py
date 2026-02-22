"""
Authentication routes — with full AAA integration:

Authentication  : OAuth2 password login + Google OAuth2 redirect flow (stub)
Authorization   : Role-based access returned in /me endpoint
Accounting      : Every login attempt (success or fail) is recorded in AuditLog,
                  plus brute-force protection (lockout after N failures).
"""
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.v1 import deps
from app.api.v1.middleware.security import limiter
from app.core import security
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.schemas.token import Token
from app.schemas.user import User as UserSchema
from app.services.audit import AuditService

router = APIRouter()

# ─── Constants ──────────────────────────────────────────────────────────────────
MAX_FAILED_ATTEMPTS = 5          # lock after N consecutive bad passwords
LOCKOUT_DURATION_MINUTES = 15    # locked for this many minutes


# ─── Password Login ─────────────────────────────────────────────────────────────

@router.post("/login/access-token", response_model=Token)
@limiter.limit("5/minute")
def login_access_token(
    request: Request,
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Any:
    """
    OAuth2 password login.

    **AAA coverage:**
    - AuthN  : password verified with constant-time comparison
    - AuthZ  : active + not-locked-out check
    - Accounting: every attempt (success/fail) written to audit_logs
    - Security: brute-force lockout after MAX_FAILED_ATTEMPTS failures
    """
    email = form_data.username.strip().lower()
    user: User | None = (
        db.query(User)
        .filter(func.lower(User.email) == email, User.deleted_at.is_(None))
        .first()
    )

    # --- Lockout check BEFORE verifying password (prevents timing side-channel) ---
    if user and user.lockout_until and user.lockout_until > datetime.now(timezone.utc):
        AuditService.log_from_request(
            db, "auth.login.blocked",
            request=request,
            user=user,
            detail={"reason": "account_locked"},
            success=False,
            http_status=403,
        )
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account locked. Try again after {user.lockout_until.strftime('%H:%M UTC')}.",
        )

    # --- Verify password (always run to prevent timing attacks even when user=None) ---
    password_ok = security.verify_password(
        form_data.password,
        user.hashed_password if (user and user.hashed_password) else security.DUMMY_PASSWORD_HASH,
    )

    if not user or not password_ok:
        # Record the failure
        if user:
            user.failed_login_attempts = (user.failed_login_attempts or 0) + 1
            if user.failed_login_attempts >= MAX_FAILED_ATTEMPTS:
                user.lockout_until = datetime.now(timezone.utc) + timedelta(minutes=LOCKOUT_DURATION_MINUTES)

        AuditService.log_from_request(
            db, "auth.login.fail",
            request=request,
            user=user,
            user_email=email if not user else None,
            detail={"attempts": user.failed_login_attempts if user else None},
            success=False,
            http_status=401,
        )
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        AuditService.log_from_request(
            db, "auth.login.fail",
            request=request,
            user=user,
            detail={"reason": "inactive_user"},
            success=False,
            http_status=400,
        )
        db.commit()
        raise HTTPException(status_code=400, detail="Inactive user")

    # --- Success: reset failure counters, update accounting fields ---
    user.failed_login_attempts = 0
    user.lockout_until = None
    user.last_login_at = datetime.now(timezone.utc)
    user.login_count = (user.login_count or 0) + 1

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = security.create_access_token(user.id, expires_delta=access_token_expires)

    AuditService.log_from_request(
        db, "auth.login.success",
        request=request,
        user=user,
        detail={"login_count": user.login_count},
        success=True,
        http_status=200,
    )
    db.commit()

    return {"access_token": token, "token_type": "bearer"}


# ─── Google OAuth2 (stub — wire up with Authlib/httpx-oauth) ────────────────────

@router.get("/google/login")
def google_login():
    """
    Redirect the user to Google's consent screen.

    TODO: replace the stub below with a real OAuth2 flow using Authlib:
      1. pip install Authlib httpx
      2. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
      3. Build the authorization_url and redirect.

    Example with Authlib::

        from authlib.integrations.starlette_client import OAuth
        oauth = OAuth()
        oauth.register("google", client_id=..., client_secret=...,
                        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
                        client_kwargs={"scope": "openid email profile"})
        redirect_uri = "http://localhost:8000/api/v1/auth/google/callback"
        return await oauth.google.authorize_redirect(request, redirect_uri)
    """
    raise HTTPException(
        status_code=501,
        detail="Google OAuth2 is not yet configured. "
               "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET and implement the flow.",
    )


@router.get("/google/callback")
def google_callback(request: Request, db: Session = Depends(get_db)):
    """
    Handle the Google OAuth2 callback.

    TODO: Exchange code for token, fetch user profile, upsert User row with google_id,
    issue internal JWT, redirect to frontend.
    """
    raise HTTPException(
        status_code=501,
        detail="Google OAuth2 callback not yet implemented.",
    )


# ─── Current User ────────────────────────────────────────────────────────────────

@router.get("/me", response_model=UserSchema)
def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Return the currently authenticated user's profile including role."""
    return current_user
