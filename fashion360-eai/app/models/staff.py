from sqlalchemy import Column, Integer, String, Enum
from app.db.session import Base
import enum

class UserRole(str, enum.Enum):
    admin = "admin"
    user = "staff"

class StaffDB(Base):
    __tablename__ = "staffs"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.user, nullable=False)
