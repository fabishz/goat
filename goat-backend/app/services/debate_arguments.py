from typing import List
from uuid import UUID
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from app.models.debate import Debate
from app.models.debate_argument import DebateArgument
from app.schemas.debate_argument import DebateArgumentCreate
from app.models.user import User


class DebateArgumentService:
    def get_arguments(self, db: Session, debate_id: UUID) -> List[DebateArgument]:
        stmt = select(DebateArgument).where(
            DebateArgument.debate_id == debate_id,
            DebateArgument.deleted_at.is_(None),
        )
        return db.execute(stmt).scalars().all()

    def create_argument(
        self,
        db: Session,
        debate_id: UUID,
        argument_in: DebateArgumentCreate,
        user: User | None = None,
    ) -> DebateArgument:
        debate = db.execute(
            select(Debate).where(Debate.id == debate_id, Debate.deleted_at.is_(None))
        ).scalar_one_or_none()
        if not debate:
            raise ValueError("Debate not found")

        user_name = argument_in.user_name
        user_avatar = argument_in.user_avatar
        user_id = None
        if user is not None:
            user_id = user.id
            if not user_name:
                user_name = user.full_name or user.email.split("@")[0]
            if not user_avatar:
                user_avatar = f"https://api.dicebear.com/7.x/avataaars/svg?seed={user.id}"

        if not user_name:
            user_name = "Anonymous"

        argument = DebateArgument(
            debate_id=debate_id,
            user_id=user_id,
            user_name=user_name,
            user_avatar=user_avatar,
            content=argument_in.content,
            type=argument_in.type,
            upvotes=0,
            downvotes=0,
        )
        db.add(argument)

        debate.comments = (debate.comments or 0) + 1
        db.add(debate)
        db.commit()
        db.refresh(argument)
        return argument

    def vote_argument(
        self,
        db: Session,
        debate_id: UUID,
        argument_id: UUID,
        direction: str,
    ) -> DebateArgument:
        argument = db.execute(
            select(DebateArgument).where(
                DebateArgument.id == argument_id,
                DebateArgument.debate_id == debate_id,
                DebateArgument.deleted_at.is_(None),
            )
        ).scalar_one_or_none()
        if not argument:
            raise ValueError("Argument not found")

        if direction == "up":
            argument.upvotes = (argument.upvotes or 0) + 1
        elif direction == "down":
            argument.downvotes = (argument.downvotes or 0) + 1
        else:
            raise ValueError("Invalid vote direction")

        db.add(argument)
        db.commit()
        db.refresh(argument)
        return argument


debate_argument_service = DebateArgumentService()
