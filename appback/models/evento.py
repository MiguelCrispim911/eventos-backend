from sqlmodel import SQLModel, Field
from typing import Optional
class EventoBase(SQLModel):  
    nombre: str  
    descripcion: str 
    foto_principal: str  
    foto_secundaria: str  
    cedula_adm: int   
    estado: int 

class Evento(SQLModel, table=True):  
    id_evento: Optional[int] = Field(primary_key=True, default=None) 
    nombre: str  
    descripcion: str 
    foto_principal: str  
    foto_secundaria: str  
    cedula_adm: int = Field(foreign_key="administrador.cedula_adm")   
    estado: int  

class EventoPublic(EventoBase): 
    id_evento: int
class EventoCreate(EventoBase):  
    pass

class EventoUpdate(EventoBase):  
    pass