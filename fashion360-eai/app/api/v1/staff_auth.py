from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from jose import jwt
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordRequestForm

from app.db.session import get_db
from app.models.staff import StaffDB  
from app.schemas.staff import StaffCreate, StaffLogin, StaffOut, StaffUpdate
from app.core.security import hash_password, verify_password
from app.core.config import SECRET_KEY, ALGORITHM
from app.core.auth import get_current_user

router = APIRouter()

ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register", response_model=StaffOut)
def register(staff: StaffCreate, db: Session = Depends(get_db)):
    existing = db.query(StaffDB).filter(StaffDB.username == staff.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed = hash_password(staff.password)
    db_staff = StaffDB(username=staff.username, hashed_password=hashed, role=staff.role)
    db.add(db_staff)
    db.commit()
    db.refresh(db_staff)
    return db_staff

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    staff = db.query(StaffDB).filter(StaffDB.username == form_data.username).first()
    if not staff or not verify_password(form_data.password, staff.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": str(staff.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
def logout():
    return {"detail": "Logged out successfully"}

@router.put("/update", response_model=StaffOut)
def update_staff(
    update: StaffUpdate,
    db: Session = Depends(get_db),
    current_staff: StaffDB = Depends(get_current_user)  
):
    if update.username:
        current_staff.username = update.username
    if update.password:
        current_staff.hashed_password = hash_password(update.password)
    if update.role:
        current_staff.role = update.role
    db.commit()
    db.refresh(current_staff)
    return current_staff

@router.delete("/delete")
def delete_staff(db: Session = Depends(get_db), current_staff: StaffDB = Depends(get_current_user)):
    db.delete(current_staff)
    db.commit()
    return {"detail": f"Staff {current_staff.username} deleted"}
