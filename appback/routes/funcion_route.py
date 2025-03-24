from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import select, Session
from appback.models.funcion import Funcion, FuncionCreate, FuncionPublic, FuncionUpdate
from appback.database import get_session
from typing import Annotated

funcion_router = APIRouter()

session_dep = Annotated[Session, Depends(get_session)]

@funcion_router.post("/", response_model=FuncionPublic)
def create_funcion(funcion: FuncionCreate, session: session_dep):
    db_funcion = Funcion.model_validate(funcion)
    session.add(db_funcion)
    session.commit()
    session.refresh(db_funcion)
    return db_funcion

@funcion_router.get("/", response_model=list[FuncionPublic])
def read_funciones(session: session_dep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100): 
    return session.exec(select(Funcion).offset(offset).limit(limit)).all()

@funcion_router.get("/{id_funcion}", response_model=FuncionPublic)
def read_funcion(id_funcion: int, session: session_dep):
    funcion = session.get(Funcion, id_funcion)
    if not funcion:
        raise HTTPException(status_code=404, detail="Función no encontrada")
    return funcion

@funcion_router.patch("/{id_funcion}", response_model=FuncionPublic)
def update_funcion(id_funcion: int, funcion: FuncionUpdate, session: session_dep):
    funcion_db = session.get(Funcion, id_funcion)
    if not funcion_db:
        raise HTTPException(status_code=404, detail="Función no encontrada")
    funcion_data = funcion.model_dump()
    funcion_db.sqlmodel_update(funcion_data)
    session.add(funcion_db)
    session.commit()
    session.refresh(funcion_db)
    return funcion_db

@funcion_router.delete("/{id_funcion}")
def delete_funcion(id_funcion: int, session: session_dep):
    funcion = session.get(Funcion, id_funcion)
    if not funcion:
        raise HTTPException(status_code=404, detail="Función no encontrada")
    session.delete(funcion)
    session.commit()
    return {"ok": True}