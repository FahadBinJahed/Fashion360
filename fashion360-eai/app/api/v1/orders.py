from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.order import OrderDB, OrderItemDB
from app.schemas.order import Order, OrderCreate, OrderUpdate
from typing import List

router = APIRouter()

@router.post("/", response_model=Order)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    db_order = OrderDB(
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        status=order.status
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:
        db_item = OrderItemDB(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(db_item)
    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("/", response_model=List[Order])
def get_all_orders(db: Session = Depends(get_db)):
    return db.query(OrderDB).all()

@router.get("/{order_id}", response_model=Order)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/{order_id}", response_model=Order)
def update_order(order_id: int, update: OrderUpdate, db: Session = Depends(get_db)):
    order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    for field, value in update.dict(exclude_unset=True).items():
        setattr(order, field, value)

    db.commit()
    db.refresh(order)
    return order

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(order)
    db.commit()
    return {"detail": f"Order {order_id} deleted"}
