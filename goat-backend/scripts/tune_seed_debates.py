import random
from sqlalchemy import select
from app.core.database import SessionLocal
from app.models.debate import Debate
from app.models.entity import Entity

SUMMARIES = [
    "A clash between peak dominance and longevity, with fans split across eras.",
    "An iconic matchup pitting accolades against cultural impact.",
    "The debate centers on consistency versus historic peak performance.",
    "Supporters argue for leadership, versatility, and era-adjusted dominance.",
]

PROS = [
    "Unmatched peak performance and historic accolades.",
    "Changed the game and defined the era.",
    "Elite consistency across a long career.",
    "Dominated both statistically and culturally.",
]

CONS = [
    "Less dominant in advanced metrics during key seasons.",
    "Shorter prime compared to the rival.",
    "Contextual competition may inflate results.",
    "Peak seasons were brilliant but not as sustained.",
]


def main():
    db = SessionLocal()
    try:
        debates = db.execute(select(Debate).where(Debate.deleted_at.is_(None))).scalars().all()
        if not debates:
            print("No debates found.")
            return 1

        entities = {str(e.id): e for e in db.execute(select(Entity)).scalars().all()}

        updated = 0
        for debate in debates:
            goat1 = entities.get(str(debate.goat1_id))
            goat2 = entities.get(str(debate.goat2_id))
            if goat1 and goat2:
                debate.title = f"{goat1.name} vs {goat2.name}"
            debate.ai_summary = random.choice(SUMMARIES)
            debate.strongest_pro = random.choice(PROS)
            debate.strongest_con = random.choice(CONS)
            updated += 1

        db.commit()
        print(f"Updated {updated} debates.")
        return 0
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
