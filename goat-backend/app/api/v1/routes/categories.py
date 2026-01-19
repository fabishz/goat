from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.core import Category, CategoryCreate, CategoryUpdate
from app.services.category import category_service

router = APIRouter()


@router.get("/", response_model=List[Category])
def read_categories(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    return category_service.get_categories(db, skip=skip, limit=limit)


@router.post("/", response_model=Category)
def create_category(
    *,
    db: Session = Depends(get_db),
    category_in: CategoryCreate
):
    return category_service.create_category(db, category_in=category_in)


@router.get("/{category_id}", response_model=Category)
def read_category(
    category_id: UUID,
    db: Session = Depends(get_db)
):
    category = category_service.get_category(db, category_id=category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.put("/{category_id}", response_model=Category)
def update_category(
    *,
    db: Session = Depends(get_db),
    category_id: UUID,
    category_in: CategoryUpdate
):
    category = category_service.update_category(
        db, category_id=category_id, category_in=category_in
    )
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.delete("/{category_id}", response_model=Category)
def delete_category(
    category_id: UUID,
    db: Session = Depends(get_db)
):
    category = category_service.delete_category(db, category_id=category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category
