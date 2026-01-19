import requests
import uuid
import time

BASE_URL = "http://localhost:8000/api/v1"

def test_scoring_pipeline():
    print("Starting Scoring Engine Verification...")
    
    # 1. Create Category
    cat_name = f"Sports_{uuid.uuid4().hex[:4]}"
    cat_res = requests.post(f"{BASE_URL}/categories/", json={
        "name": cat_name,
        "description": "Athletic competitions",
        "slug": cat_name.lower()
    })
    category = cat_res.json()
    cat_id = category["id"]
    print(f"Created Category: {cat_name} ({cat_id})")

    # 2. Create SubCategory
    sub_res = requests.post(f"{BASE_URL}/subcategories/", json={
        "name": "Basketball",
        "description": "Hoops",
        "slug": f"basketball_{uuid.uuid4().hex[:4]}",
        "category_id": cat_id
    })
    subcategory = sub_res.json()
    sub_id = subcategory["id"]
    print(f"Created SubCategory: Basketball ({sub_id})")

    # 3. Create Entity
    ent_res = requests.post(f"{BASE_URL}/entities/", json={
        "name": "Michael Jordan",
        "description": "The GOAT",
        "slug": f"mj_{uuid.uuid4().hex[:4]}",
        "subcategory_id": sub_id
    })
    entity = ent_res.json()
    ent_id = entity["id"]
    print(f"Created Entity: Michael Jordan ({ent_id})")

    # 4. Create Scoring Components
    comp1_res = requests.post(f"{BASE_URL}/scoring/components", json={
        "name": "Championships",
        "slug": "championships",
        "normalization_type": "min-max"
    })
    comp1 = comp1_res.json()
    
    comp2_res = requests.post(f"{BASE_URL}/scoring/components", json={
        "name": "MVP Awards",
        "slug": "mvps",
        "normalization_type": "min-max"
    })
    comp2 = comp2_res.json()
    
    comp3_res = requests.post(f"{BASE_URL}/scoring/components", json={
        "name": "Fan Vote",
        "slug": "fan_vote",
        "is_subjective": True
    })
    comp3 = comp3_res.json()
    print("Created Scoring Components")

    # 5. Create Scoring Model
    model_res = requests.post(f"{BASE_URL}/scoring/models", json={
        "name": "NBA GOAT Model",
        "version": "1.0",
        "category_id": cat_id,
        "weights": [
            {"component_id": comp1["id"], "weight": 0.5},
            {"component_id": comp2["id"], "weight": 0.3},
            {"component_id": comp3["id"], "weight": 0.2}
        ]
    })
    model = model_res.json()
    print(f"Created Scoring Model: {model['name']} v{model['version']}")

    # 6. Submit Raw Scores
    requests.post(f"{BASE_URL}/scoring/raw-scores", json={
        "entity_id": ent_id,
        "component_id": comp1["id"],
        "value": 6.0
    })
    requests.post(f"{BASE_URL}/scoring/raw-scores", json={
        "entity_id": ent_id,
        "component_id": comp2["id"],
        "value": 5.0
    })
    requests.post(f"{BASE_URL}/scoring/raw-scores", json={
        "entity_id": ent_id,
        "component_id": comp3["id"],
        "value": 95.0
    })
    print("Submitted Raw Scores")

    # 7. Run Scoring
    print("Running Scoring...")
    run_res = requests.post(f"{BASE_URL}/scoring/run/{cat_id}")
    final_scores = run_res.json()
    
    for fs in final_scores:
        print(f"\nFinal Score for {ent_id}: {fs['score']}")
        print(f"Breakdown: {fs['breakdown']}")
        print(f"Explanation: {fs['explanation']}")

    # 8. Create Snapshot
    snap_res = requests.post(f"{BASE_URL}/scoring/snapshots/{cat_id}?label=Initial_Test")
    snapshot = snap_res.json()
    print(f"\nCreated Snapshot: {snapshot['label']}")
    print(f"Data: {snapshot['snapshot_data']}")

if __name__ == "__main__":
    test_scoring_pipeline()
