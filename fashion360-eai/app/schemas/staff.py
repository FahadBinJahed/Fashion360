from pydantic import BaseModel
from enum import Enum
from typing import Optional

class StaffRole(str, Enum):
    admin = "admin"
    staff = "staff"


class StaffBase(BaseModel):
    username: str
    role: Optional[StaffRole] = StaffRole.staff

class StaffCreate(StaffBase):
    password: str

class StaffLogin(BaseModel):
    username: str
    password: str

class StaffUpdate(BaseModel):
    username: Optional[str]
    password: Optional[str]
    role: Optional[StaffRole]

class StaffOut(StaffBase):
    id: int
    class Config:
        from_attributes = True
