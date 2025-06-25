from pydantic import BaseModel
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    sku: str
    price: float
    stock_quantity: int
    description: str
    image_url: str
    category_id: int

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):  # all fields required for update as well
    pass

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
