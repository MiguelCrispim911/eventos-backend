from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import select, Session
from appback.models.ubicacion import Ubicacion, UbicacionCreate, UbicacionPublic, UbicacionUpdate
from appback.database import get_session
from typing import Annotated

ubicacion_router = APIRouter()

session_dep = Annotated[Session, Depends(get_session)]

@ubicacion_router.post("/", response_model=UbicacionPublic)
def create_ubicacion(ubicacion: UbicacionCreate, session: session_dep):
    db_ubicacion = Ubicacion.model_validate(ubicacion)
    session.add(db_ubicacion)
    session.commit()
    session.refresh(db_ubicacion)
    return db_ubicacion

@ubicacion_router.get("/", response_model=list[UbicacionPublic])
def read_ubicaciones(session: session_dep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100):
    return session.exec(select(Ubicacion).offset(offset).limit(limit)).all()

@ubicacion_router.get("/{id_ubicacion}", response_model=UbicacionPublic)
def read_ubicacion(id_ubicacion: int, session: session_dep):
    ubicacion = session.get(Ubicacion, id_ubicacion)
    if not ubicacion:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    return ubicacion

@ubicacion_router.patch("/{id_ubicacion}", response_model=UbicacionPublic)
def update_ubicacion(id_ubicacion: int, ubicacion: UbicacionUpdate, session: session_dep):
    ubicacion_db = session.get(Ubicacion, id_ubicacion)
    if not ubicacion_db:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
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
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    session.delete(ubicacion)
    session.commit()
    return {"ok": True}
