import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Success.css";
import CheckCircleAnimated from "../../images/CheckCircle";

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear payment flow data
    localStorage.removeItem("orderId");
    localStorage.removeItem("paymentDone");
  }, []);

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon"><CheckCircleAnimated/></div>

        <h2>Payment Successful</h2>

        <p className="success-text">
          Your payment has been completed successfully.
          <br />
          Your console booking is now confirmed.
        </p>

        <button
          className="btn-primary"
          onClick={() => navigate("/my-orders")}
        >
          View My Orders
        </button>

        <button
          className="btn-secondary"
          onClick={() => navigate("/home")}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
