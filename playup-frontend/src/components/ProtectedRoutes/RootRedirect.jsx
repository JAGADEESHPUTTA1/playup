import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function RootRedirect() {
  const { isAuthenticated, loading } = useAuth();

  // Wait until /auth/me finishes
  if (loading) return null;

  // Logged in → home
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Not logged in → login
  return <Navigate to="/login" replace />;
}
