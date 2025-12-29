import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import "./OrderDetails.css";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data.data);
      } catch (error) {
        navigate("/my-orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (loading) return <Loader text="Loading order details..." />;

  if (!order) return null;

  return (
    <div className="center">

    <div className="order-details">
      <h2>Order Details</h2>

      <div className="details-card">
        <Detail label="Console" value={order.consoleType} />
        <Detail label="Status" value={order.status} status />
        <Detail label="Controllers" value={order.noOfControllers} />
        <Detail label="Rent Amount" value={`₹${order.rentAmount}`} />
        <Detail label="Deposit" value={`₹${order.depositAmount}`} />

        <Detail
          label="Rental Start"
          value={new Date(order.rentalStartDate).toLocaleDateString()}
        />
        <Detail
          label="Rental End"
          value={new Date(order.rentalEndDate).toLocaleDateString()}
        />

      </div>

      <button className="back-btn" onClick={() => navigate("/my-orders")}>
        ← Back to My Orders
      </button>
    </div>
    </div>
  );
}

function Detail({ label, value, status }) {
  return (
    <div className="detail-row">
      <span className="label">{label}</span>
      <span className={status ? `status ${value}` : ""}>
        {value}
      </span>
    </div>
  );
}
