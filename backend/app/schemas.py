from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UsuarioRegistro(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    rol: Optional[str] = "cliente"

class UsuarioLogin(BaseModel):
    email: EmailStr
    password: str

class UsuarioRespuesta(BaseModel):
    id: int
    nombre: str
    email: str
    rol: str
    activo: bool
    creado_en: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    usuario: UsuarioRespuesta

class ServicioCrear(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    duracion_min: int
    precio: float

class ServicioRespuesta(BaseModel):
    id: int
    titulo: str
    descripcion: Optional[str] = None
    duracion_min: int
    precio: float
    activo: bool
    talento_id: int
    creado_en: datetime

    class Config:
        from_attributes = True

class ReservaCrear(BaseModel):
    servicio_id: int
    fecha_hora: datetime

class ReservaRespuesta(BaseModel):
    id: int
    fecha_hora: datetime
    estado: str
    cliente_id: int
    servicio_id: int
    creado_en: datetime

    class Config:
        from_attributes = True