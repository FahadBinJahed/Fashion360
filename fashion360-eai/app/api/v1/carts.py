from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.cart import CartDB, CartItemDB
from app.schemas.cart import CartCreate, CartUpdate, Cart, CartItemCreate

router = APIRouter()

@router.post("/", response_model=Cart)
def create_cart(cart_data: CartCreate, db: Session = Depends(get_db)):
    new_cart = CartDB(user_id=cart_data.user_id)
    db.add(new_cart)
    db.flush()  # To get new_cart.id

    for item in cart_data.items:
        db.add(CartItemDB(cart_id=new_cart.id, product_id=item.product_id, quantity=item.quantity))

    db.commit()
    db.refresh(new_cart)
    return new_cart

@router.get("/{cart_id}", response_model=Cart)
def get_cart(cart_id: int, db: Session = Depends(get_db)):
    cart = db.query(CartDB).filter(CartDB.id == cart_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    return cart

@router.put("/{cart_id}", response_model=Cart)
def update_cart(cart_id: int, cart_update: CartUpdate, db: Session = Depends(get_db)):
    cart = db.query(CartDB).filter(CartDB.id == cart_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    if cart_update.user_id is not None:
        cart.user_id = cart_update.user_id

    if cart_update.items is not None:
        db.query(CartItemDB).filter(CartItemDB.cart_id == cart.id).delete()
        for item in cart_update.items:
            db.add(CartItemDB(cart_id=cart.id, product_id=item.product_id, quantity=item.quantity))

    db.commit()
    db.refresh(cart)
    return cart

@router.delete("/{cart_id}")
def delete_cart(cart_id: int, db: Session = Depends(get_db)):
    cart = db.query(CartDB).filter(CartDB.id == cart_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    db.delete(cart)
    db.commit()
    return {"detail": f"Cart {cart_id} deleted"}

@router.get("/", response_model=List[Cart])
def list_carts(db: Session = Depends(get_db)):
    return db.query(CartDB).all()
