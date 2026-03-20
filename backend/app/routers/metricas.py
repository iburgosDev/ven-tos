from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.auth import get_usuario_actual
from app.models import Reserva, Servicio, Usuario
from app.cache import cache_get, cache_set

router = APIRouter(prefix="/metricas", tags=["metricas"])


@router.get("/dashboard")
async def dashboard_talento(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_usuario_actual)
):
    cache_key = f"metricas:dashboard:{current_user.id}"

    cached = await cache_get(cache_key)
    if cached:
        return {**cached, "from_cache": True}

    total_servicios = db.query(func.count(Servicio.id))\
        .filter(Servicio.talento_id == current_user.id)\
        .scalar()

    reservas_por_estado = db.query(
        Reserva.estado,
        func.count(Reserva.id).label("cantidad")
    ).join(Servicio)\
     .filter(Servicio.talento_id == current_user.id)\
     .group_by(Reserva.estado)\
     .all()

    estado_map = {r.estado: r.cantidad for r in reservas_por_estado}
    total_reservas = sum(estado_map.values())

    ingresos = db.query(func.sum(Servicio.precio))\
        .join(Reserva, Reserva.servicio_id == Servicio.id)\
        .filter(
            Servicio.talento_id == current_user.id,
            Reserva.estado.in_(["confirmada", "completada"])
        ).scalar() or 0

    resultado = {
        "total_servicios": total_servicios,
        "total_reservas": total_reservas,
        "reservas_pendientes": estado_map.get("pendiente", 0),
        "reservas_confirmadas": estado_map.get("confirmada", 0),
        "reservas_completadas": estado_map.get("completada", 0),
        "reservas_canceladas": estado_map.get("cancelada", 0),
        "ingresos_estimados": float(ingresos),
        "from_cache": False
    }

    await cache_set(cache_key, resultado, ttl=300)
    return resultado


@router.get("/reservas-recientes")
async def reservas_recientes(
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_usuario_actual)
):
    reservas = db.query(Reserva)\
        .join(Servicio)\
        .filter(Servicio.talento_id == current_user.id)\
        .order_by(Reserva.creado_en.desc())\
        .limit(limit)\
        .all()

    return [
        {
            "id": r.id,
            "servicio": r.servicio.titulo,
            "cliente": r.cliente.nombre,
            "estado": r.estado,
            "fecha": r.fecha_hora,
        }
        for r in reservas
    ]