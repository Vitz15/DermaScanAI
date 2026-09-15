import uuid
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from db.models import User
from schemas.auth_models import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from services.security import hash_password, verify_password, create_access_token

router = APIRouter()


@router.post("/api/auth/register", response_model=UserResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail={
            "error": "email_taken",
            "message": "Email is already registered."
        })

    user = User(
        id=f"U-{uuid.uuid4().hex[:8]}",
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserResponse(id=user.id, email=user.email, full_name=user.full_name)


@router.post("/api/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail={
            "error": "invalid_credentials",
            "message": "Incorrect email or password."
        })

    token = create_access_token(data={"sub": user.id})
    return TokenResponse(access_token=token)