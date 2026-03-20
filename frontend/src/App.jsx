import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Registro from "./pages/Registro"
import Dashboard from "./pages/Dashboard"
import Servicios from "./pages/Servicios"
import Reservas from "./pages/Reservas"
import Perfil from "./pages/Perfil"
import Layout from "./components/Layout"

function RutaProtegida({ children }) {
    const token = localStorage.getItem("token")
    if (!token) return <Navigate to="/" replace />
    return <Layout>{children}</Layout>
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route
                    path="/dashboard"
                    element={
                        <RutaProtegida>
                            <Dashboard />
                        </RutaProtegida>
                    }
                />
                <Route
                    path="/servicios"
                    element={
                        <RutaProtegida>
                            <Servicios />
                        </RutaProtegida>
                    }
                />
                <Route
                    path="/reservas"
                    element={
                        <RutaProtegida>
                            <Reservas />
                        </RutaProtegida>
                    }
                />
                <Route
                    path="/perfil"
                    element={
                        <RutaProtegida>
                            <Perfil />
                        </RutaProtegida>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}