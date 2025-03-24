from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class CompraBase(SQLModel):
    fecha: str  # DATE
    cantidad: int
    forma_pago: str
    cedula: int = Field(foreign_key="cliente.cedula")
    id_tipoboleta: int = Field(foreign_key="tipo_boleta.id_tipoboleta")
    estado: int

class Compra(CompraBase, table=True):
    idcompra: Optional[int] = Field(default=None, primary_key=True)

class CompraPublic(CompraBase):
    idcompra: int

class CompraCreate(CompraBase):
    pass

class CompraUpdate(SQLModel):
    fecha: str  # DATE
    cantidad: int
    forma_pago: str
    cedula: int
    id_tipoboleta: int
    estado: int
