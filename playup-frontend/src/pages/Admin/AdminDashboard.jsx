import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import "./AdminDashboard.css";
import { useToast } from "../../components/Toast/ToastContext";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);

        // 🔒 Session / auth issue
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          showToast("Session expired. Please login again.", "error");
          navigate("/");
          return;
        }

        // ❌ Generic failure
        showToast(
          error?.response?.data?.message ||
            "Unable to load dashboard data. Please try again.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate, showToast]);

  if (loading) {
    return <Loader text="Loading dashboard..." />;
  }

  if (!stats) return null;

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      <div className="stats-grid">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          onClick={() => navigate("/admin/orders")}
        />

        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          onClick={() => navigate("/admin/orders?status=pending")}
        />

        <StatCard
          title="Active Rentals"
          value={stats.activeOrders}
          onClick={() => navigate("/admin/orders?status=active")}
        />

        <StatCard
          title="Returned Orders"
          value={stats.returnedOrders}
          onClick={() => navigate("/admin/orders?status=returned")}
        />
      </div>

      <div className="dashboard-actions">
        <button
          className="primary-btn"
          onClick={() => navigate("/admin/orders")}
        >
          Manage Orders
        </button>
      </div>
    </div>
  );
}

function StatCard({ title, value, onClick }) {
  return (
    <div className="stat-card" onClick={onClick}>
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
}
