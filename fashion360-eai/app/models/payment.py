from sqlalchemy import Column, Integer, Float, Enum, TIMESTAMP, func, ForeignKey
from app.db.session import Base
import enum

class PaymentStatusEnum(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"

class PaymentDB(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    order_id = Column(Integer, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(Enum(PaymentStatusEnum), default=PaymentStatusEnum.pending, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp(), nullable=False)
