from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id          = Column(Integer, primary_key=True, index=True)
    nombre      = Column(String, nullable=False)
    email       = Column(String, unique=True, index=True, nullable=False)
    password    = Column(String, nullable=False)
    rol         = Column(String, default="cliente")
    activo      = Column(Boolean, default=True)
    creado_en   = Column(DateTime, default=datetime.utcnow)

    servicios   = relationship("Servicio", back_populates="talento")
    reservas    = relationship("Reserva", back_populates="cliente")


class Servicio(Base):
    __tablename__ = "servicios"

    id              = Column(Integer, primary_key=True, index=True)
    titulo          = Column(String, nullable=False)
    descripcion     = Column(String)
    duracion_min    = Column(Integer, nullable=False)
    precio          = Column(Float, nullable=False)
    activo          = Column(Boolean, default=True)
    talento_id      = Column(Integer, ForeignKey("usuarios.id"))
    creado_en       = Column(DateTime, default=datetime.utcnow)

    talento         = relationship("Usuario", back_populates="servicios")
    reservas        = relationship("Reserva", back_populates="servicio")


class Reserva(Base):
    __tablename__ = "reservas"

    id              = Column(Integer, primary_key=True, index=True)
    fecha_hora      = Column(DateTime, nullable=False)
    estado          = Column(String, default="pendiente")
    cliente_id      = Column(Integer, ForeignKey("usuarios.id"))
    servicio_id     = Column(Integer, ForeignKey("servicios.id"))
    creado_en       = Column(DateTime, default=datetime.utcnow)

    cliente         = relationship("Usuario", back_populates="reservas")
    servicio        = relationship("Servicio", back_populates="reservas")