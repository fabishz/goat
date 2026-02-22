from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy import select
from app.models.debate import Debate as DebateModel
from app.schemas.debate import Debate, DebateGoat, DebateStrongestArguments
from app.schemas.debate_argument import DebateArgument
from app.models.debate_argument import DebateArgument as DebateArgumentModel


class DebateService:
    def get_debates(
        self,
        db: Session,
        category_id: Optional[UUID] = None,
        trending: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Debate]:
        stmt = (
            select(DebateModel)
            .options(
                joinedload(DebateModel.goat1),
                joinedload(DebateModel.goat2),
                selectinload(DebateModel.arguments),
            )
            .where(DebateModel.deleted_at.is_(None))
        )
        if category_id:
            stmt = stmt.where(DebateModel.category_id == category_id)
        if trending is not None:
            stmt = stmt.where(DebateModel.trending.is_(trending))
        stmt = stmt.offset(skip).limit(limit)

        debates = db.execute(stmt).scalars().all()
        return [self._to_schema(d) for d in debates]

    def get_debate(self, db: Session, debate_id: UUID) -> Optional[Debate]:
        stmt = (
            select(DebateModel)
            .options(
                joinedload(DebateModel.goat1),
                joinedload(DebateModel.goat2),
                selectinload(DebateModel.arguments),
            )
            .where(DebateModel.id == debate_id, DebateModel.deleted_at.is_(None))
        )
        debate = db.execute(stmt).scalar_one_or_none()
        if not debate:
            return None
        return self._to_schema(debate)

    def _to_schema(self, debate: DebateModel) -> Debate:
        strongest = None
        if debate.strongest_pro or debate.strongest_con:
            strongest = DebateStrongestArguments(
                pro=debate.strongest_pro or "",
                con=debate.strongest_con or "",
            )

        arguments = [
            DebateArgument.model_validate(arg)
            for arg in (debate.arguments or [])
            if arg.deleted_at is None
        ]

        return Debate(
            id=debate.id,
            title=debate.title,
            goat1=DebateGoat.model_validate(debate.goat1),
            goat2=DebateGoat.model_validate(debate.goat2),
            votes1=debate.votes1,
            votes2=debate.votes2,
            comments=debate.comments,
            trending=debate.trending,
            arguments=arguments,
            ai_summary=debate.ai_summary,
            strongest_arguments=strongest,
        )


debate_service = DebateService()
