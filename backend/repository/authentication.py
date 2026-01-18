from hashing import Hash
import models
from fastapi import HTTPException, status
from auth_token import create_access_token
from schema import Token


def login_user(request, db):

    user = db.query(models.User).filter(models.User.email == request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Credentials")
    
    if not Hash.verify(plain_password=request.password, hashed_password=user.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Password")
    
    access_token = create_access_token(data={"sub": user.email})
    
    return Token(access_token=access_token, token_type="bearer")