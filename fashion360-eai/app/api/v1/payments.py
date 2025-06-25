from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.payment import PaymentDB
from app.schemas.payment import Payment, PaymentCreate, PaymentUpdate

router = APIRouter()

@router.post("/", response_model=Payment)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    db_payment = PaymentDB(**payment.dict())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.get("/", response_model=List[Payment])
def get_payments(db: Session = Depends(get_db)):
    return db.query(PaymentDB).all()

@router.get("/{payment_id}", response_model=Payment)
def get_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(PaymentDB).filter(PaymentDB.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@router.put("/{payment_id}", response_model=Payment)
def update_payment(payment_id: int, update: PaymentUpdate, db: Session = Depends(get_db)):
    payment = db.query(PaymentDB).filter(PaymentDB.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(payment, field, value)
    db.commit()
    db.refresh(payment)
    return payment

@router.delete("/{payment_id}")
def delete_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(PaymentDB).filter(PaymentDB.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    db.delete(payment)
    db.commit()
    return {"detail": f"Payment {payment_id} deleted"}
