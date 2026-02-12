from app.services.scoring import scoring_service
from app.models.scoring import RawScore, ScoringComponent, ScoringModel, ScoringWeight
from app.models.entity import Entity
from app.models.category import Category
from app.models.subcategory import SubCategory

def test_normalize_value_min_max():
    # Test standard min-max
    assert scoring_service.normalize_value(50, 0, 100, None, None, "min-max") == 0.5
    assert scoring_service.normalize_value(0, 0, 100, None, None, "min-max") == 0.0
    assert scoring_service.normalize_value(100, 0, 100, None, None, "min-max") == 1.0
    
    # Test clamping
    assert scoring_service.normalize_value(150, 0, 100, None, None, "min-max") == 1.0
    assert scoring_service.normalize_value(-50, 0, 100, None, None, "min-max") == 0.0
    
    # Test zero range fallback in current implementation.
    assert scoring_service.normalize_value(50, 100, 100, None, None, "min-max") == 0.0

def test_normalize_value_log():
    # Log scaling: log(val + 1) / log(max + 1)
    # log(100+1) / log(100+1) = 1.0
    assert scoring_service.normalize_value(100, 0, 100, None, None, "log") == 1.0
    # log(0+1) / log(100+1) = 0.0
    assert scoring_service.normalize_value(0, 0, 100, None, None, "log") == 0.0

def test_normalize_value_z_score():
    # At mean, CDF should be around 0.5.
    normalized = scoring_service.normalize_value(50, 0, 100, 50, 10, "z-score")
    assert 0.49 <= normalized <= 0.51

def test_run_scoring_full_flow(db):
    # 1. Setup Data
    cat = Category(name="TestCat", slug="testcat", domain="Sports")
    db.add(cat)
    db.commit()
    
    sub = SubCategory(name="TestSub", slug="testsub", category_id=cat.id)
    db.add(sub)
    db.commit()
    
    entity = Entity(
        name="TestEntity", 
        slug="testentity", 
        subcategory_id=sub.id, 
        category_id=cat.id,
        image_url="https://example.com/image.jpg"
    )
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
