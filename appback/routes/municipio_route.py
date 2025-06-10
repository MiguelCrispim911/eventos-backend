from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import select, Session
from appback.models.municipio import Municipio, MunicipioPublic
from appback.database import get_session
from typing import Annotated, List, Optional

municipio_router = APIRouter(prefix="/municipios", tags=["municipios"])

session_dep = Annotated[Session, Depends(get_session)]

@municipio_router.get("/", response_model=List[MunicipioPublic])
def read_municipios(
    session: session_dep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
    id_departamento: Optional[int] = None
):
    query = select(Municipio)
    
    if id_departamento:
        query = query.where(Municipio.id_departamento == id_departamento)
    
    return session.exec(query.offset(offset).limit(limit)).all()

@municipio_router.get("/{id_municipio}", response_model=MunicipioPublic)
def read_municipio(id_municipio: int, session: session_dep):
    municipio = session.get(Municipio, id_municipio)
    if not municipio:
        raise HTTPException(status_code=404, detail="Municipio no encontrado")
    return municipio