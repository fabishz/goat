from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.core import SubCategory, SubCategoryCreate, SubCategoryUpdate
from app.services.subcategory import subcategory_service

router = APIRouter()


@router.get("/", response_model=List[SubCategory])
def read_subcategories(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    return subcategory_service.get_subcategories(db, skip=skip, limit=limit)


@router.post("/", response_model=SubCategory)
def create_subcategory(
    *,
    db: Session = Depends(get_db),
    subcategory_in: SubCategoryCreate
):
    return subcategory_service.create_subcategory(db, subcategory_in=subcategory_in)


@router.get("/{subcategory_id}", response_model=SubCategory)
def read_subcategory(
    subcategory_id: UUID,
    db: Session = Depends(get_db)
):
    subcategory = subcategory_service.get_subcategory(db, subcategory_id=subcategory_id)
    if not subcategory:
        raise HTTPException(status_code=404, detail="SubCategory not found")
    return subcategory


@router.put("/{subcategory_id}", response_model=SubCategory)
def update_subcategory(
    *,
    db: Session = Depends(get_db),
    subcategory_id: UUID,
    subcategory_in: SubCategoryUpdate
):
    subcategory = subcategory_service.update_subcategory(
        db, subcategory_id=subcategory_id, subcategory_in=subcategory_in
    )
    if not subcategory:
        raise HTTPException(status_code=404, detail="SubCategory not found")
    return subcategory


@router.delete("/{subcategory_id}", response_model=SubCategory)
def delete_subcategory(
    subcategory_id: UUID,
    db: Session = Depends(get_db)
):
    subcategory = subcategory_service.delete_subcategory(db, subcategory_id=subcategory_id)
    if not subcategory:
        raise HTTPException(status_code=404, detail="SubCategory not found")
    return subcategory
