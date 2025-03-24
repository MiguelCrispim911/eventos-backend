from sqlmodel import SQLModel, Field

class ClienteBase(SQLModel):
    cedula: int = Field(primary_key=True)
    nombres: str = Field(index=True)
    apellidos: str = Field(index=True)
    direccion: str = Field()
    departamento: str = Field()
    municipio: str = Field()
    email: str = Field(index=True)
    telefono: str = Field()
    contrasena: str = Field()
    estado: int = Field()

class Cliente(ClienteBase, table=True):
    pass

class ClientePublic(ClienteBase):
    pass

class ClienteCreate(ClienteBase):
    pass

class ClienteUpdate(ClienteBase):
    nombres: str
    apellidos: str
    direccion: str
    departamento: str
    municipio: str
    email: str
    telefono: str
    contrasena: str
    estado: int
