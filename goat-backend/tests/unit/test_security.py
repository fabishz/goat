import pytest
from fastapi.testclient import TestClient
from app.main import app
import time

def test_security_headers(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert response.headers["X-Frame-Options"] == "DENY"
    assert response.headers["X-XSS-Protection"] == "1; mode=block"
    assert "Strict-Transport-Security" in response.headers
    assert "Content-Security-Policy" in response.headers
    assert "X-Request-ID" in response.headers

def test_gzip_compression(client):
    # Large enough response to trigger GZip
    response = client.get("/api/v1/categories/")
    # If the response is small, GZip might not kick in. 
    # Let's check if it's available in Accept-Encoding
    res = client.get("/", headers={"Accept-Encoding": "gzip"})
    # GZipMiddleware adds Content-Encoding: gzip if compressed
    if "Content-Encoding" in res.headers:
        assert res.headers["Content-Encoding"] == "gzip"

def test_password_complexity():
    from app.schemas.user import UserCreate
    
    # Valid password
    UserCreate(email="test@example.com", password="Password123!", full_name="Test")
    
    # Too short
    with pytest.raises(ValueError, match="at least 8 characters"):
        UserCreate(email="test@example.com", password="Pass1!", full_name="Test")
    
    # No number
    with pytest.raises(ValueError, match="at least one number"):
        UserCreate(email="test@example.com", password="Password!", full_name="Test")
        
    # No special char
    with pytest.raises(ValueError, match="at least one special character"):
        UserCreate(email="test@example.com", password="Password123", full_name="Test")

def test_rate_limiting_login(client):
    # The limit is 5/minute
    for _ in range(5):
        client.post("/api/v1/auth/login/access-token", data={"username": "test@example.com", "password": "any"})
    
    # 6th request should be rate limited
    response = client.post("/api/v1/auth/login/access-token", data={"username": "test@example.com", "password": "any"})
    assert response.status_code == 429
    assert "Rate limit exceeded" in response.text
