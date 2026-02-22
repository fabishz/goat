from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.debate_argument import DebateArgument

class DebateGoat(BaseModel):
    id: UUID
    name: str
    image_url: str = Field(serialization_alias="image")
    category_id: UUID = Field(serialization_alias="categoryId")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class DebateStrongestArguments(BaseModel):
    pro: str
    con: str


class Debate(BaseModel):
    id: UUID
    title: str
    goat1: DebateGoat
    goat2: DebateGoat
    votes1: int
    votes2: int
    comments: int
    trending: bool
    arguments: List[DebateArgument] = []
    ai_summary: Optional[str] = Field(default=None, serialization_alias="aiSummary")
    strongest_arguments: Optional[DebateStrongestArguments] = Field(
        default=None, serialization_alias="strongestArguments"
    )

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
