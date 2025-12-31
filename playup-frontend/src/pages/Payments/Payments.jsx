import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Payments.css";
import { api } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import { useToast } from "../../components/Toast/ToastContext";

export default function Payments() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = localStorage.getItem("orderId");

  useEffect(() => {
    if (!orderId) {
      showToast("Order not found. Please book again.", "error");
      navigate("/book");
      return;
    }
    fetchOrder();
    // eslint-disable-next-line
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      const orderData = res.data.data;

      // Already paid
      if (orderData.paymentStatus === "paid") {
        navigate("/success");
        return;
      }

      setOrder(orderData);
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Unable to load payment details.",
        "error"
      );
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  const payNow = async () => {
    try {
      const paymentOrder = await api.post("/payments/create", {
        orderId: order._id,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: paymentOrder.data.amount,
        currency: "INR",
        name: "PlayUp",
        description: "Console Rental Payment",
        order_id: paymentOrder.data.id,

        handler: async function (response) {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });

            showToast("Payment successful 🎉", "success");
            localStorage.setItem("paymentDone", "true");
            navigate("/success");
          } catch {
            showToast(
              "Payment verification failed. Please contact support.",
              "error"
            );
          }
        },

        modal: {
          ondismiss: () => {
            showToast("Payment was cancelled.", "error");
          },
        },

        theme: {
          color: "#3b82f6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      showToast(
        error?.response?.data?.message ||
          "Failed to start payment. Please try again.",
        "error"
      );
    }
  };

  if (loading) return <Loader text="Preparing payment..." />;

  if (!order) return null;

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h2>Confirm & Pay</h2>

        <div className="payment-info">
          <p>
            <strong>Console:</strong> {order.consoleType}
          </p>
          <p>
            <strong>Rental Dates:</strong>{" "}
            {new Date(order.rentalStartDate).toLocaleDateString()} →{" "}
            {new Date(order.rentalEndDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Controllers:</strong> {order.noOfControllers}
          </p>
          <p>
            <strong>Games:</strong> {order.gamesList}
          </p>
        </div>

        <div className="payment-amount">
          <span>Total Amount</span>
          <h3>₹{order.rentAmount.toLocaleString("en-IN")}</h3>
        </div>

        <button className="btn-primary payment-btn" onClick={payNow}>
          Pay Now
        </button>

        <button
          className="btn-secondary payment-btn"
          onClick={() => navigate(`/orders/${orderId}`)}
        >
          Edit Order
        </button>

        <p className="payment-note">Secure payment powered by Razorpay</p>
      </div>
    </div>
  );
}
