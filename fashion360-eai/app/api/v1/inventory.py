from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import SessionLocal
from app.models.inventory import InventoryDB
from app.schemas.inventory import Inventory, InventoryCreate, InventoryUpdate
from app.db.session import get_db

router = APIRouter()

@router.post("/", response_model=Inventory)
def create_inventory(item: InventoryCreate, db: Session = Depends(get_db)):
    db_item = InventoryDB(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/{item_id}", response_model=Inventory)
def read_inventory(item_id: int, db: Session = Depends(get_db)):
    item = db.query(InventoryDB).filter(InventoryDB.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.put("/{item_id}", response_model=Inventory)
def update_inventory(item_id: int, update: InventoryUpdate, db: Session = Depends(get_db)):
    item = db.query(InventoryDB).filter(InventoryDB.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_inventory(item_id: int, db: Session = Depends(get_db)):
    item = db.query(InventoryDB).filter(InventoryDB.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"detail": f"Item {item_id} deleted"}

@router.get("/", response_model=List[Inventory])
def list_inventory(db: Session = Depends(get_db)):
    return db.query(InventoryDB).all()
