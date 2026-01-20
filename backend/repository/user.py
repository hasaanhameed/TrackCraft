from models import User
from hashing import Hash
import schema
from sqlalchemy.orm import Session
from fastapi import HTTPException, status


def create(request: schema.User, db: Session):
    new_user = User(
        name=request.name, 
        email=request.email, 
        password=Hash.bcrypt(request.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


def get_by_id(id: int, db: Session):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {id} not found"
        )
    return user


def update_monthly_limit(id: int, monthly_limit: float, db: Session):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {id} not found"
        )
    
    user.monthly_limit = monthly_limit
    db.commit()
    db.refresh(user)
    return user
