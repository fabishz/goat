import pytest

def test_full_goat_flow(client):
    """
    E2E Test:
    1. Create Category & SubCategory
    2. Create Entity
    3. Create Scoring Model & Components
    4. Submit Raw Scores
    5. Submit Expert Vote
    6. Submit Fan Vote
    7. Run Scoring
    8. Verify Final Score & Rank
    """
    # 1. Setup Category
    cat_res = client.post("/api/v1/categories/", json={"name": "E2ECat", "slug": "e2e-cat"})
    cat_id = cat_res.json()["id"]
    
    sub_res = client.post("/api/v1/subcategories/", json={"name": "E2ESub", "slug": "e2e-sub", "category_id": cat_id})
    sub_id = sub_res.json()["id"]
    
    # 2. Create Entity
    ent_res = client.post("/api/v1/entities/", json={"name": "GOAT Candidate", "slug": "goat-candidate", "subcategory_id": sub_id})
    ent_id = ent_res.json()["id"]
    
    # 3. Configure Model
    comp_res = client.post("/api/v1/scoring/components", json={"name": "Stats", "slug": "stats", "normalization_type": "min-max"})
    comp_id = comp_res.json()["id"]
    
    model_res = client.post("/api/v1/scoring/models", json={
        "name": "E2EModel", "version": "1.0", "category_id": cat_id,
        "weights": [{"component_id": comp_id, "weight": 1.0}]
    })
    model_id = model_res.json()["id"]
    
    # 4. Submit Raw Score (100.0 -> Normalized 1.0)
    client.post("/api/v1/scoring/raw-scores", json={
        "entity_id": ent_id, "component_id": comp_id, "value": 100.0
    })
    
    # 5. Submit Expert Vote (Weight 20%)
    # Need to create expert first
    expert_res = client.post("/api/v1/experts/", json={
        "name": "Expert", "role": "expert", "domains": [{"category_id": cat_id, "expertise_level": 1.0}]
    })
    expert_id = expert_res.json()["id"]
    
    client.post(f"/api/v1/experts/{expert_id}/votes", json={
        "entity_id": ent_id, "scoring_model_id": model_id, "score": 10.0, "confidence": 1.0, "justification": "Best ever"
    })
    
    # 6. Submit Fan Vote (Weight 10%)
    # Using header for user_id
    from uuid import uuid4
    user_id = str(uuid4())
    client.post("/api/v1/fan-votes/", json={
        "entity_id": ent_id, "category_id": cat_id, "rating": 10.0
    }, headers={"X-User-ID": user_id})
    
    # 7. Run Scoring
    # Expected:
    # Raw (70%): 1.0 * 100 = 100
    # Expert (20%): 10.0 * 10 = 100
    # Fan (10%): 10.0 * 10 = 100
    # Total: 100.0
    
    res = client.post(f"/api/v1/scoring/run/{cat_id}", json={})
    assert res.status_code == 200
    data = res.json()
    
    assert len(data) == 1
    score = data[0]
    assert score["entity_id"] == ent_id
    # Floating point tolerance
    assert abs(score["score"] - 100.0) < 0.1
    assert "expert_influence" in score["breakdown"]
    assert "fan_sentiment" in score["breakdown"]
