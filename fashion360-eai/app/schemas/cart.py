from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItem(CartItemBase):
    id: int

    class Config:
        from_attributes = True


class CartBase(BaseModel):
    user_id: int

class CartCreate(CartBase):
    items: List[CartItemCreate]

class CartUpdate(BaseModel):
    user_id: Optional[int]
    items: Optional[List[CartItemCreate]]

class Cart(CartBase):
    id: int
    created_at: datetime
    items: List[CartItem] = []

    class Config:
        from_attributes = True
