from sqlmodel import SQLModel, Field

class AdministradorBase(SQLModel):
    cedula_adm: int = Field(primary_key=True)  # Clave primaria
    nombres: str = Field(index=True)  
    apellidos: str = Field(index=True)  
    direccion: str = Field()  
    departamento: str = Field()  
    email: str = Field(index=True)  
    telefono: str = Field()  
    contrasena: str = Field()  
    estado: int = Field()  

class Administrador(AdministradorBase, table=True):
    pass

class AdministradorPublic(AdministradorBase):
    pass

class AdministradorCreate(AdministradorBase):
    pass

class AdministradorUpdate(AdministradorBase):
    nombres: str
    apellidos: str
    direccion: str
    departamento: str
    email: str
    telefono: str
    contrasena: str
    estado: int