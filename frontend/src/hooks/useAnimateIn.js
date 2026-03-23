import { useEffect, useRef } from "react"
import { animate } from "animejs"

export function useAnimateIn(options = {}) {
    const ref = useRef(null)

    useEffect(() => {
        if (!ref.current) return
        animate(ref.current, {
            opacity:    [0, 1],
            translateY: [20, 0],
            duration:   options.duration  || 500,
            delay:      options.delay     || 0,
            easing:     options.easing    || "easeOutExpo",
        })
    }, [])

    return ref
}

export function useAnimateList(deps = []) {
    const ref = useRef(null)

    useEffect(() => {
        if (!ref.current) return
        const items = ref.current.children
        if (!items.length) return
        animate(items, {
            opacity:    [0, 1],
            translateY: [16, 0],
            duration:   400,
            delay:      (_, i) => i * 80,
            easing:     "easeOutExpo",
        })
    }, deps)

    return ref
}