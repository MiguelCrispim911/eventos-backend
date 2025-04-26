# Permite realizar conexion a base de datos, está exactamente igual al del profe en el codigo!!!!

from sqlmodel import SQLModel, Session, create_engine
from sqlalchemy import MetaData


# Configuración de la base de datos
db_username = "root"
db_password = "admin"
db_host = "localhost"
db_name = "bdeventointermedio"
url_connection = f"mysql+pymysql://{db_username}:{db_password}@{db_host}:3306/{db_name}"

engine = create_engine(url_connection)

def create_db_and_tables():
    from appback.models.ubicacion import Ubicacion
    from appback.models.cliente import Cliente
    from appback.models.administrador import Administrador
    from appback.models.evento import Evento 
    from appback.models.funcion import Funcion
    from appback.models.tipo_boleta import TipoBoleta
    from appback.models.compra import  Compra
    
    metadata = MetaData()
    

    tables = [
        Ubicacion.__table__,
        Cliente.__table__,
        Administrador.__table__,
        Evento.__table__,
        Funcion.__table__,
        TipoBoleta.__table__,
        Compra.__table__
    ]
    
    # Crear solo estas tablas en este orden
    metadata.create_all(engine, tables=tables)

# Obtener sesión
def get_session():
    with Session(engine) as session:
        yield session