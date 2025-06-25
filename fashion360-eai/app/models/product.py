from sqlalchemy import Column, Integer, String, Float, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.db.session import Base

class ProductDB(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    sku = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(String(255))
    price = Column(Float, nullable=False)
    stock_quantity = Column(Integer, nullable=False)
    image_url = Column(String(255), nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp(), nullable=False)
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False
    )
    category = relationship("CategoryDB")
