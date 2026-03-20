from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Reserva, Servicio
from app.schemas import ReservaCrear, ReservaRespuesta
from app.auth import get_usuario_actual, requiere_rol
from app.cache import cache_delete

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


def _serializar_reserva(r: Reserva) -> dict:
    """Serializa una reserva con datos enriquecidos (nombre servicio y cliente)."""
    return {
        "id": r.id,
        "fecha_hora": r.fecha_hora,
        "estado": r.estado,
        "cliente_id": r.cliente_id,
        "servicio_id": r.servicio_id,
        "creado_en": r.creado_en,
        # Campos enriquecidos
        "servicio_titulo": r.servicio.titulo if r.servicio else None,
        "cliente_nombre": r.cliente.nombre if r.cliente else None,
    }


@router.get("/mis-reservas")   # ← sin response_model para devolver datos enriquecidos
def mis_reservas(
    db: Session = Depends(get_db),
    usuario = Depends(requiere_rol("cliente"))
):
    reservas = db.query(Reserva).filter(Reserva.cliente_id == usuario.id).all()
    return [_serializar_reserva(r) for r in reservas]


@router.get("/agenda")         # ← sin response_model para devolver datos enriquecidos
def agenda_talento(
    db: Session = Depends(get_db),
    usuario = Depends(requiere_rol("talento"))
):
    reservas = db.query(Reserva).join(Servicio).filter(
        Servicio.talento_id == usuario.id
    ).all()
    return [_serializar_reserva(r) for r in reservas]


@router.patch("/{id}/cancelar", response_model=ReservaRespuesta)
async def cancelar_reserva(
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
    await cache_delete(f"metricas:dashboard:{reserva.servicio.talento_id}")
    return reserva


@router.patch("/{id}/confirmar", response_model=ReservaRespuesta)
async def confirmar_reserva(
    id: int,
    db: Session = Depends(get_db),
    usuario = Depends(requiere_rol("talento"))
):
    reserva = db.query(Reserva).filter(Reserva.id == id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")

    if reserva.servicio.talento_id != usuario.id:
        raise HTTPException(status_code=403, detail="No tienes permiso para confirmar esta reserva")

    if reserva.estado != "pendiente":
        raise HTTPException(status_code=400, detail=f"La reserva ya está {reserva.estado}")

    reserva.estado = "confirmada"
    db.commit()
    db.refresh(reserva)
    await cache_delete(f"metricas:dashboard:{usuario.id}")
    return reserva