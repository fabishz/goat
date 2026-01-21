import requests
import uuid
import time
import json

BASE_URL = "http://localhost:8001/api/v1"

def test_era_normalization():
    print("Starting Era Normalization Verification...")
    
    def post_check(url, data):
        res = requests.post(url, json=data)
        if res.status_code >= 400:
            print(f"Error at {url}: {res.status_code}")
            print(f"Response: {res.text}")
            res.raise_for_status()
        return res.json()

    try:
        # 1. Create Category
        cat_name = f"Basketball_{uuid.uuid4().hex[:4]}"
        category = post_check(f"{BASE_URL}/categories/", {
            "name": cat_name,
            "description": "Hoops",
            "slug": cat_name.lower()
        })
        cat_id = category["id"]
        print(f"Created Category: {cat_name} ({cat_id})")

        # 2. Create Eras
        era_60s = post_check(f"{BASE_URL}/eras/", {
            "name": "1960s Era",
            "category_id": cat_id,
            "start_year": 1960,
            "end_year": 1969,
            "context_factors": {"competition_density": 0.5}
        })
        era_90s = post_check(f"{BASE_URL}/eras/", {
            "name": "1990s Era",
            "category_id": cat_id,
            "start_year": 1990,
            "end_year": 1999,
            "context_factors": {"competition_density": 0.9}
        })
        print("Created Eras: 1960s and 1990s")

        # 3. Create SubCategory
        subcategory = post_check(f"{BASE_URL}/subcategories/", {
            "name": "NBA",
            "description": "Pro Basketball",
            "slug": f"nba_{uuid.uuid4().hex[:4]}",
            "category_id": cat_id
        })
        sub_id = subcategory["id"]

        # 4. Create Entities
        wilt = post_check(f"{BASE_URL}/entities/", {
            "name": "Wilt Chamberlain",
            "description": "The Big Dipper",
            "slug": f"wilt_{uuid.uuid4().hex[:4]}",
            "subcategory_id": sub_id
        })
        mj = post_check(f"{BASE_URL}/entities/", {
            "name": "Michael Jordan",
            "description": "Air Jordan",
            "slug": f"mj_{uuid.uuid4().hex[:4]}",
            "subcategory_id": sub_id
        })
        print("Created Entities: Wilt and MJ")

        # 5. Create Scoring Component
        comp = post_check(f"{BASE_URL}/scoring/components", {
            "name": f"PPG_{uuid.uuid4().hex[:4]}",
            "slug": f"ppg_{uuid.uuid4().hex[:4]}",
            "normalization_type": "min-max"
        })
        comp_id = comp["id"]

        # 6. Create Era Factors (Multipliers)
        # 1960s has a 0.7x multiplier (easier era)
        post_check(f"{BASE_URL}/eras/factors", {
            "era_id": era_60s["id"],
            "component_id": comp_id,
            "mean_value": 25.0,
            "std_dev": 5.0,
            "multiplier": 0.7
        })
        # 1990s has a 1.0x multiplier
        post_check(f"{BASE_URL}/eras/factors", {
            "era_id": era_90s["id"],
            "component_id": comp_id,
            "mean_value": 20.0,
            "std_dev": 4.0,
            "multiplier": 1.0
        })
        print("Created Era Factors")

        # 7. Create Scoring Model
        model = post_check(f"{BASE_URL}/scoring/models", {
            "name": "NBA GOAT Model",
            "version": "1.0",
            "category_id": cat_id,
            "weights": [{"component_id": comp_id, "weight": 1.0}]
        })
        model_id = model["id"]

        # 8. Submit Raw Scores
        # Wilt: 50 PPG in 60s
        post_check(f"{BASE_URL}/scoring/raw-scores", {
            "entity_id": wilt["id"],
            "component_id": comp_id,
            "value": 50.0,
            "era_id": era_60s["id"]
        })
        # MJ: 30 PPG in 90s
        post_check(f"{BASE_URL}/scoring/raw-scores", {
            "entity_id": mj["id"],
            "component_id": comp_id,
            "value": 30.0,
            "era_id": era_90s["id"]
        })
        print("Submitted Raw Scores")

        # 9. Run Scoring
        print("Running Scoring with Era Normalization...")
        final_scores = post_check(f"{BASE_URL}/scoring/run/{cat_id}", {})
        
        for fs in final_scores:
            print(f"\nFinal Score for {fs['entity_id']}: {fs['score']}")
            print(f"Explanation: {fs['explanation']}")

    except Exception as e:
        print(f"Verification failed: {e}")

if __name__ == "__main__":
    test_era_normalization()
