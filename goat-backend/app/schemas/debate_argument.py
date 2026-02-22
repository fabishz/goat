from datetime import datetime
from typing import Optional, Literal
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class DebateArgumentCreate(BaseModel):
    content: str
    type: Literal["pro", "con"]
    user_name: Optional[str] = Field(default=None, alias="userName")
    user_avatar: Optional[str] = Field(default=None, alias="userAvatar")

    model_config = ConfigDict(populate_by_name=True)


class DebateArgumentVote(BaseModel):
    direction: Literal["up", "down"]


class DebateArgument(BaseModel):
    id: UUID
    user_id: Optional[UUID] = Field(default=None, serialization_alias="userId")
    user_name: str = Field(serialization_alias="userName")
    user_avatar: Optional[str] = Field(default=None, serialization_alias="userAvatar")
    content: str
    type: Literal["pro", "con"]
    upvotes: int
    downvotes: int
    created_at: datetime = Field(serialization_alias="createdAt")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
