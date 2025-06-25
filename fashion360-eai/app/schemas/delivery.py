from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum

class DeliveryStatus(str, Enum):
    processing = "processing"
    shipped = "shipped"
    delivered = "delivered"

class DeliveryBase(BaseModel):
    order_id: int
    status: DeliveryStatus = DeliveryStatus.processing
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None

class DeliveryCreate(DeliveryBase):
    pass

class DeliveryUpdate(BaseModel):
    status: Optional[DeliveryStatus]
    shipped_at: Optional[datetime]
    delivered_at: Optional[datetime]

class Delivery(DeliveryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
