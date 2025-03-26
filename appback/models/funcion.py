from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class FuncionBase(SQLModel):
    nombre: str 
    descripcion: str
    fecha: str  # Usar formato de fecha YYYY-MM-DD
    hora_inicio: str  # Usar formato de hora HH:MM:SS
    id_evento: int 
    id_ubicacion: int
    estado: int

class Funcion(SQLModel, table=True):
    id_funcion: Optional[int] = Field(primary_key=True, default=None)
    nombre: str
    descripcion: str
    fecha: str  # Usar formato de fecha YYYY-MM-DD
    hora_inicio: str  # Usar formato de hora HH:MM:SS
    id_evento: int = Field(foreign_key="evento.id_evento")
    id_ubicacion: int = Field(foreign_key="ubicacion.id_ubicacion")
    estado: int

class FuncionPublic(FuncionBase):
    id_funcion: int

class FuncionCreate(FuncionBase):
    pass

class FuncionUpdate(FuncionBase):
    pass
