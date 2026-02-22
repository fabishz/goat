from datetime import datetime
from typing import Optional, Literal
from uuid import UUID
from pydantic import BaseModel, EmailStr, ConfigDict, field_validator
import re

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: Optional[str] = "user"

class UserCreate(UserBase):
    password: str

    @field_validator("password")
    def password_complexity(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one number")
        if not re.search(r"[@$!%*#?&]", v):
            raise ValueError("Password must contain at least one special character (@$!%*#?&)")
        return v

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class User(UserBase):
    id: UUID
    is_active: bool
    is_superuser: bool
    onboarding_status: Literal["not_started", "in_progress", "completed"]
    onboarding_step: int
    # AAA fields
    email_verified: bool = False
    avatar_url: Optional[str] = None
    last_login_at: Optional[datetime] = None
    login_count: int = 0

    model_config = ConfigDict(from_attributes=True)

class UserOnboarding(BaseModel):
    status: Literal["not_started", "in_progress", "completed"]
    step: int

class UserOnboardingUpdate(BaseModel):
    status: Optional[Literal["not_started", "in_progress", "completed"]] = None
    step: Optional[int] = None
