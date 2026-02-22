import random
import uuid
from sqlalchemy import select, func
from app.core.database import SessionLocal
from app.models.category import Category
from app.models.subcategory import SubCategory
from app.models.entity import Entity

MIN_ENTITIES_PER_CATEGORY = 6

IMAGE_POOL = [
    "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7",
    "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
]


def slugify(text: str) -> str:
    return "".join(ch.lower() if ch.isalnum() else "-" for ch in text).strip("-")


def ensure_subcategory(db, category: Category) -> SubCategory:
    subcategory = db.execute(
        select(SubCategory).where(
            SubCategory.deleted_at.is_(None),
            SubCategory.category_id == category.id,
        )
    ).scalar_one_or_none()

    if subcategory:
        return subcategory

    base_name = f"{category.name} Legends"
    slug = f"{slugify(category.slug)}-legends-{uuid.uuid4().hex[:6]}"
    subcategory = SubCategory(
        name=base_name,
        description=f"Top figures in {category.name}",
        slug=slug,
        category_id=category.id,
    )
    db.add(subcategory)
    db.flush()
    return subcategory


def main():
    db = SessionLocal()
    try:
        categories = db.execute(select(Category).where(Category.deleted_at.is_(None))).scalars().all()
        if not categories:
            print("No categories found. Seed categories first.")
            return 1

        total_created = 0
        for category in categories:
            subcategory = ensure_subcategory(db, category)
            existing_count = db.execute(
                select(func.count(Entity.id)).where(
                    Entity.deleted_at.is_(None),
                    Entity.category_id == category.id,
                )
            ).scalar_one()

            needed = max(0, MIN_ENTITIES_PER_CATEGORY - existing_count)
            if needed == 0:
                continue

            for i in range(needed):
                seed_id = uuid.uuid4().hex[:6]
                name = f"{category.name} Legend {existing_count + i + 1}"
                slug = f"{slugify(category.slug)}-legend-{seed_id}"
                entity = Entity(
                    name=name,
                    description=f"Seeded profile for {name}",
                    slug=slug,
                    image_url=random.choice(IMAGE_POOL),
                    category_id=category.id,
                    subcategory_id=subcategory.id,
                )
                db.add(entity)
                total_created += 1

        if total_created == 0:
            print("No entities created (already enough per category).")
            db.rollback()
            return 0

        db.commit()
        print(f"Seeded {total_created} entities.")
        return 0
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
