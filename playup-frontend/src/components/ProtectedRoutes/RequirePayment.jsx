import { Navigate } from "react-router-dom";

export default function RequirePayment({ children }) {
  const paymentDone = localStorage.getItem("paymentDone");

  if (!paymentDone) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
