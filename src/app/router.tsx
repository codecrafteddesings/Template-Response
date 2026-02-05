import { createBrowserRouter } from "react-router-dom"
import AppLayout from "@components/layout/AppLayout"
import Dashboard from "@features/dashboard/pages/Dashboard"
import ProtectedRoute from "@components/ProtectedRoute"
import Login from "../features/auth/pages/Login"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                index: true, element:
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
            },
            {
                path: "login",
                element: <Login />
            },
        ],
    },
])
