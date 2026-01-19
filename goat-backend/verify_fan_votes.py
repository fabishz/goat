import requests
import uuid
import time
import json

BASE_URL = "http://localhost:8001/api/v1"

def test_fan_voting_system():
    print("Starting Fan Voting System Verification...")
    
    def post_check(url, data, headers=None):
        res = requests.post(url, json=data, headers=headers)
        if res.status_code >= 400:
            print(f"Error at {url}: {res.status_code}")
            print(f"Response: {res.text}")
            res.raise_for_status()
        return res.json()

    try:
        # 1. Create Category
        cat_name = f"Movies_{uuid.uuid4().hex[:4]}"
        category = post_check(f"{BASE_URL}/categories/", {
            "name": cat_name,
            "description": "Cinema",
            "slug": cat_name.lower()
        })
        cat_id = category["id"]
        print(f"Created Category: {cat_name} ({cat_id})")

        # 2. Create SubCategory
        subcategory = post_check(f"{BASE_URL}/subcategories/", {
            "name": "Action",
            "description": "Explosions",
            "slug": f"action_{uuid.uuid4().hex[:4]}",
            "category_id": cat_id
        })
        sub_id = subcategory["id"]
        print(f"Created SubCategory: Action ({sub_id})")

        # 3. Create Entity
        entity = post_check(f"{BASE_URL}/entities/", {
            "name": "Arnold Schwarzenegger",
            "description": "The Terminator",
            "slug": f"arnold_{uuid.uuid4().hex[:4]}",
            "subcategory_id": sub_id
        })
        ent_id = entity["id"]
        print(f"Created Entity: Arnold ({ent_id})")

        # 4. Create Scoring Components
        comp1 = post_check(f"{BASE_URL}/scoring/components", {
            "name": f"Box Office_{uuid.uuid4().hex[:4]}",
            "slug": f"boxoffice_{uuid.uuid4().hex[:4]}",
            "normalization_type": "min-max"
        })
        print("Created Scoring Component: Box Office")

        # 5. Create Scoring Model
        model = post_check(f"{BASE_URL}/scoring/models", {
            "name": "Action GOAT Model",
            "version": "1.0",
            "category_id": cat_id,
            "weights": [
                {"component_id": comp1["id"], "weight": 1.0}
            ]
        })
        model_id = model["id"]
        print(f"Created Scoring Model: {model['name']} v{model['version']}")

        # 6. Submit Raw Score
        post_check(f"{BASE_URL}/scoring/raw-scores", {
            "entity_id": ent_id,
            "component_id": comp1["id"],
            "value": 5000000000.0
        })
        print("Submitted Raw Score")

        # 7. Submit Fan Votes
        user1_id = str(uuid.uuid4())
        user2_id = str(uuid.uuid4())
        
        print("Submitting Fan Votes...")
        post_check(f"{BASE_URL}/fan-votes/", {
            "entity_id": ent_id,
            "category_id": cat_id,
            "rating": 9.0,
            "reason": "Iconic lines"
        }, headers={"X-User-ID": user1_id})
        
        post_check(f"{BASE_URL}/fan-votes/", {
            "entity_id": ent_id,
            "category_id": cat_id,
            "rating": 10.0,
            "reason": "Best physique"
        }, headers={"X-User-ID": user2_id})
        print("Submitted 2 Fan Votes")

        # 8. Run Scoring
        print("Running Scoring with Fan Sentiment...")
        final_scores = post_check(f"{BASE_URL}/scoring/run/{cat_id}", {})
        
        for fs in final_scores:
            print(f"\nFinal Score for {ent_id}: {fs['score']}")
            print(f"Breakdown: {json.dumps(fs['breakdown'], indent=2)}")
            print(f"Explanation: {fs['explanation']}")

    except Exception as e:
        print(f"Verification failed: {e}")

if __name__ == "__main__":
    test_fan_voting_system()
