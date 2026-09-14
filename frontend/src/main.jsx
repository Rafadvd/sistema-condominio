import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LoginOperario from "./pages/LoginOperario.jsx";
import Central from "./pages/CentralOperario.jsx";
import CentralCondomino from "./pages/CentralCondomino.jsx";
import Condominos from "./pages/Condominos.jsx";
import Operarios from "./pages/Operarios.jsx";
import Historico from "./pages/Historico.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import LoginCondomino from "./pages/LoginCondomino.jsx";
import ConfiguracoesOperario from "./pages/ConfiguracoesOperario.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute redirectTo="/loginOperario">
        <Central />
      </ProtectedRoute>
    ),
  },
  {
    path: "/condominos",
    element: (
      <ProtectedRoute redirectTo="/loginOperario">
        <Condominos />
      </ProtectedRoute>
    ),
  },
  {
    path: "/operarios",
    element: (
      <ProtectedRoute redirectTo="/loginOperario">
        <AdminRoute>
          <Operarios />
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/historico",
    element: (
      <ProtectedRoute redirectTo="/loginOperario">
        <AdminRoute>
          <Historico />
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/configuracoes",
    element: (
      <ProtectedRoute redirectTo="/loginOperario">
        <ConfiguracoesOperario />
      </ProtectedRoute>
    ),
  },
  {
    path: "/condomino",
    element: (
      <ProtectedRoute redirectTo="/login">
        <CentralCondomino />
      </ProtectedRoute>
    ),
  },
  {
    path: "/loginOperario",
    element: <LoginOperario />,
  },
  {
    path: "/login",
    element: <LoginCondomino />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
