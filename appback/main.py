from fastapi import FastAPI
from appback.database import create_db_and_tables
from appback.routes.administrador_route import administrador_router
#from appback.routes.cliente_route import cliente_router 
#from appback.routes.compra_route import compra_router 
#from appback.routes.evento_route import evento_router 
#from appback.routes.funcion_route import funcion_router 
#from appback.routes.tipo_boleta_route import tipo_boleta_router
#from appback.routes.ubicacion_route import ubicacion_router 

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(administrador_router, prefix="/administradores", tags=["Administradores"])
#app.include_router(cliente_router, prefix="/clientes", tags=["Clientes"])
#app.include_router(compra_router, prefix="/compras", tags=["Compras"])
#app.include_router(evento_router, prefix="/eventos", tags=["Eventos"])
#app.include_router(funcion_router , prefix="/funciones", tags=["Funciones"])
#app.include_router(tipo_boleta_router, prefix="/tiposboletas", tags=["TiposBoletas"])
#app.include_router(ubicacion_router, prefix="/ubicaciones", tags=["Ubicaciones"])

@app.get("/")
def root():
    return {"message": "Hello World"}