import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import TextField from "../../components/TextField/TextField";
import "./AdminOrder.css";
import { useToast } from "../../components/Toast/ToastContext";

const STATUSES = [
  "pending",
  "confirmed",
  "delivered",
  "active",
  "returned",
  "completed",
  "cancelled",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || "";

  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/orders", {
        params: statusFilter ? { status: statusFilter } : {},
      });
      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch orders", error);

      if (error?.response?.status === 401 || error?.response?.status === 403) {
        showToast("Session expired. Please login again.", "error");
        navigate("/");
        return;
      }

      showToast(
        error?.response?.data?.message ||
          "Couldn’t load orders. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      await api.patch(`/admin/orders/${orderId}/status`, { status });

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } catch (error) {
      console.error("Failed to update status", error);

      showToast(
        error?.response?.data?.message ||
          "Failed to update order status. Try again.",
        "error"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const openInMaps = (location) => {
    if (!location) {
      showToast("Delivery location not available.", "error");
      return;
    }

    const [lat, lng] = location.split(",").map((v) => v.trim());

    if (!lat || !lng) {
      showToast("Invalid delivery location format.", "error");
      return;
    }

    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  if (loading) return <Loader text="Loading orders..." />;

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h2>Orders</h2>

        <div className="filter">
          <TextField
            labelName="Filter by Status"
            select
            value={statusFilter}
            options={[
              { label: "All", value: "" },
              ...STATUSES.map((s) => ({
                label: s.charAt(0).toUpperCase() + s.slice(1),
                value: s,
              })),
            ]}
            onChange={(e) =>
              setSearchParams(e.target.value ? { status: e.target.value } : {})
            }
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="orders-table">
          <div className="orders-head">
            <span>Customer</span>
            <span>Console</span>
            <span>Payment</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {orders.map((order) => (
            <div
              key={order._id}
              className="orders-row"
              onClick={() => navigate(`/admin/orders/${order._id}`)}
            >
              <span>
                {order.customerName}
                <br />
                <small>{order.customerPhone}</small>
              </span>

              <span>{order.consoleType}</span>

              <span>{order.paymentStatus}</span>

              <span className={`status ${order.status}`}>{order.status}</span>

              <span onClick={(e) => e.stopPropagation()} className="actions">
                <TextField
                  select
                  value={order.status}
                  disabled={updatingId === order._id}
                  options={STATUSES.map((s) => ({
                    label: s.charAt(0).toUpperCase() + s.slice(1),
                    value: s,
                  }))}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="width"
                />

                <button
                  className="deliver"
                  onClick={() => openInMaps(order.deliveryAddress)}
                >
                  deliver
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
