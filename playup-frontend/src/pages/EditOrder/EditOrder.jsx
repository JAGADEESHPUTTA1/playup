import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import TextField from "../../components/TextField/TextField";
import "./EditOrder.css";
import { useAuth } from "../../Context/AuthContext";
import { useToast } from "../../components/Toast/ToastContext";

export default function EditOrder() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    consoleType: "PS5",
    rentalStartDate: "",
    rentalEndDate: "",
    hours: "",
    noOfControllers: 1,
    gamesList: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        const o = res.data.data;

        // 🔒 Block edit if payment done (non-admin)
        if (o.paymentStatus !== "pending" && user.role !== "admin") {
          showToast("This order can’t be edited after payment.", "error");
          navigate(`/orders/${orderId}`);
          return;
        }

        setForm({
          consoleType: o.consoleType,
          rentalStartDate: o.rentalStartDate?.split("T")[0],
          rentalEndDate: o.rentalEndDate?.split("T")[0],
          hours: o.hours || "",
          noOfControllers: o.noOfControllers,
          gamesList: o.gamesList || "",
        });
      } catch (error) {
        showToast(
          error?.response?.data?.message ||
            "Unable to load order details. Please try again.",
          "error"
        );
        navigate("/my-orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate, user.role, showToast]);

  const formHandler = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await api.patch(`/orders/${orderId}/edit`, form);

      showToast("Order updated successfully.", "success");

      if (user.role === "admin") {
        navigate(`/admin/orders/${orderId}`);
      } else {
        navigate("/payment");
      }
    } catch (error) {
      showToast(
        error?.response?.data?.message ||
          "Failed to update order. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading order..." />;

  return (
    <div className="edit-order-wrapper">
      <div className="edit-order-card">
        <h2>Edit Order</h2>

        {/* Console Type */}
        <TextField
          labelName="Console Type"
          select
          value={form.consoleType}
          options={[
            { label: "PS4", value: "PS4" },
            { label: "PS5", value: "PS5" },
          ]}
          onChange={(e) => formHandler("consoleType", e.target.value)}
        />

        {/* Controllers */}
        <TextField
          labelName="No. Of Controllers"
          select
          value={form.noOfControllers}
          options={[1, 2, 3, 4, 5].map((n) => ({
            label: `${n} Controller${n > 1 ? "s" : ""}`,
            value: n,
          }))}
          onChange={(e) => formHandler("noOfControllers", e.target.value)}
        />

        {/* Start Date */}
        <TextField
          labelName="Start Date"
          type="date"
          value={form.rentalStartDate}
          onChange={(e) => formHandler("rentalStartDate", e.target.value)}
        />

        {/* End Date */}
        <TextField
          labelName="End Date"
          type="date"
          min={form.rentalStartDate}
          value={form.rentalEndDate}
          onChange={(e) => formHandler("rentalEndDate", e.target.value)}
        />

        {/* Hours (same-day only) */}
        {form.rentalStartDate === form.rentalEndDate &&
          form.rentalStartDate && (
            <TextField
              labelName="How Many Hours"
              select
              value={form.hours}
              options={[
                { label: "--select", value: "" },
                { label: "3 Hours", value: "3" },
                { label: "6 Hours", value: "6" },
                { label: "9 Hours", value: "9" },
              ]}
              onChange={(e) => formHandler("hours", e.target.value)}
            />
          )}

        {/* Games */}
        <TextField
          labelName="Games You Want (2 Free Included)"
          textarea
          value={form.gamesList}
          onChange={(e) => formHandler("gamesList", e.target.value)}
        />

        {/* Actions */}
        <div className="edit-actions">
          <button
            className="btn-secondary"
            onClick={() => navigate(`/orders/${orderId}`)}
          >
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
