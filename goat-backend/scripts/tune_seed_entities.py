import random
import uuid
from sqlalchemy import select
from app.core.database import SessionLocal
from app.models.category import Category
from app.models.entity import Entity

IMAGE_POOL = [
    "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81",
    "https://images.unsplash.com/photo-1485579149621-3123dd979885",
]

NAME_POOLS = {
    "sports": [
        "Michael Jordan",
        "LeBron James",
        "Kobe Bryant",
        "Serena Williams",
        "Usain Bolt",
        "Lionel Messi",
        "Cristiano Ronaldo",
        "Tom Brady",
        "Muhammad Ali",
        "Babe Ruth",
    ],
    "music": [
        "Michael Jackson",
        "Beyonce",
        "Freddie Mercury",
        "Aretha Franklin",
        "Prince",
        "Whitney Houston",
        "Bob Dylan",
        "Stevie Wonder",
        "Madonna",
        "David Bowie",
    ],
    "movies": [
        "Meryl Streep",
        "Denzel Washington",
        "Marlon Brando",
        "Katharine Hepburn",
        "Leonardo DiCaprio",
        "Al Pacino",
        "Viola Davis",
        "Tom Hanks",
        "Morgan Freeman",
        "Audrey Hepburn",
    ],
    "science": [
        "Albert Einstein",
        "Marie Curie",
        "Isaac Newton",
        "Charles Darwin",
        "Galileo Galilei",
        "Nikola Tesla",
        "Ada Lovelace",
        "Rosalind Franklin",
        "Alan Turing",
        "Stephen Hawking",
    ],
    "politics": [
        "Nelson Mandela",
        "Angela Merkel",
        "Franklin D. Roosevelt",
        "Winston Churchill",
        "Golda Meir",
        "Barack Obama",
        "Margaret Thatcher",
        "Abraham Lincoln",
        "Eleanor Roosevelt",
        "Indira Gandhi",
    ],
    "culture": [
        "Frida Kahlo",
        "Pablo Picasso",
        "Maya Angelou",
        "Toni Morrison",
        "James Baldwin",
        "Georgia O'Keeffe",
        "Haruki Murakami",
        "Chinua Achebe",
        "Gabriel Garcia Marquez",
        "Virginia Woolf",
    ],
}


def slugify(text: str) -> str:
    return "".join(ch.lower() if ch.isalnum() else "-" for ch in text).strip("-")


def pick_domain(category: Category) -> str:
    if category.domain:
        return category.domain.strip().lower()
    if category.name:
        return category.name.split("_")[0].strip().lower()
    return "custom"


def main():
    db = SessionLocal()
    try:
        categories = db.execute(select(Category).where(Category.deleted_at.is_(None))).scalars().all()
        if not categories:
            print("No categories found.")
            return 1

        updated = 0
        for category in categories:
            domain = pick_domain(category)
            pool = NAME_POOLS.get(domain, [])
            if not pool:
                pool = [f"{category.name} Icon {i+1}" for i in range(10)]

            random.shuffle(pool)
            seed_entities = db.execute(
                select(Entity).where(
                    Entity.deleted_at.is_(None),
                    Entity.category_id == category.id,
                    Entity.description.like("Seeded profile%"),
                )
            ).scalars().all()

            for idx, entity in enumerate(seed_entities):
                name = pool[idx % len(pool)]
                entity.name = name
                entity.description = f"Legendary figure in {category.name}"
                entity.image_url = random.choice(IMAGE_POOL)
                entity.slug = f"{slugify(name)}-{uuid.uuid4().hex[:6]}"
                updated += 1

        db.commit()
        print(f"Updated {updated} seeded entities.")
        return 0
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
