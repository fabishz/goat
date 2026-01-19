import requests
import uuid
import time
import json
import sys

BASE_URL = "http://localhost:8001/api/v1"

def create_user_and_login(email: str, role: str = "user"):
    # 1. Register
    try:
        requests.post(f"{BASE_URL}/users/", json={
            "email": email,
            "password": "password123",
            "full_name": "Test User",
            "role": role
        })
    except:
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
    print("🚀 Starting Fan Voting Verification...")
    
    # Authenticate
    token = create_user_and_login("fan@example.com")
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Create Category & Entity (Admin)
    # We need admin token for this if we secured it. 
    # For now, let's assume categories/entities are open or we use the same token if not secured.
    # But wait, categories/entities create usually requires admin?
    # I didn't verify if I secured those routes. Let's assume I didn't for this exercise or I'll use the token.
    
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
        print("\n🗳️  Submitting Fan Vote...")
        vote_payload = {
            "entity_id": ent_id,
            "category_id": cat_id,
            "rating": 9,
            "reason": "Incredible longevity and peak performance."
        }
        # Removed X-User-ID header, using Bearer token
        response = requests.post(f"{BASE_URL}/fan-votes/", json=vote_payload, headers=headers)
        if response.status_code >= 400:
            print(f"Error at {BASE_URL}/fan-votes/: {response.status_code}")
            print(f"Response: {response.text}")
            response.raise_for_status()
        print("Submitted 1 Fan Vote with Bearer token")

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
    main()
