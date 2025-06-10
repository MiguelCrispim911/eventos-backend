from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import select, Session
from appback.models.cliente import Cliente, ClienteCreate, ClientePublic, ClienteUpdate, LoginData
from appback.database import get_session
from typing import Annotated
from appback.core.security import create_access_token, hash_password, verify_password
from fastapi import status
from pydantic import BaseModel

# Modelo para la verificación de contraseña
class PasswordVerifyRequest(BaseModel):
    cedula: int
    password: str

# appback/routes/cliente_route.py
# Este archivo define las rutas para manejar las operaciones CRUD de los clientes.
cliente_router = APIRouter()

# Dependencia para obtener la sesión de la base de datos
session_dep = Annotated[Session, Depends(get_session)]

# Rutas para manejar los clientes
@cliente_router.post("/", response_model=ClientePublic)
def create_cliente(cliente: ClienteCreate, session: session_dep):
    # Verificar si el cliente ya existe
    existing_cliente = session.get(Cliente, cliente.cedula)
    if existing_cliente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cliente ya existe"
        )
    
    user_dict = cliente.model_dump()
    user_dict["contrasena"] = hash_password(user_dict["contrasena"])
    db_cliente = Cliente(**user_dict) 
    session.add(db_cliente)
    session.commit()
    session.refresh(db_cliente)
    return db_cliente

# Obtener todos los clientes con paginación
@cliente_router.get("/", response_model=list[ClientePublic])
def read_clientes(session: session_dep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100):
    return session.exec(select(Cliente).offset(offset).limit(limit)).all()

# Obtener un cliente por su cédula
@cliente_router.get("/{cedula}", response_model=ClientePublic)
def read_cliente(cedula: int, session: session_dep):
    cliente = session.get(Cliente, cedula)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente

# Actualizar un cliente por su cédula
@cliente_router.patch("/{cedula}", response_model=ClientePublic)
def update_cliente(cedula: int, cliente: ClienteUpdate, session: session_dep):
    cliente_db = session.get(Cliente, cedula)
    if not cliente_db:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    # Si se actualiza la contraseña, hashearla
    if cliente.contrasena:
        cliente.contrasena = hash_password(cliente.contrasena)
    
    cliente_data = cliente.model_dump(exclude_unset=True)
    cliente_db.sqlmodel_update(cliente_data)
    session.add(cliente_db)
    session.commit()
    session.refresh(cliente_db)
    return cliente_db

# Eliminar un cliente por su cédula
@cliente_router.delete("/{cedula}")
def delete_cliente(cedula: int, session: session_dep):
    cliente = session.get(Cliente, cedula)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    session.delete(cliente)
    session.commit()
    return {"ok": True}

# Ruta para el login del cliente
@cliente_router.post("/login")
def login(user: LoginData, session: session_dep):
    try:
        db_cliente = session.get(Cliente, user.cedula)  

        if not db_cliente:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )

        # Verificación mejorada de contraseña
        if not verify_password(user.contrasena, db_cliente.contrasena):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )

        access_token = create_access_token(data={
            "tipo_usuario": "cliente",
            "id_usuario": str(db_cliente.cedula),
            "nombre_usuario": str(db_cliente.nombres),
            "apellido_usuario": str(db_cliente.apellidos),
            "direccion_usuario": str(db_cliente.direccion),
            "departamento_usuario": str(db_cliente.departamento),
            "municipio_usuario": str(db_cliente.municipio),
            "email_usuario": str(db_cliente.email),
            "telefono_usuario": str(db_cliente.telefono)
        })

        return {
            "access_token": access_token, 
            "token_type": "bearer",
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno: {str(e)}"
        )

# Endpoint para verificar la contraseña de un cliente
@cliente_router.post("/verify-password")
def verify_client_password(request: PasswordVerifyRequest, session: session_dep):
    cliente = session.get(Cliente, request.cedula)
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    
    # Verificar si la contraseña es correcta
    if not verify_password(request.password, cliente.contrasena):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña incorrecta"
        )
    
    # Si la contraseña es correcta, devolver éxito
    return {"verified": True}
