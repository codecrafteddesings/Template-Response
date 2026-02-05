import { Navigate } from "react-router-dom"
import { useAuthStore } from "@features/auth/store"
import type { JSX } from "react"

interface ProtectedRouteProps {
    children: JSX.Element
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const user = useAuthStore((s) => s.user)

    if (user) return <Navigate to="/login" />

    return children
}
