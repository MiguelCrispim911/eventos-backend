from sqlmodel import SQLModel, Field
from typing import Optional


# Base de datos para el administrador
class ClienteBase(SQLModel):
    nombres: str
    apellidos: str
    direccion: str
    departamento: str
    municipio: str
    email: str
    telefono: str
    contrasena: str
    preguntaSeguridad: str
    respuestaSeguridad: str
    estado: int

# Modelo de Cliente Tabla
class Cliente(SQLModel, table=True):
    cedula: int = Field(primary_key=True, nullable=False, sa_column_kwargs={"autoincrement": False})
    nombres: str
    apellidos: str
    direccion: str
    departamento: str
    municipio: str
    email: str
    telefono: str
    contrasena: str
    preguntaSeguridad: str
    respuestaSeguridad: str
    estado: int

# Modelo para la representación pública del cliente
class ClientePublic(ClienteBase):
    cedula: int

# Modelo para crear un nuevo cliente
class ClienteCreate(ClienteBase):
    cedula: int

# Modelo para actualizar un cliente existente
class ClienteUpdate(SQLModel):
    nombres: Optional[str] = None
    apellidos: Optional[str] = None
    direccion: Optional[str] = None
    departamento: Optional[str] = None
    municipio: Optional[str] = None
    email: Optional[str] = None  
    telefono: Optional[str] = None
    contrasena: Optional[str] = None
    preguntaSeguridad: Optional[str] = None
    respuestaSeguridad: Optional[str] = None
    estado: Optional[int] = None

# Modelo para el inicio de sesión del cliente
class LoginData(SQLModel):
    cedula: int
    contrasena: str
