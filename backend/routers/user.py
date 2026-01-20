from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import schema, database
from repository import user
from oauth2 import get_current_user
from models import User

router = APIRouter(tags=["Users"], prefix="/users")

# GET CURRENT USER
@router.get("/me", response_model=schema.UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

# CREATE A NEW USER
@router.post("/signup")
def create_user(request: schema.User, db: Session = Depends(database.get_db)):
    return user.create(request, db)

# GET A USER BY ID
@router.get("/{id}", response_model=schema.UserResponse)
def get_user(id: int, db: Session = Depends(database.get_db)):
    return user.get_by_id(id, db)

# UPDATE USER'S MONTHLY LIMIT
@router.put("/{id}/monthly-limit", response_model=schema.UserResponse)
def update_monthly_limit(
    id: int, 
    request: schema.UpdateMonthlyLimit, 
    db: Session = Depends(database.get_db),
    current_user: User = Depends(get_current_user)
):
    # Ensure user can only update their own limit
    if current_user.id != id:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user's limit"
        )
    return user.update_monthly_limit(id, request.monthly_limit, db)