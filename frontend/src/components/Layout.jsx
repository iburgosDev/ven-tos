import { NavLink, useNavigate } from "react-router-dom"

const links = [
    { to: "/dashboard", label: "Dashboard",  icono: "⬡" },
    { to: "/servicios",  label: "Servicios",  icono: "◈" },
    { to: "/reservas",   label: "Reservas",   icono: "◷" },
    { to: "/perfil",     label: "Perfil",     icono: "◯" },
]

export default function Layout({ children }) {
    const navigate = useNavigate()

    function cerrarSesion() {
        localStorage.removeItem("token")
        localStorage.removeItem("rol")
        navigate("/")
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
            <aside style={{
                width: 230,
                background: "var(--surface)",
                borderRight: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                padding: "28px 0",
                position: "fixed",
                top: 0, left: 0,
                height: "100vh",
            }}>
                {/* Logo */}
                <div style={{ padding: "0 24px 36px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                            width: 32, height: 32,
                            background: "var(--accent)",
                            borderRadius: 8,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 16, fontWeight: 700, color: "white",
                        }}>
                            V
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 18, color: "var(--text)", letterSpacing: "-0.3px" }}>
                            Ven-tos
                        </span>
                    </div>
                </div>

                {/* Nav links */}
                <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" }}>
                    {links.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            style={({ isActive }) => ({
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "10px 14px",
                                borderRadius: "var(--radius)",
                                textDecoration: "none",
                                fontSize: 14,
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? "var(--accent)" : "var(--text-2)",
                                background: isActive ? "var(--accent-dim)" : "transparent",
                                transition: "all 0.15s ease",
                            })}
                        >
                            <span style={{ fontSize: 15, opacity: 0.9 }}>{link.icono}</span>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Cerrar sesión */}
                <div style={{ padding: "0 12px", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                    <button onClick={cerrarSesion} style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: "transparent",
                        border: "1px solid var(--border2)",
                        borderRadius: "var(--radius)",
                        fontSize: 14,
                        color: "var(--text-3)",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                        display: "flex", alignItems: "center", gap: 8,
                    }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = "var(--danger)"
                            e.currentTarget.style.borderColor = "var(--danger)"
                            e.currentTarget.style.background = "var(--danger-dim)"
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = "var(--text-3)"
                            e.currentTarget.style.borderColor = "var(--border2)"
                            e.currentTarget.style.background = "transparent"
                        }}
                    >
                        <span>→</span> Cerrar sesión
                    </button>
                </div>
            </aside>

            <main style={{
                marginLeft: 230,
                flex: 1,
                padding: "40px",
                minHeight: "100vh",
            }}>
                {children}
            </main>
        </div>
    )
}