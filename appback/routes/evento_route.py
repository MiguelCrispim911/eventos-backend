from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import select, Session
from appback.models.evento import Evento, EventoCreate, EventoPublic, EventoUpdate
from appback.database import get_session
from typing import Annotated

evento_router = APIRouter()

session_dep = Annotated[Session, Depends(get_session)]

@evento_router.post("/", response_model=EventoPublic)
def create_evento(evento: EventoCreate, session: session_dep):
    db_evento = Evento.model_validate(evento)
    session.add(db_evento)
    session.commit()
    session.refresh(db_evento)
    return db_evento

@evento_router.get("/", response_model=list[EventoPublic])
def read_eventos(session: session_dep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100):
    return session.exec(select(Evento).offset(offset).limit(limit)).all()

@evento_router.get("/{id_evento}", response_model=EventoPublic)
def read_evento(id_evento: int, session: session_dep):
    evento = session.get(Evento, id_evento)
    if not evento:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return evento

@evento_router.patch("/{id_evento}", response_model=EventoPublic)
def update_evento(id_evento: int, evento: EventoUpdate, session: session_dep):
    evento_db = session.get(Evento, id_evento)
    if not evento_db:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    evento_data = evento.model_dump()
    evento_db.sqlmodel_update(evento_data)
    session.add(evento_db)
    session.commit()
    session.refresh(evento_db)
    return evento_db

@evento_router.delete("/{id_evento}")
def delete_evento(id_evento: int, session: session_dep):
    evento = session.get(Evento, id_evento)
    if not evento:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    session.delete(evento)
    session.commit()
    return {"ok": True}