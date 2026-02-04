from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

# Neon requires SSL for connections
# We use pool_pre_ping to handle connection drops gracefully
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    connect_args={"sslmode": "require"} if "localhost" not in settings.DATABASE_URL or "127.0.0.1" not in settings.DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
