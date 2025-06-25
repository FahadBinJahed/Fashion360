from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.delivery import DeliveryDB
from app.schemas.delivery import Delivery, DeliveryCreate, DeliveryUpdate

router = APIRouter()

@router.post("/", response_model=Delivery)
def create_delivery(delivery: DeliveryCreate, db: Session = Depends(get_db)):
    db_delivery = DeliveryDB(**delivery.dict())
    db.add(db_delivery)
    db.commit()
    db.refresh(db_delivery)
    return db_delivery

@router.get("/{delivery_id}", response_model=Delivery)
def get_delivery(delivery_id: int, db: Session = Depends(get_db)):
    delivery = db.query(DeliveryDB).filter(DeliveryDB.id == delivery_id).first()
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found")
    return delivery

@router.put("/{delivery_id}", response_model=Delivery)
def update_delivery(delivery_id: int, update: DeliveryUpdate, db: Session = Depends(get_db)):
    delivery = db.query(DeliveryDB).filter(DeliveryDB.id == delivery_id).first()
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(delivery, field, value)
    db.commit()
    db.refresh(delivery)
    return delivery

@router.delete("/{delivery_id}")
def delete_delivery(delivery_id: int, db: Session = Depends(get_db)):
    delivery = db.query(DeliveryDB).filter(DeliveryDB.id == delivery_id).first()
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found")
    db.delete(delivery)
    db.commit()
    return {"detail": f"Delivery {delivery_id} deleted"}

@router.get("/", response_model=List[Delivery])
def list_deliveries(db: Session = Depends(get_db)):
    return db.query(DeliveryDB).all()
