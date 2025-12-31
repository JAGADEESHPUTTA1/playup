import { Navigate } from "react-router-dom";

export default function RequireOrder({ children }) {
  const orderId = localStorage.getItem("orderId");

  if (!orderId) {
    return <Navigate to="/book" replace />;
  }

  return children;
}
