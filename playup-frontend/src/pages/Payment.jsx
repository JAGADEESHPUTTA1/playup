import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Payment() {
  const navigate = useNavigate()
  const payNow = async () => {
    const orderId = localStorage.getItem("orderId");
    const amount = localStorage.getItem("amount");

    if (!orderId) {
      alert("No order found");
      return;
    }

    const paymentOrder = await api.post("/payments/create", {
      amount
    });

    const options = {
      key: "rzp_test_RvcG219crQd0Y5", // replace later
      amount: paymentOrder.data.amount,
      currency: "INR",
      order_id: paymentOrder.data.id,
      handler: async function (response) {
        await api.post("/payments/verify", {
          ...response,
          orderId
        });
        navigate("/success");
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Payment</h2>
      <p>Total Amount: ₹{localStorage.getItem("amount")}</p>
      <button onClick={payNow}>Pay Now</button>
    </div>
  );
}
