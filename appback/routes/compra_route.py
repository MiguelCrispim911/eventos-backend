from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import select, Session
from typing import Annotated, Optional 
from appback.models.compra import Compra, CompraCreate, CompraPublic, CompraUpdate
from appback.database import get_session
from typing import Annotated

compra_router = APIRouter()

session_dep = Annotated[Session, Depends(get_session)]

@compra_router.post("/", response_model=CompraPublic)
def create_compra(compra: CompraCreate, session: session_dep):
    db_compra = Compra.model_validate(compra)
    session.add(db_compra)
    session.commit()
    session.refresh(db_compra)
    return db_compra

@compra_router.get("/", response_model=list[CompraPublic])
def read_compras(session: session_dep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100):
    return session.exec(select(Compra).offset(offset).limit(limit)).all()

@compra_router.get("/{idcompra}", response_model=CompraPublic)
def read_compra(idcompra: int, session: session_dep):
    compra = session.get(Compra, idcompra)
    if not compra:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    return compra

@compra_router.patch("/{idcompra}", response_model=CompraPublic)
def update_compra(idcompra: int, compra: CompraUpdate, session: session_dep):
    compra_db = session.get(Compra, idcompra)
    if not compra_db:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    compra_data = compra.model_dump()
    compra_db.sqlmodel_update(compra_data)
    session.add(compra_db)
    session.commit()
    session.refresh(compra_db)
    return compra_db

@compra_router.delete("/{idcompra}")
def delete_compra(idcompra: int, session: session_dep):
    compra = session.get(Compra, idcompra)
    if not compra:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    session.delete(compra)
    session.commit()
    return {"ok": True}


@compra_router.get("/cedula/{cedula}", response_model=list[CompraPublic])
def read_compras_by_cedula(
    cedula: int, 
    session: session_dep, 
    offset: int = 0, 
    limit: Annotated[int, Query(le=100)] = 100
):
    compras = session.exec(
        select(Compra).where(Compra.cedula == cedula).offset(offset).limit(limit)
    ).all()

    if not compras:
        raise HTTPException(status_code=404, detail="No se encontraron compras para esta cédula")

    return compras

