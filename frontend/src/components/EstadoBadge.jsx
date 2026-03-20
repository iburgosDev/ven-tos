const colores = {
    pendiente:  { bg: "var(--warning-dim)", texto: "var(--warning)",  dot: "#FBBF24" },
    confirmada: { bg: "var(--accent-dim)",  texto: "var(--accent)",   dot: "#7C6EF6" },
    completada: { bg: "var(--success-dim)", texto: "var(--success)",  dot: "#34D399" },
    cancelada:  { bg: "var(--danger-dim)",  texto: "var(--danger)",   dot: "#F87171" },
}

export default function EstadoBadge({ estado }) {
    const estilo = colores[estado] || { bg: "var(--surface2)", texto: "var(--text-2)", dot: "#5A5A7A" }
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: estilo.bg,
            color: estilo.texto,
            padding: "3px 10px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.2px",
        }}>
            <span style={{
                width: 6, height: 6,
                borderRadius: "50%",
                background: estilo.dot,
                display: "inline-block",
                flexShrink: 0,
            }} />
            {estado}
        </span>
    )
}