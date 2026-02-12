from app.api import deps as legacy_deps
from app.api.v1 import deps as v1_deps
from app.models.category import Category
from app.models.entity import Entity
from app.models.subcategory import SubCategory


def test_auth_dependency_aliases_stay_in_sync():
    assert legacy_deps.get_current_user is v1_deps.get_current_user
    assert legacy_deps.get_current_expert is v1_deps.get_current_expert
    assert (
        legacy_deps.get_current_active_superuser
        is v1_deps.get_current_active_superuser
    )


def test_fan_vote_aggregate_endpoint_returns_computed_aggregate(client, db):
    category = Category(name="FanVotesCat", domain="sports", slug="fan-votes-cat")
    db.add(category)
    db.flush()

    subcategory = SubCategory(
        name="FanVotesSub",
        slug="fan-votes-sub",
        category_id=category.id,
    )
    db.add(subcategory)
    db.flush()

    entity = Entity(
        name="FanVotesEntity",
        slug="fan-votes-entity",
        image_url="https://example.com/fan-votes-entity.jpg",
        category_id=category.id,
        subcategory_id=subcategory.id,
    )
    db.add(entity)
    db.commit()

    vote_res = client.post(
        "/api/v1/fan-votes/",
        json={
            "entity_id": str(entity.id),
            "category_id": str(category.id),
            "rating": 7.0,
        },
    )
    assert vote_res.status_code == 200, vote_res.text

    aggregate_res = client.get(
        f"/api/v1/fan-votes/aggregates/{entity.id}/{category.id}"
    )
    assert aggregate_res.status_code == 200, aggregate_res.text

    aggregate = aggregate_res.json()
    assert aggregate["entity_id"] == str(entity.id)
    assert aggregate["category_id"] == str(category.id)
    assert aggregate["vote_count"] == 1
    # Service scales 1-10 ratings to 0-100.
    assert aggregate["aggregate_score"] == 70.0


def test_fan_vote_aggregate_endpoint_returns_404_when_missing(client):
    missing_entity_id = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    missing_category_id = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"

    aggregate_res = client.get(
        f"/api/v1/fan-votes/aggregates/{missing_entity_id}/{missing_category_id}"
    )
    assert aggregate_res.status_code == 404
    assert aggregate_res.json()["detail"] == "Aggregate not found"
