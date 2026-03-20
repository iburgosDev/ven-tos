export default function StatCard({ label, value, color = "accent" }) {
    const colores = {
        accent:  { bg: "var(--accent-dim)",  texto: "var(--accent)",  borde: "var(--accent)" },
        success: { bg: "var(--success-dim)", texto: "var(--success)", borde: "var(--success)" },
        warning: { bg: "var(--warning-dim)", texto: "var(--warning)", borde: "var(--warning)" },
        danger:  { bg: "var(--danger-dim)",  texto: "var(--danger)",  borde: "var(--danger)" },
    }
    const e = colores[color] || colores.accent

    return (
        <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Accent bar top */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: 2, background: e.borde, opacity: 0.6,
            }} />
            <span style={{ fontSize: 36, fontWeight: 700, color: e.texto, letterSpacing: "-1px" }}>
                {value}
            </span>
            <span style={{ fontSize: 13, color: "var(--text-2)", fontWeight: 500 }}>
                {label}
            </span>
        </div>
    )
}