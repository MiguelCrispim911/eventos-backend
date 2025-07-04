from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from passlib.context import CryptContext
# Configuración de seguridad para JWT y contraseñas
SECRET_KEY = "tu_clave_secreta_aleatoria_compleja" #En produccion debe ser cambiada por una màs segura
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 # Tiempo de expiración del token en minutos

# Funciones para crear y verificar tokens JWT
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
def verify_token(token: str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        cedula: int = payload.get("sub")
        if cedula is None:
            raise credentials_exception
        return cedula
    except JWTError:
        raise credentials_exception
    
# Funciones para el manejo de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hashing y verificación de contraseñas
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Verificación de contraseñas
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
