from sqlmodel import SQLModel, Field

class UbicacionBase(SQLModel):
    nombre: str 
    persona_contacto: str 
    telefono: str 
    direccion: str 
    municipio: str
    departamento: str
    email: str 
    estado: int 



class Ubicacion(SQLModel, table=True):
    id_ubicacion: int = Field(primary_key=True, default=None)
    nombre: str 
    persona_contacto: str 
    telefono: str 
    direccion: str 
    municipio: str
    departamento: str
    email: str 
    estado: int     

class UbicacionPublic(UbicacionBase):
    id_ubicacion: int

class UbicacionCreate(UbicacionBase):
    pass

class UbicacionUpdate(UbicacionBase):
    pass