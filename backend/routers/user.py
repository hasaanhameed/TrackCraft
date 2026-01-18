from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import schema, database
from repository import user

router = APIRouter(tags=["Users"], prefix="/users")

# CREATE A NEW USER
@router.post("/signup")
def create_user(request : schema.User, db : Session = Depends(database.get_db)):
    return user.create(request, db)

# GET A USER BY ID
@router.get("/{id}")
def get_user(id: int, db: Session = Depends(database.get_db)):
    return user.get_by_id(id, db)
