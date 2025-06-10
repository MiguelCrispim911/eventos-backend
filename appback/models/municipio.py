from sqlmodel import SQLModel, Field
from typing import Optional

# Modelo base para Municipio
class MunicipioBase(SQLModel):
    nombre: str
    id_departamento: int = Field(foreign_key="departamento.id")

# Modelo de tabla Municipio
class Municipio(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, default=None, alias="id_municipio")
    nombre: str
    id_departamento: int = Field(foreign_key="departamento.id")

# Modelo público para respuesta
class MunicipioPublic(MunicipioBase):
    id: int = Field(alias="id_municipio")