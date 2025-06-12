from sqlmodel import SQLModel, Field
from typing import Optional

class AdministradorBase(SQLModel):
    nombres: str  
    apellidos: str 
    direccion: str
    id_municipio: int = Field(foreign_key="municipio.id")  # Cambiado a clave foránea
    email: str
    telefono: str
    contrasena: str
    estado: int

class Administrador(SQLModel, table=True):
    cedula_adm: int = Field(primary_key=True, nullable=False, 
                          sa_column_kwargs={"autoincrement": False})
    nombres: str  
    apellidos: str 
    direccion: str
    id_municipio: int = Field(foreign_key="municipio.id")  # Clave foránea
    email: str
    telefono: str
    contrasena: str
    estado: int  

class AdministradorPublic(AdministradorBase):
    cedula_adm: int

# Nuevo modelo para respuestas que incluyan datos relacionados
class AdministradorWithRelations(AdministradorPublic):
    nombre_municipio: Optional[str] = None
    nombre_departamento: Optional[str] = None

class AdministradorCreate(AdministradorBase):
    cedula_adm: int

class AdministradorUpdate(SQLModel):
    nombres: Optional[str] = None
    apellidos: Optional[str] = None
    direccion: Optional[str] = None
    id_municipio: Optional[int] = None  # Ahora recibe el ID
    email: Optional[str] = None
    telefono: Optional[str] = None
    contrasena: Optional[str] = None
    estado: Optional[int] = None

class AdministradorLogin(SQLModel):
    cedula_adm: int
    contrasena: str