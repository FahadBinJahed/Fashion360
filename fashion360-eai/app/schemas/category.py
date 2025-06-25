from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]

class Category(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True 
