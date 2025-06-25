from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    customer_name: str
    customer_email: Optional[str] = None
    status: Optional[str] = "pending"

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderUpdate(BaseModel):
    customer_name: Optional[str]
    customer_email: Optional[str]
    status: Optional[str]

class Order(OrderBase):
    id: int
    created_at: datetime
    updated_at: datetime
    items: List[OrderItem]

    class Config:
        from_attributes = True
