from sqlmodel import SQLModel, Field
from typing import List
from appback.models.municipio import MunicipioPublic

class DepartamentoBase(SQLModel):
    nombre: str

class Departamento(SQLModel, table=True):
    
    id: int = Field(primary_key=True)
    nombre: str

class DepartamentoPublic(DepartamentoBase):
    id: int

class DepartamentoWithMunicipios(DepartamentoPublic):
    municipios: List[MunicipioPublic] = []