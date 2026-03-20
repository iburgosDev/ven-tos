import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { api } from "../api/client"

export default function Registro() {
    const [form, setForm] = useState({ nombre: "", email: "", password: "", rol: "cliente" })
    const [error, setError]       = useState(null)
    const [cargando, setCargando] = useState(false)
    const navigate = useNavigate()

    function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

    async function handleSubmit(e) {
        e.preventDefault()
        setCargando(true)
        setError(null)
        try {
            const data = await api.post("/auth/registro", form)
            localStorage.setItem("token", data.access_token)
            localStorage.setItem("rol", data.usuario.rol)
            navigate("/dashboard")
        } catch (err) {
            setError(err.message)
        } finally {
            setCargando(false)
        }
    }

    return (
        <div style={{
            minHeight: "100vh", display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "var(--bg)",
        }}>
            <div style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "40px 48px",
                width: "100%", maxWidth: 420,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
                    <div style={{
                        width: 36, height: 36, background: "var(--accent)",
                        borderRadius: 8, display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 18, fontWeight: 700, color: "white",
                    }}>V</div>
                    <span style={{ fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Ven-tos</span>
                </div>

                <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)",
                    letterSpacing: "-0.4px", marginBottom: 6 }}>
                    Crear cuenta
                </h2>
                <p style={{ color: "var(--text-2)", fontSize: 14, marginBottom: 28 }}>
                    Únete a la plataforma
                </p>

                {error && (
                    <div style={{ background: "var(--danger-dim)", color: "var(--danger)",
                        padding: "10px 14px", borderRadius: "var(--radius)",
                        fontSize: 13, marginBottom: 20, border: "1px solid #F8717130" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {[
                        { label: "Nombre", name: "nombre", type: "text", placeholder: "Tu nombre completo" },
                        { label: "Email", name: "email", type: "email", placeholder: "tu@email.com" },
                        { label: "Contraseña", name: "password", type: "password", placeholder: "••••••••" },
                    ].map(f => (
                        <div key={f.name} style={{ marginBottom: 16 }}>
                            <label style={labelEstilo}>{f.label}</label>
                            <input type={f.type} name={f.name} value={form[f.name]}
                                onChange={handleChange} required
                                style={inputEstilo} placeholder={f.placeholder} />
                        </div>
                    ))}

                    <div style={{ marginBottom: 28 }}>
                        <label style={labelEstilo}>Rol</label>
                        <select name="rol" value={form.rol} onChange={handleChange} style={inputEstilo}>
                            <option value="cliente">Cliente — reserva servicios</option>
                            <option value="talento">Talento — ofrece servicios</option>
                        </select>
                    </div>

                    <button type="submit" disabled={cargando} style={{
                        width: "100%", padding: "12px",
                        background: cargando ? "var(--surface2)" : "var(--accent)",
                        color: cargando ? "var(--text-3)" : "white",
                        border: "none", borderRadius: "var(--radius)",
                        fontSize: 15, fontWeight: 600,
                        cursor: cargando ? "not-allowed" : "pointer",
                        marginBottom: 20, transition: "all 0.15s ease",
                    }}>
                        {cargando ? "Creando cuenta..." : "Crear cuenta"}
                    </button>
                    <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-2)" }}>
                        ¿Ya tienes cuenta?{" "}
                        <Link to="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
                            Ingresar
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

const labelEstilo = {
    display: "block", fontSize: 12, fontWeight: 600,
    color: "var(--text-2)", marginBottom: 8,
    textTransform: "uppercase", letterSpacing: "0.6px",
}
const inputEstilo = {
    width: "100%", padding: "11px 14px",
    background: "var(--surface2)",
    border: "1px solid var(--border2)",
    borderRadius: "var(--radius)",
    fontSize: 14, color: "var(--text)",
    boxSizing: "border-box", outline: "none",
}