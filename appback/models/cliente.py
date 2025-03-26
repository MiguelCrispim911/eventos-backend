from sqlmodel import SQLModel, Field

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

class ClientePublic(ClienteBase):
    cedula: int

class ClienteCreate(ClienteBase):
    cedula: int

class ClienteUpdate(ClienteBase):
    pass