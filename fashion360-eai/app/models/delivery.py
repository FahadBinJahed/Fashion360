from sqlalchemy import Column, Integer, Enum, TIMESTAMP, ForeignKey, func
from app.db.session import Base
import enum

class DeliveryStatus(str, enum.Enum):
    processing = "processing"
    shipped = "shipped"
    delivered = "delivered"

class DeliveryDB(Base):
    __tablename__ = "deliveries"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    status = Column(Enum(DeliveryStatus), default=DeliveryStatus.processing, nullable=False)
    shipped_at = Column(TIMESTAMP, nullable=True)
    delivered_at = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp(), nullable=False)
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False,
    )
