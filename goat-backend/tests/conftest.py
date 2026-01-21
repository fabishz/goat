import os
import sys
import pytest
from uuid import uuid4
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.core.database import Base, get_db
from app.main import app
from app.models import *  # Import all models to ensure they are registered with Base

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

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
    from app.models.user import User
    
    def override_get_current_user():
        # Return a mock user
        return User(id=uuid4(), email="test@example.com", is_active=True, role="user", is_superuser=False)

    def override_get_current_active_superuser():
        return User(id=uuid4(), email="admin@example.com", is_active=True, role="admin", is_superuser=True)
        
    def override_get_current_expert():
        return User(id=uuid4(), email="expert@example.com", is_active=True, role="expert", is_superuser=False)

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[deps.get_current_user] = override_get_current_user
    app.dependency_overrides[deps.get_current_active_superuser] = override_get_current_active_superuser
    app.dependency_overrides[deps.get_current_expert] = override_get_current_expert
    
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
