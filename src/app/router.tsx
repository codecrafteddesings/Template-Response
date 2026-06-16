import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "@components/layout/AppLayout";
import Dashboard from "@features/dashboard/pages/Dashboard";
import VerificacionView from "@features/validar/pages/VerificacionView";
import UsuariosPage from "@features/usuarios/pages/UsuariosPage";
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
            <VerificacionView />
          </ProtectedRoute>
        ),
      },
      {
        path: "usuarios",
        element: (
          <ProtectedRoute>
            <UsuariosPage />
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
