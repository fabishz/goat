import math
from typing import List, Dict, Any, Optional, Tuple
from uuid import UUID
from sqlalchemy import select, func, and_
from sqlalchemy.orm import Session
from app.models.scoring import ScoringModel, ScoringComponent, ScoringWeight, RawScore, FinalScore, RankingSnapshot
from app.models.expert import ExpertVote
from app.models.fan_voting import FanVoteAggregate
from app.models.era import EraFactor
from app.models.influence import InfluenceScore, InfluenceModel
from app.models.entity import Entity
from app.services.expert import expert_service


class ScoringService:
    def normalize_value(
        self,
        value: float,
        min_val: Optional[float],
        max_val: Optional[float],
        avg_val: Optional[float],
        std_dev: Optional[float],
        method: str = "min-max",
    ) -> float:
        """
        Normalizes a value to a 0-1 scale using the specified method.
        """
        if min_val is None or max_val is None:
            return 0.0

        if method == "min-max":
            if max_val == min_val:
                return 1.0 if value >= (max_val or 0.0) else 0.0
            normalized = (value - min_val) / (max_val - min_val)
        elif method == "log":
            # Log scaling for metrics with extreme outliers (e.g. social media followers)
            if max_val is None or max_val <= 0:
                return 0.0
            normalized = math.log(max(value, 0.0) + 1) / math.log(max_val + 1)
        elif method == "z-score":
            if avg_val is None or std_dev in (None, 0):
                return 0.5
            z = (value - avg_val) / std_dev
            # Convert z-score to 0-1 via normal CDF approximation
            normalized = 0.5 * (1.0 + math.erf(z / math.sqrt(2.0)))
        else:
            # Default to min-max
            if max_val == min_val:
                return 1.0 if value >= (max_val or 0.0) else 0.0
            normalized = (value - min_val) / (max_val - min_val)

        return max(0.0, min(1.0, normalized))

    def _cap_and_renormalize_weights(self, weights: List[ScoringWeight]) -> Dict[UUID, float]:
        capped: Dict[UUID, float] = {}
        for w in weights:
            weight = w.weight
            if w.component.is_subjective and weight > 0.1:
                weight = 0.1
            capped[w.component_id] = weight

        total = sum(capped.values())
        if total <= 0:
            return capped

        return {component_id: weight / total for component_id, weight in capped.items()}

    def _blend_score(self, base_score: float, overlay_score: float, weight: float) -> float:
        return (base_score * (1 - weight)) + (overlay_score * weight)

    def _latest_raw_scores_subquery(self, entity_ids: List[UUID], component_ids: List[UUID]):
        if not entity_ids or not component_ids:
            return None

        rn = func.row_number().over(
            partition_by=(RawScore.entity_id, RawScore.component_id),
            order_by=RawScore.created_at.desc(),
        ).label("rn")

        return (
            select(
                RawScore.entity_id.label("entity_id"),
                RawScore.component_id.label("component_id"),
                RawScore.value.label("value"),
                RawScore.era_id.label("era_id"),
                rn,
            )
            .where(
                RawScore.entity_id.in_(entity_ids),
                RawScore.component_id.in_(component_ids),
            )
            .subquery()
        )

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

        # 2. Get all entities in this category
        entities_query = select(Entity).where(Entity.category_id == category_id)
        entities = db.execute(entities_query).scalars().all()
        if not entities:
            return []

        entity_ids = [e.id for e in entities]
        component_ids = [w.component_id for w in model.weights]

        # 3. Prepare bulk data
        latest_raw_subq = self._latest_raw_scores_subquery(entity_ids, component_ids)
        if latest_raw_subq is None:
            return []

        latest_raw_rows = db.execute(
            select(latest_raw_subq).where(latest_raw_subq.c.rn == 1)
        ).all()

        latest_raw: Dict[Tuple[UUID, UUID], Dict[str, Any]] = {}
        for row in latest_raw_rows:
            latest_raw[(row.entity_id, row.component_id)] = {
                "value": row.value,
                "era_id": row.era_id,
            }

        stats_rows = db.execute(
            select(
                latest_raw_subq.c.component_id,
                func.min(latest_raw_subq.c.value),
                func.max(latest_raw_subq.c.value),
                func.avg(latest_raw_subq.c.value),
                func.stddev_samp(latest_raw_subq.c.value),
            )
            .where(latest_raw_subq.c.rn == 1)
            .group_by(latest_raw_subq.c.component_id)
        ).all()

        component_stats: Dict[UUID, Dict[str, Optional[float]]] = {
            row.component_id: {
                "min": row[1],
                "max": row[2],
                "avg": row[3],
                "std": row[4],
            }
            for row in stats_rows
        }

        era_mean_rows = db.execute(
            select(
                latest_raw_subq.c.era_id,
                latest_raw_subq.c.component_id,
                func.avg(latest_raw_subq.c.value),
            )
            .where(
                latest_raw_subq.c.rn == 1,
                latest_raw_subq.c.era_id.is_not(None),
            )
            .group_by(latest_raw_subq.c.era_id, latest_raw_subq.c.component_id)
        ).all()

        era_means: Dict[Tuple[UUID, UUID], float] = {
            (row[0], row[1]): row[2] for row in era_mean_rows
        }

        era_factors = db.execute(
            select(EraFactor).where(EraFactor.component_id.in_(component_ids))
        ).scalars().all()
        era_factor_map: Dict[Tuple[UUID, UUID], EraFactor] = {
            (f.era_id, f.component_id): f for f in era_factors
        }

        # External influence datasets
        expert_votes = db.execute(
            select(ExpertVote).where(
                ExpertVote.scoring_model_id == model.id,
                ExpertVote.entity_id.in_(entity_ids),
            )
        ).scalars().all()
        expert_votes_by_entity: Dict[UUID, List[ExpertVote]] = {}
        for vote in expert_votes:
            expert_votes_by_entity.setdefault(vote.entity_id, []).append(vote)

        fan_aggs = db.execute(
            select(FanVoteAggregate).where(
                FanVoteAggregate.category_id == category_id,
                FanVoteAggregate.entity_id.in_(entity_ids),
            )
        ).scalars().all()
        fan_aggs_by_entity = {agg.entity_id: agg for agg in fan_aggs}

        inf_model = db.execute(
            select(InfluenceModel).where(
                and_(
                    InfluenceModel.category_id == category_id,
                    InfluenceModel.is_active == True
                )
            )
        ).scalar_one_or_none()
        inf_scores_by_entity: Dict[UUID, InfluenceScore] = {}
        if inf_model:
            inf_scores = db.execute(
                select(InfluenceScore).where(
                    InfluenceScore.influence_model_id == inf_model.id,
                    InfluenceScore.entity_id.in_(entity_ids),
                )
            ).scalars().all()
            inf_scores_by_entity = {s.entity_id: s for s in inf_scores}

        results = []
        weight_map = self._cap_and_renormalize_weights(model.weights)

        # 4. For each entity, calculate the score
        for entity in entities:
            total_score = 0.0
            breakdown = {}
            explanations = []

            for sw in model.weights:
                component = sw.component
                weight = weight_map.get(component.id, 0.0)
                if component.is_subjective and sw.weight > 0.1:
                    explanations.append(
                        f"{component.name}: Popularity weight capped at 10% and renormalized"
                    )

                raw_key = (entity.id, component.id)
                raw_entry = latest_raw.get(raw_key)
                if not raw_entry:
                    breakdown[component.slug] = 0.0
                    continue

                value = raw_entry["value"]
                stats = component_stats.get(component.id, {})

                normalized_val = self.normalize_value(
                    value,
                    stats.get("min"),
                    stats.get("max"),
                    stats.get("avg"),
                    stats.get("std"),
                    method=component.normalization_type,
                )

                # Apply Era Adjustments (as modifiers to normalized score)
                era_id = raw_entry.get("era_id")
                if era_id:
                    era_factor = era_factor_map.get((era_id, component.id))
                    if era_factor:
                        normalized_val *= era_factor.multiplier
                        explanations.append(
                            f"{component.name}: Era multiplier {era_factor.multiplier} applied"
                        )

                    era_mean = None
                    if era_factor and era_factor.mean_value > 0:
                        era_mean = era_factor.mean_value
                    else:
                        era_mean = era_means.get((era_id, component.id))

                    dominance_factor = 1.0
                    if era_mean and era_mean > 0 and value > 0:
                        dominance_factor = value / era_mean

                    # Clamp to avoid outlier explosions
                    dominance_factor = max(0.5, min(2.0, dominance_factor))
                    normalized_val *= dominance_factor
                    explanations.append(
                        f"{component.name}: Era dominance factor {dominance_factor:.2f} applied"
                    )

                component_contribution = normalized_val * weight * 100
                total_score += component_contribution
                breakdown[component.slug] = round(component_contribution, 2)

            # 4. Integrate Expert Votes
            expert_votes = expert_votes_by_entity.get(entity.id, [])
            if expert_votes:
                expert_total = 0.0
                expert_weight_sum = 0.0
                
                for ev in expert_votes:
                    ev_weight = expert_service.calculate_expert_weight(
                        db, ev.expert_id, category_id, ev.confidence
                    )
                    expert_total += ev.score * ev_weight
                    expert_weight_sum += ev_weight
                
                if expert_weight_sum > 0:
                    avg_expert_score = (expert_total / expert_weight_sum) * 10 # Scale 0-10 to 0-100
                    
                    # Expert influence is capped at 20% of the final score
                    expert_influence_weight = 0.2
                    total_score = self._blend_score(total_score, avg_expert_score, expert_influence_weight)
                    
                    breakdown["expert_influence"] = round(avg_expert_score * expert_influence_weight, 2)
                    explanations.append(f"Expert Influence: {len(expert_votes)} votes aggregated (20% weight)")

            # 5. Integrate Fan Votes
            fan_aggregate = fan_aggs_by_entity.get(entity.id)
            if fan_aggregate:
                # Fan influence is capped at 10% of the final score
                fan_influence_weight = 0.1
                total_score = self._blend_score(total_score, fan_aggregate.aggregate_score, fan_influence_weight)
                
                breakdown["fan_sentiment"] = round(fan_aggregate.aggregate_score * fan_influence_weight, 2)
                explanations.append(f"Fan Sentiment: {fan_aggregate.vote_count} votes aggregated (10% weight)")

            # 6. Integrate Influence Score (AI-Assisted)
            # Fetch active influence model for this category
            if inf_model:
                inf_score = inf_scores_by_entity.get(entity.id)
                if inf_score:
                    # Influence is capped at 15% of the final score
                    inf_weight = 0.15
                    total_score = self._blend_score(total_score, inf_score.total_score, inf_weight)

                    breakdown["ai_influence"] = round(inf_score.total_score * inf_weight, 2)
                    explanations.append(f"AI Influence: {inf_score.total_score:.1f} (15% weight)")

            # 7. Save Final Score
            final_score = db.execute(
                select(FinalScore).where(
                    FinalScore.entity_id == entity.id,
                    FinalScore.scoring_model_id == model.id,
                )
            ).scalar_one_or_none()

            if final_score:
                final_score.score = round(total_score, 2)
                final_score.breakdown = breakdown
                final_score.explanation = " | ".join(explanations)
            else:
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
