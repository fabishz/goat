import os
import sys
import pytest
import math
from uuid import UUID
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy import event
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.core.database import Base, get_db
from app.main import app
from app.models import *  # Import all models to ensure they are registered with Base

# Stable IDs for dependency overrides in tests.
TEST_USER_ID = UUID("11111111-1111-1111-1111-111111111111")
TEST_ADMIN_ID = UUID("22222222-2222-2222-2222-222222222222")
TEST_EXPERT_USER_ID = UUID("33333333-3333-3333-3333-333333333333")

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


class _StddevSamp:
    def __init__(self):
        self.values = []

    def step(self, value):
        if value is not None:
            self.values.append(float(value))

    def finalize(self):
        n = len(self.values)
        if n < 2:
            return None
        mean = sum(self.values) / n
        variance = sum((v - mean) ** 2 for v in self.values) / (n - 1)
        return math.sqrt(variance)


@event.listens_for(engine, "connect")
def _register_sqlite_functions(dbapi_connection, _connection_record):
    # Keep parity with Postgres queries used by scoring service.
    dbapi_connection.create_aggregate("stddev_samp", 1, _StddevSamp)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session")
def db_engine():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db(db_engine) -> Generator[Session, None, None]:
    connection = db_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db) -> Generator[TestClient, None, None]:
    def override_get_db():
        try:
            yield db
        finally:
            pass
            
    # Mock Auth for tests
    from app.api import deps
    from app.core import security
    from app.models.user import User

    valid_test_hash = security.get_password_hash("any")
    seed_users = [
        User(
            id=TEST_USER_ID,
            email="test@example.com",
            hashed_password=valid_test_hash,
            is_active=True,
            role="admin",
            is_superuser=False,
        ),
        User(
            id=TEST_ADMIN_ID,
            email="admin@example.com",
            hashed_password=valid_test_hash,
            is_active=True,
            role="admin",
            is_superuser=True,
        ),
        User(
            id=TEST_EXPERT_USER_ID,
            email="expert@example.com",
            hashed_password=valid_test_hash,
            is_active=True,
            role="expert",
            is_superuser=False,
        ),
    ]
    for user in seed_users:
        db.merge(user)
    db.commit()
    
    def override_get_current_user():
        # Return a mock admin user so protected write endpoints can be tested.
        return User(id=TEST_USER_ID, email="test@example.com", is_active=True, role="admin", is_superuser=False)

    def override_get_current_active_superuser():
        return User(id=TEST_ADMIN_ID, email="admin@example.com", is_active=True, role="admin", is_superuser=True)
        
    def override_get_current_expert():
        return User(
            id=TEST_EXPERT_USER_ID,
            email="expert@example.com",
            is_active=True,
            role="expert",
            is_superuser=False,
        )

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[deps.get_current_user] = override_get_current_user
    app.dependency_overrides[deps.get_current_active_superuser] = override_get_current_active_superuser
    app.dependency_overrides[deps.get_current_expert] = override_get_current_expert
    
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
