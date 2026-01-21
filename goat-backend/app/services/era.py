import math
from typing import List, Optional, Dict, Any
from uuid import UUID
from sqlalchemy import select, func, and_
from sqlalchemy.orm import Session
from app.models.era import Era, EraFactor, EraAdjustedScore, EraModel
from app.models.scoring import RawScore, ScoringComponent


class EraService:
    def calculate_era_factors(self, db: Session, era_id: UUID):
        """
        Pre-calculates mean and std_dev for all components within an era.
        """
        era = db.get(Era, era_id)
        if not era:
            raise ValueError("Era not found")

        # Get all components used in this category
        components = db.execute(
            select(ScoringComponent)
        ).scalars().all()

        for component in components:
            # Get all raw scores for this component in this era
            scores_query = select(RawScore.value).where(
                and_(
                    RawScore.component_id == component.id,
                    RawScore.era_id == era_id
                )
            )
            scores = db.execute(scores_query).scalars().all()

            if not scores:
                continue

            mean = sum(scores) / len(scores)
            variance = sum((x - mean) ** 2 for x in scores) / len(scores)
            std_dev = math.sqrt(variance) if variance > 0 else 0.1 # Avoid division by zero

            # Update or create EraFactor
            factor = db.execute(
                select(EraFactor).where(
                    and_(
                        EraFactor.era_id == era_id,
                        EraFactor.component_id == component.id
                    )
                )
            ).scalar_one_or_none()

            if factor:
                factor.mean_value = mean
                factor.std_dev = std_dev
            else:
                factor = EraFactor(
                    era_id=era_id,
                    component_id=component.id,
                    mean_value=mean,
                    std_dev=std_dev
                )
                db.add(factor)
        
        db.commit()

    def get_adjusted_value(self, db: Session, entity_id: UUID, era_id: UUID, component_id: UUID, raw_value: float) -> float:
        """
        Calculates the era-adjusted value using Z-score and era multipliers.
        """
        factor = db.execute(
            select(EraFactor).where(
                and_(
                    EraFactor.era_id == era_id,
                    EraFactor.component_id == component_id
                )
            )
        ).scalar_one_or_none()

        if not factor or factor.std_dev == 0:
            return raw_value

        # 1. Calculate Z-Score (Dominance within era)
        z_score = (raw_value - factor.mean_value) / factor.std_dev
        
        # 2. Apply Era Multiplier (Contextual difficulty)
        # For now, we use the multiplier from EraFactor
        adjusted_value = raw_value * factor.multiplier
        
        # 3. Store for audit
        # (Optional: could be done in a separate step to avoid overhead)
        
        return adjusted_value

era_service = EraService()
