from typing import List, Optional, Dict, Any
from uuid import UUID
from sqlalchemy import select, func, and_
from sqlalchemy.orm import Session
from app.models.fan_voting import FanVote, FanVoteVersion, FanVoteAggregate, UserTrustScore, VoteAnomaly
from app.schemas.fan_voting import FanVoteCreate, FanVoteUpdate


class FanVotingService:
    def calculate_trust_score(self, db: Session, user_id: UUID) -> float:
        trust_obj = db.execute(
            select(UserTrustScore).where(UserTrustScore.user_id == user_id)
        ).scalar_one_or_none()
        
        if not trust_obj:
            # Create baseline trust for new user
            trust_obj = UserTrustScore(user_id=user_id, trust_score=1.0)
            db.add(trust_obj)
            db.commit()
            db.refresh(trust_obj)
            
        return trust_obj.trust_score

    def submit_vote(self, db: Session, user_id: UUID, vote_in: FanVoteCreate) -> FanVote:
        # 1. Calculate weight
        trust_score = self.calculate_trust_score(db, user_id)
        # Simplified weight: trust_score * base (1.0)
        weight = trust_score

        # 2. Check for existing vote
        existing_vote = db.execute(
            select(FanVote).where(
                and_(
                    FanVote.user_id == user_id,
                    FanVote.entity_id == vote_in.entity_id,
                    FanVote.category_id == vote_in.category_id
                )
            )
        ).scalar_one_or_none()

        if existing_vote:
            # Version the old vote
            version = FanVoteVersion(
                fan_vote_id=existing_vote.id,
                rating=existing_vote.rating,
                weight=existing_vote.weight,
                reason=vote_in.reason
            )
            db.add(version)
            
            # Update current vote
            existing_vote.rating = vote_in.rating
            existing_vote.weight = weight
            db.add(existing_vote)
            db_vote = existing_vote
        else:
            # Create new vote
            db_vote = FanVote(
                user_id=user_id,
                entity_id=vote_in.entity_id,
                category_id=vote_in.category_id,
                rating=vote_in.rating,
                weight=weight
            )
            db.add(db_vote)
        
        db.commit()
        db.refresh(db_vote)
        
        # 3. Trigger aggregate update (async in production, sync for now)
        self.update_aggregate(db, vote_in.entity_id, vote_in.category_id)
        
        return db_vote

    def update_aggregate(self, db: Session, entity_id: UUID, category_id: UUID):
        # Calculate weighted average
        votes_query = select(FanVote).where(
            and_(
                FanVote.entity_id == entity_id,
                FanVote.category_id == category_id
            )
        )
        votes = db.execute(votes_query).scalars().all()
        
        if not votes:
            return

        total_weighted_rating = sum(v.rating * v.weight for v in votes)
        total_weight = sum(v.weight for v in votes)
        
        if total_weight == 0:
            return

        avg_score = (total_weighted_rating / total_weight) * 10 # Scale 1-10 to 0-100
        
        aggregate = db.execute(
            select(FanVoteAggregate).where(
                and_(
                    FanVoteAggregate.entity_id == entity_id,
                    FanVoteAggregate.category_id == category_id
                )
            )
        ).scalar_one_or_none()
        
        if aggregate:
            aggregate.aggregate_score = avg_score
            aggregate.vote_count = len(votes)
        else:
            aggregate = FanVoteAggregate(
                entity_id=entity_id,
                category_id=category_id,
                aggregate_score=avg_score,
                vote_count=len(votes)
            )
        
        db.add(aggregate)
        db.commit()

fan_voting_service = FanVotingService()
