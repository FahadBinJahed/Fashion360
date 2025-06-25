from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.category import CategoryDB
from app.schemas.category import Category, CategoryCreate, CategoryUpdate

router = APIRouter()

@router.post("/", response_model=Category)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = CategoryDB(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/", response_model=List[Category])
def get_categories(db: Session = Depends(get_db)):
    return db.query(CategoryDB).all()

@router.get("/{category_id}", response_model=Category)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(CategoryDB).filter(CategoryDB.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.put("/{category_id}", response_model=Category)
def update_category(category_id: int, update: CategoryUpdate, db: Session = Depends(get_db)):
    category = db.query(CategoryDB).filter(CategoryDB.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(category, field, value)
    db.commit()
    db.refresh(category)
    return category

@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(CategoryDB).filter(CategoryDB.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(category)
    db.commit()
    return {"detail": f"Category {category_id} deleted"}
