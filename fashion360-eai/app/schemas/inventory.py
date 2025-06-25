from pydantic import BaseModel
from datetime import datetime

class InventoryBase(BaseModel):
    sku: str
    name: str
    quantity: int
    location: str
    description: str

class InventoryCreate(InventoryBase):
    pass

class InventoryUpdate(InventoryBase):
    pass

class Inventory(InventoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
         from_attributes = True
