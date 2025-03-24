# Permite realizar conexion a base de datos, está exactamente igual al del profe en el codigo!!!!

from sqlmodel import SQLModel, Session, create_engine

# Configuración de la base de datos
db_username = "root"
db_password = "root"
db_host = "localhost"
db_name = "bdeventointermedio"
url_connection = f"mysql+pymysql://{db_username}:{db_password}@{db_host}:3306/{db_name}"

engine = create_engine(url_connection)

# Crear tablas
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Obtener sesión
def get_session():
    with Session(engine) as session:
        yield session