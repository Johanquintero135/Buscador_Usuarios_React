import { Navigate } from "react-router-dom";
import { useAuth } from "../contextos/AuthContext";

export function PrivateRoute({ children }) {
  const { user } = useAuth();

  // Si hay usuario, renderiza los hijos; si no, redirige al login
  return user ? children : <Navigate to="/login" replace />;
}
