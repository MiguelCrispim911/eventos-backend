from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import select, Session, join
from appback.models.ubicacion import (
    Ubicacion, UbicacionCreate, UbicacionPublic,
    UbicacionUpdate, UbicacionWithRelations
)
from appback.models.municipio import Municipio
from appback.models.departamento import Departamento
from appback.database import get_session
from typing import Annotated, Optional

ubicacion_router = APIRouter()

session_dep = Annotated[Session, Depends(get_session)]

@ubicacion_router.post("/", response_model=UbicacionPublic)
def create_ubicacion(ubicacion: UbicacionCreate, session: session_dep):
    # Validar que el municipio existe
    municipio = session.get(Municipio, ubicacion.id_municipio)
    if not municipio:
        raise HTTPException(
            status_code=400,
            detail="El municipio seleccionado no existe"
        )
    
    db_ubicacion = Ubicacion.model_validate(ubicacion)
    session.add(db_ubicacion)
    session.commit()
    session.refresh(db_ubicacion)
    return db_ubicacion

@ubicacion_router.get("/", response_model=list[UbicacionWithRelations])
def read_ubicaciones(
    session: session_dep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
    id_municipio: Optional[int] = None,
    id_departamento: Optional[int] = None
):
    query = (
        select(
            Ubicacion,
            Municipio.nombre.label("nombre_municipio"),
            Departamento.nombre.label("nombre_departamento")
        )
        .join(Municipio, Ubicacion.id_municipio == Municipio.id)
        .join(Departamento, Municipio.id_departamento == Departamento.id)
    )
    
    if id_municipio:
        query = query.where(Ubicacion.id_municipio == id_municipio)
    elif id_departamento:
        query = query.where(Municipio.id_departamento == id_departamento)
    
    query = query.offset(offset).limit(limit)
    results = session.exec(query).all()
    
    return [
        UbicacionWithRelations(
            **ubicacion.model_dump(),
            nombre_municipio=nombre_municipio,
            nombre_departamento=nombre_departamento
        )
        for ubicacion, nombre_municipio, nombre_departamento in results
    ]

@ubicacion_router.get("/{id_ubicacion}", response_model=UbicacionWithRelations)
def read_ubicacion(id_ubicacion: int, session: session_dep):
    query = (
        select(
            Ubicacion,
            Municipio.nombre.label("nombre_municipio"),
            Departamento.nombre.label("nombre_departamento")
        )
        .join(Municipio, Ubicacion.id_municipio == Municipio.id)
        .join(Departamento, Municipio.id_departamento == Departamento.id)
        .where(Ubicacion.id_ubicacion == id_ubicacion)
    )
    
    result = session.exec(query).first()
    
    if not result:
        raise HTTPException(
            status_code=404,
            detail="Ubicación no encontrada"
        )
    
    ubicacion, nombre_municipio, nombre_departamento = result
    return UbicacionWithRelations(
        **ubicacion.model_dump(),
        nombre_municipio=nombre_municipio,
        nombre_departamento=nombre_departamento
    )

@ubicacion_router.patch("/{id_ubicacion}", response_model=UbicacionPublic)
def update_ubicacion(
    id_ubicacion: int,
    ubicacion: UbicacionUpdate,
    session: session_dep
):
    ubicacion_db = session.get(Ubicacion, id_ubicacion)
    if not ubicacion_db:
        raise HTTPException(
            status_code=404,
            detail="Ubicación no encontrada"
        )
    
    if ubicacion.id_municipio is not None:
        municipio = session.get(Municipio, ubicacion.id_municipio)
        if not municipio:
            raise HTTPException(
                status_code=400,
                detail="El municipio seleccionado no existe"
            )
    
    ubicacion_data = ubicacion.model_dump(exclude_unset=True)
    ubicacion_db.sqlmodel_update(ubicacion_data)
    session.add(ubicacion_db)
    session.commit()
    session.refresh(ubicacion_db)
    return ubicacion_db

@ubicacion_router.delete("/{id_ubicacion}")
def delete_ubicacion(id_ubicacion: int, session: session_dep):
    ubicacion = session.get(Ubicacion, id_ubicacion)
    if not ubicacion:
        raise HTTPException(
            status_code=404,
            detail="Ubicación no encontrada"
        )
    session.delete(ubicacion)
    session.commit()
    return {"ok": True}