import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "@components/layout/AppLayout";
import Dashboard from "@features/dashboard/pages/Dashboard";
import ValidarClientes from "@features/validar/pages/ValidarClientes";
import ProtectedRoute from "@components/ProtectedRoute";
import Login from "../features/auth/pages/Login";
import { publicRoutes } from "./routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "validar",
        element: (
          <ProtectedRoute>
            <ValidarClientes />
          </ProtectedRoute>
        ),
      },
      {
        path: "usuarios",
        element: (
          <ProtectedRoute>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800">
                Módulo de Usuarios
              </h2>
              <p className="text-gray-500 mt-2">Próximamente</p>
            </div>
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: publicRoutes.includes("/login") ? (
          <Login />
        ) : (
          <Navigate to="/" />
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
]);
