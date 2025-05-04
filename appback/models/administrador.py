from sqlmodel import SQLModel, Field

class AdministradorBase(SQLModel):
    nombres: str  
    apellidos: str 
    direccion: str
    municipio: str
    departamento: str  
    email: str
    telefono: str
    contrasena: str
    estado: int


class Administrador(SQLModel, table=True):
    cedula_adm: int = Field(primary_key=True, nullable=False, sa_column_kwargs={"autoincrement": False})
    nombres: str  
    apellidos: str 
    direccion: str
    municipio: str
    departamento: str  
    email: str
    telefono: str
    contrasena: str
    estado: int  

class AdministradorPublic(AdministradorBase):
    cedula_adm: int

class AdministradorCreate(AdministradorBase):
    cedula_adm: int

class AdministradorUpdate(AdministradorBase):  
    pass

class AdministradorLogin(SQLModel):
    cedula_adm: int
    contrasena: str

