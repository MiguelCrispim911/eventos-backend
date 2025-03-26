from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class TipoBoletaBase(SQLModel):
    nombre: str
    localizacion: str
    precio: int
    cupo_maximo: int
    disponibles: int
    id_funcion: int
    
class TipoBoleta(SQLModel, table=True):
    id_tipoboleta: Optional[int] = Field(primary_key=True, default=None)
    nombre: str
    localizacion: str
    precio: int
    cupo_maximo: int
    disponibles: int
    id_funcion: int = Field(foreign_key="funcion.id_funcion")

class TipoBoletaPublic(TipoBoletaBase):
    id_tipoboleta: int

class TipoBoletaCreate(TipoBoletaBase):
    pass

class TipoBoletaUpdate(TipoBoletaBase):
    pass