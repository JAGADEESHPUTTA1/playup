import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import { useAuth } from "../../Context/AuthContext";
import { useToast } from "../../components/Toast/ToastContext";
import "./OrderDetails.css";

export default function OrderDetails() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data.data);
      } catch (error) {
        showToast(
          error?.response?.data?.message ||
            "Couldn’t load order details. Please try again.",
          "error"
        );
        navigate("/my-orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate, showToast]);

  if (loading) return <Loader text="Loading order details..." />;

  if (!order) return null;

  const routeHandler = () => {
    if (user.role === "user") {
      navigate(`/my-orders`);
    } else {
      navigate(`/admin/orders`);
    }
  };

  const isAdmin = user.role === "admin";
  const isPaymentCompleted =
    order.paymentStatus !== "pending" && !!order.razorpayPaymentId;

  const fullWidth = isAdmin || isPaymentCompleted;

  const editOrderHandler = () => {
    if (isAdmin) {
      navigate(`/admin/orders/${orderId}/edit`);
    } else {
      navigate(`/orders/${orderId}/edit`);
    }
  };

  const proceedToPayment = () => {
    try {
      localStorage.setItem("orderId", order._id);
      navigate("/payment");
    } catch {
      showToast("Unable to proceed to payment. Please try again.", "error");
    }
  };

  return (
    <div className="center">
      <div className="order-details">
        <h2>Order Details</h2>

        <div
          className={`details-card ${
            ((order.paymentStatus === "pending" && !order.razorpayPaymentId) ||
              isAdmin) &&
            "edit-order"
          }`}
        >
          {((order.paymentStatus === "pending" && !order.razorpayPaymentId) ||
            isAdmin) && (
            <button className="edit-inline-btn" onClick={editOrderHandler}>
              ✏️ Edit
            </button>
          )}

          <Detail label="Console" value={order.consoleType} />
          <Detail label="Games List" value={order.gamesList} />
          <Detail label="Controllers" value={order.noOfControllers} />
          <Detail label="Status" value={order.status} status />
          <Detail label="Rent Amount" value={`₹${order.rentAmount}`} />
          <Detail label="Deposit" value={`₹${order.depositAmount}`} />
          <Detail label="Payment Status" value={order.paymentStatus} />
          <Detail
            label="Payment Id"
            value={
              !order.razorpayPaymentId
                ? "Payment Pending"
                : order.razorpayPaymentId
            }
          />
          <Detail
            label="Rental Start"
            value={new Date(order.rentalStartDate).toLocaleDateString()}
          />
          <Detail
            label="Rental End"
            value={new Date(order.rentalEndDate).toLocaleDateString()}
          />
        </div>

        <div className="order_footer">
          <button
            className={`back-btn ${fullWidth ? "back-btn-width" : ""}`}
            onClick={routeHandler}
          >
            {isAdmin ? "← Back to All Orders" : "← Back to My Orders"}
          </button>

          {order.paymentStatus === "pending" &&
            !order.razorpayPaymentId &&
            !isAdmin && (
              <button
                className="back-btn primaryColor"
                onClick={proceedToPayment}
              >
                Proceed to Payment
              </button>
            )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, status }) {
  return (
    <div className="detail-row">
      <span className="label">{label}</span>
      <span className={status ? `status ${value}` : ""}>{value}</span>
    </div>
  );
}
