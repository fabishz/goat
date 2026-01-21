import pytest
from uuid import uuid4

def test_create_category(client):
    response = client.post("/api/v1/categories/", json={
        "name": "IntegrationTestCat",
        "domain": "Sports",
        "description": "Testing API",
        "slug": "integration-test-cat"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "IntegrationTestCat"
    assert "id" in data

def test_create_scoring_model(client):
    # 1. Create Category
    cat_res = client.post("/api/v1/categories/", json={
        "name": "ModelTestCat",
        "domain": "Sports",
        "slug": "model-test-cat"
    })
    cat_id = cat_res.json()["id"]
    
    # 2. Create Component
    comp_res = client.post("/api/v1/scoring/components", json={
        "name": "TestComp",
        "slug": "test-comp",
        "normalization_type": "min-max"
    })
    comp_id = comp_res.json()["id"]
    
    # 3. Create Model
    model_res = client.post("/api/v1/scoring/models", json={
        "name": "TestModel",
        "version": "1.0",
        "category_id": cat_id,
        "weights": [{"component_id": comp_id, "weight": 1.0}]
    })
    assert model_res.status_code == 200
    data = model_res.json()
    assert data["name"] == "TestModel"
    assert len(data["weights"]) == 1

def test_run_scoring_api(client):
    # 1. Setup Data
    cat_res = client.post("/api/v1/categories/", json={"name": "RunScoreCat", "domain": "Sports", "slug": "run-score-cat"})
    cat_id = cat_res.json()["id"]
    
    sub_res = client.post("/api/v1/subcategories/", json={"name": "Sub", "slug": "sub", "category_id": cat_id})
    sub_id = sub_res.json()["id"]
    
    ent_res = client.post("/api/v1/entities/", json={
        "name": "Ent", 
        "slug": "ent", 
        "subcategory_id": sub_id,
        "category_id": cat_id,
        "image_url": "https://example.com/image.jpg"
    })
    ent_id = ent_res.json()["id"]
    
    comp_res = client.post("/api/v1/scoring/components", json={"name": "Comp", "slug": "comp", "normalization_type": "min-max"})
    comp_id = comp_res.json()["id"]
    
    client.post("/api/v1/scoring/models", json={
        "name": "Model", "version": "1.0", "category_id": cat_id,
        "weights": [{"component_id": comp_id, "weight": 1.0}]
    })
    
    # 2. Submit Score
    client.post("/api/v1/scoring/raw-scores", json={
        "entity_id": ent_id, "component_id": comp_id, "value": 100.0
    })
    
    # 3. Run Scoring
    res = client.post(f"/api/v1/scoring/run/{cat_id}", json={})
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 1
    assert data[0]["score"] == 100.0
