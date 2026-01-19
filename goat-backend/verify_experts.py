import requests
import uuid
import time
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_expert_system():
    print("Starting Expert System Verification...")
    
    def post_check(url, data):
        res = requests.post(url, json=data)
        if res.status_code >= 400:
            print(f"Error at {url}: {res.status_code}")
            print(f"Response: {res.text}")
            res.raise_for_status()
        return res.json()

    try:
        # 1. Create Category
        cat_name = f"Music_{uuid.uuid4().hex[:4]}"
        category = post_check(f"{BASE_URL}/categories/", {
            "name": cat_name,
            "description": "Musical artists",
            "slug": cat_name.lower()
        })
        cat_id = category["id"]
        print(f"Created Category: {cat_name} ({cat_id})")

        # 2. Create SubCategory
        subcategory = post_check(f"{BASE_URL}/subcategories/", {
            "name": "Hip-Hop",
            "description": "Rap music",
            "slug": f"hiphop_{uuid.uuid4().hex[:4]}",
            "category_id": cat_id
        })
        sub_id = subcategory["id"]
        print(f"Created SubCategory: Hip-Hop ({sub_id})")

        # 3. Create Entity
        entity = post_check(f"{BASE_URL}/entities/", {
            "name": "The Notorious B.I.G.",
            "description": "Biggie Smalls",
            "slug": f"biggie_{uuid.uuid4().hex[:4]}",
            "subcategory_id": sub_id
        })
        ent_id = entity["id"]
        print(f"Created Entity: Biggie ({ent_id})")

        # 4. Create Expert
        expert = post_check(f"{BASE_URL}/experts/", {
            "name": "Questlove",
            "bio": "Legendary drummer and music historian",
            "credentials": "The Roots, Tonight Show",
            "role": "senior_expert",
            "domains": [{"category_id": cat_id, "expertise_level": 1.0}]
        })
        expert_id = expert["id"]
        print(f"Created Expert: {expert['name']} ({expert_id})")

        # 5. Verify Expert (Admin action - simulated by direct DB update or just assuming verified for test)
        # For the test, we need to ensure verification_status is True.
        # I'll update the expert via a patch if implemented, or just assume the service handles it.
        # Since I didn't implement a verify endpoint yet, I'll do a quick update.
        requests.patch(f"{BASE_URL}/experts/{expert_id}", json={"verification_status": True})
        
        # 6. Create Scoring Components
        comp1 = post_check(f"{BASE_URL}/scoring/components", {
            "name": f"Album Sales_{uuid.uuid4().hex[:4]}",
            "slug": f"sales_{uuid.uuid4().hex[:4]}",
            "normalization_type": "min-max"
        })
        print("Created Scoring Component: Album Sales")

        # 7. Create Scoring Model
        model = post_check(f"{BASE_URL}/scoring/models", {
            "name": "Hip-Hop GOAT Model",
            "version": "1.0",
            "category_id": cat_id,
            "weights": [
                {"component_id": comp1["id"], "weight": 1.0}
            ]
        })
        model_id = model["id"]
        print(f"Created Scoring Model: {model['name']} v{model['version']}")

        # 8. Submit Raw Score
        post_check(f"{BASE_URL}/scoring/raw-scores", {
            "entity_id": ent_id,
            "component_id": comp1["id"],
            "value": 10000000.0
        })
        print("Submitted Raw Score")

        # 9. Submit Expert Vote
        # First, we need to make sure the expert is verified in the DB for the service to allow voting.
        # I'll add a temporary endpoint or just update the service to skip verification for this test if needed.
        # Actually, I'll just implement a quick update endpoint in the router.
        
        print("Submitting Expert Vote...")
        vote = post_check(f"{BASE_URL}/experts/{expert_id}/votes", {
            "entity_id": ent_id,
            "scoring_model_id": model_id,
            "score": 9.8,
            "confidence": 0.95,
            "justification": "Unmatched flow and storytelling"
        })
        print(f"Submitted Expert Vote: {vote['score']}")

        # 10. Run Scoring
        print("Running Scoring with Expert Influence...")
        final_scores = post_check(f"{BASE_URL}/scoring/run/{cat_id}", {})
        
        for fs in final_scores:
            print(f"\nFinal Score for {ent_id}: {fs['score']}")
            print(f"Breakdown: {json.dumps(fs['breakdown'], indent=2)}")
            print(f"Explanation: {fs['explanation']}")

    except Exception as e:
        print(f"Verification failed: {e}")

if __name__ == "__main__":
    test_expert_system()
