import { useState, useEffect } from "react"
import { api, getRol } from "../api/client"
import { useAnimateList } from "../hooks/useAnimateIn"

// Vista para ROL TALENTO: gestión de sus servicios
function VistaGestionServicios() {
    const [servicios, setServicios] = useState([])
    const [cargando, setCargando]   = useState(true)
    const [error, setError]         = useState(null)
    const [mostrarForm, setMostrarForm] = useState(false)
    const [editando, setEditando]   = useState(null)
    const [form, setForm] = useState({ titulo: "", descripcion: "", duracion_min: "", precio: "" })
    const listaRef = useAnimateList([servicios])

    useEffect(() => { cargar() }, [])

    async function cargar() {
        setCargando(true)
        try {
            const data = await api.get("/servicios/mis-servicios")
            setServicios(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setCargando(false)
        }
    }

    function abrirFormNuevo() {
        setEditando(null)
        setForm({ titulo: "", descripcion: "", duracion_min: "", precio: "" })
        setMostrarForm(true)
    }

    function abrirFormEditar(s) {
        setEditando(s.id)
        setForm({ titulo: s.titulo, descripcion: s.descripcion || "", duracion_min: s.duracion_min, precio: s.precio })
        setMostrarForm(true)
    }

    function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        try {
            const datos = { ...form, duracion_min: parseInt(form.duracion_min), precio: parseFloat(form.precio) }
            if (editando) {
                await api.put(`/servicios/${editando}`, datos)
            } else {
                await api.post("/servicios/", datos)
            }
            setMostrarForm(false)
            cargar()
        } catch (err) {
            setError(err.message)
        }
    }

    async function eliminar(id) {
        if (!confirm("¿Eliminar este servicio?")) return
        try {
            await api.delete(`/servicios/${id}`)
            cargar()
        } catch (err) {
            setError(err.message)
        }
    }

    if (cargando) return <p style={{ color: "var(--text-2)", fontSize: 14 }}>Cargando servicios...</p>

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.5px" }}>
                    Mis Servicios
                </h1>
                <button onClick={abrirFormNuevo} style={btnPrimarioEstilo}>+ Nuevo servicio</button>
            </div>

            {error && <div style={errorEstilo}>{error}</div>}

            {mostrarForm && (
                <div style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 24
                }}>
                    <h2 style={{ fontSize: 16, marginBottom: 20, color: "var(--text)", fontWeight: 600 }}>
                        {editando ? "Editar servicio" : "Nuevo servicio"}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                <label style={labelEstilo}>Título</label>
                                <input name="titulo" value={form.titulo} onChange={handleChange}
                                    required style={inputEstilo} placeholder="Ej: Clases de guitarra" />
                            </div>
                            <div>
                                <label style={labelEstilo}>Descripción</label>
                                <input name="descripcion" value={form.descripcion} onChange={handleChange}
                                    style={inputEstilo} placeholder="Descripción breve" />
                            </div>
                            <div>
                                <label style={labelEstilo}>Duración (minutos)</label>
                                <input type="number" name="duracion_min" value={form.duracion_min}
                                    onChange={handleChange} required style={inputEstilo} placeholder="60" />
                            </div>
                            <div>
                                <label style={labelEstilo}>Precio</label>
                                <input type="number" name="precio" value={form.precio}
                                    onChange={handleChange} required style={inputEstilo} placeholder="10000" />
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                            <button type="submit" style={btnPrimarioEstilo}>
                                {editando ? "Guardar cambios" : "Crear servicio"}
                            </button>
                            <button type="button" onClick={() => setMostrarForm(false)} style={btnSecundarioEstilo}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {servicios.length === 0 ? (
                <div style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)", padding: 48,
                    textAlign: "center", color: "var(--text-3)", fontSize: 14,
                }}>
                    No tienes servicios aún. ¡Crea el primero!
                </div>
            ) : (
                <div ref={listaRef} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {servicios.map(s => (
                        <div key={s.id} style={{
                            background: "var(--surface)", border: "1px solid var(--border)",
                            borderRadius: "var(--radius-lg)", padding: "18px 24px",
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}>
                            <div>
                                <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4, fontSize: 15 }}>
                                    {s.titulo}
                                </p>
                                <p style={{ fontSize: 13, color: "var(--text-2)" }}>
                                    {s.duracion_min} min · ${s.precio.toLocaleString("es-CL")}
                                    {s.descripcion && ` · ${s.descripcion}`}
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => abrirFormEditar(s)} style={btnSecundarioEstilo}>
                                    Editar
                                </button>
                                <button onClick={() => eliminar(s.id)} style={btnPeligroEstilo}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// Vista para ROL CLIENTE: explorar y reservar servicios
function VistaExplorarServicios() {
    const [servicios, setServicios]               = useState([])
    const [cargando, setCargando]                 = useState(true)
    const [error, setError]                       = useState(null)
    const [reservando, setReservando]             = useState(null)
    const [fechaHora, setFechaHora]               = useState("")
    const [horariosOcupados, setHorariosOcupados] = useState([])
    const [exito, setExito]                       = useState(null)
    const listaRef = useAnimateList([servicios])

    useEffect(() => { cargar() }, [])

    async function cargar() {
        try {
            const serviciosData = await api.get("/servicios/")
            setServicios(serviciosData)
        } catch (err) {
            setError(err.message)
        } finally {
            setCargando(false)
        }
    }

    async function abrirReserva(servicioId) {
        if (reservando === servicioId) {
            setReservando(null)
            setFechaHora("")
            setHorariosOcupados([])
            return
        }
        try {
            const data = await api.get(`/servicios/${servicioId}/horarios-ocupados`)
            setHorariosOcupados(data.map(h => h.fecha_hora))
            setReservando(servicioId)
            setFechaHora("")
        } catch (err) {
            setError(err.message)
        }
    }

    function fechaEstaOcupada(fechaSeleccionada) {
        if (!fechaSeleccionada) return false
        const diaSeleccionado = fechaSeleccionada.slice(0, 10)
        return horariosOcupados.some(h => {
            const diaOcupado = new Date(h).toISOString().slice(0, 10)
            return diaOcupado === diaSeleccionado
        })
    }

    async function hacerReserva(servicioId) {
        if (!fechaHora) return
        if (fechaEstaOcupada(fechaHora)) {
            setError("Ese horario ya está reservado. Elige otro.")
            return
        }
        setError(null)
        setExito(null)
        try {
            await api.post("/reservas/", {
                servicio_id: servicioId,
                fecha_hora: new Date(fechaHora).toISOString(),
            })
            setReservando(null)
            setFechaHora("")
            setHorariosOcupados([])
            setExito("¡Reserva creada exitosamente!")
            setTimeout(() => setExito(null), 4000)
            cargar()
        } catch (err) {
            setError(err.message)
        }
    }

    if (cargando) return <p style={{ color: "var(--text-2)", fontSize: 14 }}>Cargando servicios...</p>

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.5px", marginBottom: 4 }}>
                    Servicios disponibles
                </h1>
                <p style={{ color: "var(--text-2)", fontSize: 14 }}>
                    Explora y reserva el tiempo de un talento
                </p>
            </div>

            {error && (
                <div style={{ background: "var(--danger-dim)", color: "var(--danger)", padding: "10px 14px",
                    borderRadius: "var(--radius)", fontSize: 14, marginBottom: 16, border: "1px solid #F8717130" }}>
                    {error}
                </div>
            )}
            {exito && (
                <div style={{ background: "var(--success-dim)", color: "var(--success)", padding: "10px 14px",
                    borderRadius: "var(--radius)", fontSize: 14, marginBottom: 16 }}>
                    {exito}
                </div>
            )}

            {servicios.length === 0 ? (
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)", padding: 40, textAlign: "center", color: "var(--text-3)" }}>
                    No hay servicios disponibles aún.
                </div>
            ) : (
                <div ref={listaRef} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {servicios.map(s => (
                        <div key={s.id} style={{ background: "var(--surface)",
                            border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "16px 20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4, fontSize: 15 }}>
                                        {s.titulo}
                                    </p>
                                    <p style={{ fontSize: 13, color: "var(--text-2)" }}>
                                        {s.duracion_min} min · ${s.precio.toLocaleString("es-CL")}
                                        {s.descripcion && ` · ${s.descripcion}`}
                                    </p>
                                </div>
                                <button onClick={() => abrirReserva(s.id)} style={btnPrimarioEstilo}>
                                    {reservando === s.id ? "Cancelar" : "Reservar"}
                                </button>
                            </div>

                            {reservando === s.id && (
                                <div style={{ marginTop: 16, paddingTop: 16,
                                    borderTop: "1px solid var(--border)",
                                    display: "flex", gap: 12, alignItems: "flex-end" }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelEstilo}>Fecha y hora</label>
                                        <input
                                            type="datetime-local"
                                            value={fechaHora}
                                            min={new Date().toISOString().slice(0, 16)}
                                            onChange={e => setFechaHora(e.target.value)}
                                            style={{
                                                ...inputEstilo,
                                                borderColor: fechaEstaOcupada(fechaHora) ? "var(--danger)" : "var(--border2)"
                                            }}
                                        />
                                        {fechaEstaOcupada(fechaHora) && (
                                            <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 6 }}>
                                                ⚠ Este día ya tiene una reserva activa. Elige otro día.
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => hacerReserva(s.id)}
                                        disabled={!fechaHora || fechaEstaOcupada(fechaHora)}
                                        style={{
                                            ...btnPrimarioEstilo,
                                            opacity: (!fechaHora || fechaEstaOcupada(fechaHora)) ? 0.5 : 1,
                                            cursor: (!fechaHora || fechaEstaOcupada(fechaHora)) ? "not-allowed" : "pointer"
                                        }}
                                    >
                                        Confirmar reserva
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// Componente principal — delega según rol
export default function Servicios() {
    const rol = getRol()
    return rol === "talento" ? <VistaGestionServicios /> : <VistaExplorarServicios />
}

const btnPrimarioEstilo   = { padding: "10px 18px", background: "var(--accent)", color: "white", border: "none", borderRadius: "var(--radius)", fontSize: 14, fontWeight: 600, cursor: "pointer" }
const btnSecundarioEstilo = { padding: "8px 14px", background: "transparent", color: "var(--text-2)", border: "1px solid var(--border2)", borderRadius: "var(--radius)", fontSize: 14, cursor: "pointer" }
const btnPeligroEstilo    = { padding: "8px 14px", background: "transparent", color: "var(--danger)", border: "1px solid #F8717130", borderRadius: "var(--radius)", fontSize: 14, cursor: "pointer" }
const errorEstilo         = { background: "var(--danger-dim)", color: "var(--danger)", padding: "10px 14px", borderRadius: "var(--radius)", fontSize: 13, marginBottom: 16, border: "1px solid #F8717130" }
const labelEstilo         = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.6px" }
const inputEstilo         = { width: "100%", padding: "11px 14px", background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: "var(--radius)", fontSize: 14, color: "var(--text)", boxSizing: "border-box", outline: "none" }