from pydantic import BaseModel
from datetime import datetime, date

class User(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    monthly_limit: float | None = None
    
    class Config:
        from_attributes = True

class UpdateMonthlyLimit(BaseModel):
    monthly_limit: float
    
class Expense(BaseModel):
    amount: float
    description: str
    category: str
    date: str
    
class ExpenseResponse(BaseModel):
    id: int
    user_id: int
    amount: float
    description: str
    category: str
    date: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None  # Changed from 'username'