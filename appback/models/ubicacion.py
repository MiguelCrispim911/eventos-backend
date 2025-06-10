from sqlmodel import SQLModel, Field
from typing import Optional, List
from appback.models.municipio import MunicipioPublic

class UbicacionBase(SQLModel):
    nombre: str 
    persona_contacto: str 
    telefono: str 
    direccion: str 
    id_municipio: int = Field(foreign_key="municipio.id")  # Cambiado a clave foránea
    email: str 
    estado: int 

class Ubicacion(SQLModel, table=True):
    id_ubicacion: Optional[int] = Field(primary_key=True, default=None)
    nombre: str 
    persona_contacto: str 
    telefono: str 
    direccion: str 
    id_municipio: int = Field(foreign_key="municipio.id")  # Clave foránea
    email: str 
    estado: int    

class UbicacionPublic(UbicacionBase):
    id_ubicacion: int

# Nuevo modelo para respuestas con relaciones
class UbicacionWithRelations(UbicacionPublic):
    nombre_municipio: Optional[str] = None
    nombre_departamento: Optional[str] = None

class UbicacionCreate(UbicacionBase):
    pass

class UbicacionUpdate(SQLModel):
    nombre: Optional[str] = None
    persona_contacto: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    id_municipio: Optional[int] = None
    email: Optional[str] = None
    estado: Optional[int] = None