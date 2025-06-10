from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, Session
from appback.models.departamento import Departamento, DepartamentoPublic
from appback.models.municipio import Municipio, MunicipioPublic
from appback.database import get_session
from typing import Annotated, List

departamento_router = APIRouter()

session_dep = Annotated[Session, Depends(get_session)]

@departamento_router.get("/", response_model=list[DepartamentoPublic])
def read_departamentos(session: session_dep):
    departamentos = session.exec(select(Departamento)).all()
    return departamentos

@departamento_router.get("/{departamento_id}", response_model=DepartamentoPublic)
def read_departamento(departamento_id: int, session: session_dep):
    departamento = session.get(Departamento, departamento_id)
    if not departamento:
        raise HTTPException(status_code=404, detail="Departamento no encontrado")
    return departamento

@departamento_router.get("/{departamento_id}/municipios", response_model=List[MunicipioPublic])
def read_municipios_por_departamento(
    departamento_id: int,
    session: session_dep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100
):
    departamento = session.get(Departamento, departamento_id)
    if not departamento:
        raise HTTPException(status_code=404, detail="Departamento no encontrado")
    
    municipios = session.exec(
        select(Municipio)
        .where(Municipio.id_departamento == departamento_id)
        .offset(offset)
        .limit(limit)
    ).all()
    
    return municipios