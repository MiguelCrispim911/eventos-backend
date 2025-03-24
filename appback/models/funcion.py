from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class FuncionBase(SQLModel):
    nombre: str = Field(index=True)
    descripcion: str
    fecha: str  # Usar formato de fecha YYYY-MM-DD
    hora_inicio: str  # Usar formato de hora HH:MM:SS
    id_evento: int = Field(foreign_key="evento.id_evento")
    id_ubicacion: int = Field(foreign_key="ubicacion.id_ubicacion")
    estado: int

class Funcion(FuncionBase, table=True):
    id_funcion: Optional[int] = Field(default=None, primary_key=True)

class FuncionPublic(FuncionBase):
    id_funcion: int

class FuncionCreate(FuncionBase):
    pass

class FuncionUpdate(FuncionBase):
    pass