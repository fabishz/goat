import random
from sqlalchemy import select
from app.core.database import SessionLocal
from app.models.debate import Debate
from app.models.debate_argument import DebateArgument

PRO_ARGUMENTS = [
    "Peak dominance and signature moments make the case overwhelming.",
    "The accolades and impact on the sport are unmatched.",
    "Consistency across eras proves the stronger legacy.",
    "Changed the game and set new standards for greatness.",
]

CON_ARGUMENTS = [
    "Longevity and adaptability favor the other side.",
    "Era context weakens the claim of dominance.",
    "Advanced metrics do not fully support the narrative.",
    "Peak seasons were shorter compared to the rival.",
]

USER_POOL = [
    ("StatKing", "https://api.dicebear.com/7.x/avataaars/svg?seed=StatKing"),
    ("HistoryBuff", "https://api.dicebear.com/7.x/avataaars/svg?seed=HistoryBuff"),
    ("ArenaAnalyst", "https://api.dicebear.com/7.x/avataaars/svg?seed=ArenaAnalyst"),
    ("DebateMaster", "https://api.dicebear.com/7.x/avataaars/svg?seed=DebateMaster"),
]

ARGUMENTS_PER_DEBATE = 6


def main():
    db = SessionLocal()
    try:
        debates = db.execute(select(Debate).where(Debate.deleted_at.is_(None))).scalars().all()
        if not debates:
            print("No debates found.")
            return 1

        created = 0
        for debate in debates:
            for i in range(ARGUMENTS_PER_DEBATE):
                if i % 2 == 0:
                    content = random.choice(PRO_ARGUMENTS)
                    arg_type = "pro"
                else:
                    content = random.choice(CON_ARGUMENTS)
                    arg_type = "con"

                user_name, avatar = random.choice(USER_POOL)
                argument = DebateArgument(
                    debate_id=debate.id,
                    user_name=user_name,
                    user_avatar=avatar,
                    content=content,
                    type=arg_type,
                    upvotes=random.randint(0, 120),
                    downvotes=random.randint(0, 50),
                )
                db.add(argument)
                created += 1

            debate.comments = (debate.comments or 0) + ARGUMENTS_PER_DEBATE
            db.add(debate)

        db.commit()
        print(f"Seeded {created} debate arguments.")
        return 0
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
