# TrackCraft – Personal Expense Tracker

TrackCraft is a full-stack expense tracking application designed for both mobile and web platforms. It provides an intuitive interface for logging, managing, and reviewing personal expenses. The system consists of a React TypeScript frontend and a FastAPI backend with PostgreSQL as the database.

## Features

### Expense Management
- Add, edit, and delete expenses.
- View all expenses in a structured list.
- Categorize expenses for easier filtering.
- User-scoped data access.

### Authentication
- Secure user registration and login.
- Password hashing using bcrypt.
- JWT authentication with expiration handling.

### User Experience
- Fully responsive and optimized for mobile and desktop.
- Clean, modern UI.
- Fast loading and smooth navigation through Vite and React.

## Technology Stack

### Frontend
- React with TypeScript
- Responsive layout
- API integration through service modules

### Backend
- FastAPI for server and routing logic
- SQLAlchemy ORM for interacting with PostgreSQL
- JWT token management
- bcrypt hashing

### Database
- PostgreSQL hosted in the cloud
- Database handled with SQLAlchemy models and Alembic migrations


## API Endpoints

### Authentication
- POST `/login/`  
  Authenticates the user and returns a JWT.

### Users
- POST `/users/signup`  
  Creates a new user account.  
- GET `/users/{id}`  
  Retrieves a user by ID. 

### Expenses
- POST `/expenses/create`  
  Add a new expense.
- GET `/expenses/get_expenses`  
  Retrieve all expenses for the authenticated user.
- PUT `/expenses/update/{id}`  
  Update an existing expense.
- DELETE `/expenses/delete/{id}`  
  Delete an expense.

## Deployment

### Backend
- Hosted on Railway
- Auto-deploy from GitHub
- Configured CORS for production domains

### Frontend
- Hosted on Vercel
- Automatic builds triggered from GitHub commits
- Environment variables managed through Vercel dashboard

## Security
- Passwords hashed using bcrypt
- JWT authentication with expiration enforcement
- User-scoped database operations




## Folder Structure (Overview)

