from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Usuario
from app.schemas import UsuarioRegistro, UsuarioLogin, Token
from app.auth import hashear_password, verificar_password, crear_token

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/registro", response_model=Token, status_code=201)
def registro(datos: UsuarioRegistro, db: Session = Depends(get_db)):
    existe = db.query(Usuario).filter(Usuario.email == datos.email).first()
    if existe:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    usuario = Usuario(
        nombre=datos.nombre,
        email=datos.email,
        password=hashear_password(datos.password),
        rol=datos.rol
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)

    token = crear_token({"sub": str(usuario.id), "rol": usuario.rol})
    return {"access_token": token, "token_type": "bearer", "usuario": usuario}


@router.post("/login", response_model=Token)
def login(datos: UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == datos.email).first()
    if not usuario or not verificar_password(datos.password, usuario.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    token = crear_token({"sub": str(usuario.id), "rol": usuario.rol})
    return {"access_token": token, "token_type": "bearer", "usuario": usuario}
@router.get("/usuarios", tags=["Autenticación"])
def listar_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(Usuario).all()
    return [{"id": u.id, "nombre": u.nombre, "email": u.email, "rol": u.rol} for u in usuarios]