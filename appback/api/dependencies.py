from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from sqlmodel import Session
from appback.core.security import verify_token
from appback.models.administrador import Administrador
from appback.models.cliente import Cliente
from appback.database import get_session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_admin(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
):
    cedula = verify_token(token)
    admin = session.get(Administrador, cedula)
    if admin is None:
        raise HTTPException(status_code=404, detail="Administrador no encontrado")
    return admin

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
):
    cedula = verify_token(token)
    admin = session.get(Cliente, cedula)
    if admin is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return admin