from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth, servicios, reservas
from app.routers import metricas
import os

Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5173",
    "https://ven-tos.vercel.app",
    os.getenv("FRONTEND_URL", ""),   # ← URL de Vercel (se agrega después)
]

app = FastAPI(
    title="Ven-tos API",
    description="Plataforma donde personas ofrecen sus talentos",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in origins if o],  # filtra strings vacíos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(servicios.router)
app.include_router(reservas.router)
app.include_router(metricas.router)

@app.get("/")
def inicio():
    return {"mensaje": "Bienvenido a Ventos API"}