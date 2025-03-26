from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from appback.database import create_db_and_tables
from appback.routes.administrador_route import administrador_router
from appback.routes.cliente_route import cliente_router 
from appback.routes.ubicacion_route import ubicacion_router 
from appback.routes.evento_route import evento_router 
from appback.routes.funcion_route import funcion_router 
from appback.routes.tipo_boleta_route import tipo_boleta_router
from appback.routes.compra_route import compra_router 
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Configurar CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500/"],  # URL del front end http://127.0.0.1:5500/
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(administrador_router, prefix="/administradores", tags=["Administradores"])
app.include_router(cliente_router, prefix="/clientes", tags=["Clientes"])
app.include_router(ubicacion_router, prefix="/ubicaciones", tags=["Ubicaciones"])
app.include_router(evento_router, prefix="/eventos", tags=["Eventos"])
app.include_router(funcion_router , prefix="/funciones", tags=["Funciones"])
app.include_router(tipo_boleta_router, prefix="/tiposboletas", tags=["TiposBoletas"])
app.include_router(compra_router, prefix="/compras", tags=["Compras"])


BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Obtiene la ruta absoluta
FRONTEND_DIR = os.path.join(BASE_DIR, "..", "frontend")  # Ruta absoluta a "frontend"

app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

# Ruta para servir index.html directamente en "/"
@app.get("/")
def serve_index():
    return FileResponse(os.path.join("frontend", "index.html"))