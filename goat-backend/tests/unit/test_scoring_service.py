import pytest
from uuid import uuid4
from app.services.scoring import scoring_service
from app.models.scoring import RawScore, ScoringComponent, ScoringModel, ScoringWeight, FinalScore
from app.models.entity import Entity
from app.models.category import Category
from app.models.subcategory import SubCategory
from app.models.era import Era, EraFactor

def test_normalize_value_min_max():
    # Test standard min-max
    assert scoring_service.normalize_value(50, 0, 100, "min-max") == 0.5
    assert scoring_service.normalize_value(0, 0, 100, "min-max") == 0.0
    assert scoring_service.normalize_value(100, 0, 100, "min-max") == 1.0
    
    # Test clamping
    assert scoring_service.normalize_value(150, 0, 100, "min-max") == 1.0
    assert scoring_service.normalize_value(-50, 0, 100, "min-max") == 0.0
    
    # Test zero range
    assert scoring_service.normalize_value(50, 100, 100, "min-max") == 0.0 # Should be 0 or 1 depending on logic, implementation says 1 if >= max else 0

def test_normalize_value_log():
    # Log scaling: log(val + 1) / log(max + 1)
    # log(100+1) / log(100+1) = 1.0
    assert scoring_service.normalize_value(100, 0, 100, "log") == 1.0
    # log(0+1) / log(100+1) = 0.0
    assert scoring_service.normalize_value(0, 0, 100, "log") == 0.0

def test_calculate_era_adjustment(db):
    # Setup
    era_id = uuid4()
    comp_id = uuid4()
    
    # Mock EraFactor
    factor = EraFactor(
        id=uuid4(),
        era_id=era_id,
        component_id=comp_id,
        mean_value=25.0,
        std_dev=5.0,
        multiplier=1.0
    )
    db.add(factor)
    db.commit()
    
    # Test adjustment: value / mean
    # 50 / 25 = 2.0
    adj = scoring_service.calculate_era_adjustment(db, comp_id, era_id, 50.0)
    assert adj == 2.0

def test_run_scoring_full_flow(db):
    # 1. Setup Data
    cat = Category(name="TestCat", slug="testcat")
    db.add(cat)
    db.commit()
    
    sub = SubCategory(name="TestSub", slug="testsub", category_id=cat.id)
    db.add(sub)
    db.commit()
    
    entity = Entity(name="TestEntity", slug="testentity", subcategory_id=sub.id)
    db.add(entity)
    db.commit()
    
    comp = ScoringComponent(name="TestComp", slug="testcomp", normalization_type="min-max")
    db.add(comp)
    db.commit()
    
    model = ScoringModel(name="TestModel", version="1.0", category_id=cat.id, is_active=True)
    db.add(model)
    db.commit()
    
    weight = ScoringWeight(scoring_model_id=model.id, component_id=comp.id, weight=1.0)
    db.add(weight)
    db.commit()
    
    # 2. Add Raw Score
    raw = RawScore(entity_id=entity.id, component_id=comp.id, value=100.0)
    db.add(raw)
    db.commit()
    
    # 3. Run Scoring
    results = scoring_service.run_scoring_for_category(db, cat.id)
    
    assert len(results) == 1
    assert results[0].entity_id == entity.id
    # Since min=100, max=100 (only one score), normalized should be 1.0 (if value >= max)
    # 1.0 * 1.0 (weight) * 100 = 100.0
    assert results[0].score == 100.0
    assert results[0].breakdown["testcomp"] == 100.0
