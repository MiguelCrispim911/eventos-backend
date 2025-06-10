from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

# Modelo de Funcion
class TipoBoletaBase(SQLModel):
    nombre: str
    localizacion: str
    precio: int
    descripcion: str
    cupo_maximo: int
    disponibles: int
    id_funcion: int
    estado:int

# Modelo de TipoBoleta tabla
class TipoBoleta(SQLModel, table=True):
    id_tipoboleta: Optional[int] = Field(primary_key=True, default=None)
    nombre: str
    localizacion: str
    precio: int
    descripcion: str
    cupo_maximo: int
    disponibles: int
    id_funcion: int = Field(foreign_key="funcion.id_funcion")
    estado:int

# Modelo de TipoBoleta público
class TipoBoletaPublic(TipoBoletaBase):
    id_tipoboleta: int

# Modelos de creación de TipoBoleta
class TipoBoletaCreate(TipoBoletaBase):
    pass

# Modelos de actualización de TipoBoleta
class TipoBoletaUpdate(TipoBoletaBase):
    pass