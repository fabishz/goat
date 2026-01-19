import requests
import uuid
import time
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_scoring_pipeline():
    print("Starting Scoring Engine Verification...")
    
    def post_check(url, data):
        res = requests.post(url, json=data)
        if res.status_code >= 400:
            print(f"Error at {url}: {res.status_code}")
            print(f"Response: {res.text}")
            res.raise_for_status()
        return res.json()

    try:
        # 1. Create Category
        cat_name = f"Sports_{uuid.uuid4().hex[:4]}"
        category = post_check(f"{BASE_URL}/categories/", {
            "name": cat_name,
            "description": "Athletic competitions",
            "slug": cat_name.lower()
        })
        cat_id = category["id"]
        print(f"Created Category: {cat_name} ({cat_id})")

        # 2. Create SubCategory
        subcategory = post_check(f"{BASE_URL}/subcategories/", {
            "name": "Basketball",
            "description": "Hoops",
            "slug": f"basketball_{uuid.uuid4().hex[:4]}",
            "category_id": cat_id
        })
        sub_id = subcategory["id"]
        print(f"Created SubCategory: Basketball ({sub_id})")

        # 3. Create Entity
        entity = post_check(f"{BASE_URL}/entities/", {
            "name": "Michael Jordan",
            "description": "The GOAT",
            "slug": f"mj_{uuid.uuid4().hex[:4]}",
            "subcategory_id": sub_id
        })
        ent_id = entity["id"]
        print(f"Created Entity: Michael Jordan ({ent_id})")

        # 4. Create Scoring Components
        comp1 = post_check(f"{BASE_URL}/scoring/components", {
            "name": f"Championships_{uuid.uuid4().hex[:4]}",
            "slug": f"championships_{uuid.uuid4().hex[:4]}",
            "normalization_type": "min-max"
        })
        
        comp2 = post_check(f"{BASE_URL}/scoring/components", {
            "name": f"MVP Awards_{uuid.uuid4().hex[:4]}",
            "slug": f"mvps_{uuid.uuid4().hex[:4]}",
            "normalization_type": "min-max"
        })
        
        comp3 = post_check(f"{BASE_URL}/scoring/components", {
            "name": f"Fan Vote_{uuid.uuid4().hex[:4]}",
            "slug": f"fan_vote_{uuid.uuid4().hex[:4]}",
            "is_subjective": True
        })
        print("Created Scoring Components")

        # 5. Create Scoring Model
        model = post_check(f"{BASE_URL}/scoring/models", {
            "name": "NBA GOAT Model",
            "version": "1.0",
            "category_id": cat_id,
            "weights": [
                {"component_id": comp1["id"], "weight": 0.5},
                {"component_id": comp2["id"], "weight": 0.3},
                {"component_id": comp3["id"], "weight": 0.2}
            ]
        })
        print(f"Created Scoring Model: {model['name']} v{model['version']}")

        # 6. Submit Raw Scores
        post_check(f"{BASE_URL}/scoring/raw-scores", {
            "entity_id": ent_id,
            "component_id": comp1["id"],
            "value": 6.0
        })
        post_check(f"{BASE_URL}/scoring/raw-scores", {
            "entity_id": ent_id,
            "component_id": comp2["id"],
            "value": 5.0
        })
        post_check(f"{BASE_URL}/scoring/raw-scores", {
            "entity_id": ent_id,
            "component_id": comp3["id"],
            "value": 95.0
        })
        print("Submitted Raw Scores")

        # 7. Run Scoring
        print("Running Scoring...")
        final_scores = post_check(f"{BASE_URL}/scoring/run/{cat_id}", {})
        
        for fs in final_scores:
            print(f"\nFinal Score for {ent_id}: {fs['score']}")
            print(f"Breakdown: {fs['breakdown']}")
            print(f"Explanation: {fs['explanation']}")

        # 8. Create Snapshot
        print("Creating Snapshot...")
        snapshot = post_check(f"{BASE_URL}/scoring/snapshots/{cat_id}?label=Initial_Test", {})
        print(f"\nCreated Snapshot: {snapshot['label']}")
        print(f"Data: {json.dumps(snapshot['snapshot_data'], indent=2)}")

    except Exception as e:
        print(f"Verification failed: {e}")

if __name__ == "__main__":
    test_scoring_pipeline()
