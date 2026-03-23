import { useState, useEffect } from "react"
import { api } from "../api/client"
import { useAnimateIn } from "../hooks/useAnimateIn"

export default function Perfil() {
    const [usuario, setUsuario]   = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError]       = useState(null)
    const cardRef = useAnimateIn({ duration: 600 })

    useEffect(() => {
        api.get("/auth/me")
            .then(setUsuario)
            .catch(err => setError(err.message))
            .finally(() => setCargando(false))
    }, [])

    if (cargando) return <p style={{ color: "var(--text-2)", fontSize: 14 }}>Cargando perfil...</p>
    if (error) return (
        <div style={{ background: "var(--danger-dim)", color: "var(--danger)",
            padding: "12px 16px", borderRadius: "var(--radius)", fontSize: 14 }}>
            {error}
        </div>
    )

    const inicial   = usuario.nombre.charAt(0).toUpperCase()
    const esTalento = usuario.rol === "talento"

    return (
        <div>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)",
                    letterSpacing: "-0.5px", marginBottom: 6 }}>
                    Mi Perfil
                </h1>
                <p style={{ color: "var(--text-2)", fontSize: 14 }}>
                    Tu información personal
                </p>
            </div>

            <div ref={cardRef} style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: 36, maxWidth: 500,
                opacity: 0,
            }}>
                {/* Avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 36 }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: "50%",
                        background: "var(--accent-dim)",
                        border: "2px solid var(--accent)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 24, fontWeight: 700, color: "var(--accent)",
                        flexShrink: 0,
                    }}>
                        {inicial}
                    </div>
                    <div>
                        <p style={{ fontWeight: 700, fontSize: 18, color: "var(--text)",
                            marginBottom: 6, letterSpacing: "-0.3px" }}>
                            {usuario.nombre}
                        </p>
                        <span style={{
                            fontSize: 12, fontWeight: 600, padding: "3px 12px",
                            borderRadius: 20, letterSpacing: "0.4px",
                            background: esTalento ? "var(--accent-dim)" : "var(--success-dim)",
                            color: esTalento ? "var(--accent)" : "var(--success)",
                        }}>
                            {esTalento ? "✦ Talento" : "◎ Cliente"}
                        </span>
                    </div>
                </div>

                {/* Datos */}
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {[
                        { label: "Email",         value: usuario.email },
                        { label: "Rol",           value: usuario.rol },
                        { label: "Miembro desde", value: new Date(usuario.creado_en).toLocaleDateString("es-CL", {
                            day: "2-digit", month: "long", year: "numeric"
                        })},
                    ].map((item, i) => (
                        <div key={i} style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "center", padding: "16px 0",
                            borderBottom: "1px solid var(--border)",
                        }}>
                            <span style={{ fontSize: 12, color: "var(--text-3)",
                                textTransform: "uppercase", letterSpacing: "0.6px", fontWeight: 600 }}>
                                {item.label}
                            </span>
                            <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const labelEstilo = {
    fontSize: 12,
    fontWeight: 600,
    color: "#6C757D",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
}

const valorEstilo = {
    fontSize: 15,
    color: "#212529",
}

const errorEstilo = {
    background: "#F8D7DA",
    color: "#842029",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 14,
}