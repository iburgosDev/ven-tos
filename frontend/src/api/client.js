const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

function getToken() {
    return localStorage.getItem("token")
}

async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
            ...options.headers,
        },
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Error ${res.status}`)
    }
    return res.json()
}

export const api = {
    get:    (path)       => request(path),
    post:   (path, body) => request(path, { method: "POST",   body: JSON.stringify(body) }),
    put:    (path, body) => request(path, { method: "PUT",    body: JSON.stringify(body) }),
    patch:  (path, body) => request(path, { method: "PATCH",  body: JSON.stringify(body) }),  // ← NUEVO
    delete: (path)       => request(path, { method: "DELETE" }),
}
export function getRol() {
    return localStorage.getItem("rol")
}