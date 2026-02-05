import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginRequest } from "../services"
import { useAuthStore } from "../store"

export default function LoginPage() {
    const navigate = useNavigate()
    const setUser = useAuthStore((s) => s.setUser)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const user = await loginRequest(email, password)

            setUser(user)
            localStorage.setItem("user", JSON.stringify(user))

            navigate("/")
        } catch (err: any) {
            setError("Credenciales inválidas")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded shadow-md w-80"
            >
                <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>

                {error && (
                    <p className="bg-red-100 text-red-600 p-2 mb-4 rounded text-sm">
                        {error}
                    </p>
                )}

                <input
                    type="email"
                    placeholder="Correo"
                    className="w-full border p-2 mb-4 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    className="w-full border p-2 mb-6 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </div>
    )
}
