import { useEffect, useRef } from "react"
import { animate } from "animejs"

export default function StatCard({ label, value, color = "accent", icon = "◈", index = 0 }) {
    const cardRef  = useRef(null)
    const valueRef = useRef(null)

    const colores = {
        accent:  { glow: "#7C6EF6", texto: "var(--accent)"  },
        success: { glow: "#34D399", texto: "var(--success)" },
        warning: { glow: "#FBBF24", texto: "var(--warning)" },
        danger:  { glow: "#F87171", texto: "var(--danger)"  },
    }
    const e = colores[color] || colores.accent
    const esNumero = !isNaN(Number(value)) && value !== ""

    useEffect(() => {
        // Animación de entrada: fade + slide up con delay escalonado
        animate(cardRef.current, {
            opacity:   [0, 1],
            translateY: [24, 0],
            duration:  500,
            delay:     index * 100,
            easing:    "easeOutExpo",
        })

        // Animación de conteo si el valor es número
        if (esNumero) {
            const obj = { val: 0 }
            animate(obj, {
                val:      Number(value),
                duration: 900,
                delay:    index * 100 + 200,
                easing:   "easeOutExpo",
                round:    1,
                onUpdate: () => {
                    if (valueRef.current) {
                        valueRef.current.textContent = Math.round(obj.val).toLocaleString("es-CL")
                    }
                }
            })
        }
    }, [value])

    return (
        <div
            ref={cardRef}
            style={{
                background:    "var(--surface)",
                border:        `1px solid ${e.glow}30`,
                borderRadius:  "var(--radius-lg)",
                padding:       "28px 28px 24px",
                display:       "flex",
                flexDirection: "column",
                gap:           10,
                position:      "relative",
                overflow:      "hidden",
                opacity:       0,
                boxShadow:     `0 0 24px ${e.glow}15, inset 0 1px 0 ${e.glow}20`,
                transition:    "box-shadow 0.3s ease, border-color 0.3s ease",
                cursor:        "default",
            }}
            onMouseEnter={el => {
                el.currentTarget.style.boxShadow = `0 0 40px ${e.glow}30, inset 0 1px 0 ${e.glow}30`
                el.currentTarget.style.borderColor = `${e.glow}60`
            }}
            onMouseLeave={el => {
                el.currentTarget.style.boxShadow = `0 0 24px ${e.glow}15, inset 0 1px 0 ${e.glow}20`
                el.currentTarget.style.borderColor = `${e.glow}30`
            }}
        >
            {/* Glow background sutil */}
            <div style={{
                position:     "absolute",
                top:          -40,
                right:        -40,
                width:        120,
                height:       120,
                borderRadius: "50%",
                background:   `radial-gradient(circle, ${e.glow}18 0%, transparent 70%)`,
                pointerEvents: "none",
            }} />

            {/* Ícono */}
            <span style={{ fontSize: 20, color: e.texto, opacity: 0.8 }}>{icon}</span>

            {/* Valor */}
            <span
                ref={valueRef}
                style={{ fontSize: 38, fontWeight: 700, color: e.texto, letterSpacing: "-1.5px", lineHeight: 1 }}
            >
                {esNumero ? "0" : value}
            </span>

            {/* Label */}
            <span style={{ fontSize: 12, color: "var(--text-2)", fontWeight: 500, letterSpacing: "0.4px", textTransform: "uppercase" }}>
                {label}
            </span>
        </div>
    )
}