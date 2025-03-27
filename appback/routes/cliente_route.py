from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import select, Session
from appback.models.cliente import Cliente, ClienteCreate, ClientePublic, ClienteUpdate, LoginData
from appback.database import get_session
from pydantic import BaseModel
from typing import Annotated

cliente_router = APIRouter()

session_dep = Annotated[Session, Depends(get_session)]

@cliente_router.post("/", response_model=ClientePublic)
def create_cliente(cliente: ClienteCreate, session: session_dep):
    db_cliente = Cliente.model_validate(cliente)
    session.add(db_cliente)
    session.commit()
    session.refresh(db_cliente)
    return db_cliente

@cliente_router.get("/", response_model=list[ClientePublic])
def read_clientes(session: session_dep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100):
    return session.exec(select(Cliente).offset(offset).limit(limit)).all()

@cliente_router.get("/{cedula}", response_model=ClientePublic)
def read_cliente(cedula: int, session: session_dep):
    cliente = session.get(Cliente, cedula)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente

@cliente_router.patch("/{cedula}", response_model=ClientePublic)
def update_cliente(cedula: int, cliente: ClienteUpdate, session: session_dep):
    cliente_db = session.get(Cliente, cedula)
    if not cliente_db:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    cliente_data = cliente.model_dump(exclude_unset=True)
    cliente_db.sqlmodel_update(cliente_data)
    session.add(cliente_db)
    session.commit()
    session.refresh(cliente_db)
    return cliente_db

@cliente_router.delete("/{cedula}")
def delete_cliente(cedula: int, session: session_dep):
    cliente = session.get(Cliente, cedula)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    session.delete(cliente)
    session.commit()
    return {"ok": True}


@cliente_router.post("/login")
def login(user: LoginData, session: session_dep):
    cliente = session.exec(select(Cliente).where(Cliente.cedula == user.cedula)).first()

    if not cliente or cliente.contrasena != user.contrasena:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    return {"message": "Login exitoso", "user": cliente.cedula}


class ChangePasswordRequest(BaseModel):
    cedula: int
    contrasena_actual: str
    nueva_contrasena: str

@cliente_router.post("/cambiar_contrasena")
def cambiar_contrasena(data: ChangePasswordRequest, session: session_dep):
    cliente = session.exec(select(Cliente).where(Cliente.cedula == data.cedula)).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    if cliente.contrasena != data.contrasena_actual:
        raise HTTPException(status_code=401, detail="Contraseña actual incorrecta")

    cliente.contrasena = data.nueva_contrasena
    session.add(cliente)
    session.commit()
    session.refresh(cliente)

    return {"message": "Contraseña actualizada exitosamente"}