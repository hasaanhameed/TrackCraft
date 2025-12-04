from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend import models, database
from backend.routers import user, authentication, expense

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create the database tables
models.Base.metadata.create_all(database.engine)  


app.include_router(user.router)
app.include_router(expense.router)
app.include_router(authentication.router)