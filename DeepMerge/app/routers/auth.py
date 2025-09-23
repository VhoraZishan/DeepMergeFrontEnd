from fastapi import APIRouter, Depends, HTTPException, status
from typing import Literal
from datetime import datetime, timedelta
from jose import jwt, JWTError

SECRET = "change-me"
ALGO = "HS256"


router = APIRouter(prefix="/auth", tags=["auth"])


def get_current_user_role(token: str | None = None) -> Literal["scientist", "admin", "policymaker"]:
	"""JWT role provider. In production, read 'Authorization: Bearer <token>' from headers."""
	if not token:
		return "scientist"
	try:
		payload = jwt.decode(token, SECRET, algorithms=[ALGO])
		role = payload.get("role", "scientist")
		return role if role in ("scientist", "admin", "policymaker") else "scientist"
	except JWTError:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


def require_role(*allowed: str):
	def _dep(role: str = Depends(get_current_user_role)):
		if role not in allowed:
			raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
		return role
	return _dep


@router.get("/whoami")
async def whoami(role: str = Depends(get_current_user_role)):
	return {"role": role}

@router.get("/admin/ping")
async def admin_ping(_: str = Depends(require_role("admin"))):
	return {"ok": True}


@router.get("/token/example")
async def token_example(role: str = "scientist"):
	now = datetime.utcnow()
	payload = {"role": role, "iat": int(now.timestamp()), "exp": int((now + timedelta(hours=4)).timestamp())}
	return {"token": jwt.encode(payload, SECRET, algorithm=ALGO)}


