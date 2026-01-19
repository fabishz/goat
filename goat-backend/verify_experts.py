import requests
import uuid
import time
import json
import sys

BASE_URL = "http://localhost:8001/api/v1"

def create_user_and_login(email: str, role: str = "expert"):
    # 1. Register
    try:
        requests.post(f"{BASE_URL}/users/", json={
            "email": email,
            "password": "password123",
            "full_name": "Test Expert",
            "role": role
        })
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 409: # Assuming 409 for conflict (user exists)
            pass # User might exist
        else:
            raise # Re-raise other errors
    except Exception:
        pass # User might exist

    # 2. Login
    response = requests.post(f"{BASE_URL}/login/access-token", data={
        "username": email,
        "password": "password123"
    })
    if response.status_code != 200:
        print(f"Login failed: {response.text}")
        sys.exit(1)
    
    return response.json()["access_token"]

def main():
    print("🚀 Starting Expert Verification...")
    
    # Authenticate as Expert
    token = create_user_and_login("expert@example.com", role="expert")
    headers = {"Authorization": f"Bearer {token}"}
    
    def post_check(url, data):
        res = requests.post(url, json=data, headers=headers)
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
        vote_payload = {
            "entity_id": ent_id,
            "scoring_model_id": model_id,
            "score": 95.5,
            "confidence": 0.9,
            "justification": "Unmatched dominance in the 90s."
        }
        response = requests.post(f"{BASE_URL}/experts/{expert_id}/votes", json=vote_payload, headers=headers)
        if response.status_code >= 400:
            print(f"Error submitting vote: {response.status_code}")
            print(f"Response: {response.text}")
            response.raise_for_status()
        print(f"Submitted Expert Vote")

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
    main()
