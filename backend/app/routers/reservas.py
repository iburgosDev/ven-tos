from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Reserva, Servicio
from app.schemas import ReservaCrear, ReservaRespuesta
from app.auth import get_usuario_actual, requiere_rol

router = APIRouter(prefix="/reservas", tags=["Reservas"])

@router.post("/", response_model=ReservaRespuesta, status_code=201)
def crear_reserva(
    datos: ReservaCrear,
    db: Session = Depends(get_db),
    usuario = Depends(requiere_rol("cliente"))
):
    servicio = db.query(Servicio).filter(
        Servicio.id == datos.servicio_id,
        Servicio.activo == True
    ).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")

    conflicto = db.query(Reserva).filter(
        Reserva.servicio_id == datos.servicio_id,
        Reserva.fecha_hora == datos.fecha_hora,
        Reserva.estado != "cancelada"
    ).first()
    if conflicto:
        raise HTTPException(status_code=400, detail="Ese horario ya está reservado")

    reserva = Reserva(
        fecha_hora=datos.fecha_hora,
        servicio_id=datos.servicio_id,
        cliente_id=usuario.id
    )
    db.add(reserva)
    db.commit()
    db.refresh(reserva)
    return reserva

@router.get("/mis-reservas", response_model=List[ReservaRespuesta])
def mis_reservas(
    db: Session = Depends(get_db),
    usuario = Depends(requiere_rol("cliente"))
):
    return db.query(Reserva).filter(Reserva.cliente_id == usuario.id).all()

@router.get("/agenda", response_model=List[ReservaRespuesta])
def agenda_talento(
    db: Session = Depends(get_db),
    usuario = Depends(requiere_rol("talento"))
):
    return db.query(Reserva).join(Servicio).filter(
        Servicio.talento_id == usuario.id
    ).all()

@router.patch("/{id}/cancelar", response_model=ReservaRespuesta)
def cancelar_reserva(
    id: int,
    db: Session = Depends(get_db),
    usuario = Depends(get_usuario_actual)
):
    reserva = db.query(Reserva).filter(Reserva.id == id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")

    if reserva.cliente_id != usuario.id and usuario.rol != "talento":
        raise HTTPException(status_code=403, detail="No tienes permiso para cancelar esta reserva")

    if reserva.estado == "cancelada":
        raise HTTPException(status_code=400, detail="La reserva ya está cancelada")

    reserva.estado = "cancelada"
    db.commit()
    db.refresh(reserva)
    return reserva