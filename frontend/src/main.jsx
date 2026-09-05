import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LoginOperario from "./pages/LoginOperario.jsx";
import Central from "./pages/CentralOperario.jsx";
import CentralCondomino from "./pages/CentralCondomino.jsx";
import Condominos from "./pages/Condominos.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginCondomino from "./pages/LoginCondomino.jsx";
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
