from sqlmodel import SQLModel, Field

class EventoBase(SQLModel):
    id_evento: int = Field(default=None, primary_key=True)  # Clave primaria autoincremental
    nombre: str = Field(index=True)  
    descripcion: str = Field()  
    foto_principal: str = Field()  
    foto_secundaria: str = Field()  
    cedula_adm: int = Field(index=True)  # Clave foránea de Administrador  
    estado: int = Field()  

class Evento(EventoBase, table=True):
    pass

class EventoPublic(EventoBase):
    pass

class EventoCreate(EventoBase):
    pass

class EventoUpdate(SQLModel):  # Solo incluye los campos que pueden actualizarse
    nombre: str
    descripcion: str
    foto_principal: str
    foto_secundaria: str
    cedula_adm: int
    estado: int