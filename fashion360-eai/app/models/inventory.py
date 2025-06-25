from sqlalchemy import Column, Integer, String, TIMESTAMP, func
from app.db.session import Base

class InventoryDB(Base):
    __tablename__ = "inventory"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sku = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    quantity = Column(Integer, nullable=False)
    location = Column(String(50), nullable=False)
    description = Column(String(50), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp(), nullable=False)
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False
    )
    
from pydantic import BaseModel
from datetime import datetime

class Inventory(BaseModel):
    id: int
    sku: str
    name: str
    quantity: int
    location: str
    description: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
