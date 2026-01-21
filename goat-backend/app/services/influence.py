import math
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from sqlalchemy import select, func, and_, distinct
from sqlalchemy.orm import Session
from app.models.influence import InfluenceSource, InfluenceEvent, InfluenceModel, InfluenceScore
from app.models.entity import Entity
from app.models.scoring import FinalScore

class InfluenceService:
    def calculate_influence_score(self, db: Session, entity_id: UUID, model_id: UUID) -> InfluenceScore:
        """
        Calculates the influence score for an entity based on the given model.
        """
        model = db.get(InfluenceModel, model_id)
        if not model:
            raise ValueError("Influence model not found")

        # Get all events for this entity
        events = db.execute(
            select(InfluenceEvent).where(InfluenceEvent.entity_id == entity_id)
        ).scalars().all()

        if not events:
            return self._create_empty_score(db, entity_id, model_id)

        # 1. Breadth Score: Number of distinct sources / domains
        # Simplified: distinct source types + distinct sources
        distinct_sources = set(e.source_id for e in events)
        breadth_raw = len(distinct_sources)
        breadth_score = min(100.0, breadth_raw * 10.0) # Cap at 10 sources for max score

        # 2. Depth Score: Weighted sum of events
        depth_raw = sum(e.weight for e in events)
        # Logarithmic scaling for depth to handle power laws
        depth_score = min(100.0, math.log(depth_raw + 1) * 20.0)

        # 3. Longevity Score: Time span of influence
        dates = [e.event_date for e in events if e.event_date]
        if dates:
            min_date = min(dates)
            max_date = max(dates)
            years_active = (max_date - min_date).days / 365.25
            longevity_score = min(100.0, years_active * 5.0) # 20 years = 100 score
        else:
            longevity_score = 0.0

        # 4. Peer Score: Mentions by other high-ranking entities
        # For now, we simulate this by looking for "peer_mention" event types
        peer_events = [e for e in events if e.event_type == "peer_mention"]
        peer_raw = sum(e.weight for e in peer_events)
        peer_score = min(100.0, peer_raw * 25.0)

        # Calculate Total Weighted Score
        weights = model.weights
        total_score = (
            (breadth_score * weights.get("breadth", 0.25)) +
            (depth_score * weights.get("depth", 0.25)) +
            (longevity_score * weights.get("longevity", 0.25)) +
            (peer_score * weights.get("peer", 0.25))
        )

        # Confidence Score: Based on data density and source credibility
        avg_credibility = sum(e.source.credibility_score for e in events) / len(events) if events else 0
        data_density_factor = min(1.0, len(events) / 10.0)
        confidence_score = avg_credibility * data_density_factor

        # Create or Update Score
        score_obj = db.execute(
            select(InfluenceScore).where(
                and_(
                    InfluenceScore.entity_id == entity_id,
                    InfluenceScore.influence_model_id == model_id
                )
            )
        ).scalar_one_or_none()

        if not score_obj:
            score_obj = InfluenceScore(
                entity_id=entity_id,
                influence_model_id=model_id
            )
            db.add(score_obj)

        score_obj.breadth_score = breadth_score
        score_obj.depth_score = depth_score
        score_obj.longevity_score = longevity_score
        score_obj.peer_score = peer_score
        score_obj.total_score = total_score
        score_obj.confidence_score = confidence_score
        score_obj.breakdown = {
            "breadth": breadth_score,
            "depth": depth_score,
            "longevity": longevity_score,
            "peer": peer_score,
            "event_count": len(events)
        }
        score_obj.explanation = (
            f"Influence calculated from {len(events)} events. "
            f"Breadth: {breadth_score:.1f}, Depth: {depth_score:.1f}, "
            f"Longevity: {longevity_score:.1f}, Peer: {peer_score:.1f}."
        )

        db.commit()
        db.refresh(score_obj)
        return score_obj

    def _create_empty_score(self, db: Session, entity_id: UUID, model_id: UUID) -> InfluenceScore:
        score = InfluenceScore(
            entity_id=entity_id,
            influence_model_id=model_id,
            total_score=0.0,
            confidence_score=0.0,
            breakdown={},
            explanation="No influence events found."
        )
        db.add(score)
        db.commit()
        db.refresh(score)
        return score

influence_service = InfluenceService()
