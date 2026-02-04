from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Request
from app.api.v1.middleware.security import limiter
from sqlalchemy.orm import Session
from app.core import security
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, User as UserSchema

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
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    db_user = User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role or "user",
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
