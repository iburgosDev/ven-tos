import { useState, useEffect } from "react"
import { api, getRol } from "../api/client"
import EstadoBadge from "../components/EstadoBadge"
import { useAnimateList } from "../hooks/useAnimateIn"

export default function Reservas() {
    const [reservas, setReservas]   = useState([])
    const [cargando, setCargando]   = useState(true)
    const [error, setError]         = useState(null)
    const [filtro, setFiltro]       = useState("todas")
    const rol                       = getRol()
    const listaRef = useAnimateList([reservas, filtro])

    useEffect(() => { cargar() }, [])

    async function cargar() {
        setCargando(true)
        setError(null)
        try {
            const endpoint = rol === "talento" ? "/reservas/agenda" : "/reservas/mis-reservas"
            const data = await api.get(endpoint)
            setReservas(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setCargando(false)
        }
    }

    async function confirmar(id) {
        try {
            await api.patch(`/reservas/${id}/confirmar`)
            cargar()
        } catch (err) { setError(err.message) }
    }

    async function cancelar(id) {
        if (!confirm("¿Cancelar esta reserva?")) return
        try {
            await api.patch(`/reservas/${id}/cancelar`)
            cargar()
        } catch (err) { setError(err.message) }
    }

    const filtros = ["todas", "pendiente", "confirmada", "cancelada"]
    const reservasFiltradas = reservas.filter(r => filtro === "todas" || r.estado === filtro)

    if (cargando) return <p style={{ color: "var(--text-2)", fontSize: 14 }}>Cargando reservas...</p>

    return (
        <div>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)",
                    letterSpacing: "-0.5px", marginBottom: 6 }}>
                    {rol === "talento" ? "Agenda" : "Mis Reservas"}
                </h1>
                <p style={{ color: "var(--text-2)", fontSize: 14 }}>
                    {rol === "talento"
                        ? "Gestiona las reservas de tus servicios"
                        : "Reservas que has realizado"}
                </p>
            </div>

            {error && (
                <div style={{ background: "var(--danger-dim)", color: "var(--danger)",
                    padding: "10px 14px", borderRadius: "var(--radius)",
                    fontSize: 13, marginBottom: 16, border: "1px solid #F8717130" }}>
                    {error}
                </div>
            )}

            {/* Filtros */}
            <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
                {filtros.map(f => (
                    <button key={f} onClick={() => setFiltro(f)} style={{
                        padding: "6px 16px", borderRadius: 20,
                        border: "1px solid",
                        fontSize: 13, cursor: "pointer",
                        fontWeight: filtro === f ? 600 : 400,
                        borderColor: filtro === f ? "var(--accent)" : "var(--border2)",
                        background: filtro === f ? "var(--accent-dim)" : "transparent",
                        color: filtro === f ? "var(--accent)" : "var(--text-2)",
                        transition: "all 0.15s ease",
                    }}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {reservasFiltradas.length === 0 ? (
                <div style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)", padding: 48,
                    textAlign: "center", color: "var(--text-3)", fontSize: 14,
                }}>
                    No hay reservas {filtro !== "todas" ? `con estado "${filtro}"` : "aún"}.
                </div>
            ) : (
                <div ref={listaRef} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {reservasFiltradas.map(r => (
                        <div key={r.id} style={{
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-lg)",
                            padding: "18px 24px",
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            transition: "border-color 0.15s ease",
                        }}>
                            <div>
                                <p style={{ fontWeight: 600, color: "var(--text)",
                                    marginBottom: 4, fontSize: 15 }}>
                                    {r.servicio_titulo ?? `Servicio #${r.servicio_id}`}
                                </p>
                                {rol === "talento" && r.cliente_nombre && (
                                    <p style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 6 }}>
                                        {r.cliente_nombre}
                                    </p>
                                )}
                                <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 8 }}>
                                    {new Date(r.fecha_hora).toLocaleDateString("es-CL", {
                                        day: "2-digit", month: "2-digit", year: "numeric",
                                        hour: "2-digit", minute: "2-digit"
                                    })}
                                </p>
                                <EstadoBadge estado={r.estado} />
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {rol === "talento" && r.estado === "pendiente" && (
                                    <button onClick={() => confirmar(r.id)} style={{
                                        padding: "8px 16px",
                                        background: "var(--success-dim)",
                                        color: "var(--success)",
                                        border: "1px solid #34D39930",
                                        borderRadius: "var(--radius)",
                                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                                    }}>
                                        Confirmar
                                    </button>
                                )}
                                {r.estado !== "cancelada" && (
                                    <button onClick={() => cancelar(r.id)} style={{
                                        padding: "8px 16px",
                                        background: "transparent",
                                        color: "var(--danger)",
                                        border: "1px solid #F8717130",
                                        borderRadius: "var(--radius)",
                                        fontSize: 13, cursor: "pointer",
                                    }}>
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}