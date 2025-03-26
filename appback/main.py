from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from appback.database import create_db_and_tables
from appback.routes.administrador_route import administrador_router
from appback.routes.cliente_route import cliente_router
from appback.routes.ubicacion_route import ubicacion_router
from appback.routes.evento_route import evento_router
from appback.routes.funcion_route import funcion_router
from appback.routes.tipo_boleta_route import tipo_boleta_router
from appback.routes.compra_route import compra_router
import os

app = FastAPI()

# Configurar CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500/"],  # URL del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear base de datos en el inicio
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Incluir rutas de la aplicación
app.include_router(administrador_router, prefix="/administradores", tags=["Administradores"])
app.include_router(cliente_router, prefix="/clientes", tags=["Clientes"])
app.include_router(ubicacion_router, prefix="/ubicaciones", tags=["Ubicaciones"])
app.include_router(evento_router, prefix="/eventos", tags=["Eventos"])
app.include_router(funcion_router, prefix="/funciones", tags=["Funciones"])
app.include_router(tipo_boleta_router, prefix="/tiposboletas", tags=["TiposBoletas"])
app.include_router(compra_router, prefix="/compras", tags=["Compras"])

# Definir rutas estáticas para servir archivos del frontend
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "..", "frontend")
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

@app.get("/")
def serve_index():
    return FileResponse(os.path.join("frontend", "index.html"))

# ------------------------ LOGIN ------------------------
# Base de datos simulada de usuarios (esto debe reemplazarse con una consulta real a la DB)
usuarios_db = [
    {"cedula": "12345678", "contraseña": "1234"}
]

class LoginData(BaseModel):
    cedula: str
    contraseña: str

@app.post("/login")
def login(user: LoginData):
    for usuario in usuarios_db:
        if usuario["cedula"] == user.cedula and usuario["contraseña"] == user.contraseña:
            return {"message": "Login exitoso", "user": user.cedula}
    raise HTTPException(status_code=401, detail="Credenciales incorrectas")