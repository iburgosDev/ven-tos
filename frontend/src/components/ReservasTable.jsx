import EstadoBadge from "./EstadoBadge"

export default function ReservasTable({ reservas }) {
    if (!reservas.length) {
        return (
            <p style={{ color: "var(--text-3)", fontSize: 14, padding: "8px 0" }}>
                Sin reservas recientes.
            </p>
        )
    }
    return (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Servicio", "Cliente", "Fecha", "Estado"].map(h => (
                        <th key={h} style={{
                            textAlign: "left", padding: "8px 12px",
                            fontWeight: 600, color: "var(--text-3)",
                            fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px",
                        }}>
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {reservas.map(r => (
                    <tr key={r.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={td}>{r.servicio}</td>
                        <td style={td}>{r.cliente}</td>
                        <td style={{ ...td, color: "var(--text-2)" }}>
                            {new Date(r.fecha).toLocaleDateString("es-CL", {
                                day: "2-digit", month: "2-digit", year: "numeric",
                                hour: "2-digit", minute: "2-digit"
                            })}
                        </td>
                        <td style={td}><EstadoBadge estado={r.estado} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

const td = { padding: "14px 12px", color: "var(--text)", verticalAlign: "middle" }