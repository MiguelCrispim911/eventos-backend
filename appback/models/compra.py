from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class CompraBase(SQLModel):
    fecha: str  # DATE
    cantidad: int
    forma_pago: str
    cedula: int
    id_tipoboleta: int 
    estado: int

class Compra(SQLModel, table=True):
    idcompra: Optional[int] = Field(default=None, primary_key=True)
    fecha: str  # DATE
    cantidad: int
    forma_pago: str
    cedula: int = Field(foreign_key="cliente.cedula")
    id_tipoboleta: int = Field(foreign_key="tipoboleta.id_tipoboleta")
    estado: int    

class CompraPublic(CompraBase):
    idcompra: int

class CompraCreate(CompraBase):
    pass

class CompraUpdate(CompraBase):
    pass
