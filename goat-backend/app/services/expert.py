from typing import List, Optional, Dict, Any
from uuid import UUID
from sqlalchemy import select, func, and_
from sqlalchemy.orm import Session
from app.models.expert import Expert, ExpertDomain, ExpertVote, ExpertReputationEvent, ConflictDisclosure, ExpertRole
from app.models.user import User
from app.schemas.expert import ExpertCreate, ExpertVoteCreate, ConflictDisclosureCreate


class ExpertService:
    def create_expert(self, db: Session, expert_in: ExpertCreate) -> Expert:
        user = db.get(User, expert_in.user_id)
        if not user:
            raise ValueError("Linked user not found")

        db_expert = Expert(
            user_id=expert_in.user_id,
            name=expert_in.name,
            bio=expert_in.bio,
            credentials=expert_in.credentials,
            role=expert_in.role
        )
        db.add(db_expert)
        db.flush()

        for domain_in in expert_in.domains:
            db_domain = ExpertDomain(
                expert_id=db_expert.id,
                category_id=domain_in.category_id,
                expertise_level=domain_in.expertise_level
            )
            db.add(db_domain)
        
        db.commit()
        db.refresh(db_expert)
        return db_expert

    def submit_vote(self, db: Session, expert_id: UUID, vote_in: ExpertVoteCreate) -> ExpertVote:
        # 1. Check if expert is active and verified
        expert = db.get(Expert, expert_id)
        if not expert or not expert.is_active or not expert.verification_status:
            raise ValueError("Expert is not active or verified")

        # 2. Check domain match
        # (Simplified: check if expert has a domain entry for the category of the entity)
        # In a real app, we'd look up the entity's category
        
        # 3. Check frequency limit (anti-spam)
        existing_vote = db.execute(
            select(ExpertVote).where(
                and_(
                    ExpertVote.expert_id == expert_id,
                    ExpertVote.entity_id == vote_in.entity_id,
                    ExpertVote.scoring_model_id == vote_in.scoring_model_id
                )
            )
        ).scalar_one_or_none()
        
        if existing_vote:
            raise ValueError("Expert has already voted for this entity in this model version")

        # 4. Create vote
        db_vote = ExpertVote(
            expert_id=expert_id,
            **vote_in.model_dump()
        )
        db.add(db_vote)
        db.commit()
        db.refresh(db_vote)
        return db_vote

    def calculate_expert_weight(self, db: Session, expert_id: UUID, category_id: UUID, confidence: float) -> float:
        expert = db.get(Expert, expert_id)
        if not expert:
            return 0.0
            
        # Base weight (conceptual, can be adjusted)
        base_weight = 1.0
        
        # Reputation factor (0.5 to 1.5)
        reputation_factor = max(0.5, min(1.5, expert.reputation_score))
        
        # Domain match factor
        domain_match = db.execute(
            select(ExpertDomain.expertise_level).where(
                and_(
                    ExpertDomain.expert_id == expert_id,
                    ExpertDomain.category_id == category_id
                )
            )
        ).scalar() or 0.0
        
        # Final weight formula
        return base_weight * reputation_factor * confidence * domain_match

expert_service = ExpertService()
