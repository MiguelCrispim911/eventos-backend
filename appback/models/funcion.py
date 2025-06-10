from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

# Modelo de Funcion
class FuncionBase(SQLModel):
    nombre: str 
    descripcion: str
    fecha: str  # Usar formato de fecha YYYY-MM-DD
    hora_inicio: str  # Usar formato de hora HH:MM:SS
    id_evento: int 
    id_ubicacion: int
    estado: int

# Modelo de Funcion tabla
class Funcion(SQLModel, table=True):
    id_funcion: Optional[int] = Field(primary_key=True, default=None)
    nombre: str
    descripcion: str
    fecha: str  # Usar formato de fecha YYYY-MM-DD
    hora_inicio: str  # Usar formato de hora HH:MM:SS
    id_evento: int = Field(foreign_key="evento.id_evento")
    id_ubicacion: int = Field(foreign_key="ubicacion.id_ubicacion")
    estado: int

# Modelo de Funcion público
class FuncionPublic(FuncionBase):
    id_funcion: int

# Modelos de creación de Funcion
class FuncionCreate(FuncionBase):
    pass

# Modelos de actualización de Funcion
class FuncionUpdate(FuncionBase):
    pass
