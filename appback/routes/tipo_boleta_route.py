from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import select, Session
from appback.models.tipo_boleta import TipoBoleta, TipoBoletaCreate, TipoBoletaPublic, TipoBoletaUpdate
from appback.database import get_session
from typing import Annotated


# appback/routes/tipo_boleta_route.py
# Este archivo define las rutas para manejar las operaciones CRUD de los tipos de boleta.
tipo_boleta_router = APIRouter()

# Dependencia para obtener la sesión de la base de datos
session_dep = Annotated[Session, Depends(get_session)]

# Rutas para manejar los tipos de boleta
@tipo_boleta_router.post("/", response_model=TipoBoletaPublic)
def create_tipo_boleta(tipo_boleta: TipoBoletaCreate, session: session_dep):
    db_tipo_boleta = TipoBoleta.model_validate(tipo_boleta)
    session.add(db_tipo_boleta)
    session.commit()
    session.refresh(db_tipo_boleta)
    return db_tipo_boleta

# Obtener todos los tipos de boleta con paginación
@tipo_boleta_router.get("/", response_model=list[TipoBoletaPublic])
def read_tipo_boletas(session: session_dep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100):
    return session.exec(select(TipoBoleta).offset(offset).limit(limit)).all()

# Obtener un tipo de boleta por su ID
@tipo_boleta_router.get("/{id_tipoboleta}", response_model=TipoBoletaPublic)
def read_tipo_boleta(id_tipoboleta: int, session: session_dep):
    tipo_boleta = session.get(TipoBoleta, id_tipoboleta)
    if not tipo_boleta:
        raise HTTPException(status_code=404, detail="Tipo de Boleta no encontrado")
    return tipo_boleta

# Obtener tipos de boleta por id_funcion
@tipo_boleta_router.get("/por_funcion/{id_funcion}", response_model=list[TipoBoletaPublic])
def read_tipo_boletas_por_funcion(id_funcion: int, session: session_dep):
    tipos = session.exec(select(TipoBoleta).where(TipoBoleta.id_funcion == id_funcion)).all()
    return tipos

# Actualizar un tipo de boleta por su ID
@tipo_boleta_router.patch("/{id_tipoboleta}", response_model=TipoBoletaPublic)
def update_tipo_boleta(id_tipoboleta: int, tipo_boleta: TipoBoletaUpdate, session: session_dep):
    tipo_boleta_db = session.get(TipoBoleta, id_tipoboleta)
    if not tipo_boleta_db:
        raise HTTPException(status_code=404, detail="Tipo de Boleta no encontrado")
    tipo_boleta_data = tipo_boleta.model_dump(exclude_unset=True)
    tipo_boleta_db.sqlmodel_update(tipo_boleta_data)
    session.add(tipo_boleta_db)
    session.commit()
    session.refresh(tipo_boleta_db)
    return tipo_boleta_db

# Eliminar un tipo de boleta por su ID
@tipo_boleta_router.delete("/{id_tipoboleta}")
def delete_tipo_boleta(id_tipoboleta: int, session: session_dep):
    tipo_boleta = session.get(TipoBoleta, id_tipoboleta)
    if not tipo_boleta:
        raise HTTPException(status_code=404, detail="Tipo de Boleta no encontrado")
    session.delete(tipo_boleta)
    session.commit()
    return {"ok": True}