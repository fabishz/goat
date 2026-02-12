from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import func
from app.api.v1.middleware.security import limiter
from sqlalchemy.orm import Session
from app.core import security
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserUpdate,
    User as UserSchema,
    UserOnboarding,
    UserOnboardingUpdate,
)
from app.api.v1 import deps

router = APIRouter()

@router.post("/", response_model=UserSchema)
@limiter.limit("3/minute")
def create_user(
    *,
    request: Request,
    db: Session = Depends(get_db),
    user_in: UserCreate
) -> Any:
    """
    Create new user.
    """
    email = user_in.email.strip().lower()
    user = (
        db.query(User)
        .filter(func.lower(User.email) == email, User.deleted_at.is_(None))
        .first()
    )
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    db_user = User(
        email=email,
        hashed_password=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role="user",
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/me", response_model=UserSchema)
def update_user_me(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Update own user.
    """
    if user_in.email is not None:
        email = user_in.email.strip().lower()
        user = (
            db.query(User)
            .filter(func.lower(User.email) == email, User.deleted_at.is_(None))
            .first()
        )
        if user and user.id != current_user.id:
            raise HTTPException(
                status_code=400,
                detail="The user with this username already exists in the system.",
            )
        current_user.email = email
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
    if user_in.password is not None:
        current_user.hashed_password = security.get_password_hash(user_in.password)
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/me/onboarding", response_model=UserOnboarding)
def read_user_onboarding(
    *,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user's onboarding progress.
    """
    return UserOnboarding(
        status=current_user.onboarding_status,
        step=current_user.onboarding_step,
    )

@router.put("/me/onboarding", response_model=UserOnboarding)
def update_user_onboarding(
    *,
    db: Session = Depends(get_db),
    onboarding_in: UserOnboardingUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update current user's onboarding progress.
    """
    if onboarding_in.step is not None and onboarding_in.step < 0:
        raise HTTPException(status_code=400, detail="Onboarding step must be >= 0")
    if onboarding_in.status is not None:
        current_user.onboarding_status = onboarding_in.status
    if onboarding_in.step is not None:
        current_user.onboarding_step = onboarding_in.step

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return UserOnboarding(
        status=current_user.onboarding_status,
        step=current_user.onboarding_step,
    )
