import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { api } from "../api/client"
import { useAnimateIn } from "../hooks/useAnimateIn"

export default function Login() {
    const [email, setEmail]       = useState("")
    const [password, setPassword] = useState("")
    const [error, setError]       = useState(null)
    const [cargando, setCargando] = useState(false)
    const panelIzqRef  = useAnimateIn({ duration: 600 })
    const formularioRef = useAnimateIn({ duration: 600, delay: 150 })
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setCargando(true)
        setError(null)
        try {
            const data = await api.post("/auth/login", { email, password })
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
            background: "var(--bg)",
        }}>
            {/* Panel izquierdo decorativo */}
            <div ref={panelIzqRef} style={{
                width: "45%", background: "var(--surface)",
                opacity: 0,
                borderRight: "1px solid var(--border)",
                display: "flex", flexDirection: "column",
                justifyContent: "center", padding: "60px",
                position: "relative", overflow: "hidden",
            }}>
                {/* Círculo decorativo */}
                <div style={{
                    position: "absolute", width: 400, height: 400,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #7C6EF630 0%, transparent 70%)",
                    top: -100, right: -100,
                }} />
                <div style={{ position: "relative" }}>
                    <div style={{
                        width: 48, height: 48, background: "var(--accent)",
                        borderRadius: 12, display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 22, fontWeight: 700,
                        color: "white", marginBottom: 32,
                    }}>
                        V
                    </div>
                    <h1 style={{ fontSize: 36, fontWeight: 700, color: "var(--text)",
                        letterSpacing: "-0.8px", marginBottom: 16, lineHeight: 1.2 }}>
                        Ven-tos
                    </h1>
                    <p style={{ fontSize: 16, color: "var(--text-2)", lineHeight: 1.6, maxWidth: 320 }}>
                        La plataforma donde los talentos ofrecen su tiempo y los clientes lo reservan.
                    </p>
                </div>
            </div>

            {/* Panel derecho — formulario */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
                <div ref={formularioRef} style={{ width: "100%", maxWidth: 380, opacity: 0}}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)",
                        letterSpacing: "-0.4px", marginBottom: 8 }}>
                        Ingresar
                    </h2>
                    <p style={{ color: "var(--text-2)", fontSize: 14, marginBottom: 32 }}>
                        Bienvenido de vuelta
                    </p>

                    {error && (
                        <div style={{ background: "var(--danger-dim)", color: "var(--danger)",
                            padding: "10px 14px", borderRadius: "var(--radius)",
                            fontSize: 13, marginBottom: 20, border: "1px solid #F8717130" }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 16 }}>
                            <label style={labelEstilo}>Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                required style={inputEstilo} placeholder="tu@email.com" />
                        </div>
                        <div style={{ marginBottom: 28 }}>
                            <label style={labelEstilo}>Contraseña</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                required style={inputEstilo} placeholder="••••••••" />
                        </div>
                        <button type="submit" disabled={cargando} style={{
                            width: "100%", padding: "12px",
                            background: cargando ? "var(--surface2)" : "var(--accent)",
                            color: cargando ? "var(--text-3)" : "white",
                            border: "none", borderRadius: "var(--radius)",
                            fontSize: 15, fontWeight: 600,
                            cursor: cargando ? "not-allowed" : "pointer",
                            marginBottom: 20,
                            transition: "all 0.15s ease",
                        }}>
                            {cargando ? "Ingresando..." : "Ingresar"}
                        </button>
                        <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-2)" }}>
                            ¿No tienes cuenta?{" "}
                            <Link to="/registro" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
                                Crear cuenta
                            </Link>
                        </p>
                    </form>
                </div>
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
    transition: "border-color 0.15s ease",
}