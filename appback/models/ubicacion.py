from sqlmodel import SQLModel, Field

class UbicacionBase(SQLModel):
    nombre: str = Field(index=True)
    persona_contacto: str = Field()
    telefono: str = Field()
    direccion: str = Field()
    municipio: str = Field()
    departamento: str = Field()
    email: str = Field(index=True)
    estado: int = Field()

class Ubicacion(UbicacionBase, table=True):
    id_ubicacion: int = Field(primary_key=True, default=None)

class UbicacionPublic(UbicacionBase):
    id_ubicacion: int

class UbicacionCreate(UbicacionBase):
    pass

class UbicacionUpdate(UbicacionBase):
    nombre: str
    persona_contacto: str
    telefono: str
    direccion: str
    municipio: str
    departamento: str
    email: str
    estado: int