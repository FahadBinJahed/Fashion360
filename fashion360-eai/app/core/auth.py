
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import UserDB
from app.core.config import SECRET_KEY, ALGORITHM
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/staff/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserDB:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def admin_required(current_user: UserDB = Depends(get_current_user)) -> UserDB:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
