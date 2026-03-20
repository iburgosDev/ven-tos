from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Servicio
from app.schemas import ServicioCrear, ServicioRespuesta
from app.auth import get_usuario_actual, requiere_rol

router = APIRouter(prefix="/servicios", tags=["Servicios"])

@router.post("/", response_model=ServicioRespuesta, status_code=201)
def crear_servicio(
    datos: ServicioCrear,
    db: Session = Depends(get_db),
    usuario = Depends(requiere_rol("talento"))
):
    servicio = Servicio(**datos.model_dump(), talento_id=usuario.id)
    db.add(servicio)
    db.commit()
    db.refresh(servicio)
    return servicio

@router.get("/", response_model=List[ServicioRespuesta])
def listar_servicios(db: Session = Depends(get_db)):
    return db.query(Servicio).filter(Servicio.activo == True).all()

@router.get("/mis-servicios", response_model=List[ServicioRespuesta])
def mis_servicios(
    db: Session = Depends(get_db),
    usuario = Depends(requiere_rol("talento"))
):
    return db.query(Servicio).filter(
        Servicio.talento_id == usuario.id,
        Servicio.activo == True
    ).all()

@router.get("/{id}", response_model=ServicioRespuesta)
def obtener_servicio(id: int, db: Session = Depends(get_db)):
    servicio = db.query(Servicio).filter(Servicio.id == id).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    return servicio

@router.put("/{id}", response_model=ServicioRespuesta)
def actualizar_servicio(
    id: int,
    datos: ServicioCrear,
    db: Session = Depends(get_db),
    usuario = Depends(requiere_rol("talento"))
):
    servicio = db.query(Servicio).filter(
        Servicio.id == id,
        Servicio.talento_id == usuario.id
    ).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    for campo, valor in datos.model_dump().items():
        setattr(servicio, campo, valor)
    db.commit()
    db.refresh(servicio)
    return servicio

@router.delete("/{id}")
def eliminar_servicio(
    id: int,
    db: Session = Depends(get_db),
    usuario = Depends(requiere_rol("talento"))
):
    servicio = db.query(Servicio).filter(
        Servicio.id == id,
        Servicio.talento_id == usuario.id
    ).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    servicio.activo = False
    db.commit()
    return {"mensaje": f"Servicio '{servicio.titulo}' eliminado"}

"""@router.get("/mis-servicios", response_model=List[ServicioRespuesta])
def mis_servicios(
    db: Session = Depends(get_db),
    usuario = Depends(requiere_rol("talento"))
):
    return db.query(Servicio).filter(
        Servicio.talento_id == usuario.id,
        Servicio.activo == True      # ← agregar esta línea
    ).all()"""

@router.get("/{id}/horarios-ocupados")
def horarios_ocupados(id: int, db: Session = Depends(get_db)):
    from app.models import Reserva
    reservas = db.query(Reserva).filter(
        Reserva.servicio_id == id,
        Reserva.estado.in_(["pendiente", "confirmada"])
    ).all()
    return [{"fecha_hora": r.fecha_hora} for r in reservas]