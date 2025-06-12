from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import select, Session, join
from appback.models.administrador import (
    Administrador, 
    AdministradorLogin, 
    AdministradorCreate,
    AdministradorPublic, 
    AdministradorUpdate, 
    AdministradorWithRelations
)
from appback.models.municipio import Municipio
from appback.models.departamento import Departamento
from appback.database import get_session
from typing import Annotated, Optional
from appback.core.security import create_access_token, hash_password, verify_password

administrador_router = APIRouter()

# Dependencia para la sesión de la base de datos
session_dep = Annotated[Session, Depends(get_session)]

# Crear nuevo administrador
@administrador_router.post("/", response_model=AdministradorPublic)
def create_admin(admin: AdministradorCreate, session: session_dep):
    # Validar que el municipio existe
    municipio = session.get(Municipio, admin.id_municipio)
    if not municipio:
        raise HTTPException(
            status_code=400,
            detail="El municipio seleccionado no existe"
        )
    
    # Hash de la contraseña
    admin_dict = admin.model_dump()
    admin_dict["contrasena"] = hash_password(admin_dict["contrasena"])
    
    # Crear el administrador
    db_admin = Administrador(**admin_dict)
    session.add(db_admin)
    session.commit()
    session.refresh(db_admin)
    return db_admin

# Obtener todos los administradores (con datos de municipio y departamento)
@administrador_router.get("/", response_model=list[AdministradorWithRelations])
def read_admins(
    session: session_dep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
    id_municipio: Optional[int] = None,  # Filtro opcional por municipio
    id_departamento: Optional[int] = None  # Filtro opcional por departamento
):
    # Construir la consulta con joins
    query = (
        select(
            Administrador,
            Municipio.nombre.label("nombre_municipio"),
            Departamento.nombre.label("nombre_departamento")
        )
        .join(Municipio, Administrador.id_municipio == Municipio.id)
        .join(Departamento, Municipio.id_departamento == Departamento.id)
    )
    
    # Aplicar filtros si existen
    if id_municipio:
        query = query.where(Administrador.id_municipio == id_municipio)
    elif id_departamento:
        query = query.where(Municipio.id_departamento == id_departamento)
    
    # Paginación y ejecución
    query = query.offset(offset).limit(limit)
    results = session.exec(query).all()
    
    # Formatear la respuesta
    return [
        AdministradorWithRelations(
            **admin.model_dump(),
            nombre_municipio=nombre_municipio,
            nombre_departamento=nombre_departamento
        )
        for admin, nombre_municipio, nombre_departamento in results
    ]

# Obtener un administrador específico
@administrador_router.get("/{cedula_adm}", response_model=AdministradorWithRelations)
def read_admin(cedula_adm: int, session: session_dep):
    # Consulta con joins para obtener datos relacionados
    query = (
        select(
            Administrador,
            Municipio.nombre.label("nombre_municipio"),
            Departamento.nombre.label("nombre_departamento")
        )
        .join(Municipio, Administrador.id_municipio == Municipio.id)
        .join(Departamento, Municipio.id_departamento == Departamento.id)
        .where(Administrador.cedula_adm == cedula_adm)
    )
    
    result = session.exec(query).first()
    
    if not result:
        raise HTTPException(
            status_code=404,
            detail="Administrador no encontrado"
        )
    
    admin, nombre_municipio, nombre_departamento = result
    return AdministradorWithRelations(
        **admin.model_dump(),
        nombre_municipio=nombre_municipio,
        nombre_departamento=nombre_departamento
    )

# Actualizar administrador
@administrador_router.patch("/{cedula_adm}", response_model=AdministradorPublic)
def update_admin(
    cedula_adm: int,
    admin: AdministradorUpdate,
    session: session_dep
):
    # Obtener el administrador existente
    admin_db = session.get(Administrador, cedula_adm)
    if not admin_db:
        raise HTTPException(
            status_code=404,
            detail="Administrador no encontrado"
        )
    
    # Validar municipio si se está actualizando
    if admin.id_municipio is not None:
        municipio = session.get(Municipio, admin.id_municipio)
        if not municipio:
            raise HTTPException(
                status_code=400,
                detail="El municipio seleccionado no existe"
            )
    
    # Actualizar solo los campos proporcionados
    admin_data = admin.model_dump(exclude_unset=True)
    
    # Hashear nueva contraseña si se proporciona
    if "contrasena" in admin_data:
        admin_data["contrasena"] = hash_password(admin_data["contrasena"])
    
    # Realizar la actualización
    admin_db.sqlmodel_update(admin_data)
    session.add(admin_db)
    session.commit()
    session.refresh(admin_db)
    return admin_db

# Eliminar administrador
@administrador_router.delete("/{cedula_adm}")
def delete_admin(cedula_adm: int, session: session_dep):
    admin = session.get(Administrador, cedula_adm)
    if not admin:
        raise HTTPException(
            status_code=404,
            detail="Administrador no encontrado"
        )
    session.delete(admin)
    session.commit()
    return {"ok": True}

# Login de administrador
@administrador_router.post("/login/")
def login_admin(admin: AdministradorLogin, session: Session = Depends(get_session)):
    db_admin = session.get(Administrador, admin.cedula_adm)
    
    if not db_admin or not verify_password(admin.contrasena, db_admin.contrasena):
        raise HTTPException(
            status_code=401,
            detail="Credenciales inválidas"
        )

    access_token = create_access_token(data={
        "tipo_usuario": "admin",
        "id_usuario": str(db_admin.cedula_adm),
        "nombre_usuario": str(db_admin.nombres)
    })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }