import math
from typing import List, Dict, Any, Optional
from uuid import UUID
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from app.models.scoring import ScoringModel, ScoringComponent, ScoringWeight, RawScore, FinalScore, RankingSnapshot
from app.models.expert import ExpertVote, ExpertScoreContribution, Expert
from app.models.entity import Entity


class ScoringService:
    def normalize_value(self, value: float, min_val: float, max_val: float, method: str = "min-max") -> float:
        """
        Normalizes a value to a 0-1 scale.
        """
        if max_val == min_val:
            return 1.0 if value >= max_val else 0.0
            
        if method == "min-max":
            normalized = (value - min_val) / (max_val - min_val)
        elif method == "log":
            # Log scaling for metrics with extreme outliers (e.g. social media followers)
            normalized = math.log(value + 1) / math.log(max_val + 1)
        else:
            # Default to min-max
            normalized = (value - min_val) / (max_val - min_val)
            
        return max(0.0, min(1.0, normalized))

    def calculate_era_adjustment(self, db: Session, component_id: UUID, era_id: str, value: float) -> float:
        """
        Adjusts a score relative to the era average to ensure cross-generational fairness.
        """
        avg_query = select(func.avg(RawScore.value)).where(
            RawScore.component_id == component_id,
            RawScore.era_id == era_id
        )
        era_avg = db.execute(avg_query).scalar() or 1.0
        
        # Relative performance: how much better than the era average was this entity?
        return value / era_avg

    def run_scoring_for_category(self, db: Session, category_id: UUID, model_id: Optional[UUID] = None) -> List[FinalScore]:
        """
        Runs the full scoring pipeline for all entities in a category.
        """
        # 1. Get the active scoring model
        if model_id:
            model = db.get(ScoringModel, model_id)
        else:
            model_query = select(ScoringModel).where(
                ScoringModel.category_id == category_id,
                ScoringModel.is_active == True
            )
            model = db.execute(model_query).scalar_one_or_none()

        if not model:
            raise ValueError("No active scoring model found for this category")

        # 2. Get all entities in this category (via subcategories)
        # For simplicity, we'll assume we can fetch them directly or via a join
        # In a real app, we'd use a more complex join
        entities_query = select(Entity).join(Entity.subcategory).where(
            Entity.subcategory.has(category_id=category_id)
        )
        entities = db.execute(entities_query).scalars().all()

        results = []
        
        # 3. For each entity, calculate the score
        for entity in entities:
            total_score = 0.0
            breakdown = {}
            explanations = []

            for sw in model.weights:
                component = sw.component
                weight = sw.weight
                
                # Get raw score for this entity and component
                raw_score_query = select(RawScore).where(
                    RawScore.entity_id == entity.id,
                    RawScore.component_id == component.id
                ).order_by(RawScore.created_at.desc())
                raw_score_obj = db.execute(raw_score_query).scalar_one_or_none()
                
                if not raw_score_obj:
                    breakdown[component.slug] = 0.0
                    continue

                raw_value = raw_score_obj.value
                
                # Apply Era Adjustment if era_id is present
                if raw_score_obj.era_id:
                    adjusted_value = self.calculate_era_adjustment(db, component.id, raw_score_obj.era_id, raw_value)
                    explanations.append(f"{component.name}: Era adjusted from {raw_value} to {adjusted_value:.2f}")
                    raw_value = adjusted_value

                # Get min/max for normalization across all entities for this component
                stats_query = select(func.min(RawScore.value), func.max(RawScore.value)).where(
                    RawScore.component_id == component.id
                )
                min_val, max_val = db.execute(stats_query).one()
                
                normalized_val = self.normalize_value(
                    raw_value, 
                    min_val or 0.0, 
                    max_val or 1.0, 
                    method=component.normalization_type
                )
                
                # Popularity Cap: If subjective and exceeds 10% of total weight, cap it
                # (This is a simplified implementation of the cap)
                effective_weight = weight
                if component.is_subjective and weight > 0.1:
                    effective_weight = 0.1
                    explanations.append(f"{component.name}: Popularity weight capped at 10%")

                component_contribution = normalized_val * effective_weight * 100
                total_score += component_contribution
                breakdown[component.slug] = round(component_contribution, 2)

            # 4. Integrate Expert Votes
            expert_votes_query = select(ExpertVote).where(
                and_(
                    ExpertVote.entity_id == entity.id,
                    ExpertVote.scoring_model_id == model.id
                )
            )
            expert_votes = db.execute(expert_votes_query).scalars().all()
            
            if expert_votes:
                expert_total = 0.0
                expert_weight_sum = 0.0
                
                for ev in expert_votes:
                    # Calculate weight based on reputation and confidence
                    # (Simplified: using a base weight of 1.0 for now)
                    ev_weight = ev.confidence * ev.expert.reputation_score
                    expert_total += ev.score * ev_weight
                    expert_weight_sum += ev_weight
                
                if expert_weight_sum > 0:
                    avg_expert_score = (expert_total / expert_weight_sum) * 10 # Scale 0-10 to 0-100
                    
                    # Expert influence is capped at 20% of the final score
                    expert_influence_weight = 0.2
                    total_score = (total_score * (1 - expert_influence_weight)) + (avg_expert_score * expert_influence_weight)
                    
                    breakdown["expert_influence"] = round(avg_expert_score * expert_influence_weight, 2)
                    explanations.append(f"Expert Influence: {len(expert_votes)} votes aggregated (20% weight)")

            # 5. Save Final Score
            final_score = FinalScore(
                entity_id=entity.id,
                scoring_model_id=model.id,
                score=round(total_score, 2),
                breakdown=breakdown,
                explanation=" | ".join(explanations)
            )
            db.add(final_score)
            results.append(final_score)

        db.commit()
        return results

    def create_snapshot(self, db: Session, category_id: UUID, label: str) -> RankingSnapshot:
        """
        Creates an immutable snapshot of the current rankings.
        """
        # Get latest final scores for this category
        query = select(FinalScore).join(Entity, FinalScore.entity_id == Entity.id).join(
            Entity.subcategory
        ).where(
            Entity.subcategory.has(category_id=category_id)
        ).order_by(FinalScore.score.desc())
        
        scores = db.execute(query).scalars().all()
        
        if not scores:
            raise ValueError("No scores found to create a snapshot for this category")
            
        snapshot_data = [
            {
                "entity_name": s.entity.name,
                "score": s.score,
                "breakdown": s.breakdown,
                "rank": i + 1
            }
            for i, s in enumerate(scores)
        ]
        
        snapshot = RankingSnapshot(
            category_id=category_id,
            scoring_model_id=scores[0].scoring_model_id if scores else None,
            snapshot_data=snapshot_data,
            label=label
        )
        db.add(snapshot)
        db.commit()
        db.refresh(snapshot)
        return snapshot


scoring_service = ScoringService()
