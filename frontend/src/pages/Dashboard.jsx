import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { api, getRol } from "../api/client"
import StatCard from "../components/StatCard"
import ReservasTable from "../components/ReservasTable"

export default function Dashboard() {
    const [metricas, setMetricas] = useState(null)
    const [reservas, setReservas] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError]       = useState(null)
    const navigate  = useNavigate()
    const rol       = getRol()

    useEffect(() => {
        async function cargar() {
            try {
                if (rol === "talento") {
                    const [m, r] = await Promise.all([
                        api.get("/metricas/dashboard"),
                        api.get("/metricas/reservas-recientes?limit=5"),
                    ])
                    setMetricas(m)
                    setReservas(r)
                } else {
                    const r = await api.get("/reservas/mis-reservas")
                    setReservas(r)
                }
            } catch (err) {
                if (err.message.includes("401") || err.message.includes("403")) {
                    navigate("/")
                } else {
                    setError(err.message)
                }
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [])

    if (cargando) return (
        <div style={{ color: "var(--text-2)", fontSize: 14, paddingTop: 20 }}>
            Cargando dashboard...
        </div>
    )

    if (error) return (
        <div style={{ background: "var(--danger-dim)", color: "var(--danger)",
            padding: "12px 16px", borderRadius: "var(--radius)", fontSize: 14 }}>
            {error}
        </div>
    )

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 36 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.5px" }}>
                        Dashboard
                    </h1>
                    {metricas?.from_cache && (
                        <span style={{
                            fontSize: 11, fontWeight: 600, color: "var(--accent)",
                            background: "var(--accent-dim)",
                            padding: "3px 10px", borderRadius: 20,
                            letterSpacing: "0.4px",
                        }}>
                            ⚡ desde caché
                        </span>
                    )}
                </div>
                <p style={{ color: "var(--text-2)", fontSize: 14 }}>
                    {rol === "talento" ? "Resumen de tu actividad" : "Tus reservas activas"}
                </p>
            </div>

            {/* Métricas — solo talento */}
            {rol === "talento" && metricas && (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 16, marginBottom: 36,
                }}>
                    <StatCard label="Servicios activos"      value={metricas.total_servicios}       color="accent"  />
                    <StatCard label="Reservas totales"       value={metricas.total_reservas}        color="accent"  />
                    <StatCard label="Pendientes"             value={metricas.reservas_pendientes}   color="warning" />
                    <StatCard label="Ingresos estimados"     value={`$${metricas.ingresos_estimados.toLocaleString("es-CL")}`} color="success" />
                </div>
            )}

            {/* Tabla reservas */}
            <div style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: 28,
            }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)",
                    marginBottom: 20, letterSpacing: "-0.2px" }}>
                    {rol === "talento" ? "Reservas recientes" : "Mis reservas"}
                </h2>

                {/* Vista cliente — cards en vez de tabla */}
                {rol === "cliente" ? (
                    reservas.length === 0 ? (
                        <p style={{ color: "var(--text-3)", fontSize: 14 }}>
                            No tienes reservas aún.
                        </p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {reservas.map(r => (
                                <div key={r.id} style={{
                                    display: "flex", justifyContent: "space-between",
                                    alignItems: "center", padding: "12px 0",
                                    borderBottom: "1px solid var(--border)",
                                }}>
                                    <div>
                                        <p style={{ fontWeight: 500, color: "var(--text)", marginBottom: 4, fontSize: 14 }}>
                                            {r.servicio_titulo ?? `Servicio #${r.servicio_id}`}
                                        </p>
                                        <p style={{ fontSize: 12, color: "var(--text-2)" }}>
                                            {new Date(r.fecha_hora).toLocaleDateString("es-CL", {
                                                day: "2-digit", month: "2-digit", year: "numeric",
                                                hour: "2-digit", minute: "2-digit"
                                            })}
                                        </p>
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 600,
                                        color: r.estado === "confirmada" ? "var(--success)"
                                             : r.estado === "cancelada"  ? "var(--danger)"
                                             : "var(--warning)" }}>
                                        {r.estado}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    <ReservasTable reservas={reservas} />
                )}
            </div>
        </div>
    )
}