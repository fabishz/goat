from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, ConfigDict

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: Optional[str] = "user"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: UUID
    is_active: bool
    is_superuser: bool
    
    model_config = ConfigDict(from_attributes=True)
