from backend.models import Expense
from fastapi import HTTPException, status

# CREATING A NEW USER
def create(request, db, user_id):
    new_expense = Expense(user_id = user_id, 
                          amount = request.amount, 
                          description = request.description, 
                          category = request.category, 
                          date=request.date)
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    
    return new_expense

# GETTING ALL EXPENSES FOR A USER
def get_all(db, user_id: int):
    return db.query(Expense).filter(Expense.user_id == user_id).all()

# DELETING AN EXPENSE BY ID
def delete(id: int, db, user_id: int):
    expense = db.query(Expense).filter(
        Expense.id == id,
        Expense.user_id == user_id
    ).first()

    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found or unauthorized"
        )

    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted successfully"}

# UPDATING AN EXPENSE BY ID
def update(id: int, request, db, user_id: int):
    expense = db.query(Expense).filter(
        Expense.id == id,
        Expense.user_id == user_id
    ).first()

    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found or unauthorized"
        )

    expense.amount = request.amount
    expense.description = request.description
    expense.category = request.category
    expense.date = request.date

    db.commit()
    db.refresh(expense)
    return expense