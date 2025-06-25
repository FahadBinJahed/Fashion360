from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from typing import Optional

class PaymentStatusEnum(str, Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"

class PaymentBase(BaseModel):
    user_id: int
    order_id: int
    amount: float
    status: Optional[PaymentStatusEnum] = PaymentStatusEnum.pending

class PaymentCreate(PaymentBase):
    pass

class PaymentUpdate(BaseModel):
    amount: Optional[float] = None
    status: Optional[PaymentStatusEnum] = None

class Payment(PaymentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
