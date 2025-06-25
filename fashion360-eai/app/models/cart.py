from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.db.session import Base

class CartDB(Base):
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp(), nullable=False)

    items = relationship("CartItemDB", back_populates="cart", cascade="all, delete-orphan")


class CartItemDB(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("carts.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)

    cart = relationship("CartDB", back_populates="items")
