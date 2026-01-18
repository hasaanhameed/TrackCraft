from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import schema, database, oauth2
from repository import expense

router = APIRouter(tags=["Expenses"], prefix="/expenses")

# CREATE A NEW EXPENSE
@router.post("/create")
def create_expense(request : schema.Expense, db : Session = Depends(database.get_db), current_user: schema.User = Depends(oauth2.get_current_user)):
    return expense.create(request, db, current_user.id)

# GET ALL EXPENSES FOR THE CURRENT USER
@router.get("/get_expenses", response_model=list[schema.ExpenseResponse])
def get_all_expenses(db: Session = Depends(database.get_db), current_user: schema.User = Depends(oauth2.get_current_user)
):
    return expense.get_all(db, current_user.id)


# DELETE AN EXPENSE BY ID
@router.delete("/delete/{id}")
def delete_expense(id: int, db: Session = Depends(database.get_db), current_user: schema.User = Depends(oauth2.get_current_user)):
    return expense.delete(id, db, current_user.id)

# UPDATE AN EXPENSE BY ID
@router.put("/update/{id}")
def update_expense(id: int, request: schema.Expense, db: Session = Depends(database.get_db), current_user: schema.User = Depends(oauth2.get_current_user)):
    return expense.update(id, request, db, current_user.id)