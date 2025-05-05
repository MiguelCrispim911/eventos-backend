from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import select, Session
from appback.models.administrador import Administrador, AdministradorLogin, AdministradorCreate, AdministradorPublic, AdministradorUpdate
from appback.database import get_session
from typing import Annotated
from appback.core.security import create_access_token
from appback.api.dependencies import get_current_admin
from appback.core.security import hash_password
from appback.core.security import verify_password

administrador_router = APIRouter()

session_dep = Annotated[Session, Depends(get_session)]

@administrador_router.post("/", response_model=AdministradorPublic)
def create_admin(admin: AdministradorCreate, session: session_dep):
    admin_dict = admin.model_dump()
    admin_dict["contrasena"] = hash_password(admin_dict["contrasena"])  # aquí hasheamos
    db_admin = Administrador(**admin_dict)
    session.add(db_admin)
    session.commit()
    session.refresh(db_admin)
    return db_admin

@administrador_router.get("/", response_model=list[AdministradorPublic])
def read_admins(session: session_dep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100): 
    return session.exec(select(Administrador).offset(offset).limit(limit)).all()

@administrador_router.get("/{cedula_adm}", response_model=AdministradorPublic)
def read_admin(cedula_adm: int, session: session_dep):
    admin = session.get(Administrador, cedula_adm)
    if not admin:
        raise HTTPException(status_code=404, detail="Administrador no encontrado")
    return admin

@administrador_router.patch("/{cedula_adm}", response_model=AdministradorPublic)
def update_admin(cedula_adm: int, admin: AdministradorUpdate, session: session_dep):
    admin_db = session.get(Administrador, cedula_adm)
    if not admin_db:
        raise HTTPException(status_code=404, detail="Administrador no encontrado")
    admin_data = admin.model_dump(exclude_unset=True)
    admin_db.sqlmodel_update(admin_data)
    session.add(admin_db)
    session.commit()
    session.refresh(admin_db)
    return admin_db

@administrador_router.delete("/{cedula_adm}")
def delete_admin(cedula_adm: int, session: session_dep):
    admin = session.get(Administrador, cedula_adm)
    if not admin:
        raise HTTPException(status_code=404, detail="Administrador no encontrado")
    session.delete(admin)
    session.commit()
    return {"ok": True}


@administrador_router.post("/login/")
def login_admin(admin: AdministradorLogin, session: Session = Depends(get_session)):
    db_admin = session.get(Administrador, admin.cedula_adm)
    
    if not db_admin or not verify_password(admin.contrasena, db_admin.contrasena):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    access_token = create_access_token(data={
        "tipo_usuario": "admin",
        "id_usuario": str(db_admin.cedula_adm),
        "nombre_usuario": str(db_admin.nombres)
    })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }