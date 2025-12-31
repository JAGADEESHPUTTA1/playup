import { Navigate } from "react-router-dom";
import {useAuth} from "../../Context/AuthContext"
export default function UserRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // ⏳ Wait until /auth/me finishes
  if (loading) return null; // or a loader

  // 🔒 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
