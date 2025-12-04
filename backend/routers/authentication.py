from fastapi import APIRouter, Depends
from backend import database
from sqlalchemy.orm import Session
from backend.repository.authentication import login_user
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix = "/login", tags=['Authentication'])

@router.post('/')
def login(request : OAuth2PasswordRequestForm = Depends(), db : Session = Depends(database.get_db)):
    return login_user(request, db)
    