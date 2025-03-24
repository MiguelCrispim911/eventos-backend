from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class TipoBoletaBase(SQLModel):
    nombre: str = Field(index=True)
    localizacion: str
    precio: int
    cupo_maximo: int
    disponibles: int
    id_funcion: int = Field(foreign_key="funcion.id_funcion")
    
class TipoBoleta(TipoBoletaBase, table=True):
    id_tipoboleta: Optional[int] = Field(default=None, primary_key=True)

class TipoBoletaPublic(TipoBoletaBase):
    id_tipoboleta: int

class TipoBoletaCreate(TipoBoletaBase):
    pass

class TipoBoletaUpdate(SQLModel):
    nombre: str
    localizacion: str
    precio: int
    cupo_maximo: int
    disponibles: int
    id_funcion: int