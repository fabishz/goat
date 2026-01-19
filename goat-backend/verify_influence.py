import requests
import uuid
import time
import json

BASE_URL = "http://localhost:8001/api/v1"

def test_influence_system():
    print("Starting Influence System Verification...")
    
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
            "description": "Music Legends",
            "slug": cat_name.lower()
        })
        cat_id = category["id"]
        print(f"Created Category: {cat_name}")

        # 2. Create SubCategory & Entity
        sub = post_check(f"{BASE_URL}/subcategories/", {
            "name": "Rock", "slug": f"rock_{uuid.uuid4().hex[:4]}", "category_id": cat_id
        })
        entity = post_check(f"{BASE_URL}/entities/", {
            "name": "The Beatles", "slug": f"beatles_{uuid.uuid4().hex[:4]}", "subcategory_id": sub["id"]
        })
        ent_id = entity["id"]
        print("Created Entity: The Beatles")

        # 3. Create Influence Sources
        wiki = post_check(f"{BASE_URL}/influence/sources", {
            "name": "Wikipedia", "source_type": "web", "credibility_score": 0.8
        })
        rs = post_check(f"{BASE_URL}/influence/sources", {
            "name": "Rolling Stone", "source_type": "journalism", "credibility_score": 0.9
        })
        print("Created Influence Sources")

        # 4. Create Influence Model
        model = post_check(f"{BASE_URL}/influence/models", {
            "name": "Music Influence V1",
            "version": "1.0",
            "category_id": cat_id,
            "weights": {"breadth": 0.3, "depth": 0.3, "longevity": 0.2, "peer": 0.2}
        })
        model_id = model["id"]
        print("Created Influence Model")

        # 5. Create Influence Events
        # Event 1: Mention in Rolling Stone (Depth)
        post_check(f"{BASE_URL}/influence/events", {
            "entity_id": ent_id, "source_id": rs["id"], 
            "event_type": "citation", "description": "Greatest Artists List", "weight": 10.0
        })
        # Event 2: Mention in Wikipedia (Breadth - distinct source)
        post_check(f"{BASE_URL}/influence/events", {
            "entity_id": ent_id, "source_id": wiki["id"], 
            "event_type": "mention", "description": "Bio", "weight": 1.0
        })
        # Event 3: Peer Mention (Peer Score)
        post_check(f"{BASE_URL}/influence/events", {
            "entity_id": ent_id, "source_id": rs["id"], 
            "event_type": "peer_mention", "description": "Cited by Oasis", "weight": 5.0
        })
        print("Created Influence Events")

        # 6. Calculate Influence Score
        inf_score = post_check(f"{BASE_URL}/influence/calculate/{ent_id}/{model_id}", {})
        print(f"Influence Score: {inf_score['total_score']}")
        print(f"Breakdown: {inf_score['breakdown']}")

        # 7. Run Full Scoring (Integration Check)
        # Need a scoring model first
        comp = post_check(f"{BASE_URL}/scoring/components", {
            "name": "Sales", "slug": "sales", "normalization_type": "min-max"
        })
        sc_model = post_check(f"{BASE_URL}/scoring/models", {
            "name": "GOAT Model", "version": "1.0", "category_id": cat_id,
            "weights": [{"component_id": comp["id"], "weight": 1.0}]
        })
        # Raw score
        post_check(f"{BASE_URL}/scoring/raw-scores", {
            "entity_id": ent_id, "component_id": comp["id"], "value": 100.0
        })
        
        # Run
        final_scores = post_check(f"{BASE_URL}/scoring/run/{cat_id}", {})
        fs = final_scores[0]
        print(f"\nFinal GOAT Score: {fs['score']}")
        print(f"Explanation: {fs['explanation']}")
        
        # Verify AI Influence is present
        if "ai_influence" in fs["breakdown"]:
            print("SUCCESS: AI Influence integrated into final score.")
        else:
            print("FAILURE: AI Influence missing from breakdown.")

    except Exception as e:
        print(f"Verification failed: {e}")

if __name__ == "__main__":
    test_influence_system()
