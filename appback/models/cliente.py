from sqlmodel import SQLModel, Field

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
    estado: int
# Modelo para la representación pública del cliente
class ClientePublic(ClienteBase):
    cedula: int

# Modelo para crear un nuevo cliente
class ClienteCreate(ClienteBase):
    cedula: int
# Modelo para actualizar un cliente existente
class ClienteUpdate(ClienteBase):
    pass
# Modelo para el inicio de sesión del cliente
class LoginData(SQLModel):
    cedula: int
    contrasena: str