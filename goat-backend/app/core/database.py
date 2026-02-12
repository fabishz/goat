from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.engine.url import make_url
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings


def _build_connect_args(database_url: str) -> dict:
    """
    Apply SSL for non-local Postgres URLs while keeping local development simple.
    """
    try:
        url = make_url(database_url)
    except Exception:
        return {}

    backend = url.get_backend_name()
    if not backend.startswith("postgresql"):
        return {}

    host = (url.host or "").lower()
    if host in {"localhost", "127.0.0.1", "::1"}:
        return {}

    return {"sslmode": "require"}


# Neon requires SSL for remote Postgres connections.
# We use pool_pre_ping to handle connection drops gracefully.
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    connect_args=_build_connect_args(settings.DATABASE_URL),
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
