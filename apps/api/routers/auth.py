from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["Auth"])


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    role: str


@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest):
    return AuthResponse(
        access_token="demo_jwt_token_musikpro",
        user_id="00000000-0000-0000-0000-000000000001",
        email=req.email,
        role="musicien"
    )
