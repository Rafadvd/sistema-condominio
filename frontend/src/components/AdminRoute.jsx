import { Navigate } from "react-router-dom";
import { usuarioEhAdmin } from "../lib/api";

export default function AdminRoute({ children }) {
  return usuarioEhAdmin() ? children : <Navigate to="/" replace />;
}
