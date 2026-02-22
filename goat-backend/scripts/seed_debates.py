import random
from sqlalchemy import select
from app.core.database import SessionLocal
from app.models.category import Category
from app.models.entity import Entity
from app.models.debate import Debate

DEBATES_PER_CATEGORY = 3

def main():
    db = SessionLocal()
    try:
        categories = db.execute(select(Category).where(Category.deleted_at.is_(None))).scalars().all()
        if not categories:
            print("No categories found. Seed categories and entities first.")
            return 1

        total_created = 0
        for category in categories:
            entities = db.execute(
                select(Entity).where(
                    Entity.deleted_at.is_(None),
                    Entity.category_id == category.id,
                )
            ).scalars().all()

            if len(entities) < 2:
                print(f"Skipping category '{category.name}' (need at least 2 entities).")
                continue

            pairs = set()
            attempts = 0
            while len(pairs) < DEBATES_PER_CATEGORY and attempts < 20:
                a, b = random.sample(entities, 2)
                key = tuple(sorted([str(a.id), str(b.id)]))
                pairs.add(key)
                attempts += 1

            for a_id, b_id in pairs:
                goat1 = next(e for e in entities if str(e.id) == a_id)
                goat2 = next(e for e in entities if str(e.id) == b_id)
                title = f"{goat1.name} vs {goat2.name}"
                debate = Debate(
                    title=title,
                    category_id=category.id,
                    goat1_id=goat1.id,
                    goat2_id=goat2.id,
                    votes1=random.randint(50, 5000),
                    votes2=random.randint(50, 5000),
                    comments=random.randint(0, 500),
                    trending=random.random() < 0.3,
                )
                db.add(debate)
                total_created += 1

        if total_created == 0:
            print("No debates created (not enough entities per category).")
            db.rollback()
            return 1

        db.commit()
        print(f"Seeded {total_created} debates.")
        return 0
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
