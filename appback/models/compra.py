from sqlmodel import SQLModel, Field, Relationship
from typing import Optional


# Modelo de Compra
class CompraBase(SQLModel):
    fecha: str  # DATE
    hora: str   # TIME - Nuevo campo
    cantidad: int
    forma_pago: str
    cedula: int
    id_tipoboleta: int 
    id_funcion: int
    estado: int

# Modelo de Compra tabla
class Compra(SQLModel, table=True):
    idcompra: Optional[int] = Field(default=None, primary_key=True)
    fecha: str  # DATE
    hora: str   # TIME - Nuevo campo
    cantidad: int
    forma_pago: str
    cedula: int = Field(foreign_key="cliente.cedula")
    id_tipoboleta: int = Field(foreign_key="tipoboleta.id_tipoboleta")
    id_funcion: int = Field(foreign_key="funcion.id_funcion")
    estado: int    

class CompraPublic(CompraBase):
    idcompra: int

class CompraCreate(CompraBase):
    pass

class CompraUpdate(CompraBase):
    pass
