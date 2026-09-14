import { Navigate } from "react-router-dom";

function tokenExpirou(token) {
  try {
    const payload = token.split(".")[1];
    const dados = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof dados.exp === "number" && dados.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export default function ProtectedRoute({ children, redirectTo = "/login" }) {
  const token = localStorage.getItem("token");
  if (token && tokenExpirou(token)) {
    localStorage.removeItem("token");
    return <Navigate to={redirectTo} replace />;
  }
  return token ? children : <Navigate to={redirectTo} replace />;
}
