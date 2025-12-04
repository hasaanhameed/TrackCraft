from backend.models import User
from backend.hashing import Hash
from backend import schema
from sqlalchemy.orm import Session


def create(request: schema.User, db: Session):
    new_user = User(name = request.name, email = request.email, password = Hash.bcrypt(request.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

def get_by_id(id: int, db: Session):
    user = db.query(User).filter(User.id == id).first()
    return user