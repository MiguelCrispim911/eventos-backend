from sqlmodel import SQLModel, Field
from typing import Optional


# Modelo de Evento
class EventoBase(SQLModel):  
    nombre: str  
    descripcion: str 
    foto_principal: str  
    foto_secundaria: str  
    cedula_adm: int   
    estado: int 

# Modelo de Evento tabla
class Evento(SQLModel, table=True):  
    id_evento: Optional[int] = Field(primary_key=True, default=None) 
    nombre: str  
    descripcion: str 
    foto_principal: str  
    foto_secundaria: str  
    cedula_adm: int = Field(foreign_key="administrador.cedula_adm")   
    estado: int  

# Modelo de Evento público
class EventoPublic(EventoBase): 
    id_evento: int

# Modelos de creación de Evento
class EventoCreate(EventoBase):  
    pass

# Modelos de actualización de Evento
class EventoUpdate(EventoBase):  
    pass