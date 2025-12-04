from backend.hashing import Hash
from backend import models
from fastapi import HTTPException, status
from backend.auth_token import create_access_token
from backend.schema import Token


def login_user(request, db):

    user = db.query(models.User).filter(models.User.email == request.username).first()
    if not user:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = f"Invalid Credentials")
    
    if not Hash.verify(hashed_password=user.password, plain_password=request.password):
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = f"Invalid Password")
    
    # Generate JWT(JSON Web Token) Here 
    access_token = create_access_token(data={"sub": user.email})
    
    return Token(access_token=access_token, token_type="bearer")