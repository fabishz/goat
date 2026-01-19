from fastapi import APIRouter
from app.api.v1.routes import health, categories, subcategories, entities, scoring, experts, fan_votes

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(subcategories.router, prefix="/subcategories", tags=["subcategories"])
api_router.include_router(entities.router, prefix="/entities", tags=["entities"])
api_router.include_router(scoring.router, prefix="/scoring", tags=["scoring"])
api_router.include_router(experts.router, prefix="/experts", tags=["experts"])
