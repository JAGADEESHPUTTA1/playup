import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import "./MyOrders.css";
import { useAuth } from "../../Context/AuthContext";
import { useToast } from "../../components/Toast/ToastContext";

export default function MyOrders() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // const token = localStorage.getItem("token");

    // 🔒 Protect route
    if (!isAuthenticated || user?.role !== "user") {
      showToast("Session expired. Please login again.", "error");
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        setOrders(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch orders", error);

        showToast(
          error?.response?.data?.message ||
            "Couldn’t load your orders. Please try again.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, user, showToast]);

  if (loading) return <Loader text="Loading your orders..." />;

  if (!orders.length) {
    return (
      <div className="my-orders empty">
        <h2>My Orders</h2>
        <p>You don’t have any orders yet.</p>
        <button onClick={() => navigate("/book")}>Book a Console</button>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      <div className="orders-list">
        {orders.map((order) => (
          <div
            key={order._id}
            className="order-card"
            onClick={() => navigate(`/orders/${order._id}`)}
          >
            <div className="order-row">
              <span className="label">Console</span>
              <span>{order.consoleType}</span>
            </div>

            <div className="order-row">
              <span className="label">Status</span>
              <span className={`status ${order.status}`}>{order.status}</span>
            </div>

            <div className="order-row">
              <span className="label">Rent</span>
              <span>₹{order.rentAmount}</span>
            </div>

            <div className="order-row">
              <span className="label">From</span>
              <span>
                {new Date(order.rentalStartDate).toLocaleDateString()}
              </span>
            </div>

            <div className="order-row">
              <span className="label">To</span>
              <span>{new Date(order.rentalEndDate).toLocaleDateString()}</span>
            </div>

            <div className="order-row">
              <span className="label">Payment</span>
              <span>{order.paymentStatus}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
