import sys
import os
from sqlalchemy.orm import Session
from getpass import getpass

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import SessionLocal
from app.models.user import User
from app.core import security

def create_admin():
    email = input("Enter admin email: ")
    full_name = input("Enter admin full name: ")
    password = getpass("Enter admin password: ")
    confirm_password = getpass("Confirm admin password: ")

    if password != confirm_password:
        print("Passwords do not match!")
        return

    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"User with email {email} already exists.")
            return

        db_user = User(
            email=email,
            hashed_password=security.get_password_hash(password),
            full_name=full_name,
            role="admin",
            is_active=True,
            is_superuser=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        print(f"Admin user {email} created successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
