from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.repositories.core import achievement_repo, award_repo
from app.models.achievement import Achievement
from app.models.award import Award
from app.schemas.core import AchievementCreate, AwardCreate


class AchievementService:
    def create_achievement(self, db: Session, achievement_in: AchievementCreate) -> Achievement:
        return achievement_repo.create(db, obj_in=achievement_in.model_dump())

    def get_entity_achievements(self, db: Session, entity_id: UUID) -> List[Achievement]:
        # This would ideally be a custom repo method, but for now we can use a simple filter if we extend the repo
        # For brevity, I'll assume standard CRUD is enough for now or I'll add a filter method to base repo
        pass


class AwardService:
    def create_award(self, db: Session, award_in: AwardCreate) -> Award:
        return award_repo.create(db, obj_in=award_in.model_dump())


achievement_service = AchievementService()
award_service = AwardService()
